import { Platform } from 'react-native';
import {
    getApplicationName,
    getBrand,
    getBundleId,
    getDeviceId,
    getDeviceType,
    getModel,
    getReadableVersion,
    getSystemName,
    getSystemVersion,
    getUniqueId,
    getVersion,
    hasNotch,
    hasDynamicIsland,
    getDeviceNameSync,
    isEmulatorSync
} from 'react-native-device-info';

export const os = Platform.OS;
export const isIOS = os === 'ios';
export const isANDROID = os === 'android';
export const keyName = Platform.select({
    ios: 'ios-version',
    android: 'android-version'
});
export const applicationName = getApplicationName();
export const brand = getBrand();
export const bundleId = getBundleId();
export const deviceId = getDeviceId();
export const deviceType = getDeviceType();
export const model = isIOS ? getModel() : getDeviceNameSync();
export const readableVersion = getReadableVersion();
export const systemName = getSystemName();
export const systemVersion = getSystemVersion();
export const uniqueId = getUniqueId();
export const version = getVersion();
export const isNotch = hasNotch();
export const isDynamicIsland = hasDynamicIsland();
export const isEmulator = isEmulatorSync();
export const isHasNotch = isIOS && isNotch;
export const isHasDynamicIsland = isIOS && isDynamicIsland;
