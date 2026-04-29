import { Dimensions } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { isHasDynamicIsland, isHasNotch, isIOS } from './device';

export const width = Dimensions.get('screen').width;
export const height = Dimensions.get('window').height;
const heightTopSafeIOS = isHasDynamicIsland
    ? StaticSafeAreaInsets.safeAreaInsetsTop - 12
    : StaticSafeAreaInsets.safeAreaInsetsTop;
export const heightTopSafe = isIOS
    ? isHasNotch || isHasDynamicIsland
        ? heightTopSafeIOS
        : 20
    : 0;
export const heightBottomSafe =
    isHasNotch || isHasDynamicIsland
        ? StaticSafeAreaInsets.safeAreaInsetsBottom
        : 0;
export const heightIndicator =
    isHasNotch || isHasDynamicIsland ? 13 : 0;
export const NAVIGATION_HEADER_HEIGHT = 60;

export const standardWidth = 375;
export const standardHeight = 667;

const scale = (size: number) => (width / standardWidth) * size;

export const getSize = (initSize: number) => {
    return Math.round(scale(initSize));
};
