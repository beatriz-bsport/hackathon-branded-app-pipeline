import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Drawer,
  List,
  Divider,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Menu } from '@material-ui/icons';

import Backoffice from './pages/Backoffice.component';
import Login from './pages/Login.component';
import ResetPassword from './pages/ResetPassword.component';
import AuthenticatedHome from './pages/AuthenticatedHome.component';
import Signout from './pages/Signout.component';

import { NavBar, TopBar } from './components';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
});

export class Root extends Component<{}> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/reset_password" component={ResetPassword} />
          <Route path="/signout" component={Signout} />
          <Route path="/" component={Backoffice} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(Root);
