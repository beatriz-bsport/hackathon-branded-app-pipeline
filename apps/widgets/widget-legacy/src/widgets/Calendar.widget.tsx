import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  MarketplaceCalendar,
  CalendarDataContainer,
  FinalProps as MarketplaceCalendarFinalProps,
  OwnProps as MarketplaceCalendarOwnProps,
} from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceCalendarCSSOnly.page';
import type {
  MarketplaceCalendarData,
  MarketplaceFilters,
} from '@bsport/saas-legacy/src/libs/marketplace/types';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import withPostMessageOnPropsUpdate from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-to-update-props';
import {
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from '@bsport/saas-legacy/src/libs/marketplace/utils';

import { Theme } from '@bsport/saas-legacy/src/libs/theme/types';
import {
  withStyles,
  createStyles,
  type WithStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import '../../vendor/map.css';

import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import {
  bridgeRequestRegisteredOfferIdList as bridgeRequestRegisteredOfferIdListAction,
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
} from '../libs/bridge/actions';

const getNowISODate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns month from 0 to 11, so we add 1
  const day = today.getDate().toString().padStart(2, '0'); // getDate() returns day of the month from 1 to 31

  return `${year}-${month}-${day}`;
};

type MarketplaceCalendarStyledProps = MarketplaceCalendarOwnProps & {
  theme: Theme;
};

const MarketplaceCalendarStyled = compose<
  MarketplaceCalendarFinalProps,
  MarketplaceCalendarStyledProps
>(
  themify,
  withPostMessageOnPropsUpdate([
    { propName: 'filters', messageType: 'bsport:calendar:filter:update' },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:update',
    },
  ]),
  withPostMessageToUpdateProps([
    {
      propName: 'filters',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarFilterValidationSchema,
    },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarOnlineFilterValidationSchema,
    },
  ]),
)(MarketplaceCalendar);

type OwnProps = {
  companyId: number;
  config: MarketplaceCalendarData;
  store: any;
  theme: Theme;
  onWindowOpen: (_url: string) => void;
  dialogMode?: number;
  authenticated: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithStyles;

export const CalendarWidget = (props: Props) => {
  const {
    config,
    companyId,
    theme,
    classes,
    authenticated,
    authenticationReceived,
    onWindowOpen,
    bridgeRequestAuthenticationStatus,
    bridgeRequestRegisteredOfferIdList,
  } = props;

  const [selectedDate, setSelectedDate] = useState(getNowISODate);

  const filters: MarketplaceFilters = useMemo(
    () => ({
      coaches: config.coaches || [],
      establishments: config.establishments || [],
      activity__in: config.metaActivities || [],
      levels: config.levels || [],
      establishment_group__in: config.establishmentGroups || [],
    }),
    [
      config.coaches,
      config.establishments,
      config.metaActivities,
      config.levels,
      config.establishmentGroups,
    ],
  );

  const onlineFilter = useMemo(
    () => ({
      is_online: config?.onlineFilter?.is_online || undefined,
    }),
    [config.onlineFilter],
  );

  const otherParams = useMemo(
    () => ({
      date: selectedDate,
      onlyDay: config.todayOnly ? 'true' : '',
      filtersOpen: '' as const,
    }),
    [selectedDate, config.todayOnly],
  );

  const onCompletePurchaseProp = useCallback(() => {}, []);

  useEffect(() => {
    bridgeRequestAuthenticationStatus();
    if (authenticated) {
      bridgeRequestRegisteredOfferIdList();
    }
  }, [
    authenticated,
    bridgeRequestAuthenticationStatus,
    bridgeRequestRegisteredOfferIdList,
  ]);

  const setOtherParams = useCallback((key: string) => {
    return (arg: any) => {
      if (key === 'date') {
        setSelectedDate(arg);
      }
    };
  }, []);

  const onClickGoToBook = useCallback(
    (id: number, givenCompanyId: number) => {
      const { PUBLIC_URL } = getEnv();
      const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${givenCompanyId}`;
      onWindowOpen(url);
    },
    [onWindowOpen],
  );

  if (!authenticationReceived) {
    return (
      <div className={classes.container}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <MarketplaceCalendarStyled
      {...props}
      compactMode={config ? config.compactMode : undefined}
      companyId={companyId}
      filters={filters}
      goToBook={onClickGoToBook}
      groupSessionByPeriod={config?.groupSessionByPeriod}
      mapContainerClassName="cleanslate"
      onCompletePurchase={onCompletePurchaseProp}
      onlineFilter={onlineFilter}
      otherParams={otherParams}
      setOtherParams={setOtherParams}
      theme={theme}
      variant={config?.variant}
    />
  );
};

const styles = () =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
  });

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  bookedOffers: state.bridge.registeredOffers.ids_list,
  username: state.bridge.authentication.username,
  authenticationReceived: state.bridge.authentication.hasBeenReceived,
});

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  bridgeRequestRegisteredOfferIdList: bridgeRequestRegisteredOfferIdListAction,
};

export default compose<Props, OwnProps>(
  withStyles(styles),
  CalendarDataContainer,
  connect(mapStateToProps, mapDispatchToProps),
)(CalendarWidget);
