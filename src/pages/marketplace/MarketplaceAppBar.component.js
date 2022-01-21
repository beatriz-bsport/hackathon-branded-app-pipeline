// @flow
import React, { Component } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Badge from '@material-ui/core/Badge';
import { alpha } from '@material-ui/core/styles';
import { withTranslation, TFunction } from 'react-i18next';

import { Button, Dialog } from '@material-ui/core';
import People from '@material-ui/icons/People';
import { getTextColorFromRGB } from '../../utils/color';
import type { Basket } from '../../libs/checkout/types';
import ConnectedAsDialog from '../../libs/relationship/components/ConnectedAs.dialog';

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
  paper: boolean,
  isWidget?: boolean,

  t: TFunction,
  classes: Object,

  controlableMemberList: Array<Member>,
  navigateToRelationAccount: (memberId: number) => void,
  isRelationNavigation: boolean,
  navigateBackToMasterRelation: () => void,
};

type State = {
  isMenuOpen: boolean,
  anchorEl: ?HTMLElement,
  isConnectedAsDialogOpen: boolean,
};

export class MarketplaceAppBar extends Component<Props, State> {
  state = {
    isMenuOpen: false,
    anchorEl: null,
    isConnectedAsDialogOpen: false,
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
          {!this.props.isWidget && (
            <MenuItem onClick={this.props.goToUserSpace}>
              {t('navigation.consumer.profile')}
            </MenuItem>
          )}
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
    const { auth, classes } = this.props;
    if (!auth.authenticated) {
      return 'LOGIN';
    }
    return (
      <Typography className={classes.username} color="inherit">
        {auth.username}
      </Typography>
    );
  };

  renderUserMenu = () => {
    const { classes, title } = this.props;
    const { isMenuOpen } = this.state;
    const Wrapper = this.props.paper ? React.Fragment : Toolbar;
    return (
      <Wrapper>
        {this.props.isWidget && <div />}
        {!this.props.isWidget && (
          <>
            {this.props.logo && (
              <ButtonBase
                onClick={() => {
                  if (this.props.websiteURL) {
                    window.location.href = this.props.websiteURL;
                  }
                }}
              >
                <img height={40} src={this.props.logo} alt="bsport logo" />
              </ButtonBase>
            )}
            {!this.props.logo && (
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
                noWrap
              >
                {title}
              </Typography>
            )}
          </>
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
          />
          {this.props.isWidget ? (
            this.renderAuthenticationInfo()
          ) : (
            <Hidden smDown>{this.renderAuthenticationInfo()}</Hidden>
          )}
        </ButtonBase>
        {!!this.props.controlableMemberList?.length &&
          !this.props.isRelationNavigation && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.setState({ isConnectedAsDialogOpen: true })}
            >
              <People className={this.props.classes.connectedAsIcon} />
              <Typography className={this.props.classes.connectedAsTypo}>
                {this.props.t('consumerSpace:navigation.connectedAs')}
              </Typography>
            </Button>
          )}
      </Wrapper>
    );
  };

  render() {
    const { classes, paper } = this.props;
    return (
      <>
        <div style={{ width: '100%' }}>
          {paper ? (
            <div className={classes.root2}>
              {this.renderUserMenu()}

              {this.renderProfileMenu()}
            </div>
          ) : (
            <div className={classes.root}>
              <AppBar position="static" color="white">
                {this.renderUserMenu()}
              </AppBar>
              {this.renderProfileMenu()}
            </div>
          )}
          {this.props.isRelationNavigation && (
            <div className={classes.relationBanner}>
              <Typography>
                {this.props.t('consumerSpace:navigation.relationConnectedAs', {
                  name: this.props.auth?.name,
                })}
              </Typography>
              <ButtonBase
                className={classes.buttonRelation}
                onClick={this.props.navigateBackToMasterRelation}
              >
                {this.props
                  .t('consumerSpace:navigation.backToRelationMasterSpace')
                  ?.toUpperCase()}
              </ButtonBase>
            </div>
          )}
        </div>
        <Dialog
          open={this.state.isConnectedAsDialogOpen}
          onClose={() => this.setState({ isConnectedAsDialogOpen: false })}
        >
          <ConnectedAsDialog
            memberList={this.props.controlableMemberList}
            onSelectMember={() => {}}
            closeDialog={() =>
              this.setState({ isConnectedAsDialogOpen: false })
            }
            onConfirm={this.props.navigateToRelationAccount}
          />
        </Dialog>
      </>
    );
  }
}

const styles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  connectedAsTypo: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  connectedAsIcon: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
    },
  },
  buttonRelation: {
    textDecoration: 'underline',
    marginLeft: theme.spacing(2),
    marginBottom: '2px',
  },
  relationBanner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,

    color: getTextColorFromRGB(theme.palette.primary.main),
  },
  root: {
    width: '100%',
  },
  root2: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(3),
  },
  title: {
    display: 'block',
  },
  username: { marginLeft: theme.spacing(1) },
  grow: {
    flexGrow: 1,
  },
  loginButton: {
    backgroundColor: alpha(theme.palette.common.black, 0.12),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
    },
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginRight: theme.spacing(3),
  },
});

export default withStyles(styles)(withTranslation()(MarketplaceAppBar));
