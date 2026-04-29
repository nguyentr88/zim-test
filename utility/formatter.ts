import { isNumber, isString } from "./validator";

export const trim = (str: any): string => {
    if (isString(str)) {
        return str.trim();
    }
    return str;
};

export const removeAccent = (str: any): string => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
};

export const convertNum = function (num: any, isCurrency: boolean = true): string {
    if (!isNumber(num)) return `${num}`;
    const str = num.toFixed(4);
    let [int, dec] = str.split('.');
    const intMasked = int.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if (dec) {
        while (dec[dec.length - 1] == '0') {
            dec = dec.slice(0, -1);
        }
    }
    const decMasked = dec ? `.${dec}` : '';
    const currency = isCurrency ? 'đ' : '';
    return `${intMasked}${decMasked}${currency}`;
};

export const formatMoney = (
    amount: number,
    decimalCount = 0,
    decimal: string = '.',
    thousands: string = ',',
    currencyStr: string = 'đ'
): string => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = Number.isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? '-' : '';
        const i = parseInt(
            (Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        const j = i.length > 3 ? i.length % 3 : 0;
        return (
            negativeSign +
            (j ? i.slice(0, j) + thousands : '') +
            i.slice(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
            (decimalCount
                ? decimal +
                Math.abs(amount - Number.parseInt(i))
                    .toFixed(decimalCount)
                    .slice(2)
                : '') +
            `${currencyStr}`
        );
    } catch (e) {
        return `0${currencyStr}`;
    }
};

export const roundNumber = (number: number, numberOfFractionDigits: number = 2): number => Math.round((number + Number.EPSILON) * Math.pow(10, numberOfFractionDigits)) / Math.pow(10, numberOfFractionDigits);

export const formatPhoneNumber = (phoneNumber: string = ''): string => phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
