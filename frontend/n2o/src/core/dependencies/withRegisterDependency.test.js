import React from 'react';
import withRegisterDependency from './withRegisterDependency';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '../../reducers';

const setup = (store, props = {}) => {
  const Component = withRegisterDependency(() => <div>test</div>);
  return mount(
    <Provider store={store}>
      <Component
        id={'test'}
        form={'testForm'}
        dependency={[
          {
            type: 'reRender',
            on: ['name']
          }
        ]}
        {...props}
      />
    </Provider>
  );
};

describe('Проверка хока withRegisterDependency', function() {
  it('регистрирует fields', () => {
    const store = createStore(reducers, {});
    expect(store.getState().form).toEqual({});
    const wrapper = setup(store);
    expect(store.getState().form.testForm.registeredFields.test).toEqual({
      isInit: false,
      visible: true,
      disabled: false,
      message: null,
      filter: [],
      dependency: [
        {
          type: 'reRender',
          on: ['name']
        }
      ],
      required: false
    });
  });
});
