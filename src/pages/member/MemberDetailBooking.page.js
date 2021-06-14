// @flow

import React, { Component } from 'react';
import moment from 'moment-timezone';
import omit from 'lodash/omit';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import { getAssetByBlueprintByIdentifier } from '../../libs/spot-scheduling/selector';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';

import PaginatedListBase from '../../components/PaginatedListBase.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

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
} from '../../libs/booking/actions';
import {
  fetchEstablishments as fetchEstablishmentList,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../libs/establishment/actions';

import {
  fetchManagerFiltersSettings,
  updateManagerFiltersSettings,
} from '../../libs/dashboard/actions';

import {
  fetchOfferById as fetchOfferByIdAction,
  fetchOfferStatus as fetchOfferStatusAction,
} from '../../libs/offer/actions';

import { getDetailedOffer } from '../../libs/offer/selectors';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
} from '../../libs/spot-scheduling/actions';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  updateCredit as updateCreditAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
  fetchAllActivities as fetchAllActivitiesAction,
} from '../../libs/meta-activity/actions';

import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';

import type { Member } from '../../libs/member/types';
import type { PaymentPack } from '../../libs/payment-packs/types';
import type { Booking } from '../../libs/booking/types';

import BookingItemForManagerV2 from '../../libs/booking/components/BookingItemForManagerV2.component';
import BookingDetail from '../../libs/booking/components/BookingDetail.component';
import RecurrenceRuleBookingFormDialog from '../../libs/booking/components/RecurrenceRuleBookingFormDialog.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import BookingFilters from '../../libs/booking/components/BookingFilters.component';
import RecurrenceRuleBookingListItem from '../../libs/booking/components/RecurrenceRuleBookingListItem.component';
import TemporalBarChart from '../../components/graph/TemporalBarChart.component';

import {
  getMemberBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
  getRecurrenceRuleBookingList,
} from '../../libs/booking/selectors';
import { getMember } from '../../libs/member/selectors';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';
import { getConsumerPack } from '../../libs/consumer-payment-pack/selectors';
import themeSelectors from '../../libs/theme/selectors';
import { fetchBookingStatistics2 as fetchBookingStatisticsAction } from '../../actions/stats.actions';
import { getStatisticTemporal } from '../../libs/statistics/selectors';
import ChartRange from '../../libs/dashboard/components/ChartRange.component';
import type { Theme } from '../../libs/theme/types';
import AsyncSpotSelector, {
  asyncSelectSpotForBlueprint,
} from '../../libs/spot-scheduling/component/SpotSelector/AsyncSpotSelector.container';

type Props = {
  classes: *,
  t: TFunction,
  id: number,
  bookingId: ?number,
  retrieveBooking: (number, OptionCallback) => void,
  retrieveConsumerPackBulk: (Array<number>) => void,
  member: Member,

  bookings: Array<Booking>,
  bookingCount: number,
  bookingCurrentPage: number,
  fetchMemberBookingsList: (page: number, pageSize: number) => void,

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
  member: Member,
  consumerPackLoading: boolean,
  offer: ?Offer,

  fetchRoomBlueprintDetail: (number) => void,
  roomBlueprintById: { [number]: RoomBlueprint },
  fetchAssetForBlueprint: (number) => void,
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
  fetchAllActivities: () => void,
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
  updateFiltersSettings: (*) => void,
  recurrentBookingLoading: boolean,
  userFiltersLoading: boolean,
  setSpotForBooking: () => void,
};

type State = {
  bookingToRevert: ?Booking,
};

const BOOKING_PAGE_SIZE = 7;
const RECURRENT_BOOKING_PAGE_SIZE = 5;

export class MemberDetailBooking extends Component<Props, State> {
  state = {
    bookingToRevert: null,
  };

  componentDidMount() {
    if (this.props.bookingId) {
      this.fetchBookingDetails();
    }
    this.props.fetchAllActivities();
    this.props.fetchRecurrenceRuleBooking(1);
    this.props.fetchMemberBookingStatistics();
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
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchMemberBookings(
        this.props.id,
        1,
        BOOKING_PAGE_SIZE,
        this.props.filters,
        {
          onSuccess: (bookings) => {
            this.props.retrieveConsumerPackBulk(
              bookings.map((b) => b.consumer_payment_pack),
            );
          },
        },
      );
      this.props.fetchMemberBookingStatistics();
      this.props.updateFiltersSettings(this.props.filters);
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
  }

  fetchBookingDetails = () => {
    this.props.retrieveBooking(this.props.bookingId, {
      onSuccess: (booking) => {
        this.props.fetchOffer(booking.offer);
        this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]);
      },
    });
  };

  handleBookingDeletion = (data: any, options: OptionCallback) => {
    this.props.deleteBooking(this.state.bookingToRevert.id, data, options);
    this.setState({ bookingToRevert: null });
  };

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  selectBooking = (booking: Booking) => {
    if (this.props.bookingId && this.props.bookingId === booking.id) {
      this.props.unselectBooking(this.props.id);
    } else {
      this.props.selectBooking(this.props.id, booking.id);
    }
  };

  onClickChangeSpot = async (booking: Booking) => {
    const spot_id = await asyncSelectSpotForBlueprint(booking.offer);
    if (spot_id !== undefined) {
      this.props.setSpotForBooking(booking.id, spot_id);
    }
  };

  render() {
    const { primary_color } = this.props.theme;
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
          <Grid item style={{ width: '100%' }}>
            <Paper style={{ width: '100%' }}>
              <BookingFilters
                setOpenValue={this.props.setOpenValue}
                setFiltersValue={this.props.setFilterValue}
                open={this.props.open}
                filters={!dataLoading && this.props.filters}
              />
              <Divider />
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
                renderItem={(b: Booking) => (
                  <BookingItemForManagerV2
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
                    handleRevert={() => this.setState({ bookingToRevert: b })}
                    discardBookingAttendance={() =>
                      this.props.discardBookingAttendance(b.id)
                    }
                    confirmBookingAttendance={() =>
                      this.props.confirmBookingAttendance(b.id)
                    }
                    spotSchedulingEnabled={typeof b.spot_id === 'number'}
                    onClickChangeSpot={this.onClickChangeSpot}
                  />
                )}
              />
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
                        this.props.fetchAllActivities();
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
                  this.props.fetchAllActivities();
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
              />
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          {!this.props.selectedBooking ? (
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
          ) : (
            <BookingDetail
              consumerPack={
                this.props.selectedBooking &&
                this.props.getPass(
                  parseInt(
                    this.props.selectedBooking.consumer_payment_pack_id,
                    10,
                  ),
                )
              }
              getPaymentPack={this.props.getPaymentPack}
              decrementCredit={this.props.decrementCredit}
              incrementCredit={this.props.incrementCredit}
              booking={this.props.selectedBooking}
              member={this.props.member}
              onConsumerPassSelected={this.goToConsumerPass}
              loading={
                this.props.consumerPackLoading || this.props.offerLoading
              }
              onOfferClick={this.props.goToOffer}
              offer={this.props.offer}
              offerLoading={
                !this.props.selectedBooking ||
                !this.props.offer ||
                this.props.selectedBooking.offer !== this.props.offer.id
              }
            />
          )}
        </Grid>
        <RevertBookingDialog
          handleBookingDeletion={this.handleBookingDeletion}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable
          closeRevertBookingDialog={() =>
            this.setState({ bookingToRevert: null })
          }
        />

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
});
export default compose(
  routerParamsToProps({ id: 'id:number', bookingId: 'bookingId:number' }),
  withTranslation('booking'),
  withStyles(styles),
  withState('open', 'setOpen', {}),
  withState('bookerInAvanceDialog', 'setBookerInAvanceDialog', false),
  withState('selectedRecurrentBooking', 'setSelectedRecurrentBooking', null),
  withState('chartRange', 'setChartRange', {
    start: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    kind: 'current_year',
  }),
  connect(
    (state, { id, bookingId, chartRange }) => ({
      theme: themeSelectors.getTheme(state),
      member: getMember(state, id),
      bookings: getMemberBookingListWithConsumerPack(state),
      selectedBooking: bookingId
        ? getMemberBookingWithConsumerPack(state, bookingId)
        : null,
      bookingCurrentPage: state.booking.byMember.page,
      bookingsLoading: state.booking.byMember.loading,
      bookingCount: state.booking.byMember.count,
      paymentPacks: getAllPaymentPacks(state),
      consumerPackLoading: state.consumerPaymentPack.loading,
      offer: getDetailedOffer(state),
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

      roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
      assetsForBlueprintById: getAssetByBlueprintByIdentifier(state),
      offerStatusById: state.offer.offerStatus.byId,
    }),
    {
      fetchMemberBookings: fetchBookingsByMemberAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      retrieveBooking,
      fetchOffer: fetchOfferByIdAction,

      fetchEstablishmentList,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,

      fetchRecurrenceRuleBooking: fetchRecurrenceRuleBookingAction,
      deleteRecurrenceRuleBooking: deleteRecurrenceRuleBookingAction,
      fetchMember: fetchMemberAction,
      createRecurrenceRuleBooking: createRecurrenceRuleBookingAction,
      fetchAllActivities: fetchAllActivitiesAction,
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
    },
  ),
  withState('filters', 'setFilters', (props) => {
    const { userFilters } = props;
    if (userFilters && userFilters.private_pass_filters) {
      return userFilters.booking_filters;
    }
    return {};
  }),
  withHandlers({
    fetchRecurrenceRuleBooking: ({
      fetchRecurrenceRuleBooking,
      fetchMetaActivityBulk,
      fetchEstablishmentBulk,
      id,
    }) => (page) => {
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
    fetchMemberBookingStatistics: ({
      id,
      fetchBookingStatistics,
      chartRange,
      filters,
    }) => () => {
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
    onSubmitRecurrentBooking: ({
      id,
      updateRecurrenceRuleBooking,
      selectedRecurrentBooking,
      setSelectedRecurrentBooking,
      createRecurrenceRuleBooking,
    }) => (data, options) => {
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
    refresh: ({
      fetchRecurrenceRuleBooking,
      fetchMemberBookings,
      filters,
      retrieveConsumerPackBulk,
      setBookerInAvanceDialog,
      id,
    }) => () => {
      fetchRecurrenceRuleBooking(1);
      fetchMemberBookings(id, 1, BOOKING_PAGE_SIZE, filters, {
        onSuccess: (bookings) =>
          retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
      setBookerInAvanceDialog(false);
    },
    setOpenValue: ({ setOpen, open }) => (name: string) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    onDeleteRecurrenceRuleBooking: ({
      deleteRecurrenceRuleBooking,
      fetchMemberBookings,
      retrieveConsumerPackBulk,
      fetchRecurrenceRuleBooking,
      filters,
    }) => (r, memberId, data) => {
      deleteRecurrenceRuleBooking(r.id, data, {
        onSuccess: () => {
          fetchRecurrenceRuleBooking(1);
          fetchMemberBookings(memberId, 1, BOOKING_PAGE_SIZE, filters, {
            onSuccess: (bookings) =>
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              ),
          });
        },
      });
    },
    fetchMemberBookingsList: ({
      id,
      filters,
      fetchMemberBookings,
      retrieveConsumerPackBulk,
    }) => (page, page_size) => {
      fetchMemberBookings(id, page, page_size, filters, {
        onSuccess: (bookings) =>
          retrieveConsumerPackBulk(
            bookings.map((b) => b.consumer_payment_pack),
          ),
      });
    },
    setFilterValue: ({ setFilters, filters }) => (name: string, value) => {
      if (value === null) {
        setFilters(omit(filters, name));
      } else {
        setFilters({
          ...filters,
          [name]: value,
        });
      }
    },
  }),
  withHandlers({
    fetchFiltersSettings: ({ fetchManagerFilters, setFilters }) => () => {
      fetchManagerFilters({
        onSuccess: (payload) => {
          setFilters(payload.filters.booking_filters);
        },
      });
    },
  }),
  withHandlers({
    updateFiltersSettings: ({ updateManagerFilters, userFilters }) => (
      filters: object,
    ) => {
      updateManagerFilters({
        ...userFilters,
        booking_filters: filters,
      });
    },
  }),
)(MemberDetailBooking);
