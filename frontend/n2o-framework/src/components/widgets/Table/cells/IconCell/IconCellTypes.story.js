import React from 'react';
import { storiesOf } from '@storybook/react';

import Table from '../../Table';
import IconCell from './IconCell';
import TextTableHeader from '../../headers/TextTableHeader';
import { iconCellTypes, textPlaceTypes } from './cellTypes';

const stories = storiesOf('Ячейки/Иконки', module);
stories.addParameters({
  info: {
    propTables: [IconCell],
    propTablesExclude: [Table],
  },
});

stories.add('Компонент', () => {
  const tableProps = {
    headers: [
      {
        id: 'id',
        component: TextTableHeader,
        label: 'Стандарт',
      },
      {
        id: 'vip',
        component: TextTableHeader,
        label: 'Текст слева',
      },
      {
        id: 'onlyIcon',
        component: TextTableHeader,
        label: 'Только иконка',
      },
    ],
    cells: [
      {
        id: 'id',
        component: IconCell,
        icon: 'fa fa-plus',
        tooltipPlacement: 'right',
      },
      {
        id: 'vip',
        component: IconCell,
        icon: 'fa fa-plus',
        textPlace: textPlaceTypes.LEFT,
        tooltipPlacement: 'top',
      },
      {
        id: 'onlyIcon',
        component: IconCell,
        icon: 'fa fa-plus',
        type: iconCellTypes.ICON,
      },
    ],
    datasource: [
      {
        id: 'Алексей',
        vip: 'Алексей',
        onlyIcon: 'Алексей',
        tooltipFieldId: ['tooltip', 'body'],
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
