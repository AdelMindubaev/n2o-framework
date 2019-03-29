import React from 'react';
import sinon from 'sinon';

import InputNumber from './InputNumber';

const setup = propOverrides => {
  const props = Object.assign(
    {
      // use this to assign some default props
    },
    propOverrides
  );

  const wrapper = mount(<InputNumber {...props} />);

  return {
    props,
    wrapper
  };
};

describe('<InputNumber />', () => {
  it('можно вводить значение null', () => {
    const { wrapper } = setup({
      value: null,
      step: 1
    });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('');
  });

  it('можно вводить строку, которую можно привести к числу', () => {
    const { wrapper } = setup({
      value: 2.4,
      step: '0.1'
    });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2.4');
  });

  it('можно вводить строку, не приводимую к числу, значение которой будет проигнорировано', () => {
    const { wrapper } = setup({
      value: 'Строковое значение, которое будет проигнорировано',
      step: 1
    });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('');
  });

  it('можно вводить как целые, так и с точкой', () => {
    let { wrapper } = setup({ value: 2, step: '1' });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2');
    wrapper = setup({ value: 2.4, step: '1' }).wrapper;
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2');
    wrapper = setup({ value: 2.4, step: '1.0' }).wrapper;
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2.4');
  });

  it('увеличивает/уменьшает значение при нажатии на кнопку', () => {
    const { wrapper } = setup({ value: 2, step: '1' });
    wrapper.find('.fa.fa-angle-up').simulate('click');
    wrapper.update();
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('3');
    wrapper.find('.fa.fa-angle-down').simulate('click');
    wrapper.update();
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2');
  });

  it('увеличивает/уменьшает значение при  работе с клавиатурой', () => {
    const { wrapper } = setup({ value: 2, step: '1' });
    wrapper.find('input').simulate('keyDown', { keyCode: 40 });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('1');
    wrapper.find('input').simulate('keyDown', { keyCode: 38 });
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('2');
  });

  it('округляет до количества знаков после запятой в step', () => {
    const { wrapper } = setup({ value: 2, step: '0.00' });
    wrapper.find('input').simulate('change', { target: { value: '100.999999' } });
    wrapper.find('input').simulate('blur');
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('101.00');
  });

  it('добавляет нули после точки', () => {
    const { wrapper } = setup({ value: 2, step: '0.00' });
    wrapper.find('input').simulate('change', { target: { value: '100' } });
    wrapper.find('input').simulate('blur');
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('100.00');
    wrapper.find('input').simulate('change', { target: { value: '100.1' } });
    wrapper.find('input').simulate('blur');
    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toBe('100.10');
  });

  it('видимый/невидимый по visible ', () => {
    let { wrapper } = setup({ visible: false });
    expect(wrapper.find('input')).toHaveLength(0);
    wrapper = setup({ visible: true }).wrapper;
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it(' доступен для изменения по disable ', () => {
    const { wrapper } = setup({ disabled: true, value: 1, step: '1' });
    expect(
      wrapper
        .find('input')
        .first()
        .props().disabled
    ).toBe(true);
    expect(
      wrapper
        .find('button')
        .at(0)
        .props().disabled
    ).toBe(true);
    expect(
      wrapper
        .find('button')
        .at(1)
        .props().disabled
    ).toBe(true);
  });

  it('значения больше max невалидны', () => {
    const { wrapper } = setup({ disabled: false, value: 1, max: 10, step: '1' });
    wrapper.find('input').simulate('change', { target: { value: '9' } });
    wrapper.find('input').simulate('blur');
    expect(wrapper.find('input').props().value).toBe('9');
    wrapper.find('input').simulate('change', { target: { value: '100.999999' } });
    wrapper.find('input').simulate('blur');
    expect(wrapper.find('input').props().value).toBe('9');
  });

  it('значения меньше min невалидны', () => {
    const { wrapper } = setup({ disabled: false, value: 1, min: -10, step: '1' });
    wrapper.find('input').simulate('change', { target: { value: '9' } });
    wrapper.find('input').simulate('blur');
    expect(wrapper.find('input').props().value).toBe('9');
    wrapper.find('input').simulate('change', { target: { value: '-100.999999' } });
    wrapper.find('input').simulate('blur');
    expect(wrapper.find('input').props().value).toBe('9');
  });

  it('показывает/скрывает кнопки по showButtons', () => {
    let { wrapper } = setup({ showButtons: true, value: 1, step: '1' });
    expect(wrapper.find('.n2o-input-number-buttons')).toHaveLength(1);
    wrapper = setup({ showButtons: false, value: 1, step: '1' }).wrapper;
    expect(wrapper.find('.n2o-input-number-buttons')).toHaveLength(0);
  });

  it('вызывает onChange при изменении', () => {
    const onChange = sinon.spy();
    let { wrapper } = setup({ onChange, value: 1, step: '1' });
    wrapper.find('input').simulate('change', { target: { value: '-100.999999' } });
    expect(onChange.calledOnce).toBe(true);
  });

  it('оботражает 0 после обновления', () => {
    const { wrapper } = setup({
      value: ''
    });
    expect(wrapper.state().value).toEqual(null);
    wrapper.setProps({
      value: 0
    });
    expect(wrapper.state().value).toEqual(0);
  });

  it('отображает целое число при вводе', () => {
    const { wrapper } = setup({
      value: '2'
    });
    wrapper.setProps({ value: 5 });
    expect(wrapper.state().value).toEqual(5);
  });
});
