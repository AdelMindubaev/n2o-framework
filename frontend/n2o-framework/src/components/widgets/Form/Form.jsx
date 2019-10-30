import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { getAutoFocusId, flatFields } from './utils';
import Fieldset from './Fieldset';
import Field from './Field';
import { pure } from 'recompose';

/**
 * Простая форма
 * @reactProps {string} class - css-класс
 * @reactProps {string} style - объект стиля
 * @reactProps {array} fieldsets - вертска филдсетов, рядов, колонок, полей
 * @reactProps {string} onSubmit - вызывается при подтверждении
 * @reactProps {boolean} autoFocus - автофокус на первом доступном поле
 * @example
 *  <Form autoFocus={true}>
 *    <Fieldset>
 *      <Row>
 *        <Col md={6}>
 *          <Form.Field component={StandardField} control = {Input} name='name' label='Имя' description='Введите имя'/>
 *        </Col>
 *        <Col md={6}>
 *          <Form.Field component={StandardField} control = {Input} name='lastname' label='Фамилия' description='Введите фамилию'/>
 *        </Col>
 *      </Row>
 *    </Fieldset>
 *  </Form>
 */

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Рендер филдсетов
   */
  renderFieldsets() {
    const { fieldsets, autoFocus, form, modelPrefix } = this.props;
    const autoFocusId = autoFocus && getAutoFocusId(flatFields(fieldsets, []));
    return fieldsets.map((set, i) => {
      return (
        <Fieldset
          key={i}
          component={set.component}
          autoFocusId={autoFocusId}
          form={form}
          modelPrefix={modelPrefix}
          {...omit(set, 'component')}
        />
      );
    });
  }

  /**
   * Базовый рендер
   */
  render() {
    const { className, style, children } = this.props;
    if (React.Children.count(children)) {
      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
    }
    return (
      <div className={className} style={style}>
        {this.renderFieldsets()}
      </div>
    );
  }
}

Form.Field = Field;

Form.defaultProps = {
  fieldsets: [],
  autoFocus: true,
};

Form.propTypes = {
  fieldsets: PropTypes.array,
  autoFocus: PropTypes.bool,
  /* Default props */
  className: PropTypes.string,
  style: PropTypes.string,
  /* Specific props */
  onSubmit: PropTypes.func,
  /* Logic props */
  datasource: PropTypes.object,
  resolveModel: PropTypes.object,
  onResolve: PropTypes.func,
};

export default pure(Form);
