// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

export default (load, loadingStatus) => (WrappedComponent) => {
  return class extends React.Component {
    componentWillMount() {
      this.props[load]();
    }

    render() {
      if (this.props[loadingStatus]) {
        return (
          <Grid container item justify="center" alignItems="center">
            <CircularProgress />
          </Grid>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};
