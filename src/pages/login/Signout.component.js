// @flow
import React from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { disconnect } from '../../actions/auth.actions';

type Props = {
  disconnect: () => void,
};

export const Signout = (props: Props) => {
  props.disconnect();
  return <Redirect to="/" />;
};

export default connect(
  null,
  {
    disconnect,
  },
)(Signout);
