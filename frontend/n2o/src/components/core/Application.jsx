import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  withContext,
  branch,
  renderComponent,
  lifecycle,
} from 'recompose';
import { createStructuredSelector } from 'reselect';
import numeral from 'numeral';
import 'numeral/locales/ru';
import { requestConfig as requestConfigAction } from '../../actions/global';
import { globalSelector } from '../../selectors/global';
import CoverSpinner from '../snippets/Spinner/CoverSpinner';
import Alert from '../snippets/Alerts/Alert';

numeral.locale('ru');

function Application({ locale, messages, render }) {
  return render(locale, messages);
}

Application.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  menu: PropTypes.object,
  loading: PropTypes.bool,
  render: PropTypes.func,
  requestConfig: PropTypes.func,
  error: PropTypes.object,
};

const mapStateToProps = state => ({
  ...globalSelector(state),
});

const mapDispatchToProps = dispatch => ({
  requestConfig: bindActionCreators(requestConfigAction, dispatch),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withContext(
    {
      getLocale: PropTypes.func,
      getMessages: PropTypes.func,
      getMenu: PropTypes.func,
      getFromConfig: PropTypes.func,
    },
    props => ({
      getLocale: () => props.locale,
      getMessages: () => props.messages,
      getMenu: () => props.menu,
      getFromConfig: key => get(props, key),
    })
  ),
  lifecycle({
    componentWillMount() {
      this.props.requestConfig();
    },
  }),
  branch(props => props.loading, renderComponent(CoverSpinner)),
  // todo: Исправить через Alerts систему N2O или через нотификации
  branch(
    props => props.error,
    () => props => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Alert {...props.error} />
      </div>
    )
  )
)(Application);
