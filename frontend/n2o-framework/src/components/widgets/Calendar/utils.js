import { momentLocalizer } from 'react-big-calendar';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import split from 'lodash/split';
import moment from 'moment';

export function isDayOff(day) {
  return [0, 6].indexOf(day.getDay()) !== -1;
}

export function isCurrentDay(day) {
  const currentDate = new Date();
  return (
    day.getDate() === currentDate.getDate() &&
    day.getMonth() === currentDate.getMonth() &&
    day.getFullYear() === currentDate.getFullYear()
  );
}

export function formatsMap(formats = {}) {
  const localizerFormat = (date, format) =>
    momentLocalizer(moment).format(date, format);

  const rangeFormat = (startFormat, endFormat) => ({ start, end }) =>
    localizerFormat(start, startFormat) +
    ' — ' +
    localizerFormat(end, endFormat);

  const {
    dateFormat = 'DD',
    dayFormat = 'DD ddd',
    weekdayFormat = 'ddd',
    timeStartFormat = 'HH:mm',
    timeEndFormat = 'HH:mm',
    dayStartFormat = 'DD MMM',
    dayEndFormat = 'DD MMM',
    timeGutterFormat = 'LT',
    monthHeaderFormat = 'MMMM YYYY',
    dayHeaderFormat = 'dddd MMM DD',
    agendaDateFormat = 'ddd MMM DD',
    agendaTimeFormat = 'LT',
  } = formats;

  return {
    dateFormat,
    dayFormat: date => localizerFormat(date, dayFormat),
    weekdayFormat: date => localizerFormat(date, weekdayFormat), // формат дня недели при view: 'month'
    timeGutterFormat: date => localizerFormat(date, timeGutterFormat),
    selectRangeFormat: rangeFormat(timeStartFormat, timeEndFormat),
    eventTimeRangeFormat: rangeFormat(timeStartFormat, timeEndFormat),
    monthHeaderFormat: date => localizerFormat(date, monthHeaderFormat), // формат заголовка при view: 'month'
    dayHeaderFormat: date => localizerFormat(date, dayHeaderFormat),
    dayRangeHeaderFormat: rangeFormat(dayStartFormat, dayEndFormat),
    agendaHeaderFormat: rangeFormat(dayStartFormat, dayEndFormat),
    agendaDateFormat: date => localizerFormat(date, agendaDateFormat),
    agendaTimeFormat: date => localizerFormat(date, agendaTimeFormat),
    agendaTimeRangeFormat: rangeFormat(timeStartFormat, timeEndFormat),
  };
}

export function eventLessHour(date, step) {
  if (isNumber(step)) {
    const begin = new Date(get(date, 'begin'));
    const end = new Date(get(date, 'end'));
    const difference =
      Math.abs(end.getTime() - begin.getTime()) / (1000 * 3600);
    return difference <= (step / 60) * 2;
  }
  return false;
}

export function timeParser(min, max) {
  const minTime = split(min, ':');
  const maxTime = split(max, ':');
  return !isEmpty(minTime) && !isEmpty(maxTime)
    ? {
        min: new Date(0, 0, 0, minTime[0], minTime[1], minTime[2], 0),
        max: new Date(0, 0, 0, maxTime[0], maxTime[1], maxTime[2], 0),
      }
    : {};
}
