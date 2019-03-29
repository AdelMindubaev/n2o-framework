import React from 'react';
import moment from 'moment';

import {
  weeks,
  isDateFromPrevMonth,
  isDateFromNextMonth,
  addTime,
  withLocale,
  parseDate,
  mapToValue,
  mapToDefaultTime,
  calculateMaxFreeSpace,
  formatToMask
} from './utils';

describe('utils', () => {
  it('тестирует isDateFromNextMonth', () => {
    expect(isDateFromNextMonth(moment(), moment())).toBe(false);
    expect(isDateFromNextMonth(moment().add(1, 'months'), moment())).toBe(true);
  });

  it('тестирует isDateFromPrevMonth', () => {
    expect(isDateFromPrevMonth(moment(), moment())).toBe(false);
    expect(isDateFromPrevMonth(moment().subtract(1, 'months'), moment())).toBe(true);
  });

  it('тестирует addTime', () => {
    const t = addTime(moment().startOf('day'), 3, 3);
    expect(t.hour()).toBe(3);
    expect(t.minute()).toBe(3);
  });

  it('тестирует withLocale', () => {
    expect(withLocale(moment(), 'ru').locale()).toBe('ru');
  });

  it('тестирует parseDate', () => {
    expect(parseDate(moment()).format('DD/MM/YYYY HH:mm')).toBe(
      moment().format('DD/MM/YYYY HH:mm')
    );
    expect(parseDate(new Date(), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')).toBe(
      moment().format('DD/MM/YYYY HH:mm')
    );
    expect(parseDate('11/12/1111', 'DD/MM/YYYY').format('DD/MM/YYYY')).toBe('11/12/1111');
  });

  it('тестирует mapToValue', () => {
    let val = [
      { name: 'beginDate', value: '11/11/1111' },
      { name: 'endDate', value: '22/12/2222' }
    ];
    let defaultTime = { beginDate: { hours: 1, mins: 2 }, endDate: { hours: 1, mins: 2 } };
    const dateFormat = 'DD/MM/YYYY';
    const locale = 'ru';
    const defaultName = 'singleInput';
    expect(
      mapToValue(val, defaultTime, dateFormat, locale, defaultName).beginDate.format('DD/MM/YYYY')
    ).toBe('11/11/1111');
    expect(
      mapToValue(val, defaultTime, dateFormat, locale, defaultName).endDate.format('DD/MM/YYYY')
    ).toBe('22/12/2222');
    val = '11/11/1111';
    defaultTime = { [defaultName]: { hours: 0, mins: 0 } };
    expect(
      mapToValue(val, defaultTime, dateFormat, locale, defaultName)[defaultName].format(
        'DD/MM/YYYY'
      )
    ).toBe('11/11/1111');
  });

  it('тестирует mapToDefaultTime', () => {
    let val = [
      { name: 'beginDate', value: '11/11/1111', defaultTime: '01:01' },
      { name: 'endDate', value: '22/12/2222' }
    ];
    let defaultTime = '11:11';
    const defaultName = 'singleInput';
    const timeFormat = 'hh:mm:ss';
    const format = 'DD/MM/YYYY hh:mm:ss';
    expect(mapToDefaultTime(val, defaultTime, defaultName, timeFormat).beginDate).toMatchObject({
      hours: 1,
      mins: 1
    });

    expect(
      mapToDefaultTime(val, defaultTime, defaultName, timeFormat, format).endDate
    ).toMatchObject({
      hours: 0,
      mins: 0
    });
    val = '11/11/1111';

    expect(mapToDefaultTime(val, defaultTime, defaultName, timeFormat)[defaultName]).toMatchObject({
      hours: 0,
      mins: 0
    });

    val = '11/11/1111 01:05:33';

    expect(mapToDefaultTime(val, defaultTime, defaultName, timeFormat)[defaultName]).toMatchObject({
      hours: 1,
      mins: 5,
      seconds: 33
    });
  });
  it('тестирует formatToMask', () => {
    /*eslint-disable */
    expect(formatToMask('DD.MM.YY HH:mm'))
      .toEqual([/[0-3]/, /\d/, ".", /[0-1]/, /\d/, ".", /\d/, /\d/, " ", /[0-2]/, /\d/, ":", /[0-5]/, /\d/]);
    expect(formatToMask('DD/MM/YYYY HH:mm'))
      .toEqual([/[0-3]/, /\d/, "/", /[0-1]/, /\d/, "/", /[0-2]/, /\d/, /\d/, /\d/, " ", /[0-2]/, /\d/, ":", /[0-5]/, /\d/]);
    expect(formatToMask('DD.MM.YY HH:mm:ss'))
      .toEqual([/[0-3]/, /\d/, ".", /[0-1]/, /\d/, ".", /\d/, /\d/, " ", /[0-2]/, /\d/, ":", /[0-5]/, /\d/, ":", /[0-5]/, /\d/]);
    expect(formatToMask('DD.MM.YY'))
      .toEqual([/[0-3]/, /\d/, ".", /[0-1]/, /\d/, ".", /\d/, /\d/]);
    expect(formatToMask('HH/mm'))
      .toEqual([/[0-2]/, /\d/, "/", /[0-5]/, /\d/]);
    /*eslint-enable */
  });
});
