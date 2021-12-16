import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Moment } from 'bsport-saas/src/i18n';
import {
  MarketplaceCalendar,
  CalendarDataContainer,
} from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import { MarketplaceCalendarData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

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
  filtersOpen: 'true' | '',
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
      filtersOpen: '',
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
      if (key === 'filtersOpen') {
        this.setState({ filtersOpen: arg });
      }
    };
  };

  onClickGoToBook = (id: number, companyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    return (
      <MarketplaceCalendarStyled
        {...this.props}
        companyId={this.props.companyId}
        compactMode={
          this.props.config ? this.props.config.compactMode : undefined
        }
        filters={this.state.filters}
        setFilters={this.setFilters}
        otherParams={{
          date: this.state.selectedDate,
          filtersOpen: this.state.filtersOpen,
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

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  bookedOffers: state.bridge.registeredOffers.ids_list,
});

const mapDispatchToProps = {
  bridgeRequestAuthenticationStatus,
  bridgeRequestRegisteredOfferIdList,
};

export default compose<any, Props>(
  CalendarDataContainer,
  connect(mapStateToProps, mapDispatchToProps),
)(CalendarWidget);
