import { DIMENSION } from '@/constant';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

const ITEM_WIDTH = DIMENSION.width * 0.75;
const CARD_HEIGHT = DIMENSION.height * 0.6;
const MAX_TILT = 8;
const VIDEO_UNMOUNT_DELAY = 800;
const LONG_PRESS_DELAY = 350;
const DOUBLE_TAP_DELAY = 300;
const MOVE_THRESHOLD = 8;
const LEFT_ZONE = 0.33;
const RIGHT_ZONE = 0.67;
const SEEK_BAR_HEIGHT = 70;

interface Props {
  momentItem: any;
  isActive: boolean;
  onSeeking: (seeking: boolean) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  scrollX: Animated.Value;
  index: number;
  reduceMotion: boolean;
}

const MomentItem = ({ momentItem, isActive, onSeeking, onNavigate, scrollX, index, reduceMotion }: Props) => {
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tempProgress, setTempProgress] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const muteBtnScale = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  const barRef = useRef<View>(null);
  const barLayout = useRef({ x: 0, width: 0 });
  const isSeekingRef = useRef(false);
  const isMounted = useRef(true);
  const isPlayingRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const playerRef = useRef<any>(null);
  const onSeekingRef = useRef(onSeeking);
  const onNavigateRef = useRef(onNavigate);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef(0);

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActiveRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchMovedRef = useRef(false);
  const isExpandedRef = useRef(isExpanded);

  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
  useEffect(() => { onSeekingRef.current = onSeeking; }, [onSeeking]);
  useEffect(() => { onNavigateRef.current = onNavigate; }, [onNavigate]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isExpandedRef.current = isExpanded; }, [isExpanded]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    Animated.timing(overlayAnim, {
      toValue: isActive ? 1 : 0,
      duration: reduceMotion ? 0 : 300,
      useNativeDriver: true,
    }).start();
    if (!isActive) setIsExpanded(false);
  }, [isActive, reduceMotion]);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: reduceMotion ? 0 : 220,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, reduceMotion]);

  useEffect(() => {
    if (isActive) {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      setVideoMounted(true);
    } else {
      if (!reduceMotion) {
        Animated.spring(tiltX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }).start();
        Animated.spring(tiltY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }).start();
      }
      unmountTimerRef.current = setTimeout(() => {
        if (isMounted.current) {
          setVideoMounted(false);
          setProgress(0);
          setIsPlaying(false);
        }
      }, VIDEO_UNMOUNT_DELAY);
    }
    return () => {
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, [isActive]);

  const player = useVideoPlayer(videoMounted ? momentItem?.videoURL : null, (p) => {
    p.loop = true;
    p.muted = isMuted;
    p.timeUpdateEventInterval = 0.5;
  });

  useEffect(() => { playerRef.current = player; }, [player]);

  useEffect(() => {
    if (!player || !videoMounted) return;
    isActive ? player.play() : player.pause();
  }, [isActive, player, videoMounted]);

  useEffect(() => {
    if (!player) return;
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (!player || !videoMounted) return;
    const subs = [
      player.addListener('playingChange', (e: any) => {
        if (isMounted.current) {
          setIsPlaying(e.isPlaying);
          isPlayingRef.current = e.isPlaying;
        }
      }),
      player.addListener('timeUpdate', (e: any) => {
        if (isMounted.current && !isSeekingRef.current && player.duration > 0) {
          const ratio = e.currentTime / player.duration;
          if (isFinite(ratio)) setProgress(Math.max(0, Math.min(1, ratio)));
        }
      }),
    ];
    return () => subs.forEach((s: any) => s.remove());
  }, [player, videoMounted]);

  const resetTilt = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(tiltX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }).start();
    Animated.spring(tiltY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 8 }).start();
  }, [reduceMotion, tiltX, tiltY]);

  const stopFastForward = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try { p.playbackRate = 1; } catch { }
  }, []);

  const handleTouchStart = useCallback((e: GestureResponderEvent) => {
    touchStartXRef.current = e.nativeEvent.locationX;
    touchStartYRef.current = e.nativeEvent.locationY;
    touchMovedRef.current = false;
    isLongPressActiveRef.current = false;

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (!touchMovedRef.current && !isSeekingRef.current) {
        isLongPressActiveRef.current = true;
        const p = playerRef.current;
        if (p) try { p.playbackRate = 2; } catch { }
      }
    }, LONG_PRESS_DELAY);
  }, []);

  const handleTouchMove = useCallback((e: GestureResponderEvent) => {
    const dx = Math.abs(e.nativeEvent.locationX - touchStartXRef.current);
    const dy = Math.abs(e.nativeEvent.locationY - touchStartYRef.current);
    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
      touchMovedRef.current = true;
      if (longPressTimerRef.current && !isLongPressActiveRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    if (!isActive || reduceMotion || isSeekingRef.current) return;
    const nx = (e.nativeEvent.locationX / ITEM_WIDTH - 0.5) * 2;
    const ny = (e.nativeEvent.locationY / CARD_HEIGHT - 0.5) * 2;
    Animated.spring(tiltX, { toValue: nx * MAX_TILT, useNativeDriver: true, tension: 120, friction: 10 }).start();
    Animated.spring(tiltY, { toValue: -ny * MAX_TILT, useNativeDriver: true, tension: 120, friction: 10 }).start();
  }, [isActive, reduceMotion, tiltX, tiltY]);

  const handleTouchEnd = useCallback((_e: GestureResponderEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    resetTilt();

    if (isLongPressActiveRef.current) {
      isLongPressActiveRef.current = false;
      stopFastForward();
      return;
    }

    if (!isActive || touchMovedRef.current || isSeekingRef.current) return;

    const touchY = touchStartYRef.current;
    if (!isExpandedRef.current && touchY > CARD_HEIGHT - SEEK_BAR_HEIGHT) return;

    const now = Date.now();
    const isDoubleTap = now - lastTapRef.current < DOUBLE_TAP_DELAY;
    lastTapRef.current = now;

    if (isDoubleTap) {
      onNavigateRef.current('prev');
      return;
    }

    const ratio = touchStartXRef.current / ITEM_WIDTH;
    if (ratio < LEFT_ZONE) {
      onNavigateRef.current('prev');
    } else if (ratio > RIGHT_ZONE) {
      onNavigateRef.current('next');
    } else {
      const p = playerRef.current;
      if (p) isPlayingRef.current ? p.pause() : p.play();
    }
  }, [isActive, resetTilt, stopFastForward]);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPressActiveRef.current) {
      isLongPressActiveRef.current = false;
      stopFastForward();
    }
    resetTilt();
  }, [resetTilt, stopFastForward]);

  const handleMutePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(muteBtnScale, { toValue: 0.8, duration: 80, useNativeDriver: true }),
      Animated.spring(muteBtnScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
    ]).start();
    setIsMuted((prev) => !prev);
  }, []);

  const handleContentPress = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const updateSeekUI = (pageX: number) => {
    if (barLayout.current.width <= 0) return 0;
    const ratio = Math.max(0, Math.min(1, (pageX - barLayout.current.x) / barLayout.current.width));
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
      onPanResponderMove: (evt) => updateSeekUI(evt.nativeEvent.pageX),
      onPanResponderRelease: (evt) => {
        const ratio = updateSeekUI(evt.nativeEvent.pageX);
        const p = playerRef.current;
        if (!p || p.duration <= 0 || !isFinite(p.duration)) { cleanupSeeking(); return; }
        try {
          const targetTime = ratio * p.duration;
          const wasPlaying = isPlayingRef.current;
          p.pause();
          setProgress(ratio);
          setTimeout(() => {
            try { p.currentTime = targetTime; } catch (e) { console.warn('currentTime error:', e); }
            setTimeout(() => {
              if (wasPlaying && isActiveRef.current) {
                try { p.play(); } catch (e) { console.warn('play error:', e); }
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
    outputRange: reduceMotion ? [0, 0, 0] : [-40, 0, 40],
    extrapolate: 'clamp',
  });

  const tiltXDeg = tiltX.interpolate({ inputRange: [-MAX_TILT, MAX_TILT], outputRange: [`-${MAX_TILT}deg`, `${MAX_TILT}deg`] });
  const tiltYDeg = tiltY.interpolate({ inputRange: [-MAX_TILT, MAX_TILT], outputRange: [`-${MAX_TILT}deg`, `${MAX_TILT}deg`] });

  const contentTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [reduceMotion ? 0 : 6, 0],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        !reduceMotion && {
          transform: [{ perspective: 800 }, { rotateY: tiltXDeg }, { rotateX: tiltYDeg }],
        },
      ]}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <Animated.Image
        source={{ uri: momentItem?.thumbnailURL }}
        style={[
          styles.thumbnailBackground,
          { transform: [{ translateX: reduceMotion ? 0 : parallaxTranslate }, { scale: 1.15 }] },
        ]}
        fadeDuration={200}
      />

      {videoMounted && (
        <VideoView
          style={styles.videoOverlay}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      <Animated.View style={[styles.revealOverlay, { opacity: overlayAnim }]} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContentPress}
          style={styles.contentTouchable}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? 'Thu gọn nội dung' : 'Xem thêm nội dung'}
        >
          <View style={styles.contentHeader}>
            <Text style={styles.titleText} numberOfLines={isExpanded ? undefined : 1}>
              {momentItem?.title ?? ''}
            </Text>
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-up'}
              size={13}
              color="rgba(255,255,255,0.6)"
            />
          </View>
          <Animated.Text
            style={[styles.captionText, { transform: [{ translateY: contentTranslateY }] }]}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {momentItem?.content ?? ''}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {isActive && (
        <View style={styles.uiOverlay} pointerEvents="box-none">
          <Animated.View style={[styles.muteBtn, { transform: [{ scale: muteBtnScale }] }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMutePress}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {!isPlaying && player?.status === 'readyToPlay' && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.playBtn}
              onPress={() => player.play()}
              accessibilityRole="button"
              accessibilityLabel="Phát video"
            >
              <Ionicons name="play" size={55} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          )}

          {!isExpanded && (
            <View style={styles.seekBarWrapper} pointerEvents="box-none">
              <View
                ref={barRef}
                style={styles.seekBarTrack}
                {...seekPanResponder.panHandlers}
                accessibilityRole="adjustable"
                accessibilityLabel="Thanh tua video"
              >
                <View style={styles.trackBg} pointerEvents="none" />
                <View style={[styles.trackFill, { width: `${(tempProgress ?? progress) * 100}%` }]} pointerEvents="none" />
                <View style={[styles.thumb, { left: `${(tempProgress ?? progress) * 100}%` }]} pointerEvents="none" />
              </View>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 24,
    overflow: 'hidden',
  },
  thumbnailBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1,
  },
  revealOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 2,
  },
  contentTouchable: {
    paddingHorizontal: 14,
    paddingTop: 36,
    paddingBottom: 72,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 3,
  },
  titleText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 16,
  },
  captionText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
  uiOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 3,
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
    bottom: 6,
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