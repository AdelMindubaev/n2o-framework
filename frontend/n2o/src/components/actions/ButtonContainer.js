import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownMenu, Button } from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';

import { registerButton } from '../../actions/toolbar';
import {
  isDisabledSelector,
  isInitSelector,
  isVisibleSelector,
  titleSelector,
  countSelector,
  sizeSelector,
  colorSelector,
  iconSelector,
  classSelector,
  hintSelector,
  hintPositionSelector,
  styleSelector,
} from '../../selectors/toolbar';
import withTooltip from '../../utils/withTooltip';
import { id } from '../../utils/id';
import Dropdown from './Dropdowns/Dropdown';

/**
 * кнопка-контейнер
 */
class ButtonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.buttonId = id();
  }

  /**
   * Диспатч экшена регистрации виджета
   */
  static initIfNeeded(props) {
    const {
      isInit,
      dispatch,
      id,
      parentId,
      containerKey,
      initialProps: {
        visible = true,
        disabled = false,
        size,
        color,
        count,
        title,
        icon,
        hint,
        className,
        style,
        conditions,
        resolveEnabled,
        hintPosition,
      },
    } = props;
    !isInit &&
      dispatch(
        registerButton(containerKey, id, {
          id,
          visible,
          disabled,
          size,
          parentId,
          color,
          icon,
          count,
          title,
          hint,
          className,
          style,
          conditions,
          containerKey,
          resolveEnabled,
          hintPosition,
        })
      );
  }

  static getDerivedStateFromProps(props, state) {
    ButtonContainer.initIfNeeded(props);
    return null;
  }

  /**
   * рендер кнопки или элемента списка
   * @returns {*}
   */
  renderButton() {
    const {
      onClick,
      count,
      icon,
      className,
      disabled,
      size,
      color,
      visible,
      title,
      hint,
      btnKey,
      component,
    } = this.props;

    const style = title ? { marginRight: 3 } : null;
    const counter =
      (count || '') && count > 0 ? (
        <span
          className={cx('badge', {
            'badge-light': color !== 'secondary',
            'badge-dark': color === 'secondary',
          })}
        >
          {count}
        </span>
      ) : (
        ''
      );

    return React.createElement(
      component,
      {
        key: this.buttonId,
        id: this.buttonId,
        onClick,
        disabled,
        size,
        color,
        className,
      },
      <React.Fragment>
        <span style={style}>
          <i className={icon} />
        </span>
        {title} {counter}
      </React.Fragment>
    );
  }

  /**
   * рендер кнопки дропдауна
   * @returns {*}
   */
  renderDropdown() {
    const { children, icon, color, title, disabled } = this.props;
    return (
      <Dropdown
        id={this.buttonId}
        disabled={disabled}
        color={color}
        title={
          <span>
            <i className={icon} /> {title}
          </span>
        }
      >
        {children}
      </Dropdown>
    );
  }

  /**
   *Базовый рендер
   */
  render() {
    const {
      visible,
      disabled,
      size,
      title,
      count,
      color,
      icon,
      hint,
      hintPosition,
      component,
    } = this.props;
    const isDropdown = component === DropdownMenu;

    return isDropdown ? (
      <div className={cx(visible ? 'd-block' : 'd-none')}>
        {withTooltip(this.renderDropdown(), hint, hintPosition, this.buttonId)}
      </div>
    ) : visible ? (
      withTooltip(this.renderButton(), hint, hintPosition, this.buttonId)
    ) : null;
  }
}

const mapStateToProps = createStructuredSelector({
  isInit: (state, ownProps) =>
    isInitSelector(ownProps.containerKey, ownProps.id)(state),
  visible: (state, ownProps) =>
    isVisibleSelector(ownProps.containerKey, ownProps.id)(state),
  disabled: (state, ownProps) =>
    isDisabledSelector(ownProps.containerKey, ownProps.id)(state),
  color: (state, ownProps) =>
    colorSelector(ownProps.containerKey, ownProps.id)(state),
  size: (state, ownProps) =>
    sizeSelector(ownProps.containerKey, ownProps.id)(state),
  title: (state, ownProps) =>
    titleSelector(ownProps.containerKey, ownProps.id)(state),
  count: (state, ownProps) =>
    countSelector(ownProps.containerKey, ownProps.id)(state),
  icon: (state, ownProps) =>
    iconSelector(ownProps.containerKey, ownProps.id)(state),
  hint: (state, ownProps) =>
    hintSelector(ownProps.containerKey, ownProps.id)(state),
  hintPosition: (state, ownProps) =>
    hintPositionSelector(ownProps.containerKey, ownProps.id)(state),
  className: (state, ownProps) =>
    classSelector(ownProps.containerKey, ownProps.id)(state),
  style: (state, ownProps) =>
    styleSelector(ownProps.containerKey, ownProps.id)(state),
});

ButtonContainer.propTypes = {
  isInit: PropTypes.bool,
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.string,
  hint: PropTypes.string,
  hintPosition: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

ButtonContainer.defaultProps = {
  visible: true,
  disabled: false,
};

export default connect(mapStateToProps)(ButtonContainer);
