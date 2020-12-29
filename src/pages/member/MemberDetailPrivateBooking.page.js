// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  withState,
  withStateHandlers,
  withHandlers,
  withProps,
} from 'recompose';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions.ts';
import { fetchAssociatedEstablishmentBulk as fetchAssociatedEstablishmentBulkAction } from '../../libs/establishment/actions.ts';
import {
  deletePrivateBooking as deletePrivateBookingAction,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateBookings as fetchPrivateBookingListAction,
  fetchPrivateBooking as fetchPrivateBookingAction,
  fetchPrivateService as fetchPrivateServiceAction,
  fetchPrivateSlot as fetchPrivateSlotAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateConsumerPass as fetchPrivateConsumerPassAction,
  attachCoachToPrivateBooking as attachCoachAction,
  restorePrivateBooking,
  fetchRecurrenceRulePrivateBooking as fetchRecurenceRulePrivateBookingAction,
  deleteRecurrenceRulePrivateBooking as deleteRecurrenceRulePrivateBookingAction,
} from '../../libs/private-service/actions.ts';
import { getCoaches } from '../../libs/associated-coach/selectors.ts';
import {
  getPrivateBookingListBase,
  getPrivateBooking,
  withRelatedFields,
  getRecurrenceRulePrivateBookingList,
} from '../../libs/private-service/selectors/private-booking';
import { getPrivateConsumerPassDict } from '../../libs/private-service/selectors/private-consumer-pass';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';

import PrivateBookingListItem from '../../libs/private-service/components/booking/PrivateBookingListItem.component';
import PrivateBookingDetail from '../../libs/private-service/components/booking/PrivateBookingDetail.component';
import PrivateBookingDisableDialog from '../../libs/private-service/components/booking/PrivateBookingDisableDialog.component';
import PrivateBookingAttachCoachDialog from '../../libs/private-service/components/booking/PrivateBookingAttachCoachDialog.component';
import RecurrenceRulePrivateBookingItem from '../../libs/private-service/components/booking/RecurrenceRulePrivateBookingItem.component';

import type {
  PrivateConsumerPass,
  PrivateBooking,
  PrivateService,
  PrivateSlot,
  RecurrenceRulePrivateBooking,
} from '../../libs/private-service/types.ts';
import RecurrenceRulePrivateBooker from '../../libs/private-service/containers/RecurrenceRulePrivateBooker.container';

type Props = {
  t: TFunction,
  classes: Object,
  id: number,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  fetchMember: (id: number) => void,
  private_consumer_pass: ?PrivateConsumerPass,
  fetchPrivateBookings: (params: any) => void,
  private_booking_list: Array<PrivateBooking>,
  private_slot: PrivateSlot,

  private_service: PrivateService,
  goToPrivateConsumerPass: (
    memberId: number,
    privateConsumerPassId: number,
  ) => void,

  isOpenAttachCoach: boolean,
  serviceCoaches: Array<Coach>,
  attachCoach: (data: any) => void,
  availableCoaches: Array<Coach>,
  closeAttachCoach: () => void,

  openAttachCoach: () => void,
  private_consumer_pass: ?PrivateConsumerPass,
  onPrivateSlotClick: () => void,

  private_booking: ?PrivateBooking,
  privateBookingId: ?number,
  fetchPrivateBookingDetails: () => void,
  fetchPrivateConsumerPass: (id: number) => void,
  privateBookingsLoading: boolean,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  setBookingToDelete: (?PrivateBooking) => void,
  bookingToDelete: ?PrivateBooking,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  restorePrivateBooking: (id: number) => void,

  bookerInAdvanceDialog: boolean,
  setBookerInAdvanceDialog: (boolean) => void,
  recurrenceRulePrivateBooking: Array<any>,
  recurrentPrivateBookingLoading: boolean,
  onDeleteRecurrenceRulePrivateBooking: (
    rb: RecurrenceRulePrivateBooking,
    memberId: number,
  ) => void,
  fetchRecurrenceRulePrivateBooking: () => void,
  setSelectedRecurrentRule: (RecurrenceRulePrivateBooking) => void,
  selectedRecurrentRule: RecurrenceRulePrivateBooking,
};

export class MemberDetailBooking extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({ member: this.props.id });
    this.props.fetchMember(this.props.id);
    if (this.props.privateBookingId) {
      this.props.fetchPrivateBookingDetails();
    }
    this.props.fetchRecurrenceRulePrivateBooking();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.privateBookingId &&
      prevProps.privateBookingId !== this.props.privateBookingId
    ) {
      this.props.fetchPrivateBookingDetails();
    }
  }

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <Grid container direction="row" spacing={3}>
        <Grid container item xs={12} lg={6} direction="column" spacing={3}>
          <Grid item>
            <Paper>
              <Typography variant="caption" style={{ padding: 10 }}>
                {t('privateBooking.bookings')}
              </Typography>
              <Divider />
              <PaginatedListStateful
                itemPerPage={5}
                loading={this.props.privateBookingsLoading}
                listProps={{ disablePadding: true }}
                items={this.props.private_booking_list}
                renderItem={(b) => (
                  <PrivateBookingListItem
                    onClick={() =>
                      this.props.goToPrivateBooking(this.props.id, b.id)
                    }
                    divider
                    selected={this.props.privateBookingId === b.id}
                    key={b.id}
                    private_booking={b}
                    onDelete={() => this.props.setBookingToDelete(b)}
                    onRestore={() => this.props.restorePrivateBooking(b.id)}
                  />
                )}
              />
            </Paper>
            {!!this.props.recurrenceRulePrivateBooking.length && (
              <Paper className={classes.recurrenceRuleContainer}>
                <Typography variant="caption" style={{ padding: 10 }}>
                    {t('recurrenceRule.recurrentBookings')}
                </Typography>
                <Divider />
                <PaginatedListStateful
                  itemPerPage={5}
                  loading={this.props.recurrentPrivateBookingLoading}
                  listProps={{ disablePadding: true }}
                  items={this.props.recurrenceRulePrivateBooking}
                  renderItem={(rb) => (
                    <RecurrenceRulePrivateBookingItem
                      notShowMember
                      recurrentPrivateBooking={rb}
                      onDelete={() => this.props.onDeleteRecurrenceRulePrivateBooking(
                        rb, this.props.id,
                      )}
                      onEdit={() => {
                        this.props.setBookerInAdvanceDialog(true);
                        this.props.setSelectedRecurrentRule(rb);
                      }}
                    />
                  )}
                />
              </Paper>
            )}
            <div className={classes.createRecurrentBooking}>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.setBookerInAdvanceDialog(true);
                  this.props.setSelectedRecurrentRule(null);
                }}
                color="primary"
              >
                {this.props.t('recurrenceRule.createModal.create')}
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.private_booking ? (
            <PrivateBookingDetail
              private_booking={this.props.private_booking}
              availableCoaches={this.props.availableCoaches}
              private_slot={this.props.private_booking.private_slot}
              private_service={this.props.private_booking.private_service}
              onOpenAttachCoach={this.props.openAttachCoach}
              private_consumer_pass={this.props.private_consumer_pass}
              onPrivateSlotClick={this.props.onPrivateSlotClick}
              goToPrivateConsumerPass={(privateConsumerPassId) =>
                this.props.goToPrivateConsumerPass(
                  this.props.id,
                  privateConsumerPassId,
                )
              }
            />
          ) : null}
        </Grid>
        {!!this.props.isOpenAttachCoach && (
          <PrivateBookingAttachCoachDialog
            open={!!this.props.isOpenAttachCoach}
            associatedCoachList={this.props.serviceCoaches}
            onSubmit={this.props.attachCoach}
            onClose={this.props.closeAttachCoach}
          />
        )}
        {!!this.props.bookingToDelete && (
          <PrivateBookingDisableDialog
            open={!!this.props.bookingToDelete}
            private_booking={this.props.bookingToDelete}
            onSubmit={(force_refund) =>
              (this.props.bookingToDelete.booking_status_code ===
                BOOKING_STATUS_OK.id
                ? this.props.disablePrivateBooking
                : this.props.deletePrivateBooking)(
                this.props.bookingToDelete.id,
                { force_refund },
                {
                  onSuccess: () => {
                    this.props.fetchPrivateConsumerPass(
                      this.props.bookingToDelete.private_consumer_pass,
                    );
                    this.props.setBookingToDelete(null);
                  },
                  onError: () => {
                    this.props.setBookingToDelete(null);
                  },
                },
              )
            }
            onClose={() => this.props.setBookingToDelete(null)}
          />
        )}
        {this.props.bookerInAdvanceDialog && (
          <RecurrenceRulePrivateBooker
            open={this.props.bookerInAdvanceDialog}
            setOpen={this.props.setBookerInAdvanceDialog}
            memberId={this.props.id}
            initial={this.props.selectedRecurrentRule}
            onChange={() => {
              this.props.fetchPrivateBookings({ member: this.props.id });
              this.props.fetchRecurrenceRulePrivateBooking();
            }}
          />
        )}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  recurrenceRuleContainer: {
    marginTop: theme.spacing(3),
  },
  createRecurrentBooking: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateBookingId: 'privateBookingId:number',
  }),
  withTranslation('privateService'),
  withStyles(styles),
  withState('bookerInAdvanceDialog', 'setBookerInAdvanceDialog', false),
  withState('selectedRecurrentRule', 'setSelectedRecurrentRule', null),
  connect(
    (state, { privateBookingId }) => ({
      private_booking_list: getPrivateBookingListBase(state),
      private_booking: withRelatedFields(getPrivateBooking)(
        state,
        privateBookingId,
      ),
      privateBookingsLoading: state.privateService.privateBooking.loading,
      availableCoaches: getCoaches(state),
      recurrenceRulePrivateBooking: getRecurrenceRulePrivateBookingList(state),
      recurrentPrivateBookingLoading:
        state.privateService.recurrenceRule.loading,
    }),
    {
      fetchPrivateBookings: fetchPrivateBookingListAction,
      fetchPrivateBooking: fetchPrivateBookingAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchPrivateSlot: fetchPrivateSlotAction,
      fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
      fetchAssociatedEstablishmentBulk: fetchAssociatedEstablishmentBulkAction,
      fetchPrivateConsumerPass: fetchPrivateConsumerPassAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchRecurrenceRulePrivateBooking: fetchRecurenceRulePrivateBookingAction,
      deleteRecurrenceRulePrivateBooking: deleteRecurrenceRulePrivateBookingAction,
      deletePrivateBooking: deletePrivateBookingAction,
      disablePrivateBooking: disablePrivateBookingAction,
      fetchMember: fetchMemberAction,
      attachCoach: attachCoachAction,
      restorePrivateBooking,
      goToPrivateService: (privateServiceId) =>
        push(`/private-service/service/${privateServiceId}/`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
    },
  ),
  connect((state, { private_booking }) => ({
    private_consumer_pass: private_booking
      ? getPrivateConsumerPassDict(state)[private_booking.private_consumer_pass]
      : null,
  })),
  withProps(({ private_booking, availableCoaches }) => ({
    serviceCoaches: availableCoaches.filter((c) =>
      c.associatedcoach_set.filter(
        (value) =>
          private_booking &&
          private_booking.private_service &&
          private_booking.private_service.coaches.indexOf(value) !== -1,
      ),
    ),
  })),
  withHandlers({
    onPrivateSlotClick: ({ goToPrivateService, private_booking }) => () =>
      goToPrivateService(private_booking.private_service.id),
  }),
  withState('bookingToDelete', 'setBookingToDelete', null),
  withStateHandlers(
    { isOpenAttachCoach: null },
    {
      openAttachCoach: (_, { private_booking }) => () => ({
        isOpenAttachCoach: private_booking,
      }),
      closeAttachCoach: () => () => ({ isOpenAttachCoach: null }),
    },
  ),
  withHandlers({
    attachCoach: ({ attachCoach, closeAttachCoach, privateBookingId }) => (
      data,
    ) => {
      attachCoach(privateBookingId, data, {
        onSuccess: () => closeAttachCoach(),
      });
    },
    fetchPrivateBookingDetails: ({
      privateBookingId,
      fetchPrivateConsumerPass,
      fetchAssociatedCoachBulk,
      fetchPrivateService,
      fetchPrivateSlot,
      fetchPrivateBooking,
    }) => () => {
      fetchPrivateBooking(privateBookingId, {
        onSuccess: (privateBooking) => {
          fetchPrivateService(privateBooking.private_service, {
            onSuccess: (service) => {
              if (service && service.coaches.length) {
                fetchAssociatedCoachBulk(service.coaches);
              }
            },
          });
          fetchPrivateSlot(
            privateBooking.private_service,
            privateBooking.private_slot,
          );
          fetchPrivateConsumerPass(privateBooking.private_consumer_pass);
        },
      });
    },
    fetchRecurrenceRulePrivateBooking: ({
      fetchRecurrenceRulePrivateBooking,
      fetchAssociatedCoachBulk,
      fetchAssociatedEstablishmentBulk,
      fetchPrivateSlotBulk,
      id,
    }) => () => {
      fetchRecurrenceRulePrivateBooking(
        {
          member: id,
        },
        {
          onSuccess: (recurrentRuleList) => {
            if (recurrentRuleList.length) {
              fetchAssociatedCoachBulk([
                ...recurrentRuleList.map((o) => o.associated_coach),
              ]);
              fetchAssociatedEstablishmentBulk([
                ...recurrentRuleList.map((o) => o.associated_establishment),
              ]);
              fetchPrivateSlotBulk([
                ...recurrentRuleList.map((o) => o.private_slot),
              ]);
            }
          },
        },
      );
    },
    onDeleteRecurrenceRulePrivateBooking: ({
      deleteRecurrenceRulePrivateBooking,
      fetchRecurrenceRulePrivateBooking,
      fetchPrivateBookings,
      fetchMember,
    }) => (recurrentBooking, memberId) => {
      deleteRecurrenceRulePrivateBooking(recurrentBooking.id, {
        onSuccess: () => {
          fetchMember(memberId);
          fetchRecurrenceRulePrivateBooking();
          fetchPrivateBookings({ member: memberId });
        },
      });
    },
  }),
)(MemberDetailBooking);
