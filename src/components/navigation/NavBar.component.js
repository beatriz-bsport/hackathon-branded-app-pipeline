import React, { Component } from 'react';

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {
  Menu,
  Today,
  Star,
  Inbox,
  People,
  Payment,
  TrendingUp,
  Email,
  HighlightOff,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = (theme) => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

export function NavBar(props) {
  const { classes } = props;
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem button>
          <ListItemIcon>
            <TrendingUp />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Star />
          </ListItemIcon>
          <ListItemText primary="Mes activités" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Today />
          </ListItemIcon>
          <ListItemText primary="Calendrier" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Membres" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Payment />
          </ListItemIcon>
          <ListItemText primary="Paiments" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <HighlightOff />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(NavBar);
