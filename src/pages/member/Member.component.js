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
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import TodayIcon from '@material-ui/icons/Today';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CallIcon from '@material-ui/icons/Call';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';
import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';
import MemberNote from '../../components/member/MemberNote.component';

import {
  booking as bookingActions,
  member as memberActions,
  paymentPack as paymentPackActions,
} from '../../actions';
import { Avatar } from '../../components';
import BookingTable from '../../components/booking/BookingTable.container';
import ConsumerPackRowItem from '../../components/payment-pack/ConsumerPackRowItem.component';
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
  classes: Object,
  match: Object,
  paymentPacks: Array<PaymentPack>,

  fetchMember: (id: number) => void,
  fetchMemberBookings: (id: number) => void,
  confirmBooking: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  discardBooking: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  editMember: (id: number) => void,
  billMember: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  createOrUpdateNote: ({ id: ?number, text: string, memberId: number }) => void,
  deleteNote: ({ memberId: number, noteId: number }) => void,

  goBack: () => void,
  t: (x: string) => string,
};

type State = {
  newNote: Note,
};
export class Member extends Component<Props, State> {
  state = {
    newNote: null,
  };

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

  incrementCredit = (id) => {
    this.props.incrementCredit(id);
    this.props.fetchMember(this.memberId);
  };

  decrementCredit = (id) => {
    this.props.decrementCredit(id);
    this.props.fetchMember(this.memberId);
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
                <TodayIcon />
                <ListItemText
                  primary={`
              ${t('member.bornIn')} 
              ${
                member.consumer.birthday
                  ? Moment(member.consumer.birthday).year()
                  : '  NA  '
              }`}
                />
              </ListItem>
              <ListItem>
                <PersonOutlineIcon />
                <ListItemText primary={`N°${member.membership_ID}`} />
              </ListItem>
            </List>
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
                <ListItemSecondaryAction>
                  {member.accept_sms ? (
                    <NotificationActiveIcon />
                  ) : (
                    <NotificationOffIcon />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <EmailIcon />
                <ListItemText primary={member.consumer.email || ' - '} />
                <ListItemSecondaryAction>
                  {member.accept_email ? (
                    <NotificationActiveIcon />
                  ) : (
                    <NotificationOffIcon />
                  )}
                </ListItemSecondaryAction>
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
      confirmBooking,
      confirmBookingAttendance,
      discardBooking,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const bookingsPast = bookings.filter(
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

  renderPaymentPacks = () => {
    const { member, t, classes } = this.props;
    const packs = member.consumer_payment_packs;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingExpansionPanel}>
            {t('member.showPaymentPack')}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            {packs.map((consumerPack) => {
              const paymentPack = this.props.paymentPacks.find(
                (p) => p.id === +consumerPack.payment_pack_id,
              );
              return (
                <ConsumerPackRowItem
                  key={consumerPack.id}
                  hideConsumer
                  consumerPack={consumerPack}
                  paymentPack={paymentPack}
                  decrementCredit={() => this.decrementCredit(consumerPack.id)}
                  incrementCredit={() => this.incrementCredit(consumerPack.id)}
                />
              );
            })}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  handleNoteSubmit = (id: number, text: string) => {
    this.props.createOrUpdateNote({ id, text, memberId: this.memberId });
    if (id === null) {
      this.setState({ newNote: null });
    }
  };

  handleNoteDelete = (id: number) => {
    this.props.deleteNote({ noteId: id, memberId: this.memberId });
  };

  deleteNewNote = () => {
    this.setState({ newNote: null });
  };

  addNewNote = (event) => {
    event.preventDefault();
    if (this.state.newNote) {
      event.stopPropagation();
    }
    this.setState({
      newNote: {
        text: '',
      },
    });
  };

  renderNotes = () => {
    const { member, t, classes } = this.props;
    const { newNote } = this.state;
    const notes = member.notes || [];
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.headingExpansionPanel}>
                {`${t('member.showNotes')} (${notes.length})`}
              </Typography>
            </Grid>
            <Grid item>
              <Button onClick={this.addNewNote} color="primary">
                <AddIcon className={classes.iconLeft} />
                {t('common.add')}
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            {newNote ? (
              <div className={classes.noteContainer}>
                <MemberNote
                  editMode
                  autoFocus
                  onSubmit={(text) => this.handleNoteSubmit(null, text)}
                  onDelete={this.deleteNewNote}
                  note={newNote}
                />
              </div>
            ) : null}
            {notes.length ? (
              notes.map((note) => (
                <div className={classes.noteContainer} key={note.id}>
                  <MemberNote
                    onSubmit={(text) => this.handleNoteSubmit(note.id, text)}
                    onDelete={() => this.handleNoteDelete(note.id)}
                    note={note}
                    key={note.id}
                    date={note.date}
                  />
                </div>
              ))
            ) : (
              <Typography
                variant="caption"
                className={this.props.classes.emptyMessage}
              >
                {this.props.t('member.noNoteSaved')}
              </Typography>
            )}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  renderContent = () => {
    const { member, t, classes } = this.props;
    if (member.consumer) {
      return (
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12}>
            <Paper className={this.props.classes.paperContainer}>
              {this.getFirstRow()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="title"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.booking')}
            </Typography>
            {this.getFutureBookings()}
            {this.getPastBookings()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="title"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.paymentPack')}
            </Typography>
            {this.renderPaymentPacks()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="title"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.notes')}
            </Typography>
            {this.renderNotes()}
          </Grid>
        </Grid>
      );
    }
    return <CircularProgress />;
  };

  render() {
    const { memberLoading, t, classes } = this.props;
    return (
      <Grid container direciotn="column" spacing={16}>
        <Grid item xs={12}>
          {memberLoading ? <CircularProgress /> : this.renderContent()}
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={this.props.goBack}
            size="large"
            color="secondary"
            variant="outlined"
            className={classes.backButton}
          >
            {t('navigation.goBack')}
          </Button>
        </Grid>
      </Grid>
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
    paymentPacks: state.paymentPack.all,
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
      dispatch(routerPush('/member'));
    },
    incrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, -1));
    },
    createOrUpdateNote({ id, text, memberId }) {
      dispatch(memberActions.createOrUpdateNote(id, text, memberId));
    },
    deleteNote({ noteId, memberId }) {
      dispatch(memberActions.deleteNote({ noteId, memberId }));
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
  noteContainer: {
    padding: theme.spacing.unit * 2,
  },
  emptyMessage: {
    margin: theme.spacing.unit * 3,
  },
  expansionTitle: {
    marginBottom: theme.spacing.unit,
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
