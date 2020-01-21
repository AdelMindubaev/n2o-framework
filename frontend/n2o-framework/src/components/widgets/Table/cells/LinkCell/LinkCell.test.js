import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { Link, HashRouter } from 'react-router-dom';
import LinkCell, { LinkCell as LinkComponent } from './LinkCell';
import meta from './LinkCell.meta';

import FactoryProvider from '../../../../../core/factory/FactoryProvider';
import createFactoryConfig from '../../../../../core/factory/createFactoryConfig';

const setupLinkCell = propsOverride => {
  const props = {
    ...meta,
    model: {
      name: 'test name',
    },
  };
  return mount(
    <Provider store={configureMockStore()({})}>
      <FactoryProvider config={createFactoryConfig()}>
        <HashRouter>
          <LinkCell {...props} {...propsOverride} />
        </HashRouter>
      </FactoryProvider>
    </Provider>
  );
};

describe('Тесты LinkCell', () => {
  it('Отрисовывается', () => {
    const wrapper = setupLinkCell({
      model: {
        name: 'test name',
      },
    });
    expect(wrapper.find('Button').exists()).toEqual(true);
  });
  it('Отрисовывается icon', () => {
    const wrapper = setupLinkCell({
      icon: 'fa fa-plus',
      type: 'icon',
    });
    expect(wrapper.find('.fa.fa-plus').exists()).toEqual(true);
  });

  it('Отрисовыается ссылка по таргету "application"', () => {
    const wrapper = setupLinkCell({
      url: '/n2o/test',
      target: 'application',
    });
    expect(wrapper.find('a').exists()).toEqual(true);
  });
  it('Отрисовывается ссылка по таргету "self"', () => {
    const wrapper = setupLinkCell({
      url: '/n2o/self/test',
      target: 'self',
    });
    expect(wrapper.find('a[href="/n2o/self/test"]').exists()).toEqual(true);
  });
  it('Отрисовывается ссылка по таргету "newWindow"', () => {
    const wrapper = setupLinkCell({
      url: 'https://google.com',
      target: 'newWindow',
    });
    expect(wrapper.find('a[target="_blank"]').exists()).toEqual(true);
  });
});
