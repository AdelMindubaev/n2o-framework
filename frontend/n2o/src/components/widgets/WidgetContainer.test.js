import React from 'react';
import { Provider } from 'react-redux';
import WidgetContainer from './WidgetContainer';
import history from '../../history';
import configureStore from '../../store';

const NullComponent = () => null;
const store = configureStore({}, history, {});

const setup = propsOverride => {
  const Component = WidgetContainer({}, 'tree')(NullComponent);
  return mount(
    <Provider store={store}>
      <Component {...propsOverride} />
    </Provider>
  );
};

describe('<WidgetContainer />', () => {
  it('componentDidMount -> onFetch', () => {
    const wrapper = setup({
      fetchOnInit: true,
      visible: true,
      widgetId: 'testWidgetId',
      pageId: 'testId',
    });
    expect(store.getState().widgets.testWidgetId.pageId).toBe('testId');
  });
});
