import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { batchActions } from 'redux-batched-actions';

import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import Button from 'reactstrap/lib/Button';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  defaultProps,
} from 'recompose';
import onClickOutsideHOC from 'react-onclickoutside';

import InputText from '../../controls/InputText/InputText';
import SearchBarPopUp from './SearchBarPopUp';
import SearchBarEmptyMenu from './SearchBarEmptyMenu';

let timeoutId = null;
const ENTER_KEY_CODE = 13;

const SearchTrigger = {
  ENTER: 'ENTER',
  CHANGE: 'CHANGE',
  BUTTON: 'BUTTON',
};

function SearchBar({
  className,
  innerValue,
  icon,
  button,
  onClick,
  onChange,
  onKeyDown,
  onFocus,
  placeholder,
  menu,
  dropdownOpen,
  toggleDropdown,
  directionIconsInPopUp,
  descriptionFieldId,
  iconFieldId,
  labelFieldId,
  urlFieldId,
}) {
  SearchBar.handleClickOutside = () => toggleDropdown('false');
  return (
    <div className={cn('n2o-search-bar', className)}>
      <div className="n2o-search-bar__control">
        <div>
          <InputText
            onKeyDown={onKeyDown}
            value={innerValue}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() =>
              batchActions([toggleDropdown('true'), onFocus && onFocus()])
            }
          />
          {isString(icon) ? <i className={icon} /> : icon}
        </div>
        {isEmpty(menu) ? (
          <SearchBarEmptyMenu dropdownOpen={dropdownOpen === 'true'} />
        ) : (
          <SearchBarPopUp
            menu={menu}
            dropdownOpen={dropdownOpen === 'true'}
            directionIconsInPopUp={directionIconsInPopUp}
            descriptionFieldId={descriptionFieldId}
            iconFieldId={iconFieldId}
            labelFieldId={labelFieldId}
            urlFieldId={urlFieldId}
          />
        )}
      </div>
      {!!button && (
        <Button {...button} onClick={onClick}>
          {button.label}
          {button.icon && <i className={cn('ml-2', button.icon)} />}
        </Button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  /**
   * Класс компонента
   */
  className: PropTypes.string,
  /**
   * Начальное состояние строки поиска
   */
  initialValue: PropTypes.string,
  /**
   * Значение компонента
   */
  value: PropTypes.string,
  /**
   * Placeholder контрола
   */
  placeholder: PropTypes.string,
  /**
   * Триггер запуска колбека поиска
   */
  trigger: PropTypes.oneOf([
    SearchTrigger.CHANGE,
    SearchTrigger.ENTER,
    SearchTrigger.BUTTON,
  ]),
  /**
   * Настройка кнопки
   */
  button: PropTypes.object,
  /**
   * Иконка
   */
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.element,
    PropTypes.string,
  ]),
  /**
   * Коллбек поиска
   */
  onSearch: PropTypes.func,
  /**
   * Delay поиска при change триггере
   */
  throttleDelay: PropTypes.number,
  /**
   * данные и резолв для popUp
   */
  menu: PropTypes.array,
  /**
   * направление иконок и items в popUp: left(default), right
   */
  directionIconsInPopUp: PropTypes.string,
};

SearchBar.defaultProps = {
  trigger: SearchTrigger.CHANGE,
  button: false,
  icon: 'fa fa-search',
  directionIconsInPopUp: 'left',
  onSearch: () => {},
};

const clickOutsideConfig = {
  handleClickOutside: () => SearchBar.handleClickOutside,
};

const enhance = compose(
  defaultProps({
    trigger: SearchTrigger.CHANGE,
    throttleDelay: 400,
  }),
  withState(
    'innerValue',
    'setInnerValue',
    ({ value, initialValue }) => initialValue || value
  ),
  withHandlers({
    onClick: ({ innerValue, onSearch }) => () => onSearch(innerValue),
    onKeyDown: ({ innerValue, trigger, onSearch }) => ({ keyCode }) => {
      if (trigger === SearchTrigger.ENTER && keyCode === ENTER_KEY_CODE) {
        onSearch(innerValue);
      }
    },
    onChange: ({
      setInnerValue,
      trigger,
      throttleDelay,
      onSearch,
    }) => value => {
      setInnerValue(value);

      if (trigger === SearchTrigger.CHANGE) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => onSearch(value), throttleDelay);
      }
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const { value, setInnerValue } = this.props;

      if (prevProps.value !== value) {
        setInnerValue(value);
      }
    },
  }),
  withState('dropdownOpen', 'toggleDropdown', 'false')
);

export { SearchBar };
export default onClickOutsideHOC(enhance(SearchBar), clickOutsideConfig);
