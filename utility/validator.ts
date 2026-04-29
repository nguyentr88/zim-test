import * as REG_EXP from './reg-exp';

export const isObject = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === Object;
};

export const isArray = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === Array;
};

export const isBoolean = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === Boolean;
};

export const isFunction = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === Function;
};

export const isNumber = (obj: any): boolean => {
    return (
        obj !== undefined &&
        obj !== null &&
        !Number.isNaN(obj) &&
        obj.constructor === Number
    );
};

export const isJSON = (str: string): boolean => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};


export const isNumberPositive = (obj: any): boolean => {
    return isNumber(obj) && obj > 0;
};

export const isString = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === String;
};

export const isInstanced = (obj: any): boolean => {
    if (obj === undefined || obj === null) {
        return false;
    }
    if (isArray(obj)) {
        return false;
    }
    if (isBoolean(obj)) {
        return false;
    }
    if (isFunction(obj)) {
        return false;
    }
    if (isNumber(obj)) {
        return false;
    }
    if (isObject(obj)) {
        return false;
    }
    if (isString(obj)) {
        return false;
    }
    return true;
};

export const isEmptyString = (str: any): boolean => !isString(str) || isString(str) && str.length === 0;
export const isEmptyArray = (arr: any): boolean => !isArray(arr) || isArray(arr) && arr.length === 0;
export const isNonEmptyString = (str: any): boolean => isString(str) && str.length > 0;
export const isNonEmptyArray = (arr: any): boolean => isArray(arr) && arr.length > 0;
export const isNonEmptyObject = (object: any): boolean => isValidObject(object) && isNonEmptyArray(Object.keys(object));
export const isEmptyObject = (obj: any): boolean => {
    if (isObject(obj)) {
        return isEmptyArray(Object.keys(obj));
    }
    return true;
};

export function isValidObject(object: any): boolean {
    return object !== undefined && object !== null;
}

export const hasProperty = (object: any, property: string): boolean => {
    return (
        isValidObject(object) &&
        Object.hasOwnProperty.call(object, property) &&
        isValidObject(object[property])
    );
};

export const isValidateCharVN = (text: string): boolean => {
    return REG_EXP.regExpCharVN.test(text);
};


export const isValidPhoneNumber = (text: string): boolean => {
    return REG_EXP.phoneNumber.test(text);
};

export const isValidIdCard = (text: string): boolean => {
    return REG_EXP.idCard.test(text);
};

export const isValidEmail = (text: string): boolean => {
    return REG_EXP.email.test(text);
};

export const isValidName = (text: string): boolean => {
    return REG_EXP.name.test(text);
};