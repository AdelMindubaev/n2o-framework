import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'recompose';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { omit } from 'lodash';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs/react';
import withTests from 'N2oStorybook/withTests';
import { getStubData } from 'N2oStorybook/fetchMock';
import withPage from 'N2oStorybook/decorators/withPage';
import { FormPlaceholder } from 'N2oStorybook/json';
import {
  FormFields,
  FormValidations,
  FieldLabelPosition,
  FormServerMessage,
  FormCollapseFieldset,
  FormFieldsetCollapseVE,
  FormFieldsetSecurity,
  FormFieldsetStandartVE,
  FormHighlyLoadedTest,
} from 'N2oStorybook/json';
import FormWithPrompt from '../../../../.storybook/json/FormWithPrompt';
import fetchMock from 'fetch-mock';
import InputSelectContainerJson from '../../controls/InputSelect/InputSelectContainer.meta';
import AuthButtonContainer from '../../../core/auth/AuthLogin';

import FormWidgetData from './FormWidget.meta.json';
import Factory from '../../../core/factory/Factory';
import { WIDGETS } from '../../../core/factory/factoryLevels';
import Page from '../../core/Router';
import DefaultBreadcrumb from '../../core/Breadcrumb/DefaultBreadcrumb';

const stories = storiesOf('Виджеты/Форма', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withTests('Form'));

const renderForm = json => (
  <Factory level={WIDGETS} {...json['Page_Form']} id="Page_Form" />
);

stories
  .addDecorator(story => {
    fetchMock.restore().getOnce('begin:n2o/data', getStubData);
    return story();
  })
  .add('Метаданные', () =>
    withPage(FormWidgetData)(() => renderForm(FormWidgetData))
  )
  .add('Расположение лейбла', () =>
    withPage(FieldLabelPosition)(() => renderForm(FieldLabelPosition))
  )
  .add('Экшены полей', () =>
    withPage(FieldLabelPosition)(() => renderForm(FormFields))
  )
  .add('Отображение в полях сообщений от сервера', () =>
    withPage(FormServerMessage)(() => {
      fetchMock.restore().post('begin:n2o/data', url => ({
        status: 500,
        body: {
          meta: {
            messages: {
              form: 'Page_Form',
              fields: {
                name: {
                  text: 'Ошибка',
                  severity: 'danger',
                },
                surname: {
                  text: 'Предупреждение',
                  severity: 'warning',
                },
                age: {
                  text: 'Успех',
                  severity: 'success',
                },
              },
            },
          },
        },
      }));

      return renderForm(FormServerMessage);
    })
  )
  .add('Валидации', () =>
    withPage(FormValidations)(() => {
      const mockJson = {
        status: 200,
        sendAsJson: true,
        body: {
          message: [
            {
              severity: 'success',
              text: 'Доступная фамилия',
            },
            {
              severity: 'danger',
              text: 'Был отправлен запрос, получен ответ с ошибкой',
            },
          ],
        },
      };

      fetchMock.restore().get('begin:n2o/validation', mockJson);

      return renderForm(FormValidations);
    })
  )
  .add('Сворачиваемая форма', () =>
    withPage(FormCollapseFieldset)(() => {
      return renderForm(FormCollapseFieldset);
    })
  )
  .add('Видимость и блокировка филдсета', () =>
    withPage(FormFieldsetStandartVE)(() => {
      return renderForm(FormFieldsetStandartVE);
    })
  )

  .add('Ограничение доступа', () =>
    withPage(FormFieldsetSecurity)(() => {
      return (
        <div>
          <small>
            Введите <mark>admin</mark>, чтобы увидеть скрытый виджет региона
          </small>
          <AuthButtonContainer />
          <br />
          {renderForm(FormFieldsetSecurity)}
        </div>
      );
    })
  )

  .add('Тест на нагруженную форму', () =>
    withPage(FormHighlyLoadedTest)(() => {
      fetchMock.restore().post('begin:n2o/data', url => ({
        status: 500,
        body: {
          meta: {
            messages: {
              form: 'Page_Form',
              fields: {
                nameSerValid: {
                  text: 'Ошибка',
                  severity: 'danger',
                },
                surnameSerValid: {
                  text: 'Предупреждение',
                  severity: 'warning',
                },
                ageSerValid: {
                  text: 'Успех',
                  severity: 'success',
                },
              },
            },
          },
        },
      }));

      return renderForm(FormHighlyLoadedTest);
    })
  )
  .add('Форма с Prompt', () => {
    const FormWithContext = withContext(
      {
        defaultPromptMessage: PropTypes.string,
      },
      props => ({
        defaultPromptMessage:
          'Все несохраненные данные будут утеряны, вы уверены, что хотите уйти?',
      })
    )(() => renderForm(FormWithPrompt));
    return (
      <Router>
        <div>
          <div className="row">
            <div className="col-6">
              <h5>Меню</h5>
              <div className="nav flex-column">
                <Link className="nav-link" to="/">
                  Форма
                </Link>
                <Link className="nav-link" to="/another">
                  Другая страница
                </Link>
              </div>
            </div>
            <div className="col-6">
              <Switch>
                <Route exact path={'/'} component={FormWithContext} />
                <Route path={'/another'} component={() => <div>test</div>} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  })
  .add('Placeholder', () => {
    fetchMock
      .restore()
      .get(
        'begin:n2o/data',
        () => new Promise(res => setTimeout(() => res(getStubData), 3000))
      );

    return (
      <div>
        <Factory
          level={WIDGETS}
          {...FormPlaceholder['Page_Form']}
          id="Page_Form"
        />
      </div>
    );
  });
