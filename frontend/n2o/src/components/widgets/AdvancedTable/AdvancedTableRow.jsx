import React from 'react';
import { pure } from 'recompose';
import { pick } from 'lodash';
import PropTypes from 'prop-types';
import cn from 'classnames';
import evalExpression from '../../../utils/evalExpression';

/**
 * Компонент создания строки в таблице
 * @param props
 * @constructor
 */
function AdvancedTableRow(props) {
  const {
    className,
    isRowActive,
    setRef,
    children,
    model,
    rowClick,
    rowClass,
  } = props;
  const { enablingCondition } = rowClick;
  const allowRowClick = evalExpression(enablingCondition, model);
  const classes = cn(className, 'n2o-table-row n2o-advanced-table-row', {
    'table-active': isRowActive,
    'row-click':
      (rowClick && allowRowClick) || (rowClick && allowRowClick === undefined),
    'row-deleted': allowRowClick === false,
    [rowClass]: rowClass,
  });
  const newProps = {
    ...pick(props, [
      'className',
      'data-row-key',
      'onClick',
      'onFocus',
      'style',
    ]),
    ref: el => setRef && setRef(el, model.id),
    tabIndex: 0,
    key: model.id,
    className: classes,
  };

  return React.createElement('tr', newProps, [...children]);
}

AdvancedTableRow.propTypes = {
  className: PropTypes.string,
  isRowActive: PropTypes.bool,
  setRef: PropTypes.func,
  children: PropTypes.array,
  model: PropTypes.object,
};

export default pure(AdvancedTableRow);
