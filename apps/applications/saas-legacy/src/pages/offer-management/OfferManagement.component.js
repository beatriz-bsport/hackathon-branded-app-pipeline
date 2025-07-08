// @flow
import React, { Component } from 'react';
import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import { Prompt } from 'react-router-dom';
import { DateTime } from 'luxon';
import uniq from 'lodash/uniq';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { withTranslation, TFunction } from 'react-i18next';

import {
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_OK,
} from '@bsport/common/lib/master-data/booking_status_code.js';
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic.js';
import RecurrenceRuleOfferFormDialog from '#src/libs/booking/components/RecurrenceRuleOfferFormDialog.component';

import RevertBookingDialog from '#src/libs/booking/components/RevertBookingDialog.component';
import RefundBookingDialog from '#src/libs/booking/components/RefundBookingDialog.component';

import MemberForm from '#src/libs/member/MemberForm.component';
import { getLatest as getLatestMember } from '#src/libs/member/api';
import DiscardBookingOptionDialog from '#src/libs/waiting-list/components/DiscardBookingOptionDialog.component';

import RecurrenceRuleBookingFormDialog from '#src/libs/booking/components/RecurrenceRuleBookingFormDialog.component';

import WaitinglistAutoBookingInfoDialog from '#src/libs/waiting-list/components/Dialogs/WaitinglistAutoBookingInfoDialog.component';
import WaitingListAutoBookingLoadingDialog from '#src/libs/waiting-list/components/Dialogs/WaitingListAutoBookingLoadingDialog.component';
import WaitingListAutoBookingIncompleteDialog from '#src/libs/waiting-list/components/Dialogs/WaitingListAutoBookingIncompleteDialog.component';
import WaitingListAutoBookingFeedbackDialog from '#src/libs/waiting-list/components/Dialogs/WaitingListAutoBookingFeedbackDialog.component';
import WaitinglistAutoBookingWarningDialog from '#src/libs/waiting-list/components/Dialogs/WaitinglistAutoBookingWarningDialog.component';

import type {
  PaymentPack,
  ConsumerPaymentPack,
} from '#src/libs/payment-packs/types';
import type {
  Booking,
  BookingOption,
  BookingREST,
} from '#src/libs/booking/types';
import type { Member } from '#src/libs/member/types';
import type {
  Invoice,
  InvoiceConfigurationSerializer,
} from '#src/libs/invoice/types';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import type {
  OfferEdit,
  Offer,
  OfferDataListItem,
  OfferStatus,
} from '#src/libs/offer/types';
import type {
  AssetForBlueprint,
  RoomBlueprint,
} from '#src/libs/spot-scheduling/types';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '#src/libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';
import DiscardBookingOptionDialogV2 from '#src/libs/waiting-list/components/DiscardBookingOptionDialogV2.component';
import { MemberMap } from '#src/libs/member/utils';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import GenericDialog from '#src/components/genericDialog/GenericDialog';
import {
  DialogActionEnum,
  showActionDialog,
} from '#src/components/genericDialog/CustomDialogs';

import CommunicationDrawer from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_OFFER } from '#src/libs/communication-v2/constants';
import { getOfferCategories } from '#src/libs/communication-v2/utils';
import { DEFAULT_SPOT_TYPE } from '#src/libs/spot-scheduling/utils';
import type { StripeReader } from '#src/libs/terminal/types';
import MemberProgramDetailDialog from '#src/libs/performance-tracking/components/member-program/MemberProgramDetail.dialog';
import ConfirmationRollCallDialog from '#src/libs/offer/components/ConfirmationRollCallDialog.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import SessionNotePad from '#src/libs/offer/components/SessionNotePad';
import type { InternalPaymentPayload } from '../../libs/payment/types';
import ObjectLevelPermissionWrapper from '../../libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { getActivityWorkshopPermission } from '../../libs/role/permission-utils/utils';
import type {
  OptionCallback,
  OptionBackgroundCallback,
} from '../../state/types';
import OfferManagementRoomBlueprint from './OfferManagementRoomBlueprint.component';
import type { WaitingListConfiguration } from '#src/libs/waiting-list/types';
import OfferBroadcastHelper from './OfferBroadcastHelper.component';
import OfferNavigationHeader from './OfferNavigationHeader.component';
import BookingManagement from './BookingManagement.component';
import BookerModuleManager from './BookerModuleManager.component';
import QuickInvoicePanel from './QuickInvoicePanel.component';
import { mapFormData } from '../form.utils';
import { openNewBackOfficeWindow } from '#src/utils/windows';

const RECURRENT_BOOKING_PAGE_SIZE = 10;

const AUTOBOOKING_DIALOGS = {
  info: 'info',
  loading: 'loading',
  incomplete: 'incomplete',
  feedBack: 'feedBack',
  warning: 'warning',
};

type Props = {
  goToMemberBooking: (memberId: number, bookingId?: number) => void,
  t: TFunction,
  fullScreen: boolean,
  offerId: number,
  offer?: Offer,
  offerLoading: boolean,
  bookingLoading?: boolean,

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

  fetchInvoiceConfiguration: () => void,
  invoiceConfiguration: InvoiceConfigurationSerializer,
  isInvoiceConfigurationLoading: boolean,
  isCustomDiscountReasonRequired: boolean,

  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  fetchShopItems: () => void,
  fetchCompanyUserRoles: () => void,

  communicationDrawerIsOpen: boolean,

  switchWaitingListFreeze: (offerId: number, newFreezeState: boolean) => void,
  fetchMember: (id: number) => void,
  registerToWaitingList: (offerId: number, memberId: number) => void,
  memberSearchLoading: boolean,
  searchMembers: (txt: string) => void,

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

  createMember: (
    id?: number,
    data: [any],
    options: any,
    offerId: number,
  ) => void,
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

  setMemberToRegister: (member?: {
    name: string,
    photo?: string,
    id: number,
  }) => void,
  memberToRegister?: {
    name: string,
    photo?: string,
    id: number,
  },
  bookingToRevert?: Booking,
  closeRevertBookingDialog: () => void,
  booking_ordering: number,
  onChangeBookingOrdering: (number) => void,
  searchedText: string,
  optionToDiscard: number,
  confirmOptionToDiscard?: boolean,
  cancelDiscardOption: () => void,
  registerOption: (optionId: number, member: number) => void,

  clearSearch: () => void,
  closeAddMemberModal: () => void,
  openAddMemberModal: () => void,

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
  fetchLevelList: ({ company: number }) => void,
  fetchAssociatedCoachesList: (params: any) => void,
  fetchSpotForBlueprint: (company: number) => void,
  spotTypes: SpotType[],
  fetchStripeReaders: () => void,
  stripeReaders: StripeReader[],
  memberProgramIdsList: (memberId: number) => MemberProgram[],
  resetInvoiceList: () => void,
  postRollCall: (offerId: number, options?: OptionCallback) => void,
  rollCallLoading: boolean,
  numberOfUnreadAnswers: number,
  fetchBookingsByOffer: (offerId: number) => void,
  fetchCompanyWaitlistConfiguration: (companyId: number) => void,
  getOfferMetaActivity: (metaActivityId: number) => MetaActivity,
  waitingListConfiguration: WaitingListConfiguration,
  bookingOptionPositionById: {
    [key: number]: OfferStatusWaitingListPosition,
  },
  getInvoicePaymentGroupIsProcessing: (invoiceUuid: string) => boolean,
  submitInternalPaymentInBackground: (
    paymentGroupId: number,
    invoiceUuid: string,
    data: InternalPaymentPayload,
    options?: OptionBackgroundCallback<
      { paymentGroupId: number, invoiceUuid: string },
      { paymentGroupId: number, invoiceUuid: string },
    >,
  ) => void,
  openAutoBookingDialog: (openedDialogType: string) => void,
  autoBookingDialogOpened: string,
  closeAllAutoBookingDialogs: () => void,
  registerMultipleOptions: (bookingOptionsIds: number[]) => void,
  isAutoBookingError: boolean,
  isAutoBookingLoading: Boolean,
  setUnregisteredSelectedBookingOptions: (bookingOptionsIds: number[]) => void,
  unregisteredSelectedBookingOptions: number[],
  getBookingOptionToRegisterData: () => void,
  setIsAutoBookingError: (isAutoBookingError: boolean) => void,

  registeredSelectedBookingOptions: Array<number>,
  fetchAllEstablishmentBillingGroup: (_: {
    params: { company: number },
  }) => void,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  updateInternalNote: (
    offerId: number,
    data: OfferEdit,
    options: OptionCallback<Offer>,
  ) => void,
  retrieveOfferWithCancelledBookings: (
    recurrenceRuleBookingId: number,
    options?: OptionCallback<Offer[]>,
  ) => void,
  offersWithCancelledBookings: OfferDataListItem[],
  offersWithCancelledBookingsIdsList: number[],
  offersWithCancelledBookingsLoading: boolean,
  updateOfferWithCancelledBookingsToRetry: (
    recurrenceRuleBookingId: number,
    offer_ids: number[],
    options: OptionCallback<number>,
  ) => void,
  updateOffersToRetryLoading: boolean,
  getBookingOffer?: (offerId: number) => Offer,
  isRefundBookingLoading: boolean,
  refundBookingAsManager: (
    id: number,
    options?: OptionCallback<BookingREST>,
  ) => void,
  selectedBookingForRefund: number | null,
  setSelectedBookingForRefund: () => void,
};

type State = {
  quickInvoices: QuickInvoice[], // put here non-saved invoice
  unpaidInvoiceList: Invoice[],
  isMemberProgramDetailDialogOpen: boolean,
  memberIdFocused: null | number,
  openConfirmationRollCallDialog: boolean,
  recurrentBookingId: number | null,
  isOffersDialogOpen: boolean | null,
};

export class OfferManagement extends Component<Props, State> {
  state = {
    quickInvoices: [],
    unpaidInvoiceList: [],
    isMemberProgramDetailDialogOpen: false,
    memberIdFocused: null,
    openConfirmationRollCallDialog: false,
    recurrentBookingId: null,
    isOffersDialogOpen: false,
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
    if (!this.props.offer && this.props.offerId) {
      this.fetchOfferAndData();
    }
    this.props.fetchEstablishmentList();
    this.props.fetchLevelList({
      company: this.props.company_theme.company,
    });
    this.props.fetchSpotForBlueprint({
      company: this.props.company_theme.company,
    });
    this.props.fetchStripeReaders();
    this.props.fetchCompanyWaitlistConfiguration(
      this.props.company_theme.company,
    );
    this.props.fetchInvoiceConfiguration();
    if (this.props.company_theme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyId },
      });
    }
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
    if (
      this.props.offer &&
      this.props.offer?.meta_activity_id !== prevProps.offer?.meta_activity_id
    ) {
      this.props.fetchMetaActivityBulk([this.props.offer.meta_activity_id]);
    }
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

  setRecurrentBookingId = (id: number) => {
    this.setState({ recurrentBookingId: id });
  };

  setIsOffersDialogOpen = (value: boolean) => {
    this.setState({ isOffersDialogOpen: value });
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
      delete data.address_line_1;

      delete data.address_line_2;

      delete data.city;

      delete data.zipcode;

      delete data.state;

      delete data.country;
    }
    if (!data.birthday) {
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

  closeBookerModule = () => {
    if (this.props.unregisteredSelectedBookingOptions.length) {
      this.props.closeAllAutoBookingDialogs();
    }
    this.props.setMemberToRegister(null);
    this.props.setUnregisteredSelectedBookingOptions([]);
  };

  handleCloseBookerModule = () => {
    if (this.props.unregisteredSelectedBookingOptions.length) {
      this.openAutoBookingWarningDialog();
    } else {
      this.closeBookerModule();
    }
  };

  handleCancelBookerModule = () => {
    const data = this.props.getBookingOptionToRegisterData();
    this.props.registerOption(
      data?.bookingOptionBeingProcessed?.id ?? null,
      data?.memberToRegister ?? null,
    );
  };

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

  handleSelectAllBookingOptions = () => {
    const availableBookingOptionsIds =
      this.props.bookingOptionsPending
        ?.filter((bookingOption) => !bookingOption.cancelled)
        .map((availableBookingOption) => availableBookingOption?.id) ?? [];
    this.props.setUnregisteredSelectedBookingOptions(
      availableBookingOptionsIds,
    );
  };

  handleUnselectAllBookingOptions = () => {
    this.props.setUnregisteredSelectedBookingOptions([]);
  };

  handleCheckBookingOption = (bookingOptionId: number) => {
    this.props.setUnregisteredSelectedBookingOptions((prevState) => [
      ...prevState,
      bookingOptionId,
    ]);
  };

  handleUncheckBookingOption = (bookingOptionId: number) => {
    this.props.setUnregisteredSelectedBookingOptions((prevState) =>
      prevState.filter(
        (selectedBookingOptionId) =>
          selectedBookingOptionId !== bookingOptionId,
      ),
    );
  };

  onCloseAutoBookingDialogs = () => {
    this.props.setIsAutoBookingError(false);
    this.props.closeAllAutoBookingDialogs();
  };

  openAutoBookingInfoDialog = () => {
    this.props.openAutoBookingDialog(AUTOBOOKING_DIALOGS.info);
  };

  openAutoBookingLoadingDialog = () => {
    this.props.openAutoBookingDialog(AUTOBOOKING_DIALOGS.loading);
  };

  openAutoBookingFeedbackDialog = () => {
    this.props.openAutoBookingDialog(AUTOBOOKING_DIALOGS.feedBack);
  };

  openAutoBookingWarningDialog = () => {
    this.props.openAutoBookingDialog(AUTOBOOKING_DIALOGS.warning);
  };

  handleAutoBook = () => {
    this.props.registerMultipleOptions(
      this.props.unregisteredSelectedBookingOptions,
    );
  };

  launchBookingOptionRegistrationBulk = () => {
    const bookingOptionBeingProcessed =
      this.props.bookingOptionsPending?.find(
        (bookingOption) =>
          bookingOption.id ===
          this.props.unregisteredSelectedBookingOptions?.[0],
      ) ?? {};
    const memberToRegister = this.props.members?.find(
      (member) => member.id === bookingOptionBeingProcessed.member,
    );
    if (memberToRegister) {
      this.props.registerOption(bookingOptionBeingProcessed.id, {
        name: memberToRegister.name,
        photo: memberToRegister.photo,
        id: memberToRegister.id,
      });
    }
    this.onCloseAutoBookingDialogs();
  };

  getMemberRegisteredAutomatically = () => {
    return this.props.registeredSelectedBookingOptions.map((bo) =>
      this.props.members?.find(
        (member) =>
          member.id ===
            (
              this.props.bookingOptionsPending?.find(
                (bookingOption) => bookingOption.id === bo,
              ) ?? {}
            ).member ?? null,
      ),
    );
  };

  getMemberNotRegisteredAutomatically = () =>
    this.props.unregisteredSelectedBookingOptions.map((bo) =>
      this.props.members?.find(
        (member) =>
          member.id ===
            (
              this.props.bookingOptionsPending?.find(
                (bookingOption) => bookingOption.id === bo,
              ) ?? {}
            ).member ?? null,
      ),
    );

  handleEditInternalNote = (
    values: { internalNote: string },
    options: OptionCallback,
  ) => {
    this.props.updateInternalNote(
      this.props.offerId,
      { internal_note: values.internalNote },
      options,
    );
  };

  setRecurrentBookingId = (id: number) => {
    this.setState({ recurrentBookingId: id });
  };

  setIsOffersDialogOpen = (value: boolean) => {
    this.setState({ isOffersDialogOpen: value });
  };

  onSubmitRetryOfferWithCancelledBookings = (offerIdsToRetry: number[]) => {
    this.props.updateOfferWithCancelledBookingsToRetry(
      this.state.recurrentBookingId,
      offerIdsToRetry,
      {
        onSuccess: () => {
          this.setRecurrentBookingId(null);
          this.setIsOffersDialogOpen(false);
          this.refreshRecurrenceRuleBookingFormDialog();
        },
        onError: () => {
          this.setRecurrentBookingId(null);
          this.setIsOffersDialogOpen(false);
          this.refreshRecurrenceRuleBookingFormDialog();
        },
      },
    );
  };

  handleCloseRefundBookingDialog = () => {
    this.props.setSelectedBookingForRefund(null);
  };

  handleOpenRefundBookingDialog = (
    id: number,
    isConsumerPaymentPackUnlimited: boolean,
  ) => {
    this.props.setSelectedBookingForRefund({
      id,
      isUnlimited: isConsumerPaymentPackUnlimited,
    });
  };

  handleRefundBooking = () => {
    !!this.props.selectedBookingForRefund?.id &&
      this.props.refundBookingAsManager(
        this.props.selectedBookingForRefund?.id,
        {
          onSuccess: () => {
            this.props.setSelectedBookingForRefund(null);
            this.props.fetchOfferData(this.props.booking_ordering);
          },
        },
      );
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

    const isAutoBookingInfoDialogOpened =
      this.props.autoBookingDialogOpened === AUTOBOOKING_DIALOGS.info;

    const isAutoBookingLoadingDialogOpened =
      this.props.autoBookingDialogOpened === AUTOBOOKING_DIALOGS.loading;

    const isAutoBookingFeedbackDialogOpened =
      this.props.autoBookingDialogOpened === AUTOBOOKING_DIALOGS.feedBack;

    const isAutoBookingIncompleteDialogOpened =
      this.props.autoBookingDialogOpened === AUTOBOOKING_DIALOGS.incomplete;

    const isAutoBookingWarningDialogOpened =
      this.props.autoBookingDialogOpened === AUTOBOOKING_DIALOGS.warning;

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
        <WaitinglistAutoBookingInfoDialog
          isLoading={this.props.isAutoBookingLoading}
          onClose={this.onCloseAutoBookingDialogs}
          onConfirm={this.handleAutoBook}
          open={isAutoBookingInfoDialogOpened}
        />
        <WaitingListAutoBookingLoadingDialog
          open={isAutoBookingLoadingDialogOpened}
        />
        <WaitingListAutoBookingIncompleteDialog
          onClose={this.onCloseAutoBookingDialogs}
          onContinueBookingOptions={this.launchBookingOptionRegistrationBulk}
          open={isAutoBookingIncompleteDialogOpened}
          registeredMemberList={this.getMemberRegisteredAutomatically()}
          unregisteredMemberList={this.getMemberNotRegisteredAutomatically()}
        />
        <WaitingListAutoBookingFeedbackDialog
          isDisabled={this.props.offerLoading}
          isError={this.props.isAutoBookingError}
          onClose={this.onCloseAutoBookingDialogs}
          open={isAutoBookingFeedbackDialogOpened}
        />
        <WaitinglistAutoBookingWarningDialog
          onClose={this.onCloseAutoBookingDialogs}
          onConfirm={this.closeBookerModule}
          open={isAutoBookingWarningDialogOpened}
        />
        <ConfirmationRollCallDialog
          isLoading={this.props.rollCallLoading}
          nbRollCallsLeftToValidate={1}
          onCancel={this.closeConfirmationRollCallDialog}
          onConfirm={this.postRollCall}
          open={this.state.openConfirmationRollCallDialog}
        />
        <ObjectLevelPermissionProvider
          requiredPermission={[
            'reservation.activity.allowed_actions.editPerformance',
            'reservation.workshop.allowed_actions.editPerformance',
          ]}
        >
          {(
            hasActivityEditPerformancePermission,
            hasWorkshopEditPerformancePermission,
          ) => (
            <MemberProgramDetailDialog
              booking={this.props.bookings?.find(
                (booking) => booking?.member === this.state.memberIdFocused,
              )}
              changeMember={this.handleChangeMember}
              closeDialog={this.closeMemberProgramDetailDialog}
              createMemberProgram={this.handleCreateMemberProgram}
              isPreventUpdateMetricValue={
                !getActivityWorkshopPermission(
                  this.props.getOfferMetaActivity(
                    this.props.offer?.meta_activity_id,
                  ),
                  hasActivityEditPerformancePermission,
                  hasWorkshopEditPerformancePermission,
                )
              }
              loading={this.props.programDataLoading}
              memberProgramList={this.props.memberProgramIdsList(
                this.state.memberIdFocused,
              )}
              members={this.props.members}
              open={this.state.isMemberProgramDetailDialogOpen}
              programList={this.props.programList}
              updateMemberMetricValue={this.props.updateMemberMetricValue}
            />
          )}
        </ObjectLevelPermissionProvider>
        {!!this.props.offer &&
          this.props.bookerInAvanceDialog &&
          !this.state.isOffersDialogOpen && (
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
                hour: DateTime.fromISO(this.props.offer.date_start).setZone(
                  this.props.offer.timezone_name,
                ).hour,
                minute: DateTime.fromISO(this.props.offer.date_start).setZone(
                  this.props.offer.timezone_name,
                ).minute,
                day_of_week:
                  DateTime.fromISO(this.props.offer.date_start).setZone(
                    this.props.offer.timezone_name,
                  ).weekday - 1,
              }}
              metaActivityList={this.props.metaActivities}
              offersWithCancelledBookingsLoading={
                this.props.offersWithCancelledBookingsLoading
              }
              onClose={() => this.props.setBookerInAvanceDialog(false)}
              onSubmit={(data, options) => {
                if (this.props.memberToRegister) {
                  this.props.createRecurrenceRuleBooking(
                    { ...data, member: this.props.memberToRegister.id },
                    {
                      onSuccess: (
                        createdRecurrenceRuleBooking: RecurrenceRuleBooking,
                      ) => {
                        this.setRecurrentBookingId(
                          createdRecurrenceRuleBooking.id,
                        );
                        this.props.retrieveOfferWithCancelledBookings(
                          createdRecurrenceRuleBooking.id,
                          {
                            onSuccess: (offers: Offer[]) => {
                              if (offers?.length) {
                                const coach_ids = offers.map(
                                  (offerFetched) => offerFetched.coach,
                                );
                                const coach_override_ids = offers.map(
                                  (offerFetched) => offerFetched.coach_override,
                                );
                                this.props.fetchAssociatedCoachesList({
                                  id__in: uniq([
                                    ...coach_ids,
                                    ...coach_override_ids,
                                  ]),
                                });
                                this.setIsOffersDialogOpen(true);
                              } else {
                                this.props.setBookerInAvanceDialog(false);
                                this.refreshRecurrenceRuleBookingFormDialog();
                              }
                            },
                          },
                        );
                        options?.onSuccess?.();
                      },
                      onError: () => {
                        options?.onError?.();
                      },
                    },
                  );
                }
              }}
            />
          )}
        {this.state.isOffersDialogOpen && (
          <RecurrenceRuleOfferFormDialog
            allOfferIds={this.props.offersWithCancelledBookingsIdsList}
            loading={this.props.updateOffersToRetryLoading}
            offers={this.props.offersWithCancelledBookings}
            onSubmit={this.onSubmitRetryOfferWithCancelledBookings}
            open={this.state.isOffersDialogOpen}
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
            getBookingOffer={this.props.getBookingOffer}
            getOfferMetaActivity={this.props.getOfferMetaActivity}
            goToMemberBooking={this.props.goToMemberBooking}
            handleCheckBookingOption={this.handleCheckBookingOption}
            handleMemberToRegister={this.props.setMemberToRegister}
            handleOpenRefundBookingDialog={this.handleOpenRefundBookingDialog}
            handleRevertBooking={this.props.handleRevertBooking}
            handleSelectAllBookingOptions={this.handleSelectAllBookingOptions}
            handleUncheckBookingOption={this.handleUncheckBookingOption}
            handleUnselectAllBookingOptions={
              this.handleUnselectAllBookingOptions
            }
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
            onClickAutoBook={this.openAutoBookingInfoDialog}
            onClickChangeSpot={this.onClickChangeSpot}
            onDeleteRecurrenceRuleBooking={
              this.props.onDeleteRecurrenceRuleBooking
            }
            onProgramDetailsClick={this.onProgramDetailsClick}
            onRollCallButtonClick={this.openConfirmationRollCallDialog}
            openAddMemberModal={this.props.openAddMemberModal}
            openCommunicationDrawer={this.props.openCommunicationDrawer}
            openMailDialog={this.props.openCommunicationDrawer}
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
            selectedBookingOptionsIds={
              this.props.unregisteredSelectedBookingOptions
            }
            switchWaitingListFreeze={this.props.switchWaitingListFreeze}
          />
        </Grid>
        <Grid item className={classes.autoScroll} lg={6} xs={12}>
          {!!this.props.offer.is_broadcast &&
            !!this.props.offer.broadcast_info && (
              <OfferBroadcastHelper offer={this.props.offer} />
            )}

          <SessionNotePad
            withPaper
            initialValue={this.props.offer?.internal_note}
            isLoading={this.props.offerLoading}
            onSubmit={this.handleEditInternalNote}
            permissionType={
              this.props.getOfferMetaActivity(this.props.offer.meta_activity_id)
                ?.is_workshop
                ? 'workshop'
                : 'activity'
            }
          />

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
            closeQuickInvoice={this.closeQuickInvoice}
            companyId={this.props.companyId}
            consumerGiftcardList={this.props.consumerGiftcardList}
            createInvoice={this.createInvoice}
            displayNewWebshop={!!this.props.company_theme?.display_new_webshop}
            enableMultiLocalization={
              this.props.company_theme.enable_multi_localization
            }
            establishmentBillingGroups={this.props.establishmentBillingGroups}
            getInvoicePaymentGroupIsProcessing={
              this.props.getInvoicePaymentGroupIsProcessing
            }
            isCustomDiscountReasonRequired={
              this.props.isCustomDiscountReasonRequired
            }
            isInvoiceConfigurationLoading={
              this.props.isInvoiceConfigurationLoading
            }
            memberDetails={this.props.memberDetails}
            onlinePaymentEnabled={
              this.props.company_theme.online_payment_enabled
            }
            quickInvoices={this.state.quickInvoices}
            refreshInvoice={this.props.fetchInvoice}
            revertQuickInvoice={this.props.revertQuickInvoiceAndRefreshOffer}
            snackbarSuccess={this.props.snackbarSuccess}
            stripePaymentElementConfig={{
              isDefaultForRegion:
                this.props.company_theme.is_default_for_region,
              stripeId: this.props.company_theme.stripe_id,
            }}
            stripeReaders={this.props.stripeReaders}
            submitInternalPaymentInBackground={
              this.props.submitInternalPaymentInBackground
            }
            unevenSavedInvoices={this.props.unpaidInvoiceList}
          />
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="billing.allowed_actions.readInvoices"
          >
            <Prompt
              message={this.props.t('offerManagement.unevenQuickInvoices')}
              when={this.props.unpaidInvoiceList.length > 0}
            />
          </ObjectLevelPermissionWrapper>
        </Grid>
        {!!this.props.memberToRegister && (
          <BookerModuleManager
            isAutoBooking={
              !!this.props.unregisteredSelectedBookingOptions.length
            }
            isCustomDiscountReasonRequired={
              this.props.invoiceConfiguration
                ?.is_custom_discount_reason_required
            }
            member={this.props.memberToRegister}
            memberDetails={this.props.memberDetails}
            offer={this.props.offer}
            offerId={this.props.offerId}
            onCancel={this.handleCancelBookerModule}
            onClose={this.handleCloseBookerModule}
            openRecurrenceRuleForm={this.openRecurrenceRuleForm}
            openWarningDialog={this.openAutoBookingWarningDialog}
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
          hideEmailOption={
            this.props.bookingToRevert?.booking_status_code ===
            BOOKING_STATUS_CANCELLED_BY_CONSUMER.id
          }
          hideRefundOption={this.props.bookingToRevert?.was_refunded}
          offer={this.props.offer}
          offerIsAvailable={this.props.offer.available}
        />
        <RefundBookingDialog
          isConsumerPaymentPackUnlimited={
            this.props.selectedBookingForRefund?.isUnlimited
          }
          isLoading={this.props.isRefundBookingLoading}
          isOpen={!!this.props.selectedBookingForRefund}
          onClose={this.handleCloseRefundBookingDialog}
          onSubmit={this.handleRefundBooking}
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
        />{' '}
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
        {!!this.props.offer && !!this.props.communicationDrawerIsOpen && (
          <CommunicationDrawer
            allMemberCategoryList={getOfferCategories(
              this.props.t,
              bookings,
              bookingOptionsPending,
            )}
            communicationIdentifier={CONTEXT_OFFER}
            communicationObjectId={this.props.offer.id ?? this.props.offerId}
            communicationTitle={this.props.offer?.name}
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
      height: `calc(100vh - ${theme.spacing(17)}px)`,
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
  withState('isAutoBookingLoading', 'setIsAutoBookingLoading', false),
  withState('isAutoBookingError', 'setIsAutoBookingError', false),
  withState('selectedBookingForRefund', 'setSelectedBookingForRefund', null),
  withState(
    'unregisteredSelectedBookingOptions',
    'setUnregisteredSelectedBookingOptions',
    [],
  ),
  withState(
    'registeredSelectedBookingOptions',
    'setRegisteredSelectedBookingOptions',
    [],
  ),
  withStateHandlers(
    {
      searchedText: '',
      addMemberModal: false,
      communicationDrawerIsOpen: false,
      optionToDiscard: null,
      optionToDiscardWithDialog: null,
      confirmOptionToDiscard: false,
      autoBookingDialogOpened: '',
    },
    {
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
      openAutoBookingDialog: () => (openedDialogType: string) => ({
        autoBookingDialogOpened: openedDialogType,
      }),
      closeAllAutoBookingDialogs: () => () => ({
        autoBookingDialogOpened: '',
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
    getBookingOptionToRegisterData:
      ({
        bookingOptionsPending,
        unregisteredSelectedBookingOptions,
        setUnregisteredSelectedBookingOptions,
        members,
      }) =>
      (): {
        memberToRegister: null | Member,
        bookingOptionBeingProcessed: BookingOption,
      } => {
        if (!unregisteredSelectedBookingOptions?.length) return {};
        const unregisteredBookingOptionsToBeProcessed =
          unregisteredSelectedBookingOptions.filter(
            (bookingOption) =>
              bookingOption !== unregisteredSelectedBookingOptions[0],
          );
        setUnregisteredSelectedBookingOptions(
          unregisteredBookingOptionsToBeProcessed,
        );
        const bookingOptionBeingProcessed =
          bookingOptionsPending?.find(
            (bookingOption) =>
              bookingOption.id === unregisteredBookingOptionsToBeProcessed[0],
          ) ?? {};
        const memberToRegister =
          members?.find(
            (member) => member.id === bookingOptionBeingProcessed.member,
          ) ?? null;
        return { memberToRegister, bookingOptionBeingProcessed };
      },
  }),
  withHandlers({
    registerOptionOnAutoBooking:
      ({
        getBookingOptionToRegisterData,
        registerOption,
        setMemberToRegister,
      }) =>
      () => {
        const data = getBookingOptionToRegisterData?.() ?? {};
        if (!!data.memberToRegister && !!data.bookingOptionBeingProcessed) {
          registerOption(data.bookingOptionBeingProcessed.id, {
            name: data.memberToRegister.name,
            photo: data.memberToRegister.photo,
            id: data.memberToRegister.id,
          });
        } else {
          setMemberToRegister(null);
        }
      },
  }),
  withHandlers({
    goToMemberBooking: () => (memberId: number, bookingId?: number) => {
      const url = `/member/${memberId}/bookings/${
        bookingId ? `${bookingId}` : ''
      }`;
      openNewBackOfficeWindow(url);
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
        offer,
        registerOptionOnAutoBooking,
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
        voucherReason?: string,
        establishmentBillingGroupId?: number,
      ) => {
        if (!Array.isArray(offerId)) {
          let fullOfferConfirmation = false;
          if (
            // We don't trust offer.is_full field, as it takes into account the waiting list's convertible options.
            // The relevant figure in this case is the real number of available bookings left.
            offer?.nb_bookings >= offer?.effectif &&
            !registererObject.paymentPack
          ) {
            fullOfferConfirmation = await showActionDialog(
              t('maximumNumber'),
              t('maximumNumberDescription', {
                effectif: offer.effectif,
              }),
              DialogActionEnum.CONFIRM,
            );
          }
          if (
            fullOfferConfirmation ||
            offer?.nb_bookings < offer?.effectif ||
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
                  voucher: parseFloat(voucher),
                  voucher_reason: voucherReason,
                  establishment_billing_group_id: establishmentBillingGroupId,
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
            registerOptionOnAutoBooking();
          } else {
            clearSearch();
            registerOptionOnAutoBooking();
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
                voucher: parseFloat(voucher),
                voucher_reason: voucherReason,
                establishment_billing_group_id: establishmentBillingGroupId,
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
          registerOptionOnAutoBooking();
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

    registerMultipleOptions:
      ({
        setIsAutoBookingLoading,
        setIsAutoBookingError,
        registerMultipleOptionsBackground,
        setRegisteredSelectedBookingOptions,
        setUnregisteredSelectedBookingOptions,
        booking_ordering,
        fetchOfferData,
        bookingOptionsPending,
        members,
        registerOption,
        offer,
        openAutoBookingDialog,
        closeAllAutoBookingDialogs,
      }) =>
      (bookingOptionsIds: number[]) => {
        if (!Array.isArray(bookingOptionsIds)) return;
        setIsAutoBookingLoading(true);
        if (offer.room_blueprint) {
          setUnregisteredSelectedBookingOptions(bookingOptionsIds);
          const bookingOptionBeingProcessed =
            bookingOptionsPending?.find(
              (bookingOption) => bookingOption.id === bookingOptionsIds[0],
            ) ?? {};
          const memberToRegister = members?.find(
            (member) => member.id === bookingOptionBeingProcessed.member,
          );
          if (memberToRegister) {
            registerOption(bookingOptionBeingProcessed.id, {
              name: memberToRegister.name,
              photo: memberToRegister.photo,
              id: memberToRegister.id,
            });
          }
          closeAllAutoBookingDialogs();
          setIsAutoBookingLoading(false);
        } else {
          registerMultipleOptionsBackground(bookingOptionsIds, {
            onSuccess: () => {
              openAutoBookingDialog(AUTOBOOKING_DIALOGS.loading);
            },
            onBackgroundSuccess: (returnedValue) => {
              closeAllAutoBookingDialogs();
              setIsAutoBookingLoading(false);
              fetchOfferData(booking_ordering);
              if (returnedValue?.unregistered_booking_options?.length) {
                openAutoBookingDialog(AUTOBOOKING_DIALOGS.incomplete);
                setRegisteredSelectedBookingOptions(
                  returnedValue.registered_booking_options,
                );
                setUnregisteredSelectedBookingOptions(
                  returnedValue.unregistered_booking_options,
                );
              } else {
                openAutoBookingDialog(AUTOBOOKING_DIALOGS.feedBack);
                setUnregisteredSelectedBookingOptions([]);
              }
            },
            onError: () => {
              setIsAutoBookingLoading(false);
              setIsAutoBookingError(
                true,
                openAutoBookingDialog(AUTOBOOKING_DIALOGS.feedBack),
              );
            },
            onBackgroundError: () => {
              setIsAutoBookingLoading(false);
              setIsAutoBookingError(
                true,
                openAutoBookingDialog(AUTOBOOKING_DIALOGS.feedBack),
              );
            },
          });
        }
      },
  }),
)(OfferManagement);
