import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { StateDecorator, Store } from '@sambego/storybook-state';

import SideBar from './SideBar';
import { SideBar as SidebarComponent } from './SideBar';
import Template from '../OLD_SidebarFixTemplate';
import Wireframe from '../../components/snippets/Wireframe/Wireframe';
import sidebarMetadata from './sidebarMetadata.meta.json';

const store = new Store({
  visible: true,
});

store.subscribe(forceReRender);

const stories = storiesOf('UI Компоненты/Меню слева', module);
stories.addDecorator(jsxDecorator);
stories.addDecorator(StateDecorator(store));
stories.addParameters({
  info: {
    propTables: [SidebarComponent],
    propTablesExclude: [SideBar, Wireframe],
  },
});

stories.add('Сжатие', () => {
  return (
    <React.Fragment>
      <button
        style={{ marginBottom: '10px' }}
        className="btn btn-secondary"
        onClick={() => store.set({ visible: !store.state.visible })}
      >
        <i className="fa fa-bars" />
      </button>
      <Template>
        <SideBar
          brandImage={
            'https://avatars0.githubusercontent.com/u/25926683?s=200&v=4'
          }
          activeId={'link'}
          items={sidebarMetadata.items}
          visible={store.state.visible}
          collapse={false}
          color="inverse"
        />
        <div
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          <Wireframe
            style={{ top: 0, bottom: 0 }}
            className="n2o"
            title="Тело страницы"
          />
        </div>
      </Template>
    </React.Fragment>
  );
});
