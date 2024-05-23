import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  MarketplaceCalendar,
  CalendarDataContainer,
  FinalProps as MarketplaceCalendarFinalProps,
  OwnProps as MarketplaceCalendarOwnProps,
} from 'bsport-saas/src/pages/marketplace/MarketplaceCalendarCSSOnly.page';
import {
  MarketplaceCalendarData,
  MarketplaceCalendarVariant,
} from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import withPostMessageOnPropsUpdate from 'bsport-saas/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from 'bsport-saas/src/hocs/postMessages/with-post-message-to-update-props';
import {
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from 'bsport-saas/src/libs/marketplace/utils';

import { Theme } from 'bsport-saas/src/libs/theme/types';
import {
  withStyles,
  createStyles,
  type WithStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import '../../vendor/map.css';

import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import {
  bridgeRequestRegisteredOfferIdList,
  bridgeRequestAuthenticationStatus,
} from '../libs/bridge/actions';

const getNowISODate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns month from 0 to 11, so we add 1
  const day = today.getDate().toString().padStart(2, '0'); // getDate() returns day of the month from 1 to 31

  return `${year}-${month}-${day}`;
};

type MarketplaceCalendarStyledProps = MarketplaceCalendarOwnProps & {
  theme: Theme,
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
  companyId: number,
  config: MarketplaceCalendarData,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
  dialogMode?: number,
  authenticated: boolean,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithStyles;

type State = {
  filters: FiltersType,
  onlineFilter: {
    is_online?: boolean | undefined,
  },
  selectedDate: string,
};

type FiltersType = {
  coaches: number[],
  establishments: number[],
  activity__in: number[],
  levels: number[],
  establishment_group__in: number[],
};

export class CalendarWidget extends Component<Props, State> {
  popupWindow: any;

  constructor(props: Props) {
    super(props);

    const filters: FiltersType = {
      coaches: props.config.coaches || [],
      establishments: props.config.establishments || [],
      activity__in: props.config.metaActivities || [],
      levels: props.config.levels || [],
      establishment_group__in: props.config.establishmentGroups || [],
    };

    const onlineFilter = props.config.onlineFilter ?? {};

    this.state = {
      filters,
      onlineFilter,
      selectedDate: getNowISODate(),
    };
  }

  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
    if (this.props.authenticated) {
      this.props.bridgeRequestRegisteredOfferIdList();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.bridgeRequestRegisteredOfferIdList();
    }
  }

  setFilters = (key: any) => {
    const _this = this;

    return (values: any) => {
      _this.setState((prevState) => ({
        filters: { ...prevState.filters, [key]: values },
      }));
    };
  };

  setOtherParams = (key: string) => {
    return (arg: any) => {
      if (key === 'date') {
        this.setState({ selectedDate: arg });
      }
    };
  };

  onClickGoToBook = (id: number, companyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    if (!this.props.authenticationReceived) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <MarketplaceCalendarStyled
        {...this.props}
        companyId={this.props.companyId}
        compactMode={
          this.props.config ? this.props.config.compactMode : undefined
        }
        onlineFilter={{
          is_online: this.state.onlineFilter.is_online || undefined,
        }}
        filters={this.state.filters}
        variant={this.props?.config?.variant}
        groupSessionByPeriod={this.props?.config?.groupSessionByPeriod}
        setFilters={this.setFilters}
        otherParams={{
          date: this.state.selectedDate,
          onlyDay: this.props.config.todayOnly ? 'true' : '',
          filtersOpen: '',
        }}
        setOtherParams={this.setOtherParams}
        goToBook={this.onClickGoToBook}
        onCompletePurchase={() => {}}
        theme={this.props.theme}
        mapContainerClassName="cleanslate"
      />
    );
  }
}

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
  bridgeRequestAuthenticationStatus,
  bridgeRequestRegisteredOfferIdList,
};

export default compose<Props, OwnProps>(
  withStyles(styles),
  CalendarDataContainer,
  connect(mapStateToProps, mapDispatchToProps),
)(CalendarWidget);
