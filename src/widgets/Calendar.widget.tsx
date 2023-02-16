import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Moment } from 'bsport-saas/src/i18n';
import {
  MarketplaceCalendar,
  CalendarDataContainer,
} from 'bsport-saas/src/pages/marketplace/MarketplaceCalendarCSSOnly.page';
import { MarketplaceCalendarData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import {
  withStyles,
  createStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import '../../vendor/map.css';

import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import {
  bridgeRequestRegisteredOfferIdList,
  bridgeRequestAuthenticationStatus,
} from '../libs/bridge/actions';

const DATE_FORMAT = 'YYYY-MM-DD';

const MarketplaceCalendarStyled = themify(MarketplaceCalendar);

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
  typeof mapDispatchToProps;

type State = {
  filters: {
    coaches: number[],
    establishments: number[],
    activity__in: number[],
    levels: number[],
    establishment_group__in: number[],
  },
  selectedDate: string,
};

export class CalendarWidget extends Component<Props, State> {
  popupWindow: any;

  constructor(props: Props) {
    super(props);

    const filters: any = {
      coaches: props.config.coaches || [],
      establishments: props.config.establishments || [],
      activity__in: props.config.metaActivities || [],
      levels: props.config.levels || [],
      establishment_group__in: props.config.establishmentGroups || [],
    };

    this.state = {
      filters,
      selectedDate: Moment().format(DATE_FORMAT),
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
        filters={this.state.filters}
        variant={this.props?.config?.variant}
        groupSessionByPeriod={this.props?.config?.groupSessionByPeriod}
        setFilters={this.setFilters}
        otherParams={{
          date: this.state.selectedDate,
          onlyDay: this.props.config.todayOnly ? 'true' : '',
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

export default compose<any, Props>(
  withStyles(styles),
  CalendarDataContainer,
  connect(mapStateToProps, mapDispatchToProps),
)(CalendarWidget);
