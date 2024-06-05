// @flow
import React from 'react';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';

import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import flatten from 'lodash/flatten';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import { getTheme } from '#src/libs/theme/selectors';
import { EstablishmentWithAssociatedId } from '#src/libs/establishment/types';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../libs/private-service/selectors/private-booking';
import {
  fetchAllOffers as fetchAllOffersAction,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAction,
} from '../libs/offer/actions';
import withTitle from '../hocs/with-title.hoc';
import {
  getAllPageEstablishments,
  getAllEstablishmentsWithAssociatedId,
} from '../libs/establishment/selectors';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '../libs/establishment/actions';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
} from '../libs/associated-coach/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../libs/meta-activity/actions';
import {
  getOfferAsEventList,
  getOfferHasPendingReplacementRequest,
} from '../libs/offer/selectors';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '../libs/member/actions';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import { setScheduleFilter as setScheduleFilterAction } from '../libs/user-preference/actions';
import { getScheduleFilter } from '../libs/user-preference/selectors';
import { ScheduleFilter } from '../libs/user-preference/types';

import { getCustomEventList } from '../libs/private-service/selectors/custom-event';
import CustomEvenFormDialog from '../libs/private-service/components/custom-event/CustomEventFormDialog.component';
import {
  getFilteredAvailabilitySlots,
  getResourceDataList,
} from '../libs/private-service/selectors/availability-slot';

import AvailabilityUpdateResourceChoserDialog from '../libs/private-service/components/resource/AvailabilityUpdateResourceChoserDialog.component';

import PrivateCalendarWithControls from '../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  createOrUpdateCustomEvent as createOrUpdateCustomEventActions,
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
  fetchResourceList,
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableAvailabilitySlotMultipleResource,
  enableAvailabilitySlotMultipleResource,
} from '../libs/private-service/actions';

import {
  fetchManagerRessourcesFilters as fetchManagerRessourcesFiltersAction,
  updateManagerRessourcesFilters as updateManagerRessourcesFiltersAction,
} from '../libs/dashboard/actions';
import { CompanyTheme } from '../libs/theme/types';
import { Coach } from '../libs/associated-coach/types';
import { Offer } from '../libs/offer/types';
import {
  PrivateBooking,
  AvailabilitySlot,
  ResourceData,
  PrivateService as PrivateServiceType,
} from '../libs/private-service/types';

type Props = {
  classes: Object,
  privateBookingList: Array<PrivateBooking>,
  offerList: Array<Offer>,

  resetPrivateBookings: () => void,

  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  periodFilter: { start: string, end: string },

  fetchPrivateBookingList: () => void,
  fetchOfferList: () => void,
  fetchAssociatedEstablishments: () => void,
  fetchAssociatedCoachesList: (params: any) => void,
  fetchCompanyUserRoles: () => void,
  resourcesByDatatype: Array<ResourceDataGroup>,

  enableAvailabilitySlotMultipleResource: (data: any) => void,
  disableAvailabilitySlotMultipleResource: (data: any) => void,
  fetchCustomEventList: () => void,
  resetCustomEvent: () => void,

  customEventData: any,
  availableCoaches: Array<Coach>,
  coachesSelectedInRole: Array<Coach>,
  createOrUpdateCustomEvent: (data: any, options: OptionCallback) => void,
  resetAvailabilitySlots: () => void,
  fetchAvailabilitySlots: (params: any, options: OptionCallback) => void,
  availabilitySlots: Array<AvailabilitySlot>,
  customEventList: Array<CustomEvent>,
  onRequestCustomEvent: (data: any) => void,
  resourceData: Array<ResourceData>,
  resourceDataLoading: boolean,
  setResourceFiltersArray: (resources: Array<Ressource>) => void,
  fetchResourceList: () => void,
  closeCustomEventDialog: () => void,
  companyTheme: CompanyTheme,
  resourceFiltersArray: Array<Ressource>,
  fetchRessourcesFilters: () => void,
  updateManagerRessourcesFilters: () => void,
  availabilitySlotUpdating: boolean,

  scheduleFilter: ScheduleFilter,
  setScheduleFilter: (scheduleFilter: ScheduleFilter) => void,
  establishments: Array<EstablishmentWithAssociatedId>,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
  privateServices: PrivateServiceType[],
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class CoachPrivateCalendar extends React.Component<Props> {
  state = {
    updateAvailabilitySlotData: null,
  };

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
      this.props.updateManagerRessourcesFilters([
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
    (...data: any) => {
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
      data: [slotUpdateData, slotUpdateOptions],
    } = this.state.updateAvailabilitySlotData;

    const options = {
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
          slot.establishment ||
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
          if (resourceData.datatype === 'associated_coach') {
            const filteredResourceData = { ...resourceData };
            filteredResourceData.data = resourceData.data.filter(
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
    const { classes } = this.props;
    let coachList: Coach[];
    let offerList: Array<Offer & { hasPendingReplacementRequest?: boolean }>;
    let availabilitySlotList: AvailabilitySlot[];
    let privateBookingList: PrivateBooking[];
    let resourceAvailable: ResourceData[];
    const filterOnCoaches = this.props.coachesSelectedInRole?.length > 0;
    if (filterOnCoaches) {
      const lists = this.filteredDataListsOnCoaches(
        this.props.coachesSelectedInRole,
        this.props.offerList,
        this.props.availabilitySlots,
        this.props.privateBookingList,
        this.props.resourceData,
      );
      [
        coachList,
        offerList,
        availabilitySlotList,
        privateBookingList,
        resourceAvailable,
      ] = lists;
    } else {
      coachList = this.props.availableCoaches;
      // eslint-disable-next-line prefer-destructuring
      offerList = this.props.offerList;
      availabilitySlotList = this.props.availabilitySlots;
      // eslint-disable-next-line prefer-destructuring
      privateBookingList = this.props.privateBookingList;
      resourceAvailable = this.props.resourceData;
    }
    const coachesIdsRelatedToPrivateServices = this.props.privateServices
      .map(({ coaches }) => coaches.map((coach) => coach?.associated_coach_id))
      .flat();

    return (
      <div className={classes.container}>
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

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('translation:navigation.schedule')),
  withState('resourceFiltersArray', 'setResourceFiltersArray', []),
  withStateHandlers(
    { customEventData: null },
    {
      closeCustomEventDialog: () => () => ({ customEventData: null }),
      onRequestCustomEvent: () => (customEventData) => ({ customEventData }),
    },
  ),
  withState('periodFilter', 'setPeriodFilter', {
    start: DateTime.now()
      .startOf('week', { useLocaleWeeks: true })
      .minus({ days: 1 })
      .toISODate(),
    end: DateTime.now()
      .endOf('week', { useLocaleWeeks: true })
      .plus({ days: 1 })
      .toISODate(),
  }),
  connect(
    (state, { periodFilter, resourceFiltersArray }) => ({
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
        null,
        periodFilter,
      ),
      offerList: getOfferAsEventList(state, null, periodFilter).filter((o) => {
        if (!state.theme.theme.show_cancelled_offers_manager) {
          return o.available;
        }
        return true;
      }),
      getHasPendingReplacementRequest:
        getOfferHasPendingReplacementRequest(state),
      availableCoaches: getActiveCoaches(state),
      coachesSelectedInRole: getCoachesSelectedInRole(state),
      customEventList: getCustomEventList(state, periodFilter),
      resourceData: getResourceDataList(state),
      establishments: getAllEstablishmentsWithAssociatedId(state),
      privateServices: getPrivateServices(state),
      resourceDataLoading: state.privateService.resource.loading,
      ressourceFilers:
        state.dashboardSettings.managerRessourcesFilters.data.filter,
      ressourceFiltersLoading:
        state.dashboardSettings.managerRessourcesFilters.loading,
      availabilitySlotUpdating:
        state.privateService.availabilitySlot.createOrUpdate.loading,
      scheduleFilter: getScheduleFilter(state),
    }),
    {
      fetchPrivateBookings: fetchPrivateBookingsAction,
      resetAvailabilitySlots,

      fetchAvailabilitySlots,
      fetchCustomEventList: fetchCustomEventListAction,
      fetchEstablishments: fetchEstablishmentsAction,
      fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
      fetchAssociatedCoachesList,
      fetchCompanyUserRoles,
      fetchAllOffers: fetchAllOffersAction,
      resetPrivateBookings,
      resetCustomEvent,
      fetchResourceList: () =>
        fetchResourceList({
          datatype: ['associated_establishment', 'associated_coach'],
        }),
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchMemberBulkById: fetchMemberBulkByIdAction,
      createOrUpdateCustomEvent: createOrUpdateCustomEventActions,
      fetchManagerRessourcesFilters: fetchManagerRessourcesFiltersAction,
      updateManagerRessourcesFilters: updateManagerRessourcesFiltersAction,
      disableAvailabilitySlotMultipleResource,
      enableAvailabilitySlotMultipleResource,
      setScheduleFilter: setScheduleFilterAction,
      listOffersWithPendingReplacementRequestIds:
        listOffersWithPendingReplacementRequestIdsAction,
    },
  ),
  withHandlers({
    createOrUpdateCustomEvent:
      ({
        createOrUpdateCustomEvent,
        customEventData,
        closeCustomEventDialog,
      }) =>
      (data, options) => {
        createOrUpdateCustomEvent(
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
      }) =>
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
      ({ setPeriodFilter }) =>
      ({ date_start, date_end }: { date_start: string, date_end: string }) => {
        setPeriodFilter({
          start: DateTime.fromISO(date_start).minus({ days: 1 }).toISODate(),
          end: DateTime.fromISO(date_end).plus({ days: 1 }).toISODate(),
        });
      },
    fetchPrivateBookingList:
      ({ fetchPrivateBookings, fetchMemberBulkById, periodFilter }) =>
      () => {
        fetchPrivateBookings(
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
      ({ fetchCustomEventList, periodFilter }) =>
      () => {
        fetchCustomEventList({
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
        });
      },
    fetchAssociatedEstablishments:
      ({ companyId, fetchAssociatedEstablishments, fetchEstablishments }) =>
      () => {
        fetchAssociatedEstablishments(
          { company: companyId },
          {
            onSuccess: (associatedEstablishments) => {
              const idList = associatedEstablishments.map((ae) => ae.id) || [];
              if (idList.length > 0) {
                fetchEstablishments({
                  associated_establishment__in: idList,
                  page_size: 300,
                });
              }
            },
          },
          60 * 10 * 1000, // cache
        );
      },
  }),
  withHandlers({
    fetchRessourcesFilters:
      ({ fetchManagerRessourcesFilters, setResourceFiltersArray }) =>
      () => {
        fetchManagerRessourcesFilters({
          onSuccess: (payload) => {
            setResourceFiltersArray(payload);
          },
        });
      },
  }),
  withHandlers({
    updateRessourcesFilters:
      ({ updateManagerRessourcesFilters, resourceFiltersArray }) =>
      () => {
        updateManagerRessourcesFilters([
          {
            name: 'schedule',
            filters: resourceFiltersArray,
          },
        ]);
      },
  }),
)(CoachPrivateCalendar);
