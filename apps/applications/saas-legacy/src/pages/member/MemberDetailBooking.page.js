// @flow

import React, { Component } from 'react';
import { DateTime } from 'luxon';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';

import uniq from 'lodash/uniq';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic.js';
import { BOOKING_STATUS_CANCELLED_BY_CONSUMER } from '@bsport/common/lib/master-data/booking_status_code.js';
import {
  getAssetByBlueprintByIdentifier,
  getSpotTypesOfCompany,
} from '#src/libs/spot-scheduling/selector';
import { getAvailableEstablishmentList } from '#src/libs/establishment/selectors';
import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';

import PaginatedListBase from '#src/components/PaginatedListBase.component';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import {
  fetchMemberProgram as fetchMemberProgramAction,
  fetchProgram as fetchProgramAction,
  fetchMetric as fetchMetricAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
} from '#src/libs/performance-tracking/actions';

import {
  cancelBooking as cancelBookingAction,
  discardAttendance as discardBookingAttendanceAction,
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByMember as fetchBookingsByMemberAction,
  retrieveBooking,
  fetchRecurrenceRuleBooking as fetchRecurrenceRuleBookingAction,
  deleteRecurrenceRuleBooking as deleteRecurrenceRuleBookingAction,
  createRecurrenceRuleBooking as createRecurrenceRuleBookingAction,
  updateRecurrenceRuleBooking as updateRecurrenceRuleBookingAction,
  setSpotForBooking,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
  retrieveOfferWithCancelledBookings as retrieveOfferWithCancelledBookingsAction,
  updateOfferWithCancelledBookingsToRetry as updateOfferWithCancelledBookingsToRetryAction,
  refundBookingAsManager as refundBookingAsManagerAction,
} from '#src/libs/booking/actions';
import {
  fetchEstablishments as fetchEstablishmentList,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#src/libs/establishment/actions';

import {
  fetchManagerFiltersSettings,
  updateManagerFiltersSettings,
} from '#src/libs/dashboard/actions';

import {
  fetchOfferById as fetchOfferByIdAction,
  fetchOfferStatus as fetchOfferStatusAction,
  fetchOfferWaitingListPositionList as fetchOfferWaitingListPositionListAction,
  fetchOfferBulk as fetchOfferBulkAction,
} from '#src/libs/offer/actions';

import {
  getDetailedOffer,
  withEstablishment,
  getOfferStatusWaitingListPositionById,
  getOfferById,
  withCoach,
  withMetaActivity,
} from '#src/libs/offer/selectors';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { getAllCustomLevels, withCustomLevel } from '#src/libs/level/selectors';
import { fetchMember as fetchMemberAction } from '#src/libs/member/actions';
import {
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
} from '#src/libs/spot-scheduling/actions';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  updateCredit as updateCreditAction,
} from '#src/libs/consumer-payment-pack/actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchActivitiesCompany as fetchActivitiesCompanyAction,
} from '#src/libs/meta-activity/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  fetchGroupsOfferList as fetchGroupsOfferListAction,
} from '#src/libs/group-offer/actions';
import {
  fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction,
  discardBookingOption as discardBookingOptionAction,
  fetchBookingOptionForMember,
} from '#src/libs/waiting-list/actions';
import {
  getEnabledMetaActivities,
  getMetaActivity,
} from '#src/libs/meta-activity/selectors';
import { withGroup, getGroupListCount } from '#src/libs/group-offer/selectors';

import {
  getWaitingListConfigurationData,
  getBookingOptionListForMember,
} from '#src/libs/waiting-list/selectors';

import { Member } from '#src/libs/member/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';

import BookingItemForManagerV2 from '#src/libs/booking/components/BookingItemForManagerV2.component';
import BookingDetail from '#src/libs/booking/components/BookingDetail.component';
import RecurrenceRuleBookingFormDialog from '#src/libs/booking/components/RecurrenceRuleBookingFormDialog.component';
import RecurrenceRuleOfferFormDialog from '#src/libs/booking/components/RecurrenceRuleOfferFormDialog.component';
import RevertBookingDialog from '#src/libs/booking/components/RevertBookingDialog.component';
import RefundBookingDialog from '#src/libs/booking/components/RefundBookingDialog.component';
import BookingFilters from '#src/libs/booking/components/BookingFilters.component';
import RecurrenceRuleBookingListItem from '#src/libs/booking/components/RecurrenceRuleBookingListItem.component';
import { getActivityWorkshopPermission } from '#src/libs/role/permission-utils/utils';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import {
  getMemberBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
  getRecurrenceRuleBookingList,
  getSimilarBookingList,
  withStaffModificationHistory,
  getOffersDataList,
  getOffersIds,
  getUpdateOffersToRetryLoading,
  getOffersWithCancelledBookingsLoading,
  getIsRefundBookingLoading,
} from '#src/libs/booking/selectors';
import { getMember } from '#src/libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '#src/libs/payment-packs/selectors';
import { getConsumerPack } from '#src/libs/consumer-payment-pack/selectors';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#src/libs/role/actions';
import { Theme } from '#src/libs/theme/types';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '#src/libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';
import type {
  Offer,
  OfferStatusWaitingListPosition,
} from '#src/libs/offer/types';
import {
  BookingOptionWithActivity,
  Booking,
  RecurrenceRuleBooking,
} from '#src/libs/booking/types';
import WaitingListDetail from '#src/libs/waiting-list/components/WaitingListDetail.component';
import PaginatedBookingOptionList from '#src/libs/waiting-list/components/PaginatedBookingOptionList.component';
import DiscardBookingOptionDialogV2 from '#src/libs/waiting-list/components/DiscardBookingOptionDialogV2.component';
import { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import type { Coach } from '#src/libs/associated-coach/types';
import MemberProgramDetailDialog from '#src/libs/performance-tracking/components/member-program/MemberProgramDetail.dialog';
import {
  getProgramList,
  getMemberProgramIdsList,
} from '#src/libs/performance-tracking/selector';

import type { WaitingListConfiguration } from '#src/libs/waiting-list/types';

const DEFAULT_SPOT_TYPE = { id: -1 };

type Props = {
  classes: any,
  t: TFunction,
  id: number,
  bookingId?: number,
  retrieveBooking: (number, OptionCallback) => void,
  retrieveConsumerPackBulk: (cpps: Array<number>) => void,
  member: Member,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingCurrentPage: number,
  fetchMemberBookingsList: (page: number, pageSize: number) => void,
  fetchCompanyUserRoles: () => void,

  fetchEstablishmentList: () => void,
  establishmentList: Array<Establishment>,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  bookingsLoading: boolean,
  fetchMemberBookings: (id: number) => void,
  deleteBooking: (id: number, data: any, options: OptionCallback) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,

  selectBooking: (memberId: number, bookingId: number) => void,
  unselectBooking: (memberId: number) => void,
  fetchOffer: (id: number) => void,
  goToOffer: (id: number) => void,
  getPass: (id: number) => void,
  selectedBooking?: Booking,
  getPaymentPack: (id: number) => PaymentPack,
  offerLoading: boolean,
  consumerPackLoading: boolean,
  offer?: Offer,

  fetchRoomBlueprintDetail: (number) => void,
  fetchGroupOffer: (groupId: number) => void,
  fetchSimilarFuturBookingInGroup: (groupId: number, member: number) => void,
  similarBookingList: Booking[],
  roomBlueprintById: { [number]: RoomBlueprint },
  fetchAssetForBlueprint: (number) => void,
  fetchSpotForBlueprint: (company: number) => void,
  fetchOfferStatus: (number) => void,
  offerStatusById: { [number]: OfferStatus },
  assetsForBlueprintById: { [number]: AssetForBlueprint },

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
  recurrenceRuleBooking: Array,
  onDeleteRecurrenceRuleBooking: (r: Dict) => void,
  recurrentBookingCurrentPage: number,
  setBookerInAvanceDialog: () => void,
  bookerInAvanceDialog: boolean,
  isOffersDialogOpen: boolean,
  fetchActivitiesCompany: (company: number) => void,
  metaActivities: Array,
  setSelectedRecurrentBooking: () => void,
  selectedRecurrentBooking: RecurrenceRuleBooking | null,
  fetchRecurrenceRuleBooking: (page: number) => void,
  recurrentBookingNextPage: number,
  recurrentBookingCount: number,
  onSubmitRecurrentBooking: () => void,
  onSubmitRetryOfferWithCancelledBookings: (offerIds: number[]) => void,

  theme: Theme,
  recurrentBookingLoading: boolean,
  userFiltersLoading: boolean,
  setSpotForBooking: () => void,
  fetchBookingOptionForMember: () => void,
  bookingOptionList: BookingOptionWithActivity[],
  selectedBookingOption: BookingOptionWithActivity,
  setSelectedBookingOption: () => void,
  bookingOptionPage: number,
  bookingOptionCount: number,
  bookingOptionListLoading: boolean,
  setDiscardBookingOption: () => void,
  discardBookingOption: boolean,
  discardOption: () => void,

  coaches: Array<Coach>,
  fetchAssociatedCoachesList: () => void,
  activityGroups: OffersGroup[],
  fetchGroupsOfferList: (data: {
    meta_activity__in: number[],
    page: number,
    page_size: number,
  }) => void,
  fetchLevelList: ({
    company: number,
  }) => void,
  spotTypes: SpotType[],
  programList: PerformanceTrackingProgram[],
  programDataLoading: boolean,
  fetchPerformanceTrackingData: (member: number) => void,
  memberProgramIdsList: (member: number) => MemberProgram[],
  updateMemberMetricValue: () => void,
  createMemberProgram: (data: {
    program: number,
    member: number,
  }) => void,

  fetchCompanyWaitlistConfiguration: (companyId: number) => void,
  waitingListConfiguration: WaitingListConfiguration,
  fetchOfferWaitingListPositionList: (bookingOptionsIds: number[]) => void,
  offerStatusWaitingListPositionById: {
    [key: number]: OfferStatusWaitingListPosition,
  },
  getOfferMetaActivity: (metaActivityId: number) => MetaActivity,
  getBookingOffer: (offerId: number) => Offer,
  offersWithCancelledBookings: Offer[],
  offersWithCancelledBookingsIdsList: number[],
  offersWithCancelledBookingsLoading: boolean,
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
  bookingToRevert?: Booking,
  isMemberProgramDetailDialogOpen: boolean,
  noShowChipMessageDialogIsOpen: boolean,
  warningDialogIsOpen: boolean,
  hasSpiviWarning: boolean,
  hasRollCallWarning: boolean,
  programDialogBooking: Booking,
};

const BOOKING_PAGE_SIZE = 7;
const RECURRENT_BOOKING_PAGE_SIZE = 5;

export class MemberDetailBooking extends Component<Props, State> {
  state = {
    bookingToRevert: null,
    isMemberProgramDetailDialogOpen: false,
    noShowChipMessageDialogIsOpen: false,
    warningDialogIsOpen: false,
    hasSpiviWarning: false,
    hasRollCallWarning: false,
    programDialogBooking: null,
  };

  componentDidMount() {
    if (this.props.bookingId) {
      this.fetchBookingDetails();
    }
    this.props.fetchCompanyUserRoles();
    this.props.fetchActivitiesCompany(this.props.theme.company);
    this.props.fetchRecurrenceRuleBooking(1);
    this.props.fetchAssociatedCoachesList();
    this.props.fetchLevelList({
      company: this.props.theme.company,
    });
    this.props.fetchCompanyWaitlistConfiguration(this.props.theme.company);
  }

  hasNext = () => {
    return this.props.recurrentBookingNextPage !== null;
  };

  goNext = () => {
    this.props.fetchRecurrenceRuleBooking(
      this.props.recurrentBookingCurrentPage + 1,
    );
  };

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.filters, this.props.filters)) {
      this.fetchMemberBookings();
    }
    if (
      this.props.bookingId &&
      (!prevProps.bookingId || prevProps.bookingId !== this.props.bookingId)
    ) {
      this.fetchBookingDetails();
    }

    if (
      this.props.selectedBookingOption &&
      prevProps.selectedBookingOption !== this.props.selectedBookingOption
    ) {
      this.props.fetchOffer(this.props.selectedBookingOption.offer.id, {
        onSuccess: (offer: Offer) => {
          if (offer.group) {
            this.props.fetchGroupOffer(offer.group);
          }
        },
      });
    }
  }

  fetchMemberBookings = () => {
    this.props.fetchMemberBookings({
      member: this.props.id,
      page: this.props.bookingId ? undefined : 1,
      current_booking_id: this.props.bookingId,
      page_size: BOOKING_PAGE_SIZE,
      filters: this.props.filters,
      options: {
        onSuccess: (bookings) => {
          this.props.retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          );
        },
      },
    });
  };

  fetchBookingDetails = () => {
    this.props.retrieveBooking(this.props.bookingId, {
      onSuccess: (booking) => {
        this.props.fetchOffer(booking.offer);
        this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]);
      },
    });
  };

  handleBookingDeletion = (data: any) => {
    this.props.deleteBooking(this.state.bookingToRevert.id, data, {
      onSuccess: () => {
        this.props.fetchMemberBookingsList(
          this.props.bookingCurrentPage,
          BOOKING_PAGE_SIZE,
        );
      },
    });
    this.setState({ bookingToRevert: null });
  };

  goToConsumerPass = (cpp: ConsumerPaymentPack) => {
    this.props.goToConsumerPass(cpp.member_id || this.props.id, cpp.id);
  };

  selectBooking = (booking: Booking) => {
    if (this.props.bookingId && this.props.bookingId === booking.id) {
      this.props.unselectBooking(this.props.id);
    } else {
      this.props.selectBooking(booking.member, booking.id);
    }
    this.props.setSelectedBookingOption(null);
  };

  onClickChangeSpot = async (booking: Booking) => {
    const spot_id = await asyncSelectSpotForBlueprint(booking.offer);
    if (spot_id !== undefined) {
      this.props.setSpotForBooking(booking.id, spot_id);
    }
  };

  openNoShowChipMessageDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    this.setState({ noShowChipMessageDialogIsOpen: true });
  };

  closeNoShowChipMessageDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    this.setState({ noShowChipMessageDialogIsOpen: false });
  };

  openWarningDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    rollCallWarning: boolean,
    spiviWarning: boolean,
  ) => {
    ev.stopPropagation();
    this.setState({ warningDialogIsOpen: true });
    this.setState({ hasRollCallWarning: rollCallWarning });
    this.setState({ hasSpiviWarning: spiviWarning });
  };

  closeWarningDialog = () => {
    this.setState({ warningDialogIsOpen: false });
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
            this.fetchMemberBookings();
          },
        },
      );
  };

  renderDetails = () => {
    const { primary_color } = this.props.theme;

    const dataLoading =
      this.props.bookingsLoading ||
      this.props.consumerPackLoading ||
      this.props.recurrentBookingLoading ||
      this.props.userFiltersLoading;

    if (this.props.selectedBookingOption) {
      return (
        <WaitingListDetail
          bookingOption={this.props.selectedBookingOption}
          loading={
            !this.props.selectedBookingOption ||
            !this.props.offer ||
            this.props.selectedBookingOption.offer.id !== this.props.offer.id
          }
          offer={this.props.offer}
          onOfferClick={this.props.goToOffer}
        />
      );
    }

    return (
      <BookingDetail
        booking={this.props.selectedBooking}
        consumerPack={
          this.props.selectedBooking &&
          this.props.getPass(
            parseInt(this.props.selectedBooking.consumer_payment_pack_id, 10),
          )
        }
        decrementCredit={this.props.decrementCredit}
        getPaymentPack={this.props.getPaymentPack}
        incrementCredit={this.props.incrementCredit}
        loading={this.props.consumerPackLoading || this.props.offerLoading}
        member={this.props.member}
        offer={this.props.offer}
        offerLoading={
          !this.props.selectedBooking ||
          !this.props.offer ||
          this.props.selectedBooking.offer !== this.props.offer.id
        }
        onConsumerPassSelected={this.goToConsumerPass}
        onOfferClick={this.props.goToOffer}
      />
    );
  };

  render() {
    const dataLoading =
      this.props.bookingsLoading ||
      this.props.consumerPackLoading ||
      this.props.recurrentBookingLoading ||
      this.props.userFiltersLoading;
    return (
      <Grid container direction="row" spacing={3}>
        <Grid
          container
          item
          alignItems="stretch"
          direction="column"
          lg={6}
          spacing={3}
          xs={12}
        >
          <Dialog maxWidth="sm" open={this.state.noShowChipMessageDialogIsOpen}>
            <DialogContent>
              {this.props.t('booking:noShowChip.message')}
            </DialogContent>
            <DialogActions>
              <Button
                className={this.props.classes.grey}
                onClick={this.closeNoShowChipMessageDialog}
              >
                {this.props.t('common:close')}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.warningDialogIsOpen}>
            {this.state.hasRollCallWarning && !this.state.hasSpiviWarning && (
              <div>
                <DialogTitle>
                  <Typography className={this.props.classes.bold} variant="h6">
                    {this.props.t(
                      'offer:rollCall.warningIcon.stateChangedTitle',
                    )}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  {this.props.t('offer:rollCall.warningIcon.stateChanged')}
                </DialogContent>
              </div>
            )}
            {!this.state.hasRollCallWarning && this.state.hasSpiviWarning && (
              <div>
                <DialogTitle>
                  <Typography className={this.props.classes.bold} variant="h6">
                    {this.props.t('booking:spivi.connectionImpossible')}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  {this.props.t('booking:spivi.errorText')}
                </DialogContent>
              </div>
            )}
            {this.state.hasRollCallWarning && this.state.hasSpiviWarning && (
              <div>
                <DialogTitle>
                  <Typography className={this.props.classes.bold} variant="h6">
                    {this.props.t('booking:warning')}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <div>
                    <Typography
                      className={this.props.classes.bold}
                      variant="subtitle1"
                    >
                      {this.props.t('booking:spivi.connectionImpossible')}
                    </Typography>
                    {this.props.t('booking:spivi.errorText')}
                  </div>
                  <div className={this.props.classes.secondWarning}>
                    <Typography
                      className={this.props.classes.bold}
                      variant="subtitle1"
                    >
                      {this.props.t(
                        'offer:rollCall.warningIcon.stateChangedTitle',
                      )}
                    </Typography>
                    {this.props.t('offer:rollCall.warningIcon.stateChanged')}
                  </div>
                </DialogContent>
              </div>
            )}
            <DialogActions>
              <Button
                className={this.props.classes.grey}
                onClick={this.closeWarningDialog}
              >
                {this.props.t('common:close')}
              </Button>
            </DialogActions>
          </Dialog>
          <Grid item style={{ width: '100%' }}>
            <ObjectLevelPermissionProvider
              requiredPermission={[
                'reservation.activity.allowed_actions.removeFromWaitlist',
                'reservation.workshop.allowed_actions.removeFromWaitlist',
              ]}
            >
              {([
                hasActivityRemoveWaitlistPermission,
                hasWorkshopRemoveWaitlistPermission,
              ]) => (
                <PaginatedBookingOptionList
                  displayWaitingListPosition={
                    this.props.waitingListConfiguration
                      ?.display_member_position &&
                    this.props.waitingListConfiguration?.dynamic ===
                      WAITING_LIST_DYNAMIC_ORDERED
                  }
                  itemPerPage={5}
                  items={this.props.bookingOptionList}
                  loading={this.props.bookingOptionListLoading}
                  nbItems={this.props.bookingOptionCount}
                  offerStatusWaitingListPositionById={
                    this.props.offerStatusWaitingListPositionById
                  }
                  onCheckActivityWorkshopPermission={(metaActivityId) =>
                    !getActivityWorkshopPermission(
                      this.props.getOfferMetaActivity(metaActivityId)
                        ?.is_workshop,
                      hasActivityRemoveWaitlistPermission,
                      hasWorkshopRemoveWaitlistPermission,
                    )
                  }
                  onClick={(bookingOption) => {
                    this.props.setSelectedBookingOption(
                      this.props.selectedBookingOption &&
                        this.props.selectedBookingOption.id === bookingOption.id
                        ? null
                        : bookingOption,
                    );
                  }}
                  onClickDiscard={(bookingOption) =>
                    this.props.setDiscardBookingOption(bookingOption.id)
                  }
                  onClickRegister={(bookingOption) =>
                    this.props.goToOffer(bookingOption.offer.id)
                  }
                  onPageRequested={(page) => {
                    this.props.fetchBookingOptionForMember(
                      {
                        member: this.props.id,
                        page,
                        page_size: 5,
                      },
                      {
                        onSuccess: ({ results: bookingOptionList }) => {
                          this.props.fetchOfferWaitingListPositionList(
                            bookingOptionList.map(
                              (bookingOption: BookingOptionWithActivity) =>
                                bookingOption.offer.id,
                            ),
                            { memberId: this.props.id },
                          );
                        },
                      },
                    );
                  }}
                  page={this.props.bookingOptionPage}
                  selectedBookingOption={this.props.selectedBookingOption}
                />
              )}
            </ObjectLevelPermissionProvider>

            <Paper style={{ width: '100%' }}>
              <BookingFilters
                coaches={this.props.coaches}
                filters={!dataLoading && this.props.filters}
                open={this.props.open}
                setFiltersValue={this.props.setFilterValue}
                setOpenValue={this.props.setOpenValue}
              />
              <Divider />

              <ObjectLevelPermissionProvider
                requiredPermission={[
                  'reservation.activity.allowed_actions.editPerformance',
                  'reservation.workshop.allowed_actions.editPerformance',
                ]}
              >
                {([
                  hasActivityEditPerformancePermission,
                  hasWorkshopEditPerformancePermission,
                ]) => (
                  <MemberProgramDetailDialog
                    booking={this.state.programDialogBooking}
                    closeDialog={() =>
                      this.setState({
                        isMemberProgramDetailDialogOpen: false,
                      })
                    }
                    createMemberProgram={(id) =>
                      this.props.createMemberProgram({
                        program: id,
                        member: this.props.id,
                      })
                    }
                    isPreventUpdateMetricValue={
                      !getActivityWorkshopPermission(
                        this.props.getOfferMetaActivity(
                          this.state.programDialogBooking?.meta_activity,
                        )?.is_workshop,
                        hasActivityEditPerformancePermission,
                        hasWorkshopEditPerformancePermission,
                      )
                    }
                    loading={this.props.programDataLoading}
                    memberProgramList={this.props.memberProgramIdsList(
                      this.props.id,
                    )}
                    members={[this.props.member]}
                    open={this.state.isMemberProgramDetailDialogOpen}
                    programList={this.props.programList}
                    updateMemberMetricValue={this.props.updateMemberMetricValue}
                  />
                )}
              </ObjectLevelPermissionProvider>
              {!this.props.userFiltersLoading && (
                <PaginatedListBase
                  additionalFilters={this.props.filters}
                  itemPerPage={BOOKING_PAGE_SIZE}
                  items={this.props.bookings}
                  listProps={{ disablePadding: true }}
                  loading={this.props.bookingsLoading}
                  nbItems={this.props.bookingCount}
                  onPageRequested={(page, page_size) =>
                    this.props.fetchMemberBookingsList(page, page_size)
                  }
                  page={this.props.bookingCurrentPage}
                  renderCustomPageFirst={!!this.props.bookingId}
                  renderItem={(booking: Booking) => (
                    <BookingItemForManagerV2
                      key={booking.id}
                      button
                      displayNoShowChip
                      showRevertBookingButton
                      booking={booking}
                      confirmBookingAttendance={() =>
                        this.props.confirmBookingAttendance(booking.id)
                      }
                      dateRollCallLastModified={
                        booking.date_roll_call_last_modified
                      }
                      discardBookingAttendance={() =>
                        this.props.discardBookingAttendance(booking.id)
                      }
                      getBookingOffer={this.props.getBookingOffer}
                      getOfferMetaActivity={this.props.getOfferMetaActivity}
                      handleOpenRefundBookingDialog={
                        this.handleOpenRefundBookingDialog
                      }
                      handleRevert={() => {
                        this.props.fetchOffer(booking.offer, {
                          onSuccess: (offer: Offer) => {
                            if (offer.group) {
                              this.props.fetchGroupOffer(offer.group);
                              this.props.fetchSimilarFuturBookingInGroup(
                                offer.group,
                                booking.member,
                              );
                            }
                          },
                        });

                        this.setState({ bookingToRevert: booking });
                      }}
                      heading="date_start"
                      isRollCallMandatory={
                        this.props.theme.is_roll_call_mandatory
                      }
                      member={this.props.member}
                      noShowChipMessage={this.props.t(
                        'booking:noShowChip.message',
                      )}
                      onClick={() => this.selectBooking(booking)}
                      onClickChangeSpot={this.onClickChangeSpot}
                      onClickNoShowChip={this.openNoShowChipMessageDialog}
                      onClickWarningIcon={this.openWarningDialog}
                      onProgramDetailsClick={() => {
                        this.props.fetchPerformanceTrackingData(this.props.id);
                        this.setState({
                          programDialogBooking: booking,
                          isMemberProgramDetailDialogOpen: true,
                        });
                      }}
                      programList={this.props.programList}
                      selected={
                        this.props.selectedBooking &&
                        this.props.selectedBooking.id === booking.id
                      }
                      spotSchedulingEnabled={
                        typeof booking.spot_id === 'number'
                      }
                    />
                  )}
                />
              )}
            </Paper>
            {!!this.props.recurrenceRuleBooking.length && (
              <Paper className={this.props.classes.recurrenceRuleContainer}>
                <Typography style={{ padding: 10 }} variant="caption">
                  {this.props.t('booking:recurrenceRule.recurrentBookings')}
                </Typography>
                <Divider />
                <ObjectLevelPermissionProvider
                  requiredPermission={[
                    'reservation.activity.allowed_actions.delete',
                    'reservation.workshop.allowed_actions.delete',
                    'reservation.activity.allowed_actions.create',
                    'reservation.workshop.allowed_actions.create',
                  ]}
                >
                  {([
                    hasActivityCancelBookingPermission,
                    hasWorkshopCancelBookingPermission,
                    hasActivityCreateBookingPermission,
                    hasWorkshopCreateBookingPermission,
                  ]) => (
                    <List disablePadding>
                      {this.props.recurrenceRuleBooking.map(
                        (recurrenceRule) => (
                          <RecurrenceRuleBookingListItem
                            key={recurrenceRule.id}
                            notShowMember
                            onDelete={
                              getActivityWorkshopPermission(
                                recurrenceRule.meta_activity?.is_workshop,
                                hasActivityCancelBookingPermission,
                                hasWorkshopCancelBookingPermission,
                              )
                                ? (id, data) =>
                                    this.props.onDeleteRecurrenceRuleBooking(
                                      recurrenceRule,
                                      this.props.id,
                                      data,
                                    )
                                : undefined
                            }
                            onEdit={
                              getActivityWorkshopPermission(
                                recurrenceRule.meta_activity?.is_workshop,
                                hasActivityCreateBookingPermission,
                                hasWorkshopCreateBookingPermission,
                              )
                                ? () => {
                                    this.props.fetchActivitiesCompany(
                                      this.props.theme.company,
                                    );
                                    this.props.fetchEstablishmentList();
                                    this.props.setBookerInAvanceDialog(true);
                                    this.props.setSelectedRecurrentBooking(
                                      recurrenceRule,
                                    );
                                  }
                                : undefined
                            }
                            recurrenceRuleBooking={{
                              ...recurrenceRule,
                              member: this.props.member,
                            }}
                          />
                        ),
                      )}
                    </List>
                  )}
                </ObjectLevelPermissionProvider>
                <div className={this.props.classes.bookButtonWideContainer}>
                  {this.hasNext() && (
                    <Button
                      className={this.props.classes.bookButtonWide}
                      color="primary"
                      onClick={this.goNext}
                    >
                      {this.props.t('booking:recurrenceRule.showMore', {
                        count:
                          this.props.recurrentBookingCount -
                          RECURRENT_BOOKING_PAGE_SIZE *
                            this.props.recurrentBookingCurrentPage,
                      })}
                    </Button>
                  )}
                </div>
              </Paper>
            )}

            <ObjectLevelPermissionProvider
              requiredPermission={[
                'reservation.activity.allowed_actions',
                'reservation.workshop.allowed_actions',
              ]}
            >
              {([
                hasActivityCreateBookingPermission,
                hasWorkshopCreateBookingPermission,
              ]) =>
                (hasActivityCreateBookingPermission ||
                  hasWorkshopCreateBookingPermission) && (
                  <div className={this.props.classes.createRecurrentBooking}>
                    <Button
                      color="primary"
                      onClick={() => {
                        this.props.setBookerInAvanceDialog(true);
                        this.props.fetchActivitiesCompany(
                          this.props.theme.company,
                        );
                        this.props.fetchEstablishmentList();
                      }}
                      variant="outlined"
                    >
                      {this.props.t(
                        'booking:recurrenceRule.createModal.create',
                      )}
                    </Button>
                  </div>
                )
              }
            </ObjectLevelPermissionProvider>
            {this.props.bookerInAvanceDialog && (
              <RecurrenceRuleBookingFormDialog
                companyId={this.props.theme.company}
                establishmentList={this.props.establishmentList}
                fetchGroupsOfferList={this.props.fetchGroupsOfferList}
                hasActivityGroups={this.props.activityGroups > 0}
                initial={this.props.selectedRecurrentBooking}
                metaActivityList={this.props.metaActivities}
                offersWithCancelledBookingsLoading={
                  this.props.offersWithCancelledBookingsLoading
                }
                onClose={() => {
                  this.props.setBookerInAvanceDialog(false);
                  this.props.setSelectedRecurrentBooking(null);
                }}
                onSubmit={this.props.onSubmitRecurrentBooking}
              />
            )}
            {this.props.isOffersDialogOpen && (
              <RecurrenceRuleOfferFormDialog
                allOfferIds={this.props.offersWithCancelledBookingsIdsList}
                loading={this.props.updateOffersToRetryLoading}
                offers={this.props.offersWithCancelledBookings}
                onSubmit={this.props.onSubmitRetryOfferWithCancelledBookings}
                open={this.props.isOffersDialogOpen}
              />
            )}
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          {this.renderDetails()}
        </Grid>

        <DiscardBookingOptionDialogV2
          onClose={() => this.props.setDiscardBookingOption(null)}
          onSubmit={(sendEmail: boolean) => {
            this.props.discardOption(
              this.props.discardBookingOption,
              { disable_notification: !sendEmail },
              {
                onSuccess: () => {
                  this.props.fetchBookingOptionForMember({
                    member: this.props.id,
                    page: 1,
                    page_size: 5,
                  });
                  this.props.setDiscardBookingOption(null);
                },
                onError: () => this.props.setDiscardBookingOption(null),
              },
            );
          }}
          open={!!this.props.discardBookingOption}
        />

        {!!this.state.bookingToRevert && (
          <RevertBookingDialog
            offerIsAvailable
            bookingToRevert={this.state.bookingToRevert}
            closeRevertBookingDialog={() =>
              this.setState({ bookingToRevert: null })
            }
            handleBookingDeletion={this.handleBookingDeletion}
            hideEmailOption={
              this.state.bookingToRevert?.booking_status_code ===
              BOOKING_STATUS_CANCELLED_BY_CONSUMER.id
            }
            hideRefundOption={this.state.bookingToRevert?.was_refunded}
            offer={this.props.offer}
            similarBookings={this.props.similarBookingList}
          />
        )}
        <RefundBookingDialog
          isConsumerPaymentPackUnlimited={
            this.props.selectedBookingForRefund?.isUnlimited
          }
          isLoading={this.props.isRefundBookingLoading}
          isOpen={!!this.props.selectedBookingForRefund?.id}
          onClose={this.handleCloseRefundBookingDialog}
          onSubmit={this.handleRefundBooking}
        />

        <AsyncSpotSelector
          assetsForBlueprintById={this.props.assetsForBlueprintById}
          fetchAssetForBlueprint={this.props.fetchAssetForBlueprint}
          fetchOfferById={this.props.fetchOffer}
          fetchOfferStatus={this.props.fetchOfferStatus}
          fetchRoomBlueprintDetail={this.props.fetchRoomBlueprintDetail}
          fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
          offer={this.props.offer}
          offerStatusById={this.props.offerStatusById}
          roomBlueprintById={this.props.roomBlueprintById}
          spotTypes={this.props.spotTypes.concat(DEFAULT_SPOT_TYPE)}
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
  containerRecurrentBooking: {
    width: '100%',
  },
  bookButtonWideContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'noWrap',
  },
  recurrenceRuleContainer: {
    marginTop: theme.spacing(3),
  },
  bookButtonWide: {
    width: '30%',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  createRecurrentBooking: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  grey: {
    color: theme.palette.text.secondary,
  },
  bold: {
    fontWeight: 500,
  },
});
export default compose(
  routerParamsToProps({ id: 'id:number', bookingId: 'bookingId:number' }),
  withTranslation('booking'),
  withStyles(styles),
  withState('open', 'setOpen', {}),
  withState('bookerInAvanceDialog', 'setBookerInAvanceDialog', false),
  withState('isOffersDialogOpen', 'setIsOffersDialogOpen', false),
  withState('selectedRecurrentBooking', 'setSelectedRecurrentBooking', null),
  withState('selectedBookingOption', 'setSelectedBookingOption', null),
  withState('discardBookingOption', 'setDiscardBookingOption', null),
  withState('selectedBookingForRefund', 'setSelectedBookingForRefund', null),
  connect(
    (state, { id, bookingId }) => ({
      theme: themeSelectors.getTheme(state),
      member: getMember(state, id),
      bookings: withStaffModificationHistory(
        getMemberBookingListWithConsumerPack,
      )(state),
      selectedBooking: bookingId
        ? withStaffModificationHistory(getMemberBookingWithConsumerPack)(
            state,
            bookingId,
          )
        : null,
      isRefundBookingLoading: getIsRefundBookingLoading(state),
      bookingCurrentPage: state.booking.byMember.page,
      bookingsLoading: state.booking.byMember.loading,
      bookingCount: state.booking.byMember.count,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      offer: withGroup(getDetailedOffer)(state),
      recurrenceRuleBooking: getRecurrenceRuleBookingList(state),
      recurrentBookingCurrentPage: state.booking.recurrenceRule.page,
      recurrentBookingNextPage: state.booking.recurrenceRule.next_page,
      recurrentBookingCount: state.booking.recurrenceRule.count,
      recurrentBookingLoading: state.booking.recurrenceRule.loading,
      metaActivities: getEnabledMetaActivities(state),
      getPaymentPack: (id_: number) => paymentPackSelectors.get(state, id_),
      getPass: (id_: number) => getConsumerPack(state, id_),
      timezone: state.theme.theme.timezone_name,
      establishmentList: getAvailableEstablishmentList(state),
      userFilters: state.dashboardSettings.managerFiltersSettings.data.filters,
      userFiltersLoading:
        state.dashboardSettings.managerFiltersSettings.loading,

      programDataLoading:
        state.performanceTracking.memberProgram.loading ||
        state.performanceTracking.metricList.loading ||
        state.performanceTracking.program.loading,

      roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
      assetsForBlueprintById: getAssetByBlueprintByIdentifier(state),
      offerStatusById: state.offer.offerStatus.byId,
      bookingOptionList: getBookingOptionListForMember(state),
      bookingOptionListLoading: state.waitingList.option.forMember.loading,
      bookingOptionCount: state.waitingList.option.forMember.count,
      bookingOptionPage: state.waitingList.option.forMember.page,
      coaches: getActiveCoaches(state),
      activityGroups: getGroupListCount(state),
      similarBookingList: withEstablishment(
        withCustomLevel(getSimilarBookingList),
      )(state),
      spotTypes: getSpotTypesOfCompany(state),
      memberProgramIdsList: getMemberProgramIdsList(state),
      programList: getProgramList(state),
      waitingListConfiguration: getWaitingListConfigurationData(state),
      offerStatusWaitingListPositionById:
        getOfferStatusWaitingListPositionById(state),
      getOfferMetaActivity: (metaActivityId: number) =>
        getMetaActivity(state, metaActivityId),
      getBookingOffer: (offerId: number) => getOfferById(state, offerId),
      offersWithCancelledBookings: withMetaActivity(
        withCoach(withEstablishment(withCustomLevel(getOffersDataList))),
      )(state),
      offersWithCancelledBookingsIdsList: getOffersIds(state),
      updateOffersToRetryLoading: getUpdateOffersToRetryLoading(state),
      offersWithCancelledBookingsLoading:
        getOffersWithCancelledBookingsLoading(state),
      customLevels: getAllCustomLevels(state),
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      retrieveBooking,
      fetchOffer: fetchOfferByIdAction,
      fetchOfferBulk: fetchOfferBulkAction,
      fetchCompanyUserRoles: fetchCompanyUserRolesAction,
      fetchEstablishmentList,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,

      fetchRecurrenceRuleBooking: fetchRecurrenceRuleBookingAction,
      deleteRecurrenceRuleBooking: deleteRecurrenceRuleBookingAction,
      fetchMember: fetchMemberAction,
      createRecurrenceRuleBooking: createRecurrenceRuleBookingAction,
      fetchActivitiesCompany: fetchActivitiesCompanyAction,
      updateRecurrenceRuleBooking: updateRecurrenceRuleBookingAction,

      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      deleteBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      fetchCompanyWaitlistConfiguration:
        fetchCompanyWaitlistConfigurationAction,
      fetchOfferWaitingListPositionList:
        fetchOfferWaitingListPositionListAction,
      fetchManagerFilters: fetchManagerFiltersSettings,
      updateManagerFilters: updateManagerFiltersSettings,

      incrementCredit: (id_) => updateCreditAction(id_, 1),
      decrementCredit: (id_) => updateCreditAction(id_, -1),

      goToOffer: (offerId: number) => push(`/offer/${offerId}`),
      goToConsumerPass: (memberId, consumerPassId) =>
        push(`/member/${memberId}/pass/${consumerPassId}/`),
      unselectBooking: (memberId) => push(`/member/${memberId}/bookings`),
      selectBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
      setSpotForBooking,

      fetchRoomBlueprintDetail: fetchRoomBlueprintDetailAction,
      fetchAssetForBlueprint: fetchAssetForBlueprintAction,
      fetchOfferStatus: fetchOfferStatusAction,
      fetchBookingOptionForMember,
      discardOption: discardBookingOptionAction,

      fetchMemberProgram: fetchMemberProgramAction,
      fetchProgram: fetchProgramAction,
      fetchMetric: fetchMetricAction,
      updateMemberMetricValue: updateMemberMetricValueAction,
      createMemberProgram: createMemberProgramAction,

      fetchGroupsOfferList: fetchGroupsOfferListAction,
      fetchAssociatedCoachesList,
      fetchGroupOffer: fetchGroupOfferAction,
      fetchSimilarFuturBookingInGroup: fetchSimilarFuturBookingInGroupAction,
      retrieveOfferWithCancelledBookings:
        retrieveOfferWithCancelledBookingsAction,
      updateOfferWithCancelledBookingsToRetry:
        updateOfferWithCancelledBookingsToRetryAction,
      fetchLevelList: fetchLevelListAction,
      fetchSpotForBlueprint: fetchSpotForBlueprintAction,
      refundBookingAsManager: refundBookingAsManagerAction,
    },
  ),
  withProps(({ userFilters }) => ({
    filters: userFilters?.booking_filters ?? { future_booking: true },
  })),
  withHandlers({
    fetchRecurrenceRuleBooking:
      ({
        fetchRecurrenceRuleBooking,
        fetchMetaActivityBulk,
        fetchEstablishmentBulk,
        id,
      }) =>
      (page) => {
        fetchRecurrenceRuleBooking(
          {
            member: id,
            page,
            page_size: RECURRENT_BOOKING_PAGE_SIZE,
          },
          {
            onSuccess: (recurrenceRuleList) => {
              if (recurrenceRuleList.length) {
                fetchMetaActivityBulk([
                  ...recurrenceRuleList.map((o) => o.meta_activity),
                ]);
                fetchEstablishmentBulk([
                  ...recurrenceRuleList.map((o) => o.establishment),
                ]);
              }
            },
          },
        );
      },
  }),
  withHandlers({
    refresh:
      ({
        fetchRecurrenceRuleBooking,
        fetchMemberBookings,
        filters,
        retrieveConsumerPackBulk,
        setBookerInAvanceDialog,
        fetchPaymentPackBulk,
        id,
      }) =>
      () => {
        fetchRecurrenceRuleBooking(1);
        fetchMemberBookings({
          member: id,
          page: 1,
          page_size: BOOKING_PAGE_SIZE,
          filters,
          options: {
            onSuccess: (bookings) =>
              retrieveConsumerPackBulk(
                bookings.map((booking) => booking.consumer_payment_pack),
                {
                  onSuccess: (consumerPaymentPacks) =>
                    fetchPaymentPackBulk(
                      consumerPaymentPacks.map(
                        (consumerPaymentPack) =>
                          consumerPaymentPack.payment_pack,
                      ),
                    ),
                },
              ),
          },
        });
        setBookerInAvanceDialog(false);
      },
  }),
  withHandlers({
    onSubmitRecurrentBooking:
      ({
        id,
        updateRecurrenceRuleBooking,
        selectedRecurrentBooking,
        setSelectedRecurrentBooking,
        createRecurrenceRuleBooking,
        retrieveOfferWithCancelledBookings,
        setIsOffersDialogOpen,
        refresh,
      }) =>
      (data, options) => {
        if (id && selectedRecurrentBooking) {
          updateRecurrenceRuleBooking(
            {
              ...data,
              member: id,
            },
            selectedRecurrentBooking.id,
            {
              onSuccess: () => {
                retrieveOfferWithCancelledBookings(
                  selectedRecurrentBooking.id,
                  {
                    onSuccess: (offers: Offer[]) => {
                      if (offers?.length) {
                        setIsOffersDialogOpen(true);
                      } else {
                        setSelectedRecurrentBooking(null);
                        refresh();
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
        if (id && !selectedRecurrentBooking) {
          createRecurrenceRuleBooking(
            { ...data, member: id },
            {
              onSuccess: (
                createdRecurrenceRuleBooking: RecurrenceRuleBooking,
              ) => {
                setSelectedRecurrentBooking(createdRecurrenceRuleBooking);
                retrieveOfferWithCancelledBookings(
                  createdRecurrenceRuleBooking.id,
                  {
                    onSuccess: (offers: Offer[]) => {
                      if (offers?.length) {
                        setIsOffersDialogOpen(true);
                      } else {
                        refresh();
                        setSelectedRecurrentBooking(null);
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
      },
    onSubmitRetryOfferWithCancelledBookings:
      ({
        selectedRecurrentBooking,
        setIsOffersDialogOpen,
        setSelectedRecurrentBooking,
        updateOfferWithCancelledBookingsToRetry,
        refresh,
      }) =>
      (offerIdsToRetry: number[]) => {
        updateOfferWithCancelledBookingsToRetry(
          selectedRecurrentBooking.id,
          offerIdsToRetry,
          {
            onSuccess: () => {
              refresh();
              setSelectedRecurrentBooking(null);
              setIsOffersDialogOpen(false);
            },
            onError: () => {
              refresh();
              setSelectedRecurrentBooking(null);
              setIsOffersDialogOpen(false);
            },
          },
        );
      },
    setOpenValue:
      ({ setOpen, open }) =>
      (name: string) => {
        setOpen({
          ...open,
          [name]: !open[name],
        });
      },
    onDeleteRecurrenceRuleBooking:
      ({
        deleteRecurrenceRuleBooking,
        fetchMemberBookings,
        retrieveConsumerPackBulk,
        fetchRecurrenceRuleBooking,
        filters,
      }) =>
      (r, memberId, data) => {
        deleteRecurrenceRuleBooking(r.id, data, {
          onSuccess: () => {
            fetchRecurrenceRuleBooking(1);
            fetchMemberBookings({
              member: memberId,
              page: 1,
              page_size: BOOKING_PAGE_SIZE,
              filters,
              options: {
                onSuccess: (bookings) =>
                  retrieveConsumerPackBulk(
                    bookings.map((b) => b.consumer_payment_pack),
                  ),
              },
            });
          },
        });
      },
    fetchMemberBookingsList:
      ({
        id,
        filters,
        fetchMemberBookings,
        retrieveConsumerPackBulk,
        bookingId,
        fetchOfferBulk,
      }) =>
      (page, page_size) => {
        fetchMemberBookings({
          member: id,
          page,
          page_size,
          current_booking_id: !page ? bookingId : null,
          filters,
          options: {
            onSuccess: (bookings) => {
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              );
              fetchOfferBulk(bookings.map((booking) => booking.offer));
            },
          },
        });
      },
    setFilterValue:
      ({ filters, updateManagerFilters, userFilters }) =>
      (name: string, value) => {
        let newFilters = { ...filters };
        if (value === null) {
          newFilters = omit(filters, name);
        } else {
          newFilters = {
            ...filters,
            [name]: value,
          };
        }
        updateManagerFilters({
          ...userFilters,
          booking_filters: newFilters,
        });
      },
    createMemberProgram:
      ({ programList, createMemberProgram, fetchMetric }) =>
      (data: { program: number, member: number }) => {
        createMemberProgram(data, {
          onSuccess: (memberProgram) => {
            const program = programList?.find(
              (p) => p.id === memberProgram?.program,
            );
            const uniq_ids = program?.metric_list?.filter(
              (metric_id) => !!metric_id,
            );
            if (uniq_ids && uniq_ids.length) {
              fetchMetric({ id__in: program?.metric_list });
            }
          },
        });
      },
    fetchPerformanceTrackingData:
      ({ fetchMemberProgram, fetchProgram, fetchMetric }) =>
      (member) => {
        fetchMemberProgram(
          {
            member,
          },
          {
            onSuccess: (data) => {
              const programsToFetch = uniq(
                data.results.map((memberProgram) => memberProgram?.program),
              );
              fetchProgram(
                { is_disabled: false, id__in: programsToFetch },
                {
                  onSuccess: (programData) => {
                    const metricToFetch = programData.reduce(
                      (acc, program) => acc.concat(program?.metric_list),
                      [],
                    );

                    if (metricToFetch?.length) {
                      fetchMetric({ id__in: metricToFetch });
                    }
                  },
                },
              );
            },
          },
        );
      },
  }),
  withTranslation('performanceTracking'),
)(MemberDetailBooking);
