import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';

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
import MenuIcon from '@material-ui/icons/Menu';

import { Link } from 'react-router-dom';
import { DisconnectButton } from '../components';
import LOGO_ASSET from '../public/images/banner_lowres.png';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  logo: {
    alignItems: 'center',
    justify: 'center',
  },
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <Grid
            container
            style={{ paddingTop: 10 }}
            justify="center"
            alignItems="center"
          >
            <img height={40} src={LOGO_ASSET} />
          </Grid>
        </div>
        <Divider />
        <List>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <TrendingUp />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/activity" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText primary="Mes activités" />
            </ListItem>
          </Link>
          <Link to="/calendar" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Today />
              </ListItemIcon>
              <ListItemText primary="Calendrier" />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/messaging" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
          </Link>
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Membres" />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/payment" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Payment />
              </ListItemIcon>
              <ListItemText primary="Paiements" />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/signout" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <HighlightOff />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </Link>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              flexGrow={1}
            >
              <div>
                <Grid container alignItems="center" direction="row">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.navIconHide}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    variant="title"
                    color="inherit"
                    noWrap
                    className={classes.navIconHide}
                  >
                    bsport
                  </Typography>
                </Grid>
              </div>
              <div>
                <DisconnectButton />
              </div>
            </Grid>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {this.props.children}
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
