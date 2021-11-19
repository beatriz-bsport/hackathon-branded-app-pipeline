import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { RouteChildrenProps, withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithTranslation, withTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';

import { TFunction } from 'i18next';
import withQueryParams from '../../hocs/with-query-params.hoc';
import withReplaceQueryParams from '../../hocs/with-replace-query-params.hoc';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { addItemToBasket as addItemToBasketAction } from '../../libs/checkout/actions';
import MarketplaceCalendarComponent from '../../libs/marketplace/components/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/components/MarketplaceActivityDialog.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';

import { DATE_FORMAT } from '../../utils/datetime';
import themeSelectors from '../../libs/theme/selectors';
import { getCoaches } from '../../libs/associated-coach/selectors';
import { getMetaActivities } from '../../libs/meta-activity/selectors';

import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '../../libs/establishment/selectors';

import {
  snackbarSuccess as snackbarSuccessActions,
  snackbarError as snackbarErrorActions,
} from '../../libs/snackbar/actions';

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
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  fetchAllEstablishmentGroup,
} from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';

import withTitle from '../../hocs/with-title.hoc';

import Analytics from '../../components/analytics/Analytics.component';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { OfferFilterData } from '../../libs/offer/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../libs/establishment/types';

type OwnProps = {
  companyId: number;
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
    establishment_group__in: number[];
  };
  setOtherParams: (key: string) => (value: any) => void;
  setFilters: (key: string) => (value: any) => void;
  goToPackPayment?: (packId: number, offerId: number) => void;
  goToBook?: (id: number, companyId: number) => void;
  goToBookOption?: (id: number, companyId: number) => void;
  store?: any; // for the widget only
  mapContainerClassName?: string;
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

    this.props.fetchAllEstablishmentGroup(this.props.companyId);
  };

  componentDidMount() {
    this.fetchData();
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
    });
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
      establishmentGroupList,
      loading,
      metaActivities,
      compactMode,
    } = this.props;

    let filteredEstablishments: Array<Establishment> = [...establishments];
    if (filters.establishment_group__in?.length) {
      const filteredEstablishmentIds: Array<number> = establishmentGroupList
        .filter((eg: EstablishmentGroup) =>
          filters.establishment_group__in.includes(eg.id),
        )
        .flatMap((eg: EstablishmentGroup) => eg.establishment)
        .map((e: Establishment) => e.id);

      const uniqueEstIds = filters.establishments?.length
        ? [...new Set(filteredEstablishmentIds.concat(filters.establishments))]
        : filteredEstablishmentIds;

      filteredEstablishments = [...establishments].filter((e: Establishment) =>
        uniqueEstIds.includes(e.id),
      );
    }

    return (
      <div className={classes.container}>
        <MarketplaceActivityDialog
          offerId={this.state.offerId}
          offer={this.state.offer}
          showBookingButton
          hideCoach={this.props.theme && this.props.theme.hideCoach}
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
          goToOfferPayment={this.goToBook}
          mapContainerClassName={this.props.mapContainerClassName}
        />
        <MarketplaceCalendarComponent
          offers={offers}
          showOfferFilling={this.props.theme.show_offers_filling}
          hideCoach={this.props.theme.hideCoach}
          showOfferGender={this.props.theme.show_booked_gender_offer}
          setFilters={this.props.setFilters}
          filters={filters}
          loading={loading}
          offersLoading={loading}
          onClickOffer={this.openOfferDialog}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onSelectDate={this.handleDateChange}
          selectedDate={
            this.props.otherParams.date || moment().format('YYYY-MM-DD')
          }
          coaches={coaches}
          establishments={filteredEstablishments}
          metaActivities={metaActivities}
          filtersOpen={this.props.otherParams.filtersOpen === 'true'}
          forceDayDisplayOnly={this.props.otherParams.onlyDay === 'true'}
          toogleFiltersOpen={this.toogleFiltersOpen}
          compactMode={compactMode}
          startWeekThisWeekday={startWeekThisWeekday}
          establishmentGroupList={establishmentGroupList}
          showMultiLocalization={this.props.theme.enable_multi_localization}
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

  paymentComboList: getPaymentComboListAvailableOnline(state),
  currentBasket: getCurrentBasket(state),
  establishmentGroupList: groupWithEstablishment(
    getAssociatedEstablishmentGroup,
  )(state),
});

const mapDispatchToProps = {
  snackbarError: snackbarErrorActions,
  snackbarSuccess: snackbarSuccessActions,
  fetchOfferList: fetchOfferListAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchAssociatedCoachBulkFromCoachIds:
    fetchAssociatedCoachBulkFromCoachIdsAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchBookedGender: fetchBookedGenderAction,
  pushAction: push,
  addItemToBasket: addItemToBasketAction,
  fetchPaymentComboList,
  fetchAllEstablishmentGroup,
};

const mapWithHandlers = {
  fetchOfferList:
    (props: Props) =>
    (params: {
      company: number;
      max_date: string;
      min_date: string;
      is_workshop?: boolean;
      available?: boolean;
      filters: OfferFilterData;
    }) => {
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
    [
      'f_coaches',
      'f_metaActivities',
      'f_levels',
      'f_establishments',
      'f_establishmentGroups',
    ],
    [
      'coaches',
      'activity__in',
      'levels',
      'establishments',
      'establishment_group__in',
    ],
  ),
  withQueryParams([
    [
      'coaches',
      'establishments',
      'activity__in',
      'levels',
      'establishment_group__in',
    ],
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
