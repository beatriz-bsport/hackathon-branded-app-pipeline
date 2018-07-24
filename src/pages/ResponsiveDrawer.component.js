import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { translate } from 'react-i18next';

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
  FitnessCenter,
  VpnKey,
} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';

import { Link } from 'react-router-dom';
import { DisconnectButton, LanguageButton } from '../components';
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
    const { classes, theme, t } = this.props;

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
              <ListItemText primary={t('navigation.dashboard')} />
            </ListItem>
          </Link>
          <Link to="/calendar" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Today />
              </ListItemIcon>
              <ListItemText primary={t('navigation.calendar')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/activity" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText primary={t('navigation.activity')} />
            </ListItem>
          </Link>
          <Link to="/payment-pack" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <VpnKey />
              </ListItemIcon>
              <ListItemText primary={t('navigation.pass')} />
            </ListItem>
          </Link>
          <Link to="/coach" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <FitnessCenter />
              </ListItemIcon>
              <ListItemText primary={t('common.coach')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/messaging" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary={t('navigation.message')} />
            </ListItem>
          </Link>
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary={t('navigation.member')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/payment" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <Payment />
              </ListItemIcon>
              <ListItemText primary={t('navigation.payment')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/signout" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
                <HighlightOff />
              </ListItemIcon>
              <ListItemText primary={t('navigation.logoff')} />
            </ListItem>
          </Link>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} color="inherit">
          <Toolbar>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
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
                  <img
                    className={classes.navIconHide}
                    height={40}
                    src={LOGO_ASSET}
                  />
                </Grid>
              </div>
              <div>
                <LanguageButton />
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

export default withStyles(styles, { withTheme: true })(
  translate()(ResponsiveDrawer),
);
