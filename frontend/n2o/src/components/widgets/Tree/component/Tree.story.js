import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs/react';
import Tree from './Tree';

const stories = storiesOf('Виджеты/Дерево', module);
stories.addDecorator(withKnobs);
stories
  .add('Компонент', () => {
    const props = {
      disabled: boolean('disabled', false),
      loading: boolean('loading', false),
      parentFieldId: text('parentFieldId', 'parentId'),
      valueFieldId: text('valueFieldId', 'id'),
      labelFieldId: text('label', 'label'),
      iconFieldId: text('iconFieldId', 'icon'),
      imageFieldId: text('imageFieldId', 'image'),
      badgeFieldId: text('badgeFieldId', 'badge'),
      badgeColorFieldId: text('badgeColorFieldId', 'color'),
      hasCheckboxes: boolean('hasCheckboxes', false),
      parentIcon: text('parentIcon', ''),
      childIcon: text('childIcon', ''),
      draggable: boolean('draggable', true),
      multiselect: boolean('multiselect', false),
      showLine: boolean('showLine', false),
      filter: select('filter', ['includes', 'startsWith', 'endsWith', '-'], '-'),
      expandBtn: boolean('expandBtn', false)
    };

    const datasource = [
      { id: '1', label: 'Система подогрева' },
      { id: '12', label: 'Обогреватель', parentId: '1' },
      { id: '13', label: 'Корпус', parentId: '1' },
      { id: '2', label: 'Система вентиляции и охлаждения' },
      { id: '21', label: 'Вентиляторы', parentId: '2' },
      { id: '22', label: 'Фильтры', parentId: '2' },
      { id: '23', label: 'Теплообменники', parentId: '2' },
      { id: '3', label: 'Аварийное охлаждение' },
      { id: '4', label: 'Система конденсации охл. жидкости' },
      { id: '41', label: 'Дренажные трубы', parentId: '4' },
      { id: '42', label: 'Отстойники', parentId: '4' },
      { id: '44', label: 'Внутренние', parentId: '42' },
      { id: '45', label: 'Внешние', parentId: '42' }
    ];

    return <Tree datasource={datasource} {...props} />;
  })
  .add('Работа с клавиатурой', () => {
    const props = {
      multiselect: boolean('multiselect', false),
      hasCheckboxes: boolean('hasCheckboxes', false),
      showLine: boolean('showLine', false)
    };

    const datasource = [
      { id: '1', label: 'Система подогрева' },
      { id: '12', label: 'Обогреватель', parentId: '1' },
      { id: '13', label: 'Корпус', parentId: '1' },
      { id: '2', label: 'Система вентиляции и охлаждения' },
      { id: '21', label: 'Вентиляторы', parentId: '2' },
      { id: '22', label: 'Фильтры', parentId: '2' },
      { id: '23', label: 'Теплообменники', parentId: '2' },
      { id: '3', label: 'Аварийное охлаждение' },
      { id: '4', label: 'Система конденсации охл. жидкости' },
      { id: '41', label: 'Дренажные трубы', parentId: '4' },
      { id: '42', label: 'Отстойники', parentId: '4' },
      { id: '44', label: 'Внутренние', parentId: '42' },
      { id: '45', label: 'Внешние', parentId: '42' }
    ];

    return (
      <div>
        <div>
          <h6>Горячие клавиши</h6>
          <pre>Down/Up - фокус на след/пред элемент</pre>
          <pre>Space - Раскрыть дерево</pre>
          <pre>Enter - Выбрать</pre>
          <pre>ctrl + click - Выбрать в мульти режиме несколько значений hasCheckboxes=false</pre>
          <pre>ctrl + Enter - Выбрать в мульти несколько значений hasCheckboxes=true</pre>
        </div>
        <Tree datasource={datasource} {...props} />
      </div>
    );
  });
