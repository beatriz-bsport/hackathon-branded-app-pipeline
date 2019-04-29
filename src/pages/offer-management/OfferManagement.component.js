// @flow
import React, { PureComponent } from 'react';

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
  CircularProgress,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TodayIcon from '@material-ui/icons/Today';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Fuse from 'fuse.js';
import memoize from 'memoize-one';

import BookingTable from '../../components/booking/BookingTable.component';
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

  allMembers: Array<Member>,
  members: Array<Member>,
  bookingOptions: Array<BookingOption>,
  activities: Array<Activity>,
  bookings: Array<Booking>,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  offers: Array<Event>,
  compatiblePacks: Array<PaymentPack>,
  unevenSavedInvoices: Array<Invoice>,

  goToOffer: (id: number) => void,
  fetchCompatiblePacks: (offerId: number) => void,
  createMember: (data: [*], options: *, offerId: number) => void,
  createInvoice: ([*], number, number) => void,
  resetQuickInvoices: () => void,
  createQuickUnevenInvoice: (
    {
      memberId: number,
      offerId: number,
      paymentPackId: number,
    },
    offerId: number,
  ) => void,
  addToOffer: ({
    offerId: number,
    consumerPaymentPackId: number,
    memberId: number,
  }) => void,
  discardOption: (id: number) => void,
  deleteBooking: (bookingId: number) => void,

  fetchOffer: (id: number) => void,
  fetchOfferData: (id: number) => void,

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

export class OfferManagement extends PureComponent<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    memberToRegister: null,
    searchedText: '',
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  componentDidMount() {
    this.props.fetchCompatiblePacks(this.props.offerId);
    this.props.fetchOffer(this.props.offerId);
    this.props.fetchOfferData(this.props.offerId);
  }

  closeQuickInvoice = (memberId) => {
    this.setState((prevState) => ({
      quickInvoices: prevState.quickInvoices.filter(
        (qi) => qi.memberId !== memberId,
      ),
    }));
  };

  registerMemberAndOpenUnevenInvoice = async (
    memberId: number,
    paymentPackId: number,
  ) => {
    const { offerId } = this.props;
    this.props.createQuickUnevenInvoice(
      { memberId, paymentPackId, offerId },
      offerId,
    );
    this.clearSearch();
    this.setState({ memberToRegister: null });
  };

  registerMember = async (consumerPaymentPackId: number) => {
    const { memberToRegister } = this.state;
    this.props.addToOffer({
      offerId: this.props.offerId,
      consumerPaymentPackId,
      memberId: memberToRegister.id,
    });
    this.clearSearch();
    this.setState({ memberToRegister: null });
  };

  createInvoice = (invoiceData, memberId) => {
    this.props.createInvoice(invoiceData, memberId, null, this.props.offerId);
    this.closeQuickInvoice(memberId);
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
        // eslint-disable-next-line
        delete data.address_line_1;
        // eslint-disable-next-line
        delete data.address_line_2;
        // eslint-disable-next-line
        delete data.city;
        // eslint-disable-next-line
        delete data.zipcode;
        // eslint-disable-next-line
        delete data.country;
      }
    }
    const formData = mapFormData(data, MemberMap);
    this.props.createMember(formData, options, this.props.offerId);
    this.setState({ addMemberModal: false });
  };

  openAddMemberModal = () => {
    this.setState({ addMemberModal: true });
    this.clearSearch();
  };

  closeAddMemberModal = () => {
    this.setState({ addMemberModal: false });
  };

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
    this.getFuse(this.props.allMembers)
      .search(this.state.searchedText)
      .slice(0, 8);

  renderSearchedMember = (member: Member) => {
    const hasBooked = !!this.props.bookings.find((b) => b.member === member.id);
    if (hasBooked) {
      return (
        <MemberBookingHelper
          key={member.id}
          onClick={() => this.addToQuickInvoicePanel(member.id)}
          onClickListItem={() => this.addToQuickInvoicePanel(member.id)}
          showMember={() => window.open(`/member/${member.id}`)}
          member={member}
          hasBooked
        />
      );
    }
    return (
      <MemberBookingHelper
        key={member.id}
        onClick={() => this.setState({ memberToRegister: member })}
        onClickListItem={() => this.setState({ memberToRegister: member })}
        showMember={() => {
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
    const isOpened = quickInvoices.find((qi) => qi.memberId === memberId);
    const selectedMember = this.props.members.find((m) => m.id === memberId);

    const quickInvoiceToAdd = bookings.find((b) => b.member === memberId)
      ? {
          memberName: selectedMember.name,
          memberId: selectedMember.id,
          id: selectedMember.id,
          creditAccount: selectedMember.credit_account_balance,
          invoiceItems: { offers: [] },
        }
      : {
          memberName: selectedMember.name,
          memberId: selectedMember.id,
          id: selectedMember.id,
          creditAccount: selectedMember.credit_account_balance,
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

  getNbAttendant = () => {
    if (this.props.bookingLoading) {
      return '...';
    }
    return this.props.bookings.reduce(
      (s, booking) => (booking.attendance ? s + 1 : s),
      0,
    );
  };

  getNbNonAttendant = () => {
    if (this.props.bookingLoading) {
      return '...';
    }
    return this.props.bookings.reduce(
      (s, booking) => (!booking.attendance ? s + 1 : s),
      0,
    );
  };

  getMaxBookings = () => {
    if (this.props.offerLoading) {
      return '...';
    }
    return (this.props.offer && this.props.offer.effectif) || 0;
  };

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
                  <PersonAddIcon />
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
    this.props.deleteBooking(this.state.bookingToRevert.id);
    this.closeRevertBookingDialog();
  };

  goToOffer = (id) => {
    this.props.fetchCompatiblePacks(id);
    this.props.fetchOffer(id);
    this.props.fetchOfferData(id);
    this.props.goToOffer(id);
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
        <Grid item xs={12} className={classes.headerContainer}>
          <Paper>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              className={classes.titleBanner}
            >
              <Grid item>
                <Button
                  onClick={() => this.goToOffer(offer.previous_offer)}
                  color="secondary"
                >
                  <ChevronLeftIcon className={classes.leftIcon} />
                  {t('offer.previousOffer')}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={this.props.goBack} color="secondary">
                  <TodayIcon className={classes.leftIcon} />
                  {t('offer.backToCalendar')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => this.goToOffer(offer.next_offer)}
                  color="secondary"
                >
                  {t('offer.nextOffer')}
                  <ChevronRightIcon className={classes.rightIcon} />
                </Button>
              </Grid>
            </Grid>
          </Paper>
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
                {bookingLoading || this.props.offerLoading ? null : (
                  <Grid
                    container
                    className={classes.bookingSubHeader}
                    justify="space-between"
                  >
                    <Grid item>
                      <Typography variant="caption" color="primary">
                        {this.getNbAttendant()} {t('offer.attendant')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" color="error">
                        {this.getNbNonAttendant()} {t('offer.nonAttendant')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">
                        {this.getMaxBookings()} {t('offer.maxBookingsNb')}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item>
                <BookingTable
                  sortedBy="name"
                  redirectToMember
                  newTab
                  members={this.props.members}
                  paymentPacks={this.props.paymentPacks}
                  loading={bookingLoading}
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
            members={this.props.members}
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            quickInvoices={this.state.quickInvoices}
            createInvoice={this.createInvoice}
            closeQuickInvoice={this.closeQuickInvoice}
            saveQuickInvoice={this.saveQuickInvoice}
            paymentPacks={this.props.paymentPacks.filter((pp) => !pp.disabled)}
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
            {memberToRegister ? (
              <RegisterMemberToOfferForm
                offerId={this.props.offerId}
                memberId={memberToRegister.id}
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
            ) : null}
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
  rightIcon: {
    marginLight: theme.spacing.unit,
  },
  headerContainer: {
    marginTop: -theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  titleBanner: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    backgroundColor: theme.palette.background.paper.disabled,
  },
  bookingSubHeader: {
    width: '100%',
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    paddingTop: theme.spacing.unit / 2,
    background: '#F8F8F8',
    borderBottom: 'solid 1px #E4E4E4',
  },
});

export default withStyles(styles)(withNamespaces()(OfferManagement));
