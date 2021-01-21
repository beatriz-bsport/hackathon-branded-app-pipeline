import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { RouteChildrenProps, withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { TFunction } from 'i18next';
import withQueryParams from '../../hocs/with-query-params.hoc';
import withReplaceQueryParams from '../../hocs/with-replace-query-params.hoc';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { addItemToBasket as addItemToBasketAction } from '../../libs/checkout/actions';
import * as paymentActions from '../../actions/payment.actions';
import MarketplaceCalendarComponent from '../../libs/marketplace/components/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/components/MarketplaceActivityDialog.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';

import { DATE_FORMAT } from '../../utils/datetime';
import themeSelectors from '../../libs/theme/selectors';
import { getCoaches } from '../../libs/associated-coach/selectors';
import { getMetaActivities } from '../../libs/meta-activity/selectors';

import { getAllEstablishments } from '../../libs/establishment/selectors';

import {
  snackbarSuccess as snackbarSuccessActions,
  snackbarError as snackbarErrorActions,
} from '../../actions/snackbar.actions';

import {
  fetchMarketplaceOfferList as fetchOfferListAction,
  fetchBookedGender as fetchBookedGenderAction,
} from '../../libs/offer/actions';
import {
  getMarketplaceOfferList,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
} from '../../libs/offer/selectors';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import withTitle from '../../hocs/with-title.hoc';

import Analytics from '../../components/analytics/Analytics.component';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';

type OwnProps = {
  companyId: number;
  authenticated: boolean;
  startWeekThisWeekday?: boolean;
  compactMode: boolean;
  requestSignUp: () => void;
  toogleCurrentBasketOpen: (value: boolean) => void;
  onCompletePurchase?: (offerId: number, packId: number) => void;
  otherParams: {
    date: string;
    filtersOpen: 'true' | '';
    onlyDay: string;
  };
  filters: {
    coaches: number[];
    establishments: number[];
    activity__in: number[];
    levels: number[];
  };
  setOtherParams: (key: string) => (value: any) => void;
  setFilters: (key: string) => (value: any) => void;
  goToPackPayment?: (packId: number, offerId: number) => void;
  goToBook?: (id: number, companyId: number) => void;
  goToBookOption?: (id: number, companyId: number) => void;
  store?: any; // for the widget only
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectProps &
  WithTranslation &
  RouteChildrenProps<any>;

type FinalProps = Props &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  offerId: number | null;
  offer: Object | null;
};

export class MarketplaceCalendar extends Component<FinalProps, State> {
  state: State = {
    offerId: null,
    offer: null,
  };

  fetchData = () => {
    const min_date = moment(this.props.otherParams.date)
      .startOf('week')
      .format(DATE_FORMAT);

    const max_date = moment(this.props.otherParams.date)
      .endOf('week')
      .format(DATE_FORMAT);

    this.props.fetchEstablishmentBulk(this.props.filters.establishments || []);

    this.props.fetchAssociatedCoachBulkFromCoachIds(
      this.props.filters.coaches || [],
      this.props.companyId,
    );

    const optionalParams: any = {};

    if (this.props.theme) {
      if (!this.props.theme.show_workshops_customer) {
        optionalParams.is_workshop = false;
      }
      if (!this.props.theme.show_cancelled_offers_customer) {
        optionalParams.available = true;
      }
    }

    this.props.fetchMetaActivityBulk(this.props.filters.activity__in || []);

    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      ...this.props.filters,
      ...optionalParams,
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const filtersPropsChanged = !isEqual(prevProps.filters, this.props.filters);
    const selectedDateChanged =
      prevProps.otherParams.date !== this.props.otherParams.date;

    if (filtersPropsChanged || selectedDateChanged) {
      this.fetchData();
    }
  }

  openOfferDialog = (offerId: number) => {
    this.setState({
      offerId,
      offer: this.props.offers.find((o: any) => o.id === offerId),
    });
  };

  closeOfferDialog = () => {
    this.setState({ offerId: null });
  };

  goToBook = (offer: any) => {
    Analytics.calendarSessionShow(offer);
    this.props.goToBook(offer.id, this.props.companyId);
  };

  goToBookOption = (id: number) => {
    this.props.goToBookOption(id, this.props.companyId);
  };

  handleDateChange = (d: string) => {
    const date = d
      ? moment(d).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');

    this.props.setOtherParams('date')(date);
  };

  toogleFiltersOpen = () => {
    this.props.setOtherParams('filtersOpen')(
      this.props.otherParams.filtersOpen === 'true' ? '' : 'true',
    );
  };

  render() {
    const {
      classes,
      offers,
      filters,
      establishments,
      coaches,
      startWeekThisWeekday,
    } = this.props;

    return (
      <div className={classes.container}>
        <MarketplaceActivityDialog
          offerId={this.state.offerId}
          offer={this.state.offer}
          showBookingButton
          displayPacksInformation
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
          compatibleConsumerPacks={this.props.compatibleConsumerPacks}
          compatiblePaymentPacks={this.props.compatiblePaymentPacks}
          fetchPassData={() => {
            this.props.fetchPaymentPacks(this.state.offerId);
            this.props.fetchCompatiblePass(this.state.offerId);
          }}
          goToPackPayment={this.props.goToPackPayment}
          goToPaymentComboPayment={this.props.goToPaymentComboPayment}
          paymentComboList={this.props.paymentComboList}
          goToOfferPayment={this.goToBook}
          onBookFromPack={(packId: number) =>
            this.props.onBookOfferFromPack(this.state.offerId, packId)
          }
        />
        <MarketplaceCalendarComponent
          offers={offers}
          showOfferFilling={this.props.theme.show_offers_filling}
          showOfferGender={this.props.theme.show_booked_gender_offer}
          setFilters={this.props.setFilters}
          filters={filters}
          loading={this.props.loading}
          offersLoading={this.props.loading}
          onClickOffer={this.openOfferDialog}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onSelectDate={this.handleDateChange}
          selectedDate={this.props.otherParams.date}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
          filtersOpen={this.props.otherParams.filtersOpen === 'true'}
          forceDayDisplayOnly={this.props.otherParams.onlyDay === 'true'}
          toogleFiltersOpen={this.toogleFiltersOpen}
          compactMode={this.props.compactMode}
          startWeekThisWeekday={startWeekThisWeekday}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

const mapStateToProps = (state: RootState) => ({
  offers: withCoach(
    withMetaActivity(withEstablishment(withGender(getMarketplaceOfferList))),
  )(state),
  loading: state.offer.marketplace.loading,
  coachLoading: state.coach.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  coaches: getCoaches(state),
  establishments: getAllEstablishments(state),
  metaActivities: getMetaActivities(state),
  theme: themeSelectors.getTheme(state),

  compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
  compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
  paymentComboList: getPaymentComboListAvailableOnline(state),
  currentBasket: getCurrentBasket(state),
});

const mapDispatchToProps = {
  snackbarError: snackbarErrorActions,
  snackbarSuccess: snackbarSuccessActions,
  fetchOfferList: fetchOfferListAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchAssociatedCoachBulkFromCoachIds: fetchAssociatedCoachBulkFromCoachIdsAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchBookedGender: fetchBookedGenderAction,
  pushAction: push,
  fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
  fetchCompatiblePass: paymentActions.fetchCompatiblePass,
  addItemToBasket: addItemToBasketAction,
};

const mapWithHandlers = {
  fetchOfferList: (props: Props) => (params: any) => {
    props.fetchOfferList(params, {
      onSuccess: (offerList: any) => {
        props.fetchEstablishmentBulk([
          ...offerList.map((o: any) => o.establishment),
          ...offerList.map((o: any) => o.establishment_override),
        ]);
        props.fetchAssociatedCoachBulkFromCoachIds(
          [
            ...offerList.map((o: any) => o.coach),
            ...offerList.map((o: any) => o.coach_override),
          ],
          props.companyId,
        );

        props.fetchMetaActivityBulk([
          ...offerList.map((o: any) => o.meta_activity),
        ]);
      },
    });
    if (props.theme && props.theme.show_booked_gender_offer) {
      props.fetchBookedGender(params);
    }
  },
  onBookOfferFromPack: (props: Props) => (offerId: number, packId: number) => {
    payWithConsumerPaymentPackAPI(packId, offerId, {})
      .then(() => {
        if (props.onCompletePurchase) {
          props.onCompletePurchase(packId, offerId);
          return;
        }
        props.pushAction('/');
        props.snackbarSuccess('booking.register.success');
      })
      .catch((err: any) => {
        console.error(err);
        if (err && err.response && err.response.status === 423) {
          switch (err.response.data) {
            case 'unavailable for female':
              props.snackbarError(
                props.t('booking:bookingModule.messages.femaleUnavailable'),
              );
              break;
            case 'unavailable for male':
              props.snackbarError(
                props.t('booking:bookingModule.messages.maleUnavailable'),
              );
              break;
            default:
              props.snackbarError(
                props.t('booking:bookingModule.messages.offerLocked'),
              );
              break;
          }
        }
      });
  },
  goToPaymentComboPayment: (props: Props) => (
    comboId: number,
    offerId: number,
  ) => {
    if (!props.authenticated) {
      props.requestSignUp();
    } else {
      props.addItemToBasket(props.currentBasket.id, {
        buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
        quantity: 1,
        buyable_item_id: comboId,
        extra_data: { offer_next: offerId },
      });
      props.toogleCurrentBasketOpen(true);
    }
  },
  goToPackPayment: (props: Props) => (packId: number, offerId: number) => {
    if (props.goToPackPayment) {
      props.goToPackPayment(packId, offerId);
      return;
    }

    if (!props.authenticated) {
      props.requestSignUp();
    } else {
      props.addItemToBasket(props.currentBasket.id, {
        buyable_item_identifier: BUYABLE_ITEM_PASS,
        quantity: 1,
        buyable_item_id: packId,
        extra_data: { offer_next: offerId },
      });
      props.toogleCurrentBasketOpen(true);
    }
  },
  goToBook: (props: Props) => (id: number, companyId: number) => {
    if (props.goToBook) {
      props.goToBook(id, companyId);
      return;
    }

    props.pushAction(`/customer/payment/offer/${id}?membership=${companyId}`);
  },

  goToBookOption: (props: Props) => (id: number, companyId: number) => {
    if (props.goToBookOption) {
      props.goToBookOption(id, companyId);
      return;
    }
    props.pushAction(`/customer/payment/offer/${id}?membership=${companyId}`);
  },
};

export const CalendarDataContainer = compose(
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
);

export default compose(
  withRouter,
  connect(null, { replace: replaceRouter }),
  withReplaceQueryParams(
    ['f_coaches', 'f_metaActivities', 'f_levels', 'f_establishments'],
    ['coaches', 'activity__in', 'levels', 'establishments'],
  ),
  withQueryParams([
    ['coaches', 'establishments', 'activity__in', 'levels'],
    'filters',
    'setFilters',
    'arrayNumber',
  ]),
  withQueryParams([
    ['filtersOpen', 'date', 'onlyDay'],
    'otherParams',
    'setOtherParams',
  ]),
  withTranslation(['booking', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceCalendar'),
  ),
  CalendarDataContainer,
)(MarketplaceCalendar);
