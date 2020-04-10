import React from 'react';
import ImageCell from './ImageCell';
import imageShapes from './imageShapes';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const defaultProps = {
  id: 'url',
  model: {
    url:
      'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
  },
  className: 'testtest',
  style: {
    color: 'red',
  },
  title: 'top title',
  shape: imageShapes.THUMBNAIL,
};

const setupImageCell = propsOverride => {
  const props = { ...defaultProps, ...propsOverride };

  const wrapper = mount(
    <Provider store={configureMockStore()({})}>
      <ImageCell {...props} />
    </Provider>
  );

  return { wrapper, props };
};

const defaultPropsWithTooltip = {
  id: 'url',
  model: {
    url:
      'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
    tooltipFieldId: ['tooltip', 'body'],
  },
  className: 'testtest',
  style: {
    color: 'red',
  },
  title: 'top title',
  shape: imageShapes.THUMBNAIL,
};

const setupImageCellWithTooltip = propsOverride => {
  const props = { ...defaultPropsWithTooltip, ...propsOverride };

  const wrapper = mount(
    <Provider store={configureMockStore()({})}>
      <ImageCell {...props} />
    </Provider>
  );

  return { wrapper, props };
};

describe('<ImageCell />', () => {
  it('проверяет создание тайтла', () => {
    const { wrapper, props } = setupImageCell();
    expect(
      wrapper
        .find('span')
        .first()
        .prop('title')
    ).toEqual(props.title);
  });

  it('проверяет путь до картинки', () => {
    const { wrapper, props } = setupImageCell();

    expect(wrapper.find('img').props().src).toEqual(props.model[props.id]);
  });

  it('проверяет форму изображения', () => {
    const { wrapper } = setupImageCell();
    expect(wrapper.find('img').props().className).toEqual('img-thumbnail');
  });

  it('проверяет задание класса', () => {
    const { wrapper, props } = setupImageCell();

    expect(wrapper.find(`.${props.className}`).exists()).toBeTruthy();
  });

  it('проверяет стили для элемента', () => {
    const { wrapper, props } = setupImageCell();

    expect(
      wrapper
        .find(`.${props.className}`)
        .getElements()
        .pop().props.style
    ).toEqual(props.style);
  });
  it('Cell обернут тултипом', () => {
    const { wrapper, props } = setupImageCellWithTooltip();
    expect(wrapper.find('.list-text-cell__trigger').exists()).toEqual(true);
  });
});
