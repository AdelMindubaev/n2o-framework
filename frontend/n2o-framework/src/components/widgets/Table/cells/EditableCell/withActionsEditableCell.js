import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { setModel } from '../../../../../actions/models';
import { setTableSelectedId } from '../../../../../actions/widgets';
import { PREFIXES } from '../../../../../constants/models';
import { createStructuredSelector } from 'reselect';
import { makeGetResolveModelSelector } from '../../../../../selectors/models';

export default EditableCell => {
  class EditableCellWithActions extends React.Component {
    render() {
      return <EditableCell {...this.props} />;
    }
  }

  const mapStateToProps = createStructuredSelector({
    prevResolveModel: (state, props) =>
      makeGetResolveModelSelector(props.widgetId)(state) || {},
  });

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onResolve: () =>
        dispatch(setModel(PREFIXES.resolve, ownProps.widgetId, ownProps.model)),
      onSetSelectedId: () =>
        dispatch(
          setTableSelectedId(ownProps.widgetId, get(ownProps, 'model.id', null))
        ),
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditableCellWithActions);
};
