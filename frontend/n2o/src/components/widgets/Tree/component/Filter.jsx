import React from 'react';
import { withState } from 'recompose';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
//components
import Icon from '../../../snippets/Icon/Icon';
import InputText from '../../../controls/InputText/InputText';

function Filter({ value, setValue, onFilter, filterPlaceholder }) {
  const onFilterFn = debounce(onFilter, 200);

  const onChange = value => {
    setValue(value);
    onFilterFn(value);
  };

  const onClear = () => {
    setValue('');
    onFilterFn('');
  };

  return (
    <div className="tree-filter">
      <InputText value={value} onChange={onChange} placeholder={filterPlaceholder} />
      {value && (
        <div className="tree-filter-clear" onClick={onClear}>
          <Icon name="fa fa-times" />
        </div>
      )}
    </div>
  );
}

Filter.propTypes = {
  onFilter: PropTypes.func
};

Filter.defaultProps = {
  onFilter: () => {}
};

export default withState('value', 'setValue', '')(Filter);
