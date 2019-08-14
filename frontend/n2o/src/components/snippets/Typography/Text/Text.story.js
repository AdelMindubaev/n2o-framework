import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import Text from './Text';
import meta from './Text.meta';
import { allColors } from '../utils';
import { map } from 'lodash';

const stories = storiesOf('UI Компоненты/Типография/Text', module);

stories
  .add(
    'Компонент',
    () => {
      const props = {
        code: meta.code,
        del: meta.del,
        mark: meta.mark,
        strong: meta.strong,
        underline: meta.underline,
        small: meta.small,
        copyable: meta.copyable,
        text: meta.text,
        editable: meta.editable,
      };

      return <Text {...props} />;
    },
    {
      info: {
        text: `
      Компонент 'Текст'
      ~~~js
      import Text from 'n2o/lib/components/snippets/Typography/Text/Text';
      
      <Text text="Title" />
      ~~~
      `,
      },
    }
  )
  .add(
    'Разное отображение',
    () => (
      <Fragment>
        <br />
        <h1>Transform:</h1>
        <code>{`{code:true}`}</code>
        <Text text="The five boxing wizards jump quickly." code={true} />
        <code>{`{del:true}`}</code>
        <Text text="The five boxing wizards jump quickly." del={true} />
        <code>{`{mark:true}`}</code>
        <Text text="The five boxing wizards jump quickly." mark={true} />
        <code>{`{strong:true}`}</code>
        <Text text="The five boxing wizards jump quickly." strong={true} />
        <code>{`{underline:true}`}</code>
        <Text text="The five boxing wizards jump quickly." underline={true} />
        <code>{`{small:true}`}</code>
        <Text text="The five boxing wizards jump quickly." small={true} />
        <code>{`{copyable:true}`}</code>
        <Text text="The five boxing wizards jump quickly." copyable={true} />
        <code>{`{editable:true}`}</code>
        <Text text="The five boxing wizards jump quickly." editable={true} />
        <br />
        <h1>Colors:</h1>
        {map(allColors, color => (
          <Text
            color={color}
            level={2}
            text="The five boxing wizards jump quickly."
          />
        ))}
      </Fragment>
    ),
    {
      info: {
        text: `
      Компонент 'Текст'
      ~~~js
      import Text from 'n2o/lib/components/snippets/Typography/Text/Text';
      
      <Fragment>
        <br />
        <h1>Transform:</h1>
        <code>{\`{code:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." code={true} />
        <code>{\`{del:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." del={true} />
        <code>{\`{mark:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." mark={true} />
        <code>{\`{strong:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." strong={true} />
        <code>{\`{underline:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." underline={true} />
        <code>{\`{small:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." small={true} />
        <code>{\`{copyable:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." copyable={true} />
        <code>{\`{editable:true}\`}</code>
        <Text text="The five boxing wizards jump quickly." editable={true} />
        <br />
        <h1>Colors:</h1>
        {map(allColors, color => (
          <Text
            color={color}
            level={2}
            text="The five boxing wizards jump quickly."
          />
        ))}
    </Fragment>
      ~~~
      `,
      },
    }
  )
  .add(
    'Текст с переносами \\n',
    () => (
      <Text
        preLine={true}
        text={'The five \n boxing \n wizards \n jump quickly'}
      />
    ),
    {
      info: {
        text: `
      Компонент 'Текст'
      ~~~js
      import Text from 'n2o/lib/components/snippets/Typography/Text/Text';
      
      <Text
        preLine={true}
        text={'The five \\n boxing \\n wizards \\n jump quickly'}
      />
      ~~~
      `,
      },
    }
  );
