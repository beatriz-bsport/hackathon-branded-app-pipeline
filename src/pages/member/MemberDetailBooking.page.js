// @flow

import React, { Component } from 'react';

import omit from 'lodash/omit';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import PaginatedListBase from '../../components/PaginatedListBase.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByMember as fetchBookingsByMemberAction,
  retrieveBooking,
  fetchRecurrenceRuleBooking as fetchRecurrenceRuleBookingAction,
  deleteRecurrenceRuleBooking as deleteRecurrenceRuleBookingAction,
  createRecurrenceRuleBooking as createRecurrenceRuleBookingAction,
  updateRecurrenceRuleBooking as updateRecurrenceRuleBookingAction,
} from '../../libs/booking/actions';
import { fetchOfferById as fetchOfferByIdAction } from '../../libs/offer/actions';

import { getDetailedOffer } from '../../libs/offer/selectors';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  updateCredit as updateCreditAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchAllActivities as fetchAllActivitiesAction,
} from '../../libs/meta-activity/actions';

import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';

import type { Member } from '../../libs/member/types';
import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking } from '../../libs/booking/types';

import BookingItemForManagerV2 from '../../libs/booking/components/BookingItemForManagerV2.component';
import BookingDetail from '../../libs/booking/components/BookingDetail.component';
import RecurrenceRuleBookingFormDialog from '../../libs/booking/components/RecurrenceRuleBookingFormDialog.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import BookingFilters from '../../libs/booking/components/BookingFilters.component';
import RecurrenceRuleBookingListItem from '../../libs/booking/components/RecurrenceRuleBookingListItem.component';

import {
  getMemberBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
  getRecurrenceRuleBookingList,
} from '../../libs/booking/selectors';
import { getMember } from '../../libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';

type Props = {
  classes: *,
  t: TFunction,
  id: number,
  bookingId: ?number,
  retrieveBooking: (number, OptionCallback) => void,
  retrieveConsumerPackBulk: (Array<number>) => void,
  member: Member,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingCurrentPage: number,
  fetchMemberBookingsList: (page: number, pageSize: number) => void,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  bookingsLoading: boolean,
  fetchMemberBookings: (id: number) => void,
  deleteBooking: (id: number, data: any, options: OptionCallback) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,

  selectBooking: (memberId: number, bookingId: number) => void,
  fetchOffer: (id: number) => void,
  goToOffer: (id: number) => void,
  getPass: (id: number) => void,
  selectedBooking: ?Booking,
  getPaymentPack: (id: number) => PaymentPack,
  offerLoading: boolean,
  member: Member,
  consumerPackLoading: boolean,
  offer: ?Offer,

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
  recurrenceRuleBooking: Array,
  onDeleteRecurrenceRuleBooking: (r: Dict) => void,
  recurrentBookingCurrentPage: number,
  setBookerInAvanceDialog: () => void,
  bookerInAvanceDialog: boolean,
  fetchAllActivities: () => void,
  metaActivities: Array,
  setSelectedRecurrentBooking: () => void,
  selectedRecurrentBooking: boolean,
  RecurrentBookingOnPageRequested: (page: number) => void,
  recurrentBookingNextPage: number,
  recurrentBookingCount: number,
  refresh: () => void,
  onSubmitRecurrentBooking: () => void,
};

type State = {
  bookingToRevert: ?Booking,
};

const BOOKING_PAGE_SIZE = 5;
const RECURRENT_BOOKING_PAGE_SIZE = 5;

export class MemberDetailBooking extends Component<Props, State> {
  state = {
    bookingToRevert: null,
  };

  handlePageRequested = (page: number) => {
    this.props.RecurrentBookingOnPageRequested(
      page,
      RECURRENT_BOOKING_PAGE_SIZE,
    );
  };

  componentDidMount() {
    if (this.props.bookingId) {
      this.fetchBookingDetails();
    }
    this.props.fetchAllActivities();
    this.handlePageRequested(1);
  }

  hasNext = () => {
    return this.props.recurrentBookingNextPage !== null;
  };

  goNext = () => {
    this.handlePageRequested(this.props.recurrentBookingCurrentPage + 1);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchMemberBookings(this.props.id, 1, 7, this.props.filters, {
        onSuccess: (bookings) =>
          this.props.retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
    }
    if (
      this.props.bookingId &&
      (!prevProps.bookingId || prevProps.bookingId !== this.props.bookingId)
    ) {
      this.fetchBookingDetails();
    }
  }

  fetchBookingDetails = () => {
    this.props.retrieveBooking(this.props.bookingId, {
      onSuccess: (booking) => {
        this.props.fetchOffer(booking.offer);
        this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]);
      },
    });
  };

  handleBookingDeletion = (data: any, options: OptionCallback) => {
    this.props.deleteBooking(this.state.bookingToRevert.id, data, options);
    this.setState({ bookingToRevert: null });
  };

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  selectBooking = (booking: Booking) => {
    this.props.selectBooking(this.props.id, booking.id);
  };

  render() {
    return (
      <Grid container direction="row" spacing={3}>
        <Grid container item xs={12} lg={6} direction="column" spacing={3}>
          <Grid item>
            <Paper>
              <BookingFilters
                setOpenValue={this.props.setOpenValue}
                setFiltersValue={this.props.setFilterValue}
                open={this.props.open}
                filters={this.props.filters}
              />
              <Divider />
              <PaginatedListBase
                itemPerPage={BOOKING_PAGE_SIZE}
                loading={this.props.bookingsLoading}
                listProps={{ disablePadding: true }}
                items={this.props.bookings}
                nbItems={this.props.bookingCount}
                page={this.props.bookingCurrentPage}
                onPageRequested={(page, page_size) =>
                  this.props.fetchMemberBookingsList(page, page_size)
                }
                renderItem={(b) => (
                  <BookingItemForManagerV2
                    onClick={() => this.selectBooking(b)}
                    showRevertBookingButton
                    button
                    selected={
                      this.props.selectedBooking &&
                      this.props.selectedBooking.id === b.id
                    }
                    key={b.id}
                    booking={b}
                    heading="date_start"
                    member={this.props.member}
                    handleRevert={() => this.setState({ bookingToRevert: b })}
                    discardBookingAttendance={() =>
                      this.props.discardBookingAttendance(b.id)
                    }
                    confirmBookingAttendance={() =>
                      this.props.confirmBookingAttendance(b.id)
                    }
                  />
                )}
              />
            </Paper>
          </Grid>
          <Grid item>
            {!!this.props.recurrenceRuleBooking.length && (
              <Paper>
                <Typography variant="caption" style={{ padding: 10 }}>
                  {this.props.t('booking:recurrenceRule.recurrentBookings')}
                </Typography>
                <Divider />
                <List disablePadding>
                  {this.props.recurrenceRuleBooking.map((r) => (
                    <RecurrenceRuleBookingListItem
                      notShowMember
                      key={r.id}
                      recurrenceRuleBooking={{
                        ...r,
                        member: this.props.member,
                      }}
                      onDelete={(id, data) =>
                        this.props.onDeleteRecurrenceRuleBooking(
                          r,
                          this.props.id,
                          data,
                        )
                      }
                      onEdit={() => {
                        this.props.fetchAllActivities();
                        this.props.setBookerInAvanceDialog(true);
                        this.props.setSelectedRecurrentBooking(r);
                      }}
                    />
                  ))}
                </List>
                <div className={this.props.classes.bookButtonWideContainer}>
                  {this.hasNext() && (
                    <Button
                      className={this.props.classes.bookButtonWide}
                      color="primary"
                      onClick={this.goNext}
                    >
                      {this.props.t('booking:recurrenceRule.showMore', {
                        count:
                          this.props.recurrentBookingCount -
                          RECURRENT_BOOKING_PAGE_SIZE *
                            this.props.recurrentBookingCurrentPage,
                      })}
                    </Button>
                  )}
                </div>
              </Paper>
            )}

            <div className={this.props.classes.createRecurrentBooking}>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.setBookerInAvanceDialog(true);
                  this.props.fetchAllActivities();
                }}
                color="primary"
              >
                {this.props.t('booking:recurrenceRule.createModal.create')}
              </Button>
            </div>
            {!!this.props.offer && this.props.bookerInAvanceDialog && (
              <RecurrenceRuleBookingFormDialog
                refresh={this.props.refresh}
                initial={
                  this.props.selectedRecurrentBooking &&
                  this.props.selectedRecurrentBooking.meta_activity
                    ? {
                        meta_activity: {
                          id: this.props.selectedRecurrentBooking.meta_activity
                            .id,
                          name: this.props.selectedRecurrentBooking
                            .meta_activity.name,
                        },
                        delay_week: this.props.selectedRecurrentBooking
                          .delay_week,
                        hour: this.props.selectedRecurrentBooking.hour,
                        minute: this.props.selectedRecurrentBooking.minute,
                        day_of_week: this.props.selectedRecurrentBooking
                          .day_of_week,
                        notify_if_booked: this.props.selectedRecurrentBooking
                          .notify_if_booked,
                      }
                    : null
                }
                metaActivityList={this.props.metaActivities}
                onClose={() => {
                  this.props.setBookerInAvanceDialog(false);
                  this.props.setSelectedRecurrentBooking(null);
                }}
                onSubmit={this.props.onSubmitRecurrentBooking}
              />
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          <BookingDetail
            consumerPack={
              this.props.selectedBooking &&
              this.props.getPass(
                parseInt(
                  this.props.selectedBooking.consumer_payment_pack_id,
                  10,
                ),
              )
            }
            getPaymentPack={this.props.getPaymentPack}
            decrementCredit={this.props.decrementCredit}
            incrementCredit={this.props.incrementCredit}
            booking={this.props.selectedBooking}
            member={this.props.member}
            onConsumerPassSelected={this.goToConsumerPass}
            loading={this.props.consumerPackLoading || this.props.offerLoading}
            onOfferClick={this.props.goToOffer}
            offer={this.props.offer}
            offerLoading={
              !this.props.selectedBooking ||
              !this.props.offer ||
              this.props.selectedBooking.offer !== this.props.offer.id
            }
          />
        </Grid>
        <RevertBookingDialog
          handleBookingDeletion={this.handleBookingDeletion}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable
          closeRevertBookingDialog={() =>
            this.setState({ bookingToRevert: null })
          }
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
  containerRecurrentBooking: {
    width: '100%',
  },
  bookButtonWideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'noWrap',
  },
  bookButtonWide: {
    width: '30%',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
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
  routerParamsToProps({ id: 'id:number', bookingId: 'bookingId:number' }),
  withTranslation('booking'),
  withStyles(styles),
  withState('filters', 'setFilters', {}),
  withState('open', 'setOpen', {}),
  withState('bookerInAvanceDialog', 'setBookerInAvanceDialog', false),
  withState('selectedRecurrentBooking', 'setSelectedRecurrentBooking', null),
  connect(
    (state, { id, bookingId }) => ({
      member: getMember(state, id),
      bookings: getMemberBookingListWithConsumerPack(state),
      selectedBooking: bookingId
        ? getMemberBookingWithConsumerPack(state, bookingId)
        : null,
      bookingCurrentPage: state.booking.byMember.page,
      bookingsLoading: state.booking.byMember.loading,
      bookingCount: state.booking.byMember.count,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      offer: getDetailedOffer(state),
      recurrenceRuleBooking: getRecurrenceRuleBookingList(state),
      recurrentBookingCurrentPage: state.booking.recurrenceRule.page,
      recurrentBookingNextPage: state.booking.recurrenceRule.next_page,
      recurrentBookingCount: state.booking.recurrenceRule.count,
      recurrentBookingLoading: state.booking.recurrenceRule.loading,
      metaActivities: getEnabledMetaActivities(state),
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      getPass: (id_: number) => getConsumerPack(state, id_),
      timezone: state.theme.theme.timezone_name,
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      retrieveBooking,
      fetchOffer: fetchOfferByIdAction,

      fetchRecurrenceRuleBooking: fetchRecurrenceRuleBookingAction,
      deleteRecurrenceRuleBooking: deleteRecurrenceRuleBookingAction,
      fetchMember: fetchMemberAction,
      createRecurrenceRuleBooking: createRecurrenceRuleBookingAction,
      fetchAllActivities: fetchAllActivitiesAction,
      updateRecurrenceRuleBooking: updateRecurrenceRuleBookingAction,

      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      deleteBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,

      incrementCredit: (id_) => updateCreditAction(id_, 1),
      decrementCredit: (id_) => updateCreditAction(id_, -1),

      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToConsumerPass: (memberId, consumerPassId) =>
        push(`/member/${memberId}/pass/${consumerPassId}/`),
      selectBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
    },
  ),
  withHandlers({
    onSubmitRecurrentBooking: ({
      id,
      updateRecurrenceRuleBooking,
      selectedRecurrentBooking,
      setSelectedRecurrentBooking,
      createRecurrenceRuleBooking,
    }) => (data, options) => {
      if (id && selectedRecurrentBooking) {
        updateRecurrenceRuleBooking(
          {
            ...data,
            member: id,
          },
          selectedRecurrentBooking.id,
          options,
        );
      }
      if (id && !selectedRecurrentBooking) {
        createRecurrenceRuleBooking({ ...data, member: id }, options);
      }
      setSelectedRecurrentBooking(null);
    },
    refresh: ({
      fetchRecurrenceRuleBooking,
      fetchMember,
      fetchMetaActivityBulk,
      fetchMemberBookings,
      filters,
      retrieveConsumerPackBulk,
      setBookerInAvanceDialog,
      id,
    }) => () => {
      fetchRecurrenceRuleBooking(
        {
          member: id,
          page: 1,
          page_size: RECURRENT_BOOKING_PAGE_SIZE,
        },
        {
          onSuccess: (recurrenceRuleList) => {
            if (recurrenceRuleList.length) {
              fetchMember(id);
              fetchMetaActivityBulk([
                ...recurrenceRuleList.map((o) => o.meta_activity),
              ]);
            }
          },
        },
      );
      fetchMemberBookings(id, 1, 7, filters, {
        onSuccess: (bookings) =>
          retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
      setBookerInAvanceDialog(false);
    },
    RecurrentBookingOnPageRequested: ({
      fetchRecurrenceRuleBooking,
      fetchMember,
      fetchMetaActivityBulk,
      id,
    }) => (page, page_size) => {
      fetchRecurrenceRuleBooking(
        { member: id, page, page_size },
        {
          onSuccess: (recurrenceRuleList) => {
            if (recurrenceRuleList.length) {
              fetchMember(this.props.id);
              fetchMetaActivityBulk([
                ...recurrenceRuleList.map((o) => o.meta_activity),
              ]);
            }
          },
        },
      );
    },
    setOpenValue: ({ setOpen, open }) => (name: string) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    onDeleteRecurrenceRuleBooking: ({
      deleteRecurrenceRuleBooking,
      fetchMemberBookings,
      retrieveConsumerPackBulk,
      fetchRecurrenceRuleBooking,
      fetchMember,
      fetchMetaActivityBulk,
      filters,
    }) => (r, memberId, data) => {
      deleteRecurrenceRuleBooking(r.id, data, {
        onSuccess: () => {
          fetchRecurrenceRuleBooking(
            {
              member: memberId,
              page: 1,
              page_size: RECURRENT_BOOKING_PAGE_SIZE,
            },
            {
              onSuccess: (recurrenceRuleList) => {
                if (recurrenceRuleList.length) {
                  fetchMember(this.props.id);
                  fetchMetaActivityBulk([
                    ...recurrenceRuleList.map((o) => o.meta_activity),
                  ]);
                }
              },
            },
          );
          fetchMemberBookings(memberId, 1, 7, filters, {
            onSuccess: (bookings) =>
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              ),
          });
        },
      });
    },
    fetchMemberBookingsList: ({
      id,
      filters,
      fetchMemberBookings,
      retrieveConsumerPackBulk,
    }) => (page, page_size) => {
      fetchMemberBookings(id, page, page_size, filters, {
        onSuccess: (bookings) =>
          retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
    },
    setFilterValue: ({ setFilters, filters }) => (name: string, value) => {
      if (value === null) {
        setFilters(omit(filters, name));
      } else {
        setFilters({
          ...filters,
          [name]: value,
        });
      }
    },
  }),
)(MemberDetailBooking);

/*
 <PaginatedListBase
                itemPerPage={RECURRENT_BOOKING_PAGE_SIZE}
                loading={this.props.recurrentBookingLoading}
                listProps={{ disablePadding: true }}
                items={this.props.recurrenceRuleBooking}
                nbItems={this.props.recurrentBookingCount}
                page={this.props.recurrentBookingCurrentPage}
                onPageRequested={(page, page_size) =>
                  this.props.fetchRecurrenceRuleBooking(
                    { member: this.props.id, page, page_size },
                    {
                      onSuccess: (recurrenceRuleList) => {
                        if (recurrenceRuleList.length) {
                          this.props.fetchMember(this.props.id);
                          this.props.fetchMetaActivityBulk([
                            ...recurrenceRuleList.map((o) => o.meta_activity),
                          ]);
                        }
                      },
                    },
                  )
                }
                renderItem={(r) => (
                  <RecurrenceRuleBookingListItem
                    notShowMember
                    key={r.id}
                    recurrenceRuleBooking={{
                      ...r,
                      member: this.props.member,
                    }}
                    onDelete={(id, data) =>
                      this.props.onDeleteRecurrenceRuleBooking(
                        r,
                        this.props.id,
                        data,
                      )
                    }
                    onEdit={() => {
                      this.props.fetchAllActivities();
                      this.props.setBookerInAvanceDialog(true);
                      this.props.setSelectedRecurrentBooking(r);
                    }}
                  />
                )}
              />
*/
