import React from 'react';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';

// Third-party libraries
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { DateTime } from 'luxon';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';

// libraries: Actions
import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#src/libs/role/actions';
import {
  fetchAllOffers as fetchAllOffersAction,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAction,
} from '#src/libs/offer/actions';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#src/libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#src/libs/associated-coach/actions';
import { setScheduleFilter as setScheduleFilterAction } from '#src/libs/user-preference/actions';
import {
  createOrUpdateCustomEvent as createOrUpdateCustomEventAction,
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent as resetCustomEventAction,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings as resetPrivateBookingsAction,
  fetchResourceList as fetchResourceListAction,
  fetchAvailabilitySlots as fetchAvailabilitySlotsAction,
  resetAvailabilitySlots as resetAvailabilitySlotsAction,
  disableAvailabilitySlotMultipleResource as disableAvailabilitySlotMultipleResourceAction,
  enableAvailabilitySlotMultipleResource as enableAvailabilitySlotMultipleResourceAction,
} from '#src/libs/private-service/actions';
import {
  fetchManagerScheduleResourceFilters as fetchManagerScheduleResourceFiltersAction,
  updateManagerScheduleResourcesFilters as updateManagerScheduleResourcesFiltersAction,
} from '#src/libs/dashboard/actions';

// libraries: Selectors
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import { getTheme } from '#src/libs/theme/selectors';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '#src/libs/private-service/selectors/private-booking';
import {
  getAllPageEstablishments,
  getAllEstablishmentsWithAssociatedId,
} from '#src/libs/establishment/selectors';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
} from '#src/libs/associated-coach/selectors';
import {
  getOfferAsEventList,
  getOfferHasPendingReplacementRequest,
} from '#src/libs/offer/selectors';
import { getScheduleFilter } from '#src/libs/user-preference/selectors';
import { getCustomEventList } from '#src/libs/private-service/selectors/custom-event';
import {
  getFilteredAvailabilitySlots,
  getResourceDataList,
} from '#src/libs/private-service/selectors/availability-slot';

// libraries: Components
import CustomEvenFormDialog from '#src/libs/private-service/components/custom-event/CustomEventFormDialog.component';
import AvailabilityUpdateResourceChoserDialog from '#src/libs/private-service/components/resource/AvailabilityUpdateResourceChoserDialog.component';
//@ts-expect-error
import PrivateCalendarWithControls from '#src/libs/private-service/components/PrivateCalendarWithControls.component';

// Higher Order Components (HOCs)
import withTitle from '#src/hocs/with-title.hoc';

// Types
import { Coach } from '#src/libs/associated-coach/types';
import { Offer } from '#src/libs/offer/types';
import {
  PrivateBooking,
  AvailabilitySlot,
  ResourceData,
} from '#src/libs/private-service/types';
import type { MyScheduleRessourceValueType } from '#src/libs/dashboard/types';
import type { WithHandlerType } from '#src/utils/types';
import type { RootState } from '#src/reducers';

type OwnProps = {};

type StateHanldersType = typeof StateHandlersInitial &
  WithHandlerType<typeof StateHandlersSetter>;

type ConnectedPropsAndStateHanlders = ConnectedProps<typeof connector> &
  StateHanldersType;

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  StateHanldersType &
  WithHandlerType<typeof mapWithHandlers>;

type State = { updateAvailabilitySlotData: { data: unknown; kind: unknown } };

export class SchedulePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { updateAvailabilitySlotData: null };
  }

  componentDidMount() {
    this.props.resetPrivateBookings();
    this.props.fetchResourceList();
    this.props.fetchAssociatedEstablishments();
    this.props.fetchAssociatedCoachesList({ disabled: false });
    this.props.fetchRessourcesFilters();
    this.props.fetchCompanyUserRoles();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end
    ) {
      this.props.fetchPrivateBookingList();
      this.props.fetchOfferList();
      this.props.fetchCustomEventList();
      this.fetchAvailabilitySlotsAllResource();
    }
    if (prevProps.resourceFiltersArray !== this.props.resourceFiltersArray) {
      this.props.updateManagerScheduleResourcesFilters([
        {
          name: 'schedule',
          filters: this.props.resourceFiltersArray,
        },
      ]);
    }
  }

  componentWillUnmount() {
    this.props.resetCustomEvent();
  }

  fetchAvailabilitySlotsAllResource = () => {
    this.props.resetAvailabilitySlots();
    // fetch service's establshments slots
    this.props.fetchAvailabilitySlots({
      establishment__in: flatten(
        (
          this.props.resourcesByDatatype.find(
            (rd) => rd.datatype === 'establishment',
          ).items || []
        ).map((ae) => ae.id),
      ),
      date_start__lte: this.props.periodFilter.end,
      date_start__gte: this.props.periodFilter.start,
    });
    this.props.fetchAvailabilitySlots({
      coach__in: flatten(
        (
          this.props.resourcesByDatatype.find((rd) => rd.datatype === 'coach')
            .items || []
        ).map((ac) => ac.id),
      ),
      date_start__lte: this.props.periodFilter.end,
      date_start__gte: this.props.periodFilter.start,
    });
  };

  storeResourceAvailabilityUpdate =
    (kind: string) =>
    //@ts-expect-error
    (...data: unknown) => {
      this.setState({
        updateAvailabilitySlotData: {
          data,
          kind,
        },
      });
    };

  enableResourceAvailabilitySlot =
    this.storeResourceAvailabilityUpdate('enable');

  disableResourceAvailabilitySlot =
    this.storeResourceAvailabilityUpdate('disable');

  onCancelAvailabilityUpdate = () =>
    this.setState({ updateAvailabilitySlotData: null });

  submitAvailabilitySlotUpdate = (
    resourceData: { [resourceDatatype: string]: string }[],
    restriction_on_associated_establishments: Array<number>,
  ) => {
    const {
      kind,
      //@ts-expect-error
      data: [slotUpdateData, slotUpdateOptions],
    } = this.state.updateAvailabilitySlotData;

    const options = {
      //@ts-expect-error
      onSuccess: (...args) => {
        this.fetchAvailabilitySlotsAllResource();
        if (slotUpdateOptions && slotUpdateOptions.onSuccess) {
          slotUpdateOptions.onSuccess(...args);
        }
      },
    };
    if (kind === 'enable') {
      this.props.enableAvailabilitySlotMultipleResource(
        resourceData,
        { ...slotUpdateData, restriction_on_associated_establishments },
        options,
      );
    }
    if (kind === 'disable') {
      this.props.disableAvailabilitySlotMultipleResource(
        resourceData,
        slotUpdateData,
        options,
      );
    }
    this.onCancelAvailabilityUpdate();
  };

  filteredDataListsOnCoaches = memoize(
    (
      coachSelectedInRoleList: Array<Coach>,
      previousOfferList: Array<Offer>,
      previousAvailabilitySlotList: Array<AvailabilitySlot>,
      previousPrivateBookingList: Array<PrivateBooking>,
      previousResourceData: Array<ResourceData>,
    ) => {
      const coachesIdsToFilter = coachSelectedInRoleList.map(
        (coach: Coach) => coach.id,
      );
      const associatedCoachesIdsToFilter = coachSelectedInRoleList.map(
        (coach: Coach) => coach.associated_coach_id,
      );
      const offerList = previousOfferList.filter((offer: Offer) =>
        coachesIdsToFilter.includes(offer.coach),
      );
      const availabilitySlotList = previousAvailabilitySlotList.filter(
        (slot: AvailabilitySlot) =>
          //@ts-expect-error
          slot.establishment ||
          //@ts-expect-error
          slot.associated_establishment ||
          coachesIdsToFilter.includes(slot.coach),
      );
      const privateBookingList = previousPrivateBookingList.filter(
        (privateBooking: PrivateBooking) =>
          associatedCoachesIdsToFilter.includes(
            privateBooking.associated_coach,
          ),
      );
      const resourceAvailable = previousResourceData.map(
        (resourceData: ResourceData) => {
          //@ts-expect-error
          if (resourceData.datatype === 'associated_coach') {
            const filteredResourceData = { ...resourceData };
            //@ts-expect-error
            filteredResourceData.data = resourceData.data.filter(
              //@ts-expect-error
              (coachResource) =>
                associatedCoachesIdsToFilter.includes(
                  coachResource.resource_id,
                ),
            );
            return Immutable(filteredResourceData);
          }
          return resourceData;
        },
      );
      return [
        coachSelectedInRoleList,
        offerList,
        availabilitySlotList,
        privateBookingList,
        resourceAvailable,
      ];
    },
  );

  render() {
    let coachList: Coach[];
    let offerList: Array<Offer & { hasPendingReplacementRequest?: boolean }>;
    let availabilitySlotList: AvailabilitySlot[];
    let privateBookingList: PrivateBooking[];
    let resourceAvailable: ResourceData[];
    const filterOnCoaches = this.props.coachesSelectedInRole?.length > 0;
    if (filterOnCoaches) {
      const lists = this.filteredDataListsOnCoaches(
        this.props.coachesSelectedInRole,
        //@ts-expect-error
        this.props.offerList,
        this.props.availabilitySlots,
        this.props.privateBookingList,
        this.props.resourceData,
      );
      [
        //@ts-expect-error
        coachList,
        //@ts-expect-error
        offerList,
        //@ts-expect-error
        availabilitySlotList,
        //@ts-expect-error
        privateBookingList,
        //@ts-expect-error
        resourceAvailable,
      ] = lists;
    } else {
      coachList = this.props.availableCoaches;
      //@ts-expect-error
      offerList = this.props.offerList;
      //@ts-expect-error
      availabilitySlotList = this.props.availabilitySlots;
      privateBookingList = this.props.privateBookingList;
      resourceAvailable = this.props.resourceData;
    }
    const coachesIdsRelatedToPrivateServices = this.props.privateServices
      .map(({ coaches }) => coaches.map((coach) => coach?.associated_coach_id))
      .flat();

    return (
      <div>
        <PrivateCalendarWithControls
          collapsResourceSelector
          disableAvailabilitySlotDisplay
          showCustomEventsToogle
          showHideCancelledEventsToggle
          showOfferListToogle
          showPrivateBookingToogle
          availabilitySlots={availabilitySlotList}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          coachesSelectedInRole={this.props.coachesSelectedInRole}
          companyTheme={this.props.companyTheme}
          createCustomEvent={this.props.onRequestCustomEvent}
          customEventList={this.props.customEventList}
          disableResourceAvailabilitySlot={this.disableResourceAvailabilitySlot}
          enableResourceAvailabilitySlot={this.enableResourceAvailabilitySlot}
          establishments={this.props.establishments}
          getHasPendingReplacementRequest={
            this.props.getHasPendingReplacementRequest
          }
          //@ts-expect-error This might not exists at all on this page
          goToMember={this.props.goToMember}
          offerList={offerList}
          onDateChange={this.props.handleDateChange}
          privateBookings={privateBookingList}
          refreshOffers={this.props.fetchOfferList}
          refreshPrivateBookings={this.props.fetchPrivateBookingList}
          resourceAvailable={resourceAvailable}
          resourceDataLoading={this.props.resourceDataLoading}
          resourcesByDatatype={this.props.resourcesByDatatype}
          resourceSelectedListIds={this.props.resourceFiltersArray}
          scheduleFilter={this.props.scheduleFilter}
          setResourceFiltered={this.props.setResourceFiltersArray}
          setScheduleFilter={this.props.setScheduleFilter}
          timezone={this.props.companyTheme.timezone_name}
        />
        {this.state.updateAvailabilitySlotData ? (
          <AvailabilityUpdateResourceChoserDialog
            //@ts-expect-error
            coachesRelatedToPrivateServices={coachesIdsRelatedToPrivateServices}
            establishments={this.props.establishments}
            kind={this.state.updateAvailabilitySlotData.kind}
            onClose={this.onCancelAvailabilityUpdate}
            onSubmit={this.submitAvailabilitySlotUpdate}
            open={!!this.state.updateAvailabilitySlotData}
            resourceAvailable={resourceAvailable}
          />
        ) : null}
        {this.props.customEventData && (
          <CustomEvenFormDialog
            open
            coaches={coachList}
            onClose={this.props.closeCustomEventDialog}
            onSubmit={this.props.createOrUpdateCustomEvent}
          />
        )}
      </div>
    );
  }
}

type StateHandlersInitialType = {
  resourceFiltersArray: MyScheduleRessourceValueType[];
  customEventData: unknown | null;
  periodFilter: { start: string; end: string };
};

const StateHandlersInitial: StateHandlersInitialType = {
  resourceFiltersArray: [] as MyScheduleRessourceValueType[],
  customEventData: null,
  periodFilter: {
    start: DateTime.now()
      .startOf('week', { useLocaleWeeks: true })
      .minus({ days: 1 })
      .toISODate(),
    end: DateTime.now()
      .endOf('week', { useLocaleWeeks: true })
      .plus({ days: 1 })
      .toISODate(),
  },
};

const StateHandlersSetter = {
  setResourceFiltersArray:
    () => (resources: MyScheduleRessourceValueType[]) => ({
      resourceFiltersArray: resources,
    }),
  //@ts-expect-error
  closeCustomEventDialog: () => () => ({ customEventData: null }),
  onRequestCustomEvent: () => (customEventData: unknown) => ({
    customEventData,
  }),
  setPeriodFilter: () => (periodFilter: { start: string; end: string }) => ({
    periodFilter,
  }),
};

const mapStateToProps = (
  state: RootState,
  { periodFilter, resourceFiltersArray }: StateHanldersType,
) => ({
  companyTheme: getTheme(state),
  companyId: getTheme(state)?.company,
  availabilitySlots: getFilteredAvailabilitySlots(
    state,
    periodFilter,
    resourceFiltersArray,
  ),
  resourcesByDatatype: [
    {
      datatype: 'establishment',
      items: getAllPageEstablishments(state),
    },
    {
      datatype: 'coach',
      items:
        state.auth.coaches_selected_in_role?.length > 0
          ? getCoachesSelectedInRole(state).map((c) => ({
              title: c.name,
              id: c.id,
              color: c.color,
            }))
          : getActiveCoaches(state).map((c) => ({
              title: c.name,
              id: c.id,
              color: c.color,
            })),
    },
  ],
  privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
    state,
    //@ts-expect-error
    null,
    periodFilter,
  ),
  offerList: getOfferAsEventList(state, null, periodFilter).filter((o) => {
    if (!state.theme.theme.show_cancelled_offers_manager) {
      return o.available;
    }
    return true;
  }),
  getHasPendingReplacementRequest: getOfferHasPendingReplacementRequest(state),
  availableCoaches: getActiveCoaches(state),
  coachesSelectedInRole: getCoachesSelectedInRole(state),
  customEventList: getCustomEventList(state, periodFilter),
  resourceData: getResourceDataList(state),
  establishments: getAllEstablishmentsWithAssociatedId(state),
  privateServices: getPrivateServices(state),
  resourceDataLoading: state.privateService.resource.loading,
  ressourceFilers:
    state.dashboardSettings.managerScheduleRessourcesFilters.data.filter,
  ressourceFiltersLoading:
    state.dashboardSettings.managerScheduleRessourcesFilters.loading,
  availabilitySlotUpdating:
    state.privateService.availabilitySlot.createOrUpdate.loading,
  scheduleFilter: getScheduleFilter(state),
});

const mapDispatchToProps = {
  fetchPrivateBookings: fetchPrivateBookingsAction,
  resetAvailabilitySlots: resetAvailabilitySlotsAction,
  fetchAvailabilitySlots: fetchAvailabilitySlotsAction,
  fetchCustomEventList: fetchCustomEventListAction,
  fetchEstablishments: fetchEstablishmentsAction,
  fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
  fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
  fetchCompanyUserRoles: fetchCompanyUserRolesAction,
  fetchAllOffers: fetchAllOffersAction,
  resetPrivateBookings: resetPrivateBookingsAction,
  resetCustomEvent: resetCustomEventAction,
  fetchResourceList: () =>
    fetchResourceListAction({
      datatype: ['associated_establishment', 'associated_coach'],
    }),
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchMemberBulkById: fetchMemberBulkByIdAction,
  createOrUpdateCustomEvent: createOrUpdateCustomEventAction,
  fetchManagerScheduleResourceFilters:
    fetchManagerScheduleResourceFiltersAction,
  updateManagerScheduleResourcesFilters:
    updateManagerScheduleResourcesFiltersAction,
  disableAvailabilitySlotMultipleResource:
    disableAvailabilitySlotMultipleResourceAction,
  enableAvailabilitySlotMultipleResource:
    enableAvailabilitySlotMultipleResourceAction,
  setScheduleFilter: setScheduleFilterAction,
  listOffersWithPendingReplacementRequestIds:
    listOffersWithPendingReplacementRequestIdsAction,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

const mapWithHandlers = {
  createOrUpdateCustomEvent:
    ({
      createOrUpdateCustomEvent,
      customEventData,
      closeCustomEventDialog,
    }: ConnectedPropsAndStateHanlders) =>
    //@ts-expect-error
    (data, options) => {
      createOrUpdateCustomEvent(
        //@ts-expect-error
        { ...data, ...customEventData },
        {
          onSuccess: (...args) => {
            if (options && options.onSuccess) options.onSuccess(...args);
            closeCustomEventDialog();
          },
          onError: options && options.onError,
        },
      );
    },
  fetchOfferList:
    ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
      listOffersWithPendingReplacementRequestIds,
    }: ConnectedPropsAndStateHanlders) =>
    () => {
      fetchAllOffers(
        {
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) => {
            fetchMetaActivityBulk(
              offers.map((o) => o.meta_activity),
              null,
              60 * 10 * 1000,
            );
            listOffersWithPendingReplacementRequestIds(
              offers.map((o) => o.id),
              true,
            );
          },
        },
      );
    },
  handleDateChange:
    ({ setPeriodFilter }: ConnectedPropsAndStateHanlders) =>
    ({ date_start, date_end }: { date_start: string; date_end: string }) => {
      setPeriodFilter({
        start: DateTime.fromISO(date_start).minus({ days: 1 }).toISODate(),
        end: DateTime.fromISO(date_end).plus({ days: 1 }).toISODate(),
      });
    },
  fetchPrivateBookingList:
    ({
      fetchPrivateBookings,
      fetchMemberBulkById,
      periodFilter,
    }: ConnectedPropsAndStateHanlders) =>
    () => {
      fetchPrivateBookings(
        //@ts-expect-error
        {
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
        },
        {
          onSuccess: (bookingList) => {
            if (bookingList.length) {
              fetchMemberBulkById(
                uniq(bookingList.map((b) => b.member)),
                null,
                120 * 1000, // cache
              );
            }
          },
        },
      );
    },
  fetchCustomEventList:
    ({ fetchCustomEventList, periodFilter }: ConnectedPropsAndStateHanlders) =>
    () => {
      fetchCustomEventList({
        date_start__gte: periodFilter.start,
        date_start__lte: periodFilter.end,
        page_size: null,
      });
    },
  fetchAssociatedEstablishments:
    ({
      companyId,
      fetchAssociatedEstablishments,
      fetchEstablishments,
    }: ConnectedPropsAndStateHanlders) =>
    () => {
      fetchAssociatedEstablishments(
        { company: companyId },
        {
          onSuccess: (associatedEstablishments) => {
            const idList = associatedEstablishments.map((ae) => ae.id) || [];
            if (idList.length > 0) {
              fetchEstablishments({
                //@ts-expect-error
                associated_establishment__in: idList,
                page_size: 300,
              });
            }
          },
        },
        //@ts-expect-error

        60 * 10 * 1000, // cache
      );
    },
  fetchRessourcesFilters:
    ({
      fetchManagerScheduleResourceFilters,
      setResourceFiltersArray,
    }: ConnectedPropsAndStateHanlders) =>
    () => {
      fetchManagerScheduleResourceFilters({
        onSuccess: (payload) => {
          setResourceFiltersArray(payload);
        },
      });
    },
  updateRessourcesFilters:
    ({
      updateManagerScheduleResourcesFilters,
      resourceFiltersArray,
    }: ConnectedPropsAndStateHanlders) =>
    () => {
      updateManagerScheduleResourcesFilters([
        {
          name: 'schedule',
          filters: resourceFiltersArray,
        },
      ]);
    },
};

export default compose(
  withTranslation(['privateService']),
  withTitle(({ t }) => t('translation:navigation.schedule')),
  withStateHandlers(StateHandlersInitial, StateHandlersSetter),
  connector,
  withHandlers(mapWithHandlers),
)(SchedulePage);
