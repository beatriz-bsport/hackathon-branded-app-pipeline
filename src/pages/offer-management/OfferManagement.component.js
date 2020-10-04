// @flow
import React, { Component } from 'react';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import { Prompt } from 'react-router-dom';
import moment from 'moment-timezone';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import BookerModuleManager from './BookerModuleManager.component';
import MailMembers from './MailMembers.component';

import MemberForm from '../../libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '../../libs/member/api';
import DiscardBookingOptionDialog from '../../libs/waiting-list/components/DiscardBookingOptionDialog.component';

import BookingManagement from './BookingManagement.component';
import OfferNavigationHeader from './OfferNavigationHeader.component';
import OfferBroadcastHelper from './OfferBroadcastHelper.component';
import RecurrenceRuleBookingFormDialog from '../../libs/booking/components/RecurrenceRuleBookingFormDialog.component';

import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking, BookingOption } from '../../libs/booking/types';
import type { Member } from '../../libs/member/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Permission } from '../../libs/role/types';

const RECURRENT_BOOKING_PAGE_SIZE = 10;

type Props = {
  goToMemberBooking: (id: number) => void,
  t: TFunction,
  fullScreen: boolean,
  offerId: number,
  offer: ?Offer,
  offerLoading: boolean,
  bookingLoading: ?boolean,
  compatiblePacksLoading: boolean,

  goToOffer: (id: number) => void,

  members: Array<Member>,
  memberHistory: Array<member>,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,
  compatiblePacks: Array<PaymentPack>,
  unevenSavedInvoices: Array<Invoice>,
  permission: Permission,

  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  fetchShopItems: () => void,

  communicationDialogIsOpen: boolean,

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
  snackbarSuccess: (msg: string) => void,

  createMember: (id: ?number, data: [*], options: *, offerId: number) => void,
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
  addBooking: (consumerPaymentPackId: number, data: any) => void,
  discardOption: (id: number, options: OptionCallback) => void,
  deleteBooking: (bookingId: number, data: any) => void,

  fetchOffer: (id: number) => void,
  fetchOfferData: (id: number) => void,
  addMemberModal: boolean,

  goToCalendar: (date: any) => void,
  availableBuyableItems: {
    [buyable_item_identifier: number]: Array<BuyableItem>,
  },

  handleRevertBooking: (Booking) => void,

  classes: Object,
  company_theme: Object,

  setMemberToRegister: (
    ?{
      name: string,
      photo: ?string,
      id: number,
    },
  ) => void,
  memberToRegister: ?{
    name: string,
    photo: ?string,
    id: number,
  },
  bookingToRevert: ?Booking,
  closeRevertBookingDialog: () => void,
  booking_ordering: number,
  onChangeBookingOrdering: (number) => void,
  searchedText: string,

  optionToDiscard: number,
  confirmOptionToDiscard: ?boolean,
  cancelDiscardOption: () => void,
  registerOption: (optionId: number, member: number) => void,

  clearSearch: () => void,
  closeAddMemberModal: () => void,
  openAddMemberModal: () => void,

  openCommunicationDialog: () => void,
  closeCommunicationDialog: () => void,
  createRecurrenceRuleBooking: () => void,
  onDeleteRecurrenceRuleBooking: (id: number) => void,
  setBookerInAvanceDialog: () => void,
  bookerInAvanceDialog: boolean,
  fetchMetaActivityBulk: (ids: Array) => void,
  metaActivities: Array,
  recurrenceRuleBooking: Array,
  recurrentBookingCurrentPage: number,
  recurrentBookingNextPage: number,
  recurrentBookingOnPageRequested: () => void,
  recurrentBookingCount: number,
};

type State = {
  quickInvoices: Array<QuickInvoice>, // put here non-saved invoice
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  componentDidMount() {
    this.props.fetchOfferData(this.props.booking_ordering);
    this.props.fetchShopItems();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    if (this.props.offer) {
      this.props.fetchMetaActivityBulk([this.props.offer.meta_activity_id]);
    }
  }

  fetchOfferAndData = () => {
    this.props.fetchOffer(this.props.offerId);
    this.props.fetchOfferData(this.props.booking_ordering);
  };

  componentDidUpdate(prevProps: Props) {
    if (!!this.props.offerId && this.props.offerId !== prevProps.offerId) {
      this.fetchOfferAndData();
    }
  }

  closeQuickInvoice = (memberId: number, invoiceData: any) => {
    if ((invoiceData.invoiceItems || { offers: [] }).offers.length === 0) {
      this.setState((prevState: State) => ({
        quickInvoices: prevState.quickInvoices.filter(
          (qi) => qi.memberId !== memberId,
        ),
      }));
    }
  };

  registerToOffer = (
    memberId: number,
    offerId: number,
    registererObject: PaymentPack | ConsumerPaymentPack,
    {
      notify_member,
      keep_credits,
    }: { notify_member: boolean, keep_credits: boolean },
    voucher?: number,
  ) => {
    if (registererObject.paymentPack) {
      this.props.createQuickUnevenInvoice(
        {
          paymentPackId: registererObject.paymentPack.id,
          offerId,
          keep_credits,
          notify_member,
          memberId,
          voucher,
        },
        offerId,
      );
    } else if (registererObject.consumerPaymentPack) {
      this.props.addBooking(
        registererObject.consumerPaymentPack.id,
        {
          keep_credits,
          notify_member,
          offer: offerId,
        },
        this.props.booking_ordering,
      );
    }
    this.props.clearSearch();
    if (this.props.optionToDiscard) {
      this.props.discardOption(this.props.optionToDiscard);
      this.props.cancelDiscardOption();
    }
    this.props.setMemberToRegister(null);
  };

  createInvoice = (invoiceData: any, memberId: number) => {
    this.props.createInvoice(invoiceData, memberId, null, this.props.offerId);
    this.closeQuickInvoice(memberId, invoiceData);
  };

  createMember = (data: *, options: OptionCallback) => {
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
      data.id,
      formData,
      {
        ...options,
        onSuccess: () => {
          getLatestMember()
            .then((res) => {
              this.props.fetchMember(res.data);
              this.props.setMemberToRegister({
                id: res.data,
                name: `${data.firstname} ${data.lastname}`,
                photo: data.photo,
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
    this.props.closeAddMemberModal();
  };

  handleBookingDeletion = (data: any, options: OptionCallback) => {
    this.props.deleteBooking(
      this.props.bookingToRevert.id,
      this.props.booking_ordering,
      {
        onSuccess: () => {
          this.props.closeRevertBookingDialog();
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        },
      },
      data,
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
          member: selectedMember,
        }
      : {
          memberName: selectedMember.name,
          memberId: selectedMember.id,
          id: selectedMember.id,
          member: selectedMember,
          creditAccount: selectedMember.credit_account_balance,
          invoiceItems: { offers: [offer] },
        };

    if (!isOpened) {
      this.setState((prevState: State) => ({
        quickInvoices: [...prevState.quickInvoices, quickInvoiceToAdd],
      }));
    }
    this.props.clearSearch();
  };

  render() {
    const {
      offer,
      bookingOptionsPending,
      classes,
      bookings,
      fullScreen,
      members,
    } = this.props;
    if (!this.props.offer) {
      return (
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <OfferNavigationHeader
              goToOffer={this.props.goToOffer}
              bookingLoading={this.props.bookingLoading}
              offer={offer}
              offerId={this.props.offerId}
              loading={this.props.offerLoading}
              offerLoading={this.props.offerLoading || !this.props.offer}
              goToCalendar={this.props.goToCalendar}
              refresh={() =>
                this.props.fetchOfferData(this.props.booking_ordering)
              }
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container direction="row" spacing={2}>
        {!!this.props.offer && this.props.bookerInAvanceDialog && (
          <RecurrenceRuleBookingFormDialog
            offerSet
            refresh={() => {
              this.props.fetchOfferData(this.props.booking_ordering);
              this.props.clearSearch();
              this.props.setMemberToRegister(null);
              this.props.setBookerInAvanceDialog(false);
            }}
            onClose={() => this.props.setBookerInAvanceDialog(false)}
            initial={{
              meta_activity: {
                id: this.props.offer.meta_activity_id,
                name: this.props.offer.name,
              },
              hour: moment(this.props.offer.date_start)
                .tz(this.props.offer.timezone_name)
                .hours(),
              minute: moment(this.props.offer.date_start)
                .tz(this.props.offer.timezone_name)
                .minutes(),
              day_of_week:
                moment(this.props.offer.date_start)
                  .tz(this.props.offer.timezone_name)
                  .isoWeekday() - 1,
            }}
            metaActivityList={this.props.metaActivities}
            onSubmit={(data, options) => {
              if (this.props.memberToRegister) {
                this.props.createRecurrenceRuleBooking(
                  { ...data, member: this.props.memberToRegister.id },
                  options,
                );
              }
            }}
          />
        )}
        <Grid item xs={12}>
          <OfferNavigationHeader
            goToOffer={this.props.goToOffer}
            bookingLoading={this.props.bookingLoading}
            offer={offer}
            offerId={this.props.offerId}
            loading={this.props.offerLoading}
            offerLoading={this.props.offerLoading || !this.props.offer}
            goToCalendar={this.props.goToCalendar}
            refresh={() =>
              this.props.fetchOfferData(this.props.booking_ordering)
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <BookingManagement
            registerToWaitingList={this.props.registerToWaitingList}
            addToQuickInvoicePanel={this.addToQuickInvoicePanel}
            loading={this.props.offerLoading}
            bookings={this.props.bookings}
            offer={this.props.offer}
            confirmBookingAttendance={this.props.confirmBookingAttendance}
            discardBookingAttendance={this.props.discardBookingAttendance}
            refresh={this.props.fetchOfferData}
            booking_ordering={this.props.booking_ordering}
            openAddMemberModal={this.props.openAddMemberModal}
            onChangeBookingOrdering={this.props.onChangeBookingOrdering}
            members={this.props.members}
            permission={this.props.permission}
            company_theme={this.props.company_theme}
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            bookingOptionsPending={this.props.bookingOptionsPending}
            openMailDialog={this.props.openCommunicationDialog}
            searchedText={this.props.searchedText}
            memberSearchLoading={this.props.memberSearchLoading}
            clearSearch={this.props.clearSearch}
            searchMembers={this.props.searchMembers}
            searchedMembers={this.props.searchedMembers}
            memberHistory={this.props.memberHistory}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            handleRevertBooking={this.props.handleRevertBooking}
            handleMemberToRegister={this.props.setMemberToRegister}
            revertQuickInvoiceAndRefreshOffer={
              this.props.revertQuickInvoiceAndRefreshOffer
            }
            registerOption={this.props.registerOption}
            discardOption={this.props.discardOption}
            switchWaitingListFreeze={this.props.switchWaitingListFreeze}
            recurrenceRuleBookingList={this.props.recurrenceRuleBooking}
            recurrentBookingCount={this.props.recurrentBookingCount}
            recurrentBookingItemPerPage={RECURRENT_BOOKING_PAGE_SIZE}
            recurrentBookingCurrentPage={this.props.recurrentBookingCurrentPage}
            recurrentBookingNextPage={this.props.recurrentBookingNextPage}
            recurrentBookingOnPageRequested={
              this.props.recurrentBookingOnPageRequested
            }
            goToMemberBooking={this.props.goToMemberBooking}
            onDeleteRecurrenceRuleBooking={
              this.props.onDeleteRecurrenceRuleBooking
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!this.props.offer.is_broadcast &&
            !!this.props.offer.broadcast_info && (
              <OfferBroadcastHelper offer={this.props.offer} />
            )}

          <QuickInvoicePanel
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            quickInvoices={this.state.quickInvoices}
            createInvoice={this.createInvoice}
            closeQuickInvoice={this.closeQuickInvoice}
            availableBuyableItems={this.props.availableBuyableItems}
            className={classes.autoScroll}
          />
          <Prompt
            when={this.props.unevenSavedInvoices.length > 0}
            message={this.props.t('offerManagement.unevenQuickInvoices')}
          />
        </Grid>
        {!!this.props.memberToRegister && (
          <BookerModuleManager
            offerId={this.props.offerId}
            offer={this.props.offer}
            member={this.props.memberToRegister}
            loading={this.props.compatiblePacksLoading}
            compatiblePacks={this.props.compatiblePacks}
            onCancel={() => this.props.setMemberToRegister(null)}
            onClose={() => this.props.setMemberToRegister(null)}
            registerToOffer={this.registerToOffer}
            setBookerInAvanceDialog={this.props.setBookerInAvanceDialog}
          />
        )}
        <Dialog
          fullScreen={fullScreen}
          open={!!this.props.addMemberModal}
          onClose={this.props.closeAddMemberModal}
        >
          <DialogContent>
            <MemberForm
              onCancel={this.props.closeAddMemberModal}
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
          bookingToRevert={this.props.bookingToRevert}
          closeRevertBookingDialog={this.props.closeRevertBookingDialog}
          offerIsAvailable={this.props.offer.available}
        />
        <DiscardBookingOptionDialog
          open={
            !!this.props.optionToDiscard && !!this.props.confirmOptionToDiscard
          }
          onSubmit={() => {
            this.props.discardOption(this.props.optionToDiscard, {
              onSuccess: () => {
                this.props.cancelDiscardOption();
              },
            });
          }}
          onClose={this.props.cancelDiscardOption}
        />
        {!!this.props.communicationDialogIsOpen && (
          <MailMembers
            fullscreen={fullScreen}
            bookingOptionsPending={bookingOptionsPending}
            bookings={bookings}
            openMailChoiceDialog={this.props.communicationDialogIsOpen}
            onClose={this.props.closeCommunicationDialog}
            members={members}
            mailMembers={this.props.mailMembers}
            mailDefaultTitle={this.props.offer ? this.props.offer.name : ''}
          />
        )}
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
  autoScroll: {
    overflowY: 'auto',
    [theme.breakpoints.up('lg')]: {
      height: `calc(100vh - ${theme.spacing(19)}px)`,
    },
  },
  voucherField: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
});

export default compose(
  withMobileDialog(),
  withStyles(styles),
  withTranslation(['offer', 'translation']),
  withStateHandlers(
    { bookingToRevert: null },
    {
      handleRevertBooking: () => (bookingToRevert) => ({ bookingToRevert }),
      closeRevertBookingDialog: () => () => ({ bookingToRevert: null }),
    },
  ),
  withState('bookerInAvanceDialog', 'setBookerInAvanceDialog', false),
  withState('memberToRegister', 'setMemberToRegister', null),
  withState('voucher', 'setVoucher', 0),
  withStateHandlers(
    {
      searchedText: '',
      addMemberModal: false,
      communicationDialogIsOpen: false,
      optionToDiscard: null,
      confirmOptionToDiscard: false,
    },
    {
      closeCommunicationDialog: () => () => ({
        communicationDialogIsOpen: false,
      }),
      openCommunicationDialog: () => () => ({
        communicationDialogIsOpen: true,
      }),
      closeAddMemberModal: () => () => ({ addMemberModal: false }),
      openAddMemberModal: () => () => ({
        searchedText: '',
        addMemberModal: true,
      }),
      clearSearch: () => () => ({ searchedText: '' }),
      searchMembers: (_, { searchMembers }) => (searchedText) => {
        searchMembers(searchedText);
        return { searchedText };
      },
      registerOption: (_, { setMemberToRegister }) => (optionId, member) => {
        setMemberToRegister(member);
        return {
          optionToDiscard: optionId,
          confirmOptionToDiscard: false,
        };
      },
      cancelDiscardOption: () => () => ({
        optionToDiscard: null,
        confirmOptionToDiscard: null,
      }),
    },
  ),

  withStateHandlers(
    ({ company_theme }) => ({
      booking_ordering: company_theme.default_booking_ordering,
    }),
    {
      onChangeBookingOrdering: (_, { fetchOfferData }) => (
        booking_ordering,
      ) => {
        fetchOfferData(booking_ordering);
        return {
          booking_ordering,
        };
      },
    },
  ),
  withHandlers({
    goToMemberBooking: () => (memberId) => {
      const url = `/member/${memberId}/bookings`;
      const win = window.open(url);
      win.focus();
    },
    onDeleteRecurrenceRuleBooking: ({
      deleteRecurrenceRuleBooking,
      fetchOfferData,
      clearSearch,
      setBookerInAvanceDialog,
      booking_ordering,
    }) => (id, data) => {
      deleteRecurrenceRuleBooking(id, data, {
        onSuccess: () => {
          fetchOfferData(booking_ordering);
          clearSearch();
          setBookerInAvanceDialog(false);
        },
      });
    },
    recurrentBookingOnPageRequested: ({
      fetchRecurrenceRuleBooking,
      fetchMemberBulk,
      offerId,
    }) => (page, page_size) => {
      fetchRecurrenceRuleBooking(
        { offer: offerId, page, page_size },
        {
          onSuccess: (recurrenceRuleList) => {
            if (recurrenceRuleList.length) {
              fetchMemberBulk({
                id__in: recurrenceRuleList.map((nr) => nr.member),
              });
            }
          },
        },
      );
    },
    revertQuickInvoiceAndRefreshOffer: ({
      booking_ordering,
      offerId,
      revertQuickInvoiceAndRefreshOffer,
    }) => (uuid) => {
      revertQuickInvoiceAndRefreshOffer(uuid, offerId, booking_ordering);
    },
  }),
)(OfferManagement);
