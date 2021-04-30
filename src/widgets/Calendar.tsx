import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Moment } from 'bsport-saas/src/i18n';
import { MarketplaceCalendar, CalendarDataContainer } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';
import { MarketplaceCalendarData } from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import '../../vendor/map.css';

import { RootState } from '../store/reducer';
import { constants } from '../const/constants';

const DATE_FORMAT = 'YYYY-MM-DD';

const MarketplaceCalendarStyled = themify(MarketplaceCalendar);

type OwnProps = {
  companyId: number;
  config: MarketplaceCalendarData;
  store: any;
  theme: Theme;
  onWindowOpen: (url: string) => void;
  dialogMode?: number;
}

type ConnectProps = ReturnType<typeof mapStateToProps>
  & typeof mapDispatchToProps;

type Props = OwnProps & ConnectProps &
  ReturnType<typeof mapWithProps> & {};

type State = {
  filtersOpen: 'true' | '',
  filters: {
    coaches: number[];
    establishments: number[];
    activity__in: number[];
    levels: number[];
  };
  selectedDate: string,
};

export class CalendarWidget extends Component<Props, State> {
  popupWindow?: any;

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
    const { PUBLIC_URL } = window.runtime.env;
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    return (
      <MarketplaceCalendarStyled
        {...this.props}
        companyId={this.props.companyId}
        compactMode={this.props.config ? this.props.config.compactMode : undefined}
        authenticated={this.props.authenticated}
        filters={this.state.filters}
        setFilters={this.setFilters}
        otherParams={{
          date: this.state.selectedDate,
          filtersOpen: this.state.filtersOpen,
          onlyDay: this.props.config.todayOnly ? 'true' : '',
        }}
        setOtherParams={this.setOtherParams}
        goToBook={this.onClickGoToBook}
        goToBookOption={this.props.goToBookOption}
        goToPackPayment={this.props.goToPackPayment}
        onCompletePurchase={this.props.onCompletePurchase}
        theme={this.props.theme}
        mapContainerClassName="cleanslate"
      />
    );
  }
}


const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
  token: state.auth.token,
});

const mapDispatchToProps = {};

const mapWithProps = (props: ConnectProps & OwnProps) => ({
  goToPackPayment: (packId: number, offerId: number) => {
    window.open(
      `${constants.backofficeUrl}/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${props.companyId}`
    );
  },
  onCompletePurchase: () => {
    window.open(`${constants.backofficeUrl}/customer`);
  },
  goToBookOption: (id: number, companyId: number) => {
    window.open(
      `${constants.backofficeUrl}/customer/payment/offer/${id}?membership=${companyId}`
    );
  },
});

export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  CalendarDataContainer,
  withProps(mapWithProps)
)(CalendarWidget);
