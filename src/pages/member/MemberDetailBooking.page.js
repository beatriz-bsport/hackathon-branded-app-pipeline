// @flow

import React, { Component } from 'react';
import moment from 'moment-timezone';
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
import {
  getAssetByBlueprintByIdentifier,
  getSpotTypesOfCompany,
} from '#libs/spot-scheduling/selector';
import { getAvailableEstablishmentList } from '#libs/establishment/selectors';
import { getActiveCoaches } from '#libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';

import PaginatedListBase from '#components/PaginatedListBase.component';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import {
  fetchMemberProgram as fetchMemberProgramAction,
  fetchProgram as fetchProgramAction,
  fetchMetric as fetchMetricAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
} from '#libs/performance-tracking/actions';

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
} from '#libs/booking/actions';
import {
  fetchEstablishments as fetchEstablishmentList,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#libs/establishment/actions';

import {
  fetchManagerFiltersSettings,
  updateManagerFiltersSettings,
} from '#libs/dashboard/actions';

import {
  fetchOfferById as fetchOfferByIdAction,
  fetchOfferStatus as fetchOfferStatusAction,
} from '#libs/offer/actions';

import { getDetailedOffer, withEstablishment } from '#libs/offer/selectors';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { withCustomLevel } from '#libs/level/selectors';

import { fetchMember as fetchMemberAction } from '#libs/member/actions';
import {
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
} from '#libs/spot-scheduling/actions';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  updateCredit as updateCreditAction,
} from '#libs/consumer-payment-pack/actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchActivitiesCompany as fetchActivitiesCompanyAction,
} from '#libs/meta-activity/actions';
import {
  fetchGroupOffer as fetchGroupOfferAction,
  fetchGroupsOfferList as fetchGroupsOfferListAction,
} from '#libs/group-offer/actions';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';
import { withGroup, getGroupListCount } from '#libs/group-offer/selectors';

import { Member } from '#libs/member/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';

import BookingItemForManagerV2 from '#libs/booking/components/BookingItemForManagerV2.component';
import BookingDetail from '#libs/booking/components/BookingDetail.component';
import RecurrenceRuleBookingFormDialog from '#libs/booking/components/RecurrenceRuleBookingFormDialog.component';
import RevertBookingDialog from '#libs/booking/components/RevertBookingDialog.component';
import BookingFilters from '#libs/booking/components/BookingFilters.component';
import RecurrenceRuleBookingListItem from '#libs/booking/components/RecurrenceRuleBookingListItem.component';
import TemporalBarChart from '#components/graph/TemporalBarChart.component';

import {
  getMemberBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
  getRecurrenceRuleBookingList,
  getSimilarBookingList,
  withStaffModificationHistory,
} from '#libs/booking/selectors';
import { getMember } from '#libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '#libs/payment-packs/selectors';
import { getConsumerPack } from '#libs/consumer-payment-pack/selectors';
import themeSelectors from '#libs/theme/selectors';
import { fetchBookingStatistics2 as fetchBookingStatisticsAction } from '#libs/statistics/actions';
import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '#libs/role/actions';
import { getStatisticTemporal } from '#libs/statistics/selectors';
import ChartRange from '#libs/dashboard/components/ChartRange.component';
import { Theme } from '#libs/theme/types';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '#libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';
import {
  discardBookingOption as discardBookingOptionAction,
  fetchBookingOptionForMember,
} from '#libs/waiting-list/actions';
import { getBookingOptionListForMember } from '#libs/waiting-list/selectors';
import type { Offer } from '../../api/types';
import { BookingOptionWithActivity, Booking } from '#libs/booking/types';
import WaitingListDetail from '#libs/waiting-list/components/WaitingListDetail.component';
import PaginatedBookingOptionList from '#libs/waiting-list/components/PaginatedBookingOptionList.component';
import DiscardBookingOptionDialogV2 from '#libs/waiting-list/components/DiscardBookingOptionDialogV2.component';
import { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type { Coach } from '#libs/associated-coach/types';
import MemberProgramDetailDialog from '#libs/performance-tracking/components/member-program/MemberProgramDetail.dialog';
import {
  getProgramList,
  getMemberProgramIdsList,
} from '#libs/performance-tracking/selector';

const DEFAULT_SPOT_TYPE = { id: -1 };

type Props = {
  classes: any,
  t: TFunction,
  id: number,
  bookingId: ?number,
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
  selectedBooking: ?Booking,
  getPaymentPack: (id: number) => PaymentPack,
  offerLoading: boolean,
  consumerPackLoading: boolean,
  offer: ?Offer,

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
  fetchActivitiesCompany: (company: number) => void,
  metaActivities: Array,
  setSelectedRecurrentBooking: () => void,
  selectedRecurrentBooking: boolean,
  fetchRecurrenceRuleBooking: (page: number) => void,
  recurrentBookingNextPage: number,
  recurrentBookingCount: number,
  refresh: () => void,
  onSubmitRecurrentBooking: () => void,

  graphData: { data: Array<{ d: string, v: number }>, loading: boolean },
  theme: Theme,
  fetchMemberBookingStatistics: () => void,
  chartRange: { start: string, end: string, kind: string },
  setChartRange: ({ start: string, end: string, kind: string }) => void,
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
};

type State = {
  bookingToRevert: ?Booking,
  isMemberProgramDetailDialogOpen: boolean,
  noShowChipMessageDialogIsOpen: boolean,
  warningDialogIsOpen: boolean,
  hasSpiviWarning: boolean,
  hasRollCallWarning: boolean,
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
  };

  componentDidMount() {
    if (this.props.bookingId) {
      this.fetchBookingDetails();
    }
    this.props.fetchCompanyUserRoles();
    this.props.fetchActivitiesCompany(this.props.theme.company);
    this.props.fetchRecurrenceRuleBooking(1);
    this.props.fetchMemberBookingStatistics();
    this.props.fetchAssociatedCoachesList();
    this.props.fetchLevelList({
      company: this.props.theme.company,
    });
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
      this.props.fetchMemberBookingStatistics();
    }
    if (prevProps.chartRange !== this.props.chartRange) {
      this.props.fetchMemberBookingStatistics();
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

  renderDetails = () => {
    const { primary_color } = this.props.theme;

    const dataLoading =
      this.props.bookingsLoading ||
      this.props.consumerPackLoading ||
      this.props.recurrentBookingLoading ||
      this.props.userFiltersLoading;

    if (!this.props.selectBooking && !this.props.selectedBookingOption) {
      return (
        <Paper className={this.props.classes.graphContainer}>
          <div className={this.props.classes.titleRow}>
            <Typography variant="h6">
              {this.props.t('booking:memberGraph.title')}
            </Typography>
            <ChartRange
              start_date={this.props.chartRange.start}
              end_date={this.props.chartRange.end}
              kind={this.props.chartRange.kind}
              setRange={this.props.setChartRange}
              timeSettings="range"
            />
          </div>
          <BookingFilters
            setOpenValue={this.props.setOpenValue}
            setFiltersValue={this.props.setFilterValue}
            open={this.props.open}
            filters={!dataLoading && this.props.filters}
            coaches={this.props.coaches}
          />
          {this.props.graphData.loading ? (
            <Skeleton height={300} />
          ) : (
            <TemporalBarChart
              height={300}
              data={this.props.graphData.data}
              chartOptions={[
                {
                  dataKey: 'v',
                  stroke: primary_color,
                  fill: primary_color,
                  caption: this.props.t('memberGraph.label'),
                },
              ]}
              margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
              yLabel={this.props.t('memberGraph.label')}
              yLabelOffset={-2}
              tooltip
            />
          )}
        </Paper>
      );
    }

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

    if (this.props.selectBooking) {
      return (
        <BookingDetail
          consumerPack={
            this.props.selectedBooking &&
            this.props.getPass(
              parseInt(this.props.selectedBooking.consumer_payment_pack_id, 10),
            )
          }
          getPaymentPack={this.props.getPaymentPack}
          decrementCredit={this.props.decrementCredit}
          incrementCredit={this.props.incrementCredit}
          booking={this.props.selectedBooking}
          member={this.props.member}
          onConsumerPassSelected={this.goToConsumerPass}
          loading={this.props.consumerPackLoading || this.props.offerLoading}
          onOfferClick={this.props.goToOffer}
          offer={this.props.offer}
          offerLoading={
            !this.props.selectedBooking ||
            !this.props.offer ||
            this.props.selectedBooking.offer !== this.props.offer.id
          }
        />
      );
    }

    return null;
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
          alignItems="stretch"
          item
          xs={12}
          lg={6}
          direction="column"
          spacing={3}
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
                  <Typography variant="h6" className={this.props.classes.bold}>
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
                  <Typography variant="h6" className={this.props.classes.bold}>
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
                  <Typography variant="h6" className={this.props.classes.bold}>
                    {this.props.t('booking:warning')}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <div>
                    <Typography
                      variant="subtitle1"
                      className={this.props.classes.bold}
                    >
                      {this.props.t('booking:spivi.connectionImpossible')}
                    </Typography>
                    {this.props.t('booking:spivi.errorText')}
                  </div>
                  <div className={this.props.classes.secondWarning}>
                    <Typography
                      variant="subtitle1"
                      className={this.props.classes.bold}
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
            <PaginatedBookingOptionList
              itemPerPage={5}
              items={this.props.bookingOptionList}
              loading={this.props.bookingOptionListLoading}
              onPageRequested={(page) => {
                this.props.fetchBookingOptionForMember({
                  member: this.props.id,
                  page,
                  page_size: 5,
                });
              }}
              nbItems={this.props.bookingOptionCount}
              page={this.props.bookingOptionPage}
              onClick={(bo) => {
                this.props.setSelectedBookingOption(
                  this.props.selectedBookingOption &&
                    this.props.selectedBookingOption.id === bo.id
                    ? null
                    : bo,
                );
              }}
              onClickRegister={(bo) => this.props.goToOffer(bo.offer.id)}
              onClickDiscard={(bo) => this.props.setDiscardBookingOption(bo.id)}
              selectedBookingOption={this.props.selectedBookingOption}
            />

            <Paper style={{ width: '100%' }}>
              <BookingFilters
                setOpenValue={this.props.setOpenValue}
                setFiltersValue={this.props.setFilterValue}
                open={this.props.open}
                filters={!dataLoading && this.props.filters}
                coaches={this.props.coaches}
              />
              <Divider />

              <MemberProgramDetailDialog
                loading={this.props.programDataLoading}
                open={this.state.isMemberProgramDetailDialogOpen}
                closeDialog={() =>
                  this.setState({
                    isMemberProgramDetailDialogOpen: false,
                  })
                }
                memberProgramList={this.props.memberProgramIdsList(
                  this.props.id,
                )}
                booking={this.props.bookings?.find(
                  (b) => b?.member === this.props.id,
                )}
                members={[this.props.member]}
                updateMemberMetricValue={this.props.updateMemberMetricValue}
                createMemberProgram={(id) =>
                  this.props.createMemberProgram({
                    program: id,
                    member: this.props.id,
                  })
                }
                programList={this.props.programList}
              />
              {!this.props.userFiltersLoading && (
                <PaginatedListBase
                  itemPerPage={BOOKING_PAGE_SIZE}
                  loading={this.props.bookingsLoading}
                  listProps={{ disablePadding: true }}
                  items={this.props.bookings}
                  nbItems={this.props.bookingCount}
                  page={this.props.bookingCurrentPage}
                  additionalFilters={this.props.filters}
                  onPageRequested={(page, page_size) =>
                    this.props.fetchMemberBookingsList(page, page_size)
                  }
                  renderCustomPageFirst={!!this.props.bookingId}
                  renderItem={(b: Booking) => (
                    <BookingItemForManagerV2
                      programList={this.props.programList}
                      onClick={() => this.selectBooking(b)}
                      showRevertBookingButton
                      button
                      selected={
                        this.props.selectedBooking &&
                        this.props.selectedBooking.id === b.id
                      }
                      key={b.id}
                      booking={b}
                      heading="date_start"
                      member={this.props.member}
                      handleRevert={() => {
                        this.props.fetchOffer(b.offer, {
                          onSuccess: (offer: Offer) => {
                            if (offer.group) {
                              this.props.fetchGroupOffer(offer.group);
                              this.props.fetchSimilarFuturBookingInGroup(
                                offer.group,
                                b.member,
                              );
                            }
                          },
                        });

                        this.setState({ bookingToRevert: b });
                      }}
                      discardBookingAttendance={() =>
                        this.props.discardBookingAttendance(b.id)
                      }
                      confirmBookingAttendance={() =>
                        this.props.confirmBookingAttendance(b.id)
                      }
                      spotSchedulingEnabled={typeof b.spot_id === 'number'}
                      onClickChangeSpot={this.onClickChangeSpot}
                      onProgramDetailsClick={() => {
                        this.props.fetchPerformanceTrackingData(this.props.id);
                        this.setState({
                          isMemberProgramDetailDialogOpen: true,
                        });
                      }}
                      displayNoShowChip
                      noShowChipMessage={this.props.t(
                        'booking:noShowChip.message',
                      )}
                      onClickNoShowChip={this.openNoShowChipMessageDialog}
                      isRollCallMandatory={
                        this.props.theme.is_roll_call_mandatory
                      }
                      dateRollCallLastModified={b.date_roll_call_last_modified}
                      onClickWarningIcon={this.openWarningDialog}
                    />
                  )}
                />
              )}
            </Paper>
            {!!this.props.recurrenceRuleBooking.length && (
              <Paper className={this.props.classes.recurrenceRuleContainer}>
                <Typography variant="caption" style={{ padding: 10 }}>
                  {this.props.t('booking:recurrenceRule.recurrentBookings')}
                </Typography>
                <Divider />
                <List disablePadding>
                  {this.props.recurrenceRuleBooking.map((r) => (
                    <RecurrenceRuleBookingListItem
                      notShowMember
                      key={r.id}
                      recurrenceRuleBooking={{
                        ...r,
                        member: this.props.member,
                      }}
                      onDelete={(id, data) =>
                        this.props.onDeleteRecurrenceRuleBooking(
                          r,
                          this.props.id,
                          data,
                        )
                      }
                      onEdit={() => {
                        this.props.fetchActivitiesCompany(
                          this.props.theme.company,
                        );
                        this.props.fetchEstablishmentList();
                        this.props.setBookerInAvanceDialog(true);
                        this.props.setSelectedRecurrentBooking(r);
                      }}
                    />
                  ))}
                </List>
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

            <div className={this.props.classes.createRecurrentBooking}>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.setBookerInAvanceDialog(true);
                  this.props.fetchActivitiesCompany(this.props.theme.company);
                  this.props.fetchEstablishmentList();
                }}
                color="primary"
              >
                {this.props.t('booking:recurrenceRule.createModal.create')}
              </Button>
            </div>
            {this.props.bookerInAvanceDialog && (
              <RecurrenceRuleBookingFormDialog
                refresh={this.props.refresh}
                initial={this.props.selectedRecurrentBooking}
                metaActivityList={this.props.metaActivities}
                establishmentList={this.props.establishmentList}
                onClose={() => {
                  this.props.setBookerInAvanceDialog(false);
                  this.props.setSelectedRecurrentBooking(null);
                }}
                onSubmit={this.props.onSubmitRecurrentBooking}
                fetchGroupsOfferList={this.props.fetchGroupsOfferList}
                hasActivityGroups={this.props.activityGroups > 0}
              />
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.renderDetails()}
        </Grid>

        <DiscardBookingOptionDialogV2
          open={!!this.props.discardBookingOption}
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
          onClose={() => this.props.setDiscardBookingOption(null)}
        />

        {this.state.bookingToRevert && (
          <RevertBookingDialog
            handleBookingDeletion={this.handleBookingDeletion}
            bookingToRevert={this.state.bookingToRevert}
            offerIsAvailable
            closeRevertBookingDialog={() =>
              this.setState({ bookingToRevert: null })
            }
            offer={this.props.offer}
            similarBookings={this.props.similarBookingList}
          />
        )}

        <AsyncSpotSelector
          fetchRoomBlueprintDetail={this.props.fetchRoomBlueprintDetail}
          roomBlueprintById={this.props.roomBlueprintById}
          fetchAssetForBlueprint={this.props.fetchAssetForBlueprint}
          fetchSpotForBlueprint={this.props.fetchSpotForBlueprint}
          fetchOfferStatus={this.props.fetchOfferStatus}
          fetchOfferById={this.props.fetchOffer}
          offer={this.props.offer}
          offerStatusById={this.props.offerStatusById}
          assetsForBlueprintById={this.props.assetsForBlueprintById}
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
  graphContainer: {
    padding: theme.spacing(2),
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
  withState('selectedRecurrentBooking', 'setSelectedRecurrentBooking', null),
  withState('selectedBookingOption', 'setSelectedBookingOption', null),
  withState('discardBookingOption', 'setDiscardBookingOption', null),
  withState('chartRange', 'setChartRange', {
    start: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    kind: 'current_year',
  }),
  connect(
    (state, { id, bookingId, chartRange }) => ({
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
      graphData: getStatisticTemporal(state, 'memberBooking', chartRange),
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
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      retrieveBooking,
      fetchOffer: fetchOfferByIdAction,
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
      fetchBookingStatistics: fetchBookingStatisticsAction,
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
      fetchLevelList: fetchLevelListAction,
      fetchSpotForBlueprint: fetchSpotForBlueprintAction,
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
    fetchMemberBookingStatistics:
      ({ id, fetchBookingStatistics, chartRange, filters }) =>
      () => {
        fetchBookingStatistics('memberBooking', {
          date_field: 'offer__date_start',
          min_date: chartRange.start,
          max_date: chartRange.end,
          member: id,
          aggregate_function: 'count',
          aggregate_field: 'pk',
          aggregate_period: 'day',
          ...filters,
        });
      },
    onSubmitRecurrentBooking:
      ({
        id,
        updateRecurrenceRuleBooking,
        selectedRecurrentBooking,
        setSelectedRecurrentBooking,
        createRecurrenceRuleBooking,
      }) =>
      (data, options) => {
        if (id && selectedRecurrentBooking) {
          updateRecurrenceRuleBooking(
            {
              ...data,
              member: id,
            },
            selectedRecurrentBooking.id,
            options,
          );
        }
        if (id && !selectedRecurrentBooking) {
          createRecurrenceRuleBooking({ ...data, member: id }, options);
        }
        setSelectedRecurrentBooking(null);
      },
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
                bookings.map((b) => b.consumer_payment_pack),
                {
                  onSuccess: (cppList) =>
                    fetchPaymentPackBulk(
                      cppList.map((cpp) => cpp.payment_pack),
                    ),
                },
              ),
          },
        });
        setBookerInAvanceDialog(false);
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
      }) =>
      (page, page_size) => {
        fetchMemberBookings({
          member: id,
          page,
          page_size,
          current_booking_id: !page ? bookingId : null,
          filters,
          options: {
            onSuccess: (bookings) =>
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              ),
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
