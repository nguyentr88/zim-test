import { PixelRatio } from 'react-native';
import { DIMENSION, DEVICE } from './';
import { validator } from '@/utility';

const { width, height } = DIMENSION;
const [w, h] = width < height ? [width, height] : [height, width];
const baseWidth: number = DEVICE.isIOS ? 390 : 412;
const baseHeight: number = DEVICE.isIOS ? 844 : 869;
const rw: number = w / baseWidth;
const rh: number = h / baseHeight;
const ratio: number = w / h;

export const hs = (value: number = 0): number => {
    if (value < baseWidth) {
        return PixelRatio.roundToNearestPixel(rw * value);
    } else {
        return value;
    }
};
export const vs = (value: number = 0): number => {
    if (value < baseHeight) {
        return PixelRatio.roundToNearestPixel(rh * value);
    } else {
        return value;
    }
};
export const mhs = (value: number = 0): number =>
    value + (hs(value) - value) * ratio;
export const mvs = (value: number = 0): number =>
    value + (vs(value) - value) * ratio;
export const padding = (
    top: number = 0,
    left: number = 0,
    bottom: number = 0,
    right: number = 0
): {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
} => {
    return {
        paddingTop: vs(top),
        paddingLeft: hs(left),
        paddingBottom: vs(bottom),
        paddingRight: hs(right)
    };
};
export const margin = (
    top: number = 0,
    left: number = 0,
    bottom: number = 0,
    right: number = 0
): {
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
} => {
    return {
        marginTop: vs(top),
        marginLeft: hs(left),
        marginBottom: vs(bottom),
        marginRight: hs(right)
    };
};
export const radius = (value: number): { borderRadius: number } => {
    return {
        borderRadius: hs(value)
    };
};
export const radiusTopBottom = (
    top: number = 0,
    bottom: number = 0
): {
    borderTopLeftRadius: number;
    borderTopRightRadius: number;
    borderBottomLeftRadius: number;
    borderBottomRightRadius: number;
} => {
    return {
        borderTopLeftRadius: hs(top),
        borderTopRightRadius: hs(top),
        borderBottomLeftRadius: hs(bottom),
        borderBottomRightRadius: hs(bottom)
    };
};
export const size = (value: number = 0): number => {
    return hs(value);
};
export const rectangle = (
    wValue: number = 0,
    hValue: number = 0
): {
    width: number;
    height: number;
} => {
    if (wValue == hValue) {
        return {
            width: hs(wValue),
            height: hs(wValue)
        };
    } else {
        return {
            width: validator.isNumber(wValue) ? hs(wValue) : wValue,
            height: validator.isNumber(hValue) ? vs(hValue) : hValue
        };
    }
};
export const circle = (
    value: number
): {
    width: number;
    height: number;
    borderRadius: number;
} => {
    const d = hs(value);
    return {
        width: d,
        height: d,
        borderRadius: d / 2
    };
};

const guidelineBaseWidth: number = 375; // iPhone 6 width

export const scale = (size: number): number =>
    PixelRatio.roundToNearestPixel((width / guidelineBaseWidth) * size);

export const lignHeight = (percent: number, fontSize: number) =>
    Math.round((percent / 100) * fontSize);

export const letterSpacing = (percent: number, fontSize: number) =>
    (percent / 100) * fontSize;
