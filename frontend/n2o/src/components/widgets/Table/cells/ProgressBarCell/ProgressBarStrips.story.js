import React from 'react';
import { storiesOf } from '@storybook/react';
import { jsxDecorator } from 'storybook-addon-jsx';

import Table from '../../Table';
import progressBarStyles from './progressBarStyles';
import ProgressBarCell from './ProgressBarCell';
import TextTableHeader from '../../headers/TextTableHeader';
import Factory from '../../../../../core/factory/Factory';

const stories = storiesOf('Ячейки/Индикатор', module);
stories.addDecorator(jsxDecorator);
stories.addParameters({
  info: {
    propTables: [ProgressBarCell],
    propTablesExclude: [Table, Factory],
  },
});

stories.add('Штриховка', () => {
  const tableProps = {
    headers: [
      {
        id: 'header',
        component: TextTableHeader,
        label: 'С штриховкой',
      },
      {
        id: 'header',
        component: TextTableHeader,
        label: 'Без штриховки',
      },
    ],
    cells: [
      {
        component: ProgressBarCell,
        id: 'now',
        model: {
          now: 55,
        },
        color: progressBarStyles.DEFAULT,
        striped: true,
      },
      {
        component: ProgressBarCell,
        id: 'now',
        model: {
          now: 55,
        },
        color: progressBarStyles.DEFAULT,
        striped: false,
      },
    ],
    datasource: [
      {
        id: 'now',
        now: 55,
      },
    ],
  };

  return (
    <Table
      headers={tableProps.headers}
      cells={tableProps.cells}
      datasource={tableProps.datasource}
    />
  );
});
