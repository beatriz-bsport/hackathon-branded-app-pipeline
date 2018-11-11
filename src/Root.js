// @flow
import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import UserspaceSwitcher from './pages/UserspaceSwitcher.component';
import ConsumerHome from './pages/ConsumerHome.component';
import LoginRouter from './pages/login/LoginRouter.component';
import MarketPlace from './pages/MarketPlace.component';

const styles = () => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
});

type Props = {
  classes: Object,
  rehydrated: boolean,
};

export class Root extends Component<Props> {
  render() {
    const { classes, rehydrated } = this.props;

    if (!rehydrated) {
      return <CircularProgress />;
    }

    return (
      <div className={classes.root}>
        <Switch>
          <Route path="/login" component={LoginRouter} />
          <Route path="/customer" component={ConsumerHome} />
          <Route path="/marketplace/:id" component={MarketPlace} />
          <Route path="/" component={UserspaceSwitcher} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rehydrated: state._persist && state._persist.rehydrated,
  };
}
export default withRouter(withStyles(styles)(connect(mapStateToProps)(Root)));
