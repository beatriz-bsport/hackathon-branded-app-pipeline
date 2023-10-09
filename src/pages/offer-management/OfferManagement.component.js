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

import { withTranslation, TFunction } from 'react-i18next';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic';
import { mapFormData } from '../form.utils';

import QuickInvoicePanel from './QuickInvoicePanel.component';
import RevertBookingDialog from '#libs/booking/components/RevertBookingDialog.component';
import BookerModuleManager from './BookerModuleManager.component';
import MailMembers from './MailMembers.component';

import MemberForm from '#libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '#libs/member/api';
import DiscardBookingOptionDialog from '#libs/waiting-list/components/DiscardBookingOptionDialog.component';

import BookingManagement from './BookingManagement.component';
import OfferNavigationHeader from './OfferNavigationHeader.component';
import OfferBroadcastHelper from './OfferBroadcastHelper.component';
import RecurrenceRuleBookingFormDialog from '#libs/booking/components/RecurrenceRuleBookingFormDialog.component';

import type {
  PaymentPack,
  ConsumerPaymentPack,
} from '#libs/payment-packs/types';
import type { Booking, BookingOption } from '#libs/booking/types';
import type { Member } from '#libs/member/types';
import type { Invoice } from '#libs/invoice/types';
import type { WaitingListConfiguration } from '#libs/waiting-list/type';
import { Offer, OfferStatus } from '#libs/offer/types';
import { AssetForBlueprint, RoomBlueprint } from '#libs/spot-scheduling/types';
import OfferManagementRoomBlueprint from './OfferManagementRoomBlueprint.component';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '#libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';
import DiscardBookingOptionDialogV2 from '#libs/waiting-list/components/DiscardBookingOptionDialogV2.component';
import { MemberMap } from '#libs/member/utils';
import { Tag, TagGroup } from '#libs/tag/types';
import GenericDialog from '#components/genericDialog/GenericDialog';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import { OptionCallback } from '../../state/types';
import CommunicationDrawer from '#libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_OFFER } from '#libs/communication-v2/constants';
import { getOfferCategories } from '#libs/communication-v2/utils';
import { DEFAULT_SPOT_TYPE } from '#libs/spot-scheduling/utils';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import type { StripeReader } from '#libs/terminal/types';
import Config from '../../config';
import MemberProgramDetailDialog from '#libs/performance-tracking/components/member-program/MemberProgramDetail.dialog';
import ConfirmationRollCallDialog from '#libs/offer/components/ConfirmationRollCallDialog.component';

const RECURRENT_BOOKING_PAGE_SIZE = 10;

type Props = {
  goToMemberBooking: (memberId: number, bookingId?: number) => void,
  t: TFunction,
  fullScreen: boolean,
  offerId: number,
  offer: ?Offer,
  offerLoading: boolean,
  bookingLoading: ?boolean,

  fetchInvoiceListUnpaid: () => void,
  registerToOffer: () => void,
  goToOffer: (id: number) => void,

  members: Array<Member<Tag<TagGroup>>>,
  memberDetails: { [id: number]: Member },
  memberHistory: Array<Member>,
  bookingOptionsPending: Array<BookingOption>,
  bookings: Array<Booking>,

  unpaidInvoiceList: Array<Invoice>,
  fetchInvoice: () => void,
  fetchInvoiceItemList: (params: any) => void,
  quickCreatedInvoices: Array<Invoice>,

  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  fetchShopItems: () => void,
  fetchCompanyUserRoles: () => void,

  communicationDialogIsOpen: boolean,
  communicationDrawerIsOpen: boolean,

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

  createMember: (id: ?number, data: [*], options: any, offerId: number) => void,
  createInvoice: ([any], number, number) => void,
  discardOption: (
    bookingOptionId: number,
    params: any,
    options: OptionCallback,
    offerId: number,
  ) => void,
  deleteBooking: (bookingId: number, data: any) => void,

  fetchOffer: (id: number, options: OptionCallback) => void,
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
  openCommunicationDrawer: () => void,
  closeCommunicationDrawer: () => void,
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

  fetchBookingsByConsumerPack: (
    consumer_payment_pack: number,
    page: number,
    page_size: number,
    options?: OptionCallback,
  ) => void,
  fetchVideoPurchase: {
    page: number,
    page_size: number,
    params: any,
    options?: OptionCallback,
  },
  fetchProgram: (params: any) => void,
  updateMemberMetricValue: (data: any, options: OptionCallback) => void,
  createMemberProgram: (data: any, options?: any) => void,
  fetchPerformanceTrackingData: (member: number) => void,
  programList: PerformanceTrackingProgram[],
  programDataLoading: boolean,
  consumerGiftcardList: ConsumerGiftcard<Giftcard>[],
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void,

  activityGroups: number,

  fetchGroupsOfferList: () => {},
  fetchLevelList: ({
    company: number,
  }) => void,
  fetchAssociatedCoachesList: (params: any) => void,
  fetchSpotForBlueprint: (company: number) => void,
  spotTypes: SpotType[],
  resolvedGenericTags: ResolvedGenericTags,
  fetchStripeReaders: () => void,
  stripeReaders: StripeReader[],
  memberProgramIdsList: (memberId: number) => MemberProgram[],
  resetInvoiceList: () => void,
  postRollCall: (offerId: number, options?: OptionCallback) => void,
  rollCallLoading: boolean,
  getUnreadAnswersCountAction: (params: CommunicationContext) => void,
  numberOfUnreadAnswers: number,
  fetchBookingsByOffer: (offerId: number) => void,
  fetchCompanyWaitlistConfiguration: (companyId: number) => void,
  waitingListConfiguration: WaitingListConfiguration,
  bookingOptionPositionById: {
    [key: number]: OfferStatusWaitingListPosition,
  },
};

type State = {
  quickInvoices: QuickInvoice[], // put here non-saved invoice
  unpaidInvoiceList: Invoice[],
  isMemberProgramDetailDialogOpen: boolean,
  memberIdFocused: null | number,
  openConfirmationRollCallDialog: boolean,
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    unpaidInvoiceList: [],
    isMemberProgramDetailDialogOpen: false,
    memberIdFocused: null,
    openConfirmationRollCallDialog: false,
  };

  componentDidMount() {
    const params = {
      context_identifier: CONTEXT_OFFER,
      context_object_id: this.props.offerId,
    };
    this.fetchOfferAndData();
    this.props.fetchProgram({ is_disabled: false }); // WILL BECOME USELESS
    this.props.fetchShopItems();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchCompanyUserRoles();
    if (this.props.offer) {
      this.props.fetchMetaActivityBulk([this.props.offer.meta_activity_id]);
    }
    this.props.fetchEstablishmentList();
    this.props.fetchLevelList({
      company: this.props.company_theme.company,
    });
    this.props.fetchSpotForBlueprint({
      company: this.props.company_theme.company,
    });
    this.props.fetchStripeReaders();
    this.props.getUnreadAnswersCountAction(params);
    this.props.fetchCompanyWaitlistConfiguration(
      this.props.company_theme.company,
    );
  }

  fetchOfferAndData = () => {
    this.props.resetInvoiceList();
    this.props.fetchOffer(this.props.offerId, {
      onSuccess: (data) => {
        const coach_id =
          data && data.coach && data.coach.id ? data.coach.id : null;
        const coach_override_id =
          data && data.coach_override && data.coach_override.id
            ? data.coach_override.id
            : null;
        this.props.fetchAssociatedCoachesList({
          id__in: [coach_id, coach_override_id],
        });
      },
    });
    this.props.fetchOfferData(this.props.booking_ordering);
  };

  componentDidUpdate(prevProps: Props) {
    if (!!this.props.offerId && this.props.offerId !== prevProps.offerId) {
      this.fetchOfferAndData();
    }
    if (
      this.props.quickCreatedInvoices.length &&
      this.props.quickCreatedInvoices.length >
        prevProps.quickCreatedInvoices.length
    ) {
      this.props.fetchInvoiceItemList({
        invoice__uuid__in: this.props.quickCreatedInvoices.map(
          (inv) => inv.uuid,
        ),
      });
    }
  }

  closeQuickInvoice = (memberId: number) => {
    this.setState((prevState: State) => ({
      quickInvoices: prevState.quickInvoices.filter(
        (qi) => qi.memberId !== memberId,
      ),
    }));
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
        data.state ||
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
      delete data.state;
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
          if (options && options.onSuccess) {
            options.onSuccess();
          }
          this.props.closeRevertBookingDialog();
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

  closeBookerModule = () => this.props.setMemberToRegister(null);

  getMembersWithStatusOk = () =>
    this.props.bookings
      .filter((b) => b.booking_status_code === BOOKING_STATUS_OK.id)
      .map((b) => this.props.members.find((m) => m.id === b.member));

  handleCreateMemberProgram = (id) =>
    this.props.createMemberProgram({
      program: id,
      member: this.state.memberIdFocused,
    });

  changeMemberCallback = () => {
    this.props.fetchPerformanceTrackingData(this.state.memberIdFocused);
  };

  /**
   * Retrieves the index of the member after an arrow click (previous or next)
   * @param {number} currentMemberIndex - The index of the current member in perf tracking dialog
   * @param {(1|-1)} indicator
   * @returns {number}
   */
  getPerformanceTrackingDialogMemberIndex = (currentMemberIndex, indicator) => {
    const membersCount = this.getMembersWithStatusOk().length;

    // if last member of the list return the first member index
    if (currentMemberIndex + indicator === membersCount) {
      return 0;
    }
    // if first member of the list return the last member index
    if (currentMemberIndex + indicator < 0) {
      return membersCount - 1;
    }
    return currentMemberIndex + indicator;
  };

  /**
   * Updates the memberIdFocused state so we can fetch the current associated performance tracking data
   * @param {(1|-1)} indicator - The number that indicates if we should pick the next or the previous member in the list
   */
  handleChangeMember = (indicator: number) => {
    const currentMemberIndex =
      this.getMembersWithStatusOk()?.findIndex(
        (e) => e.id === this.state.memberIdFocused,
      ) ?? 0;

    const newCurrentMemberIndex = this.getPerformanceTrackingDialogMemberIndex(
      currentMemberIndex,
      indicator,
    );

    // set the new member id in state so we can fetch its data
    this.setState(
      {
        memberIdFocused:
          this.getMembersWithStatusOk()[newCurrentMemberIndex]?.id ?? 0,
      },
      this.changeMemberCallback,
    );
  };

  onProgramDetailsClick = (member) => {
    this.props.fetchPerformanceTrackingData(member.id);
    this.setState({
      memberIdFocused: member.id,
      isMemberProgramDetailDialogOpen: true,
    });
  };

  refreshNavigationHeader = () =>
    this.props.fetchOfferData(this.props.booking_ordering);

  closeMemberProgramDetailDialog = () =>
    this.setState({
      isMemberProgramDetailDialogOpen: false,
    });

  refreshRecurrenceRuleBookingFormDialog = () => {
    this.props.fetchOfferData(this.props.booking_ordering);
    this.props.clearSearch();
    this.props.setMemberToRegister(null);
    this.props.setBookerInAvanceDialog(false);
  };

  discardBookingOptionDialogOnSubmit = () => {
    this.props.discardOption(
      this.props.optionToDiscard,
      {},
      {
        onSuccess: () => {
          this.props.cancelDiscardOption();
        },
      },
      this.props.offerId,
    );
  };

  handleCloseCommunicationDrawer = () => {
    this.props.closeCommunicationDrawer();
  };

  postRollCall = (options?: OptionCallback) => {
    this.props.postRollCall(this.props.offerId, {
      onSuccess: () => {
        this.props.fetchOffer(this.props.offerId, {
          onSuccess: () => this.props.fetchBookingsByOffer(this.props.offerId),
        });
        options?.onSuccess();
      },
      onError: options?.onError,
    });
  };

  openConfirmationRollCallDialog = () => {
    this.setState({ openConfirmationRollCallDialog: true });
  };

  closeConfirmationRollCallDialog = () => {
    this.setState({ openConfirmationRollCallDialog: false });
  };

  render() {
    const {
      offer,
      bookingOptionsPending,
      classes,
      bookings,
      fullScreen,
      members,
      numberOfUnreadAnswers,
    } = this.props;

    if (!this.props.offer) {
      return (
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <OfferNavigationHeader
              bookingLoading={this.props.bookingLoading}
              goToCalendar={this.props.goToCalendar}
              goToOffer={this.props.goToOffer}
              loading={this.props.offerLoading}
              offer={offer}
              offerId={this.props.offerId}
              offerLoading={this.props.offerLoading || !this.props.offer}
              refresh={this.refreshNavigationHeader}
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container direction="row" spacing={2}>
        <ConfirmationRollCallDialog
          isLoading={this.props.rollCallLoading}
          nbRollCallsLeftToValidate={1}
          onCancel={this.closeConfirmationRollCallDialog}
          onConfirm={this.postRollCall}
          open={this.state.openConfirmationRollCallDialog}
        />
        <MemberProgramDetailDialog
          booking={this.props.bookings?.find(
            (b) => b?.member === this.state.memberIdFocused,
          )}
          changeMember={this.handleChangeMember}
          closeDialog={this.closeMemberProgramDetailDialog}
          createMemberProgram={this.handleCreateMemberProgram}
          loading={this.props.programDataLoading}
          memberProgramList={this.props.memberProgramIdsList(
            this.state.memberIdFocused,
          )}
          members={this.props.members}
          open={this.state.isMemberProgramDetailDialogOpen}
          programList={this.props.programList}
          updateMemberMetricValue={this.props.updateMemberMetricValue}
        />

        {!!this.props.offer && this.props.bookerInAvanceDialog && (
          <RecurrenceRuleBookingFormDialog
            offerSet
            establishmentList={this.props.establishmentList}
            fetchGroupsOfferList={this.props.fetchGroupsOfferList}
            hasActivityGroups={this.props.activityGroups > 0}
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
            onClose={() => this.props.setBookerInAvanceDialog(false)}
            onSubmit={(data, options) => {
              if (this.props.memberToRegister) {
                this.props.createRecurrenceRuleBooking(
                  { ...data, member: this.props.memberToRegister.id },
                  options,
                );
              }
            }}
            refresh={this.refreshRecurrenceRuleBookingFormDialog}
          />
        )}
        <Grid item xs={12}>
          <OfferNavigationHeader
            bookingLoading={this.props.bookingLoading}
            goToCalendar={this.props.goToCalendar}
            goToOffer={this.props.goToOffer}
            loading={this.props.offerLoading}
            offer={offer}
            offerId={this.props.offerId}
            offerLoading={this.props.offerLoading || !this.props.offer}
            refresh={this.refreshNavigationHeader}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          <BookingManagement
            addToQuickInvoicePanel={this.addToQuickInvoicePanel}
            booking_ordering={this.props.booking_ordering}
            bookingOptionPositionById={this.props.bookingOptionPositionById}
            bookingOptionsPending={this.props.bookingOptionsPending}
            bookings={this.props.bookings}
            clearSearch={this.props.clearSearch}
            companyId={this.props.companyId}
            confirmBookingAttendance={this.props.confirmBookingAttendance}
            createMemberProgram={this.props.createMemberProgram}
            discardBookingAttendance={this.props.discardBookingAttendance}
            discardOption={this.props.setOptionToDiscardWithDialog}
            displayPositionInWaitingList={
              this.props.waitingListConfiguration?.display_member_position &&
              this.props.waitingListConfiguration?.dynamic ===
                WAITING_LIST_DYNAMIC_ORDERED
            }
            fetchBookingsByConsumerPack={this.props.fetchBookingsByConsumerPack}
            fetchPerformanceTrackingData={
              this.props.fetchPerformanceTrackingData
            }
            fetchVideoPurchase={this.props.fetchVideoPurchase}
            goToMemberBooking={this.props.goToMemberBooking}
            handleMemberToRegister={this.props.setMemberToRegister}
            handleRevertBooking={this.props.handleRevertBooking}
            isRollCallMandatory={
              this.props.company_theme.is_roll_call_mandatory
            }
            loading={this.props.offerLoading}
            memberHistory={this.props.memberHistory}
            members={this.props.members}
            memberSearchLoading={this.props.memberSearchLoading}
            numberOfUnreadAnswers={numberOfUnreadAnswers}
            offer={this.props.offer}
            onChangeBookingOrdering={this.props.onChangeBookingOrdering}
            onClickChangeSpot={this.onClickChangeSpot}
            onDeleteRecurrenceRuleBooking={
              this.props.onDeleteRecurrenceRuleBooking
            }
            onProgramDetailsClick={this.onProgramDetailsClick}
            onRollCallButtonClick={this.openConfirmationRollCallDialog}
            openAddMemberModal={this.props.openAddMemberModal}
            openCommunicationDrawer={this.props.openCommunicationDrawer}
            openMailDialog={this.props.openCommunicationDialog}
            programDataLoading={this.props.programDataLoading}
            programList={this.props.programList}
            quickCreatedInvoices={this.props.quickCreatedInvoices}
            recurrenceRuleBookingList={this.props.recurrenceRuleBooking}
            recurrentBookingCount={this.props.recurrentBookingCount}
            recurrentBookingCurrentPage={this.props.recurrentBookingCurrentPage}
            recurrentBookingItemPerPage={RECURRENT_BOOKING_PAGE_SIZE}
            recurrentBookingNextPage={this.props.recurrentBookingNextPage}
            recurrentBookingOnPageRequested={
              this.props.recurrentBookingOnPageRequested
            }
            refresh={this.props.fetchOfferData}
            registerOption={this.props.registerOption}
            registerToWaitingList={this.props.registerToWaitingList}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            revertQuickInvoiceAndRefreshOffer={
              this.props.revertQuickInvoiceAndRefreshOffer
            }
            searchedMembers={this.props.searchedMembers}
            searchedText={this.props.searchedText}
            searchMembers={this.props.searchMembers}
            showVaccinationStatus={this.props.showVaccinationStatus}
            switchWaitingListFreeze={this.props.switchWaitingListFreeze}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          {!!this.props.offer.is_broadcast &&
            !!this.props.offer.broadcast_info && (
              <OfferBroadcastHelper offer={this.props.offer} />
            )}

          {!!this.props.offer.room_blueprint && (
            <OfferManagementRoomBlueprint
              assetsForBlueprintById={this.props.assetsForBlueprintById}
              fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
              offer={this.props.offer}
              offerStatusById={this.props.offerStatusById}
              roomBlueprintById={this.props.roomBlueprintById}
              spotTypes={this.props.spotTypes}
            />
          )}

          <QuickInvoicePanel
            applyGiftcardOnInvoice={this.props.applyGiftcardOnInvoice}
            availableBuyableItems={this.props.availableBuyableItems}
            availablePaymentMethodList={
              this.props.payment_method_available_manager
            }
            cardBillingDetailsMandatory={
              this.props.company_theme.force_billing_details_on_cards
            }
            className={classes.autoScroll}
            closeQuickInvoice={this.closeQuickInvoice}
            companyId={this.props.companyId}
            consumerGiftcardList={this.props.consumerGiftcardList}
            createInvoice={this.createInvoice}
            enableMultiLocalization={
              this.props.company_theme.enable_multi_localization
            }
            establishments={this.props.establishmentList}
            memberDetails={this.props.memberDetails}
            onlinePaymentEnabled={
              this.props.company_theme.online_payment_enabled
            }
            quickInvoices={this.state.quickInvoices}
            refreshInvoice={this.props.fetchInvoice}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            snackbarSuccess={this.props.snackbarSuccess}
            stripeId={this.props.company_theme.stripe_id}
            stripeReaders={this.props.stripeReaders}
            unevenSavedInvoices={this.props.unpaidInvoiceList}
          />
          <Prompt
            message={this.props.t('offerManagement.unevenQuickInvoices')}
            when={this.props.unpaidInvoiceList.length > 0}
          />
        </Grid>
        {!!this.props.memberToRegister && (
          <BookerModuleManager
            member={this.props.memberToRegister}
            memberDetails={this.props.memberDetails}
            offer={this.props.offer}
            offerId={this.props.offerId}
            onCancel={this.closeBookerModule}
            onClose={this.closeBookerModule}
            openRecurrenceRuleForm={this.openRecurrenceRuleForm}
            registerToOffer={this.props.registerToOffer}
          />
        )}
        <Dialog
          fullScreen={fullScreen}
          onClose={this.props.closeAddMemberModal}
          open={!!this.props.addMemberModal}
        >
          <DialogContent>
            <MemberForm
              asManager
              companyCountry={this.props.country}
              generalTermsAndConditions={
                this.props.company_theme.general_terms_and_conditions
              }
              goToMember={this.props.goToMember}
              onCancel={this.props.closeAddMemberModal}
              onSubmit={this.createMember}
              snackbarSuccess={this.props.snackbarSuccess}
              waiver={this.props.company_theme.waiver}
            />
          </DialogContent>
        </Dialog>
        <RevertBookingDialog
          bookingToRevert={this.props.bookingToRevert}
          closeRevertBookingDialog={this.props.closeRevertBookingDialog}
          handleBookingDeletion={this.handleBookingDeletion}
          offer={this.props.offer}
          offerIsAvailable={this.props.offer.available}
        />
        <DiscardBookingOptionDialog
          onClose={this.props.cancelDiscardOption}
          onSubmit={this.discardBookingOptionDialogOnSubmit}
          open={
            !!this.props.optionToDiscard && !!this.props.confirmOptionToDiscard
          }
        />
        <DiscardBookingOptionDialogV2
          onClose={() => this.props.setOptionToDiscardWithDialog(null)}
          onSubmit={(sendEmail: boolean) => {
            this.props.discardOption(
              this.props.optionToDiscardWithDialog,
              { disable_notification: !sendEmail },
              {
                onSuccess: () => this.props.setOptionToDiscardWithDialog(null),
                onError: () => this.props.setOptionToDiscardWithDialog(null),
              },
              this.props.offerId,
            );
          }}
          open={!!this.props.optionToDiscardWithDialog}
        />
        {!!this.props.communicationDialogIsOpen && (
          <MailMembers
            bookingOptionsPending={bookingOptionsPending}
            bookings={bookings}
            emailDetailLoading={this.props.emailDetailLoading}
            emailDetails={this.props.email_templates_details}
            emailListLoading={this.props.emailListLoading}
            emails={this.props.email_templates_list}
            fetchEmailTemplateDetail={this.props.fetchEmailTemplateDetail}
            fetchEmailTemplatesSummaries={
              this.props.fetchEmailTemplatesSummaries
            }
            fullscreen={fullScreen}
            mailDefaultTitle={this.props.offer ? this.props.offer.name : ''}
            members={members}
            onClose={this.props.closeCommunicationDialog}
            openMailChoiceDialog={this.props.communicationDialogIsOpen}
            resolvedGenericTags={this.props.resolvedGenericTags}
            sendCommunication={this.props.sendCommunication}
          />
        )}
        {!!this.props.offer.room_blueprint && (
          <AsyncSpotSelector
            assetsForBlueprintById={this.props.assetsForBlueprintById}
            fetchAssetForBlueprint={this.props.fetchAssetForBlueprint}
            fetchOfferById={this.props.fetchOffer}
            fetchOfferStatus={this.props.fetchOfferStatus}
            fetchRoomBlueprintDetail={this.props.fetchRoomBlueprintDetail}
            offer={this.props.offer}
            offerStatusById={this.props.offerStatusById}
            onCancelRegisterMember={() => this.props.setMemberToRegister(null)}
            roomBlueprintById={this.props.roomBlueprintById}
            spotTypes={this.props.spotTypes.concat(DEFAULT_SPOT_TYPE)}
          />
        )}
        {!!this.props.offer &&
          !!this.props.communicationDrawerIsOpen &&
          (Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
            Config.REACT_APP_SENTRY_ENVIRONMENT === 'local' ||
            Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
            this.props.companyId === 498) && (
            <CommunicationDrawer
              allMemberCategoryList={getOfferCategories(
                this.props.t,
                bookings,
                bookingOptionsPending,
              )}
              contextIdentifier={CONTEXT_OFFER}
              contextObjectId={this.props.offer.id ?? this.props.offerId}
              contextTitle={this.props.offer?.name}
              onDrawerClose={this.handleCloseCommunicationDrawer}
              openDrawer={this.props.communicationDrawerIsOpen}
            />
          )}
        <GenericDialog />
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
  withTranslation(['offer', 'translation', 'communication']),
  withStateHandlers(
    { bookingToRevert: null },
    {
      handleRevertBooking:
        (_, { offer, fetchSimilarFuturBookingInGroup }) =>
        (bookingToRevert) => {
          if (offer?.group) {
            fetchSimilarFuturBookingInGroup(
              offer.group.id,
              bookingToRevert.member,
            );
          }
          return { bookingToRevert };
        },
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
      communicationDrawerIsOpen: false,
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
      closeCommunicationDrawer: () => () => ({
        communicationDrawerIsOpen: false,
      }),
      openCommunicationDrawer: () => () => ({
        communicationDrawerIsOpen: true,
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
    goToMemberBooking: () => (memberId: number, bookingId?: number) => {
      const url = `/member/${memberId}/bookings/${
        bookingId ? `${bookingId}` : ''
      }`;
      const win = window.open(url);
      win.focus();
    },
    registerToOffer:
      ({
        t,
        createQuickUnevenInvoice,
        addBooking,
        booking_ordering,
        clearSearch,
        optionToDiscard,
        discardOption,
        cancelDiscardOption,
        setMemberToRegister,
        offer,
      }) =>
      async (
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
        if (!Array.isArray(offerId)) {
          let fullOfferConfirmation = false;
          if (offer?.is_full && !registererObject.paymentPack) {
            fullOfferConfirmation = await showDeleteDialog(
              t('maximumNumber'),
              t('maximumNumberDescription', {
                effectif: offer.effectif,
              }),
            );
          }
          if (
            fullOfferConfirmation ||
            !offer?.is_full ||
            registererObject.paymentPack
          ) {
            let spot_id = null;
            if (offer.room_blueprint) {
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
              createQuickUnevenInvoice(
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
              addBooking(
                registererObject.consumerPaymentPack.id,
                {
                  keep_credits,
                  notify_member,
                  offer: offerId,
                  spot_id,
                },
                booking_ordering,
              );
            }

            clearSearch();
            if (optionToDiscard) {
              discardOption(
                optionToDiscard,
                {
                  disable_notification: true,
                  update_waiting_list: false, // the waiting list will already be updated on the creation of the booking, no need to do it twice
                },
                {},
                offer.id,
              );
              cancelDiscardOption();
            }
            setMemberToRegister(null);
          } else {
            clearSearch();
            setMemberToRegister(null);
          }
        } else {
          let spot_id = null;
          if (offer.room_blueprint) {
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
            createQuickUnevenInvoice(
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
            addBooking(
              registererObject.consumerPaymentPack.id,
              {
                keep_credits,
                notify_member,
                offer: offerId,
                spot_id,
              },
              booking_ordering,
            );
          }

          clearSearch();
          if (optionToDiscard) {
            discardOption(
              optionToDiscard,
              {
                disable_notification: true,
              },
              {},
              offer.id,
            );
            cancelDiscardOption();
          }
          setMemberToRegister(null);
        }
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
