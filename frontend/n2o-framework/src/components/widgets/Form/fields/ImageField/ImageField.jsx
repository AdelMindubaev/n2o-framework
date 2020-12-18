import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';

import propsResolver from '../../../../../utils/propsResolver';

import Image from '../../../../snippets/Image/Image';
import ImageInfo from '../../../../snippets/Image/ImageInfo';

import ImageStatuses from '../../../Table/cells/ImageCell/ImageStatuses';

/**
 * Компонент Image фомы
 * @reactProps {string} id - id
 * @reactProps {string} url - ссылка на img
 * @reactProps {string} data - img в байтах на сервере
 * @reactProps {string} title - title рядом с img
 * @reactProps {string} description - description рядом с img
 * @reactProps {string} textPosition - позиция текста рядом с img (top || left || bottom || right = default )
 * @reactProps {string} - width - кастом ширина
 * @reactProps {string} shape - форма маски img (square || circle || rounded = default)
 * @reactProps {boolean} visible - флаг видимости сниппета
 * @reactProps {array} statuses - статусы, отображающиеся над img
 */

function ImageField(props) {
  const {
    id,
    url,
    data,
    title,
    description,
    textPosition,
    width,
    height,
    shape,
    visible,
    model,
    className,
    statuses = [],
  } = props;

  const isEmptyModel = isEmpty(model);

  const hasStatuses = !isEmpty(statuses);
  const hasInfo = title || description;

  const defaultImageProps = {
    url: url,
    data: data,
    title: title,
    description: description,
  };

  const resolveProps = isEmptyModel
    ? defaultImageProps
    : propsResolver(defaultImageProps, model);

  return (
    <div
      className={classNames('n2o-image-field-container', {
        [textPosition]: textPosition,
      })}
    >
      <div
        className={classNames('n2o-image-field', {
          'with-statuses': hasStatuses,
        })}
      >
        <Image
          id={id}
          visible={visible}
          shape={shape}
          className={className}
          textPosition={textPosition}
          width={width}
          height={height}
          {...omit(resolveProps, ['title', 'description'])}
          src={resolveProps.data || resolveProps.url}
        />
        {hasStatuses && (
          <ImageStatuses statuses={statuses} className="image-field-statuses" />
        )}
      </div>
      {hasInfo && <ImageInfo title={title} description={description} />}
    </div>
  );
}

const mapStateToProps = (state, { modelPrefix, form }) => {
  const model =
    isNil(modelPrefix) || isNil(form) ? {} : state.models[modelPrefix][form];
  return {
    model: model,
  };
};

export default connect(
  mapStateToProps,
  null
)(ImageField);
