// @flow

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withStyles, Paper, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import {
  SimpleModal,
  EditLiveOfferForm,
  DeleteOfferForm,
  OfferCard,
  TimeTable,
  Calendar,
} from '../components';
import { offer as offerActions, booking as bookingActions } from '../actions';
import { Moment } from '../i18n';
import api from '../api';
import type {
  Offer,
  Booking,
  BookingOption,
  Coach,
  Establishment,
  PaymentPack,
} from '../api/types';

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 2,
  },
  calendarContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  discardOption: (id: number) => void,
  discardBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBooking: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  fetchBookings: (id: number) => void,
  fetchCompatiblePacks: (id: number) => void,
  fetchAllOffers: () => void,
  offers: Array<Offer>,
  bookingLoading: boolean,
  bookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  timetableLoading: boolean,
  activities: Array<Object>,
  coaches: Array<Coach>,
  coachesLoading: boolean,
  establishments: Array<Establishment>,
  establishmentsLoading: boolean,
  compatiblePacks: Array<PaymentPack>,
  compatiblePacksLoading: boolean,
};

type State = {
  selectedOffer: ?Offer,
  date: Object,
  editModalOpened: boolean,
  deleteModalOpened: boolean,
  editOfferProcessing: boolean,
  deletingOffer: boolean,
};

export class Planning extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editModalOpened: false,
      deleteModalOpened: false,
      editOfferProcessing: false,
      deletingOffer: false,
      selectedOffer: null,
      date: Moment()
        .set('hours', 0)
        .set('minutes', 0)
        .set('milliseconds', 0),
    };
  }

  openEditModal = () => {
    this.setState({ editModalOpened: true });
  };

  openDeleteModal = () => {
    this.setState({ deleteModalOpened: true });
  };

  onCancelModal = () => {
    this.setState({
      editOfferProcessing: false,
      editModalOpened: false,
      deleteModalOpened: false,
    });
  };

  onConfirmModal = async ({ offerId, data }) => {
    this.setState({ editOfferProcessing: true });
    try {
      const response = await api.offer.editLiveOffer({ offerId, data });
      if (response.status === 200) {
        this.props.fetchAllOffers();
        this.setState({
          editOfferProcessing: false,
          editModalOpened: false,
          selectedOffer: null,
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({ editOfferProcessing: false });
  };

  onDeleteConfirmModal = async (offerId: number) => {
    this.setState({ deletingOffer: true });
    try {
      const response = await api.offer.disableOffer(offerId);
      if (response.status === 200) {
        this.props.fetchAllOffers();
        this.setState({
          deletingOffer: false,
          deleteModalOpened: false,
          selectedOffer: null,
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({ deletingOffer: false });
  };

  onDateClick = (date: Object) => {
    this.setState({ date });
    this.setState({ selectedOffer: null });
  };

  onOfferSelected = (offer: Offer) => {
    this.setState({ selectedOffer: offer });
    this.props.fetchBookings(offer.id);
    this.props.fetchCompatiblePacks(offer.id);
  };

  renderNoOfferSelected = () => {
    const { t, classes } = this.props;
    return (
      <Typography variant="caption" className={classes.emptyOffer}>
        {t('calendar.pleaseSelectOffer')}
      </Typography>
    );
  };

  renderEditModal = () => {
    const {
      coaches,
      coachesLoading,
      establishments,
      establishmentsLoading,
      compatiblePacks,
    } = this.props;
    const { selectedOffer, editModalOpened, editOfferProcessing } = this.state;

    if (selectedOffer) {
      return (
        <SimpleModal open={editModalOpened}>
          <EditLiveOfferForm
            offer={selectedOffer}
            coaches={coaches}
            establishments={establishments}
            loading={coachesLoading || establishmentsLoading}
            onConfirm={this.onConfirmModal}
            onCancel={this.onCancelModal}
            processing={editOfferProcessing}
            compatiblePacks={compatiblePacks}
          />
        </SimpleModal>
      );
    }
    return null;
  };

  renderDeleteModal = () => {
    const { selectedOffer, deleteModalOpened, deletingOffer } = this.state;

    if (selectedOffer) {
      return (
        <SimpleModal open={deleteModalOpened}>
          <DeleteOfferForm
            offer={selectedOffer}
            onConfirm={() => this.onDeleteConfirmModal(selectedOffer.id)}
            onCancel={this.onCancelModal}
            processing={deletingOffer}
          />
        </SimpleModal>
      );
    }
    return null;
  };

  render() {
    const {
      offers,
      classes,
      bookings,
      bookingOptions,
      bookingLoading,
      discardOption,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
      activities,
      timetableLoading,
      establishments,
      establishmentsLoading,
      coaches,
      coachesLoading,
      compatiblePacks,
      compatiblePacksLoading,
    } = this.props;
    const { date, selectedOffer } = this.state;

    const events = {};
    offers.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events[midnight]) {
        events[midnight] = [];
      }
      events[midnight].push(o);
    });

    const bookingUpdaters = {
      discardBooking,
      confirmBooking,
      discardBookingAttendance,
      confirmBookingAttendance,
    };

    return (
      <Grid container spacing={24} className={classes.container}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <Grid container direction="column">
              <Grid item xs={12}>
                <div className={classes.calendarContainer}>
                  <Calendar events={events} onDateClick={this.onDateClick} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <TimeTable
                  date={date}
                  onOfferSelected={this.onOfferSelected}
                  offers={offers}
                  activities={activities}
                  loading={timetableLoading}
                  selected={
                    this.state.selectedOffer
                      ? this.state.selectedOffer.id
                      : null
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {selectedOffer ? (
          <Grid item xs={12} lg={6}>
            <OfferCard
              offer={selectedOffer}
              bookings={bookings}
              bookingOptions={bookingOptions}
              bookingLoading={bookingLoading}
              bookingUpdaters={bookingUpdaters}
              discardOption={discardOption}
              establishments={establishments}
              coaches={coaches}
              coachesLoading={coachesLoading}
              establishmentsLoading={establishmentsLoading}
              onEditButtonClick={this.openEditModal}
              onDeleteButtonClick={this.openDeleteModal}
              compatiblePacks={compatiblePacks}
              compatiblePacksLoading={compatiblePacksLoading}
            />
          </Grid>
        ) : (
          this.renderNoOfferSelected()
        )}
        {this.renderEditModal()}
        {this.renderDeleteModal()}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
    compatiblePacks: state.offer.compatiblePacks,
    compatiblePacksLoading: state.offer.compatiblePacksLoading,
    timetableLoading: state.activity.loading,
    activities: state.activity.all,
    bookingLoading: state.booking.loading,
    bookings: state.booking.all,
    bookingOptions: state.booking.options,
    coaches: state.coach.companyAssociated,
    coachesLoading: state.coach.loading,
    establishments: state.establishment.all,
    establishmentsLoading: state.establishment.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCompatiblePacks(offerId) {
      dispatch(offerActions.fetchCompatiblePacks(offerId));
    },
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
    confirmBookingAttendance(bookingId) {
      dispatch(bookingActions.confirmBookingAttendance(bookingId));
    },
    discardBookingAttendance(bookingId) {
      dispatch(bookingActions.discardBookingAttendance(bookingId));
    },
    confirmBooking(bookingId) {
      dispatch(bookingActions.confirmBooking(bookingId));
    },
    discardBooking(bookingId) {
      dispatch(bookingActions.discardBooking(bookingId));
    },
    discardOption(optionId) {
      dispatch(bookingActions.discardBookingOption(optionId));
    },
  };
}

export default translate()(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(withStyles(styles)(Planning)),
  ),
);
