import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Moment } from 'bsport-saas/src/i18n';
import { MarketplaceCalendar, CalendarDataContainer } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import { MarketplaceCalendarData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import { RootState } from '../store/reducer';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';
const DATE_FORMAT = 'YYYY-MM-DD';

const MarketplaceCalendarStyled = themify(MarketplaceCalendar);

type OwnProps = {
  companyId: number;
  config: MarketplaceCalendarData
  requestSignup: () => void;
  toogleCurrentBasketOpen: () => void;
  store: any;
  theme: Theme;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {
};

type State = {
  filtersOpen: "true" | '',
  filters: {
    coaches: number[];
    establishments: number[];
    activity__in: number[];
    levels: number[];
  };
  selectedDate: string,
};

export class CalendarWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const filters: any = {
      coaches: props.config.coaches || [],
      establishments: props.config.establishments || [],
      activity__in: props.config.metaActivities || [],
      levels: props.config.levels || [],
    };

    this.state = {
      filtersOpen: '',
      filters,
      selectedDate: Moment().format(DATE_FORMAT),
    };
  }

  setFilters = (key: any) => {
    const _this = this;

    return (values: any) => {
      _this.setState((prevState) => ({
        filters: { ...prevState.filters, [key]: values },
      }));
    };
  }

  setOtherParams = (key: string) => {
    return (arg: any) => {
      if (key === 'date') {
        this.setState({ selectedDate: arg });
      }
      if (key === 'filtersOpen') {
        this.setState({ filtersOpen: arg });
      }
    };
  }

  render() {
    return (
      <MarketplaceCalendarStyled
        {...this.props}
        companyId={this.props.companyId}
        compactMode={this.props.config ? this.props.config.compactMode : undefined}
        authenticated={this.props.authenticated}
        requestSignUp={this.props.requestSignup}
        toogleCurrentBasketOpen={this.props.toogleCurrentBasketOpen}
        filters={this.state.filters}
        setFilters={this.setFilters}
        otherParams={{
          date: this.state.selectedDate,
          filtersOpen: this.state.filtersOpen,
          onlyDay: '',
        }}
        setOtherParams={this.setOtherParams}
        goToBook={this.props.goToBook}
        goToBookOption={this.props.goToBookOption}
        goToPackPayment={this.props.goToPackPayment}
        onCompletePurchase={this.props.onCompletePurchase}
        theme={this.props.theme}
      />
    );
  }
}


const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
});

const mapDispatchToProps = {};

const mapWithProps = (props: ConnectProps & OwnProps) => ({
  goToPackPayment: (packId: number, offerId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${props.companyId}`
    );
  },
  onCompletePurchase: () => {
    window.open(`${BACKOFFICE_URI}/customer`);
  },
  goToBook: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
  goToBookOption: (id: number, companyId: number) => {
    window.open(
      `${BACKOFFICE_URI}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
});

export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  CalendarDataContainer,
  withProps(mapWithProps)
)(CalendarWidget);
