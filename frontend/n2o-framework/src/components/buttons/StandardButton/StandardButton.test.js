import React from 'react';
import StandardButton from './StandardButton';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { push } from 'connected-react-router';

const mockStore = configureMockStore();
const delay = timeout => new Promise(res => setTimeout(res, timeout));
const setup = props => {
  const store = mockStore({});
  const wrapper = mount(
    <Provider store={store}>
      <StandardButton {...props} />
    </Provider>
  );

  return { store, wrapper };
};

describe('<StandardButton />', () => {
  describe('реализация вызова экшена', () => {
    it('Создание', () => {
      const { wrapper } = setup();
      expect(wrapper.find('Button').exists()).toBeTruthy();
    });
    it('Вызов экшена', async () => {
      const { wrapper, store } = setup({
        action: { type: 'n2o/button/Dummy' },
      });
      await wrapper.find('Button').simulate('click');
      await delay(100);
      expect(store.getActions()[1]).toEqual({ type: 'n2o/button/Dummy' });
    });
  });
  describe('реализация ссылки', () => {
    it('Создание', () => {
      const { wrapper } = setup({ url: '/testUrl', target: 'blank' });
      expect(wrapper.find('Button').exists()).toBeTruthy();
      expect(wrapper.find('Button').props().tag).toBe('a');
      expect(wrapper.find('Button').props().href).toBe('/testUrl');
      expect(wrapper.find('Button').props().target).toBe('blank');
    });
    it('Вызов экшена при клике inner=true', async () => {
      const { wrapper, store } = setup({
        url: 'testUrl',
        target: '_blank',
        inner: true,
        action: { type: 'n2o/button/Dummy' },
      });
      await wrapper.find('Button').simulate('click');
      await delay(100);
      expect(store.getActions()[1]).toEqual(push('/testUrl'));
    });
  });
});
