// @flow

import React, { Component } from 'react';

import {
  Modal,
  Divider,
  Paper,
  Button,
  Grid,
  List,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
  withStyles,
} from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push as pushRouter } from 'react-router-redux';

import RedButton from '../../../components/button/RedButton.component';
import { consumer as consumerActions } from '../../../actions';
import type { Booking, BookingOption } from '../../../api/types';

import ActivityDetailModal from './ActivityDetailModal.component';
import BookingListItem from './BookingListItem.component';
import BookingOptionListItem from './BookingOptionListItem.component';

type Props = {
  classes: Object,
  fullScreen: boolean,
  loadingBooking: boolean,
  loadingOption: boolean,

  profile: Profile,

  futureBookings: Array<Booking>,
  pastBookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  optionCurrentlyCancelling: ?number,

  discardBooking: (id: number) => void,
  cancelBookingOption: (id: number) => void,
  pushToMarketplace: (name: string) => void,
  t: (x: string) => string,
};

type State = {
  modalCancellingBookingOptionOpen: boolean,
  requestRedirect: ?string,
  optionIdBeingCancelled: ?number,
};

export class MyBookings extends Component<Props, State> {
  state = {
    modalCancellingBookingOptionOpen: false,
    requestRedirect: null,
    optionIdBeingCancelled: null,
    offer: null,
  };

  renderFutureBookingsContainer = () => {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="h6">
          {t('consumer.booking.myFutureBookings')}
        </Typography>
        <Paper>{this.renderFutureBookingsList()}</Paper>
      </div>
    );
  };

  renderFutureBookingsList = () => {
    const { t, classes, futureBookings, loadingBooking } = this.props;
    if (loadingBooking) {
      return <CircularProgress className={classes.loadingIndicator} />;
    }
    if (futureBookings.length === 0) {
      return (
        <Typography variant="caption" className={classes.emptyMsg}>
          {t('consumer.booking.noBookingOptions')}
        </Typography>
      );
    }
    return (
      <List disablePadding>
        {futureBookings.map((b) => (
          <BookingListItem
            onDiscard={() => this.prepareDiscardBooking(b)}
            booking={b}
            key={b.id}
            overrideClickAction={() =>
              this.setState({
                offer: b.offer,
              })
            }
          />
        ))}
      </List>
    );
  };

  prepareDiscardBooking = (booking) => {
    this.setState({ bookingToDiscard: booking });
  };

  performDiscard = () => {
    const { bookingToDiscard } = this.state;
    this.props.discardBooking(bookingToDiscard.id);
    this.setState({ bookingToDiscard: null });
  };

  handleCloseModal = () => {
    this.setState({ modalCancellingBookingOptionOpen: false });
  };

  getModalConfirmCancellingBookingOption = () => {
    const { classes, t, cancelBookingOption } = this.props;
    const {
      optionIdBeingCancelled,
      modalCancellingBookingOptionOpen,
    } = this.state;

    return (
      <Modal
        aria-labelledby="cancel-booking-option"
        open={modalCancellingBookingOptionOpen}
        onClose={this.handleCloseModal}
        className={classes.modalContainer}
      >
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          spacing={32}
          className={classes.modal}
        >
          <Grid item>
            <Typography variant="h6">
              {t('consumer.help.areYouSureCancelBookingOption')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              {t('consumer.help.explainCancelBookingOption')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              spacing={16}
              alignItems="center"
              justify="flex-end"
            >
              <Grid item>
                <Button
                  color="primary"
                  onClick={() => {
                    cancelBookingOption(optionIdBeingCancelled);
                    this.handleCloseModal();
                  }}
                >
                  {t('common.confirm')}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={this.handleCloseModal}>
                  {t('common.cancel')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    );
  };

  cancelBookingOption = (optionId: number) => {
    this.setState({
      optionIdBeingCancelled: optionId,
      modalCancellingBookingOptionOpen: true,
    });
    this.props.cancelBookingOption(optionId);
  };

  confirmBookingOption = (offerId: number, optionId: number) => {
    this.setState({
      requestRedirect: `/payment/offer/${offerId}?option_id=${optionId}`,
    });
  };

  renderBookingOptions = () => {
    const { t, classes, bookingOptions } = this.props;
    if (bookingOptions.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography className={classes.title} variant="h6">
          {t('consumer.booking.myOptions')}
        </Typography>
        {this.renderBookingOptionsList()}
      </div>
    );
  };

  renderBookingOptionsList = () => {
    const {
      classes,
      loadingOption,
      bookingOptions,
      optionCurrentlyCancelling,
    } = this.props;

    if (loadingOption) {
      return <CircularProgress className={classes.loadingIndicator} />;
    }
    return (
      <List>
        {bookingOptions.map((o) => (
          <div className={classes.bookingOptionElement} key={o.id}>
            <BookingOptionListItem
              confirmBookingOption={
                // prettier-ignore
                () => this.confirmBookingOption(o.offer.id, o.id)
              }
              bookingOption={o}
              cancelBookingOption={() => this.cancelBookingOption(o.id)}
              loading={o.id === optionCurrentlyCancelling}
            />
            <Divider />
          </div>
        ))}
      </List>
    );
  };

  renderPastBookingsContainer = () => {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="h6">
          {t('consumer.booking.myPastBookings')}
        </Typography>
        <Paper>{this.renderPastBookingsList()}</Paper>
      </div>
    );
  };

  renderPastBookingsList = () => {
    const { t, classes, loadingBooking, pastBookings } = this.props;
    if (loadingBooking) {
      return <CircularProgress className={classes.loadingIndicator} />;
    }
    if (pastBookings.length === 0) {
      return (
        <Typography variant="caption" className={classes.emptyMsg}>
          {t('consumer.booking.noPastBookings')}
        </Typography>
      );
    }
    return (
      <List>
        {pastBookings.map((b) => (
          <BookingListItem
            booking={b}
            key={b.id}
            overrideClickAction={() =>
              this.setState({
                offer: b.offer,
              })
            }
          />
        ))}
      </List>
    );
  };

  renderMembershipButtons = () => {
    const { profile, pushToMarketplace, classes } = this.props;
    if (!profile) {
      return null;
    }
    return (
      <Grid container direction="row">
        {(profile.memberships || []).map((membership) => (
          <Grid item key={membership.id}>
            <Button
              className={classes.membershipButton}
              onClick={() => pushToMarketplace(membership.name)}
              variant="contained"
              color="primary"
            >
              <TodayIcon className={classes.leftIcon} />
              {membership.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  };

  getDialogCancelBooking = () => {
    const { bookingToDiscard } = this.state;
    const { t, fullScreen } = this.props;
    if (!bookingToDiscard) {
      return null;
    }
    return (
      <Dialog
        open={!!bookingToDiscard}
        fullScreen={fullScreen}
        onClose={() => this.setState({ bookingToDiscard: null })}
      >
        <DialogTitle>{t('consumer.booking.discardBookingTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(bookingToDiscard || {}).is_discardable
              ? t('consumer.booking.discardPossibleExplain')
              : t('consumer.booking.discardImpossibleExplain')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            id={`booking-cancel-cancel-${bookingToDiscard.id}`}
            onClick={() => this.setState({ bookingToDiscard: null })}
          >
            {t('common.cancel')}
          </Button>
          <RedButton
            onClick={this.performDiscard}
            id={`booking-cancel-confirm-${bookingToDiscard.id}`}
          >
            {t('common.delete')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  };

  onCloseOfferDialog = () => {
    this.setState({ offer: null });
  };

  render() {
    const { requestRedirect } = this.state;
    const { classes } = this.props;
    if (requestRedirect) {
      return <Redirect to={requestRedirect} />;
    }
    return (
      <div className={classes.container}>
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12}>
            {this.renderMembershipButtons()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.state.offer ? (
              <ActivityDetailModal
                onClose={this.onCloseOfferDialog}
                offer={this.state.offer}
              />
            ) : null}
            {this.renderFutureBookingsContainer()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.renderBookingOptions()}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.renderPastBookingsContainer()}
          </Grid>
        </Grid>
        {this.getModalConfirmCancellingBookingOption()}
        {this.getDialogCancelBooking()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.consumer.profile,
    bookingOptions: state.consumer.bookingOptions,
    futureBookings: state.consumer.futureBookings,
    pastBookings: state.consumer.pastBookings,
    loadingBooking: state.consumer.bookingsLoading,
    loadingOption: state.consumer.optionsLoading,
    optionCurrentlyCancelling: state.consumer.optionCurrentlyCancelling,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelBookingOption(optionId) {
      dispatch(consumerActions.cancelBookingOption(optionId));
    },
    pushToMarketplace(name) {
      dispatch(pushRouter(`/m/${name}`));
    },
    discardBooking(bookingId) {
      dispatch(consumerActions.discardBooking(bookingId));
    },
  };
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  loadingIndicator: {
    margin: theme.spacing.unit * 2,
  },
  title: {
    padding: theme.spacing.unit * 2,
  },
  emptyMsg: {
    padding: theme.spacing.unit * 2,
  },
  loadingContainer: {
    margin: theme.spacing.unit * 3,
  },
  bookingOptionElement: {
    padding: theme.spacing.unit,
  },
  modalContainer: {
    top: '30%',
    left: '30%',
  },
  membershipButton: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  modal: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

export default withMobileDialog()(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(withNamespaces()(MyBookings)),
  ),
);
