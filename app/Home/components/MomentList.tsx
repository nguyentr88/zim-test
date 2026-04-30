import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Text,
    ViewToken,
    AccessibilityInfo,
    Platform,
} from 'react-native';
import { DIMENSION } from '@/constant';
import { vs } from '@/constant/style';
import MomentItem from './MomentItem';

const { width } = DIMENSION;
const ITEM_WIDTH = width * 0.75;
const ITEM_MARGIN = 10;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const SIDE_PADDING = (width - ITEM_TOTAL_WIDTH) / 2;

interface MomentListProps {
    momentsData: any[];
}

const MomentList = ({ momentsData }: MomentListProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    const [isListScrollEnabled, setIsListScrollEnabled] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
        const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
        return () => sub.remove();
    }, []);

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                const idx = viewableItems[0].index ?? 0;
                setActiveIndex(idx);
                activeIndexRef.current = idx;
            }
        }
    ).current;

    const handleSeeking = useCallback((seeking: boolean) => {
        setIsListScrollEnabled(!seeking);
    }, []);

    const handleNavigate = useCallback(
        (direction: 'prev' | 'next') => {
            const current = activeIndexRef.current;
            const next = direction === 'prev' ? current - 1 : current + 1;
            if (next < 0 || next >= momentsData.length) return;
            flatListRef.current?.scrollToOffset({ offset: next * ITEM_TOTAL_WIDTH, animated: true });
            setActiveIndex(next);
            activeIndexRef.current = next;
        },
        [momentsData.length]
    );

    const renderItem = useCallback(
        ({ item, index }: { item: any; index: number }) => {
            const inputRange = [
                (index - 1) * ITEM_TOTAL_WIDTH,
                index * ITEM_TOTAL_WIDTH,
                (index + 1) * ITEM_TOTAL_WIDTH,
            ];

            const scale = scrollX.interpolate({
                inputRange,
                outputRange: reduceMotion ? [1, 1, 1] : [0.92, 1, 0.92],
                extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: 'clamp',
            });

            const translateY = scrollX.interpolate({
                inputRange,
                outputRange: reduceMotion ? [0, 0, 0] : [10, 0, 10],
                extrapolate: 'clamp',
            });

            return (
                <Animated.View
                    style={{
                        width: ITEM_TOTAL_WIDTH,
                        alignItems: 'center',
                        transform: [{ scale }, { translateY }],
                        opacity,
                    }}
                >
                    <MomentItem
                        momentItem={item}
                        isActive={index === activeIndex}
                        onSeeking={handleSeeking}
                        onNavigate={handleNavigate}
                        scrollX={scrollX}
                        index={index}
                        reduceMotion={reduceMotion}
                    />
                </Animated.View>
            );
        },
        [activeIndex, reduceMotion, scrollX, handleSeeking, handleNavigate]
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerText}>
                <Text style={styles.title} accessibilityRole="header">
                    6617 khoảnh khắc đáng nhớ
                </Text>
                <Text style={styles.content}>
                    Hàng ngàn khoảnh khắc đáng nhớ ghi lại hành trình học tập tại ZIM trên toàn quốc.
                </Text>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={momentsData}
                horizontal
                scrollEnabled={isListScrollEnabled}
                keyExtractor={(item) => item.id.toString()}
                snapToInterval={ITEM_TOTAL_WIDTH}
                decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEventThrottle={16}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                accessibilityRole="list"
                accessibilityLabel="Danh sách khoảnh khắc"
                renderItem={renderItem}
            />

            <View style={styles.dotRow} accessibilityRole="tablist">
                {momentsData.map((_, i) => {
                    const dotOpacity = scrollX.interpolate({
                        inputRange: [
                            (i - 1) * ITEM_TOTAL_WIDTH,
                            i * ITEM_TOTAL_WIDTH,
                            (i + 1) * ITEM_TOTAL_WIDTH,
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    const dotScale = scrollX.interpolate({
                        inputRange: [
                            (i - 1) * ITEM_TOTAL_WIDTH,
                            i * ITEM_TOTAL_WIDTH,
                            (i + 1) * ITEM_TOTAL_WIDTH,
                        ],
                        outputRange: reduceMotion ? [1, 1, 1] : [0.7, 1.3, 0.7],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View
                            key={i}
                            style={[styles.dot, { opacity: dotOpacity, transform: [{ scale: dotScale }] }]}
                            accessibilityRole="tab"
                            accessibilityLabel={`Khoảnh khắc ${i + 1}`}
                            accessibilityState={{ selected: i === activeIndex }}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: vs(20),
        backgroundColor: '#000',
    },
    headerText: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: vs(20),
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        fontWeight: '400',
        color: '#cccccc',
        textAlign: 'center',
        lineHeight: 20,
    },
    dotRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(14),
        gap: 6,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});

export default MomentList;