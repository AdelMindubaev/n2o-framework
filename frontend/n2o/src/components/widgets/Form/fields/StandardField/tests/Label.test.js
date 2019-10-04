import React from 'react';
import Label from '../Label';

const setup = propsOverride => {
  return shallow(<Label {...propsOverride} />);
};

describe('Проверка Label', () => {
  it('value = true', () => {
    const wrapper = setup({ value: <div /> });
    expect(wrapper.find('.col-form-label').exists()).toEqual(true);
  });
  it('required = true', () => {
    const wrapper = setup({ required: true });
    expect(wrapper.find('.n2o-field-label-required').exists()).toEqual(true);
  });
  it('help = true', () => {
    const wrapper = setup({ help: 'help', id: 'test' });
    expect(wrapper.find('HelpPopover').exists()).toEqual(true);
  });
});
