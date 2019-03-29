import React from 'react';
import sinon from 'sinon';
import { isEmpty } from 'lodash';
import { Provider } from 'react-redux';
import FactoryProvider from '../../../core/factory/FactoryProvider';
import createFactoryConfig from '../../../core/factory/createFactoryConfig';
import ListWidgetMeta from './List.meta';
import { createStore } from 'redux';
import ListContainer from './ListContainer';
import reducers from '../../../reducers';
import fetchMock from 'fetch-mock';

fetchMock.get('*', () => ({
  list: [
    {
      test: 'test',
    },
  ],
}));

const store = createStore(reducers);
const NullComponent = () => null;

const setup = propsOverride => {
  return mount(
    <Provider store={store}>
      <ListContainer
        dataProvider={ListWidgetMeta['List'].dataProvider}
        list={ListWidgetMeta['List'].list}
        {...propsOverride}
      >
        <NullComponent />
      </ListContainer>
    </Provider>
  );
};

const factoryProvider = () =>
  mount(
    <FactoryProvider config={createFactoryConfig({})}>
      <NullComponent />
    </FactoryProvider>
  );

describe('Проверка ListContainer', () => {
  it('Маппит данные в компоненты', () => {
    const wrapper = setup();
    const ListContainer = wrapper.find('ListContainer');
    ListContainer.setState({
      datasource: [
        {
          image: 'https://i.ytimg.com/vi/YCaGYUIfdy4/maxresdefault.jpg',
          header: "It's a cat",
          subHeader: 'The cat is stupid',
          body: 'Some words about cats',
          rightTop: 'What do you know about cats?',
          rightBottom: "But cats aren't only stupid they're still so sweet ",
          extra: 'Extra?!',
        },
      ],
    });
    const mappedData = ListContainer.instance().mapSectionComponents(
      factoryProvider()
        .instance()
        .resolveProps(ListWidgetMeta['List'].list, createFactoryConfig({}))
    );
    expect(!isEmpty(mappedData)).toEqual(true);
    expect(React.isValidElement(mappedData[0].image)).toEqual(true);
    expect(React.isValidElement(mappedData[0].header)).toEqual(true);
    expect(React.isValidElement(mappedData[0].subHeader)).toEqual(true);
    expect(React.isValidElement(mappedData[0].body)).toEqual(true);
    expect(React.isValidElement(mappedData[0].rightTop)).toEqual(true);
    expect(React.isValidElement(mappedData[0].rightBottom)).toEqual(true);
    expect(React.isValidElement(mappedData[0].extra)).toEqual(true);
  });
});
