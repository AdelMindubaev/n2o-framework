import React from 'react';
import TestRenderer from 'react-test-renderer';
import StandardField from '../StandardField';

const toolbar = {
  topLeft: {
    buttons: [
      {
        src: 'StandardButton',
        id: 'update',
        label: 'button 1',
        icon: 'fa fa-trash',
        actionId: 'update',
        validate: true,
        validatedWidgetId: 'create2_main',
        color: 'primary',
        hint: 'some hint',
        size: 'sm',
      },
    ],
  },
};

it('StandardField рендерится корректно', () => {
  const tree = TestRenderer.create(
    <StandardField
      id="myField"
      value="test"
      visible={true}
      label="Мое поле"
      control="InputText"
      description="Введите значение"
      measure="км"
      required={true}
      className="test"
      style={{ display: 'block' }}
      validationState="error"
      loading={false}
      disabled={false}
      enabled={true}
      labelStyle={{ display: 'block' }}
      controlStyle={{ display: 'block' }}
      labelClass="myLabelClass"
      controlClass="myControlClass"
      placeholder="TEST"
      component={() => null}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('StandardField рендерится корректно c toolbar', () => {
  const tree = TestRenderer.create(
    <StandardField
      id="myField"
      value="test"
      visible={true}
      label="Мое поле"
      control="InputText"
      description="Введите значение"
      measure="км"
      required={true}
      className="test"
      style={{ display: 'block' }}
      validationState="error"
      loading={false}
      disabled={false}
      enabled={true}
      labelStyle={{ display: 'block' }}
      controlStyle={{ display: 'block' }}
      labelClass="myLabelClass"
      controlClass="myControlClass"
      placeholder="TEST"
      component={() => null}
      toolbar={toolbar}
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('StandardField верно приходит props toolbar', () => {
  const tree = TestRenderer.create(
    <StandardField
      id="myField"
      value="test"
      visible={true}
      label="Мое поле"
      control="InputText"
      description="Введите значение"
      measure="км"
      required={true}
      className="test"
      style={{ display: 'block' }}
      validationState="error"
      loading={false}
      disabled={false}
      enabled={true}
      labelStyle={{ display: 'block' }}
      controlStyle={{ display: 'block' }}
      labelClass="myLabelClass"
      controlClass="myControlClass"
      placeholder="TEST"
      component={() => null}
      toolbar={toolbar}
    />
  ).root;
  expect(tree.props.toolbar.topLeft.buttons).toEqual(toolbar.topLeft.buttons);
});
