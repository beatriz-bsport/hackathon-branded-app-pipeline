// @ts-nocheck
import React, { Component } from 'react';
import memoize from 'lodash/memoize';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { RouteChildrenProps, withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import { TFunction } from 'i18next';

import uniq from 'lodash/uniq';
import withQueryParams from '#hocs/with-query-params.hoc';
import withReplaceQueryParams from '#hocs/with-replace-query-params.hoc';
import { addItemToBasket as addItemToBasketAction } from '#libs/checkout/actions';
import MarketplaceCalendarComponent from '#libs/marketplace/components/@Calendar/MarketplaceCalendarCSSOnly/MarketplaceCalendarCSSOnly.component';
import MarketplaceActivityDialogV2 from '#libs/marketplace/components/@Activity/MarketplaceActivityDialogCSSOnly/MarketplaceActivityDialogCSSOnly.component';
import { getCurrentBasket } from '#libs/checkout/selectors';

import { DATE_FORMAT } from '../../utils/datetime';
import themeSelectors from '#libs/theme/selectors';
import { getCoaches } from '#libs/associated-coach/selectors';
import {
  getMetaActivitiesDict as getMetaActivitiesWorkshopsDict,
  getPureMetaActivitiesDict,
} from '#libs/meta-activity/selectors';
import {
  getOffersListByGroup as getOffersListByGroupSelector,
  getGroupData,
} from '#libs/group-offer/selectors';
import { isOfferInThePast, doTextSearch } from '../../libs/marketplace/utils';

import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '#libs/establishment/selectors';

import {
  snackbarSuccess as snackbarSuccessActions,
  snackbarError as snackbarErrorActions,
} from '#libs/snackbar/actions';

import {
  fetchLevelBulk as fetchLevelBulkAction,
  resetLevels,
} from '#libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
  getLevelsDetails,
} from '#libs/level/selectors';

import {
  fetchMarketplaceOfferList as fetchOfferListAction,
  fetchNextAvailableOffer as fetchNextAvailableOfferAction,
  fetchBookedGender as fetchBookedGenderAction,
  fetchOfferRegisteredIds as fetchOfferRegisteredIdsAction,
  fetchOffersInGroup as fetchOffersInGroupAction,
} from '#libs/offer/actions';
import {
  getMarketplaceOfferList,
  getBookedOffers,
  getNextAvailableOffer,
  getBookedGenderOffer,
} from '#libs/offer/selectors';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '#libs/associated-coach/actions';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  fetchAllEstablishmentGroup,
} from '#libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchGroupsOfferBulk as fetchGroupsOfferBulkAction } from '#libs/group-offer/actions';

import withTitle from '#hocs/with-title.hoc';

import Analytics from '#components/analytics/Analytics.component';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import { Offer, OfferFilterData, Offer_FULL } from '#libs/offer/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import GroupRulePopup from '#libs/marketplace/components/@Offer/GroupRulePopup.dialog';
import { Level } from '#libs/level/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import withQueryParamsToProps from '#hocs/query-params-to-props.hoc';
import { getBookCalendarUrl } from '#libs/marketplace/routing-utils';

type OwnProps = {
  companyId: number;
  startWeekThisWeekday?: boolean;
  compactMode: boolean;
  groupSessionByPeriod: boolean;
  variant?: 'activityName' | 'coach' | 'time';
  requestSignUp: () => void;
  toggleCurrentBasketOpen: (value: boolean) => void;
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
  getLevel: (id: number) => Level;
  goToBookOption?: (id: number, companyId: number) => void;
  store?: any; // for the widget only
  mapContainerClassName?: string;
  nextAvailableOffer?: Offer;
  authenticated?: boolean;
  // username is propagated from the widget in order to retrieve user
  // specific information without relying on auth tokens
  username?: string;
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectProps &
  WithTranslation &
  RouteChildrenProps<any>;

type FinalProps = Props & WithHandlerType<typeof mapWithHandlers>;
type State = {
  offerId: number | null;
  offer: Offer | null;
  displayGroupPopup: (Offer_FULL & { redirect: string }) | null;
  filteredEstablishments: Array<Establishment> | null;
  offerSearchResult: { query: string; offerList: Offer[] | null };
};

export class MarketplaceCalendar extends Component<FinalProps, State> {
  state: State = {
    offerId: null,
    offer: null,
    displayGroupPopup: null,
    filteredEstablishments: null,
    offerSearchResult: { query: '', offerList: null },
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

    this.props.fetchLevelBulk({
      company: this.props.companyId,
      id__in: this.props.filters.levels || [],
    });

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

    this.props.fetchNextAvailableOffer(
      {
        company: this.props.companyId,
        ...this.props.filters,
        ...optionalParams,
      },
      {
        onSuccess: (result: Offer) => {
          if (
            // only redirect in list mode otherwise the user will be lost
            this.props.compactMode &&
            moment(this.props.otherParams.date)
              .startOf('week')
              .isBefore(moment(result?.date_start).startOf('week'))
          ) {
            this.props.setOtherParams('date')(result?.date_start);
          }
        },
      },
    );
    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      ...(this.props.username
        ? { username: encodeURI(this.props.username) }
        : {}),
      ...this.props.filters,
      ...optionalParams,
      with_tags: true,
    });

    this.props.fetchAllEstablishmentGroup(this.props.companyId);

    if (this.props.authenticated) {
      this.props.fetchOfferRegisteredIds();
    }
  };

  componentDidMount() {
    this.props.resetLevels();
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const filtersPropsChanged = !isEqual(prevProps.filters, this.props.filters);
    const selectedWeekChanged = !moment(prevProps.otherParams.date)
      .startOf('week')
      .isSame(moment(this.props.otherParams.date).startOf('week'));
    if (filtersPropsChanged || selectedWeekChanged) {
      this.fetchData();
    }
    const filtersEstablishmentsChanged = !isEqual(
      prevProps.filters.establishment_group__in,
      this.props.filters.establishment_group__in,
    );
    const establishmentsChanged = !isEqual(
      prevProps.establishments,
      this.props.establishments,
    );

    const offersChanged = !isEqual(
      prevProps.offers.map((o) => o.id),
      this.props.offers.map((o) => o.id),
    );

    const searchQueryChanged = !isEqual(
      prevState.offerSearchResult.query,
      this.state.offerSearchResult.query,
    );

    if (offersChanged || searchQueryChanged) {
      this.handleSearchFilter(this.state.offerSearchResult.query);
    }

    if (filtersEstablishmentsChanged || establishmentsChanged) {
      let filteredEstablishments: Array<Establishment> = [
        ...this.props.establishments,
      ];

      if (this.props.filters.establishment_group__in?.length) {
        const filteredEstablishmentIds: Array<number> =
          this.props.establishmentGroupList
            .filter((eg: EstablishmentGroup) =>
              this.props.filters.establishment_group__in.includes(eg.id),
            )
            .flatMap((eg: EstablishmentGroup) => eg.establishment)
            .map((e: Establishment) => e.id);

        const uniqueEstIds = this.props.filters.establishments?.length
          ? [
              ...new Set(
                filteredEstablishmentIds.concat(
                  this.props.filters.establishments,
                ),
              ),
            ]
          : filteredEstablishmentIds;

        filteredEstablishments = Immutable<Array<Establishment>>(
          this.props.establishments.filter((e: Establishment) =>
            uniqueEstIds.includes(e.id),
          ),
        );
      }
      this.setState({ filteredEstablishments });
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

  goToBook = (offer: Offer_FULL) => {
    this.closeOfferDialog();
    if (offer.group?.full_booking_only) {
      this.setState(
        {
          displayGroupPopup: { ...offer, redirect: 'book' },
        },
        () => this.props.fetchOffersInGroupAction(offer.group.id),
      );
      return;
    }
    Analytics.calendarSessionShow(offer);
    this.props.goToBook(offer.id, this.props.companyId);
  };

  goToBookOption = (offer: Offer_FULL) => {
    this.closeOfferDialog();
    if (offer.group) {
      this.setState({
        displayGroupPopup: { ...offer, redirect: 'option' },
      });
      return;
    }
    Analytics.calendarSessionShow(offer);
    this.props.goToBookOption(offer.id, this.props.companyId);
  };

  handleDateChange = (d: string) => {
    const date = d
      ? moment(d).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');

    this.props.setOtherParams('date')(date);
  };

  toggleFiltersOpen = () => {
    this.props.setOtherParams('filtersOpen')(
      this.props.otherParams.filtersOpen === 'true' ? '' : 'true',
    );
  };

  goToFirstAvailableSession = () => {
    if (this.props.nextAvailableOffer.date_start) {
      this.handleDateChange(this.props.nextAvailableOffer.date_start);
    }
  };

  handleCloseGroupPopup = () => {
    this.setState({
      displayGroupPopup: null,
    });
  };

  handleContinueGroupPopup = () => {
    this.handleCloseGroupPopup();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { redirect, group, ...offer } = this.state.displayGroupPopup;
    if (redirect === 'book') {
      this.goToBook(offer);
    }
    if (redirect === 'option') {
      this.goToBookOption(offer);
    }
  };

  handleClearSearchResult = () => {
    this.setState({
      offerSearchResult: {
        query: '',
        offerList: null,
      },
    });
  };

  handleSearch = (searchText: string) => {
    this.setState({
      offerSearchResult: {
        query: searchText,
      },
    });
  };

  handleSearchFilter = (searchText: string) => {
    if (searchText) {
      const metaActivities = this.props.theme.show_workshops_customer
        ? this.props.metaActivitiesWorkshops
        : this.props.metaActivities;
      const establishments = this.props.filters.establishment_group__in?.length
        ? this.state.filteredEstablishments
        : this.props.establishments;

      const [searchedCoaches, searchedEstablishments, searchedMetaActivities] =
        doTextSearch(
          searchText,
          this.props.coaches,
          establishments,
          Object.values(metaActivities),
        );

      const searchResult = this.props.offers.filter(
        (offer) =>
          searchedEstablishments.includes(offer.establishment) ||
          searchedMetaActivities.includes(offer.meta_activity) ||
          searchedCoaches.includes(offer.coach),
      );

      this.setState({
        offerSearchResult: { query: searchText, offerList: searchResult },
      });
    } else {
      this.handleClearSearchResult();
    }
  };

  render() {
    const {
      filters,
      establishments,
      coaches,
      activeCustomLevels,
      customLevels,
      startWeekThisWeekday,
      establishmentGroupList,
      loading,
      metaActivities,
      compactMode,
    } = this.props;

    return (
      <>
        <MarketplaceActivityDialogV2
          coaches={coaches}
          companyTheme={this.props.theme}
          customLevels={this.props.customLevels}
          establishments={
            filters.establishment_group__in?.length
              ? this.state.filteredEstablishments
              : establishments
          }
          group={this.props.group}
          hideCoach={this.props.theme && this.props.theme.hideCoach}
          isBookingDisabled={
            !this.state.offer?.available || isOfferInThePast(this.state?.offer)
          }
          mapContainerClassName={this.props.mapContainerClassName}
          metaActivities={
            this.props.theme.show_workshops_customer
              ? this.props.metaActivitiesWorkshops
              : metaActivities
          }
          offer={this.state.offer}
          offerId={this.state.offerId}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
        />
        <MarketplaceCalendarComponent
          activeCustomLevels={activeCustomLevels}
          bookedOffers={this.props.bookedOffers}
          coaches={coaches}
          compactMode={compactMode}
          companyId={this.props.companyId}
          customLevels={customLevels}
          establishmentGroupList={establishmentGroupList}
          establishments={
            filters.establishment_group__in?.length
              ? this.state.filteredEstablishments
              : establishments
          }
          events={this.props.events}
          filters={filters}
          filtersOpen={this.props.otherParams.filtersOpen === 'true'}
          forceDayDisplayOnly={this.props.otherParams.onlyDay === 'true'}
          genderCount={this.props.genderCount}
          getLevel={this.props.getLevel}
          goToFirstAvailableSession={this.goToFirstAvailableSession}
          group={this.props.group}
          groupSessionByPeriod={this.props.groupSessionByPeriod}
          hideCoach={this.props.theme.hideCoach}
          loading={loading}
          metaActivities={
            this.props.theme.show_workshops_customer
              ? this.props.metaActivitiesWorkshops
              : metaActivities
          }
          nextAvailableOffer={this.props.nextAvailableOffer}
          offers={this.props.offers}
          offersLoading={loading}
          onClearInput={this.handleClearSearchResult}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onClickOffer={this.openOfferDialog}
          onSearch={this.handleSearch}
          onSelectDate={this.handleDateChange}
          searchedOffers={this.state.offerSearchResult?.offerList}
          selectedDate={
            this.props.otherParams.date || moment().format('YYYY-MM-DD')
          }
          setFilters={this.props.setFilters}
          showMultiLocalization={this.props.theme.enable_multi_localization}
          showOfferFilling={this.props.theme.show_offers_filling}
          showOfferGender={this.props.theme.show_booked_gender_offer}
          startWeekThisWeekday={startWeekThisWeekday}
          theme={this.props.theme}
          toggleFiltersOpen={this.toggleFiltersOpen}
          variant={this.props.variant}
        />
        {this.state.displayGroupPopup && (
          <GroupRulePopupContained
            open
            onClose={this.handleCloseGroupPopup}
            onSubmit={this.handleContinueGroupPopup}
            selectedOffer={this.state.displayGroupPopup}
          />
        )}
      </>
    );
  }
}

const GroupRulePopupContained = connect((state: RootState) => ({
  getOffersListByGroup: memoize((id) =>
    getOffersListByGroupSelector(state, id),
  ),
  offerGroupLoading: state.offer.groups.loading,
}))(GroupRulePopup);

const mapStateToProps = (state: RootState) => ({
  offers: getMarketplaceOfferList(state),
  genderCount: getBookedGenderOffer(state),
  loading: state.offer.marketplace.loading,
  events: state.offer.calendar,
  coachLoading: state.coach.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  coaches: getCoaches(state),
  establishments: getAllEstablishments(state),
  metaActivities: getPureMetaActivitiesDict(state),
  metaActivitiesWorkshops: getMetaActivitiesWorkshopsDict(state),
  theme: themeSelectors.getTheme(state),
  group: getGroupData(state),
  currentBasket: getCurrentBasket(state),
  establishmentGroupList: groupWithEstablishment(
    getAssociatedEstablishmentGroup,
  )(state),
  bookedOffers: getBookedOffers(state),
  nextAvailableOffer: getNextAvailableOffer(state),
  authenticated: state.auth.authenticated,
  activeCustomLevels: getActiveCustomLevels(state),
  getLevel: getLevelsDetails(state),
  customLevels: getAllCustomLevels(state),
});

const mapDispatchToProps = {
  snackbarError: snackbarErrorActions,
  snackbarSuccess: snackbarSuccessActions,
  fetchNextAvailableOffer: fetchNextAvailableOfferAction,
  fetchOfferList: fetchOfferListAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchAssociatedCoachBulkFromCoachIds:
    fetchAssociatedCoachBulkFromCoachIdsAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchBookedGender: fetchBookedGenderAction,
  pushAction: push,
  addItemToBasket: addItemToBasketAction,
  fetchAllEstablishmentGroup,
  fetchOfferRegisteredIds: fetchOfferRegisteredIdsAction,
  fetchLevelBulk: fetchLevelBulkAction,
  resetLevels,

  fetchGroupsOfferBulk: fetchGroupsOfferBulkAction,
  fetchOffersInGroupAction,
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
              ...offerList.flatMap((o: any) => o.additional_coaches),
            ],
            props.companyId,
          );

          props.fetchMetaActivityBulk([
            ...offerList.map((o: any) => o.meta_activity),
          ]);

          props.fetchGroupsOfferBulk(
            Array.from(new Set(offerList.map((o) => o.group))),
          );
          props.fetchLevelBulk({
            company: props.companyId,
            id__in: uniq([...offerList.map((o: any) => o.custom_level)]),
          });
        },
      });
      if (props.theme && props.theme.show_booked_gender_offer) {
        props.fetchBookedGender(params);
      }
    },
  goToBook: (props: Props) => (id: number, companyId: number) => {
    if (props.goToBook) {
      props.goToBook(id, companyId);
      return;
    }

    props.pushAction(getBookCalendarUrl(id, companyId));
  },

  goToBookOption: (props: Props) => (id: number, companyId: number) => {
    if (props.goToBookOption) {
      props.goToBookOption(id, companyId);
      return;
    }

    props.pushAction(getBookCalendarUrl(id, companyId));
  },
};

export const CalendarDataContainer = compose(
  marketplaceCssHoc(),
  withTranslation([
    'metaActivity',
    'marketplace',
    'establishment',
    'coach',
    'datetime',
    'translation',
    'offer',
    'search',
  ]),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
);

export default compose(
  marketplaceCssHoc(),
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
  withQueryParamsToProps([
    'groupSessionByPeriod',
    'groupSessionByPeriod',
    'boolean',
  ]),
  withQueryParamsToProps(['compactMode', 'compactMode', 'boolean']),
  withQueryParamsToProps(['variant']),

  withTranslation(['booking', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceCalendar'),
  ),
  CalendarDataContainer,
)(MarketplaceCalendar);
