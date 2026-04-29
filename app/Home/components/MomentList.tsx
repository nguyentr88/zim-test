import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Text,
    ViewToken,
    AccessibilityInfo,
} from 'react-native';
import { DIMENSION } from '@/constant';
import { vs } from '@/constant/style';
import MomentItem from './MomentItem';

const { width } = DIMENSION;
const ITEM_WIDTH = width * 0.75;
const ITEM_SPACING = (width - ITEM_WIDTH) / 2;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + 20;

interface MomentListProps {
    momentsData: any[];
}

const MomentList = ({ momentsData }: MomentListProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isListScrollEnabled, setIsListScrollEnabled] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }, []);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
    }).current;

    return (
        <View style={styles.container}>
            <View style={styles.headerText}>
                <Text style={styles.title}>6617 khoảnh khắc đáng nhớ</Text>
                <Text style={styles.content}>
                    Hàng ngàn khoảnh khắc đáng nhớ ghi lại hành trình học tập tại ZIM trên toàn quốc.
                </Text>
            </View>

            <Animated.FlatList
                data={momentsData}
                horizontal
                scrollEnabled={isListScrollEnabled}
                keyExtractor={(item) => item.id.toString()}
                snapToInterval={ITEM_TOTAL_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: ITEM_SPACING - 10 }}
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
                renderItem={({ item, index }) => {
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

                    return (
                        <Animated.View
                            style={{
                                width: ITEM_TOTAL_WIDTH,
                                transform: [{ scale }],
                                opacity,
                            }}
                        >
                            <MomentItem
                                momentItem={item}
                                isActive={index === activeIndex}
                                onSeeking={(seeking) => setIsListScrollEnabled(!seeking)}
                                scrollX={scrollX}
                                index={index}
                            />
                        </Animated.View>
                    );
                }}
            />
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
});

export default MomentList;