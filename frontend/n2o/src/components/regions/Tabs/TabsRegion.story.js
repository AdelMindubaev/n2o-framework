import React from 'react';
import { storiesOf } from '@storybook/react';

import { set, pullAt, omit, pick } from 'lodash';

import TabsRegion, { TabRegion as TabsRegionComponent } from './TabsRegion';
import { metadataSuccess } from '../../../actions/pages';
import { hideWidget, showWidget } from '../../../actions/widgets';
import HtmlWidgetJson from '../../widgets/Html/HtmlWidget.meta';
import ListMetadata from '../List/ListMetadata.meta';
import SecureTabRegionJson from './TabsRegions.meta';
import AuthButtonContainer from '../../../core/auth/AuthLogin';
import configureStore from '../../../store';
import authProviderExample from '../../../../.storybook/auth/authProviderExample';
import { makeStore } from '../../../../.storybook/decorators/utils';
import cloneObject from '../../../utils/cloneObject';
import { InitWidgentsTabs } from 'N2oStorybook/json';
import TabsWithDependency from 'N2oStorybook/json/TabsWithDependency';
import fetchMock from 'fetch-mock';
import { getStubData } from 'N2oStorybook/fetchMock';
import CheckboxN2O from '../../controls/Checkbox/CheckboxN2O';

const stories = storiesOf('Регионы/Вкладки', module);

stories.addParameters({
  info: {
    propTables: [TabsRegionComponent],
    propTablesExclude: [TabsRegion, AuthButtonContainer],
  },
});

const TabsRegionJson = set(
  cloneObject(SecureTabRegionJson),
  'tabs',
  pullAt(cloneObject(SecureTabRegionJson).tabs, 0)
);

const { store } = makeStore();

stories
  .add(
    'Метаданные',
    () => {
      store.dispatch(metadataSuccess('Page', HtmlWidgetJson));

      return <TabsRegion {...TabsRegionJson} pageId="Page" />;
    },
    {
      info: {
        text: `
      Компонент 'Табы'
      ~~~js
      import TabsRegion from 'n2o/lib/components/regions/Tabs/TabsRegion';
      
      <TabsRegion 
          pageId="Page"
          tabs={[
            {
              id: "tab1",
              opened: true,
              fetchOnInit: true,
              widgetId: "Page_Html",
              label: "HTML"
            }
          ]} 
       />
      ~~~
      `,
      },
    }
  )
  .add('Ограничение доступа', () => {
    store.dispatch(metadataSuccess('Page', ListMetadata));
    return (
      <div>
        <small>
          Введите <mark>admin</mark>, чтобы увидеть скрытый виджет региона
        </small>
        <AuthButtonContainer />
        <br />
        <TabsRegion {...SecureTabRegionJson} pageId="Page" />
      </div>
    );
  })
  .add('Lazy запрос за данными', () => {
    fetchMock
      .restore()
      .get('begin:n2o/data/test', getStubData)
      .get('begin:n2o/data2/test', async url => {
        await new Promise(r =>
          setTimeout(() => {
            r();
          }, 2000)
        );
        return getStubData(url);
      });

    store.dispatch(
      metadataSuccess('Page', { ...pick(InitWidgentsTabs, 'widgets') })
    );

    return <TabsRegion {...omit(InitWidgentsTabs, 'widgets')} pageId="Page" />;
  })
  .add('Автоматические скрытие', () => {
    fetchMock
      .restore()
      .get('begin:n2o/data/test', getStubData)
      .get('begin:n2o/data2/test', async url => {
        await new Promise(r =>
          setTimeout(() => {
            r();
          }, 2000)
        );
        return getStubData(url);
      });

    store.dispatch(metadataSuccess('Page', { ...TabsWithDependency }));

    return (
      <React.Fragment>
        <button
          className="btn btn-secondary"
          onClick={() => {
            store.dispatch(hideWidget('Page_Table_2'));
          }}
        >
          Скрыть виджет Page_Table_2
        </button>
        {` `}
        <button
          className="btn btn-secondary"
          onClick={() => {
            store.dispatch(showWidget('Page_Table_2'));
          }}
        >
          Показать виджет Page_Table_2
        </button>
        <br />
        <br />
        <TabsRegion {...TabsWithDependency} pageId="Page" />
      </React.Fragment>
    );
  });
