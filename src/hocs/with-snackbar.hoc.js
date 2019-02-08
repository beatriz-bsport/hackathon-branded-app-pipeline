// @flow

import * as React from 'react';
import { connect } from 'react-redux';

import { snackbar } from '../actions/snackbar.actions';

export default function withSnackbar(WrappedComponent) {
  return connect(
    null,
    (dispatch) => ({
      snackbar: {
        success: (m) => dispatch(snackbar.success(m)),
        error: (m) => dispatch(snackbar.error(m)),
        info: (m) => dispatch(snackbar.info(m)),
        warning: (m) => dispatch(snackbar.warning(m)),
      },
    }),
  )((props) => <WrappedComponent {...props} />);
}
