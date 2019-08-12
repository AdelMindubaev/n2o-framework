import React from 'react';
import { storiesOf } from '@storybook/react';

import ButtonUploader from './ButtonUploader';
import DropZone from './DropZone';
import withForm from 'N2oStorybook/decorators/withForm';
import buttonMeta from './ButtonUploader.meta';
import dropzoneMeta from './DropZone.meta';
import { uniqueId } from 'lodash';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios, { delayResponse: 500 });
const form = withForm({ src: 'DropZone' });
const stories = storiesOf('Контролы/Загрузчик файлов', module);

stories
  .add('Single кнопка', () => {
    mockAxios.onPost('/n2o/data').reply(function(config) {
      return [
        200,
        {
          customId: `file_${uniqueId()}`,
          customName: config.data.get('avatar').name,
          customSize: config.data.get('avatar').size,
          customStatus: 'success',
          customResponse: 'File uploaded success!',
          customLink: 'https://www.google.com',
        },
      ];
    });

    return <ButtonUploader {...buttonMeta} />;
  })
  .add('Single DropZone', () => {
    mockAxios.onPost('/n2o/data').reply(function(config) {
      return [
        200,
        {
          customId: `file_${uniqueId()}`,
          customName: config.data.get('avatar').name,
          customSize: config.data.get('avatar').size,
          customStatus: 'success',
          customResponse: 'File uploaded success!',
          customLink: 'https://www.google.com',
        },
      ];
    });

    return <DropZone {...dropzoneMeta} />;
  })
  .add('Предустановленные значения single режим', () => {
    const props = {
      label: 'Загрузчик файлов',
      className: 'custom-class',
      requestParam: 'avatar',
      disabled: false,
      uploadUrl: '/test',
      showSize: true,
      multi: false,
      valueFieldId: 'id',
      labelFieldId: 'name',
      statusFieldId: 'status',
      sizeFieldId: 'size',
      responseFieldId: 'response',
      urlFieldId: 'link',
      files: [
        {
          id: 1,
          name: 'image.png',
          size: '1202031',
          percentage: 10,
          link: '#',
        },
      ],
    };

    mockAxios.onPost('/n2o/data-multi').reply(function(config) {
      return [
        200,
        {
          customId: `file_${uniqueId()}`,
          customName: config.data.get('avatar').name,
          customSize: config.data.get('avatar').size,
          customStatus: 'success',
          customResponse: 'File uploaded success!',
          customLink: 'https://www.google.com',
        },
      ];
    });

    return <ButtonUploader {...props} />;
  })

  .add('Мультизагрузка', () => {
    const props = {
      label: 'Загрузчик файлов',
      className: 'custom-class',
      requestParam: 'avatar',
      disabled: false,
      uploadUrl: '/test',
      autoUpload: true,
      valueFieldId: 'id',
      labelFieldId: 'name',
      statusFieldId: 'status',
      sizeFieldId: 'size',
      responseFieldId: 'response',
      urlFieldId: 'link',
      showSize: true,
    };

    return <ButtonUploader {...props} />;
  })

  .add('Мульзагрузка DropZone', () => {
    const props = {
      label: 'Загрузчик файлов',
      className: 'custom-class',
      requestParam: 'avatar',
      disabled: false,
      uploadUrl: '/test',
      autoUpload: false,
      valueFieldId: 'id',
      labelFieldId: 'name',
      statusFieldId: 'status',
      sizeFieldId: 'size',
      responseFieldId: 'response',
      urlFieldId: 'link',
      showSize: true,
    };
    return <DropZone {...props} />;
  })

  .add('Мультизагрузка с предустановленными значениями', () => {
    const props = {
      label: 'Загрузчик файлов',
      className: 'custom-class',
      requestParam: 'avatar',
      disabled: false,
      uploadUrl: '/test',
      autoUpload: true,
      showSize: true,
      valueFieldId: 'id',
      labelFieldId: 'name',
      statusFieldId: 'status',
      sizeFieldId: 'size',
      responseFieldId: 'response',
      urlFieldId: 'link',
      files: [
        {
          id: 1,
          name: 'first.jpg',
          size: '231321',
        },
        {
          id: 2,
          name: 'second.jpg',
          size: '897978',
        },
      ],
    };

    return <ButtonUploader {...props} />;
  })

  .add('disabled режим', () => {
    const props = {
      label: 'Загрузчик файлов',
      className: 'custom-class',
      requestParam: 'avatar',
      disabled: false,
      uploadUrl: '/test',
      autoUpload: true,
      showSize: true,
      valueFieldId: 'id',
      labelFieldId: 'name',
      statusFieldId: 'status',
      sizeFieldId: 'size',
      responseFieldId: 'response',
      urlFieldId: 'link',
      files: [
        {
          id: 1,
          name: 'first.jpg',
          size: '231321',
        },
        {
          id: 2,
          name: 'second.jpg',
          size: '897978',
        },
      ],
    };

    return <ButtonUploader {...props} />;
  })

  .add('Отображение network ошибки', () => {
    mockAxios.onPost('/n2o/data').reply(500);

    return <ButtonUploader {...buttonMeta} responseFieldId="message" />;
  })

  .add('Отображение кастомной ошибки', () => {
    mockAxios.onPost('/n2o/data').reply(function(config) {
      return [
        500,
        {
          customId: `file_${uniqueId()}`,
          customName: config.data.get('avatar').name,
          customSize: config.data.get('avatar').size,
          customStatus: 'error',
          customResponse: 'Ошибка с файлов. Повторите позже.',
          customLink: '#',
        },
      ];
    });

    return <ButtonUploader {...buttonMeta} />;
  })

  .add(
    'Компонент в форме',
    form(() => {
      mockAxios.onPost('/n2o/data').reply(function(config) {
        return [
          200,
          {
            customId: `file_${uniqueId()}`,
            customName: config.data.get('avatar').name,
            customSize: config.data.get('avatar').size,
            customStatus: 'success',
            customResponse: 'File uploaded success!',
            customLink: 'https://www.google.com',
          },
        ];
      });
      return {
        ...dropzoneMeta,
        multi: true,
        autoUpload: true,
      };
    })
  );
