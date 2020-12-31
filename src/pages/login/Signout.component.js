// @flow
import React from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { parseQueryString } from '../../http';

import { disconnect } from '../../actions/auth.actions';

type Props = {
  disconnect: () => void,
};

export const Signout = (props: Props) => {
  props.disconnect();
  const { membership } = parseQueryString(window.location.search);
  return (
    <Redirect to={`/login${membership ? `?membership=${membership}` : ''}`} />
  );
};

export default connect(null, {
  disconnect,
})(Signout);
