import React from 'react';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import withFetchData from './withFetchData';

const dataUrl = 'test';

const mockStore = configureMockStore();
const store = mockStore({});

const delay = ms => new Promise(r => setTimeout(() => r(), ms));

const EmptyComponent = () => null;

const fetchData = fn => (...args) => {
  return new Promise((res, rej) => {
    const response = fn(...args);
    response.status ? rej(response) : res(response);
  });
};

const setup = (props = {}, fn = null) => {
  const ComponentWithListContainer = withFetchData(EmptyComponent, fetchData(fn));

  const wrapper = mount(
    <Provider store={store}>
      <ComponentWithListContainer {...props} />
    </Provider>
  );

  return {
    props,
    wrapper
  };
};

describe('fetchData HOC test', () => {
  it('проверяет создание элемента', () => {
    const { wrapper } = setup();

    expect(wrapper.find('EmptyComponent').exists()).toBeTruthy();
  });

  it('Проброс данных (data) в контейнер', () => {
    const { wrapper } = setup({ data: new Array(10) });

    expect(wrapper.find('EmptyComponent').props().data).toEqual(new Array(10));
  });

  it('Получение данных через dataProvider при вызове fetchData', async () => {
    fetchMock.get(dataUrl, { list: new Array(12) });

    let { wrapper } = setup({ dataProvider: { url: dataUrl } }, () => ({ list: new Array(12) }));

    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData();

    await delay(400);
    wrapper.update();
    expect(wrapper.find('EmptyComponent').props().data.length).toBe(12);
  });

  it('Вызов fetchData с параметрами', async () => {
    let { wrapper } = setup({ dataProvider: { url: dataUrl } }, params => ({
      ...params,
      count: 20
    }));
    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData({ page: 10, size: 2 });

    await delay(400);
    wrapper.update();
    expect(wrapper.find('EmptyComponent').props().count).toBe(20);
    expect(wrapper.find('EmptyComponent').props().page).toBe(10);
    expect(wrapper.find('EmptyComponent').props().size).toBe(2);
  });

  it('Мердж данных при fetchData merge=true', async () => {
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    let { wrapper } = setup({ dataProvider: { url: dataUrl } }, () => ({
      list
    }));

    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData(null, true);

    await delay(400);
    wrapper.update();
    expect(wrapper.find('EmptyComponent').props().data.length).toBe(5);

    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData(null, true);

    await delay(400);

    wrapper.update();
    expect(wrapper.find('EmptyComponent').props().data.length).toBe(5);
  });

  it('Обработка серверной ошибки', async () => {
    let { wrapper } = setup({ dataProvider: { url: dataUrl } }, () => ({
      status: 401,
      response: {
        json: () => ({
          meta: {
            alert: {
              messages: [
                {
                  severity: 'danger',
                  text: 'Произошла внутренняя ошибка'
                }
              ]
            }
          }
        })
      }
    }));

    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData();

    await delay(400);
    expect(store.getActions()[1].payload.severity).toBe('danger');
    expect(store.getActions()[1].payload.text).toBe('Произошла внутренняя ошибка');
  });

  it('Проверка caching при fetchData', async () => {
    let count = 0;
    let { wrapper } = setup({ dataProvider: { url: dataUrl }, caching: true }, () => {
      count += 1;
      return { list: new Array(12) };
    });

    wrapper
      .find('EmptyComponent')
      .props()
      ._fetchData();

    await delay(400);
    expect(count).toBe(0);
  });
});
