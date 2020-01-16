import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import UncontrolledButtonDropdown from 'reactstrap/lib/UncontrolledButtonDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import { connect } from 'react-redux';
import { toggleColumnVisiblity } from '../../../actions/columns';
import { getContainerColumns } from '../../../selectors/columns';

/**
 * Дропдаун для скрытия/показа колонок в таблице
 * @reactProps {string} entityKey - id виджета, размер которого меняется
 * @reactProps {array} columns - кологки(приходит из редакса)
 * @example
 * <ToggleColumn entityKey='TestEntityKey'/>
 */
class ToggleColumnOld extends React.Component {
  constructor(props) {
    super(props);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  /**
   * меняет видимость колонки по id
   * @param id
   */
  toggleVisibility(id) {
    const { dispatch, entityKey } = this.props;
    dispatch(toggleColumnVisiblity(entityKey, id));
  }

  /**
   * рендер дропдауна
   * @param columns
   */
  renderColumnDropdown(columns) {
    const notActive = (filter(columns, item => !item.value.visible) || []).map(
      col => col.key
    );
    return columns.map((column, i) => {
      const checked = !notActive.includes(column.key);
      return (
        <DropdownItem
          key={i}
          toggle={false}
          onClick={() => this.toggleVisibility(column.key)}
        >
          <span className="n2o-dropdown-check-container">
            {checked && <i className="fa fa-check" aria-hidden="true" />}
          </span>
          <span>{column.value.label || column.key}</span>
        </DropdownItem>
      );
    });
  }

  /**
   * Базовый рендер
   * @returns {*}
   */
  render() {
    const { columns } = this.props;
    const columnsArray = map(columns || {}, (value, key) => ({ key, value }));
    const filteredColumns = filter(
      columnsArray,
      ({ value }) => value.frozen !== true
    );

    return (
      <UncontrolledButtonDropdown>
        <DropdownToggle caret>
          <i className="fa fa-table" />
        </DropdownToggle>
        <DropdownMenu>
          {isArray(filteredColumns)
            ? this.renderColumnDropdown(filteredColumns)
            : null}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    );
  }
}

ToggleColumnOld.propTypes = {
  columns: PropTypes.object,
  entityKey: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  return {
    columns: getContainerColumns(props.entityKey)(state),
  };
};

export { ToggleColumnOld };
export default connect(mapStateToProps)(ToggleColumnOld);
