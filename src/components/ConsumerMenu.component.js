import React from 'react';

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

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
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HighlightOff from '@material-ui/icons/HighlightOff';
import EventIcon from '@material-ui/icons/Event';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 280;

class ConsumerMenu extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme, t } = this.props;

    const drawer = (
      <Paper className={classes.drawerPaper}>
        <List>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <ListItem button onClick={this.handleDrawerToggle}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={t('navigation.consumer.bookings')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/pass" style={{ textDecoration: 'none' }}>
            <ListItem button onClick={this.handleDrawerToggle}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary={t('navigation.consumer.pass')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <ListItem button onClick={this.handleDrawerToggle}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t('navigation.consumer.profile')} />
            </ListItem>
          </Link>
          <Divider />
          <Link to="/signout" style={{ textDecoration: 'none' }}>
            <ListItem button onClick={this.handleDrawerToggle}>
              <ListItemIcon>
                <HighlightOff />
              </ListItemIcon>
              <ListItemText primary={t('navigation.logoff')} />
            </ListItem>
          </Link>
        </List>
      </Paper>
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                Menu
              </Typography>
            </Toolbar>
          </AppBar>
        </Hidden>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer variant="permanent" open style={{ width: drawerWidth }}>
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

ConsumerMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

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
    marginTop: 50,
    width: drawerWidth,
    height: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

function mapStateToProps(state) {
  return {
    booking: state.consumer.bookings,
    options: state.consumer.options,
    pass: state.consumer.pass,
  };
}

export default withStyles(styles, { withTheme: true })(
  translate()(connect(mapStateToProps)(ConsumerMenu)),
);
