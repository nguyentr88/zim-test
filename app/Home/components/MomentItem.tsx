import { DIMENSION } from '@/constant';
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

const ITEM_WIDTH = DIMENSION.width * 0.75;
const CARD_HEIGHT = DIMENSION.height * 0.6;

interface Props {
  momentItem: any;
  isActive: boolean;
  onSeeking: (seeking: boolean) => void;
  scrollX: Animated.Value;
  index: number;
}

const MomentItem = ({ momentItem, isActive, onSeeking, scrollX, index }: Props) => {
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tempProgress, setTempProgress] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);

  const barRef = useRef<View>(null);
  const barLayout = useRef({ x: 0, width: 0 });
  const isSeekingRef = useRef(false);
  const isMounted = useRef(true);
  const isPlayingRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const playerRef = useRef<any>(null);
  const onSeekingRef = useRef(onSeeking);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    onSeekingRef.current = onSeeking;
  }, [onSeeking]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMounted.current = true;
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      setVideoMounted(true);
    } else {
      unmountTimerRef.current = setTimeout(() => {
        if (isMounted.current) {
          setVideoMounted(false);
          setProgress(0);
          setIsPlaying(false);
        }
      }, 800);
    }

    return () => {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
      }
    };
  }, [isActive]);

  const player = useVideoPlayer(videoMounted ? momentItem?.videoURL : null, (p) => {
    p.loop = true;
    p.muted = isMuted;
    p.timeUpdateEventInterval = 0.5;
  });

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    if (!player || !videoMounted) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player, videoMounted]);

  useEffect(() => {
    if (!player) return;
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (!player || !videoMounted) return;

    const subscriptions = [
      player.addListener('playingChange', (event: any) => {
        if (isMounted.current) {
          setIsPlaying(event.isPlaying);
          isPlayingRef.current = event.isPlaying;
        }
      }),
      player.addListener('timeUpdate', (event: any) => {
        if (isMounted.current && !isSeekingRef.current && player.duration > 0) {
          const p = event.currentTime / player.duration;
          if (!isNaN(p) && isFinite(p)) {
            setProgress(Math.max(0, Math.min(1, p)));
          }
        }
      }),
    ];

    return () => {
      subscriptions.forEach((sub: any) => sub.remove());
    };
  }, [player, videoMounted]);

  const updateSeekUI = (pageX: number) => {
    if (barLayout.current.width <= 0) return 0;
    const relativeX = pageX - barLayout.current.x;
    const ratio = Math.max(0, Math.min(1, relativeX / barLayout.current.width));
    setTempProgress(ratio);
    return ratio;
  };

  const cleanupSeeking = () => {
    setTempProgress(null);
    setTimeout(() => {
      isSeekingRef.current = false;
      onSeekingRef.current(false);
    }, 100);
  };

  const seekPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        isSeekingRef.current = true;
        onSeekingRef.current(true);

        barRef.current?.measureInWindow((x, _, width) => {
          barLayout.current = { x, width };
          updateSeekUI(evt.nativeEvent.pageX);
        });
      },

      onPanResponderMove: (evt) => {
        updateSeekUI(evt.nativeEvent.pageX);
      },

      onPanResponderRelease: (evt) => {
        const ratio = updateSeekUI(evt.nativeEvent.pageX);
        const p = playerRef.current;

        if (!p || p.duration <= 0 || !isFinite(p.duration)) {
          cleanupSeeking();
          return;
        }

        try {
          const targetTime = ratio * p.duration;
          const wasPlaying = isPlayingRef.current;

          p.pause();
          setProgress(ratio);

          setTimeout(() => {
            try {
              p.currentTime = targetTime;
            } catch (e) {
              console.warn('Set currentTime error:', e);
            }

            setTimeout(() => {
              if (wasPlaying && isActiveRef.current) {
                try {
                  p.play();
                } catch (e) {
                  console.warn('Play after seek error:', e);
                }
              }
              cleanupSeeking();
            }, 100);
          }, 50);
        } catch (e) {
          console.warn('Seek error:', e);
          cleanupSeeking();
        }
      },

      onPanResponderTerminate: cleanupSeeking,
    })
  ).current;

  const parallaxTranslate = scrollX.interpolate({
    inputRange: [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
    outputRange: reduceMotion ? [0, 0, 0] : [-50, 0, 50],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.card}>
      <Animated.Image
        source={{ uri: momentItem?.thumbnailURL }}
        style={[
          styles.thumbnailBackground,
          {
            transform: [
              { translateX: reduceMotion ? 0 : parallaxTranslate },
              { scale: 1.15 },
            ],
          },
        ]}
      />

      {videoMounted && (
        <VideoView
          style={styles.videoOverlay}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {isActive && (
        <View style={styles.uiOverlay} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.muteBtn}
            onPress={() => setIsMuted((prev) => !prev)}
          >
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          {!isPlaying && player?.status === 'readyToPlay' && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.playBtn}
              onPress={() => player.play()}
            >
              <Ionicons name="play" size={55} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          )}

          <View style={styles.seekBarWrapper} pointerEvents="box-none">
            <View
              ref={barRef}
              style={styles.seekBarTrack}
              {...seekPanResponder.panHandlers}
            >
              <View style={styles.trackBg} pointerEvents="none" />
              <View
                style={[
                  styles.trackFill,
                  { width: `${(tempProgress ?? progress) * 100}%` },
                ]}
                pointerEvents="none"
              />
              <View
                style={[
                  styles.thumb,
                  { left: `${(tempProgress ?? progress) * 100}%` },
                ]}
                pointerEvents="none"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  thumbnailBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  uiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  muteBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  playBtn: {
    position: 'absolute',
    top: '45%',
    left: '42%',
  },
  seekBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  seekBarTrack: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  trackBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  trackFill: {
    height: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginLeft: -8,
  },
});

export default MomentItem;