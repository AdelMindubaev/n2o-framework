import React from 'react';
import { storiesOf } from '@storybook/react';

import withForm from 'N2oStorybook/decorators/withForm';
import DatePicker from './DatePicker';
import DatePickerJson from './DatePicker.meta.json';
import Factory from '../../../core/factory/Factory';

const form = withForm({ src: 'DatePicker' });
const stories = storiesOf('Контролы/Выбор дат', module);

stories.addParameters({
  info: {
    propTables: [DatePicker],
    propTablesExclude: [Factory],
  },
});

stories
  .add(
    'Компонент',
    () => {
      const props = {
        min: DatePickerJson.min,
        max: DatePickerJson.max,
        disabled: DatePickerJson.disabled,
        timeFormat: DatePickerJson.timeFormat,
        dateDivider: ' ',
        dateFormat: DatePickerJson.dateFormat,
        locale: DatePickerJson.locale,
      };
      return <DatePicker {...props} onChange={() => {}} />;
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
      <DatePicker
          onChange={onChange}
          dateFormat="DD/MM/YYYY"
          timeFormat="HH:mm"
          placeholder="Введите дату"
          locale="ru"
          openOnFocus={false}
          utc={true}
       />
      ~~~
      `,
      },
    }
  )

  .add(
    'Метаданные',
    form(() => {
      const props = {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        defaultTime: '12:00',
        min: '12/01/2020',
        max: '01/01/2021',
        disabled: false,
        locale: 'ru',
      };
      return props;
    })
  )

  .add(
    'Форматы дат',
    () => {
      return (
        <React.Fragment>
          <DatePicker
            dateFormat="DD/MM/YYYY"
            timeFormat="HH:mm"
            placeholder="dateFormat=DD/MM/YYYY timeFormat=HH:mm"
          />
          <br />
          <DatePicker dateFormat="DD.MM.YYYY" placeholder="DD.MM.YYYY" />
          <br />
          <DatePicker dateFormat="YYYY-MM" placeholder="YYYY-MM" />
        </React.Fragment>
      );
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
        <DatePicker
          dateFormat="DD/MM/YYYY"
          timeFormat="HH:mm"
          placeholder="dateFormat=DD/MM/YYYY timeFormat=HH:mm"
        />
        <DatePicker dateFormat="DD.MM.YYYY" placeholder="DD.MM.YYYY" />
        <DatePicker dateFormat="YYYY-MM" placeholder="YYYY-MM" />
      ~~~
      `,
      },
    }
  )

  .add(
    'Текущая неделя',
    () => {
      return (
        <React.Fragment>
          <DatePicker />
        </React.Fragment>
      );
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
      <DatePicker />
      ~~~
      `,
      },
    }
  )

  .add(
    'Время по умолчанию',
    () => {
      return (
        <React.Fragment>
          <DatePicker
            dateFormat="DD/MM/YYYY"
            timeFormat="HH:mm"
            defaultTime="13:00"
            placeholder="dateFormat=DD/MM/YYYY timeFormat=HH:mm defaultTime=13:00"
          />
        </React.Fragment>
      );
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
      <DatePicker
          dateFormat="DD/MM/YYYY"
          timeFormat="HH:mm"
          defaultTime="13:00"
          placeholder="dateFormat=DD/MM/YYYY timeFormat=HH:mm defaultTime=13:00"
        />
      ~~~
      `,
      },
    }
  )

  .add(
    'Расположение',
    () => {
      return (
        <div style={{ marginTop: '100px' }}>
          <DatePicker popupPlacement="top" />
        </div>
      );
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
      <DatePicker popupPlacement="top" />
      ~~~
      `,
      },
    }
  )
  .add(
    'Min/Max',
    () => {
      return (
        <div>
          Доступные даты с 28.06.2019 по 30.06.2019
          <DatePicker
            popupPlacement="top"
            dateFormat={'YYYY-MM-DD'}
            timeFormat={'hh:mm:ss'}
            dateDivider={' '}
            min="2019-06-28 00:00:00"
            max="2019-06-30 00:00:00"
          />
        </div>
      );
    },
    {
      info: {
        text: `
      Компонент 'Выбор даты'
      ~~~js
      import DatePicker from 'n2o-framework/lib/components/controls/DatePicker/DatePicker';
      
      <DatePicker
          popupPlacement="top"
          dateFormat={'YYYY-MM-DD'}
          timeFormat={'hh:mm:ss'}
          dateDivider={' '}
          min="2019-06-28 00:00:00"
          max="2019-06-30 00:00:00"
        />
      ~~~
      `,
      },
    }
  );
