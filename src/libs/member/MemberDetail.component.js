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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

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

import MemberNotePanel from './detail/MemberNotePanel.component';
import MemberSummaryCard from './detail/MemberSummaryCard.component';
import InvoiceList from './detail/InvoiceList.component';

type Props = {
  bookingLoading: boolean,
  memberId: number,

  member: MemberDetailed,
  invoices: Array<Invoice>,
  allMembers: Array<MemberSimplified>,
  bookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  paymentPacks: Array<PaymentPack>,

  onInvoiceClick: (uuid: string) => void,
  fetchMember: (id: number) => void,
  fetchMemberBookings: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  editMember: (id: number) => void,
  billMember: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  createOrUpdateNote: ({ id: ?number, text: string, memberId: number }) => void,
  deleteNote: ({ memberId: number, noteId: number }) => void,

  t: TFunction,
  classes: Object,
};

type State = {
  newNote: Note,
  noteExpanded: boolean,
};
export class Member extends Component<Props, State> {
  state = {
    newNote: null,
    noteExpanded: false,
  };

  billMember = () => {
    this.props.billMember(this.props.memberId);
  };

  editMember = () => {
    this.props.editMember(this.props.memberId);
  };

  incrementCredit = (id: number) => {
    this.props.incrementCredit(id);
    this.props.fetchMemberBookings(this.props.memberId);
    this.props.fetchMember(this.props.memberId);
  };

  decrementCredit = (id: number) => {
    this.props.decrementCredit(id);
    this.props.fetchMemberBookings(this.props.memberId);
    this.props.fetchMember(this.props.memberId);
  };

  getFutureBookings = () => {
    const {
      t,
      classes,
      allMembers,
      bookings,
      bookingLoading,
      bookingOptions,
      confirmBookingAttendance,
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
      allMembers.filter((m) => m.id === this.props.memberId)[0] || {}
    ).next_booking;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.headingExpansionPanel}>
                {`${t('member.showNextBooking')} (${bookingsFuture.length})`}
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
              bookingOptions={bookingOptionsFuture}
              bookings={bookingsFuture}
              discardBookingAttendance={discardBookingAttendance}
              confirmBookingAttendance={confirmBookingAttendance}
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
      confirmBookingAttendance,
      discardBookingAttendance,
    } = this.props;
    // prettier-ignore
    const bookingsPast = bookings.filter(
      (b) => Moment(b.date_start).isBefore(Moment()),
    );
    const previousBookingDate = (
      allMembers.filter((m) => m.id === this.props.memberId)[0] || {}
    ).previous_booking;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.headingExpansionPanel}>
                {`${t('member.showPreviousBooking')} (${bookingsPast.length})`}
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
              discardBookingAttendance={discardBookingAttendance}
              confirmBookingAttendance={confirmBookingAttendance}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  renderPaymentPacks = () => {
    const { member, t, classes } = this.props;
    const consumerPacks = member.consumer_payment_packs;
    const consumerAndPaymentPacks = consumerPacks.map((consumerPack) => {
      const paymentPack = this.props.paymentPacks.find(
        (p) => p.id === +consumerPack.payment_pack_id,
      );
      return [consumerPack, paymentPack];
    });
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingExpansionPanel}>
            {`${t('member.showPaymentPack')}} (${
              (consumerAndPaymentPacks || []).length
            })`}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            {consumerAndPaymentPacks.map(([consumerPack, paymentPack]) => (
              <ConsumerPackRowItem
                key={consumerPack.id}
                hideConsumer
                consumerPack={consumerPack}
                paymentPack={paymentPack}
                decrementCredit={() => this.decrementCredit(consumerPack.id)}
                incrementCredit={() => this.incrementCredit(consumerPack.id)}
              />
            ))}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  handleNoteSubmit = (id: number, text: string) => {
    this.props.createOrUpdateNote({ id, text, memberId: this.props.memberId });
    if (id === null) {
      this.setState({ newNote: null });
    }
  };

  handleNoteDelete = (id: number) => {
    this.props.deleteNote({ noteId: id, memberId: this.props.memberId });
  };

  deleteNewNote = () => {
    this.setState({ newNote: null });
  };

  addNewNote = (event) => {
    event.stopPropagation();
    this.setState({
      noteExpanded: true,
      newNote: {
        text: '',
      },
    });
  };

  renderNotePanel = () => {
    return (
      <MemberNotePanel
        newNote={this.state.newNote}
        member={this.props.member}
        addNewNote={this.addNewNote}
        expanded={this.state.noteExpanded}
        onChange={(_, noteExpanded) => {
          this.setState({ noteExpanded });
        }}
        deleteNewNote={this.deleteNewNote}
        handleNoteSubmit={this.handleNoteSubmit}
        handleNoteDelete={this.handleNoteDelete}
      />
    );
  };

  renderSummaryCard = () => (
    <MemberSummaryCard
      member={this.props.member}
      editMember={this.editMember}
      billMember={this.billMember}
    />
  );

  renderInvoices = () => {
    const { classes, t, invoices } = this.props;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingExpansionPanel}>
            {`${t('member.showInvoices')} (${invoices.length})`}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ padding: 0 }}>
          <div style={{ width: '100%' }}>
            <Divider />
            <InvoiceList
              invoices={invoices}
              onClick={this.props.onInvoiceClick}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  renderButtons = () => {
    const { classes, t, member } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          <Grid container direction="row" justify="flex-start" spacing={16}>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={this.billMember}
              >
                <AttachMoneyIcon className={classes.leftIcon} />
                {t('payment.toBill')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.editMember}
                color="secondary"
                variant="outlined"
              >
                <EditIcon className={classes.leftIcon} />
                {t('common.edit')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.accountBalance}>
          <Typography variant="subtitle2" inline>
            {t('payment.creditAccountBalance')}
          </Typography>
          <Typography
            inline
            variant="subtitle2"
            color={
              parseFloat(member.credit_account_balance) > 0
                ? 'primary'
                : 'error'
            }
          >
            {member.credit_account_balance} €
          </Typography>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { member, t, classes } = this.props;
    if (member.consumer) {
      return (
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12}>
            <Paper className={this.props.classes.paperContainer}>
              {this.renderSummaryCard()}
              {this.renderButtons()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
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
              variant="h6"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.paymentPack')}
            </Typography>
            {this.renderPaymentPacks()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.notes')}
            </Typography>
            {this.renderNotePanel()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              align="right"
              className={classes.expansionTitle}
            >
              {t('common.invoices')}
            </Typography>
            {this.renderInvoices()}
          </Grid>
        </Grid>
      );
    }
    return <CircularProgress />;
  }
}

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
  root: {},
  headingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeadingExpansionPanel: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expansionTitle: {
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  accountBalance: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 2,
    border: '2px solid #E8E8E8',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
)(Member);
