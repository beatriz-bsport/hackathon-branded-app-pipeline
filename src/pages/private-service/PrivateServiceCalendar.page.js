// @flow
import React from 'react';

import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import uniq from 'lodash/uniq';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import { getAllEstablishmentsWithAssociatedId } from '#src/libs/establishment/selectors';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#src/libs/establishment/actions';
import { EstablishmentWithAssociatedId } from '#src/libs/establishment/types';
import { getTheme } from '#src/libs/theme/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withTitle from '../../hocs/with-title.hoc';
import { fetchMemberBulkByIdBatched as fetchMemberBulkByIdBatchedAction } from '../../libs/member/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { getPrivateServiceById } from '../../libs/private-service/selectors/private-service';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../../libs/private-service/selectors/private-booking';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  getFilteredAvailabilitySlots,
  getPrivateServiceResourceData,
} from '../../libs/private-service/selectors/availability-slot';
import AvailabilityUpdateResourceChoserDialog from '../../libs/private-service/components/resource/AvailabilityUpdateResourceChoserDialog.component';
import ResourceConfigurationDialog from '../../libs/private-service/components/resource/ResourceConfigurationDialog.component';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  fetchPrivateService,
  fetchPrivateBookings as fetchPrivateBookingListActions,
  fetchPrivateServiceResourceData,
  disableAvailabilitySlotMultipleResource,
  enableAvailabilitySlotMultipleResource,
  updateServiceResourceConfiguration,
  createOrUpdateCustomEvent as createOrUpdateCustomEventActions,
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent,
} from '../../libs/private-service/actions';
import CustomEvenFormDialog from '../../libs/private-service/components/custom-event/CustomEventFormDialog.component';
import { getCustomEventList } from '../../libs/private-service/selectors/custom-event';
import { CompanyTheme } from '../../libs/theme/types';
import type { ScheduleFilter } from '../../libs/user-preference/types';
import { setPrivateServiceScheduleFilter as setPrivateServiceScheduleFilterAction } from '../../libs/user-preference/actions';
import { getPrivateServiceScheduleFilter } from '../../libs/user-preference/selectors';

type Props = {
  classes: Object,
  loading: boolean,
  privateBookingList: Array<PrivateBooking>,

  resourceData: ?ResourceData,
  resourceFiltersArray: Array<string>,
  setResourceFiltersArray: (filters: Array<string>) => void,
  resourceDataLoading: boolean,
  resetAvailabilitySlots: () => void,

  resourceToEdit: string,
  setResourceToEdit: (string) => void,
  onEditResourceConfiguration: (
    id: number,
    resourceIdentifier: number,
    data: any,
    options: OptionCallback,
  ) => void,
  goToResourceCalendar: () => void,

  id: number,
  fetchPrivateService: (id: number, options: OptionCallback) => void,

  fetchAvailabilitySlots: (params: any) => void,
  availabilitySlots: Array<AvailabilitySlot>,
  availabilitySlotUpdating: boolean,

  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  enableAvailabilitySlotMultipleResource: (data: any) => void,
  disableAvailabilitySlotMultipleResource: (data: any) => void,
  periodFilter: { start: string, end: string },

  fetchPrivateServiceResourceData: (id: number, OptionCallback) => void,
  setResourceFiltersArray: (ressources: Array<string>) => void,
  fetchPrivateBookingList: () => void,
  fetchCustomEventList: () => void,
  resetCustomEvent: () => void,
  customEventList: Array<CustomEvent>,
  onRequestCustomEvent: (data: any) => void,
  customEventData: any,
  service: PrivateService,
  createOrUpdateCustomEvent: (data: any, options: OptionCallback) => void,
  closeCustomEventDialog: () => void,

  companyTheme: CompanyTheme,

  scheduleFilter: ScheduleFilter,
  setPrivateServiceScheduleFilter: (
    privateService: number,
    scheduleFilter: ScheduleFilter,
  ) => void,
  establishments: Array<EstablishmentWithAssociatedId>,
  fetchAssociatedEstablishments: () => void,
  fetchAssociatedCoachesList: (params: { disabled: boolean }) => void,
};

type State = {
  updateAvailabilitySlotData: ?{
    kind: string,
    data: [any, OptionCallback],
  },
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class CoachPrivateCalendar extends React.Component<Props, State> {
  state = {
    updateAvailabilitySlotData: null,
  };

  fetchAvailabilitySlotsAllResource = () => {
    this.props.resetAvailabilitySlots();
    // fetch private service slots
    this.props.fetchAvailabilitySlots({
      private_service: this.props.id,
      date_start__lte: this.props.periodFilter.end,
      date_start__gte: this.props.periodFilter.start,
    });
    // fetch service's establshments slots
    this.props.fetchPrivateService(this.props.id, {
      onSuccess: (service) => {
        if (service.establishments.length) {
          this.props.fetchAvailabilitySlots({
            associated_establishment__in: service.establishments,
            date_start__lte: this.props.periodFilter.end,
            date_start__gte: this.props.periodFilter.start,
          });
        }
        if (service.coaches.length) {
          // fetch service's coaches slots
          this.props.fetchAvailabilitySlots({
            associated_coach__id: service.coaches,
            date_start__lte: this.props.periodFilter.end,
            date_start__gte: this.props.periodFilter.start,
          });
        }
      },
    });
  };

  componentDidMount() {
    this.props.fetchAssociatedEstablishments();
    this.props.fetchPrivateServiceResourceData(this.props.id, {
      onSuccess: (resourceData) => {
        this.props.setResourceFiltersArray(
          resourceData.map((r) => r.resource_identifier),
        );
        this.props.fetchCustomEventList();
      },
    });
    this.props.fetchAssociatedCoachesList({ disabled: false });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end ||
      this.props.id !== prevProps.id
    ) {
      this.fetchAvailabilitySlotsAllResource();
      this.props.fetchPrivateBookingList();
      if (this.props.service) this.props.fetchCustomEventList();
    }
  }

  componentWillUnmount() {
    this.props.resetCustomEvent();
  }

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
    restriction_on_associated_establishments: number[],
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

  setScheduleFilter = (scheduleFilter: ScheduleFilter) =>
    this.props.setPrivateServiceScheduleFilter({
      privateService: this.props.id,
      scheduleFilter,
    });

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarWithControls
          showCustomEventsToogle
          availabilitySlots={this.props.availabilitySlots}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          companyTheme={this.props.companyTheme}
          createCustomEvent={this.props.onRequestCustomEvent}
          customEventList={this.props.customEventList}
          disableResourceAvailabilitySlot={this.disableResourceAvailabilitySlot}
          enableResourceAvailabilitySlot={this.enableResourceAvailabilitySlot}
          establishments={this.props.establishments}
          fetchAvailabilitySlots={this.fetchAvailabilitySlotsAllResource}
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          onEditResourceConfiguration={this.props.setResourceToEdit}
          privateBookings={this.props.privateBookingList}
          resourceAvailable={this.props.resourceData}
          resourceDataLoading={this.props.resourceDataLoading}
          resourceSelectedListIds={this.props.resourceFiltersArray}
          scheduleFilter={this.props.scheduleFilter}
          setResourceFiltered={this.props.setResourceFiltersArray}
          setScheduleFilter={this.setScheduleFilter}
          timezone={this.props.companyTheme.timezone_name}
        />
        {this.props.customEventData && (
          <CustomEvenFormDialog
            open
            coaches={this.props.service.coaches}
            onClose={this.props.closeCustomEventDialog}
            onSubmit={this.props.createOrUpdateCustomEvent}
          />
        )}
        {this.state.updateAvailabilitySlotData ? (
          <AvailabilityUpdateResourceChoserDialog
            establishments={this.props.establishments}
            kind={this.state.updateAvailabilitySlotData.kind}
            onClose={this.onCancelAvailabilityUpdate}
            onSubmit={this.submitAvailabilitySlotUpdate}
            open={!!this.state.updateAvailabilitySlotData}
            resourceAvailable={this.props.resourceData}
          />
        ) : null}
        {this.props.resourceToEdit ? (
          <ResourceConfigurationDialog
            goToResourceCalendar={this.props.goToResourceCalendar}
            onClose={() => this.props.setResourceToEdit(null)}
            onSubmit={(resourceIdentifier, data, options) =>
              this.props.onEditResourceConfiguration(
                this.props.id,
                resourceIdentifier,
                data,
                options,
              )
            }
            open={!!this.props.resourceToEdit}
            resourceData={this.props.resourceToEdit}
          />
        ) : null}
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withTranslation(['privateService']),
  withState('resourceFiltersArray', 'setResourceFiltersArray', []),
  withState('resourceToEdit', 'setResourceToEdit', null),
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
  withStateHandlers(
    { customEventData: null },
    {
      closeCustomEventDialog: () => () => ({ customEventData: null }),
      onRequestCustomEvent: () => (customEventData) => ({ customEventData }),
    },
  ),
  withHandlers({
    handleDateChange:
      ({ setPeriodFilter }) =>
      ({ date_start, date_end }: { date_start: string, date_end: string }) => {
        setPeriodFilter({
          start: DateTime.fromISO(date_start).minus({ days: 1 }).toISODate(),
          end: DateTime.fromISO(date_end).plus({ days: 1 }).toISODate(),
        });
      },
  }),

  connect(
    (state, { id, periodFilter, resourceFiltersArray }) => ({
      availabilitySlots: getFilteredAvailabilitySlots(
        state,
        periodFilter,
        resourceFiltersArray,
      ),
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
      companyId: getTheme(state)?.company,
      establishments: getAllEstablishmentsWithAssociatedId(state),
      service: getPrivateServiceById(state, id),
      resourceData: getPrivateServiceResourceData(state, id),
      resourceDataLoading: state.privateService.resource.loading,
      privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
        state,
        null,
        periodFilter,
      ),
      availableCoaches: getActiveCoaches(state),
      customEventList: getCustomEventList(state, periodFilter),
      companyTheme: state.theme.theme,
      scheduleFilter: getPrivateServiceScheduleFilter(state, id),
    }),
    {
      fetchAvailabilitySlots,
      resetAvailabilitySlots,
      fetchAssociatedCoachesList,
      fetchPrivateService,
      fetchPrivateServiceResourceData,
      fetchPrivateBookings: fetchPrivateBookingListActions,
      fetchCustomEventList: fetchCustomEventListAction,
      resetCustomEvent,
      createOrUpdateCustomEvent: createOrUpdateCustomEventActions,
      fetchMemberBulkByIdBatched: fetchMemberBulkByIdBatchedAction,
      disableAvailabilitySlotMultipleResource,
      enableAvailabilitySlotMultipleResource,
      fetchEstablishments: fetchEstablishmentsAction,
      fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
      onEditResourceConfiguration: updateServiceResourceConfiguration,
      setPrivateServiceScheduleFilter: setPrivateServiceScheduleFilterAction,
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
    fetchCustomEventList:
      ({ fetchCustomEventList, periodFilter, service }) =>
      () => {
        fetchCustomEventList({
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
          associated_coach_in: service.coaches.map((c) => c.id),
        });
      },
    fetchPrivateBookingList:
      ({
        fetchPrivateBookings,
        periodFilter,
        id,
        fetchMemberBulkByIdBatched,
      }) =>
      () => {
        fetchPrivateBookings(
          {
            private_service: id,
            date_start__gte: periodFilter.start,
            date_start__lte: periodFilter.end,
            page_size: null,
          },
          {
            onSuccess: (bookings) => {
              if (bookings.length) {
                fetchMemberBulkByIdBatched(uniq(bookings.map((b) => b.member)));
              }
            },
          },
        );
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
        );
      },
  }),
  withTitle(({ service }) => {
    return service ? `${service.name}` : '';
  }),
)(CoachPrivateCalendar);
