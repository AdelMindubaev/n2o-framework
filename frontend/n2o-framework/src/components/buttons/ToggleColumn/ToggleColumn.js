import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import UncontrolledButtonDropdown from 'reactstrap/lib/UncontrolledButtonDropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import { getContainerColumns } from '../../../selectors/columns';
import { toggleColumnVisiblity } from '../../../actions/columns';

/**
 * Дропдаун для скрытия/показа колонок в таблице
 * @reactProps {string} entityKey - id виджета, размер которого меняется
 * @reactProps {array} columns - кологки(приходит из редакса)
 * @example
 * <ToggleColumn entityKey='TestEntityKey'/>
 */
function ToggleColumn(props) {
  const { columns, renderColumnDropdown } = props;
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
          ? renderColumnDropdown(filteredColumns)
          : null}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  );
}

ToggleColumn.propTypes = {
  columns: PropTypes.object,
  entityKey: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  return {
    columns: getContainerColumns(props.entityKey)(state),
  };
};

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    toggleVisibility: ({ dispatch, entityKey }) => id =>
      dispatch(toggleColumnVisiblity(entityKey, id)),
  }),
  withHandlers({
    renderColumnDropdown: ({ toggleVisibility }) => columns => {
      const notActive = map(
        filter(columns, item => !item.value.visible) || [],
        col => col.key
      );

      return map(columns, ({ key, value }, i) => {
        const checked = !includes(notActive, key);
        const { conditions } = value;

        return (
          isEmpty(conditions) && (
            <DropdownItem
              key={i}
              toggle={false}
              onClick={() => toggleVisibility(key)}
            >
              <span className="n2o-dropdown-check-container">
                {checked && <i className="fa fa-check" aria-hidden="true" />}
              </span>
              <span>{value.label || key}</span>
            </DropdownItem>
          )
        );
      });
    },
  })
);

export { ToggleColumn };
export default enhance(ToggleColumn);
