import React from 'react';
import { mount } from 'enzyme';
import HintDropDown from '../HintDropDown';
import sinon from 'sinon';

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      visible: true,
      disabled: false
    },
    propOverrides
  );

  const wrapper = mount(<HintDropDown {...props} />);

  return {
    props,
    wrapper
  };
};

describe('<HintDropDown />', () => {
  it('проверяет создание элемента', () => {
    const { wrapper } = setup();

    expect(wrapper.find('Button').exists()).toBeTruthy();
    expect(wrapper.find('button.btn-link').exists()).toBeTruthy();
    expect(wrapper.find('button.btn-md').exists()).toBeTruthy();
  });

  it('Свойство label', () => {
    const { wrapper } = setup({ label: 'test' });
    expect(wrapper.find('Button').props().children[1]).toBe('test');
  });

  it('Свойство icon', () => {
    const { wrapper } = setup({ icon: 'test' });
    expect(wrapper.find('i.test').exists()).toBeTruthy();
  });

  it('Свойство visible', () => {
    const { wrapper } = setup({ visible: false });
    expect(wrapper.find('Button').length).toBe(0);
  });

  it('Свойство disabled', () => {
    const { wrapper } = setup({ disabled: true });
    expect(wrapper.find('button.disabled').exists()).toBeTruthy();
  });

  it('Свойство size', () => {
    const { wrapper } = setup({ size: 'md' });
    expect(wrapper.find('button.btn-md').exists()).toBeTruthy();
  });

  it('Свойство color', () => {
    const { wrapper } = setup({ color: 'primary' });
    expect(wrapper.find('button.btn-primary').exists()).toBeTruthy();
  });

  it('Создание элементов dropdown', () => {
    const { wrapper } = setup({
      menu: [
        {
          label: 'test'
        }
      ]
    });
    expect(wrapper.find('button.dropdown-item').exists()).toBeTruthy();
  });
  it('Проверка onClick по элементам dropdown если есть action', () => {
    const mockClick = sinon.spy();
    const { wrapper } = setup({
      onClick: mockClick,
      menu: [
        {
          label: 'test',
          action: 'test-action'
        }
      ]
    });

    wrapper
      .find('DropdownItem')
      .first()
      .simulate('click');
    wrapper.update();
    expect(mockClick.calledOnce).toEqual(true);
    expect(mockClick.calledWith('test-action')).toEqual(true);
  });
});
