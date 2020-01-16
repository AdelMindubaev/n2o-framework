import React from 'react';
import PropTypes from 'prop-types';
import UncontrolledButtonDropdown from 'reactstrap/lib/UncontrolledButtonDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import { connect } from 'react-redux';

import { changeSizeWidget, dataRequestWidget } from '../../../actions/widgets';
import { makeWidgetSizeSelector } from '../../../selectors/widgets';

/**
 * Дропдаун для выбора размера(size) виджета
 * @reactProps {string} entityKey - id виджета, размер которого меняется
 * @reactProps {number} size - текущий размер(приходит из редакса)
 * @example
 * <ChangeSize entityKey='TestEntityKey'/>
 */
class ChangeSizeOld extends React.Component {
  constructor(props) {
    super(props);
    this.sizes = [5, 10, 20, 50];
    this.resize = this.resize.bind(this);
  }

  /**
   * изменение размера
   * @param size
   */
  resize(size) {
    const { dispatch, entityKey } = this.props;
    dispatch(changeSizeWidget(entityKey, size));
    dispatch(dataRequestWidget(entityKey, { size, page: 1 }));
  }

  /**
   * рендер меню
   * @param sizes
   */
  renderSizeDropdown(sizes) {
    const { size } = this.props;
    return sizes.map((s, i) => {
      return (
        <DropdownItem key={i} toggle={false} onClick={() => this.resize(s)}>
          <span className="n2o-dropdown-check-container">
            {size === s && <i className="fa fa-check" aria-hidden="true" />}
          </span>
          <span>{s}</span>
        </DropdownItem>
      );
    });
  }

  /**
   * базовый рендер
   * @returns {*}
   */
  render() {
    return (
      <UncontrolledButtonDropdown>
        <DropdownToggle caret>
          <i className="fa fa-list" />
        </DropdownToggle>
        <DropdownMenu>{this.renderSizeDropdown(this.sizes)}</DropdownMenu>
      </UncontrolledButtonDropdown>
    );
  }
}

ChangeSizeOld.propTypes = {
  size: PropTypes.number,
  entityKey: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  return {
    size: makeWidgetSizeSelector(props.entityKey)(state),
  };
};

export { ChangeSizeOld };
export default connect(mapStateToProps)(ChangeSizeOld);
