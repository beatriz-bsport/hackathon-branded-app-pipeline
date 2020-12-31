// @flow
import React from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import parse from '../../query-string';

import { disconnect } from '../../actions/auth.actions';

type Props = {
  disconnect: () => void,
};

export const Signout = (props: Props) => {
  props.disconnect();
  const { membership } = parse(window.location.search);
  return (
    <Redirect to={`/login${membership ? `?membership=${membership}` : ''}`} />
  );
};

export default connect(null, {
  disconnect,
})(Signout);
