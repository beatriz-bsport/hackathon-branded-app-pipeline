// @flow
import React, { Component } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Badge from '@material-ui/core/Badge';
import { fade } from '@material-ui/core/styles/colorManipulator';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Basket } from '../../libs/checkout/types';

type Props = {
  auth: Object,
  title: ?string,
  logo: ?string,

  currentBasket: ?Basket,
  openCurrentBasket: () => void,

  disconnect: () => void,
  goToUserSpace: () => void,
  requestLogin: () => void,
  websiteURL: ?string,
  logo: ?string,

  t: TFunction,
  classes: Object,
};

type State = {
  isMenuOpen: boolean,
  anchorEl: ?HTMLElement,
};

export class ConsumerAppBar extends Component<Props, State> {
  state = {
    isMenuOpen: false,
    anchorEl: null,
  };

  handleProfileMenuOpen = (event: SyntheticEvent<HTMLElement>) => {
    if (this.props.auth.authenticated) {
      this.setState({ isMenuOpen: true, anchorEl: event.currentTarget });
    } else {
      this.props.requestLogin();
    }
  };

  renderProfileMenu = () => {
    const { anchorEl, isMenuOpen } = this.state;
    const { disconnect, t, auth } = this.props;
    if (auth.authenticated) {
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={() => this.setState({ isMenuOpen: false })}
        >
          <MenuItem onClick={this.props.goToUserSpace}>
            {t('navigation.consumer.profile')}
          </MenuItem>
          <MenuItem onClick={disconnect}>{t('navigation.logoff')}</MenuItem>
        </Menu>
      );
    }
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={() => this.setState({ isMenuOpen: false })}
      />
    );
  };

  renderAuthenticationInfo = () => {
    const { auth } = this.props;
    if (!auth.authenticated) {
      return 'LOGIN';
    }
    return <Typography color="inherit">{auth.username}</Typography>;
  };

  render() {
    const { classes, title } = this.props;
    const { isMenuOpen } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="white">
          <Toolbar>
            {this.props.logo ? (
              <ButtonBase
                onClick={() => {
                  if (this.props.websiteURL) {
                    window.location.href = this.props.websiteURL;
                  }
                }}
              >
                <img height={40} src={this.props.logo} alt="bsport logo" />
              </ButtonBase>
            ) : (
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
                noWrap
              >
                {title}
              </Typography>
            )}
            <div className={classes.grow} />
            {this.props.currentBasket ? (
              <ButtonBase
                onClick={this.props.openCurrentBasket}
                className={classes.iconLeft}
              >
                <Badge
                  color="primary"
                  badgeContent={this.props.currentBasket.checkout_items.reduce(
                    (s, a) => s + a.quantity,
                    0,
                  )}
                >
                  <ShoppingBasketIcon />
                </Badge>
              </ButtonBase>
            ) : null}
            <ButtonBase
              className={classes.loginButton}
              onClick={this.handleProfileMenuOpen}
            >
              <AccountCircleIcon
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                color="inherit"
                className={classes.accountIcon}
              />
              {this.renderAuthenticationInfo()}
            </ButtonBase>
          </Toolbar>
        </AppBar>
        {this.renderProfileMenu()}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  iconLeft: {
    marginRight: theme.spacing.unit * 3,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
  },
  accountIcon: {
    marginRight: theme.spacing.unit,
  },
  loginButton: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(ConsumerAppBar));
