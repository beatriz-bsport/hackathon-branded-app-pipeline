// @flow
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withTitle from '../../hocs/with-title.hoc';
import { fetchFilteredMembers } from '../../libs/member/actions';
import { getPrivateServiceById } from '../../libs/private-service/selectors/private-service';
import {
  getPrivateBookingListFiltered,
  bookingWithAllRelatedField,
} from '../../libs/private-service/selectors/private-booking';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  getFilteredAvailabilitySlots,
  withResourceColor,
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
  disableResourceAvailabilitySlot,
  enableResourceAvailabilitySlot,
  updateResourceConfiguration,
} from '../../libs/private-service/actions';

type Props = {
  classes: Object,
  loading: boolean,
  privateBookingList: Array<PrivateBooking>,
  resourceData: ?ResourceData,
  resourceFiltersArray: Array<string>,
  setResourceFiltersArray: (Array<string>) => void,
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
  fetchPrivateService: (id: number) => void,

  fetchAvailabilitySlots: (data: { 'private-service': number }) => void,
  availabilitySlots: Array<AvailabilitySlot>,
  availabilitySlotUpdating: boolean,

  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  enableResourceAvailabilitySlot: (data: any) => void,
  disableResourceAvailabilitySlot: (data: any) => void,
  periodFilter: { start: string, end: string },

  fetchPrivateServiceResourceData: (id: number, OptionCallback) => void,
  setResourceFiltersArray: (Array<string>) => void,
  fetchPrivateBookingList: () => void,
};

type State = {
  updateAvailabilitySlotData: ?{
    kind: string,
    data: [any, OptionCallback],
  },
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing.unit },
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
    this.props.fetchPrivateServiceResourceData(this.props.id, {
      onSuccess: (resourceData) =>
        this.props.setResourceFiltersArray(
          resourceData.map((r) => r.resource_identifier),
        ),
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end ||
      this.props.id !== prevProps.id
    ) {
      this.fetchAvailabilitySlotsAllResource();
      this.props.fetchPrivateBookingList();
    }
  }

  storeResourceAvailabilityUpdate = (kind: string) => (...data: any) => {
    this.setState({
      updateAvailabilitySlotData: {
        data,
        kind,
      },
    });
  };

  enableResourceAvailabilitySlot = this.storeResourceAvailabilityUpdate(
    'enable',
  );

  disableResourceAvailabilitySlot = this.storeResourceAvailabilityUpdate(
    'disable',
  );

  onCancelAvailabilityUpdate = () =>
    this.setState({ updateAvailabilitySlotData: null });

  submitAvailabilitySlotUpdate = (resourceData) => {
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
      this.props.enableResourceAvailabilitySlot(
        resourceData,
        slotUpdateData,
        options,
      );
    }
    if (kind === 'disable') {
      this.props.disableResourceAvailabilitySlot(
        resourceData,
        slotUpdateData,
        options,
      );
    }
    this.onCancelAvailabilityUpdate();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarWithControls
          enableResourceAvailabilitySlot={this.enableResourceAvailabilitySlot}
          disableResourceAvailabilitySlot={this.disableResourceAvailabilitySlot}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookingList}
          resourceAvailable={this.props.resourceData}
          resourceSelectedListIds={this.props.resourceFiltersArray}
          resourceDataLoading={this.props.resourceDataLoading}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          setResourceFiltered={this.props.setResourceFiltersArray}
          onEditResourceConfiguration={this.props.setResourceToEdit}
        />
        {this.state.updateAvailabilitySlotData ? (
          <AvailabilityUpdateResourceChoserDialog
            resourceAvailable={this.props.resourceData}
            onSubmit={this.submitAvailabilitySlotUpdate}
            onClose={this.onCancelAvailabilityUpdate}
            open={!!this.state.updateAvailabilitySlotData}
          />
        ) : null}
        {this.props.resourceToEdit ? (
          <ResourceConfigurationDialog
            open={!!this.props.resourceToEdit}
            resourceData={this.props.resourceToEdit}
            onClose={() => this.props.setResourceToEdit(null)}
            onSubmit={(resourceIdentifier, data, options) =>
              this.props.onEditResourceConfiguration(
                this.props.id,
                resourceIdentifier,
                data,
                options,
              )
            }
            goToResourceCalendar={this.props.goToResourceCalendar}
          />
        ) : null}
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withNamespaces(['privateService']),
  withState('resourceFiltersArray', 'setResourceFiltersArray', []),
  withState('resourceToEdit', 'setResourceToEdit', null),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    end: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
  }),
  withHandlers({
    handleDateChange: ({ setPeriodFilter }) => ({
      date_start,
      date_end,
    }: {
      date_start: string,
      date_end: string,
    }) => {
      setPeriodFilter({ start: date_start, end: date_end });
    },
  }),

  connect(
    (state, { id, periodFilter, resourceFiltersArray }) => ({
      availabilitySlots: withResourceColor(getFilteredAvailabilitySlots)(
        state,
        periodFilter,
        resourceFiltersArray,
      ),
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
      service: getPrivateServiceById(state, id),
      resourceData: getPrivateServiceResourceData(state, id),
      resourceDataLoading: state.privateService.privateServiceResource.loading,
      privateBookingList: bookingWithAllRelatedField(
        getPrivateBookingListFiltered,
      )(state, { private_service: id }, periodFilter),
    }),
    {
      fetchAvailabilitySlots,
      resetAvailabilitySlots,
      fetchPrivateService,
      fetchPrivateServiceResourceData,
      fetchPrivateBookings: fetchPrivateBookingListActions,
      fetchFilteredMembers,
      disableResourceAvailabilitySlot,
      enableResourceAvailabilitySlot,
      onEditResourceConfiguration: updateResourceConfiguration,
    },
  ),
  withHandlers({
    fetchPrivateBookingList: ({
      fetchPrivateBookings,
      periodFilter,
      id,
    }) => () => {
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
              fetchFilteredMembers({
                id__in: bookings.map((b) => b.member),
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
