import React from 'react';
import sinon from 'sinon';
import AdvancedTable from './AdvancedTable';

import { set } from 'lodash';

const columns = [
  {
    id: 'name',
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '100px',
  },
  {
    id: 'surname',
    title: 'Surname',
    dataIndex: 'surname',
    key: 'surname',
    width: '200px',
  },
  {
    id: 'age',
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '50px',
  },
];

const data = [
  {
    id: 1,
    name: 'name1',
    surname: 'surname1',
    age: 1,
  },
  {
    id: 2,
    name: 'name2',
    surname: 'surname2',
    age: 2,
  },
  {
    id: 3,
    name: 'name3',
    surname: 'surname3',
    age: 3,
  },
];

const setup = propsOverride => {
  const props = {
    columns,
    data,
  };

  return mount(<AdvancedTable {...props} {...propsOverride} />);
};

describe('<AdvancedTable/>', () => {
  it('таблица отрисовывается', () => {
    const wrapper = setup();

    expect(wrapper.find('.n2o-table').exists()).toBe(true);
  });

  it('строки отрисовываются', () => {
    const wrapper = setup();

    expect(wrapper.find('.n2o-table-row').length).toBe(3);

    const newData = data.slice();
    newData.push({
      id: 4,
      name: 'name4',
      surname: 'surname4',
      age: 4,
    });

    wrapper.setProps({
      data: newData,
    });
    wrapper.update();
    expect(wrapper.find('.n2o-table-row').length).toBe(4);
  });

  it('отрисовывается empty message', () => {
    const wrapper = setup({ data: [] });

    expect(wrapper.find('FormattedMessage').exists()).toBe(true);
  });

  describe('тесты rowClick', () => {
    it('срабатывает rowClick', () => {
      const onResolve = sinon.spy();
      const onRowClickAction = sinon.spy();

      const wrapper = setup({
        rowClick: true,
        onResolve,
        onRowClickAction,
      });

      wrapper
        .find('.n2o-table-row')
        .first()
        .simulate('click');

      expect(onResolve.calledOnce).toBe(true);
      expect(onRowClickAction.calledOnce).toBe(true);
    });

    it('срабатывает rowClick 2 и более раз по одной и той же строке', () => {
      const onResolve = sinon.spy();
      const onRowClickAction = sinon.spy();

      const wrapper = setup({
        rowClick: true,
        onResolve,
        onRowClickAction,
      });

      const tableRow = wrapper.find('.n2o-table-row').first();

      tableRow.simulate('click');

      expect(onResolve.calledOnce).toBe(true);
      expect(onRowClickAction.calledOnce).toBe(true);

      tableRow.simulate('click');

      expect(onResolve.calledTwice).toBe(true);
      expect(onRowClickAction.calledTwice).toBe(true);

      tableRow.simulate('click');

      expect(onResolve.calledThrice).toBe(true);
      expect(onRowClickAction.calledThrice).toBe(true);
    });

    it('срабатывает rowClick по разным строкам', () => {
      const onResolve = sinon.spy();
      const onRowClickAction = sinon.spy();

      const wrapper = setup({
        rowClick: true,
        onResolve,
        onRowClickAction,
      });

      const rows = wrapper.find('.n2o-table-row');

      rows.at(2).simulate('click');
      expect(onRowClickAction.calledOnce).toBe(true);

      rows.first().simulate('click');
      expect(onRowClickAction.calledTwice).toBe(true);

      rows.at(1).simulate('click');
      expect(onRowClickAction.calledThrice).toBe(true);
    });

    it('корректно работает rowClick после фокуса', () => {
      const onResolve = sinon.spy();
      const onRowClickAction = sinon.spy();

      const wrapper = setup({
        rowClick: true,
        onResolve,
        onRowClickAction,
      });

      const rows = wrapper.find('.n2o-table-row');

      rows.at(1).simulate('focus');

      expect(onResolve.calledOnce).toBe(false);
      expect(onRowClickAction.calledOnce).toBe(false);

      rows.at(1).simulate('click');

      expect(onResolve.calledOnce).toBe(true);
      expect(onRowClickAction.calledOnce).toBe(true);

      rows.at(1).simulate('focus');

      expect(onResolve.calledTwice).toBe(false);
      expect(onRowClickAction.calledTwice).toBe(false);

      rows.at(1).simulate('click');

      expect(onResolve.calledTwice).toBe(true);
      expect(onRowClickAction.calledTwice).toBe(true);
    });

    it('корректно работает rowClick после потери фокуса', () => {
      const onResolve = sinon.spy();
      const onRowClickAction = sinon.spy();

      const wrapper = setup({
        rowClick: true,
        onResolve,
        onRowClickAction,
      });

      const rows = wrapper.find('.n2o-table-row');

      rows.at(1).simulate('click');

      expect(onResolve.calledOnce).toBe(true);
      expect(onRowClickAction.calledOnce).toBe(true);

      rows.at(1).simulate('blur');

      rows.at(1).simulate('click');

      expect(onResolve.calledTwice).toBe(true);
      expect(onRowClickAction.calledTwice).toBe(true);
    });

    it('в onResolve приходит правильная строка', () => {
      const onResolve = sinon.spy();

      const wrapper = setup({
        onResolve,
        isActive: true,
        hasSelect: true,
      });

      const rows = wrapper.find('.n2o-table-row');

      rows.at(1).simulate('click');

      expect(onResolve.calledOnce).toBe(true);
      expect(onResolve.getCall(0).args[0]).toEqual(wrapper.props().data[1]);

      rows.first().simulate('click');

      expect(onResolve.calledTwice).toBe(true);
      expect(onResolve.getCall(1).args[0]).toEqual(wrapper.props().data[0]);

      rows.at(2).simulate('click');

      expect(onResolve.calledThrice).toBe(true);
      expect(onResolve.getCall(2).args[0]).toEqual(wrapper.props().data[2]);
    });
  });

  describe('тесты фильтров в заголовке', () => {
    it('фильтр в заголовке отрисовывается', () => {
      const newColumns = columns.slice();
      set(newColumns, '[0].filterable', true);
      const wrapper = setup({ columns });

      expect(wrapper.find('.n2o-advanced-table-filter-btn').exists()).toBe(
        true
      );
    });

    it('фильтр открывается и закрыается', () => {
      const newColumns = columns.slice();
      set(newColumns, '[0].filterable', true);
      const wrapper = setup({ columns });
      const filter = wrapper.find('AdvancedTableFilter');
      const button = wrapper
        .find('.n2o-advanced-table-filter-btn button')
        .first();

      expect(filter.state().filterOpen).toBe(false);
      button.simulate('click');
      expect(filter.state().filterOpen).toBe(true);
      button.simulate('click');
      expect(filter.state().filterOpen).toBe(false);
    });

    it('фильтр сохраняет и сбрасывает значения', () => {
      const newColumns = columns.slice();
      set(newColumns, '[0].filterable', true);
      const wrapper = setup({ columns });
      const filter = wrapper.find('AdvancedTableFilter');
      const button = wrapper
        .find('.n2o-advanced-table-filter-btn button')
        .first();

      button.simulate('click');

      expect(filter.state().value).toBe(null);
      wrapper
        .find('.n2o-advanced-table-filter-dropdown-popup input')
        .simulate('change', { target: { value: 'test' } });
      expect(filter.state().value).toBe('test');

      wrapper
        .find('.n2o-advanced-table-filter-dropdown-buttons button')
        .at(1)
        .simulate('click');
      expect(filter.state().value).toBe('');
    });

    it('фильтрация корректно вызывается', () => {
      const onFilter = sinon.spy();
      const newColumns = columns.slice();
      set(newColumns, '[0].filterable', true);
      const wrapper = setup({ columns, onFilter });
      const button = wrapper
        .find('.n2o-advanced-table-filter-btn button')
        .first();

      button.simulate('click');

      wrapper
        .find('.n2o-advanced-table-filter-dropdown-popup input')
        .simulate('change', { target: { value: 'test' } });
      wrapper
        .find('.n2o-advanced-table-filter-dropdown-buttons button')
        .first()
        .simulate('click');
      expect(onFilter.calledOnce).toBe(true);
      expect(onFilter.getCall(0).args[0]).toEqual({
        id: 'name',
        value: 'test',
      });
    });
  });

  describe('тесты expandedContent', () => {
    it('отрисовывается подтаблица', () => {
      const newData = data.slice();
      set(newData, '[0].expandedContent', {
        type: 'table',
        columns: [
          {
            id: '1.1',
            title: 'Sub name',
            dataIndex: 'subName',
          },
        ],
        data: [
          {
            id: '1.1',
            subName: 'sub name',
          },
        ],
      });
      const wrapper = setup({
        expandable: true,
        expandedFieldId: 'expandedContent',
        data: newData,
      });

      wrapper.find('.n2o-advanced-table-expand').simulate('click');

      expect(wrapper.find('.n2o-advanced-table-nested').exists()).toBe(true);
    });

    it('отрисовывается html в подстроке', () => {
      const newData = data.slice();
      set(newData, '[0].expandedContent', {
        type: 'html',
        value: '<div class="test-class"/>',
      });
      const wrapper = setup({
        expandable: true,
        expandedFieldId: 'expandedContent',
        data: newData,
      });

      wrapper.find('.n2o-advanced-table-expand').simulate('click');

      expect(
        wrapper.find('.n2o-advanced-table-expanded-row-content').exists()
      ).toBe(true);
    });
  });

  describe('тесты rowSelection', () => {
    it('чекбокс в колонке отрисовался', () => {
      const wrapper = setup({ rowSelection: true });

      expect(wrapper.find('.n2o-advanced-table-selection-item').exists()).toBe(
        true
      );
    });

    it('отрисовалось правильное количество чекбоксов в строках', () => {
      const wrapper = setup({
        rowSelection: true,
      });
      console.log(wrapper.debug());
      expect(wrapper.find('CheckboxN2O input').length).toBe(4);
    });

    it('корректно отрабатывает выбор всех строк', () => {
      const wrapper = setup({
        rowSelection: true,
      });
      wrapper
        .find('CheckboxN2O input')
        .first()
        .simulate('change', { target: { checked: false } });

      expect(
        wrapper
          .find('AdvancedTable')
          .last()
          .state().checkedAll
      ).toBe(true);
      expect(
        wrapper
          .find('AdvancedTable')
          .last()
          .state().checked
      ).toEqual({
        '1': true,
        '2': true,
        '3': true,
      });

      wrapper
        .find('CheckboxN2O input')
        .first()
        .simulate('change', { target: { checked: true } });

      expect(
        wrapper
          .find('AdvancedTable')
          .last()
          .state().checkedAll
      ).toBe(false);
      expect(
        wrapper
          .find('AdvancedTable')
          .last()
          .state().checked
      ).toEqual({
        '1': false,
        '2': false,
        '3': false,
      });
    });

    it('корректно отрабатывает выбор строк', () => {
      const wrapper = setup({
        rowSelection: true,
      });

      const table = wrapper.find('AdvancedTable').last();
      const checkboxes = wrapper.find('CheckboxN2O input');

      checkboxes.at(1).simulate('change', { target: { checked: false } });
      console.log('point');
      expect(table.state().checkedAll).toBe(false);
      expect(table.state().checked).toEqual({
        '1': true,
        '2': false,
        '3': false,
      });

      checkboxes.at(2).simulate('change', { target: { checked: false } });

      expect(table.state().checkedAll).toBe(false);
      expect(table.state().checked).toEqual({
        '1': true,
        '2': true,
        '3': false,
      });

      checkboxes.at(3).simulate('change', { target: { checked: false } });

      expect(table.state().checkedAll).toBe(true);
      expect(table.state().checked).toEqual({
        '1': true,
        '2': true,
        '3': true,
      });
    });
  });
});
