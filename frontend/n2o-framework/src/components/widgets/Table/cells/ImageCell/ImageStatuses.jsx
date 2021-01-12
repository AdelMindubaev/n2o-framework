import React from 'react';
import map from 'lodash/map';
import classNames from 'classnames';
import get from 'lodash/get';

import Factory from '../../../../../core/factory/Factory';
import { SNIPPETS } from '../../../../../core/factory/factoryLevels';
import propsResolver from '../../../../../utils/propsResolver';

export default function ImageStatuses({ statuses, className, model }) {
  return (
    <div className={classNames('n2o-image-statuses', className)}>
      {map(statuses, (status, index) => {
        const { src, fieldId, place } = status;

        const text = get(model, fieldId);
        const props = {
          text: text,
          ...propsResolver(status, model),
        };

        return (
          <Factory
            level={SNIPPETS}
            key={index}
            className={place}
            src={src}
            {...props}
          />
        );
      })}
    </div>
  );
}
