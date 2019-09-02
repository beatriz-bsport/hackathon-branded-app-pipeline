// @flow
import React, { PureComponent } from 'react';

import { compose } from 'recompose';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TodayIcon from '@material-ui/icons/Today';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Fuse from 'fuse.js';
import memoize from 'memoize-one';

import ResultList from '../../components/search/ResultList.component';
import MemberBookingHelper from './MemberBookingHelper.component';
import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import SearchMember from './SearchMember.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import RegisterMemberToOfferForm from './RegisterMemberToOfferForm.component';

import MemberForm from '../../libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '../../libs/member/api';
import BookingTable from '../../libs/booking/components/BookingTable.component';
import BookingOptionForManager from '../../libs/waiting-list/components/BookingOptionForManager.component';
import DiscardBookingOptionDialog from '../../libs/waiting-list/components/DiscardBookingOptionDialog.component';

import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking, BookingOption } from '../../libs/booking/types';
import type { Member } from '../../libs/member/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Permission } from '../../libs/role/types';

type Props = {
  fullScreen: boolean,
  offerId: number,
  offer: ?Offer,
  offerLoading: boolean,
  bookingLoading: ?boolean,
  compatiblePacksLoading: boolean,

  members: Array<Member>,
  bookingOptions: Array<BookingOption>,
  bookings: Array<Booking>,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  offers: Array<Event>,
  compatiblePacks: Array<PaymentPack>,
  unevenSavedInvoices: Array<Invoice>,
  permission: Permission,

  fetchMember: (id: number) => void,
  memberSearchLoading: boolean,
  searchMembers: (txt: string) => void,
  searchedMembers: Array<Member>,
  confirmBookingAttendance: (bookingId: number) => void,
  discardBookingAttendance: (bookingId: number) => void,
  revertQuickInvoiceAndRefreshOffer: (uuid: string, offerId: number) => void,
  goToMember: (id: number) => void,
  snackbarSuccess: (msg: string) => void,
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
  t: TFunction,
  classes: Object,
};

type State = {
  quickInvoices: [*], // put here non-saved invoice
  quickInvoiceEdit: [*], // put here invoice to edit
  addMemberModal: boolean,
  optionToDiscard: ?number,
  memberToRegister: ?number,
  searchedText: string,
};

export class OfferManagement extends PureComponent<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    memberToRegister: null,
    optionToDiscard: null,
    searchedText: '',
    interval: null,
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  componentDidMount() {
    this.props.fetchCompatiblePacks(this.props.offerId);
    this.props.fetchOffer(this.props.offerId);
    this.props.fetchOfferData(this.props.offerId);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  closeQuickInvoice = (memberId, invoiceData) => {
    if ((invoiceData.invoiceItems || { offers: [] }).offers.length === 0) {
      this.setState((prevState) => ({
        quickInvoices: prevState.quickInvoices.filter(
          (qi) => qi.memberId !== memberId,
        ),
      }));
    }
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
      memberId: memberToRegister,
    });
    this.clearSearch();
    this.setState({ memberToRegister: null });
  };

  createInvoice = (invoiceData, memberId) => {
    this.props.createInvoice(invoiceData, memberId, null, this.props.offerId);
    this.closeQuickInvoice(memberId, invoiceData);
  };

  createMember = (data: *, options) => {
    if (
      !(
        data.address_line_1 ||
        data.address_line_2 ||
        data.city ||
        data.zipcode ||
        data.country
      )
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
    if (!data.birthday) {
      // eslint-disable-next-line
      delete data.birthday;
    }

    const formData = mapFormData(data, MemberMap);
    this.props.createMember(
      formData,
      {
        ...options,
        onSuccess: () => {
          getLatestMember()
            .then((res) => {
              this.props.fetchMember(res.data);
              this.setState({ memberToRegister: res.data });
            })
            .catch((err) => {
              console.error(err);
            });
          options.onSuccess();
        },
      },
      this.props.offerId,
    );
    this.setState({ addMemberModal: false });
  };

  openAddMemberModal = () => {
    this.setState({ addMemberModal: true });
    this.clearSearch();
  };

  closeAddMemberModal = () => {
    this.setState({ addMemberModal: false });
  };

  renderSearchedMember = (member: Member) => {
    const hasBooked = !!this.props.bookings.find((b) => b.member === member.id);
    return (
      <MemberBookingHelper
        key={member.id}
        onClickBill={() => this.addToQuickInvoicePanel(member.id)}
        onClickOption={() => {
          this.props.registerToWaitingList(this.props.offer.id, member.id);
          this.clearSearch();
        }}
        onClickRegister={() => this.setState({ memberToRegister: member.id })}
        onClickListItem={
          hasBooked ? () => this.addToQuickInvoicePanel(member.id) : null
        }
        showMember={
          this.props.permission.member.retrieve
            ? () => window.open(`/member/${member.id}/`)
            : null
        }
        member={member}
        hasBooked={hasBooked}
      />
    );
  };

  addToQuickInvoicePanel = (memberId: number) => {
    const { bookings, offer } = this.props;
    const { quickInvoices } = this.state;
    const isOpened = quickInvoices.find((qi) => qi.memberId === memberId);
    const selectedMember = this.props.members.find((m) => m.id === memberId);

    if (!selectedMember) {
      return;
    }

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
      <div className={classes.bookingsHeader}>
        <Typography variant="h6">{t('offer.myBookings')}</Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}
        >
          <IconButton onClick={this.openAddMemberModal} color="primary">
            <PersonAddIcon />
          </IconButton>
          <SearchMember
            onChange={(event) => {
              this.setState({ searchedText: event.target.value });
              this.props.searchMembers(event.target.value);
            }}
            value={this.state.searchedText}
            onReset={this.clearSearch}
          />
        </div>
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

  getNavigationHeader = (loading: boolean) => (
    <Slide in direction="bottom">
      <Paper className={this.props.classes.headerContainer}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={this.props.classes.titleBanner}
        >
          <Grid item>
            <Button
              onClick={() => this.goToOffer(this.props.offer.previous_offer)}
              disabled={!this.props.offer}
            >
              <ChevronLeftIcon className={this.props.classes.leftIcon} />
              <Hidden xsDown>{this.props.t('offer.previousOffer')}</Hidden>
            </Button>
          </Grid>
          <Grid item>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Button onClick={this.props.goBack}>
                <TodayIcon className={this.props.classes.leftIcon} />
                {this.props.t('offer.backToCalendar')}
              </Button>
              {this.props.bookingLoading ? (
                <CircularProgress size={16} />
              ) : (
                <IconButton
                  onClick={() => this.props.fetchOfferData(this.props.offerId)}
                >
                  <RefreshIcon />
                </IconButton>
              )}
            </div>
          </Grid>
          <Grid item>
            <Button
              onClick={() => this.goToOffer(this.props.offer.next_offer)}
              disabled={!this.props.offer}
            >
              <Hidden xsDown>{this.props.t('offer.nextOffer')}</Hidden>
              <ChevronRightIcon className={this.props.classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
        {loading ? <LinearProgress /> : null}
      </Paper>
    </Slide>
  );

  render() {
    const {
      offer,
      bookings,
      bookingLoading,
      bookingOptions,
      t,
      classes,
      fullScreen,
    } = this.props;

    const { searchedText, memberToRegister } = this.state;

    if (!offer) {
      return <React.Fragment>{this.getNavigationHeader(true)}</React.Fragment>;
    }
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12}>
          {this.getNavigationHeader(false)}
        </Grid>
        <Grid item xs={12} lg={6}>
          <Slide in direction="right">
            <Paper className={classes.autoScroll}>
              <Grid container direction="column">
                <Grid item xs={12}>
                  {this.renderBookingHeader()}
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <Collapse in={!!searchedText}>
                    <div className={classes.resultListContainer}>
                      <ResultList
                        items={this.props.searchedMembers}
                        loading={this.props.memberSearchLoading}
                        renderListComponent={this.renderSearchedMember}
                        redirectToMember={this.props.permission.member.retrieve}
                      />
                    </div>
                    <Divider />
                  </Collapse>
                </Grid>
                <Grid item xs={12}>
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
                          {`${this.getNbAttendant() +
                            this.getNbNonAttendant()}/${this.getMaxBookings()} ${t(
                            'offer.maxBookingsNb',
                          )}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <BookingTable
                    redirectToMember={this.props.permission.member.retrieve}
                    newTab
                    members={this.props.members}
                    paymentPacks={this.props.paymentPacks}
                    loading={bookingLoading}
                    bookings={bookings}
                    confirmBookingAttendance={
                      this.props.confirmBookingAttendance
                    }
                    discardBookingAttendance={
                      this.props.discardBookingAttendance
                    }
                    showQuickInvoiceButton
                    showRevertBookingButton
                    handleRevert={this.handleBookingRevert}
                    onQuickInvoiceClick={this.addToQuickInvoicePanel}
                  />
                  <List disablePadding>
                    {bookingOptions
                      .filter((bo) => !bo.booking && !bo.cancelled)
                      .map((bo) => (
                        <BookingOptionForManager
                          option={bo}
                          onDiscard={() =>
                            this.setState({ optionToDiscard: bo.id })
                          }
                          member={this.props.members.find(
                            (m) => m.id === bo.member,
                          )}
                        />
                      ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Slide>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Slide in direction="left">
            <QuickInvoicePanel
              members={this.props.members}
              unevenSavedInvoices={this.props.unevenSavedInvoices}
              revertQuickInvoice={(uuid) =>
                this.props.revertQuickInvoiceAndRefreshOffer(
                  uuid,
                  this.props.offerId,
                )
              }
              quickInvoices={this.state.quickInvoices}
              createInvoice={this.createInvoice}
              closeQuickInvoice={this.closeQuickInvoice}
              saveQuickInvoice={this.saveQuickInvoice}
              paymentPacks={this.props.paymentPacks.filter(
                (pp) => !pp.disabled,
              )}
              shopItems={this.props.shopItems}
              offers={this.props.offers}
              className={classes.autoScroll}
            />
          </Slide>
        </Grid>
        <Dialog
          fullScreen={fullScreen}
          onClose={() => this.setState({ memberToRegister: null })}
          open={!!memberToRegister}
        >
          <DialogContent>
            {memberToRegister ? (
              <RegisterMemberToOfferForm
                offerId={this.props.offerId}
                memberId={memberToRegister}
                loading={this.props.compatiblePacksLoading}
                compatiblePacks={this.props.compatiblePacks}
                onCancel={() => this.setState({ memberToRegister: null })}
                subscribeToOffer={this.registerMember}
                subscribeToPackAndOffer={(paymentPackId) =>
                  this.registerMemberAndOpenUnevenInvoice(
                    memberToRegister,
                    paymentPackId,
                  )
                }
              />
            ) : null}
          </DialogContent>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={!!this.state.addMemberModal}
          onClose={this.closeAddMemberModal}
        >
          <DialogContent>
            <MemberForm
              onCancel={this.closeAddMemberModal}
              onSubmit={this.createMember}
              initial={{ birthday: null, rgpd: ['accept_email', 'accept_sms'] }}
              goToMember={this.props.goToMember}
              goToMemberList={() => {}}
              snackbarSuccess={this.props.snackbarSuccess}
            />
          </DialogContent>
        </Dialog>
        <RevertBookingDialog
          handleBookingDeletion={this.handleBookingDeletion}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable={this.props.offer.available}
          closeRevertBookingDialog={this.closeRevertBookingDialog}
        />
        <DiscardBookingOptionDialog
          open={!!this.state.optionToDiscard}
          onSubmit={() => {
            this.props.discardOption(this.state.optionToDiscard);
            this.setState({ optionToDiscard: null });
          }}
          onClose={() => this.setState({ optionToDiscard: null })}
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
  birthday: 'birthday',
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
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  },
  autoScroll: {
    overflowY: 'auto',
    [theme.breakpoints.up('lg')]: {
      height: `calc(100vh - ${theme.spacing.unit * 19}px)`,
    },
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

export default compose(
  withMobileDialog(),
  withStyles(styles),
  withNamespaces(),
)(OfferManagement);
