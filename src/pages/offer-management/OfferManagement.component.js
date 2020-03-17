// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import VideocamIcon from '@material-ui/icons/Videocam';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MailIcon from '@material-ui/icons/Mail';
import TodayIcon from '@material-ui/icons/Today';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import moment from 'moment';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';
import ResultList from '../../components/search/ResultList.component';
import MemberBookingHelper from './MemberBookingHelper.component';
import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import SearchMember from './SearchMember.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import RegisterMemberToOfferForm from './RegisterMemberToOfferForm.component';
import WaitingListControlHeader from './WaitingListControlHeader.component';
import MailMembers from './MailMembers.component';

import MemberForm from '../../libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '../../libs/member/api';
import BookingTable from '../../libs/booking/components/BookingTable.component';
import BookingOptionForManager from '../../libs/waiting-list/components/BookingOptionForManager.component';
import DiscardBookingOptionDialog from '../../libs/waiting-list/components/DiscardBookingOptionDialog.component';

import BroadcastRoom from '../../libs/video/components/BroadcastRoom.component';

import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking, BookingOption } from '../../libs/booking/types';
import type { Member } from '../../libs/member/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Permission } from '../../libs/role/types';
import type { PrivatePass } from '../../libs/private-service/types';
import type { PaymentCombo } from '../../libs/payment-combo/types';

type Props = {
  fullScreen: boolean,
  offerId: number,
  offer: ?Offer,
  offerLoading: boolean,
  bookingLoading: ?boolean,
  compatiblePacksLoading: boolean,

  members: Array<Member>,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,
  paymentPacks: Array<PaymentPack>,
  paymentPacksEnabled: Array<PaymentPack>,
  shopItemsAvailable: Array<ShopItem>,
  compatiblePacks: Array<PaymentPack>,
  unevenSavedInvoices: Array<Invoice>,
  permission: Permission,

  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  privatePassList: Array<PrivatePass>,
  paymentComboList: Array<PaymentCombo>,

  switchWaitingListFreeze: (offerId: number, newFreezeState: boolean) => void,
  fetchMember: (id: number) => void,
  registerToWaitingList: (offerId: number, memberId: number) => void,
  memberSearchLoading: boolean,
  searchMembers: (txt: string) => void,
  mailMembers: (data: any) => void,
  searchedMembers: Array<Member>,
  confirmBookingAttendance: (bookingId: number) => void,
  discardBookingAttendance: (bookingId: number) => void,
  revertQuickInvoiceAndRefreshOffer: (uuid: string, offerId: number) => void,
  goToMember: (id: number) => void,
  fetchShopItems: () => void,
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
  addBooking: (offerId: number, consumerPaymentPackId: number) => void,
  discardOption: (id: number) => void,
  deleteBooking: (bookingId: number) => void,

  fetchOffer: (id: number) => void,
  fetchOfferData: (id: number) => void,

  goToCalendar: (date: any) => void,
  t: TFunction,
  classes: Object,
  company_theme: Object,
  refresh: (oredering: string) => void,
};

type State = {
  quickInvoices: [*], // put here non-saved invoice
  quickInvoiceEdit: [*], // put here invoice to edit
  addMemberModal: boolean,
  mailClients: boolean,
  optionToDiscard: ?number,
  memberToRegister: ?number,
  searchedText: string,
  openMailDialog: boolean,
  receivers: Object,
  openMailChoiceDialog: boolean,
  booking_ordering: number,
};

const getNameFromId = (id, membersList) => {
  return membersList.find((member) => member.id === id).name;
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    memberToRegister: null,
    memberToRegisterName: null,
    optionToDiscard: null,
    confirmOptionToDiscard: null,
    searchedText: '',
    interval: null,
    openMailChoiceDialog: false,
    keep_credits: false,
    booking_ordering:
      this.props.company_theme.default_booking_ordering || BOOKING_DATE_ORDER,
    notify_member: false,
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  componentDidMount() {
    this.props.fetchCompatiblePacks(this.props.offerId);
    this.props.fetchOffer(this.props.offerId);
    this.props.fetchOfferData(this.props.offerId, this.state.booking_ordering);
    this.props.fetchShopItems();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.company_theme.default_booking_ordering !==
      prevProps.company_theme.default_booking_ordering
    ) {
      this.setState({
        booking_ordering: this.props.company_theme.default_booking_ordering,
      });
      this.props.refresh(this.props.company_theme.default_booking_ordering);
    }
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
    keep_credits: boolean,
    notify_member: boolean,
  ) => {
    const { offerId } = this.props;
    this.props.createQuickUnevenInvoice(
      { memberId, paymentPackId, offerId, keep_credits, notify_member },
      offerId,
    );
    this.clearSearch();
    if (this.state.optionToDiscard) {
      this.props.discardOption(this.state.optionToDiscard);
      this.setState({
        optionToDiscard: null,
        confirmOptionToDiscard: null,
      });
    }
    this.setState({ memberToRegister: null });
  };

  registerMember = async (consumerPaymentPackId: number) => {
    this.props.addBooking(
      this.props.offerId,
      consumerPaymentPackId,
      this.state.keep_credits,
      this.state.booking_ordering,
      this.state.notify_member,
    );
    this.clearSearch();
    if (this.state.optionToDiscard) {
      this.props.discardOption(this.state.optionToDiscard);
      this.setState({
        optionToDiscard: null,
        confirmOptionToDiscard: null,
      });
    }
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
              this.setState({
                memberToRegister: res.data,
                memberToRegisterName: `${data.firstname} ${data.lastname}`,
              });
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
        isFull={this.props.offer.is_full}
        onClickBill={() => this.addToQuickInvoicePanel(member.id)}
        onClickOption={() => {
          this.props.registerToWaitingList(this.props.offer.id, member.id);
          this.clearSearch();
        }}
        onClickRegister={() => {
          this.setState({
            memberToRegisterName: getNameFromId(
              member.id,
              this.props.searchedMembers,
            ),
            memberToRegister: member.id,
          });
        }}
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
    return this.props.bookings.filter(
      (booking) =>
        booking.booking_status_code === BOOKING_STATUS_OK.id &&
        booking.attendance,
    ).length;
  };

  getNbNonAttendant = () => {
    if (this.props.bookingLoading) {
      return '...';
    }
    return this.props.bookings.filter(
      (booking) =>
        !booking.attendance &&
        booking.booking_status_code === BOOKING_STATUS_OK.id,
    ).length;
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
        <div className={classes.bookingsHeader}>
          <div />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ openMailChoiceDialog: true });
              }}
              color="primary"
              disabled={this.props.bookingLoading}
            >
              <MailIcon />
            </IconButton>
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
        <div className={classes.bookingOrderingContainer}>
          <FormControlLabel
            value={BOOKING_DATE_ORDER}
            control={
              <Radio
                checked={BOOKING_DATE_ORDER === this.state.booking_ordering}
                onChange={() => {
                  this.setState({ booking_ordering: BOOKING_DATE_ORDER });
                  this.props.refresh(BOOKING_DATE_ORDER);
                }}
              />
            }
            label={t('offer:offerManagement.bookingOrder.date')}
          />
          <FormControlLabel
            value={BOOKING_FIRSTNAME_ORDER}
            control={
              <Radio
                checked={
                  BOOKING_FIRSTNAME_ORDER === this.state.booking_ordering
                }
                onChange={() => {
                  this.setState({ booking_ordering: BOOKING_FIRSTNAME_ORDER });
                  this.props.refresh(BOOKING_FIRSTNAME_ORDER);
                }}
              />
            }
            label={t('offer:offerManagement.bookingOrder.firstname')}
          />
          <FormControlLabel
            value={BOOKING_LASTNAME_ORDER}
            control={
              <Radio
                checked={BOOKING_LASTNAME_ORDER === this.state.booking_ordering}
                onChange={() => {
                  this.setState({ booking_ordering: BOOKING_LASTNAME_ORDER });
                  this.props.refresh(BOOKING_LASTNAME_ORDER);
                }}
              />
            }
            label={t('offer:offerManagement.bookingOrder.lastname')}
          />
        </div>
      </div>
    );
  };

  closeRevertBookingDialog = () => {
    this.setState({ bookingToRevert: null });
  };

  handleBookingRevert = (booking: Booking) => {
    for (const inv of this.props.unevenSavedInvoices) {
      for (const ii of inv.invoice_items) {
        if (ii.object_id === booking.consumer_payment_pack.id) {
          this.props.revertQuickInvoiceAndRefreshOffer(
            inv.uuid,
            this.props.offerId,
            this.state.booking_ordering,
          );
          return;
        }
      }
    }
    this.setState({ bookingToRevert: booking });
  };

  handleBookingDeletion = () => {
    this.props.deleteBooking(
      this.state.bookingToRevert.id,
      this.state.booking_ordering,
    );
    this.closeRevertBookingDialog();
  };

  goToOffer = (id) => {
    this.props.fetchCompatiblePacks(id);
    this.props.fetchOffer(id);
    this.props.fetchOfferData(id, this.state.booking_ordering);
    this.props.goToOffer(id);
  };

  getDateDictionnary = () => {
    const date = this.props.offer
      ? moment(this.props.offer.date_start)
      : moment();
    return { year: date.year(), month: date.month() + 1, day: date.date() };
  };

  getNavigationHeader = (loading: boolean) => (
    <Paper className={this.props.classes.headerContainer}>
      <div className={this.props.classes.titleBanner}>
        <Button
          onClick={() => this.goToOffer(this.props.offer.previous_offer)}
          disabled={
            !this.props.offer || this.props.offer.id !== this.props.offerId
          }
        >
          <ChevronLeftIcon className={this.props.classes.leftIcon} />
          <Hidden xsDown>{this.props.t('offer.previousOffer')}</Hidden>
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={() => this.props.goToCalendar(this.getDateDictionnary())}
          >
            <TodayIcon className={this.props.classes.leftIcon} />
            {this.props.offer &&
            !this.props.offerLoading &&
            this.props.offer.date_start
              ? moment(this.props.offer.date_start).format('LLLL')
              : ''}
          </Button>
          {this.props.bookingLoading ? (
            <CircularProgress size={16} />
          ) : (
            <IconButton
              onClick={() =>
                this.props.fetchOfferData(
                  this.props.offerId,
                  this.state.booking_ordering,
                )
              }
            >
              <RefreshIcon />
            </IconButton>
          )}
        </div>
        <Button
          onClick={() => this.goToOffer(this.props.offer.next_offer)}
          disabled={
            !this.props.offer || this.props.offer.id !== this.props.offerId
          }
        >
          <Hidden xsDown>{this.props.t('offer.nextOffer')}</Hidden>
          <ChevronRightIcon className={this.props.classes.rightIcon} />
        </Button>
      </div>
      {loading ? <LinearProgress /> : null}
    </Paper>
  );

  renderBroadcastPanel = () => {
    if (this.state.broadcastActivated) {
      return (
        <BroadcastRoom
          userType="coach"
          date_start={this.props.offer.date_start}
          broadcast_info={this.props.offer.broadcast_info}
        />
      );
    }
    return (
      <ButtonBase
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 16,
          justifyContent: 'center',
          minHeight: 300,
          width: '100%',
          flexDirection: 'column',
        }}
        onClick={() => this.setState({ broadcastActivated: true })}
      >
        <VideocamIcon style={{ height: '30vh', width: '30vh' }} />
        <Button variant="outlined" color="primary" style={{ marginBottom: 30 }}>
          {this.props.t('offer:video.activateVideo')}
        </Button>
      </ButtonBase>
    );
  };

  render() {
    const {
      offer,
      bookingLoading,
      bookingOptionsPending,
      t,
      classes,
      bookings,
      fullScreen,
      members,
    } = this.props;
    const { searchedText, memberToRegister, memberToRegisterName } = this.state;
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
              <div className={classes.fullWidthRow}>
                {offer.meta_activity_color ? (
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: offer.meta_activity_color,
                    }}
                  />
                ) : null}
                {this.renderBookingHeader()}
                <Divider />
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
                {bookingLoading || this.props.offerLoading ? (
                  <LinearProgress />
                ) : (
                  <div className={classes.bookingSubHeader}>
                    <Typography variant="caption" color="primary">
                      {this.getNbAttendant()} {t('offer.attendant')}
                    </Typography>
                    <Typography variant="caption" color="error">
                      {this.getNbNonAttendant()} {t('offer.nonAttendant')}
                    </Typography>
                    <Typography variant="caption">
                      {`${this.getNbAttendant() +
                        this.getNbNonAttendant()}/${this.getMaxBookings()} ${t(
                        'offer.maxBookingsNb',
                      )}`}
                    </Typography>
                  </div>
                )}
                <BookingTable
                  redirectToMember={this.props.permission.member.retrieve}
                  newTab
                  members={this.props.members}
                  paymentPacks={this.props.paymentPacks}
                  loading={bookingLoading || this.props.offerLoading}
                  bookings={bookings}
                  confirmBookingAttendance={this.props.confirmBookingAttendance}
                  discardBookingAttendance={this.props.discardBookingAttendance}
                  showQuickInvoiceButton
                  showRevertBookingButton
                  handleRevert={this.handleBookingRevert}
                  onQuickInvoiceClick={this.addToQuickInvoicePanel}
                />
                {bookingOptionsPending && bookingOptionsPending.length ? (
                  <WaitingListControlHeader
                    switchWaitingListFreeze={() =>
                      this.props.switchWaitingListFreeze(
                        this.props.offer.id,
                        !this.props.offer.waiting_list_disabled,
                      )
                    }
                    bookingOptionsPending={bookingOptionsPending}
                    isDisabled={this.props.offer.waiting_list_disabled}
                  />
                ) : null}
                <List disablePadding>
                  {bookingOptionsPending.map((bo) => (
                    <BookingOptionForManager
                      option={bo}
                      onDiscard={(e) => {
                        e.stopPropagation();
                        this.setState({
                          optionToDiscard: bo.id,
                          confirmOptionToDiscard: true,
                        });
                      }}
                      member={this.props.members.find(
                        (m) => m.id === bo.member,
                      )}
                      onClickRegister={(e) => {
                        e.stopPropagation();
                        this.setState({
                          memberToRegisterName: getNameFromId(
                            bo.member,
                            this.props.members,
                          ),
                          memberToRegister: bo.member,
                        });
                        this.setState({ optionToDiscard: bo.id });
                      }}
                    />
                  ))}
                </List>
              </div>
            </Paper>
          </Slide>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.offer.is_broadcast && this.props.offer.broadcast_info
            ? this.renderBroadcastPanel()
            : null}
          <Slide in direction="left">
            <QuickInvoicePanel
              members={this.props.members}
              unevenSavedInvoices={this.props.unevenSavedInvoices}
              revertQuickInvoice={(uuid) =>
                this.props.revertQuickInvoiceAndRefreshOffer(
                  uuid,
                  this.props.offerId,
                  this.state.booking_ordering,
                )
              }
              quickInvoices={this.state.quickInvoices}
              createInvoice={this.createInvoice}
              closeQuickInvoice={this.closeQuickInvoice}
              saveQuickInvoice={this.saveQuickInvoice}
              privatePassList={this.props.privatePassList}
              paymentComboList={this.props.paymentComboList}
              paymentPacks={this.props.paymentPacksEnabled}
              shopItems={this.props.shopItemsAvailable}
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
                memberName={memberToRegisterName}
                loading={this.props.compatiblePacksLoading}
                compatiblePacks={this.props.compatiblePacks}
                keep_credits={this.state.keep_credits}
                notify_member={this.state.notify_member}
                changeKeepCreditsOption={() =>
                  this.setState((prevState) => ({
                    keep_credits: !prevState.keep_credits,
                  }))
                }
                changeNotifyMemberOption={() =>
                  this.setState((prevState) => ({
                    notify_member: !prevState.notify_member,
                  }))
                }
                onCancel={() => this.setState({ memberToRegister: null })}
                subscribeToOffer={this.registerMember}
                subscribeToPackAndOffer={(paymentPackId) =>
                  this.registerMemberAndOpenUnevenInvoice(
                    memberToRegister,
                    paymentPackId,
                    this.state.keep_credits,
                    this.state.notify_member,
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
          open={
            !!this.state.optionToDiscard && !!this.state.confirmOptionToDiscard
          }
          onSubmit={() => {
            this.props.discardOption(this.state.optionToDiscard);
            this.setState({
              optionToDiscard: null,
              confirmOptionToDiscard: null,
            });
          }}
          onClose={() =>
            this.setState({
              optionToDiscard: null,
              confirmOptionToDiscard: null,
            })
          }
        />
        {this.state.openMailChoiceDialog ? (
          <MailMembers
            fullscreen={fullScreen}
            bookingOptionsPending={bookingOptionsPending}
            bookings={bookings}
            openMailChoiceDialog={this.state.openMailChoiceDialog}
            onClose={() => this.setState({ openMailChoiceDialog: false })}
            members={members}
            mailMembers={this.props.mailMembers}
            mailDefaultTitle={this.props.offer ? this.props.offer.name : ''}
          />
        ) : null}
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
  bookingOrderingContainer: {
    marginRight: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'flex-end',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bookingSubHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    paddingTop: theme.spacing.unit / 2,
    background: '#F8F8F8',
    borderBottom: 'solid 1px #E4E4E4',
  },
  fullWidthRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

export default compose(
  withMobileDialog(),
  withStyles(styles),
  withNamespaces(),
)(OfferManagement);
