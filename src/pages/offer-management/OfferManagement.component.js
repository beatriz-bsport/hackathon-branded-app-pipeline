// @flow
import React, { Component } from 'react';

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
  DialogContent,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TodayIcon from '@material-ui/icons/Today';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Fuse from 'fuse.js';
import memoize from 'memoize-one';

import BookingTable from '../../components/booking/BookingTable.container';
import ResultList from '../../components/search/ResultList.component';
import MemberBookingHelper from './MemberBookingHelper.component';
import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import SearchMember from './SearchMember.component';
import RevertBookingDialog from './RevertBookingDialog.component';
import RegisterMemberToOfferForm from './RegisterMemberToOfferForm.component';

import MemberForm from '../../libs/member/MemberForm.component';

type Props = {
  offerId: number,
  update: Offer,
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
  unevenSavedInvoices: Array<Invoice>,

  fetchBookings: (offerId: number, refreshOnly: ?boolean) => void,
  fetchCompatiblePacks: (offerId: number) => void,
  createMember: (data: [*], options: *) => void,
  createInvoice: ([*], number) => void,
  resetQuickInvoices: () => void,
  createQuickUnevenInvoice: ({
    memberId: number,
    offerId: number,
    paymentPackId: number,
  }) => void,
  addToOffer: ({
    offerId: number,
    consumerPaymentPackId: number,
    memberId: number,
  }) => void,
  discardOption: (id: number) => void,
  deleteBooking: (bookingId: number, memberId: number) => void,

  goBack: () => void,
  push: (path: string) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  quickInvoices: [*], // put here non-saved invoice
  quickInvoiceEdit: [*], // put here invoice to edit
  addMemberModal: boolean,
  memberToRegister: ?Member,
  searchedText: string,
};
export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    memberToRegister: null,
    searchedText: '',
    loading: false,
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  closeQuickInvoice = (memberId) => {
    this.setState((prevState) => ({
      quickInvoices: prevState.quickInvoices.filter(
        (qi) => qi.member.id !== memberId,
      ),
    }));
  };

  registerMemberAndOpenUnevenInvoice = async (
    memberId: number,
    paymentPackId: number,
  ) => {
    this.setState({ loading: true });
    const offerId = this.props.offer.id;
    (async () => {
      this.props.createQuickUnevenInvoice({ memberId, paymentPackId, offerId });
      setTimeout(() => {
        this.props.fetchBookings(this.props.offerId, true);
        this.setState({ loading: false });
      }, 500);
    })();
    this.clearSearch();
    this.setState({ memberToRegister: null });
  };

  registerMember = async (consumerPaymentPackId: number) => {
    const { memberToRegister } = this.state;
    this.setState({ loading: true });
    this.props.addToOffer({
      offerId: this.props.offerId,
      consumerPaymentPackId,
      memberId: memberToRegister.id,
    });
    this.clearSearch();
    this.setState({ loading: false, memberToRegister: null });
  };

  createInvoice = (invoiceData, memberId, isQuickInvoice) => {
    this.props.createInvoice(invoiceData, memberId);
    if (!isQuickInvoice) {
      this.closeQuickInvoice(memberId);
      setTimeout(() => {
        this.props.fetchBookings(this.props.offerId, true);
      }, 500);
    }
  };

  createMember = (data: *, options) => {
    if (
      data.address_line_1 ||
      data.address_line_2 ||
      data.city ||
      data.zipcode ||
      data.country
    ) {
      if (
        !data.address_line_1 ||
        !data.city ||
        !data.zipcode ||
        !data.country
      ) {
        delete data.address_line_1;
        delete data.address_line_2;
        delete data.city;
        delete data.zipcode;
        delete data.country;
      }
    }
    const formData = mapFormData(data, MemberMap);
    this.props.createMember(formData, options);
    this.setState({ addMemberModal: false });
  };

  openAddMemberModal = () => {
    this.setState({ addMemberModal: true });
    this.clearSearch();
  };

  closeAddMemberModal = () => {
    this.setState({ addMemberModal: false });
  };

  async componentDidMount() {
    this.props.fetchBookings(this.props.offerId);
    this.props.fetchCompatiblePacks(this.props.offerId);
    this.props.fetchOfferById(this.props.offerId);
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
    console.log('searching');
    return new Fuse(items, options);
  });

  getResults = () =>
    this.getFuse(this.props.members)
      .search(this.state.searchedText)
      .slice(0, 8);

  hasBooked = memoize((bookings, memberId) =>
    bookings.find((b) => b.member === memberId),
  );

  renderSearchedMember = (member: Member) => {
    const hasBooked = Boolean(this.hasBooked(this.props.bookings, member.id));
    if (hasBooked) {
      return (
        <MemberBookingHelper
          key={member.id}
          onClick={() => this.addToQuickInvoicePanel(member.id)}
          onClickListItem={() => window.open(`/member/${member.id}`)}
          member={member}
          hasBooked
        />
      );
    }
    return (
      <MemberBookingHelper
        key={member.id}
        onClick={() => this.setState({ memberToRegister: member })}
        onClickListItem={() => {
          window.open(`/member/${member.id}`, '_blank');
        }}
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
    this.clearSearch();
  };

  clearSearch = () => this.setState({ searchedText: '' });

  renderBookingHeader = () => {
    const { classes, t } = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={16}
          className={classes.bookingsHeader}
        >
          <Grid item>
            <Typography variant="h6">{t('offer.myBookings')}</Typography>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center" spacing={16}>
              <Grid item>
                <IconButton onClick={this.openAddMemberModal} color="primary">
                  <AddCircleIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <SearchMember
                  onChange={(event) =>
                    this.setState({ searchedText: event.target.value })
                  }
                  value={this.state.searchedText}
                  onReset={this.clearSearch}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {this.state.loading ||
        (this.props.loading && (this.props.bookings || []).length === 0) ? (
          <LinearProgress />
        ) : null}
      </div>
    );
  };

  closeRevertBookingDialog = () => {
    this.setState({ bookingToRevert: null });
  };

  handleBookingRevert = (booking: Booking) => {
    this.setState({ bookingToRevert: booking });
  };

  handleBookingDeletion = () => {
    this.props.deleteBooking(
      this.state.bookingToRevert.id,
      this.state.bookingToRevert.member,
    );
    this.closeRevertBookingDialog();
  };

  render() {
    const {
      offer,
      bookings,
      bookingLoading,
      bookingOptions,
      discardOption,
      bookingUpdaters,
      t,
      classes,
    } = this.props;

    const { searchedText, memberToRegister } = this.state;
    console.log('rendering');

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
                <Collapse in={!!searchedText}>
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
                  sortedBy="name"
                  redirectToMember
                  newTab
                  loading={bookingLoading || (bookings || []).length === 0}
                  bookings={bookings}
                  bookingOptions={bookingOptions}
                  discardOption={discardOption}
                  {...bookingUpdaters}
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
          <QuickInvoicePanel
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            quickInvoices={this.state.quickInvoices}
            members={this.props.members}
            createInvoice={this.createInvoice}
            closeQuickInvoice={this.closeQuickInvoice}
            saveQuickInvoice={this.saveQuickInvoice}
            paymentPacks={this.props.paymentPacks}
            shopItems={this.props.shopItems}
            offers={this.props.offers}
            activities={this.props.activities}
          />
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
              subscribeToPackAndOffer={(paymentPackId) =>
                this.registerMemberAndOpenUnevenInvoice(
                  memberToRegister.id,
                  paymentPackId,
                )
              }
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
              initial={{ rgpd: [] }}
            />
          </DialogContent>
        </Dialog>
        <RevertBookingDialog
          handleBookingDeletion={this.handleBookingDeletion}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable={this.props.offer.available}
          closeRevertBookingDialog={this.closeRevertBookingDialog}
        />
      </Grid>
    );
  }
}

const MemberMap = {
  lastname: 'last_name',
  firstname: 'first_name',
  email: 'email',
  address_line_1: 'address.address_line_1',
  address_line_2: 'address.address_line_2',
  zipcode: 'address.zipcode',
  city: 'address.city',
  country: 'address.country',
  phone: 'phone.phone_number',
  gender: 'gender',
  avatar: 'photo',
  birthdayYear: 'birthday',
  membership_ID: 'membership_ID',
  rgpd: 'rgpd',
  date_joined: 'date_joined',
  address: 'address',
};

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

export default withStyles(styles)(withNamespaces()(OfferManagement));
