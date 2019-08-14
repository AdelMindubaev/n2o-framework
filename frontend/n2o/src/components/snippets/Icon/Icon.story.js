import React from 'react';
import { storiesOf } from '@storybook/react';
import Factory from '../../../core/factory/Factory';
import { SNIPPETS } from '../../../core/factory/factoryLevels';
import Icon from './Icon';

const stories = storiesOf('UI Компоненты/Иконка', module);

stories
  .add(
    'Компонент',
    () => {
      const props = {
        disabled: false,
        name: 'fa fa-user',
        spin: false,
        bordered: false,
        circular: false,
      };

      return <Icon {...props} />;
    },
    {
      info: {
        text: `
      Компонент 'Иконка'
      ~~~js
      import Icon from 'n2o/lib/components/snippets/Icon/Icon';
      
      <Icon
          disabled={false}
          name="fa fa-user"
          spin={false}
          bordered={false}
          circular={false}
      />
      ~~~
      `,
      },
    }
  )
  .add(
    'Создание через Factory',
    () => {
      const dt = {
        id: 'uniqId',
        src: 'Icon',
        disabled: false,
        name: 'fa fa-user',
        spin: false,
        bordered: false,
        circular: false,
      };
      return (
        <React.Fragment>
          <Factory level={SNIPPETS} id={'uniqId'} {...dt} />
        </React.Fragment>
      );
    },
    {
      info: {
        text: `
      Компонент 'Иконка'
      ~~~js
      import Factory from 'n2o/lib/core/factory/Factory';
      
      <Factory level={SNIPPETS} id="uniqId" {...iconProps} />
      ~~~
      `,
      },
    }
  );
