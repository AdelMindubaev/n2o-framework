import React from 'react';
import { pure } from 'recompose';
import { Row } from 'reactstrap';
import FieldsetCol from './FieldsetCol';

function FieldsetRow({
  rowId,
  row,
  ...rest
}) {
  return (
    <Row key={rowId} {...row.props} className={row.className}>
      {row.cols &&
      row.cols.map((col, colId) => <FieldsetCol col={col} colId={colId} {...rest} />)}
    </Row>
  );
}

export default pure(FieldsetRow);