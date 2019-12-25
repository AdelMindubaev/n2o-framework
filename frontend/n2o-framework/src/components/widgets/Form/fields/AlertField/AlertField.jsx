import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Alert from 'reactstrap/lib/Alert';

/**
 * Компонент - AlertField формы
 * @reactProps {boolean} visible - флаг видимости
 * @reactProps {string} text - текст алерта
 * @reactProps {string} header - заголовок алерта
 * @reactProps {string} footer - нижняя часть алерта
 * @reactProps {string} className - css-класс для поля
 * @reactProps {string} color - цвет поля
 * @reactProps {string} tag - тэг алерта
 * @reactProps {bool} fade - плавное отображение
 * @reactProps {object} style - стили алерта
 * @return {node|null}
 * @example
 * <AlertField visible={true}
 *             text='Alert!'
 *             color='warning'
 *             fade={true} />
 */

const AlertField = ({
  visible,
  header,
  text,
  footer,
  style,
  className,
  ...rest
}) => {
  return visible ? (
    <Alert
      isOpen={visible}
      className={cx('n2o-alert-field', className)}
      {...rest}
      style={style}
    >
      {header ? (
        <Fragment>
          <h4 className="n2o-alert-field-header">{header}</h4>
          <hr />
        </Fragment>
      ) : null}
      <div className="n2o-alert-field-text">{text}</div>
      {footer ? (
        <Fragment>
          <hr />
          <div className="n2o-alert-field-footer">{footer}</div>
        </Fragment>
      ) : null}
    </Alert>
  ) : null;
};

AlertField.propTypes = {
  /**
   * Флаг видимости алерта
   */
  visible: PropTypes.bool,
  /**
   * Заголовок алерта
   */
  header: PropTypes.string,
  /**
   * Текст алерта
   */
  text: PropTypes.string,
  /**
   * Нижняя часть алерта
   */
  footer: PropTypes.string,
  /**
   * Класс алерта
   */
  className: PropTypes.string,
  /**
   * Цвет алерта
   */
  style: PropTypes.object,
  /**
   * Стили алерта
   */
  color: PropTypes.string,
  /**
   * Тэг алерта
   */
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Плавность алерта
   */
  fade: PropTypes.bool,
};

AlertField.defaultProps = {
  visible: true,
  header: '',
  text: '',
  footer: '',
};

export default AlertField;
