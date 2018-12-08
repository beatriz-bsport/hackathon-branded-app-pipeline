// @flow
import React, { Component } from 'react';

import {
  Toolbar,
  ButtonBase,
  Typography,
  AppBar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  withStyles,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { push } from 'react-router-redux';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';

import { auth as authActions } from '../../actions';
import { ConsumerLogin } from '..';
import SignUpForm from '../form/SignUpForm.component';

type Props = {
  t: TFunction,
  classes: Object,
  push: (path: string) => void,
  company: MarketplaceCompany,
  signup: (data: [*]) => void,
  disconnect: () => void,
  auth: Object,
  doEmailLogin: ({ email: string, password: string }) => void,
  title: ?string,
};

export class ConsumerAppBar extends Component<Props> {
  state = {
    isMenuOpen: false,
    anchorEl: null,
  };

  handleProfileMenuOpen = (event) => {
    this.setState({ isMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ isMenuOpen: false });
  };

  goToUserSpace = () => {
    this.props.push('/');
  };

  signup = (data) => {
    const data_ = { ...data, membership: this.props.company.id };
    this.props.signup(data_);
  };

  openSignUpdModal = () => {
    this.setState({
      isMenuOpen: false,
      anchorEl: null,
      isSignupDialogOpen: true,
    });
  };

  renderProfileMenu = () => {
    const { anchorEl, isMenuOpen } = this.state;
    const { classes, disconnect, t, auth } = this.props;
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleProfileMenuClose}
      >
        {auth.authenticated ? (
          <React.Fragment>
            <MenuItem onClick={this.goToUserSpace}>
              {t('navigation.consumer.profile')}
            </MenuItem>
            <MenuItem onClick={disconnect}>{t('navigation.logoff')}</MenuItem>
          </React.Fragment>
        ) : (
          <div className={classes.loginMenu}>
            <ConsumerLogin
              doEmailLogin={this.props.doEmailLogin}
              error={auth.error}
              loading={auth.loading}
              requestSignUp={this.openSignUpdModal}
            />
          </div>
        )}
      </Menu>
    );
  };

  renderAuthenticationInfo = () => {
    const { auth } = this.props;
    if (!auth.authenticated) {
      return 'LOGIN';
    }
    return <Typography color="inherit">{auth.username}</Typography>;
  };

  closeSignupDialog = () => {
    this.setState({ isSignupDialogOpen: false });
  };

  renderSignupDialog = () => {
    const { isSignupDialogOpen } = this.state;
    const { t, auth } = this.props;
    return (
      <Dialog
        open={isSignupDialogOpen && !auth.authenticated}
        onClose={this.closeSignupDialog}
      >
        <DialogTitle>{t('form.signUpTitle')}</DialogTitle>
        <DialogContent>
          <SignUpForm
            loading={auth.loading}
            onComplete={this.signup}
            onCancel={this.closeSignupDialog}
          />
        </DialogContent>
      </Dialog>
    );
  };

  render() {
    const { classes, title } = this.props;
    const { isMenuOpen } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              {title}
            </Typography>
            <div className={classes.grow} />
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
        {this.renderSignupDialog()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    company: state.marketplace.company,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    push(path) {
      dispatch(push(path));
    },

    doEmailLogin({ email, password }) {
      dispatch(authActions.requestLogin(email, password));
    },
    signup(data) {
      dispatch(authActions.signup(data));
    },
    disconnect() {
      dispatch(authActions.disconnect());
    },
  };
}
const styles = (theme) => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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
  loginMenu: {
    margin: theme.spacing.unit * 2,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(translate()(ConsumerAppBar)));
