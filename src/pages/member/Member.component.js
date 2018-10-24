// @flow

import React, { Component } from 'react';

import {
  Divider,
  Grid,
  Typography,
  Paper,
  withStyles,
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
import EditIcon from '@material-ui/icons/Edit';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { goBack as routerBack, push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';

import {
  booking as bookingActions,
  member as memberActions,
} from '../../actions';
import { Avatar, BookingTable } from '../../components';
import { formatAsDatetime } from '../../datetime';
import type {
  MemberDetailed,
  Member as MemberSimplified,
  Booking,
  BookingOption,
} from '../../api/types';
import { Moment } from '../../i18n';

type Props = {
  memberLoading: boolean,
  bookingLoading: boolean,
  member: MemberDetailed,
  allMembers: Array<MemberSimplified>,
  bookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  fetchMember: (id: number) => void,
  fetchMemberBookings: (id: number) => void,
  classes: Object,
  match: Object,
  confirmBooking: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  discardBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  editMember: (id: number) => void,
  billMember: (id: number) => void,
  goBack: () => void,
  t: (x: string) => string,
};
export class Member extends Component<Props> {
  memberId: number;

  componentWillMount() {
    this.memberId = parseInt(this.props.match.params.id, 10);
    this.props.fetchMember(this.memberId);
    this.props.fetchMemberBookings(this.memberId);
  }

  billMember = () => {
    this.props.billMember(this.memberId);
  };

  editMember = () => {
    this.props.editMember(this.memberId);
  };

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
                <Grid container direction="column" spacing={24}>
                  <Grid
                    container
                    direction="row"
                    spacing={16}
                    alignItems="center"
                  >
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
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      justify="flex-start"
                      spacing={16}
                    >
                      <Grid item>
                        <Button onClick={this.billMember}>
                          <AttachMoneyIcon
                            className={classes.leftIcon}
                            color="primary"
                          />
                          {t('payment.toBill')}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button onClick={this.editMember}>
                          <EditIcon
                            className={classes.leftIcon}
                            color="primary"
                          />
                          {t('common.edit')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <List dense>
              <ListItem>
                <CallIcon />
                <ListItemText
                  primary={
                    // prettier-ignore
                    (member.consumer.phonenumber || { phone_number: ' - ' }).phone_number
                  }
                />
              </ListItem>
              <ListItem>
                <EmailIcon />
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
      bookings,
      bookingLoading,
      bookingOptions,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const bookingsFuture = bookings.filter(
      (b) => Moment(b.date_start).isAfter(Moment()),
    );
    // prettier-ignore
    const bookingOptionsFuture = bookingOptions.filter(
      (b) => Moment(b.offer.date_start).isAfter(Moment()),
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
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            <BookingTable
              heading="date_start"
              loading={bookingLoading}
              bookings={bookingsFuture}
              bookingOptions={bookingOptionsFuture}
              bookingUpdaters={{
                discardBooking,
                confirmBooking,
                discardBookingAttendance,
                confirmBookingAttendance,
              }}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  getPastBookings = () => {
    const {
      t,
      classes,
      allMembers,
      bookings,
      bookingLoading,
      bookingOptions,
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const bookingsPast = bookings.filter(
      (b) => Moment(b.date_start).isBefore(Moment()),
    );
    // prettier-ignore
    const bookingOptionsPast = bookingOptions.filter(
      (b) => Moment(b.offer.date_start).isBefore(Moment()),
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
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            <BookingTable
              heading="date_start"
              loading={bookingLoading}
              bookings={bookingsPast}
              bookingOptions={[]}
              bookingUpdaters={{
                discardBooking,
                confirmBooking,
                discardBookingAttendance,
                confirmBookingAttendance,
              }}
            />
          </div>
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
    const { memberLoading, bookingLoading, t, classes } = this.props;
    return (
      <div>
        <div>
          <Button
            onClick={this.props.onBack}
            size="large"
            color="primary"
            className={classes.backButton}
          >
            {t('navigation.goBack')}
          </Button>
        </div>
        <div>{memberLoading ? <CircularProgress /> : this.renderContent()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    memberLoading: state.member.loading,
    member: state.member.member,
    allMembers: state.member.all,
    bookingLoading: state.booking.loading,
    bookings: state.booking.all,
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
    billMember(id) {
      dispatch(routerPush(`/member/add-invoice/${id}`));
    },
    editMember(id) {
      dispatch(routerPush(`/member/edit/${id}`));
    },
    goBack() {
      dispatch(routerBack());
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
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(Member),
  ),
);
