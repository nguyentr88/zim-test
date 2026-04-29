import { Linking } from 'react-native';
import { hasProperty, isNonEmptyArray } from './validator';
// @ts-ignore
import { debug, info, warn, error } from 'react-native-exception-handler';
import Config from 'react-native-config';
// @ts-ignore
const { APP_DISPLAY_NAME } = Config;

export const deepCopy = <T>(obj: T): T => {
    const objStr = JSON.stringify(obj);
    return JSON.parse(objStr);
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


export const openURL = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
        if (supported) {
            Linking.openURL(url);
        }
    });
};

export const clamp = (value: number, lowerBound: number, upperBound: number): number => {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
};

export const retrieveValue = (object: any, key: string): any => (
    hasProperty(object, key) ? object[key] : null
);

export const groupArrayThreeLayers = (
    myArr: Array<any>,
    firstValue: string,
    firstTitle: string,
    secondValue: string,
    secondTitle: string
): Array<any> => {
    let result: Array<any> = [];
    myArr.forEach(element => {
        const firstLayerIndex = result.findIndex(ele => ele[firstValue] == element[firstValue]);
        if (firstLayerIndex == -1) {
            result.push({
                [firstValue]: element[firstValue],
                [firstTitle]: element[firstTitle],
                firstLayerData: [{
                    [secondValue]: element[secondValue],
                    [secondTitle]: element[secondTitle],
                    secondLayerData: [element]
                }]
            });
        } else {
            const secondLayerIndex = result[firstLayerIndex].firstLayerData.findIndex((ele: any) => ele[secondValue] == element[secondValue]);
            if (secondLayerIndex == -1) {
                result[firstLayerIndex].firstLayerData.push({
                    [secondValue]: element[secondValue],
                    [secondTitle]: element[secondTitle],
                    secondLayerData: [element]
                });
            } else {
                result[firstLayerIndex].firstLayerData[secondLayerIndex].secondLayerData.push(element);
            }
        }
    });
    return result;
};

export const groupArrayTwoLayers = (
    myArr: Array<any>,
    firstValue: string,
    firstTitle: string
): Array<any> => {
    let result: Array<any> = [];
    myArr.forEach(element => {
        const firstLayerIndex = result.findIndex((ele: any) => ele[firstValue] == element[firstValue]);
        if (firstLayerIndex == -1) {
            result.push({
                [firstValue]: element[firstValue],
                [firstTitle]: element[firstTitle],
                firstLayerData: [element]
            });
        } else {
            result[firstLayerIndex].firstLayerData.push(element);
        }
    });
    return result;
};

export const flattenArray = (array: Array<any>, key: string): Array<any> => {
    let result: Array<any> = [];
    array.forEach(function (element: any) {
        result.push(element);
        if (isNonEmptyArray(element[key])) {
            result = result.concat(element[key]);
        }
    });
    return result;
};

export const randomInRange = (min: number = 0, max: number = 1): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getUniqueArray = (arr: any[], key: string): Array<any> => {
    const keys = new Set();
    return arr.filter(el => !keys.has(el[key]) && keys.add(el[key]));
};

export const isAppInstalled = async (scheme: string) => {
    let result = false;
    try {
        result = await Linking.canOpenURL(`${scheme}://`);
    } catch (err) {
        console.log('isAppInstalled', err);
    }
    return result;
};

export const LoggerDebug = function (...args: any[]) {
    debug(`${APP_DISPLAY_NAME} Logger debug: `, ...args);
};

export const LoggerInfo = function (...args: any[]) {
    info(`${APP_DISPLAY_NAME} Logger info: `, ...args);
};

export const LoggerWarn = function (...args: any[]) {
    warn(`${APP_DISPLAY_NAME} Logger warning: `, ...args);
};

export const LoggerError = function (...args: any[]) {
    error(`${APP_DISPLAY_NAME} Logger error: `, ...args);
};
