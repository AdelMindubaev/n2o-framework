import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { change } from 'redux-form';

import { registerFieldExtra } from '../../../../../actions/formPlugin';
import {
  isInitSelector,
  formValueSelector,
} from '../../../../../selectors/formPlugin';
import evalExpression, {
  parseExpression,
} from '../../../../../utils/evalExpression';
import MultiFieldsetItem from './MultiFieldsetItem';

function MultiFieldset({
  name,
  childrenLabel,
  fields,
  addButtonLabel,
  removeButtonLabel,
  needAddButton,
  needRemoveButton,
  needCopyButton,
  needRemoveAllButton,
  canRemoveFirstItem,
  render,
  rows,
  enabled,
  visible,
  ...rest
}) {
  return (
    <div className="n2o-multi-fieldset">
      <MultiFieldsetItem
        fields={fields}
        {...rest}
        parentName={name}
        render={render}
        enabled={enabled}
        rows={rows}
        childrenLabel={childrenLabel}
        needAddButton={needAddButton}
        needRemoveButton={needRemoveButton}
        needCopyButton={needCopyButton}
        needRemoveAllButton={needRemoveAllButton}
        addButtonLabel={addButtonLabel}
        removeButtonLabel={removeButtonLabel}
        canRemoveFirstItem={canRemoveFirstItem}
      />
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  fields: (state, props) => formValueSelector(props.form, props.name)(state),
  isInit: (state, props) => isInitSelector(props.form, props.name)(state),
});

export const enhance = compose(
  connect(mapStateToProps),
  lifecycle({
    componentDidUpdate() {
      const { dispatch, isInit, form, name } = this.props;

      if (!isInit) {
        dispatch(
          registerFieldExtra(form, name, {
            type: 'FieldArray',
          })
        );
      }
    },
  }),
  withHandlers({
    onAddField: ({ form, name, dispatch, fields }) => () => {
      const newValue = fields.slice();
      newValue.push({});
      dispatch(change(form, name, newValue));
    },
    onRemoveField: ({ form, name, dispatch, fields }) => index => () => {
      const newValue = fields.slice();
      newValue.splice(index, 1);

      dispatch(change(form, name, newValue));
    },
    onCopyField: ({ form, name, dispatch, fields }) => index => () => {
      const newValue = fields.slice();
      newValue.splice(fields.length, 0, fields[index]);

      dispatch(change(form, name, newValue));
    },
    onRemoveAll: ({
      form,
      name,
      dispatch,
      canRemoveFirstItem,
      fields,
    }) => () => {
      const newValue = fields.slice();
      newValue.splice(+!canRemoveFirstItem, fields.length);

      dispatch(change(form, name, newValue));
    },
    resolvePlaceholder: ({ childrenLabel }) => index => {
      const context = { index };
      const expression = parseExpression(childrenLabel);

      if (expression) {
        return evalExpression(expression, context);
      }

      return childrenLabel;
    },
  })
);

export default enhance(MultiFieldset);
