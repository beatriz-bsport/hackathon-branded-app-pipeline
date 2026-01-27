import {
  createStyles,
  withStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '@bsport/saas-legacy/src/libs/membership/actions';
import {
  Badge,
  ButtonBase,
  Fade,
  Grow,
  Portal,
  Tooltip,
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { compose } from 'recompose';

import type {
  Theme,
  WithStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import CreditCard from '@material-ui/icons/CreditCard';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TodayIcon from '@material-ui/icons/Today';

import { fetchCurrentBasket as fetchCurrentBasketAction } from '@bsport/saas-legacy/src/libs/checkout/actions';
import { getCurrentBasket } from '@bsport/saas-legacy/src/libs/checkout/selectors';
import { CheckoutItem } from '@bsport/saas-legacy/src/libs/checkout/types';
import { fetchBookingsAndPrivateBookings as fetchBookingsAndPrivateBookingsAction } from '@bsport/saas-legacy/src/libs/consumer-space/actions';
import { ConsumerSpaceContextEnum } from '@bsport/saas-legacy/src/libs/consumer-space/constants';
import { getAllBookingAndPrivateBookingCount } from '@bsport/saas-legacy/src/libs/consumer-space/selectors';
import { getMembership } from '@bsport/saas-legacy/src/libs/membership/selectors';
import WidgetUtils from '@bsport/saas-legacy/src/libs/widget/WidgetUtils';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { bridgeRequestLogout as bridgeRequestLogoutAction } from '../libs/bridge/actions';
import {
  closeUserInteractionPortal as closeUserInteractionPortalAction,
  fabShowBasket as fabShowBasketAction,
  fabShowBookings as fabShowBookingsAction,
  fabShowLogin as fabShowLoginAction,
  fabShowProfile as fabShowProfileAction,
  fabShowSubscription as fabShowSubscriptionAction,
} from '../libs/modal/actions';
import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import { buildUrlParams } from '../utils/http';

type OwnProps = {
  companyId: number;
  companyName: string;
  onWindowOpen: (url: string) => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

const FabWidget = (props: Props) => {
  const [showActions, setShowActions] = useState(false);
  const {
    authenticated,
    bridgeRequestLogout,
    classes,
    closeUserInteractionPortal,
    companyId,
    dialogUrl,
    t,
    fabShowLogin,
    fabShowBasket,
    fabShowBookings,
    fabShowProfile,
    fabShowSubscription,
    fetchCurrentBasket,
    fetchBookingsAndPrivateBookings,
    fetchMembershipByCompany,
    currentBookingsCount,
    currentBasket,
    membership,
  } = props;

  const fetchBasket = useCallback(() => {
    fetchCurrentBasket(companyId);
  }, [companyId]);

  const fetchBookingsCount = useCallback(() => {
    if (membership?.id) {
      fetchBookingsAndPrivateBookings({
        page: 1,
        only_future: true,
        member: membership?.id,
      });
    }
  }, [membership?.id]);

  useEffect(() => {
    WidgetUtils.setConsumerSpaceContext(ConsumerSpaceContextEnum.FAB);
  }, []);

  useEffect(() => {
    const { PUBLIC_URL } = getEnv();
    if (authenticated) {
      fetchMembershipByCompany(companyId);
    }
    fetchBasket();
    if (
      dialogUrl.includes(
        `${PUBLIC_URL}/login${buildUrlParams({
          next: `/c/${companyId}/booking/`,
        })}`,
      )
    ) {
      closeUserInteractionPortal();
      setShowActions(true);
    }
  }, [authenticated, companyId]);

  useEffect(() => {
    if (authenticated && membership?.id) {
      fetchBookingsCount();
    }
  }, [authenticated, membership?.id, fetchBookingsCount]);

  const onClick = () => {
    if (authenticated) {
      setShowActions(true);
    } else {
      fabShowLogin();
    }
  };

  const closeMenu = () => setShowActions(false);

  const onClickBasket = () => {
    closeMenu();
    fabShowBasket();
  };

  const onClickBookings = () => {
    closeMenu();
    fabShowBookings();
  };

  const onClickLogout = () => {
    closeMenu();
    bridgeRequestLogout();
  };

  const onClickProfile = () => {
    closeMenu();
    fabShowProfile();
  };

  const onClickSubscription = () => {
    closeMenu();
    fabShowSubscription();
  };

  const bookingsCount = currentBookingsCount;
  const basketCount =
    currentBasket?.checkout_items?.reduce(
      (s: number, a: CheckoutItem) => s + a.quantity,
      0,
    ) ?? 0;

  return (
    // eslint-disable-next-line no-undef
    <Portal container={document.body}>
      <Fade mountOnEnter unmountOnExit in={showActions}>
        <div className={classes.backgroundActions}>
          <ButtonBase
            disableRipple
            className={classes.backgroundButton}
            onClick={closeMenu}
          />
        </div>
      </Fade>

      <div className={classes.container}>
        <Grow in={showActions} timeout={showActions ? 600 : 0}>
          <Tooltip
            placement="right"
            title={t('navigation:backofficeMenu.consumer.bookings')}
          >
            <ButtonBase
              classes={{ root: classes.radius50 }}
              onClick={onClickBookings}
            >
              <Badge
                badgeContent={bookingsCount}
                color="secondary"
                invisible={bookingsCount === null}
              >
                <div className={classes.actionButton}>
                  <TodayIcon color="inherit" fontSize="small" />
                </div>
              </Badge>
            </ButtonBase>
          </Tooltip>
        </Grow>

        <Grow in={showActions} timeout={showActions ? 300 : 300}>
          <Tooltip placement="right" title={t('checkout:myBasket.title')}>
            <ButtonBase
              classes={{ root: classes.radius50 }}
              onClick={onClickBasket}
            >
              <Badge
                badgeContent={basketCount}
                color="secondary"
                invisible={basketCount === null}
              >
                <div className={classes.actionButton}>
                  <ShoppingBasketIcon color="inherit" fontSize="small" />
                </div>
              </Badge>
            </ButtonBase>
          </Tooltip>
        </Grow>

        <Grow in={showActions && authenticated} timeout={showActions ? 0 : 600}>
          <Tooltip
            placement="right"
            title={t('navigation:backofficeMenu.consumer.profile')}
          >
            <ButtonBase
              classes={{ root: classes.radius50 }}
              onClick={onClickProfile}
            >
              <div className={classes.actionButton}>
                <PersonIcon color="inherit" fontSize="small" />
              </div>
            </ButtonBase>
          </Tooltip>
        </Grow>

        <Grow in={showActions && authenticated} timeout={showActions ? 0 : 600}>
          <Tooltip
            placement="right"
            title={t('navigation:backofficeMenu.consumer.subscriptions')}
          >
            <ButtonBase
              classes={{ root: classes.radius50 }}
              onClick={onClickSubscription}
            >
              <div className={classes.actionButton}>
                <CreditCard color="inherit" fontSize="small" />
              </div>
            </ButtonBase>
          </Tooltip>
        </Grow>

        <Grow in={showActions} timeout={showActions ? 0 : 600}>
          <Tooltip
            placement="right"
            title={t('navigation:backofficeMenu.logoff')}
          >
            <ButtonBase
              classes={{ root: classes.radius50 }}
              onClick={onClickLogout}
            >
              <div className={classes.actionButton}>
                <PowerSettingsNewIcon color="inherit" fontSize="small" />
              </div>
            </ButtonBase>
          </Tooltip>
        </Grow>

        <ButtonBase classes={{ root: classes.radius50 }} onClick={onClick}>
          <div className={classes.fab}>
            {authenticated ? (
              <HomeIcon color="inherit" fontSize="large" />
            ) : (
              <PersonIcon color="inherit" fontSize="large" />
            )}
            <Grow
              in={!showActions && !!basketCount}
              timeout={showActions ? 0 : 600}
            >
              <div className={classes.fabBadgeBasket}>
                <ShoppingBasketIcon fontSize="inherit" />
              </div>
            </Grow>
            <Grow
              in={!showActions && !!bookingsCount}
              timeout={showActions ? 0 : 600}
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
};

const styles = (theme: Theme) =>
  createStyles({
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

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  dialogUrl: state.modal.url,
  authenticated: state.auth.authenticated,
  membership: getMembership(state, ownProps.companyId),
  currentBookingsCount: getAllBookingAndPrivateBookingCount(state),
  currentBasket: getCurrentBasket(state),
});

const mapDispatchToProps = {
  closeUserInteractionPortal: closeUserInteractionPortalAction,
  fabShowLogin: fabShowLoginAction,
  fabShowBasket: fabShowBasketAction,
  fabShowBookings: fabShowBookingsAction,
  fabShowProfile: fabShowProfileAction,
  fabShowSubscription: fabShowSubscriptionAction,
  bridgeRequestLogout: bridgeRequestLogoutAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
  fetchBookingsAndPrivateBookings: fetchBookingsAndPrivateBookingsAction,
  fetchMembershipByCompany: fetchMembershipByCompanyAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, OwnProps>(
  withStyles(styles),
  connector,
  withTranslation(['checkout', 'navigation']),
)(FabWidget);
