// @flow
import React, { Component } from 'react';

import { compose, withStateHandlers, withState } from 'recompose';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import { withTranslation } from 'react-i18next';

import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import RegisterMemberToOfferForm from './RegisterMemberToOfferForm.component';
import MailMembers from './MailMembers.component';

import MemberForm from '../../libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '../../libs/member/api';
import DiscardBookingOptionDialog from '../../libs/waiting-list/components/DiscardBookingOptionDialog.component';

import BookingManagement from './BookingManagement.component';
import OfferNavigationHeader from './OfferNavigationHeader.component';
import OfferBroadcastHelper from './OfferBroadcastHelper.component';

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
  addBooking: (offerId: number, consumerPaymentPackId: number) => void,
  discardOption: (id: number) => void,
  deleteBooking: (bookingId: number) => void,

  fetchOffer: (id: number) => void,
  fetchOfferData: (id: number) => void,

  goToCalendar: (date: any) => void,
  availableBuyableItems: {
    [buyable_item_identifier: number]: Array<BuyableItem>,
  },

  handleRevertBooking: (Booking) => void,

  classes: Object,
  company_theme: Object,

  setMemberToRegister: ({
    name: string,
    photo: ?string,
    id: number,
  }) => void,
  memberToRegister: ?{
    name: string,
    photo: ?string,
    id: number,
  },
  bookingToRevert: ?Booking,
  closeRevertBookingDialog: () => void,
  booking_ordering: number,
  onChangeBookingOrdering: (number) => void,
};

type State = {
  quickInvoices: [*], // put here non-saved invoice
  quickInvoiceEdit: [*], // put here invoice to edit
  addMemberModal: boolean,
  mailClients: boolean,
  optionToDiscard: ?number,
  searchedText: string,
  communicationDialogIsOpen: boolean,
  receivers: Object,
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    addMemberModal: false,
    optionToDiscard: null,
    confirmOptionToDiscard: null,
    searchedText: '',
    keep_credits: false,
    notify_member: false,
  };

  componentWillMount() {
    this.props.resetQuickInvoices();
  }

  componentDidMount() {
    this.props.fetchOfferData(this.props.booking_ordering);
    this.props.fetchShopItems();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
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
    this.props.setMemberToRegister(null);
  };

  searchMembers = (searchedText) => {
    this.setState({ searchedText });
    this.props.searchMembers(searchedText);
  };

  registerMember = async (consumerPaymentPackId: number) => {
    this.props.addBooking(
      this.props.offerId,
      consumerPaymentPackId,
      this.state.keep_credits,
      this.props.booking_ordering,
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
    this.props.setMemberToRegister(null);
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
    this.setState({ addMemberModal: false });
  };

  openAddMemberModal = () => {
    this.setState({ addMemberModal: true });
    this.clearSearch();
  };

  closeAddMemberModal = () => {
    this.setState({ addMemberModal: false });
  };

  handleBookingDeletion = (options) => {
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
      this.setState((prevState) => ({
        quickInvoices: [...prevState.quickInvoices, quickInvoiceToAdd],
      }));
    }
    this.clearSearch();
  };

  clearSearch = () => this.setState({ searchedText: '' });

  openCommunicationDialog = () =>
    this.setState({ communicationDialogIsOpen: true });

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
            refresh={() =>
              this.props.fetchOfferData(this.props.booking_ordering)
            }
            booking_ordering={this.props.booking_ordering}
            openAddMemberModal={this.openAddMemberModal}
            onChangeBookingOrdering={this.props.onChangeBookingOrdering}
            members={this.props.members}
            permission={this.props.permission}
            company_theme={this.props.company_theme}
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            bookingOptionsPending={this.props.bookingOptionsPending}
            openMailDialog={this.openCommunicationDialog}
            searchedText={this.state.searchedText}
            memberSearchLoading={this.props.memberSearchLoading}
            clearSearch={this.clearSearch}
            searchMembers={this.searchMembers}
            searchedMembers={this.props.searchedMembers}
            memberHistory={this.props.memberHistory}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            handleRevertBooking={this.props.handleRevertBooking}
            handleMemberToRegister={this.props.setMemberToRegister}
            revertQuickInvoiceAndRefreshOffer={
              this.props.revertQuickInvoiceAndRefreshOffer
            }
            registerOption={(bookingOptionId, member) => {
              this.props.setMemberToRegister(member);
              this.setState({
                optionToDiscard: bookingOptionId,
                confirmOptionToDiscard: null,
              });
            }}
            discardOption={(bookingOptionId) => {
              this.setState({
                optionToDiscard: bookingOptionId,
                confirmOptionToDiscard: true,
              });
            }}
            switchWaitingListFreeze={this.props.switchWaitingListFreeze}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!this.props.offer.is_broadcast &&
            !!this.props.offer.broadcast_info && (
              <OfferBroadcastHelper offer={this.props.offer} />
            )}

          <QuickInvoicePanel
            unevenSavedInvoices={this.props.unevenSavedInvoices}
            revertQuickInvoice={(uuid) =>
              this.props.revertQuickInvoiceAndRefreshOffer(
                uuid,
                this.props.offerId,
                this.props.booking_ordering,
              )
            }
            quickInvoices={this.state.quickInvoices}
            createInvoice={this.createInvoice}
            closeQuickInvoice={this.closeQuickInvoice}
            saveQuickInvoice={this.saveQuickInvoice}
            availableBuyableItems={this.props.availableBuyableItems}
            className={classes.autoScroll}
          />
        </Grid>
        {!!this.props.memberToRegister && (
          <RegisterMemberToOfferForm
            offerId={this.props.offerId}
            member={this.props.memberToRegister}
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
            onCancel={() => this.props.setMemberToRegister(null)}
            onClose={() => this.props.setMemberToRegister(null)}
            subscribeToOffer={this.registerMember}
            subscribeToPackAndOffer={(paymentPackId) =>
              this.registerMemberAndOpenUnevenInvoice(
                this.props.memberToRegister.id,
                paymentPackId,
                this.state.keep_credits,
                this.state.notify_member,
              )
            }
          />
        )}
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
          bookingToRevert={this.props.bookingToRevert}
          closeRevertBookingDialog={this.props.closeRevertBookingDialog}
          offerIsAvailable={this.props.offer.available}
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
        {!!this.state.communicationDialogIsOpen && (
          <MailMembers
            fullscreen={fullScreen}
            bookingOptionsPending={bookingOptionsPending}
            bookings={bookings}
            openMailChoiceDialog={this.state.communicationDialogIsOpen}
            onClose={() => this.setState({ communicationDialogIsOpen: false })}
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
  withState('memberToRegister', 'setMemberToRegister', null),
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
)(OfferManagement);
