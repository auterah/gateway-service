import * as moment from 'moment';

export type Format = 'YYYY-MM-DD' | 'Do MMMM YYYY';

export class DateUtils {

  static get currentYear(): number {
    return new Date().getFullYear();
  }

  static currentMonth(opt: 'name' | 'index' = 'name'): number | string {
    const date = new Date();
    return opt === 'name'
      ? date.toLocaleString('default', { month: 'long' })
      : date.getMonth() + 1;
  }

  static getToday(opt: 'name' | 'index' = 'name'): number | string {
    const date = new Date();
    return opt === 'name'
      ? date.toLocaleString('en-US', { weekday: 'long' })
      : date.getDay() + 1;
  }

  static parseHyphenatedDate(date: string) {
    const isString = typeof date === 'string';
    if (!isString) {
      throw new Error('Invalid date type');
    }

    const hasDayButNoMonth =
      date.split('-')[1] === 'undefined' && date.split('-')[2] !== 'undefined';
    if (hasDayButNoMonth) {
      throw new Error('Month is required');
    }

    date = date.replace(/-undefined/g, '');

    const parts = date.split('-').map((part, index) => {
      return index === 1 || index === 2 ? part.padStart(2, '0') : part;
    });
    date = parts.join('-');

    const maxLen = 10;
    if (date.length > maxLen) {
      throw new Error(`Date should be max length of ${maxLen}`);
    }

    const isYearMonthAndDay = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const onlyYearAndMonth = /^\d{4}-\d{2}$/.test(date);
    const onlyYear = /^\d{4}$/.test(date);

    if (onlyYear || onlyYearAndMonth || isYearMonthAndDay) {
      return date;
    }

    throw new Error('Invalid date');
  }
}
