import React from 'react';
import { storiesOf } from '@storybook/react';
import withTests from 'N2oStorybook/withTests';
import withForm from 'N2oStorybook/decorators/withForm';
import CodeEditor from './CodeEditor';
import CodeEditorJson from './CodeEditor.meta.json';
import Factory from '../../../core/factory/Factory';

const form = withForm({ src: 'CodeEditor' });

const stories = storiesOf('Контролы/Редактор кода', module);

stories.addDecorator(withTests('CodeEditor'));

stories.addParameters({
  info: {
    propTables: [CodeEditor],
    propTablesExclude: [Factory],
  },
});

stories
  .add('Компонент', () => {
    const props = {
      disabled: false,
      visible: true,
      lang: 'java',
      minLines: 5,
      maxLines: 30,
      autocomplete: true,
      value: '',
    };

    return <CodeEditor {...props} />;
  })

  .add(
    'Метаданные',
    form(() => {
      const props = {
        disabled: CodeEditorJson.disabled,
        lang: CodeEditorJson.lang,
        minLines: CodeEditorJson.micro,
        maxLines: CodeEditorJson.maxLines,
        autocomplete: CodeEditorJson.autocomplete,
        value: CodeEditorJson.value,
      };

      return props;
    })
  );
