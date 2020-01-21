import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { batchActions } from 'redux-batched-actions';
import map from 'lodash/map';
import UncontrolledButtonDropdown from 'reactstrap/lib/UncontrolledButtonDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';

import { makeWidgetSizeSelector } from '../../../selectors/widgets';
import { changeSizeWidget, dataRequestWidget } from '../../../actions/widgets';
import DropdownItem from 'reactstrap/lib/DropdownItem';

const SIZES = [5, 10, 20, 50];

/**
 * Дропдаун для выбора размера(size) виджета
 * @reactProps {string} entityKey - id виджета, размер которого меняется
 * @reactProps {number} size - текущий размер(приходит из редакса)
 * @example
 * <ChangeSize entityKey='TestEntityKey'/>
 */
function ChangeSize({ renderSizeDropdown }) {
  return (
    <UncontrolledButtonDropdown>
      <DropdownToggle caret>
        <i className="fa fa-list" />
      </DropdownToggle>
      <DropdownMenu>{renderSizeDropdown(SIZES)}</DropdownMenu>
    </UncontrolledButtonDropdown>
  );
}
ChangeSize.propTypes = {
  size: PropTypes.number,
  entityKey: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  return {
    size: makeWidgetSizeSelector(props.entityKey)(state),
  };
};

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    resize: ({ dispatch, entityKey }) => size =>
      batchActions([
        dispatch(changeSizeWidget(entityKey, size)),
        dispatch(dataRequestWidget(entityKey, { size, page: 1 })),
      ]),
  }),
  withHandlers({
    renderSizeDropdown: ({ size, resize }) => sizes =>
      map(sizes, (s, i) => (
        <DropdownItem key={i} toggle={false} onClick={() => resize(s)}>
          <span className="n2o-dropdown-check-container">
            {size === s && <i className="fa fa-check" aria-hidden="true" />}
          </span>
          <span>{s}</span>
        </DropdownItem>
      )),
  })
);

export { ChangeSize };
export default enhance(ChangeSize);
