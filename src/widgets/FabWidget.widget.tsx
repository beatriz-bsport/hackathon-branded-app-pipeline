import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import {
  Badge,
  ButtonBase,
  Fade,
  Grow,
  Portal,
  Theme,
  Tooltip,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CreditCard from '@material-ui/icons/CreditCard';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TodayIcon from '@material-ui/icons/Today';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from '../reducers';
import {
  closeUserInteractionPortal,
  fabShowBasket,
  fabShowBookings,
  fabShowLogin,
  fabShowProfile,
  fabShowSubscription,
} from '../libs/modal/actions';
import { getEnv } from '../utils/env';
import {
  bridgeRequestLogout,
  bridgeRequestAuthenticationStatus,
  bridgeRequestBasketCount,
  bridgeRequestBookingCount,
} from '../libs/bridge/actions';

type OwnProps = {
  companyId: number,
  companyName: string,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  showActions: boolean,
};

class FabWidget extends React.PureComponent<Props, State> {
  state: State = {
    showActions: false,
  };

  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
    if (this.props.authenticated) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.props.bridgeRequestBasketCount();
    this.props.bridgeRequestBookingCount();
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.authenticated && !prevProps.authenticated) {
      const { PUBLIC_URL } = getEnv();
      this.fetchData();
      if (this.props.dialogUrl.includes(`${PUBLIC_URL}/login`)) {
        this.props.closeUserInteractionPortal();
        this.setState({ showActions: true });
      }
    }
  }

  onClick = () => {
    if (this.props.authenticated) {
      this.setState({ showActions: true });
    } else {
      this.props.fabShowLogin();
    }
  };

  onClickBasket = () => {
    this.setState({ showActions: false });
    this.props.fabShowBasket();
  };

  onClickBookings = () => {
    this.setState({ showActions: false });
    this.props.fabShowBookings();
  };

  onClickLogout = () => {
    this.setState({ showActions: false });
    this.props.bridgeRequestLogout();
  };

  onClickProfile = () => {
    this.setState({ showActions: false });
    this.props.fabShowProfile();
  };

  onClickSubscription = () => {
    this.setState({ showActions: false });
    this.props.fabShowSubscription();
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Portal container={document.body}>
        <Fade in={this.state.showActions} mountOnEnter unmountOnExit>
          <div className={classes.backgroundActions}>
            <ButtonBase
              disableRipple
              className={classes.backgroundButton}
              onClick={() => this.setState({ showActions: false })}
            />
          </div>
        </Fade>

        <div className={classes.container}>
          <Grow
            in={this.state.showActions}
            timeout={this.state.showActions ? 600 : 0}
          >
            <Tooltip
              title={t('navigation:backofficeMenu.consumer.bookings')}
              placement="right"
            >
              <ButtonBase
                onClick={this.onClickBookings}
                classes={{ root: classes.radius50 }}
              >
                <Badge
                  badgeContent={this.props.bookingsCount}
                  invisible={this.props.bookingsCount === null}
                  color="secondary"
                >
                  <div className={classes.actionButton}>
                    <TodayIcon fontSize="small" color="inherit" />
                  </div>
                </Badge>
              </ButtonBase>
            </Tooltip>
          </Grow>

          <Grow
            in={this.state.showActions}
            timeout={this.state.showActions ? 300 : 300}
          >
            <Tooltip title={t('checkout:myBasket.title')} placement="right">
              <ButtonBase
                onClick={this.onClickBasket}
                classes={{ root: classes.radius50 }}
              >
                <Badge
                  badgeContent={this.props.basketCount}
                  invisible={this.props.basketCount === null}
                  color="secondary"
                >
                  <div className={classes.actionButton}>
                    <ShoppingBasketIcon fontSize="small" color="inherit" />
                  </div>
                </Badge>
              </ButtonBase>
            </Tooltip>
          </Grow>

          <Grow
            in={this.state.showActions && this.props.authenticated}
            timeout={this.state.showActions ? 0 : 600}
          >
            <Tooltip
              title={t('navigation:backofficeMenu.consumer.profile')}
              placement="right"
            >
              <ButtonBase
                onClick={this.onClickProfile}
                classes={{ root: classes.radius50 }}
              >
                <div className={classes.actionButton}>
                  <PersonIcon fontSize="small" color="inherit" />
                </div>
              </ButtonBase>
            </Tooltip>
          </Grow>

          <Grow
            in={this.state.showActions && this.props.authenticated}
            timeout={this.state.showActions ? 0 : 600}
          >
            <Tooltip
              title={t('navigation:backofficeMenu.consumer.subscriptions')}
              placement="right"
            >
              <ButtonBase
                onClick={this.onClickSubscription}
                classes={{ root: classes.radius50 }}
              >
                <div className={classes.actionButton}>
                  <CreditCard fontSize="small" color="inherit" />
                </div>
              </ButtonBase>
            </Tooltip>
          </Grow>

          <Grow
            in={this.state.showActions}
            timeout={this.state.showActions ? 0 : 600}
          >
            <Tooltip
              title={t('navigation:backofficeMenu.logoff')}
              placement="right"
            >
              <ButtonBase
                onClick={this.onClickLogout}
                classes={{ root: classes.radius50 }}
              >
                <div className={classes.actionButton}>
                  <PowerSettingsNewIcon fontSize="small" color="inherit" />
                </div>
              </ButtonBase>
            </Tooltip>
          </Grow>

          <ButtonBase
            classes={{ root: classes.radius50 }}
            onClick={this.onClick}
            disabled={this.props.authenticationLoading}
          >
            <div className={classes.fab}>
              {this.props.authenticated ? (
                <HomeIcon fontSize="large" color="inherit" />
              ) : (
                <PersonIcon fontSize="large" color="inherit" />
              )}
              <Grow
                in={!this.state.showActions && !!this.props.basketCount}
                timeout={this.state.showActions ? 0 : 600}
              >
                <div className={classes.fabBadgeBasket}>
                  <ShoppingBasketIcon fontSize="inherit" />
                </div>
              </Grow>
              <Grow
                in={!this.state.showActions && !!this.props.bookingsCount}
                timeout={this.state.showActions ? 0 : 600}
              >
                <div className={classes.fabBadgeBookings}>
                  <TodayIcon fontSize="inherit" />
                </div>
              </Grow>
            </div>
          </ButtonBase>
        </div>
      </Portal>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    position: 'fixed',
    bottom: 20,
    left: 20,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundActions: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: '#00000033',
  },
  backgroundButton: {
    width: '100%',
    height: '100%',
  },
  radius50: {
    borderRadius: '50% !important',
  },
  fab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    'box-shadow': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginBottom: theme.spacing(2),
    borderRadius: '50%',
    backgroundColor: 'white',
    'box-shadow': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },
  iframe: {
    display: 'none !important',
  },
  fabBadgeBasket: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    fontSize: 14,
    right: 0,
    bottom: 0,
  },
  fabBadgeBookings: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    fontSize: 14,
    right: 0,
    top: 0,
  },
});

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  dialogUrl: state.modal.url,
  authenticated: state.bridge.authentication.authenticated,
  authenticationLoading: state.bridge.authentication.loading,
  basketCount: state.bridge.basket.count,
  bookingsCount: state.bridge.booking.count,
});

const mapDispatchToProps = {
  closeUserInteractionPortal,
  fabShowLogin,
  fabShowBasket,
  fabShowBookings,
  fabShowProfile,
  fabShowSubscription,
  bridgeRequestLogout,
  bridgeRequestAuthenticationStatus,
  bridgeRequestBasketCount,
  bridgeRequestBookingCount,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(['checkout', 'navigation']),
)(FabWidget);
