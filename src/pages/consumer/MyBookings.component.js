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
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { BookingListItem, BookingOptionListItem } from '../../components';
import { consumer as consumerActions } from '../../actions';
import { Booking, BookingOption } from '../../api/types';

type Props = {
  classes: Object,
  loadingBooking: boolean,
  loadingOption: boolean,
  futureBookings: Array<Booking>,
  pastBookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  optionCurrentlyCancelling: ?number,
  cancelBookingOption: (id: number) => void,
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
  };

  renderLoading = () => {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        className={classes.loadingContainer}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  };

  renderFutureBookings = () => {
    const { t, classes, futureBookings, loadingBooking } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('consumer.booking.myFutureBookings')}
        </Typography>
        <Paper>
          {futureBookings.length ? (
            <List>
              {futureBookings.map((b) => (
                <BookingListItem booking={b} key={b.id} />
              ))}
            </List>
          ) : (
            <Typography variant="caption" className={classes.emptyMsg}>
              {t('consumer.booking.noBookingOptions')}
            </Typography>
          )}
        </Paper>
      </div>
    );
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
            <Typography variant="title">
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
    const {
      t,
      classes,
      loadingOption,
      bookingOptions,
      optionCurrentlyCancelling,
    } = this.props;
    if (bookingOptions.length === 0) {
      return null;
    }
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('consumer.booking.myOptions')}
        </Typography>
        {bookingOptions.length ? (
          <List>
            {bookingOptions.map((o) => (
              <div className={classes.bookingOptionElement} key={o.id}>
                <BookingOptionListItem
                  confirmBookingOption={() =>
                    this.confirmBookingOption(o.offer.id, o.id)
                  }
                  bookingOption={o}
                  cancelBookingOption={() => this.cancelBookingOption(o.id)}
                  loading={o.id === optionCurrentlyCancelling}
                />
                <Divider />
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="caption" className={classes.emptyMsg}>
            {t('consumer.booking.noBookingOptions')}
          </Typography>
        )}
      </div>
    );
  };

  renderPastBookings = () => {
    const { t, classes, loadingBooking, pastBookings } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="title">
          {t('consumer.booking.myPastBookings')}
        </Typography>
        <Paper>
          {pastBookings.length ? (
            <List>
              {pastBookings.map((b) => (
                <BookingListItem booking={b} key={b.id} />
              ))}
            </List>
          ) : (
            <Typography variant="caption" className={classes.emptyMsg}>
              {t('consumer.booking.noPastBookings')}
            </Typography>
          )}
        </Paper>
      </div>
    );
  };

  render() {
    const { requestRedirect } = this.state;
    if (requestRedirect) {
      return <Redirect to={requestRedirect} />;
    }
    return (
      <div>
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12} lg={6}>
            {this.renderFutureBookings()}
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.renderBookingOptions()}
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.renderPastBookings()}
          </Grid>
        </Grid>
        {this.getModalConfirmCancellingBookingOption()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
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
  };
}

const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit * 2,
  },
  emptyMsg: {
    padding: theme.spacing.unit * 2,
  },
  loadingContainer: {
    margin: theme.spacing.unit * 3,
  },
  bookingOptionElement: {
    marginBottom: theme.spacing.unit,
  },
  modalContainer: {
    top: '30%',
    left: '30%',
  },
  modal: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(translate()(MyBookings)),
);
