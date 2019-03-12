import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Pagination from '../../snippets/Pagination/Pagination';
import {
  makeWidgetCountSelector,
  makeWidgetSizeSelector,
  makeWidgetPageSelector
} from '../../../selectors/widgets';
import { makeGetModelByPrefixSelector } from '../../../selectors/models';
import { dataRequestWidget, changePageWidget } from '../../../actions/widgets';
import { PREFIXES } from '../../../constants/models';

/**
 * Компонент табличной пейджинации. По `widgetId` автоматически определяет все свойства для `Paging`
 * @reactProps {string} widgetId - уникальный индефикатор виджета
 * @reactProps {number} count
 * @reactProps {number} size
 * @reactProps {number} activePage
 * @reactProps {function} onChangePage
 */
class TablePagination extends Component {
  render() {
    const {
      count,
      size,
      activePage,
      onChangePage,
      datasource,
      prev,
      next,
      first,
      last,
      lazy,
      showCountRecords,
      hideSinglePage,
      maxButtons,
      withoutBody,
      prevText,
      nextText
    } = this.props;

    if (isEmpty(datasource) && count > 0 && activePage > 1) {
      onChangePage(Math.ceil(count / size));
    }

    return (
      <Pagination
        onSelect={onChangePage}
        activePage={activePage}
        count={count}
        size={size}
        maxButtons={maxButtons}
        stepIncrement={10}
        prev={prev}
        prevText={prevText}
        next={next}
        nextText={nextText}
        first={first}
        last={last}
        lazy={lazy}
        showCountRecords={showCountRecords}
        hideSinglePage={hideSinglePage}
        withoutBody={withoutBody}
      />
    );
  }
}

TablePagination.propTypes = {
  widgetId: PropTypes.string,
  count: PropTypes.number,
  size: PropTypes.number,
  activePage: PropTypes.number,
  onChangePage: PropTypes.func,
  datasource: PropTypes.array,
  maxButtons: PropTypes.number
};

TablePagination.defaultProps = {
  datasource: [],
  maxButtons: 4
};

const mapStateToProps = createStructuredSelector({
  count: (state, props) => makeWidgetCountSelector(props.widgetId)(state, props),
  size: (state, props) => makeWidgetSizeSelector(props.widgetId)(state, props),
  activePage: (state, props) => makeWidgetPageSelector(props.widgetId)(state, props),
  datasource: (state, props) =>
    makeGetModelByPrefixSelector(PREFIXES.datasource, props.widgetId)(state, props)
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChangePage: page => {
      dispatch(
        dataRequestWidget(ownProps.widgetId, {
          page
        })
      );
    }
  };
}

TablePagination = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablePagination);
export default TablePagination;
