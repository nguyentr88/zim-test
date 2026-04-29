import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DIMENSION } from '@/constant';

const { width, height } = DIMENSION;
const VIDEO_WIDTH = width * 0.8;
const VIDEO_HEIGHT = height * 0.7;
const THUMB_SIZE = 14;
const TRACK_HEIGHT = 4;

const MomentItem = ({ momentItem }: { momentItem: any }) => {
  const player = useVideoPlayer(momentItem?.videoURL, (p) => {
    p.loop = true;
    p.play();
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const barWidthRef = useRef(0);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (isSeekingRef.current) return;
      const dur = player.duration;
      if (dur > 0) setProgress(player.currentTime / dur);
      setIsPlaying(player.playing);
    }, 150);
    return () => clearInterval(id);
  }, [player]);

  const updateProgress = (locationX: number) => {
    const ratio = Math.min(Math.max(locationX / barWidthRef.current, 0), 1);
    setProgress(ratio);
    return ratio;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        isSeekingRef.current = true;
        updateProgress(e.nativeEvent.locationX);
      },
      onPanResponderMove: (e) => {
        updateProgress(e.nativeEvent.locationX);
      },
      onPanResponderRelease: (e) => {
        const ratio = updateProgress(e.nativeEvent.locationX);
        if (player.duration > 0) {
          player.currentTime = ratio * player.duration;
        }
        setTimeout(() => { isSeekingRef.current = false; }, 150);
      },
      onPanResponderTerminate: () => { isSeekingRef.current = false; },
    })
  ).current;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />

        <TouchableOpacity 
          style={styles.playBtn} 
          onPress={() => player.playing ? player.pause() : player.play()}
          activeOpacity={0.7}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={44} color="#fff" />
        </TouchableOpacity>

        <View style={styles.seekBarWrapper}>
          <View
            style={styles.seekBarTrack}
            onLayout={(e) => (barWidthRef.current = e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}
          >
            <View style={styles.trackBackground} pointerEvents="none" />
            <View 
              style={[styles.seekBarFill, { width: `${progress * 100}%` }]} 
              pointerEvents="none" 
            />
            <View 
              style={[styles.thumb, { left: `${progress * 100}%` }]} 
              pointerEvents="none" 
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default MomentItem;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 50,
  },
  videoContainer: {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    zIndex: 10,
  },
  seekBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  seekBarTrack: {
    height: 20,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: TRACK_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    width: '100%',
  },
  seekBarFill: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 2,
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    marginLeft: -(THUMB_SIZE / 2),
  },
  contentArea: {
    width: VIDEO_WIDTH,
    marginTop: 20,
  }
});