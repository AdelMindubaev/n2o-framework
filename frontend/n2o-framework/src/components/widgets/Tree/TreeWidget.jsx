import React from 'react';
import PropTypes from 'prop-types';

import TreeContainer from './container/TreeContainer';
import StandardWidget from '../StandardWidget';
import Fieldsets from '../Form/fieldsets';

import dependency from '../../../core/dependency';

/**
 * Виджет таблица
 * @reactProps {string} containerId - id контейнера
 * @reactProps {string} pageId - id страницы
 * @reactProps {string} widgetId - id виджета
 * @reactProps {object} actions
 * @reactProps {object} tools
 * @reactProps {object} dataProvider
 * @reactProps {object} table
 * @reactProps {number} table.size
 * @reactProps {boolean} table.fetchOnInit - фетчить / не фетчить данные при инициализации
 * @reactProps {boolean} table.hasSelect
 * @reactProps {string} table.className - css класс
 * @reactProps {object} table.style - css стили
 * @reactProps {boolean} table.autoFocus
 * @reactProps {object} table.sorting
 * @reactProps {array} table.headers
 * @reactProps {array} table.cells
 */
class TreeWidget extends React.Component {
  /**
   * Замена src на компонент
   */
  getWidgetProps() {
    const {
      hasFocus,
      hasSelect,
      autoFocus,
      rowClick,
      childIcon,
      multiselect,
      showLine,
      filter,
      expandBtn,
      bulkData,
      parentFieldId,
      valueFieldId,
      labelFieldId,
      iconFieldId,
      imageFieldIdd,
      badgeFieldId,
      badgeColorFieldId,
      hasCheckboxes,
      draggable,
      childrenFieldId,
      sortParam,
    } = this.props;
    const { toolbar, actions, dataProvider, placeholder } = this.props;
    const { resolveProps } = this.context;
    return {
      toolbar,
      actions,
      hasFocus,
      hasSelect,
      autoFocus,
      placeholder,
      dataProvider,
      rowClick,
      childIcon,
      multiselect,
      showLine,
      filter,
      expandBtn,
      bulkData,
      parentFieldId,
      valueFieldId,
      labelFieldId,
      iconFieldId,
      imageFieldIdd,
      badgeFieldId,
      badgeColorFieldId,
      hasCheckboxes,
      draggable,
      childrenFieldId,
      sortParam,
    };
  }

  render() {
    const {
      id: widgetId,
      toolbar,
      disabled,
      actions,
      fetchOnInit,
      pageId,
      className,
      style,
    } = this.props;
    return (
      <StandardWidget
        disabled={disabled}
        widgetId={widgetId}
        toolbar={toolbar}
        actions={actions}
        className={className}
        style={style}
      >
        <TreeContainer
          widgetId={widgetId}
          pageId={pageId}
          fetchOnInit={fetchOnInit}
          {...this.getWidgetProps()}
        />
      </StandardWidget>
    );
  }
}

TreeWidget.defaultProps = {
  toolbar: {},
  filter: {},
};

TreeWidget.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  containerId: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
  widgetId: PropTypes.string,
  actions: PropTypes.object,
  toolbar: PropTypes.object,
  dataProvider: PropTypes.object,
};

TreeWidget.contextTypes = {
  resolveProps: PropTypes.func,
};

export default dependency(TreeWidget);
