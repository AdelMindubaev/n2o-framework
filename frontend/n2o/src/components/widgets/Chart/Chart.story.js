import React from 'react';
import { storiesOf } from '@storybook/react';
import { getStubData } from 'N2oStorybook/fetchMock';
import { filterMetadata, newEntry, tableActions } from 'N2oStorybook/json';
import fetchMock from 'fetch-mock';
import { set } from 'lodash';
import lineChart from './json/LineChart.meta';
import areaChart from './json/AreaChart.meta';
import barChart from './json/BarChart.meta';
import pieChart from './json/PieChart.meta';
import Factory from '../../../core/factory/Factory';
import { WIDGETS } from '../../../core/factory/factoryLevels';
import { omit } from 'lodash';
import withPage from '../../../../.storybook/decorators/withPage';
import { page } from 'N2oStorybook/fetchMock';

const stories = storiesOf('Виджеты/Графики', module);

const urlPattern = 'begin:n2o/data';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

stories
  .add('LineChart', () => {
    fetchMock.restore().get(urlPattern, url => ({
      list: data,
    }));

    return (
      <Factory level={WIDGETS} {...lineChart['Page_Chart']} id="Page_Chart" />
    );
  })
  .add('AreaChart', () => {
    fetchMock.restore().get(urlPattern, url => ({
      list: data,
    }));

    return (
      <Factory level={WIDGETS} {...areaChart['Page_Chart']} id="Page_Chart" />
    );
  })
  .add('BarChart', () => {
    fetchMock.restore().get(urlPattern, url => ({
      list: data,
    }));

    return (
      <Factory level={WIDGETS} {...barChart['Page_Chart']} id="Page_Chart" />
    );
  })
  .add('PieChart', () => {
    fetchMock.restore().get(urlPattern, url => ({
      list: data,
    }));

    return (
      <Factory level={WIDGETS} {...pieChart['Page_Chart']} id="Page_Chart" />
    );
  });
