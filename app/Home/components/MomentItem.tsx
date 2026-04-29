import { DIMENSION } from '@/constant';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder, Image } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

const ITEM_WIDTH = DIMENSION.width * 0.75;

const CARD_HEIGHT = DIMENSION.height * 0.6;

interface Props {
	momentItem: any;

	isActive: boolean;

	onSeeking: (seeking: boolean) => void;
}

const MomentItem = ({ momentItem, isActive, onSeeking }: Props) => {
	const [isMuted, setIsMuted] = useState(false);

	const [progress, setProgress] = useState(0);

	const [tempProgress, setTempProgress] = useState<number | null>(null);

	const [isPlaying, setIsPlaying] = useState(false);

	const barRef = useRef<View>(null);

	const barLayout = useRef({ x: 0, width: 0 });

	const isSeekingRef = useRef(false);

	const player = useVideoPlayer(isActive ? momentItem?.videoURL : null, (p) => {
		p.loop = true;

		p.muted = isMuted;

		p.play();
	});

	const updateSeek = (pageX: number) => {
		if (barLayout.current.width > 0) {
			const relativeX = pageX - barLayout.current.x;

			const ratio = Math.min(Math.max(relativeX / barLayout.current.width, 0), 1);

			setTempProgress(ratio);

			return ratio;
		}

		return 0;
	};

	const seekPanResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,

				onMoveShouldSetPanResponder: () => true,

				onPanResponderGrant: (evt, gestureState) => {
					isSeekingRef.current = true;

					onSeeking(true);

					barRef.current?.measureInWindow((x, y, width) => {
						barLayout.current = { x, width };

						updateSeek(gestureState.x0);
					});
				},

				onPanResponderMove: (evt, gestureState) => {
					updateSeek(gestureState.moveX);
				},

				onPanResponderRelease: (evt, gestureState) => {
					const ratio = updateSeek(gestureState.moveX);

					if (player && isActive && player.duration > 0) {
						player.currentTime = ratio * player.duration;

						setProgress(ratio);
					}

					setTempProgress(null);

					setTimeout(() => {
						isSeekingRef.current = false;

						onSeeking(false);
					}, 200);
				},

				onPanResponderTerminate: () => {
					setTempProgress(null);

					isSeekingRef.current = false;

					onSeeking(false);
				}
			}),
		[player, isActive, onSeeking]
	);

	useEffect(() => {
		if (!isActive || !player) return;

		const id = setInterval(() => {
			if (!isSeekingRef.current && player.duration > 0) {
				setProgress(player.currentTime / player.duration);

				setIsPlaying(player.playing);
			}
		}, 500);

		return () => clearInterval(id);
	}, [player, isActive]);

	return (
		<View style={styles.card}>
			<Image
				source={{ uri: momentItem?.thumbnailURL }}
				style={styles.thumbnailBackground}
				resizeMode='cover'
			/>

			{isActive && player && (
				<VideoView
					style={styles.videoOverlay}
					player={player}
					contentFit='cover'
					nativeControls={false}
				/>
			)}

			{isActive && (
				<View
					style={styles.uiOverlay}
					pointerEvents='box-none'>
					<TouchableOpacity
						style={styles.muteBtn}
						onPress={() => setIsMuted(!isMuted)}>
						<Ionicons
							name={isMuted ? 'volume-mute' : 'volume-high'}
							size={20}
							color='#fff'
						/>
					</TouchableOpacity>

					{!isPlaying && (
						<TouchableOpacity
							style={styles.playBtn}
							onPress={() => player?.play()}>
							<Ionicons
								name='play'
								size={55}
								color='rgba(255,255,255,0.9)'
							/>
						</TouchableOpacity>
					)}

					<View
						style={styles.seekBarWrapper}
						pointerEvents='box-none'>
						<View
							ref={barRef}
							style={styles.seekBarTrack}
							{...seekPanResponder.panHandlers}>
							<View
								style={styles.trackBg}
								pointerEvents='none'
							/>

							<View
								style={[styles.trackFill, { width: `${(tempProgress ?? progress) * 100}%` }]}
								pointerEvents='none'
							/>

							<View
								style={[styles.thumb, { left: `${(tempProgress ?? progress) * 100}%` }]}
								pointerEvents='none'
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

		marginHorizontal: 10
	},

	thumbnailBackground: { ...StyleSheet.absoluteFillObject },

	videoOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },

	uiOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 2 },

	muteBtn: {
		position: 'absolute',

		top: 15,

		left: 15,

		backgroundColor: 'rgba(0,0,0,0.5)',

		padding: 10,

		borderRadius: 25
	},

	playBtn: {
		position: 'absolute',

		top: '45%',

		left: '42%'
	},

	seekBarWrapper: {
		position: 'absolute',

		bottom: 0,

		width: '100%',

		height: 60,

		paddingHorizontal: 20,

		justifyContent: 'center'
	},

	seekBarTrack: {
		height: 40,

		width: '100%',

		justifyContent: 'center',

		backgroundColor: 'transparent'
	},

	trackBg: {
		height: 6,

		backgroundColor: 'rgba(255,255,255,0.3)',

		borderRadius: 3
	},

	trackFill: {
		height: 6,

		backgroundColor: '#fff',

		position: 'absolute',

		borderRadius: 3
	},

	thumb: {
		position: 'absolute',

		width: 18,

		height: 18,

		borderRadius: 9,

		backgroundColor: '#fff',

		marginLeft: -9
	}
});

export default MomentItem;
