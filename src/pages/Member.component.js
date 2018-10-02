// @flow

import React, { Component } from 'react';

import {
  Grid,
  Typography,
  Paper,
  withStyles,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { booking as bookingActions, member as memberActions } from '../actions';
import { Avatar, BookingTable } from '../components';
import { formatAsDatetime } from '../datetime';
import type {
  MemberDetailed,
  Member as MemberSimplified,
  Booking,
  BookingOption,
} from '../api/types';
import { Moment } from '../i18n';

type Props = {
  loading: boolean,
  bookingLoading: boolean,
  member: MemberDetailed,
  allMembers: Array<MemberSimplified>,
  pendingBookings: Array<Booking>,
  validatedBookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  fetchMember: (id: number) => void,
  fetchMemberBookings: (id: number) => void,
  classes: Object,
  match: Object,
  confirmBooking: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  discardBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  t: (x: string) => string,
};
export class Member extends Component<Props> {
  memberId: number;

  componentWillMount() {
    this.memberId = parseInt(this.props.match.params.id, 10);
    this.props.fetchMember(this.memberId);
    this.props.fetchMemberBookings(this.memberId);
  }

  getFirstRow = () => {
    const { t, member, classes } = this.props;
    const { consumer } = member;
    // ugly FIXME: because loading should never be set to true
    // if member=={}
    if (consumer) {
      return (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={24}
          className={classes.firstRow}
        >
          <Grid item>
            <Grid container direction="row" alignItems="center" spacing={16}>
              <Grid item>
                <Avatar user={consumer} variant="mediumNoname" noname />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  alignItems="flex-start"
                  justify="space-around"
                  spacing={8}
                >
                  <Grid item>
                    <Typography>
                      {consumer.first_name} {consumer.last_name}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {t('member.memberSince') + member.date_joined}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <List>
              <ListItem>
                <IconButton>
                  <CallIcon />
                </IconButton>
                <ListItemText
                  primary={
                    // prettier-ignore
                    (member.consumer.phonenumber || { phone_number: ' - ' }).phone_number
                  }
                />
              </ListItem>
              <ListItem>
                <IconButton>
                  <EmailIcon />
                </IconButton>
                <ListItemText primary={member.consumer.email || ' - '} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      );
    }
    return null;
  };

  getFutureBookings = () => {
    const {
      t,
      classes,
      allMembers,
      validatedBookings,
      pendingBookings,
      bookingOptions,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const validatedBookingsFuture = validatedBookings.filter(
      (b) => Moment(b.date_start).isAfter(Moment()),
    );
    // prettier-ignore
    const pendingBookingsFuture = pendingBookings.filter(
      (b) => Moment(b.date_start).isAfter(Moment()),
    );
    // prettier-ignore
    const bookingOptionsFuture = bookingOptions.filter(
      (b) => Moment(b.date_start).isAfter(Moment()),
    );
    const nextBookingDate = (
      allMembers.filter((m) => m.id === this.memberId)[0] || {}
    ).next_booking;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.headingExpansionPanel}>
                {t('member.showNextBooking')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.secondaryHeadingExpansionPanel}>
                {nextBookingDate
                  ? `${t('booking.next')} ${formatAsDatetime(nextBookingDate)}`
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <BookingTable
            heading="date_start"
            validatedBookings={validatedBookingsFuture}
            pendingBookings={pendingBookingsFuture}
            bookingOptions={bookingOptionsFuture}
            bookingUpdaters={{
              discardBooking,
              confirmBooking,
              discardBookingAttendance,
              confirmBookingAttendance,
            }}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  getPastBookings = () => {
    const {
      t,
      classes,
      allMembers,
      validatedBookings,
      pendingBookings,
      bookingOptions,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const validatedBookingsPast = validatedBookings.filter(
      (b) => Moment(b.date_start).isBefore(Moment()),
    );
    // prettier-ignore
    const pendingBookingsPast = pendingBookings.filter(
      (b) => Moment(b.date_start).isBefore(Moment()),
    );
    // prettier-ignore
    const bookingOptionsPast = bookingOptions.filter(
      (b) => Moment(b.date_start).isBefore(Moment()),
    );
    const previousBookingDate = (
      allMembers.filter((m) => m.id === this.memberId)[0] || {}
    ).previous_booking;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.headingExpansionPanel}>
                {t('member.showPreviousBooking')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.secondaryHeadingExpansionPanel}>
                {previousBookingDate
                  ? `${t('booking.last')} ${formatAsDatetime(
                      previousBookingDate,
                    )}`
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <BookingTable
            heading="date_start"
            validatedBookings={validatedBookingsPast}
            pendingBookings={pendingBookingsPast}
            bookingOptions={bookingOptionsPast}
            bookingUpdaters={{
              discardBooking,
              confirmBooking,
              discardBookingAttendance,
              confirmBookingAttendance,
            }}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  /*
  getBookingsGraph = () => (
    <MemberBookingGraph
      bookings={this.props.member.previous_bookings}
      graphId="memberBookingsGraph"
    />
  );
  */

  renderContent = () => {
    if (this.props.member.consumer) {
      return (
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12}>
            <Paper className={this.props.classes.paperContainer}>
              {this.getFirstRow()}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.getFutureBookings()}
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.getPastBookings()}
          </Grid>
        </Grid>
      );
    }
    return <CircularProgress />;
  };

  render() {
    const { loading, bookingLoading, t, classes } = this.props;
    const stillLoading = loading && bookingLoading;
    return (
      <div>
        <div>
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <Button size="large" color="primary" className={classes.backButton}>
              {t('navigation.goBack')}
            </Button>
          </Link>
        </div>
        <div>{stillLoading ? <CircularProgress /> : this.renderContent()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.member.loading,
    member: state.member.member,
    allMembers: state.member.all,
    bookingLoading: state.booking.loading,
    validatedBookings: state.booking.validated,
    pendingBookings: state.booking.pending,
    bookingOptions: state.booking.options,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchMember(memberId) {
      dispatch(memberActions.fetchMember(memberId));
    },
    fetchMemberBookings(memberId) {
      dispatch(bookingActions.fetchBookingsByMember(memberId));
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
  };
}

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
  root: {},
  firstRow: {
    padding: theme.spacing.unit * 2,
  },
  headingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeadingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(Member)),
);
