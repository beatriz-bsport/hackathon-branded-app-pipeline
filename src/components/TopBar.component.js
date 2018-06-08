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
import { Menu } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import { DisconnectButton } from './index';

import LOGO_ASSET from '../public/images/banner_lowres.png';

const styles = (theme) => ({
  flex: {
    flex: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

export function TopBar(props) {
  const { classes, authenticated, toogleDrawer } = props;

  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={toogleDrawer}
        >
          <Menu />
        </IconButton>
        <img height={40} src={LOGO_ASSET} />
        <DisconnectButton />
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(TopBar);
