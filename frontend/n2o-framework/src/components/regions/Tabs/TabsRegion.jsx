import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import pull from 'lodash/pull';
import some from 'lodash/some';
import { compose, setDisplayName } from 'recompose';
import classNames from 'classnames';

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
      permissionsVisibleTabs: {},
    };
    this.handleChangeActive = this.handleChangeActive.bind(this);
  }

  componentWillUnmount() {
    this.props.changeActiveEntity(null);
  }

  handleChangeActive(event, id, prevId) {
    const {
      lazy,
      alwaysRefresh,
      getWidgetProps,
      fetchWidget,
      changeActiveEntity,
    } = this.props;

    const { readyTabs } = this.state;

    const widgetId = id.replace('_', '');
    const widgetProps = getWidgetProps(widgetId);

    if (lazy) {
      if (alwaysRefresh) {
        pull(readyTabs, prevId);
        fetchWidget(widgetId);
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
    return map(this.props.tabs, tab => tab.id);
  }

  isVisibleWidget(id) {
    const { getWidgetProps } = this.props;
    const widgetProps = getWidgetProps(id);

    return get(widgetProps, 'isVisible');
  }

  atLeastOneVisibleWidget(content) {
    return some(content, meta => {
      if (meta.content) {
        return this.atLeastOneVisibleWidget(meta.content);
      }

      return this.isVisibleWidget(meta.id);
    });
  }

  tabVisible(tab) {
    const content = get(tab, 'content');

    return this.atLeastOneVisibleWidget(content);
  }

  regionVisible(tabs) {
    return some(tabs, tab => this.tabVisible(tab));
  }

  render() {
    const {
      tabs,
      lazy,
      activeEntity,
      className,
      hideSingleTab,
      maxHeight,
      scrollbar,
      title,
    } = this.props;

    const { readyTabs, permissionsVisibleTabs } = this.state;

    return (
      <div
        className={classNames('n2o-tabs-region', {
          visible: this.regionVisible(tabs),
        })}
      >
        <Tabs
          className={className && className}
          activeId={activeEntity}
          onChangeActive={this.handleChangeActive}
          hideSingleTab={hideSingleTab}
          dependencyVisible={this.regionVisible(tabs)}
          maxHeight={maxHeight}
          scrollbar={scrollbar}
          title={title}
        >
          {map(tabs, tab => {
            const { security, content } = tab;
            const permissionVisible = get(permissionsVisibleTabs, tab.id, true);
            const visible = permissionVisible && this.tabVisible(tab);
            const tabProps = {
              key: tab.id,
              id: tab.id,
              title: tab.label || tab.widgetId,
              icon: tab.icon,
              active: tab.opened,
              visible: visible,
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
      </div>
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
