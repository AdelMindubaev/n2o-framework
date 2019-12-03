import React from 'react';
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import { get, some } from 'lodash';
import cn from 'classnames';

/**
 * Компонент обертка Cell
 * @param children - вставляемый компонент
 * @param hasSpan - флаг возможности colSpan/rowSpan в этой колонке
 * @param record - модель строки
 * @returns {*}
 * @constructor
 */
function AdvancedTableCell({ children, hasSpan, record }) {
  const { span } = record;
  let colSpan = 1;
  let rowSpan = 1;

  if (hasSpan && span) {
    if (span.colSpan === 0 || span.rowSpan === 0) {
      return null;
    }
    colSpan = span.colSpan;
    rowSpan = span.rowSpan;
  }

  const needRender = some(children, child => get(child, 'props.needRender', true));

  return (
    <td
      className={cn({ 'd-none': !needRender })}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <div className="n2o-advanced-table-cell-expand">{children}</div>
    </td>
  );
}

AdvancedTableCell.propTypes = {
  children: PropTypes.any,
  hasSpan: PropTypes.bool,
  record: PropTypes.object,
};

AdvancedTableCell.defaultProps = {
  hasSpan: false,
  record: {},
};

export default pure(AdvancedTableCell);
