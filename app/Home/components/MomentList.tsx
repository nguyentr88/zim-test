import { DIMENSION } from '@/constant';
import { vs } from '@/constant/style';
import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Animated, Text, ViewToken } from 'react-native';
import { MomentItem } from '.';

const { width } = DIMENSION;

const ITEM_WIDTH = width * 0.75;

const ITEM_SPACING = (width - ITEM_WIDTH) / 2;

interface MomentListProps {
    momentsData: any[];
}

const MomentList = ({ momentsData }: MomentListProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    const [activeIndex, setActiveIndex] = useState(0);

    const [isListScrollEnabled, setIsListScrollEnabled] = useState(true);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerText}>
                <Text style={styles.title}>6617 khoảnh khắc đáng nhớ</Text>

                <Text style={styles.content}>
                    Hàng ngàn khoảnh khắc đáng nhớ về hành trình học tập thú vị luôn được ZIM ghi lại mỗi ngày tại 21
                    trung tâm Anh Ngữ ZIM trên toàn quốc.
                </Text>
            </View>

            <Animated.FlatList
                data={momentsData}
                horizontal
                scrollEnabled={isListScrollEnabled}
                keyExtractor={(item) => item.id.toString()}
                snapToInterval={ITEM_WIDTH}
                decelerationRate='fast'
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],

                    { useNativeDriver: true }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                scrollEventThrottle={16}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={5}
                removeClippedSubviews={false}
                renderItem={({ item, index }) => {
                    const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];

                    const scale = scrollX.interpolate({
                        inputRange,

                        outputRange: [0.9, 1, 0.9],

                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View style={{ width: ITEM_WIDTH, transform: [{ scale }] }}>
                            <MomentItem
                                momentItem={item}
                                isActive={index === activeIndex}
                                onSeeking={(seeking) => setIsListScrollEnabled(!seeking)}
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
        paddingVertical: vs(20)
    },

    headerText: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: vs(20)
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',

        textAlign: 'center',

        marginBottom: 8
    },

    content: {
        fontSize: 14,

        fontWeight: '400',

        color: '#cccccc',

        textAlign: 'center',

        lineHeight: 20
    }
});

export default MomentList;
