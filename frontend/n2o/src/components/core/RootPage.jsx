import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { compose, defaultProps, getContext, withProps } from 'recompose';
import { createStructuredSelector } from 'reselect';

import Page from './Page';
import OverlayPages from './OverlayPages';
import GlobalAlerts from './GlobalAlerts';

import { SimpleTemplate } from './templates';

import { rootPageSelector } from '../../selectors/global';

function RootPage({ rootPageId, defaultTemplate, match: { params } }) {
  const Template = defaultTemplate;
  const rootPageUrl = params.pageUrl ? `/${params.pageUrl}` : '/';

  return (
    <Template>
      <GlobalAlerts />
      <Page rootPage pageId={rootPageId} pageUrl={rootPageUrl} />
      <OverlayPages />
    </Template>
  );
}

RootPage.propTypes = {
  defaultTemplate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.node,
  ]),
  rootPageId: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  rootPageId: rootPageSelector,
});

export default compose(
  defaultProps({
    defaultTemplate: SimpleTemplate,
  }),
  getContext({
    defaultTemplate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.node,
    ]),
  }),
  connect(mapStateToProps)
)(RootPage);
