// @flow
import React, { Component } from 'react';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import { Prompt } from 'react-router-dom';
import moment from 'moment-timezone';
import uniqBy from 'lodash/uniqBy';

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
import { Offer, OfferStatus } from '../../libs/offer/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
} from '../../libs/spot-scheduling/types';
import OfferManagementRoomBlueprint from './OfferManagementRoomBlueprint.component';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '../../libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';
import DiscardBookingOptionDialogV2 from '../../libs/waiting-list/components/DiscardBookingOptionDialogV2.component';
import { MemberMap } from '../../libs/member/utils';
import { Tag, TagGroup } from '../../libs/tag/types';

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

  fetchInvoiceListUnpaid: () => void,

  goToOffer: (id: number) => void,

  members: Array<Member<Tag<TagGroup>>>,
  memberDetails: { [id: number]: Member },
  memberHistory: Array<Member>,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,
  compatiblePacks: Array<PaymentPack>,

  unpaidInvoiceList: Array<Invoice>,
  fetchInvoice: () => void,

  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  fetchShopItems: () => void,

  communicationDialogIsOpen: boolean,

  fetchEmailTemplatesSummaries: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  email_templates_list: Array<any>,
  email_templates_details: Array<any>,

  switchWaitingListFreeze: (offerId: number, newFreezeState: boolean) => void,
  fetchMember: (id: number) => void,
  registerToWaitingList: (offerId: number, memberId: number) => void,
  memberSearchLoading: boolean,
  searchMembers: (txt: string) => void,
  sendCommunication: (any) => void,

  establishmentList: Array<Establishment>,
  fetchEstablishmentList: () => void,

  searchedMembers: Array<Member>,
  confirmBookingAttendance: (bookingId: number) => void,
  discardBookingAttendance: (bookingId: number) => void,
  revertQuickInvoiceAndRefreshOffer: (uuid: string, offerId: number) => void,
  goToMember: (id: number) => void,

  snackbarSuccess: (string) => void,
  country: string,

  fetchRoomBlueprintDetail: (number) => void,
  roomBlueprintById: { [number]: RoomBlueprint },
  fetchAssetForBlueprint: (number) => void,
  fetchOfferStatus: (number) => void,
  offerStatusById: { [number]: OfferStatus },
  assetsForBlueprintById: { [number]: AssetForBlueprint },

  createMember: (id: ?number, data: [*], options: any, offerId: number) => void,
  createInvoice: ([any], number, number) => void,
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
  discardOption: (id: number, params: any, options: OptionCallback) => void,
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
    member: ?{
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
  payment_method_available_manager: number[],
  roomBlueprintById: { [key: string]: RoomBlueprint },
  assetsForBlueprintById: {
    [key: string]: { [key: string]: AssetForBlueprint },
  },
  offerStatusById: { [key: string]: OfferStatus },
  setSpotForBooking: () => void,
  optionToDiscardWithDialog: number,
  setOptionToDiscardWithDialog: (optionId: number | null) => void,
  waiver: string,
  general_terms_and_conditions: string,
  companyId: number,
  showVaccinationStatus: boolean,
};

type State = {
  quickInvoices: Array<QuickInvoice>, // put here non-saved invoice
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    unpaidInvoiceList: [],
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
    this.props.fetchEstablishmentList();
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

  closeQuickInvoice = (memberId: number) => {
    this.setState((prevState: State) => ({
      quickInvoices: prevState.quickInvoices.filter(
        (qi) => qi.memberId !== memberId,
      ),
    }));
  };

  registerToOffer = async (
    memberId: number,
    offerId: number | number[],
    registererObject: PaymentPack | ConsumerPaymentPack,
    {
      notify_member,
      keep_credits,
    }: { notify_member: boolean, keep_credits: boolean },
    voucher?: number,
    billingEstablishmentId?: number,
  ) => {
    let spot_id = null;
    if (this.props.offer.room_blueprint) {
      spot_id = await asyncSelectSpotForBlueprint();
      if (typeof spot_id !== 'number') {
        return;
      }
    }

    if (registererObject.paymentPack) {
      const offers_data = [];

      const ids = typeof offerId === 'number' ? [offerId] : offerId;

      ids.forEach((offer_id) => {
        const data = { offer_id, extra_data: {} };
        if (typeof spot_id === 'number') {
          data.extra_data.spot_id = spot_id;
        }
        offers_data.push(data);
      });

      this.props.createQuickUnevenInvoice(
        {
          paymentPackId: registererObject.paymentPack.id,
          offers_data,
          keep_credits,
          notify_member,
          is_v2: true,
          memberId,
          voucher,
          billing_establishment_id: billingEstablishmentId,
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
          spot_id,
        },
        this.props.booking_ordering,
      );
    }
    this.props.clearSearch();
    if (this.props.optionToDiscard) {
      this.props.discardOption(this.props.optionToDiscard, {
        disable_notification: true,
      });
      this.props.cancelDiscardOption();
    }
    this.props.setMemberToRegister(null);
  };

  createInvoice = (invoiceData: any, options: OptionCallback) => {
    this.props.createInvoice(invoiceData, this.props.offerId, {
      onSuccess: (invoice) => {
        this.setState((prevState) => ({
          unpaidInvoiceList: [invoice, ...prevState.unpaidInvoiceList],
        }));
        this.props.fetchInvoiceListUnpaid();
        this.closeQuickInvoice(invoice.member);
        if (options && options.onSuccess) options.onSuccess(invoice);
      },
      onError: options && options.onError,
    });
  };

  createMember = (data: any, options: OptionCallback) => {
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

  onClickChangeSpot = async (booking: Booking) => {
    const spot_id = await asyncSelectSpotForBlueprint();

    if (typeof spot_id === 'number') {
      this.props.setSpotForBooking(booking, spot_id);
    }
  };

  addToQuickInvoicePanel = (memberId: number) => {
    const { bookings, offer } = this.props;
    const { quickInvoices } = this.state;
    const isOpened = quickInvoices.find((qi) => qi.memberId === memberId);
    const selectedMember = this.props.members.find((m) => m.id === memberId);

    if (!selectedMember) {
      return;
    }
    this.props.fetchMember(selectedMember.id);
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

  openRecurrenceRuleForm = () => {
    this.props.fetchEstablishmentList();
    this.props.setBookerInAvanceDialog(true);
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
              establishment: this.props.offer.etablissement,
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
            establishmentList={this.props.establishmentList}
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
            company_theme={this.props.company_theme}
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
            discardOption={this.props.setOptionToDiscardWithDialog}
            switchWaitingListFreeze={this.props.switchWaitingListFreeze}
            recurrenceRuleBookingList={this.props.recurrenceRuleBooking}
            recurrentBookingCount={this.props.recurrentBookingCount}
            recurrentBookingItemPerPage={RECURRENT_BOOKING_PAGE_SIZE}
            recurrentBookingCurrentPage={this.props.recurrentBookingCurrentPage}
            unevenSavedInvoices={uniqBy(this.props.unpaidInvoiceList, 'uuid')}
            recurrentBookingNextPage={this.props.recurrentBookingNextPage}
            recurrentBookingOnPageRequested={
              this.props.recurrentBookingOnPageRequested
            }
            goToMemberBooking={this.props.goToMemberBooking}
            onDeleteRecurrenceRuleBooking={
              this.props.onDeleteRecurrenceRuleBooking
            }
            onClickChangeSpot={this.onClickChangeSpot}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          {!!this.props.offer.is_broadcast &&
            !!this.props.offer.broadcast_info && (
              <OfferBroadcastHelper offer={this.props.offer} />
            )}

          {!!this.props.offer.room_blueprint && (
            <OfferManagementRoomBlueprint
              offer={this.props.offer}
              roomBlueprintById={this.props.roomBlueprintById}
              assetsForBlueprintById={this.props.assetsForBlueprintById}
              offerStatusById={this.props.offerStatusById}
            />
          )}

          <QuickInvoicePanel
            unevenSavedInvoices={uniqBy(this.props.unpaidInvoiceList, 'uuid')}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            quickInvoices={this.state.quickInvoices}
            createInvoice={this.createInvoice}
            closeQuickInvoice={this.closeQuickInvoice}
            availableBuyableItems={this.props.availableBuyableItems}
            className={classes.autoScroll}
            refreshInvoice={this.props.fetchInvoice}
            availablePaymentMethodList={
              this.props.payment_method_available_manager
            }
            establishments={this.props.establishmentList}
            snackbarSuccess={this.props.snackbarSuccess}
            companyId={this.props.companyId}
            memberDetails={this.props.memberDetails}
          />
          <Prompt
            when={this.props.unpaidInvoiceList.length > 0}
            message={this.props.t('offerManagement.unevenQuickInvoices')}
          />
        </Grid>
        {!!this.props.memberToRegister && (
          <BookerModuleManager
            offerId={this.props.offerId}
            offer={this.props.offer}
            member={this.props.memberToRegister}
            memberDetails={this.props.memberDetails}
            loading={this.props.compatiblePacksLoading}
            compatiblePacks={this.props.compatiblePacks}
            onCancel={() => this.props.setMemberToRegister(null)}
            onClose={() => this.props.setMemberToRegister(null)}
            registerToOffer={this.registerToOffer}
            openRecurrenceRuleForm={this.openRecurrenceRuleForm}
          />
        )}
        <Dialog
          fullScreen={fullScreen}
          open={!!this.props.addMemberModal}
          onClose={this.props.closeAddMemberModal}
        >
          <DialogContent>
            <MemberForm
              asManager
              onCancel={this.props.closeAddMemberModal}
              onSubmit={this.createMember}
              goToMember={this.props.goToMember}
              goToMemberList={() => {}}
              snackbarSuccess={this.props.snackbarSuccess}
              country={this.props.country}
              waiver={this.props.company_theme.waiver}
              generalTermsAndConditions={
                this.props.company_theme.general_terms_and_conditions
              }
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
            this.props.discardOption(this.props.optionToDiscard, null, {
              onSuccess: () => {
                this.props.cancelDiscardOption();
              },
            });
          }}
          onClose={this.props.cancelDiscardOption}
        />

        <DiscardBookingOptionDialogV2
          open={!!this.props.optionToDiscardWithDialog}
          onSubmit={(sendEmail: boolean) => {
            this.props.discardOption(
              this.props.optionToDiscardWithDialog,
              { disable_notification: !sendEmail },
              {
                onSuccess: () => this.props.setOptionToDiscardWithDialog(null),
                onError: () => this.props.setOptionToDiscardWithDialog(null),
              },
            );
          }}
          onClose={() => this.props.setOptionToDiscardWithDialog(null)}
        />

        {!!this.props.communicationDialogIsOpen && (
          <MailMembers
            fetchEmailTemplatesSummaries={
              this.props.fetchEmailTemplatesSummaries
            }
            emails={this.props.email_templates_list}
            fetchEmailTemplateDetail={this.props.fetchEmailTemplateDetail}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            fullscreen={fullScreen}
            bookingOptionsPending={bookingOptionsPending}
            bookings={bookings}
            openMailChoiceDialog={this.props.communicationDialogIsOpen}
            onClose={this.props.closeCommunicationDialog}
            members={members}
            mailDefaultTitle={this.props.offer ? this.props.offer.name : ''}
            sendCommunication={this.props.sendCommunication}
          />
        )}

        {!!this.props.offer.room_blueprint && (
          <AsyncSpotSelector
            fetchRoomBlueprintDetail={this.props.fetchRoomBlueprintDetail}
            roomBlueprintById={this.props.roomBlueprintById}
            fetchAssetForBlueprint={this.props.fetchAssetForBlueprint}
            fetchOfferStatus={this.props.fetchOfferStatus}
            fetchOfferById={this.props.fetchOffer}
            offer={this.props.offer}
            offerStatusById={this.props.offerStatusById}
            assetsForBlueprintById={this.props.assetsForBlueprintById}
          />
        )}
      </Grid>
    );
  }
}

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
      optionToDiscardWithDialog: null,
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
      searchMembers:
        (_, { searchMembers }) =>
        (searchedText) => {
          searchMembers(searchedText);
          return { searchedText };
        },
      registerOption:
        (_, { setMemberToRegister }) =>
        (optionId, member) => {
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
      setOptionToDiscardWithDialog: () => (optionId) => ({
        optionToDiscardWithDialog: optionId,
      }),
    },
  ),

  withStateHandlers(
    ({ company_theme }) => ({
      booking_ordering: company_theme.default_booking_ordering,
    }),
    {
      onChangeBookingOrdering:
        (_, { fetchOfferData }) =>
        (booking_ordering) => {
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
    onDeleteRecurrenceRuleBooking:
      ({
        deleteRecurrenceRuleBooking,
        fetchOfferData,
        clearSearch,
        setBookerInAvanceDialog,
        booking_ordering,
      }) =>
      (id, data) => {
        deleteRecurrenceRuleBooking(id, data, {
          onSuccess: () => {
            fetchOfferData(booking_ordering);
            clearSearch();
            setBookerInAvanceDialog(false);
          },
        });
      },
    recurrentBookingOnPageRequested:
      ({ fetchRecurrenceRuleBooking, fetchMemberBulk, offerId }) =>
      (page, page_size) => {
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
    revertQuickInvoiceAndRefreshOffer:
      ({ booking_ordering, offerId, revertQuickInvoiceAndRefreshOffer }) =>
      (uuid) => {
        revertQuickInvoiceAndRefreshOffer(uuid, offerId, booking_ordering);
      },
  }),
)(OfferManagement);
