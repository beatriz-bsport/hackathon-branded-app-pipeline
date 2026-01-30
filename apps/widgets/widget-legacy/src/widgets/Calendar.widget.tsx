import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import isBoolean from 'lodash/isBoolean';
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

import '../../vendor/map.css';

import { getEnv } from '../utils/env';
import { bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction } from '../libs/bridge/actions';

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

type Props = OwnProps & typeof mapDispatchToProps & WithStyles;

export const CalendarWidget = (props: Props) => {
  const {
    config,
    companyId,
    theme,
    onWindowOpen,
    bridgeRequestAuthenticationStatus,
  } = props;

  const filters: MarketplaceFilters = {
    coaches: config.coaches || [],
    establishments: config.establishments || [],
    activity__in: config.metaActivities || [],
    levels: config.levels || [],
    establishment_group__in: config.establishmentGroups || [],
  };

  const onlineFilter = config.onlineFilter ?? {};

  const [selectedDate, setSelectedDate] = useState(getNowISODate());

  useEffect(() => {
    bridgeRequestAuthenticationStatus();
  }, []);

  const setOtherParams = (key: string) => (value: any) =>
    key === 'date' ? setSelectedDate(value) : undefined;

  const onClickGoToBook = (id: number, givenCompanyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${givenCompanyId}`;
    onWindowOpen(url);
  };

  const cardMode =
    config?.cardMode ??
    (isBoolean(config?.compactMode) ? !config.compactMode : undefined);

  return (
    <MarketplaceCalendarStyled
      {...props}
      cardMode={cardMode}
      companyId={companyId}
      filters={filters}
      goToBook={onClickGoToBook}
      groupSessionByPeriod={config?.groupSessionByPeriod}
      mapContainerClassName="cleanslate"
      onlineFilter={{
        is_online: onlineFilter.is_online ?? undefined,
      }}
      otherParams={{
        date: selectedDate,
        onlyDay: config.todayOnly ? 'true' : '',
        filtersOpen: '',
      }}
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

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
};

export default compose<Props, OwnProps>(
  withStyles(styles),
  CalendarDataContainer,
  connect(null, mapDispatchToProps),
)(CalendarWidget);
