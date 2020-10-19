import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import map from 'lodash/map';
import find from 'lodash/find';
import get from 'lodash/get';
import pull from 'lodash/pull';
import { compose, setDisplayName } from 'recompose';

import SecurityCheck from '../../../core/auth/SecurityCheck';

import withRegionContainer from '../withRegionContainer';
import withWidgetProps from '../withWidgetProps';
import RegionContent from '../RegionContent';

import Tabs from './Tabs';
import Tab from './Tab';

/**
 * Регион Таб
 * @reactProps {array} tabs - массив из объектов, которые описывают виджет {id, name, opened, pageId, fetchOnInit, widget}
 * @reactProps {function} getWidget - функция получения виджета
 * @reactProps {string} pageId - идентификатор страницы
 * @reactProps {function} resolveVisibleDependency - резол видимости таба
 * @reactProps {function} hideSingleTab - скрывать / не скрывать навигацию таба, если он единственный
 */
class TabRegion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readyTabs: this.findReadyTabs(),
      visibleTabs: {},
    };
    this.handleChangeActive = this.handleChangeActive.bind(this);
  }

  componentWillUnmount() {
    this.props.changeActiveEntity(null);
  }

  handleChangeActive(id, prevId) {
    const {
      tabs,
      lazy,
      alwaysRefresh,
      getWidgetProps,
      fetchWidget,
      changeActiveEntity,
    } = this.props;
    const { readyTabs } = this.state;
    const widgetId = get(
      find(tabs, ({ id: tabId }) => tabId === id),
      'widgetId'
    );

    const widgetProps = getWidgetProps(widgetId);

    if (lazy) {
      if (alwaysRefresh) {
        pull(readyTabs, prevId);
      }
      readyTabs.push(id);
      this.setState(() => ({
        readyTabs: [...readyTabs],
      }));
    } else if (alwaysRefresh || isEmpty(widgetProps.datasource)) {
      widgetProps.dataProvider && fetchWidget(widgetId);
    }

    changeActiveEntity(id);
  }

  findReadyTabs() {
    return filter(
      map(this.props.tabs, tab => {
        if (tab.opened) {
          return tab.id;
        }
      }),
      item => item
    );
  }

  render() {
    const {
      tabs,
      getWidgetProps,
      getVisible,
      pageId,
      lazy,
      activeEntity,
      className,
      hideSingleTab,
    } = this.props;

    const { readyTabs, visibleTabs } = this.state;

    return (
      <Tabs
        className={className && className}
        activeId={activeEntity}
        onChangeActive={this.handleChangeActive}
        hideSingleTab={hideSingleTab}
      >
        {map(tabs, tab => {
          const { security, content } = tab;
          const widgetProps = getWidgetProps(tab.widgetId);
          const dependencyVisible = getVisible(pageId, tab.id);
          const widgetVisible = get(widgetProps, 'isVisible', true);
          const tabVisible = get(visibleTabs, tab.id, true);

          const tabProps = {
            key: tab.id,
            id: tab.id,
            title: tab.label || tab.widgetId,
            icon: tab.icon,
            active: tab.opened,
            visible: dependencyVisible && widgetVisible && tabVisible,
          };
          const tabEl = (
            <Tab {...tabProps}>
              {lazy ? (
                readyTabs.includes(tab.id) && (
                  <RegionContent
                    content={content}
                    tabSubContentClass={'tab-sub-content'}
                  />
                )
              ) : (
                <RegionContent
                  content={content}
                  tabSubContentClass={'tab-sub-content'}
                />
              )}
            </Tab>
          );
          const onPermissionsSet = permissions => {
            this.setState(prevState => ({
              visibleTabs: {
                ...prevState.visibleTabs,
                [tab.id]: !!permissions,
              },
            }));
          };

          return isEmpty(security) ? (
            tabEl
          ) : (
            <SecurityCheck
              {...tabProps}
              config={security}
              onPermissionsSet={onPermissionsSet}
              render={({ permissions, active, visible }) => {
                return permissions
                  ? React.cloneElement(tabEl, { active, visible })
                  : null;
              }}
            />
          );
        })}
      </Tabs>
    );
  }
}

TabRegion.propTypes = {
  /**
   * Список табов
   */
  tabs: PropTypes.array.isRequired,
  getWidget: PropTypes.func.isRequired,
  /**
   * контент Tab, (регион или виджет)
   */
  content: PropTypes.array,
  /**
   * ID странцы
   */
  pageId: PropTypes.string.isRequired,
  alwaysRefresh: PropTypes.bool,
  mode: PropTypes.oneOf(['single', 'all']),
  /**
   * Флаг ленивого рендера
   */
  lazy: PropTypes.bool,
  resolveVisibleDependency: PropTypes.func,
};

TabRegion.defaultProps = {
  alwaysRefresh: false,
  lazy: false,
  mode: 'single',
  hideSingleTab: false,
};

export { TabRegion };
export default compose(
  setDisplayName('TabsRegion'),
  withRegionContainer({ listKey: 'tabs' }),
  withWidgetProps
)(TabRegion);
