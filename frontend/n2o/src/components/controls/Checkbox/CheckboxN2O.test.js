import React from 'react';
import { shallow } from 'enzyme';
import CheckboxN2O from './CheckboxN2O';
import sinon from 'sinon';
import { isNil } from 'lodash';

const setup = propsOverrides => {
  const props = Object.assign(
    {
      value: '123',
      checked: false
    },
    propsOverrides
  );

  const wrapper = mount(<CheckboxN2O {...props} />);

  return {
    wrapper,
    props
  };
};

describe('<CheckboxN2O />', () => {
  it('создание чекбокса', () => {
    const { wrapper } = setup();

    expect(wrapper.find('input[type="checkbox"]').exists()).toBeTruthy();
  });

  it('классы чекбокса', () => {
    const { wrapper } = setup({ name: 'name' });

    expect(wrapper.find('div.custom-control').exists()).toBeTruthy();
    expect(wrapper.find('div.custom-checkbox').exists()).toBeTruthy();
    expect(wrapper.find('input.custom-control-input').exists()).toBeTruthy();
    expect(wrapper.find('label.custom-control-label').exists()).toBeTruthy();
  });

  it('onFocus', () => {
    const onFocus = sinon.spy();
    const { wrapper } = setup({ onFocus });
    wrapper.find('Input').simulate('focus');
    expect(onFocus.calledOnce).toBe(true);
  });

  it('onBlur', () => {
    const onBlur = sinon.spy();
    const { wrapper } = setup({ onBlur });
    wrapper.find('Input').simulate('blur');
    expect(onBlur.calledOnce).toBe(true);
  });

  it('onChange', () => {
    const onChange = sinon.spy();
    const { wrapper } = setup({ onChange });
    wrapper.find('Input').simulate('change');
    expect(onChange.calledOnce).toBe(true);
  });

  it('value и checked', () => {
    const { wrapper } = setup({ value: true });
    expect(wrapper.find('Input').props().value).toBe(true);
    expect(wrapper.find('Input').props().checked).toBe(false);
  });
});
