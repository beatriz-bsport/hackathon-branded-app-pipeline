// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  withState,
  withHandlers,
  withProps,
  withStateHandlers,
} from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import PrivateBookingFilters from '#src/libs/booking/components/PrivateBookingFilters.component';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { getMemberPrivateBookingFilter } from '#src/libs/user-preference/selectors';
import { setMemberPrivateBookingFilter as setMemberPrivateBookingFilterAction } from '#src/libs/user-preference/actions';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';
import PaginatedListBase from '../../components/PaginatedListBase.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchAssociatedEstablishmentBulk as fetchAssociatedEstablishmentBulkAction } from '../../libs/establishment/actions';
import {
  deletePrivateBooking as deletePrivateBookingAction,
  resetPrivateBookings as resetPrivateBookingList,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateBookings as fetchPrivateBookingListAction,
  fetchPrivateBooking as fetchPrivateBookingAction,
  fetchPrivateService as fetchPrivateServiceAction,
  fetchPrivateSlot as fetchPrivateSlotAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateConsumerPass as fetchPrivateConsumerPassAction,
  fetchPrivateConsumerPassBulk as fetchPrivateConsumerPassBulkAction,
  attachCoachToPrivateBooking as attachCoachAction,
  restorePrivateBooking,
  fetchRecurrenceRulePrivateBooking as fetchRecurenceRulePrivateBookingAction,
  deleteRecurrenceRulePrivateBooking as deleteRecurrenceRulePrivateBookingAction,
  forceRegularizeUnpaid as forceRegularizeUnpaidAction,
} from '../../libs/private-service/actions';
import { getCoaches } from '../../libs/associated-coach/selectors';
import {
  getPrivateBookingListBase,
  getPrivateBooking,
  withRelatedFields,
  withStaffModificationHistory,
  getRecurrenceRulePrivateBookingList,
} from '../../libs/private-service/selectors/private-booking';
import { getPrivateConsumerPassDict } from '../../libs/private-service/selectors/private-consumer-pass';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';

import PrivateBookingListItem from '../../libs/private-service/components/booking/PrivateBookingListItem.component';
import PrivateBookingDetail from '../../libs/private-service/components/booking/PrivateBookingDetail.component';
import PrivateBookingDisableDialog from '../../libs/private-service/components/booking/PrivateBookingDisableDialog.component';
import PrivateBookingAttachCoachDialog from '../../libs/private-service/components/booking/PrivateBookingAttachCoachDialog.component';
import RecurrenceRulePrivateBookingItem from '../../libs/private-service/components/booking/RecurrenceRulePrivateBookingItem.component';

import type {
  PrivateConsumerPass,
  PrivateBooking,
  PrivateService,
  PrivateSlot,
  RecurrenceRulePrivateBooking,
} from '../../libs/private-service/types';
import RecurrenceRulePrivateBooker from '../../libs/private-service/containers/RecurrenceRulePrivateBooker.container';
import type { OptionCallBack } from '../../state/types';

const PAGE_SIZE = 5;

type Props = {
  t: TFunction,
  classes: Object,
  id: number,
  companyId: number,

  resetPrivateBookingList: () => void,
  privateBookingCurrentPage: number,
  bookingCount: number,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  fetchMember: (id: number, options: OptionCallBack) => void,
  private_consumer_pass?: PrivateConsumerPass,
  fetchPrivateBookingsList: (params: any) => void,
  private_booking_list: Array<PrivateBooking>,
  private_slot: PrivateSlot,

  private_service: PrivateService,
  goToPrivateConsumerPass: (
    memberId: number,
    privateConsumerPassId: number,
  ) => void,

  isOpenAttachCoach: boolean,
  serviceCoaches: Array<Coach>,
  attachCoach: (data: any) => void,
  availableCoaches: Array<Coach>,
  closeAttachCoach: () => void,

  openAttachCoach: () => void,
  private_consumer_pass?: PrivateConsumerPass,
  onPrivateSlotClick: () => void,

  private_booking?: PrivateBooking,
  privateBookingId?: number,
  fetchPrivateBookingDetails: (options?: OptionCallBack) => void,
  fetchCompanyUserRoles: () => void,
  fetchPrivateConsumerPass: (id: number) => void,
  privateBookingsLoading: boolean,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  setBookingToDelete: (booking?: PrivateBooking) => void,
  bookingToDelete?: PrivateBooking,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  restorePrivateBooking: (id: number) => void,

  bookerInAdvanceDialog: boolean,
  setBookerInAdvanceDialog: (boolean) => void,
  recurrenceRulePrivateBooking: Array<any>,
  recurrentPrivateBookingLoading: boolean,
  onDeleteRecurrenceRulePrivateBooking: (
    rb: RecurrenceRulePrivateBooking,
    memberId: number,
    data: { cancel_related_bookings: boolean },
  ) => void,
  fetchRecurrenceRulePrivateBooking: () => void,
  setSelectedRecurrentRule: (RecurrenceRulePrivateBooking) => void,
  selectedRecurrentRule: RecurrenceRulePrivateBooking,
  forceRegularizeUnpaid: (options: OptionCallBack) => void,

  open: boolean,
  setOpenValue: (name: string) => void,
  filters: PrivateBookingFilter,
  setFilterValue: (name: string, bool: Boolean) => void,
  setMemberPrivateBookingFilter: (filter: PrivateBookingFilter) => void,
};

export class MemberDetailPrivateBooking extends Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.resetPrivateBookingList();
  }

  componentDidMount() {
    this.props.fetchCompanyUserRoles();
    this.props.fetchMember(this.props.id);
    if (this.props.privateBookingId) {
      this.props.fetchPrivateBookingDetails();
    }
    this.props.fetchRecurrenceRulePrivateBooking();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (this.props.privateBookingId &&
        prevProps.privateBookingId !== this.props.privateBookingId) ||
      prevProps.id !== this.props.id
    ) {
      // this.props.resetPrivateBookingList();
      this.props.fetchMember(this.props.id, {
        onSuccess: () => {
          this.props.fetchPrivateBookingDetails();
          this.props.fetchPrivateBookingsList({
            page: this.props.privateBookingCurrentPage,
            page_size: PAGE_SIZE,
          });
        },
      });
    }

    if (prevProps.filters !== this.props.filters) {
      this.props.fetchPrivateBookingsList({ page: 1, page_size: 5 });
      this.props.setMemberPrivateBookingFilter(this.props.filters);
    }
  }

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <Grid container direction="row" spacing={3}>
        <Grid container item direction="column" lg={6} spacing={3} xs={12}>
          <Grid item>
            <Paper>
              <PrivateBookingFilters
                filters={
                  !this.props.privateBookingsLoading && this.props.filters
                }
                open={this.props.open}
                setFiltersValue={this.props.setFilterValue}
                setOpenValue={this.props.setOpenValue}
              />
              <Divider />
              <PaginatedListBase
                itemPerPage={5}
                items={this.props.private_booking_list}
                listProps={{ disablePadding: true }}
                loading={this.props.privateBookingsLoading}
                nbItems={this.props.bookingCount}
                onPageRequested={(page, page_size) =>
                  this.props.fetchPrivateBookingsList({
                    page,
                    page_size,
                  })
                }
                page={this.props.privateBookingCurrentPage || 0}
                renderItem={(b) => (
                  <PrivateBookingListItem
                    key={b.id}
                    divider
                    onClick={() =>
                      this.props.goToPrivateBooking(this.props.id, b.id)
                    }
                    onDelete={() => this.props.setBookingToDelete(b)}
                    onRestore={() => this.props.restorePrivateBooking(b.id)}
                    private_booking={b}
                    selected={this.props.privateBookingId === b.id}
                  />
                )}
              />
            </Paper>
            {!!this.props.recurrenceRulePrivateBooking.length && (
              <Paper className={classes.recurrenceRuleContainer}>
                <div className={classes.tabTitle}>
                  <Typography variant="caption">
                    {t('recurrenceRule.recurrentBookings')}
                  </Typography>
                </div>
                <Divider />
                <PaginatedListStateful
                  itemPerPage={5}
                  items={this.props.recurrenceRulePrivateBooking}
                  listProps={{ disablePadding: true }}
                  loading={this.props.recurrentPrivateBookingLoading}
                  renderItem={(rb) => (
                    <RecurrenceRulePrivateBookingItem
                      notShowMember
                      onDelete={(data) =>
                        this.props.onDeleteRecurrenceRulePrivateBooking(
                          rb,
                          this.props.id,
                          data,
                        )
                      }
                      onEdit={() => {
                        this.props.setBookerInAdvanceDialog(true);
                        this.props.setSelectedRecurrentRule(rb);
                      }}
                      recurrentPrivateBooking={rb}
                    />
                  )}
                />
              </Paper>
            )}
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="reservation.privateBooking.allowed_actions.create"
            >
              <div className={classes.createRecurrentBooking}>
                <Button
                  color="primary"
                  onClick={() => {
                    this.props.setBookerInAdvanceDialog(true);
                    this.props.setSelectedRecurrentRule(null);
                  }}
                  variant="outlined"
                >
                  {this.props.t('recurrenceRule.createModal.create')}
                </Button>
              </div>
            </ObjectLevelPermissionWrapper>
          </Grid>
        </Grid>
        <Grid item lg={6} xs={12}>
          {this.props.private_booking ? (
            <PrivateBookingDetail
              availableCoaches={this.props.availableCoaches}
              forceRegularizeUnpaid={this.props.forceRegularizeUnpaid}
              goToPrivateConsumerPass={(privateConsumerPassId) =>
                this.props.goToPrivateConsumerPass(
                  this.props.id,
                  privateConsumerPassId,
                )
              }
              onOpenAttachCoach={this.props.openAttachCoach}
              onPrivateSlotClick={this.props.onPrivateSlotClick}
              private_booking={this.props.private_booking}
              private_consumer_pass={this.props.private_consumer_pass}
              private_service={this.props.private_booking.private_service}
              private_slot={this.props.private_booking.private_slot}
            />
          ) : null}
        </Grid>
        {!!this.props.isOpenAttachCoach && (
          <PrivateBookingAttachCoachDialog
            associatedCoachList={this.props.serviceCoaches}
            onClose={this.props.closeAttachCoach}
            onSubmit={this.props.attachCoach}
            open={!!this.props.isOpenAttachCoach}
          />
        )}
        {!!this.props.bookingToDelete && (
          <PrivateBookingDisableDialog
            onClose={() => this.props.setBookingToDelete(null)}
            onSubmit={(force_refund) =>
              (this.props.bookingToDelete.booking_status_code ===
                BOOKING_STATUS_OK.id
                ? this.props.disablePrivateBooking
                : this.props.deletePrivateBooking)(
                this.props.bookingToDelete.id,
                { force_refund },
                {
                  onSuccess: () => {
                    this.props.fetchPrivateConsumerPass(
                      this.props.bookingToDelete.private_consumer_pass,
                    );
                    this.props.setBookingToDelete(null);
                  },
                  onError: () => {
                    this.props.setBookingToDelete(null);
                  },
                },
              )
            }
            open={!!this.props.bookingToDelete}
            private_booking={this.props.bookingToDelete}
          />
        )}
        {this.props.bookerInAdvanceDialog && (
          <RecurrenceRulePrivateBooker
            companyId={this.props.companyId}
            initial={this.props.selectedRecurrentRule}
            memberId={this.props.id}
            onChange={() => {
              this.props.fetchPrivateBookingsList({
                page: 1,
                page_size: PAGE_SIZE,
              });
              this.props.fetchRecurrenceRulePrivateBooking();
            }}
            open={this.props.bookerInAdvanceDialog}
            setOpen={this.props.setBookerInAdvanceDialog}
          />
        )}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  recurrenceRuleContainer: {
    marginTop: theme.spacing(3),
  },
  createRecurrentBooking: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabTitle: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateBookingId: 'privateBookingId:number',
  }),
  withTranslation('privateService'),
  withStyles(styles),
  withState('bookerInAdvanceDialog', 'setBookerInAdvanceDialog', false),
  withState('selectedRecurrentRule', 'setSelectedRecurrentRule', null),
  connect(
    (state, { privateBookingId }) => ({
      private_booking_list: withStaffModificationHistory(
        withRelatedFields(getPrivateBookingListBase),
      )(state),
      private_booking: withStaffModificationHistory(
        withRelatedFields(getPrivateBooking),
      )(state, privateBookingId),
      privateBookingCurrentPage: state.privateService.privateBooking.page,
      bookingCount: state.privateService.privateBooking.count,
      privateBookingsLoading: state.privateService.privateBooking.loading,
      availableCoaches: getCoaches(state),
      companyId: state.theme.theme.company,
      recurrenceRulePrivateBooking: getRecurrenceRulePrivateBookingList(state),
      recurrentPrivateBookingLoading:
        state.privateService.recurrenceRule.loading,
      userFilters: getMemberPrivateBookingFilter(state),
    }),
    {
      fetchPrivateBookings: fetchPrivateBookingListAction,
      fetchPrivateBooking: fetchPrivateBookingAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchPrivateSlot: fetchPrivateSlotAction,
      fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
      fetchAssociatedEstablishmentBulk: fetchAssociatedEstablishmentBulkAction,
      fetchPrivateConsumerPass: fetchPrivateConsumerPassAction,
      fetchPrivateConsumerPassBulk: fetchPrivateConsumerPassBulkAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      fetchRecurrenceRulePrivateBooking: fetchRecurenceRulePrivateBookingAction,
      fetchCompanyUserRoles,
      forceRegularizeUnpaid: forceRegularizeUnpaidAction,
      deleteRecurrenceRulePrivateBooking:
        deleteRecurrenceRulePrivateBookingAction,
      deletePrivateBooking: deletePrivateBookingAction,
      resetPrivateBookingList,
      disablePrivateBooking: disablePrivateBookingAction,
      fetchMember: fetchMemberAction,
      attachCoach: attachCoachAction,
      restorePrivateBooking,
      setMemberPrivateBookingFilter: setMemberPrivateBookingFilterAction,
      goToPrivateService: (privateServiceId) =>
        push(`/private-service/service/${privateServiceId}/`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
    },
  ),
  connect((state, { private_booking }) => ({
    private_consumer_pass: private_booking
      ? getPrivateConsumerPassDict(state)[
          private_booking.private_consumer_pass.id ||
            private_booking.private_consumer_pass
        ]
      : null,
  })),
  withProps(({ private_booking, availableCoaches }) => ({
    serviceCoaches: availableCoaches.filter((c) =>
      c.associatedcoach_set.filter(
        (value) =>
          private_booking &&
          private_booking.private_service &&
          private_booking.private_service.coaches.indexOf(value) !== -1,
      ),
    ),
  })),
  withHandlers({
    onPrivateSlotClick:
      ({ goToPrivateService, private_booking }) =>
      () =>
        goToPrivateService(private_booking.private_service.id),
  }),
  withState('bookingToDelete', 'setBookingToDelete', null),
  withStateHandlers(
    { isOpenAttachCoach: null },
    {
      openAttachCoach:
        (_, { private_booking }) =>
        () => ({
          isOpenAttachCoach: private_booking,
        }),
      closeAttachCoach: () => () => ({ isOpenAttachCoach: null }),
    },
  ),
  withState('filters', 'setFilters', (props) => {
    const { userFilters = {} } = props;

    return userFilters;
  }),
  withState('open', 'setOpen', {}),
  withHandlers({
    setOpenValue:
      ({ setOpen, open }) =>
      (name: string) => {
        setOpen({
          ...open,
          [name]: !open[name],
        });
      },
    setFilterValue:
      ({ setFilters, filters }) =>
      (name: string, value) => {
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
    attachCoach:
      ({ attachCoach, closeAttachCoach, privateBookingId }) =>
      (data) => {
        attachCoach(privateBookingId, data, {
          onSuccess: () => closeAttachCoach(),
        });
      },
    fetchPrivateBookingDetails:
      ({
        privateBookingId,
        fetchPrivateConsumerPass,
        fetchAssociatedCoachBulk,
        fetchPrivateService,
        fetchPrivateSlot,
        fetchPrivateBooking,
      }) =>
      () => {
        fetchPrivateBooking(privateBookingId, {
          onSuccess: (privateBooking) => {
            fetchPrivateService(privateBooking.private_service, {
              onSuccess: (service) => {
                if (service && service.coaches.length) {
                  fetchAssociatedCoachBulk(service.coaches);
                }
              },
            });
            fetchPrivateSlot(
              privateBooking.private_service,
              privateBooking.private_slot,
            );
            fetchPrivateConsumerPass(privateBooking.private_consumer_pass);
          },
        });
      },
    forceRegularizeUnpaid:
      ({
        forceRegularizeUnpaid,
        fetchPrivateBookings,
        privateBookingCurrentPage,
        id,
        filters,
      }) =>
      (options) => {
        forceRegularizeUnpaid(id, null, {
          onError: options?.onError,
          onSuccess: () => {
            fetchPrivateBookings(
              {
                ...filters,
                member: id,
                page: privateBookingCurrentPage,
                page_size: PAGE_SIZE,
              },
              {
                onSuccess: options?.onSuccess,
                onError: options?.onError,
              },
            );
          },
        });
      },
    fetchRecurrenceRulePrivateBooking:
      ({
        fetchRecurrenceRulePrivateBooking,
        fetchAssociatedCoachBulk,
        fetchAssociatedEstablishmentBulk,
        fetchPrivateSlotBulk,
        id,
      }) =>
      () => {
        fetchRecurrenceRulePrivateBooking(
          {
            member: id,
          },
          {
            onSuccess: (recurrentRuleList) => {
              if (recurrentRuleList.length) {
                fetchAssociatedCoachBulk([
                  ...recurrentRuleList.map((o) => o.associated_coach),
                ]);
                fetchAssociatedEstablishmentBulk([
                  ...recurrentRuleList.map((o) => o.associated_establishment),
                ]);
                fetchPrivateSlotBulk([
                  ...recurrentRuleList.map((o) => o.private_slot),
                ]);
              }
            },
          },
        );
      },
    onDeleteRecurrenceRulePrivateBooking:
      ({
        deleteRecurrenceRulePrivateBooking,
        fetchRecurrenceRulePrivateBooking,
        fetchPrivateBookings,
        fetchMember,
        filters,
      }) =>
      (recurrentBooking, memberId, data) => {
        deleteRecurrenceRulePrivateBooking(recurrentBooking.id, data, {
          onSuccess: () => {
            fetchMember(memberId);
            fetchRecurrenceRulePrivateBooking({ member: memberId });
            fetchPrivateBookings({
              ...filters,
              member: memberId,
              page: 1,
              page_size: PAGE_SIZE,
            });
          },
        });
      },
    fetchPrivateBookingsList:
      ({ id, filters, fetchPrivateBookings }) =>
      ({ page, page_size }) => {
        fetchPrivateBookings({ ...filters, member: id, page, page_size });
      },
  }),
)(MemberDetailPrivateBooking);
