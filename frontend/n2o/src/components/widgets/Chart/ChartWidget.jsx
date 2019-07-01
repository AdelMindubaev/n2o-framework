import React from 'react';
import PropTypes from 'prop-types';
import dependency from '../../../core/dependency';
import StandardWidget from '../StandardWidget';
import ChartContainer from './ChartWidgetContainer';
import Fieldsets from '../Form/fieldsets';

/**
 * Виджет графиков
 * @param widgetId
 * @param toolbar
 * @param disabled
 * @param actions
 * @param chart
 * @param pageId
 * @param filter
 * @param rest
 * @param resolveProps
 * @return {*}
 * @constructor
 */
function ChartWidget(
  { id: widgetId, toolbar, disabled, actions, chart, pageId, filter, ...rest },
  { resolveProps }
) {
  const prepareFilters = () => resolveProps(filter, Fieldsets.StandardFieldset);
  const getWidgetProps = () => ({
    widgetId,
    toolbar,
    disabled,
    actions,
    pageId,
    chart,
    ...rest,
  });

  const { fetchOnInit } = chart;

  return (
    <StandardWidget
      disabled={disabled}
      widgetId={widgetId}
      toolbar={toolbar}
      actions={actions}
      filter={prepareFilters()}
    >
      <ChartContainer
        widgetId={widgetId}
        pageId={pageId}
        fetchOnInit={fetchOnInit}
        {...getWidgetProps()}
      />
    </StandardWidget>
  );
}

ChartWidget.propTypes = {
  pageId: PropTypes.string.isRequired,
  widgetId: PropTypes.string,
  actions: PropTypes.object,
  toolbar: PropTypes.object,
  dataProvider: PropTypes.object,
  chart: PropTypes.arrayOf(PropTypes.shape({})),
};

ChartWidget.defaultProps = {
  toolbar: {},
  filter: {},
  chart: {},
};

ChartWidget.contextTypes = {
  resolveProps: PropTypes.func,
};

export default dependency(ChartWidget);
