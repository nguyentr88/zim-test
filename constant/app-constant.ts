import Config from 'react-native-config';

const { ENV = 'DEV' } = Config;

export const IS_LIVE = ENV === 'LIVE';
export const IS_PROD = ENV === 'PROD';
export const IS_STAG = ENV === 'STAG';
export const IS_DEV = ENV === 'DEV';
export const ENV_NAME = ENV;

export const LOGGER_MODE = IS_LIVE || IS_PROD || IS_STAG;

