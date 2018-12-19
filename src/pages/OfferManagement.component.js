// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Collapse,
  Grid,
  Paper,
  Divider,
  Button,
  Typography,
  IconButton,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TodayIcon from '@material-ui/icons/Today';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as routerPush, goBack } from 'react-router-redux';

import Fuse from 'fuse.js';
import memoize from 'memoize-one';

import {
  booking as bookingActions,
  search as searchActions,
  invoice as invoiceActions,
  offer as offerActions,
  member as memberActions,
} from '../actions';
import BookingTable from '../components/booking/BookingTable.container';
import SearchBar from '../components/SearchBar.component';
import ResultList from '../components/search/ResultList.component';
import MemberBookingHelper from '../components/search/MemberBookingHelper.component';
import MemberForm from '../components/form/MemberForm.component';
import QuickInvoice from '../components/invoice/QuickInvoice.component';
import { createOrUpdateMember } from '../actions/member.actions';
import RegisterMemberToOfferForm from '../components/form/RegisterMemberToOfferForm.component';
import { formatAsDatetime } from '../datetime';
import RedButton from '../components/button/RedButton.component';
import { mapFormData } from './form.utils';

type Props = {
  offerId: number,
  update: Offer,
  clearSearch: () => void,
  searchedText: string,
  offer: ?Offer,
  bookingLoading: ?boolean,
  bookingUpdaters: Object,
  memberCreationErrors: boolean,
  memberCreationPending: boolean,
  compatiblePacksLoading: boolean,

  bookingOptions: Array<BookingOption>,
  activities: Array<Activity>,
  bookings: Array<Booking>,
  members: Array<Member>,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  offers: Array<Event>,
  compatiblePacks: Array<PaymentPack>,

  fetchBookings: (offerId: number) => void,
  fetchCompatiblePacks: (offerId: number) => void,
  createOrUpdateMember: (data: [*]) => void,
  createInvoice: ([*], number) => void,
  addToOffer: ({
    offerId: number,
    consumerPaymentPackId: number,
    memberId: number,
  }) => void,
  discardOption: (id: number) => void,
  deleteBooking: (bookingId: number, memberId: number) => void,
  quickFetchMember: (memberId: number) => void,

  goBack: () => void,
  push: (path: string) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  quickInvoices: [*],
  addMemberModal: boolean,
  memberToRegister: ?Member,
};
export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    memberToRegister: null,
  };

  componentWillMount() {
    this.props.fetchCompatiblePacks(this.props.offerId);
  }

  closeQuickInvoice = (memberId) => {
    this.setState((prevState) => ({
      quickInvoices: prevState.quickInvoices.filter(
        (qi) => qi.member.id !== memberId,
      ),
    }));
  };

  registerMember = (consumerPaymentPackId: number) => {
    const { memberToRegister } = this.state;
    this.props.addToOffer({
      offerId: this.props.offerId,
      consumerPaymentPackId,
      memberId: memberToRegister.id,
    });
    this.props.clearSearch();
    this.setState({ memberToRegister: null });
  };

  createInvoice = (invoiceData, memberId) => {
    this.props.createInvoice(invoiceData, memberId);
    this.closeQuickInvoice(memberId);
    setTimeout(() => {
      this.props.fetchBookings(this.props.offerId);
    }, 5000);
  };

  createMember = async (data: *) => {
    const formData = mapFormData(data, {
      lastname: 'last_name',
      firstname: 'first_name',
      email: 'email',
      phone: 'phone.phone_number',
      gender: 'gender',
      avatar: 'photo',
      birthdayYear: 'birthday',
      membership_ID: 'membership_ID',
      accept_email: 'accept_email',
      accept_sms: 'accept_sms',
      date_joined: 'date_joined',
    });

    if (this.props.update) {
      formData.append('id', this.props.update.id);
    }

    this.props.createOrUpdateMember(formData);
    this.setState({ addMemberModal: false });
  };

  openAddMemberModal = () => {
    this.setState({ addMemberModal: true });
    this.props.clearSearch();
  };

  closeAddMemberModal = () => {
    this.setState({ addMemberModal: false });
  };

  componentDidMount() {
    this.props.fetchBookings(this.props.offerId);
    this.props.clearSearch();
  }

  getFuse = memoize((items) => {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      keys: ['name', 'email'],
    };
    return new Fuse(items, options);
  });

  getResults = () =>
    this.getFuse(this.props.members)
      .search(this.props.searchedText)
      .slice(0, 8);

  renderSearchedMember = (member: Member) => {
    const hasBooked = Boolean(
      this.props.bookings.find((b) => b.member === member.id),
    );
    if (hasBooked) {
      return (
        <MemberBookingHelper
          key={member.id}
          onClick={() => this.addToQuickInvoicePanel(member.id)}
          onClickListItem={() => this.props.push(`/member/${member.id}`)}
          member={member}
          hasBooked
        />
      );
    }
    return (
      <MemberBookingHelper
        key={member.id}
        onClick={() => this.setState({ memberToRegister: member })}
        onClickListItem={() => this.props.push(`/member/${member.id}`)}
        member={member}
        hasBooked={false}
      />
    );
  };

  addToQuickInvoicePanel = (memberId: number) => {
    const { bookings, offer } = this.props;
    const { quickInvoices } = this.state;
    const isOpened = quickInvoices.find((qi) => qi.member.id === memberId);
    const selectedMember = this.props.members.find((m) => m.id === memberId);

    const quickInvoiceToAdd = bookings.find((b) => b.member === memberId)
      ? {
          member: selectedMember,
          invoiceItems: { offers: [] },
        }
      : {
          member: selectedMember,
          invoiceItems: { offers: [offer] },
        };

    if (!isOpened) {
      this.setState((prevState) => ({
        quickInvoices: [...prevState.quickInvoices, quickInvoiceToAdd],
      }));
    }
    this.props.clearSearch();
  };

  renderBookingHeader = () => {
    const { classes, t } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={16}
        className={classes.bookingsHeader}
      >
        <Grid item>
          <Typography variant="title">{t('offer.myBookings')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" alignItems="center" spacing={16}>
            <Grid item>
              <IconButton onClick={this.openAddMemberModal} color="primary">
                <AddCircleIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <SearchBar changeLocation={false} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderQuickInvoicePanel = () => {
    const { classes, t } = this.props;
    const { quickInvoices } = this.state;
    return (
      <Paper>
        <Typography className={classes.bookingsHeader} variant="title">
          {t('offer.myOpenedInvoices')}
        </Typography>
        <Divider />
        {quickInvoices.length ? (
          <div>
            {quickInvoices.map((qi) => (
              <QuickInvoice
                key={qi.member.id}
                quickInvoice={qi}
                onClose={() => this.closeQuickInvoice(qi.member.id)}
                onSubmit={this.saveQuickInvoice}
                paymentPacks={this.props.paymentPacks}
                shopItems={this.props.shopItems}
                offers={this.props.offers}
                activities={this.props.activities}
                createInvoice={(invoiceData) =>
                  this.createInvoice(invoiceData, qi.member.id)
                }
              />
            ))}
          </div>
        ) : (
          <Typography variant="caption" className={classes.emptyTextContainer}>
            {t('offer.noQuickInvoiceOpened')}
          </Typography>
        )}
      </Paper>
    );
  };

  closeRevertBookingDialog = () => {
    this.setState({ bookingToRevert: null });
  };

  handleBookingRevert = (booking: Booking) => {
    this.setState({ bookingToRevert: booking });
  };

  handleBookingDeletion = (bookingId: number, memberId: number) => {
    this.props.deleteBooking(bookingId, memberId);
    this.closeRevertBookingDialog();
  };

  renderRevertBookingDialog = () => {
    const { t } = this.props;
    const { bookingToRevert } = this.state;
    if (!bookingToRevert) {
      return null;
    }
    if (bookingToRevert.payment_pack) {
      return (
        <Dialog
          open={!!this.state.bookingToRevert}
          onClose={this.closeRevertBookingDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('booking.revertBookingTitle')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('booking.revertBookingExplain')(bookingToRevert.user.name)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeRevertBookingDialog} color="secondary">
              {t('common.cancel')}
            </Button>
            <RedButton
              onClick={() =>
                this.handleBookingDeletion(
                  bookingToRevert.id,
                  bookingToRevert.member,
                )
              }
              color="primary"
              autoFocus
            >
              {t('common.confirm')}
            </RedButton>
          </DialogActions>
        </Dialog>
      );
    }
    return (
      <Dialog
        open={!!this.state.bookingToRevert}
        onClose={this.closeRevertBookingDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('booking.revertBookingTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('booking.revertBookingWithInvoiceImpossibleExplain')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeRevertBookingDialog} color="secondary">
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const {
      offer,
      bookings,
      bookingLoading,
      bookingOptions,
      discardOption,
      bookingUpdaters,
      searchedText,
      t,
      classes,
    } = this.props;

    const { memberToRegister } = this.state;

    if (!offer) {
      return <CircularProgress />;
    }

    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.titleBanner}
          >
            <Grid item>
              <Typography variant="h3">
                {offer.name} - {formatAsDatetime(offer.date_start)}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={this.props.goBack}
                color="secondary"
                variant="outlined"
              >
                <TodayIcon className={classes.leftIcon} />
                {t('offer.backToCalendar')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Grid container direction="column">
              <Grid item>{this.renderBookingHeader()}</Grid>
              <Divider />
              <Grid item>
                <Collapse in={searchedText}>
                  <div className={classes.resultListContainer}>
                    <ResultList
                      items={this.getResults()}
                      renderListComponent={this.renderSearchedMember}
                    />
                  </div>
                  <Divider />
                </Collapse>
              </Grid>
              <Grid item>
                <BookingTable
                  redirectToMember
                  loading={bookingLoading}
                  bookings={bookings}
                  bookingOptions={bookingOptions}
                  discardOption={discardOption}
                  bookingUpdaters={bookingUpdaters}
                  showQuickInvoiceButton
                  showRevertBookingButton
                  handleRevert={this.handleBookingRevert}
                  onQuickInvoiceClick={this.addToQuickInvoicePanel}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {this.renderQuickInvoicePanel()}
        </Grid>
        <Dialog
          onClose={() => this.setState({ memberToRegister: null })}
          open={!!memberToRegister}
        >
          <DialogContent>
            <RegisterMemberToOfferForm
              offer={offer}
              member={memberToRegister}
              open={!!memberToRegister}
              loading={this.props.compatiblePacksLoading}
              compatiblePacks={this.props.compatiblePacks}
              onCancel={() => this.setState({ memberToRegister: null })}
              subscribeToOffer={this.registerMember}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!this.state.addMemberModal}
          onClose={this.closeAddMemberModal}
        >
          <DialogContent>
            <MemberForm
              onCancel={this.closeAddMemberModal}
              onSubmit={this.createMember}
              error={this.props.memberCreationErrors}
              processing={this.props.memberCreationPending}
              initial={null}
              update={false}
            />
          </DialogContent>
        </Dialog>
        {this.renderRevertBookingDialog()}
      </Grid>
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const offerId = (match && match.params && +match.params.id) || null;

  return {
    offerId,
    offer: state.offer.offers.find((o) => o.id === offerId),
    offers: state.offer.calendar,
    activities: state.activity.all,
    paymentPacks: state.paymentPack.all,
    shopItems: state.shop.all,
    searchedText: state.search.text,
    members: state.member.all,
    bookings: state.booking.all,
    bookingLoading: state.booking.loading,
    bookingOptions: state.booking.options,
    memberCreationPending: state.member.createOrUpdatePending,
    memberCreationErrors: state.member.createOrUpdateErrors,
    compatiblePacks: state.offer.compatiblePacks.items,
    compatiblePacksLoading: state.offer.compatiblePacks.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearSearch() {
      dispatch(searchActions.clearSearch(false));
    },
    deleteBooking(bookingId, memberId) {
      dispatch(bookingActions.deleteBooking(bookingId, memberId));
    },
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
    bookingUpdaters: {
      discardBooking(bookingId) {
        dispatch(bookingActions.discardBooking(bookingId));
      },
      confirmBooking(bookingId) {
        dispatch(bookingActions.confirmBooking(bookingId));
      },
      discardBookingAttendance(bookingId) {
        dispatch(bookingActions.discardBookingAttendance(bookingId));
      },
      confirmBookingAttendance(bookingId) {
        dispatch(bookingActions.confirmBookingAttendance(bookingId));
      },
    },
    discardOption(optionId) {
      dispatch(bookingActions.discardBookingOption(optionId));
    },
    createOrUpdateMember(data) {
      dispatch(createOrUpdateMember(data, true));
    },
    createInvoice(invoiceData: InvoiceData, memberId: number) {
      dispatch(
        invoiceActions.createOrUpdateInvoice(invoiceData, true, memberId),
      );
    },
    goBack() {
      dispatch(goBack());
    },
    push(path) {
      dispatch(routerPush(path));
    },
    fetchCompatiblePacks(id: number) {
      dispatch(offerActions.fetchCompatiblePacks(id));
    },
    addToOffer({ offerId, consumerPaymentPackId, memberId }) {
      dispatch(
        bookingActions.addBooking({ offerId, consumerPaymentPackId, memberId }),
      );
    },
  };
}

const styles = (theme) => ({
  bookingsHeader: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  quickInvoiceContainer: {},
  emptyTextContainer: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  titleBanner: {
    marginTop: theme.spacing.unit,
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(OfferManagement),
  ),
);
