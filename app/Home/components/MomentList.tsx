import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Animated,
    useWindowDimensions,
    Text
} from 'react-native';
import { DIMENSION } from '@/constant';
import { MomentItem } from '.';
import { vs } from '@/constant/style';

const { width } = DIMENSION;

const ITEM_WIDTH = width * 0.8;
const ITEM_SPACING = (width - ITEM_WIDTH) / 2;

interface MomentListProps {
    momentsData: any;
}

const MomentList = ({ momentsData }: MomentListProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const totalWidth = momentsData.length * ITEM_WIDTH;

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: true,
            listener: (event: any) => {
                const offsetX = event.nativeEvent.contentOffset.x;

                // Nếu vuốt quá cuối danh sách (tính cả padding)
                if (offsetX >= totalWidth + ITEM_SPACING) {
                    flatListRef.current?.scrollToOffset({
                        offset: offsetX - totalWidth,
                        animated: false,
                    });
                }
                // Nếu vuốt ngược quá đầu danh sách
                else if (offsetX <= ITEM_SPACING - ITEM_WIDTH) {
                    flatListRef.current?.scrollToOffset({
                        offset: offsetX + totalWidth,
                        animated: false,
                    });
                }
            }
        }
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>6617 khoảnh khắc đáng nhớ</Text>
            <Text style={styles.content}>Hàng ngàn khoảnh khắc đáng nhớ về hành trình học tập thú vị luôn được ZIM ghi lại mỗi ngày tại 21 trung tâm Anh Ngữ ZIM trên toàn quốc.
            </Text>
            <Animated.FlatList
                ref={flatListRef}
                data={momentsData}
                horizontal
                style={{ width: '100%' }}
                keyExtractor={(item) => item.id}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <MomentItem momentItem={item} />
                )}
            />
        </View>
    );
};

export default MomentList;

const styles = StyleSheet.create({
    container: {
        gap: vs(12),
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff'
    },
    content: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff'
    }
});