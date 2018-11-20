// @flow

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withStyles, Button, Paper, Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { translate } from 'react-i18next';
import {
  push as pushRouter,
  replace as replaceRouter,
} from 'react-router-redux';

import {
  SimpleModal,
  EditLiveOfferForm,
  DeleteOfferForm,
  OfferCard,
  TimeTable,
  Calendar,
  OfferFormWithActivity,
} from '../components';
import {
  offer as offerActions,
  booking as bookingActions,
  activity as activityActions,
} from '../actions';
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
  calendarContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyOffer: {
    margin: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
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
  fetchAllActivities: () => void,
  offers: Array<Offer>,
  bookingLoading: boolean,
  bookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  timetableLoading: boolean,
  activities: Array<Object>,
  metaActivities: Array<MetaActivity>,
  coaches: Array<Coach>,
  coachesLoading: boolean,
  establishments: Array<Establishment>,
  establishmentsLoading: boolean,
  compatiblePacks: Array<PaymentPack>,
  compatiblePacksLoading: boolean,
  fetchOffersByDay: ({ year: number, month: number, day: number }) => void,
  events: Array<Event>,
  goToOfferManagement: () => void,
};

type State = {
  selectedOffer: ?Offer,
  date: Object,
  editModalOpened: boolean,
  deleteModalOpened: boolean,
  editOfferProcessing: boolean,
  deletingOffer: boolean,
  createOfferModalOpened: boolean,
  creatingOffers: boolean,
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
      createOfferModalOpened: false,
      creatingOffers: false,
    };
    const { match } = props;
    const day = (match && match.params && +match.params.date) || null;
    const year = (match && match.params && +match.params.year) || null;
    const month = (match && match.params && +match.params.month) || null;

    if (year && month && day) {
      const date = Moment(`${day}-${month}-${year}`, 'DD-MM-YYYY');
      this.state.date = date;
    } else {
      this.state.date = Moment();
    }
    props.fetchOffersByDay({
      year: this.state.date.year(),
      month: this.state.date.month() + 1,
      day: this.state.date.date(),
    });
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

  openCreateOfferModal = () => {
    this.setState({ createOfferModalOpened: true });
  };

  closeCreateOffersModal = () => {
    this.setState({ createOfferModalOpened: false });
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
    const momentDate = Moment(date);
    this.props.fetchOffersByDay({
      year: momentDate.year(),
      month: momentDate.month() + 1,
      day: momentDate.date(),
    });
    this.props.replaceRouter(
      `/calendar/${momentDate.year()}/${momentDate.month() +
        1}/${momentDate.date()}`,
    );
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

  renderCreateModal = () => {
    const { metaActivities, coaches, establishments } = this.props;
    const { createOfferModalOpened, creatingOffers } = this.state;

    return (
      <SimpleModal open={createOfferModalOpened}>
        <OfferFormWithActivity
          metaActivities={metaActivities}
          coaches={coaches}
          establishments={establishments}
          onSubmit={this.createOffers}
          onCancel={this.closeCreateOffersModal}
          processing={creatingOffers}
        />
      </SimpleModal>
    );
  };

  createOffers = async (metaActivityId: number, data: Object) => {
    this.setState({ creatingOffers: true });
    try {
      const response = await api.metaActivity.createOffers(
        metaActivityId,
        data,
      );
      if (response.status === 200) {
        this.setState({ creatingOffers: false });
        this.props.fetchAllOffers();
        this.props.fetchAllActivities();
        this.setState({ createOfferModalOpened: false });
        return;
      }
      this.setState({ creatingOffers: false });
    } catch (err) {
      this.setState({ creatingOffers: false });
    }
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
      events,
      classes,
      t,
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

    const events_ = {};
    events.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events_[midnight]) {
        events_[midnight] = [];
      }
      events_[midnight].push(o);
    });

    const bookingUpdaters = {
      discardBooking,
      confirmBooking,
      discardBookingAttendance,
      confirmBookingAttendance,
    };

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} lg={6}>
          <Grid container direction="column" spacing={32} alignItems="stretch">
            <Grid item>
              <Paper>
                <Grid container direction="column" alignItems="stretch">
                  <Grid item>
                    <div className={classes.calendarContainer}>
                      <Calendar
                        events={events_}
                        onDateClick={this.onDateClick}
                        date={this.state.date}
                      />
                    </div>
                  </Grid>
                  <Grid item>
                    <TimeTable
                      date={date}
                      onOfferSelected={this.onOfferSelected}
                      offers={offers.filter((o) =>
                        Moment(o.date_start).isSame(Moment(date), 'day'),
                      )}
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
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {selectedOffer ? (
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
              goToOfferManagement={this.props.goToOfferManagement}
            />
          ) : (
            this.renderNoOfferSelected()
          )}
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid item>
            <Grid container item justify="center">
              <Button
                variant="extendedFab"
                aria-label="Add"
                className={classes.button}
                color="primary"
                onClick={this.openCreateOfferModal}
              >
                <AddIcon className={classes.leftIcon} />
                {t('activity.addOffers')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {this.renderEditModal()}
        {this.renderDeleteModal()}
        {this.renderCreateModal()}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.offers,
    events: state.offer.calendar,
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
    metaActivities: state.metaActivity.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    replaceRouter(path) {
      dispatch(replaceRouter(path));
    },
    goToOfferManagement(offerId) {
      dispatch(pushRouter(`/offer/${offerId}`));
    },
    fetchCompatiblePacks(offerId) {
      dispatch(offerActions.fetchCompatiblePacks(offerId));
    },
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchAllActivities() {
      dispatch(activityActions.fetchActivities());
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
    fetchOffersByDay({ year, month, day }) {
      dispatch(offerActions.fetchOffersByDay({ year, month, day }));
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
