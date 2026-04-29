import moment from 'moment';
import dayjs from 'dayjs';
import * as MEASUREMENT from './measurement';
import { isNonEmptyString } from './validator';

const URL_TIMEZONE = 'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh';

const customParseFormat = require('dayjs/plugin/customParseFormat');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
moment.updateLocale('vi', {
    relativeTime: {
        future: 'trong %s',
        past: '%s',
        s: 'bây giờ',
        ss: '%ds',
        m: '1m trước',
        mm: '%dm trước',
        h: '1h trước',
        hh: '%dh trước',
        d: '1 ngày trước',
        dd: '%d ngày trước',
        w: '1 tuần trước',
        ww: '%d tuần trước',
        M: '1 tháng trước',
        MM: '%d tháng trước',
        y: '1 năm trước',
        yy: '%d năm trước'
    }
});

const FORMAT_DATE: string = 'yyyy-mm-ddThh:ii:ss';
const regExpYYYYMMDD: RegExp =
    /^((?:19|20)\d\d)[- /](0[1-9]|1[012])[- /](0[1-9]|[12][0-9]|3[01])/;

const regExpDDMMYYYY: RegExp =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

export const isDate = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor === Date;
};

export const pad = (number: number): string => {
    if (number < 10) {
        return `0${number}`;
    }
    return `${number}`;
};

export const isValidDate = (date: any): boolean => {
    return isDate(date) && !Number.isNaN(date.getDate());
};

export const isValidTime = (time: any): boolean => {
    return time > 0 && isValidDate(new Date(time));
};

export const isValidStrDate = (strDate: any): boolean => {
    return regExpYYYYMMDD.test(strDate);
};

export const isValidStrDateDDMMYYYY = (strDate: string): boolean => {
    return regExpDDMMYYYY.test(strDate);
};

export const getCurrentDate = (): Date => new Date();

export const getTimestamp = (date: Date = new Date()) => date.getTime();

export const convertJStoCwithString = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        let offset: number = date.getTimezoneOffset();
        const sign = offset < 0 ? '+' : '-';
        const z_hh = pad(Math.abs(offset / 60));
        const z_mm = pad(Math.abs(offset % 60));
        const tzd = `${sign}${z_hh}:${z_mm}`;
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        const s = (date.getMilliseconds() / 1000).toFixed(2).slice(2, 4);
        result = `${yyyy}-${mm}-${dd}T${hh}:${ii}:${ss}.${s}${tzd}`;
    }
    return result;
};

export const convertDateFromStringWithCFormat = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        let utcTime: Date = date;
        let dd: number = utcTime.getDate();
        let mm: number = utcTime.getMonth() + 1;
        let yyyy: number = utcTime.getFullYear();
        let hh: number = utcTime.getHours();
        let min: number = utcTime.getMinutes();
        let ss: number = utcTime.getSeconds();
        result = `${yyyy}-${pad(mm)}-${dd}T${pad(hh)}:${pad(min)}:${pad(ss)}`;
    }
    return result;
};

export const formatDateYYYYMMDD = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        result = `${yyyy}-${mm}-${dd}`;
    }
    return result;
};

export const formatDateFULL = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        result = `${dd}/${mm}/${yyyy} ${hh}:${ii}:${ss}`;
    }
    return result;
};

export const formatDateDDMMYYYY = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        result = `${dd}/${mm}/${yyyy}`;
    }
    return result;
};

export const formatDateMMYYYY = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        result = `${mm}/${yyyy}`;
    }
    return result;
};

export const formatDateDDMM = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        result = `${dd}/${mm}`;
    }
    return result;
};

export const formatDateHHMM = (date: any = new Date()): string => {
    let result: string = '';
    if (isValidDate(date)) {
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        result = `${hh}:${ii}`;
    }
    return result;
};

export const formatTimeFULL = (time: any): string => {
    let result: string = '';
    if (isValidTime(time)) {
        const date: Date = new Date(time);
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        result = `${dd}/${mm}/${yyyy} ${hh}:${ii}:${ss}`;
    }
    return result;
};

export const formatTimeDDMMYYYY = (time: any = new Date()): string => {
    let result: string = '';
    if (isValidTime(time)) {
        const date = new Date(time);
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        result = `${dd}/${mm}/${yyyy}`;
    }
    return result;
};

export const formatTimeHHMM = (time: any = new Date()): string => {
    let result: string = '';
    if (isValidTime(time)) {
        const date = new Date(time);
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        result = `${hh}:${ii}`;
    }
    return result;
};

export const formatTimeHHMMSS = (time: any = new Date()): string => {
    let result: string = '';
    if (isValidTime(time)) {
        const date = new Date(time);
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        result = `${hh} : ${ii} : ${ss}`;
    }
    return result;
};

export const convert_string_to_date = (
    strDate: string,
    formatDate = FORMAT_DATE
): Date => {
    let result: Date = new Date();
    if (isValidStrDate(strDate)) {
        const reg = new RegExp('T');
        const reg2 = new RegExp('Z');
        strDate = strDate.replace(reg, ' ').replace(reg2, '');
        formatDate = formatDate.replace(reg, ' ');
        result = String(strDate).toDate(formatDate);
    }
    return result;
};

export const formatStrDateFULL = (strDate: string, formatDate = FORMAT_DATE): string => {
    let result: string = '';
    const date: Date = convert_string_to_date(strDate, formatDate);
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        result = `${dd}/${mm}/${yyyy} ${hh}:${ii}:${ss}`;
    }
    return result;
};

export const formatStrDateDDMMYYYY = (
    strDate: string,
    formatDate = FORMAT_DATE
): string => {
    let result: string = '';
    const date = convert_string_to_date(strDate, formatDate);
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        const yyyy = date.getFullYear();
        result = `${dd}/${mm}/${yyyy}`;
    }
    return result;
};

export const formatStrDateDDMM = (strDate: string, formatDate = FORMAT_DATE): string => {
    const date = convert_string_to_date(strDate, formatDate);
    let result: string = '';
    if (isValidDate(date)) {
        const dd = pad(date.getDate());
        const mm = pad(date.getMonth() + 1);
        result = `${dd}/${mm}`;
    }
    return result;
};

export const formatStrDateHHMM = (strDate: string, formatDate = FORMAT_DATE): string => {
    const date = convert_string_to_date(strDate, formatDate);
    let result: string = '';
    if (isValidDate(date)) {
        const hh = pad(date.getHours());
        const ii = pad(date.getMinutes());
        result = `${hh}:${ii}`;
    }
    return result;
};

declare global {
    interface String {
        toDate(formatDate: string): any;
    }
}

String.prototype.toDate = function (formatDate = FORMAT_DATE) {
    let result: Date = new Date();
    if (isNonEmptyString(this)) {
        const today = new Date();
        const normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
        const normalizedFormat = formatDate
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-');
        const formatItems = normalizedFormat.split('-');
        const dateItems: Array<any> = normalized.split('-');
        const monthIndex = formatItems.indexOf('mm');
        const dayIndex = formatItems.indexOf('dd');
        const yearIndex = formatItems.indexOf('yyyy');
        const hourIndex = formatItems.indexOf('hh');
        const minutesIndex = formatItems.indexOf('ii');
        const secondsIndex = formatItems.indexOf('ss');
        const year =
            yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
        const month =
            monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
        const day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();
        const hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
        const minute =
            minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
        const second =
            secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();
        result = new Date(year, month, day, hour, minute, second);
    }
    return result;
};

const DAY_OF_WEEK = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

export const getDayOfWeek = (date = new Date()): string => {
    const day = isValidDate(date) ? date.getDay() : '';
    switch (day) {
        case DAY_OF_WEEK.sunday:
            return 'Chủ nhật';
        case DAY_OF_WEEK.monday:
            return 'Thứ hai';
        case DAY_OF_WEEK.tuesday:
            return 'Thứ ba';
        case DAY_OF_WEEK.wednesday:
            return 'Thứ tư';
        case DAY_OF_WEEK.thursday:
            return 'Thứ năm';
        case DAY_OF_WEEK.friday:
            return 'Thứ sáu';
        case DAY_OF_WEEK.saturday:
            return 'Thứ bảy';
        default:
            return '';
    }
};

export const getDateTimeFromString = (dateTime: string): Date => {
    let result: Date = new Date();
    const [date, time]: Array<string> = dateTime.split(' ');
    if (date != undefined && time != undefined) {
        const [DD, MM, YYYY]: Array<string> = date.split('-');
        const [h, m, s] = time.split(':');
        if (DD && MM && YYYY && h && m && s) {
            result = new Date(+YYYY, +MM - 1, +DD, +h, +m, +s);
        }
    }
    return result;
};

export const getDiffDays = (date1: Date, date2: Date): number => {
    let diffTime = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(diffTime / MEASUREMENT.day);
    return diffDays;
};

export const checkLocalTime = async () => {
    let isValid = true;
    try {
        const offset = -new Date().getTimezoneOffset() / 60;
        if (offset == 7) {
            const begin = Math.floor(Date.now() / 1000);
            const response = await fetch(URL_TIMEZONE);
            const { unixtime } = await response.json();
            const end = Math.floor(Date.now() / 1000);
            const duration = end - begin;
            const absTimes = Math.abs(unixtime - begin);
            const delta = duration + MEASUREMENT.second;
            isValid = absTimes <= delta;
        }
    } catch (error) {
        console.log('checkLocalTime', error);
    }
    return isValid;
};

export const getLastThreeMonths = () => {
    const date = new Date();
    let result: Array<any> = [];
    for (let i = 0; i < 3; i++) {
        const firstDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const lastDate = new Date(date.getFullYear(), date.getMonth() - i + 1, 0);
        const month = firstDate.getMonth() + 1;
        const year = firstDate.getFullYear();
        const item = {
            monthIndex: i,
            month,
            year,
            title: `T${pad(month)} - ${year}`,
            startDate: formatDateYYYYMMDD(firstDate),
            endDate: formatDateYYYYMMDD(lastDate)
        };
        result.push(item);
    }
    return result;
};

export const getPreviousDate = (numberOfDates = 1) => {
    return new Date(Date.now() - numberOfDates * MEASUREMENT.day);
};
