import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Moment } from 'bsport-saas/src/i18n';
import { MarketplaceCalendarBase } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import { RootState } from '../store/reducer';

const BACKOFFICE_URI = 'https://backoffice.bsport.io';
const DATE_FORMAT = 'YYYY-MM-DD';


type OwnProps = {
  companyId: number;
  defaultFilters: {
    coaches: number[];
    establishments: number[];
    levels: number[];
    activity__in: number[];
  },
  compactMode: any;
  filtersOpen: boolean;
  requestSignup: () => void;
  toogleCurrentBasketOpen: () => void;
  store: any;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {
};

type State = {
  filtersOpen: "true" | '',
  filters: any,
  selectedDate: string,
};

export class CalendarWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const filters: any = props.defaultFilters || {};

    if (filters.metaActivities) {
      filters.activity__in = filters.metaActivities;
    }

    this.state = {
      filtersOpen: 'true',
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
    };
  }

  render() {
    return (
      <MarketplaceCalendarBase
        companyId={this.props.companyId}
        compactMode={this.props.compactMode}
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
        store={this.props.store}
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(mapWithProps)
)(CalendarWidget);
