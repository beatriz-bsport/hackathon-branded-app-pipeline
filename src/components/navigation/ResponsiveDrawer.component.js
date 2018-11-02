// @flow
import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';

import Today from '@material-ui/icons/Today';
import Star from '@material-ui/icons/Star';
import People from '@material-ui/icons/People';
import Payment from '@material-ui/icons/Payment';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Email from '@material-ui/icons/Email';
import HighlightOff from '@material-ui/icons/HighlightOff';
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import VpnKey from '@material-ui/icons/VpnKey';
import LocationOn from '@material-ui/icons/LocationOn';
import Search from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';

import { LanguageButton } from '../button/LanguageButton.component';
import RefreshButton from '../button/RefreshButton.component';
import SearchBar from '../SearchBar.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';

const drawerWidth = 240;

type Props = {
  isRefreshing: boolean,
  onRefresh: () => void,
  children: Object,
  theme: Object,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  mobileOpen: boolean,
};

class ResponsiveDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState((prevState) => ({ mobileOpen: !prevState.mobileOpen }));
  };

  render() {
    const { classes, theme, t, isRefreshing, onRefresh } = this.props;
    const items = [
      {
        to: '/search/results',
        text: t('navigation.search'),
        icon: Search,
        className: classes.menuMobile,
      },
      { type: 'divider', className: classes.menuMobile },
      {
        to: '/',
        text: t('navigation.dashboard'),
        icon: TrendingUp,
      },
      {
        to: '/calendar',
        icon: Today,
        text: t('navigation.calendar'),
      },
      'divider',
      {
        to: '/activity',
        icon: Star,
        text: t('navigation.activity'),
      },
      {
        to: '/coach',
        icon: FitnessCenter,
        text: t('common.coach'),
      },
      {
        to: '/map',
        icon: LocationOn,
        text: t('navigation.establishment'),
      },
      {
        to: '/payment-pack',
        icon: VpnKey,
        text: t('navigation.pass'),
      },
      'divider',
      {
        to: '/marketing',
        icon: Email,
        text: t('navigation.message'),
      },
      {
        to: '/member',
        icon: People,
        text: t('navigation.member'),
      },
      {
        to: '/payment',
        icon: Payment,
        text: t('navigation.payment'),
      },
      'divider',
      {
        to: '/settings/company',
        icon: SettingsIcon,
        text: t('navigation.settings'),
      },
      'divider',
      {
        to: '/signout',
        icon: HighlightOff,
        text: t('navigation.logoff'),
      },
    ].map((item, i) => {
      if (item === 'divider') {
        return <Divider key={i} />;
      }
      if (item.type === 'divider') {
        return <Divider key={i} className={item.className} />;
      }

      return (
        <Link
          key={i}
          to={item.to}
          style={{ textDecoration: 'none' }}
          className={item.className || ''}
        >
          <ListItem button onClick={this.handleDrawerToggle}>
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </Link>
      );
    });

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <Grid
            container
            style={{ paddingTop: 10 }}
            justify="center"
            alignItems="center"
          >
            <img height={40} src={LOGO_ASSET} alt="bsport logo" />
          </Grid>
        </div>
        <List>{items}</List>
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
                    className={`${classes.navIconHide} ${classes.menuIcon}`}
                    height={40}
                    src={LOGO_ASSET}
                    alt="bsport logo"
                  />
                </Grid>
              </div>
              <div className={classes.grow} />
              <Hidden smDown implementation="css">
                <Grid container alignItems="center" direction="row">
                  <Grid item className={classes.searchBar}>
                    <SearchBar />
                  </Grid>
                  <Grid item>
                    <RefreshButton
                      isRefreshing={isRefreshing}
                      onRefresh={onRefresh}
                    />
                  </Grid>
                  <Grid item>
                    <LanguageButton />
                  </Grid>
                </Grid>
              </Hidden>
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
            anchor="left"
            elevation={20}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>{this.props.children}</main>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth,
    },
  },
  grow: {
    flex: 1,
  },
  menuMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    position: 'fixed',
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
  menuIcon: {
    height: 32,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit * 3,
      paddingTop: 80,
    },
  },
  logo: {
    alignItems: 'center',
    justify: 'center',
  },
  searchBar: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles, { withTheme: true })(
  translate()(ResponsiveDrawer),
);
