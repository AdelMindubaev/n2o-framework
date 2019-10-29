import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Alerts from '../snippets/Alerts/Alerts';
import { makeAlertsByKeySelector } from '../../selectors/alerts';
import { removeAlert } from '../../actions/alerts';

/**
 * Компонент-редакс-обертка над алертами виджета
 * @reactProps {string} widgetId - уникальный индефикатор виджета
 * @reactProps {array} alerts - массив алертов
 */
export function WidgetAlerts(props) {
  const { alerts, onDismiss } = props;
  const mapAlertsProps = (alerts, onDismiss) => {
    return map(alerts, alert => ({
      ...alert,
      key: alert.id,
      onDismiss: () => onDismiss(alert.id),
      details: alert.stacktrace,
    }));
  };
  return (
    <div className="n2o-alerts">
      <Alerts alerts={mapAlertsProps(alerts, onDismiss)} />
    </div>
  );
}

WidgetAlerts.propTypes = {
  widgetId: PropTypes.string,
  alerts: PropTypes.array,
};

WidgetAlerts.defaultProps = {
  alerts: [],
};

const mapStateToProps = createStructuredSelector({
  alerts: (state, props) => {
    return makeAlertsByKeySelector(props.widgetId)(state, props);
  },
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onDismiss: alertId => {
      dispatch(removeAlert(ownProps.widgetId, alertId));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetAlerts);
