// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import memoize from 'lodash/memoize';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { RouteChildrenProps, withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { DateTime } from 'luxon';
import { TFunction } from 'i18next';

import uniq from 'lodash/uniq';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
// @ts-expect-error
import withReplaceQueryParams from '#src/hocs/with-replace-query-params.hoc';
import { addItemToBasket as addItemToBasketAction } from '#src/libs/checkout/actions';
import MarketplaceCalendarComponent from '#src/libs/marketplace/components/@Calendar/MarketplaceCalendarCSSOnly/MarketplaceCalendarCSSOnly.component';
import MarketplaceActivityDialogV2 from '#src/libs/marketplace/components/@Activity/MarketplaceActivityDialogCSSOnly/MarketplaceActivityDialogCSSOnly.component';
import { getCurrentBasket } from '#src/libs/checkout/selectors';

import themeSelectors from '#src/libs/theme/selectors';
import { getAllCoaches } from '#src/libs/associated-coach/selectors';
import {
  getMetaActivitiesDict as getMetaActivitiesWorkshopsDict,
  getPureMetaActivitiesDict,
} from '#src/libs/meta-activity/selectors';
import {
  getOffersListByGroup as getOffersListByGroupSelector,
  getGroupData,
} from '#src/libs/group-offer/selectors';
import {
  isOfferInThePast,
  doTextSearch,
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from '#src/libs/marketplace/utils';

import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '#src/libs/establishment/selectors';

import {
  snackbarSuccess as snackbarSuccessActions,
  snackbarError as snackbarErrorActions,
} from '#src/libs/snackbar/actions';

import {
  fetchLevelBulk as fetchLevelBulkAction,
  resetLevels,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
  getLevelsDetails,
} from '#src/libs/level/selectors';

import {
  fetchMarketplaceOfferList as fetchOfferListAction,
  fetchNextAvailableOffer as fetchNextAvailableOfferAction,
  fetchBookedGender as fetchBookedGenderAction,
  fetchOfferRegisteredIds as fetchOfferRegisteredIdsAction,
  fetchOffersInGroup as fetchOffersInGroupAction,
} from '#src/libs/offer/actions';
import {
  getMarketplaceOfferList,
  getBookedOffers,
  getNextAvailableOffer,
  getBookedGenderOffer,
} from '#src/libs/offer/selectors';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '#src/libs/associated-coach/actions';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  fetchAllEstablishmentGroup,
} from '#src/libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchGroupsOfferBulk as fetchGroupsOfferBulkAction } from '#src/libs/group-offer/actions';

import withTitle from '#src/hocs/with-title.hoc';

import {
  Offer,
  OfferListParams,
  OfferREST,
  Offer_FULL,
} from '#src/libs/offer/types';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import GroupRulePopup from '#src/libs/marketplace/components/@Offer/GroupRulePopup.dialog';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import withQueryParamsToProps from '#src/hocs/query-params-to-props.hoc';

import withPostMessageOnPropsUpdate from '#src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from '#src/hocs/postMessages/with-post-message-to-update-props';
import { getBookCalendarUrl } from '#src/libs/marketplace/routing-utils';

import type {
  MarketplaceComponentConfig,
  MarketplaceFilters,
  MarketplaceFiltersSetter,
} from '#src/libs/marketplace/types';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import analyticsUtils from '#src/components/analytics/analytics';
import { trackCalendarViewedEvent } from '#src/events/booking/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

export type OwnProps = {
  companyId: number;
  compactMode: boolean;
  groupSessionByPeriod: boolean;
  variant?: 'activityName' | 'coach' | 'time';
  onCompletePurchase?: (offerId: number, packId: number) => void;
  otherParams: {
    date: string;
    filtersOpen: 'true' | '';
    onlyDay: string;
  };
  filters: MarketplaceFilters;
  onlineFilter: {
    is_online: boolean | undefined;
  };
  setOtherParams: (key: string) => (value: any) => void;
  goToPackPayment?: (packId: number, offerId: number) => void;
  goToBook?: (id: number, companyId: number) => void;
  goToBookOption?: (id: number, companyId: number) => void;
  store?: any; // for the widget only
  mapContainerClassName?: string;
  nextAvailableOffer?: Offer;
  authenticated?: boolean;
  // username is propagated from the widget in order to retrieve user
  // specific information without relying on auth tokens
  username?: string;
  config?: MarketplaceComponentConfig['calendar']; // From widget configuration
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type QueryParamsHocProps = {
  setFilters: MarketplaceFiltersSetter;
};

type Props = OwnProps &
  ConnectProps &
  WithTranslation &
  RouteChildrenProps<any> &
  QueryParamsHocProps;

export type FinalProps = Props &
  WithHandlerType<typeof mapWithHandlers> &
  ContainerWidthListenerProps;

type ContainerWidthListenerProps = {
  containerWidth: number | undefined;
  calendarRefContainer: React.Ref<null>;
};

type WidhContainerWidthListenerState = {
  containerWidth: number | null;
};

function withContainerWidthListener<
  WrappedComponentProps extends object,
>(): () => React.ComponentType<WrappedComponentProps> {
  // @ts-expect-error
  return (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    class WithContainerWidthListener extends Component<
      WrappedComponentProps,
      WidhContainerWidthListenerState
    > {
      calendarRefContainer: React.RefObject<HTMLDivElement>;

      constructor(props: FinalProps) {
        // @ts-expect-error FinalProps is not the right typing for Props received by the compose
        super(props);
        // This reference is used to evaluate the size of the calendar,
        // and to determine if it should be displayed in card mode or not.
        // That way, we can enable or disable the fetching of the offers when updating the start date.
        this.calendarRefContainer = React.createRef();
      }

      state: WidhContainerWidthListenerState = {
        containerWidth: null,
      };

      componentDidMount(): void {
        // @ts-expect-error
        this.intervalId = setInterval(() => {
          const currentContainerWidth =
            this.calendarRefContainer?.current?.clientWidth;
          const previousContainerWidth = this.state.containerWidth;
          if (currentContainerWidth !== previousContainerWidth) {
            this.setState(() => ({
              containerWidth: currentContainerWidth ?? null,
            }));
          }
        }, 500);
      }

      componentWillUnmount() {
        // @ts-expect-error
        clearInterval(this.intervalId);
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            calendarRefContainer={this.calendarRefContainer}
            containerWidth={this.state.containerWidth}
          />
        );
      }
    }

    return WithContainerWidthListener;
  };
}

type State = {
  offerId: number | null;
  offer?: Offer | OfferREST | null;
  displayGroupPopup: (Offer_FULL & { redirect: string }) | null;
  filteredEstablishments: Array<Establishment> | null;
  filters: MarketplaceFilters;
  offerSearchResult: { query: string; offerList: Offer[] | OfferREST[] | null };
  isLoading: boolean;
};

export class MarketplaceCalendar extends Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);
    // This reference is used to evaluate the size of the calendar,
    // and to determine if it should be displayed in card mode or not.
    // That way, we can enable or disable the fetching of the offers when updating the start date.
    // @ts-expect-error
    this.calendarRefContainer = React.createRef();
    this.state = {
      offerId: null,
      offer: null,
      displayGroupPopup: null,
      filteredEstablishments: null,
      filters: {
        coaches: props?.filters?.coaches || [],
        establishments: props?.filters?.establishments || [],
        activity__in: props?.filters?.activity__in || [],
        levels: props?.filters?.levels || [],
        establishment_group__in: props?.filters?.establishment_group__in || [],
      },
      offerSearchResult: { query: '', offerList: null },
      isLoading: false,
    };
  }

  /**
   * Returns a function that updates a specific filter in the marketplace calendar state.
   *
   * The returned function takes an array of `values` (number[]) and updates the filter for the specified `key`
   * in the `filters` state, merging it with the previous state.
   *
   * @param key - The filter key to update, from `MarketplaceFilters`.
   * @returns A function that accepts `values` (number[]) and updates the filter.
   */
  setFilters: MarketplaceFiltersSetter = (key) => {
    const _this = this;
    return (values) => {
      _this.setState((prevState) => ({
        filters: { ...prevState.filters, [key]: values },
      }));
    };
  };

  /**
   *  @description Wheter or not the calendar must display its list or card version. For the widget this is configurable via the property compactMode.
   *  compactMode can be null, true, false AND also undefined (parameter coming from the widget code-snippet and is often deleted from the dict).
   * Thus, we must consider null and undefined equivalent and have to serve the same purpose -> let the container width establish the display behavior.
   */
  getIsCompact = () =>
    (this.props.compactMode !== null && this.props.compactMode === true) ||
    (!this.props.compactMode && (this.props.containerWidth ?? 1200) < 1250);

  // Large calendar
  getIsLarge = () =>
    (this.props.compactMode != null && this.props.compactMode === false) ||
    (this.props.compactMode == null &&
      !((this.props.containerWidth ?? 1240) < 1250));

  // Card mode display
  getIsCardModeDisplay = () =>
    !(this.getIsCompact() && !this.getIsLarge()) ||
    this.cardModeDisplayForcedByWidgetConfiguration();

  cardModeDisplayForcedByWidgetConfiguration = () => {
    if (!this.props.config?.cardModeDisplayMinWidth) {
      return false;
    }
    try {
      const cardModeDisplayMinWidth = parseFloat(
        this.props.config?.cardModeDisplayMinWidth as string,
      );

      return (this.props.containerWidth ?? 1240) > cardModeDisplayMinWidth;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  getStartCalendarWeekOnToday = () =>
    // @ts-expect-error
    this.props.theme.start_calendar_week_on_today &&
    this.getIsCardModeDisplay();

  getSelectedDate = memoize((date: string | undefined) => {
    return date ? DateTime.fromISO(date) : DateTime.now();
  });

  start_date = () => {
    const paramsStartDate = this.getSelectedDate(this.props.otherParams.date);

    return this.getStartCalendarWeekOnToday()
      ? paramsStartDate
      : paramsStartDate.startOf('week', { useLocaleWeeks: true });
  };

  end_date = () => {
    return this.start_date().plus({ days: 7 });
  };

  fetchData = () => {
    this.setState({ isLoading: true });
    this.props.fetchOfferList(this.getOfferListParamsWithDates(), {
      onSuccess: this.loadOffersDependencies,
      onError: () => this.setState({ isLoading: false }),
    });
  };

  componentDidMount() {
    this.props.resetLevels();
    this.fetchData();
    analyticsClientB2C.track(trackCalendarViewedEvent({}));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const filtersStateChanged = !isEqual(prevState.filters, this.state.filters);

    const onlineFilterPropsHasChanged = !isEqual(
      prevProps.onlineFilter,
      this.props.onlineFilter,
    );

    const filtersPropsHasChanged = !isEqual(
      prevProps.filters,
      this.props.filters,
    );

    if (filtersPropsHasChanged) {
      this.setState({ filters: this.props.filters });
    }

    const selectedWeekChanged = (() => {
      if (
        !this.props.otherParams.date ||
        prevProps.otherParams.date === this.props.otherParams.date
      ) {
        return false;
      }

      const prevPropsDate = prevProps.otherParams.date
        ? DateTime.fromISO(prevProps.otherParams.date)
        : DateTime.now();
      const propsDate = DateTime.fromISO(this.props.otherParams.date);

      if (this.getStartCalendarWeekOnToday()) {
        return prevPropsDate.toSeconds() !== propsDate.toSeconds();
      }
      return (
        prevPropsDate.startOf('week', { useLocaleWeeks: true }).toSeconds() !==
        propsDate.startOf('week', { useLocaleWeeks: true }).toSeconds()
      );
    })();

    if (
      filtersStateChanged ||
      selectedWeekChanged ||
      onlineFilterPropsHasChanged
    ) {
      this.fetchData();
    }
    const filtersEstablishmentsChanged = !isEqual(
      prevState.filters.establishment_group__in,
      this.state.filters.establishment_group__in,
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

      if (this.state.filters.establishment_group__in?.length) {
        const filteredEstablishmentIds: Array<number> =
          this.props.establishmentGroupList
            .filter((eg: EstablishmentGroup) =>
              this.state.filters.establishment_group__in.includes(eg.id),
            )
            .flatMap((eg: EstablishmentGroup) => eg.establishment)
            .map((e: Establishment) => e.id);

        const uniqueEstIds = this.state.filters.establishments?.length
          ? [
              ...new Set(
                filteredEstablishmentIds.concat(
                  this.state.filters.establishments,
                ),
              ),
            ]
          : filteredEstablishmentIds;

        // @ts-expect-error
        filteredEstablishments = this.props.establishments.filter((e) =>
          uniqueEstIds.includes(e.id),
        );
      }
      this.setState({ filteredEstablishments });
    }
  }

  getOfferListParams = (): OfferListParams => {
    const optionalParams: OfferListParams = {};

    if (this.props.username) {
      optionalParams.username = encodeURI(this.props.username);
    }
    if (!this.props?.theme?.show_workshops_customer) {
      optionalParams.is_workshop = false;
    }
    if (!this.props?.theme?.show_cancelled_offers_customer) {
      optionalParams.available = true;
    }
    if (typeof this.props?.onlineFilter?.is_online === 'boolean') {
      optionalParams.is_online = this.props.onlineFilter?.is_online;
    }

    return {
      company: this.props.companyId,
      with_tags: true,
      only_future_strict: !this.props.theme.show_past_sessions_calendar,
      ...this.state.filters,
      ...optionalParams,
    };
  };

  getOfferListParamsWithDates = (): OfferListParams => {
    return {
      ...this.getOfferListParams(),
      min_date: this.start_date().toISODate() as string,
      max_date: this.end_date().toISODate() as string,
    };
  };

  loadOffersDependencies = async (offerList: any) => {
    this.setState({ isLoading: true });
    const dependencyPromises = [
      this.props.fetchEstablishmentBulk([
        ...offerList.map((o: any) => o.establishment),
        ...(this.state.filters.establishments ?? []),
      ]),
      this.props.fetchAssociatedCoachBulkFromCoachIds(
        [
          ...offerList.map((o: any) => o.coach),
          ...offerList.map((o: any) => o.coach_override),
          ...(this.state.filters.coaches ?? []),
        ],
        this.props.companyId,
      ),
      this.props.fetchMetaActivityBulk([
        ...offerList.map((o: any) => o.meta_activity),
        ...(this.state.filters.activity__in ?? []),
      ]),
      this.props.fetchGroupsOfferBulk(
        // @ts-expect-error
        Array.from(new Set(offerList.map((o) => o.group))),
      ),
      this.props.fetchLevelBulk({
        company: this.props.companyId,
        id__in: uniq([
          ...offerList.map((o: any) => o.custom_level),
          ...(this.state.filters.levels ?? []),
        ]),
      }),
      this.props.fetchNextAvailableOffer({
        ...this.getOfferListParams(),
        min_date: DateTime.now().toISODate(),
      }),
      this.props.fetchAllEstablishmentGroup(this.props.companyId),
      ...(this.props.authenticated
        ? [this.props.fetchOfferRegisteredIds()]
        : []),
      ...(this.props.theme && this.props.theme.show_booked_gender_offer
        ? [this.props.fetchBookedGender(this.getOfferListParamsWithDates())]
        : []),
    ];

    await Promise.all(dependencyPromises).finally(() =>
      this.setState({ isLoading: false }),
    );
  };

  openOfferDialog = (offerId: number) => {
    const offerOpened = this.props.offers.find((o: any) => o.id === offerId);
    this.setState({
      offerId,
      offer: offerOpened,
    });
    analyticsUtils.onSessionShow(offerOpened);
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
    analyticsUtils.onGoToSessionBooking(offer);
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
    analyticsUtils.onGoToSessionBooking(offer);
    this.props.goToBookOption(offer.id, this.props.companyId);
  };

  handleDateChange = (date: string) => {
    const newDate = date ? DateTime.fromISO(date) : DateTime.now();
    const formattedDate = newDate.toISODate();

    this.props.setOtherParams('date')(formattedDate);
  };

  toggleFiltersOpen = () => {
    this.props.setOtherParams('filtersOpen')(
      this.props.otherParams.filtersOpen === 'true' ? '' : 'true',
    );
  };

  goToFirstAvailableSession = () => {
    if (this.props.nextAvailableOffer?.date_start) {
      const newDate = DateTime.fromISO(
        this.props.nextAvailableOffer.date_start,
      ).toISODate() as string;
      this.handleDateChange(newDate);
    }
  };

  handleCloseGroupPopup = () => {
    this.setState({
      displayGroupPopup: null,
    });
  };

  handleContinueGroupPopup = () => {
    this.handleCloseGroupPopup();

    if (!this.state.displayGroupPopup) return;

    const { redirect, group, ...offer } = this.state.displayGroupPopup;
    if (redirect === 'book') {
      // @ts-expect-error
      this.goToBook(offer);
    }
    if (redirect === 'option') {
      // @ts-expect-error
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
      // @ts-expect-error
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
      const establishments = this.state.filters.establishment_group__in?.length
        ? this.state.filteredEstablishments ?? []
        : this.props.establishments;

      const [
        searchedCoaches,
        searchedEstablishments,
        searchedMetaActivities,
        searchedOffers,
      ] = doTextSearch(
        searchText,
        this.props.coaches,
        establishments as Establishment[] | ReadonlyArray<Establishment>,
        Object.values(metaActivities),
        // @ts-expect-error mismatch between Offer, OfferRest, Offer_FULL
        this.props.offers,
      );

      const searchResult = this.props.offers.filter(
        (offer) =>
          searchedOffers?.includes(offer.id) ||
          searchedEstablishments?.includes(offer.establishment) ||
          searchedMetaActivities?.includes(offer.meta_activity) ||
          searchedCoaches?.includes(offer.coach),
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
      establishments,
      coaches,
      activeCustomLevels,
      customLevels,
      establishmentGroupList,
      metaActivities,
      compactMode,
    } = this.props;

    return (
      <>
        <MarketplaceCalendarComponent
          // @ts-expect-error
          activeCustomLevels={activeCustomLevels}
          bookedOffers={this.props.bookedOffers}
          coaches={coaches}
          compactMode={compactMode}
          companyId={this.props.companyId}
          customLevels={customLevels}
          establishmentGroupList={establishmentGroupList}
          establishments={
            this.state.filters.establishment_group__in?.length
              ? this.state.filteredEstablishments
              : establishments
          }
          events={this.props.events}
          filters={this.state.filters}
          filtersOpen={this.props.otherParams.filtersOpen === 'true'}
          forceDayDisplayOnly={this.props.otherParams.onlyDay === 'true'}
          genderCount={this.props.genderCount}
          getLevel={this.props.getLevel}
          goToFirstAvailableSession={this.goToFirstAvailableSession}
          group={this.props.group}
          groupSessionByPeriod={this.props.groupSessionByPeriod}
          hideCoach={this.props.theme.hideCoach}
          isCardModeDisplay={this.getIsCardModeDisplay()}
          isSearching={this.state.offerSearchResult.query.length > 0}
          loading={this.state.isLoading}
          metaActivities={
            this.props.theme.show_workshops_customer
              ? this.props.metaActivitiesWorkshops
              : metaActivities
          }
          nextAvailableOffer={this.props.nextAvailableOffer}
          offers={this.state.offerSearchResult?.offerList ?? this.props.offers}
          onClearInput={this.handleClearSearchResult}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onClickOffer={this.openOfferDialog}
          onSearch={this.handleSearch}
          onSelectDate={this.handleDateChange}
          refContainer={this.props.calendarRefContainer}
          selectedDate={this.getSelectedDate(this.props.otherParams.date)}
          setFilters={this.props.setFilters || this.setFilters}
          showMultiLocalization={this.props.theme.enable_multi_localization}
          showOfferFilling={this.props.theme.show_offers_filling}
          showOfferGender={this.props.theme.show_booked_gender_offer}
          startWeekOnDaySelected={this.getStartCalendarWeekOnToday()}
          theme={this.props.theme}
          toggleFiltersOpen={this.toggleFiltersOpen}
          variant={this.props.variant}
        />
        <MarketplaceActivityDialogV2
          coaches={coaches}
          companyTheme={this.props.theme}
          customLevels={this.props.customLevels}
          //@ts-expect-error
          establishments={
            this.state.filters.establishment_group__in?.length
              ? this.state.filteredEstablishments ?? []
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
          offer={this.state.offer as Offer}
          // @ts-expect-error
          onClickBook={this.goToBook}
          // @ts-expect-error
          onClickBookOption={this.goToBookOption}
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
        />
        {this.state.displayGroupPopup && (
          // @ts-expect-error
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
  events: state.offer.calendar,
  coaches: getAllCoaches(state),
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
  withContainerWidthListener(),
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
    ['is_online'],
    'onlineFilter',
    'setOnlineFilter',
    'boolean',
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
  withPostMessageOnPropsUpdate<FinalProps>([
    { propName: 'filters', messageType: 'bsport:calendar:filter:update' },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:update',
    },
  ]),
  withPostMessageToUpdateProps<FinalProps>([
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
