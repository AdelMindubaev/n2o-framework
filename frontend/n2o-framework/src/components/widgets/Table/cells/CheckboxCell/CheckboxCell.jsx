import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import {
  compose,
  withState,
  lifecycle,
  withHandlers,
  setDisplayName,
} from 'recompose';
import withCell from '../../withCell';
import CheckboxN2O from '../../../../controls/Checkbox/CheckboxN2O';

function CheckboxCell({
  callActionImpl,
  updateFieldInModel,
  model,
  fieldKey,
  id,
  visible,
  disabled,
  callInvoke,
  checked,
  handleClick,
  handleChange,
  ...rest
}) {
  return (
    visible && (
      <CheckboxN2O
        className="сheckbox-сell"
        inline={true}
        onClick={handleClick}
        onChange={handleChange}
        disabled={disabled}
        checked={checked}
        {...rest}
      />
    )
  );
}

CheckboxCell.propTypes = {
  /**
   * ID чейки
   */
  id: PropTypes.string,
  /**
   * Модель данных
   */
  model: PropTypes.object,
  /**
   * Ключ значения из модели
   */
  fieldKey: PropTypes.string,
  /**
   * Класс
   */
  className: PropTypes.string,
  callInvoke: PropTypes.func,
  /**
   * Флаг видимости
   */
  visible: PropTypes.bool,
};

CheckboxCell.defaultProps = {
  visible: true,
  disabled: false,
};

export { CheckboxCell };
export default compose(
  setDisplayName('CheckboxCell'),
  withCell,
  withState(
    'checked',
    'setChecked',
    ({ model, fieldKey, id }) => model && get(model, fieldKey || id)
  ),
  withHandlers({
    handleClick: () => e => {
      e.stopPropagation();
    },
    handleChange: ({
      callActionImpl,
      callInvoke,
      action,
      setChecked,
      model,
      fieldKey,
      id,
    }) => e => {
      const checked = e.nativeEvent.target.checked;

      const data = set(
        {
          ...model,
        },
        fieldKey || id,
        checked
      );

      setChecked(checked);
      callActionImpl(e, { action, model: data });
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { model, fieldKey, id } = this.props;

      if (
        !isEqual(
          get(prevProps.model, fieldKey || id),
          get(model, fieldKey || id)
        )
      ) {
        this.setState({ checked: get(model, fieldKey || id) });
      }
    },
  })
)(CheckboxCell);
