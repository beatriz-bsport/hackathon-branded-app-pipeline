// @flow

import React, { Component } from 'react';

import omit from 'lodash/omit';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { push, replace } from 'connected-react-router';
import { compose, withState, withStateHandlers, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import flatten from 'lodash/flatten';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getMember } from '../../libs/member/selectors';
import {
  cancelBooking as deleteBooking,
  discardAttendance as discardBookingAttendance,
  confirmAttendance as confirmBookingAttendance,
  fetchBookingsByConsumerPack,
} from '../../libs/booking/actions';
import { getInvoice } from '../../libs/invoice/selectors';
import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  resetConsumerPackByMember as resetConsumerPackByMemberAction,
  fetchByMember as fetchConsumerPackByMemberAction,
  retrieveConsumerPackBulk,
  updateCredit as updateCreditAction,
  unblock,
  fetchPackExtensions,
  deletePackExtension,
  createPackExtension,
  refundConsumerPaymentPack as refundConsumerPaymentPackActions,
  fetchConsumerPaymentPackCreditRefundList as fetchConsumerPaymentPackCreditRefundListAction,
  fetchConsumerPaymentPackPenalty as fetchConsumerPaymentPackPenaltyAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  fetchManagerFiltersSettings,
  updateManagerFiltersSettings,
} from '../../libs/dashboard/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import {
  fetchSpecificInvoice,
  fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction,
} from '../../libs/invoice/actions';
import { fetchConsumerPaymentPackLinks as fetchConsumerPaymentPackLinksAction } from '../../libs/relationship/actions';

import RefundConsumerPaymentPackDialog from '../../libs/consumer-payment-pack/components/RefundConsumerPaymentPackDialog.component';

import ConsumerPaymentPackExtensionFormDialog from '../../libs/consumer-payment-pack/components/ConsumerPaymentPackExtensionFormDialog.component';
import {
  getConsumerPaymentPackExtensions,
  getConsumerPack,
  getConsumerPaymentPackByMember,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import { getConsumerPackBookingListWithConsumerPack } from '../../libs/booking/selectors';

import ConsumerPackRowItem from '../../libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import ConsumerPackDetail from '../../libs/consumer-payment-pack/components/ConsumerPackDetail.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';
import ConsumerPaymentPackFilters from '../../libs/payment-packs/components/ConsumerPaymentPackFilters.component';

import type { Member } from '../../libs/member/types';
import type { ConsumerPaymentPack } from '../../libs/payment-packs/types';
import type { ConsumerPaymentPackPenalty } from '../../libs/consumer-payment-pack/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Booking } from '../../libs/booking/types';
import { showVaccinationStatus } from '../../libs/custom-form/selectors';
import { withIsSharedActive } from '../../libs/relationship/selectors';
import { WithIsSharedActive } from '../../libs/relationship/types';

type Props = {
  member: ?Member,
  id: number,
  fetchMember: (id: number) => void,
  fetchConsumerPacks: (id: number, page: number, page_size: number) => void,
  fetchBookingsByConsumerPack: (id: number) => void,
  fetchInvoice: (uuid: string) => void,
  fetchExtensions: (consumerPassId: number) => void,
  refreshConsumerPack: (id: number) => void,
  passExtensions: Array<ConsumerPaymentPackExtension>,
  consumerPackLoading: boolean,
  consumerPacks: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  selectedConsumerPass: ?ConsumerPaymentPack,
  onSelectConsumerPass: (memberId: number, consumerPassId: number) => void,
  consumerPackInvoice: Invoice,
  goToInvoice: (uuid: string) => void,
  goToBooking: (memberId: number, bookingId: number) => void,
  deleteBooking: (id: number, data: any) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  unblock: (id: number) => void,

  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  goToRelationship: (memberId: number) => void,

  fetchPaymentPackBulk: (pps: Array<number>) => void,
  fetchConsumerPackList: (page: number, pageSize: number) => void,
  timezone: string,

  showCreditRefund: boolean,

  consumerPackCount: number,
  consumerPackCurrentPage: number,
  consumerPaymentPackCreditRefundList: Array<ConsumerPaymentPackRefundCredit>,

  bookings: Array<Booking>,
  bookingCurrentPage: number,
  bookingLoading: boolean,
  bookingCount: number,

  requestRefund: (ConsumerPaymentPack) => void,

  consumerPaymentPackToRefund: ?ConsumerPaymentPack,
  refundLoading: boolean,
  closeRefund: () => void,
  refundConsumerPaymentPack: (id: number, data: any) => void,

  consumerPassId: ?number,
  retrieveConsumerPackBulk: (cpps: Array<number>, opt: OptionCallback) => void,
  resetConsumerPackByMemberAction: () => void,

  passExtensionsLoading: boolean,
  setOpenCreateExtension: (boolean) => void,
  deleteExtension: (
    id: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  openCreateExtension: boolean,
  setOpenCreateExtension: (boolean) => void,
  createExtension: (data: any) => void,

  t: TFunction,
  classes: Object,

  fetchConsumerPaymentPackCreditRefundList: (id: number) => void,
  consumerPassId: ?number,
  fetchConsumerPaymentPackPenalty: (
    consumerPassId: number,
    page: number,
    pageSize: number,
  ) => void,
  consumerPackPenalties: {
    items: Array<ConsumerPaymentPackPenalty>,
    count: number,
    page: number,
    loading: boolean,
  },

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
  updateFiltersSettings: () => void,
  userFiltersLoading: boolean,

  fetchConsumerPaymentPackLinks: (
    links: Array<number>,
    options: OptionCallBack,
  ) => void,
  showVaccinationStatus: boolean,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
    options?: OptionCallback,
  ) => void,
};

type State = {
  bookingToRevert: ?Booking,
};

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 6;
const PENALTY_PAGE_SIZE = 5;

const ClickOnConsumerPack = withTranslation(['paymentPack'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={props.classes.emptyMessageText}
          color="textSecondary"
          variant="caption"
        >
          {props.t('details.pleaseSelectAPack')}
        </Typography>
      </div>
    </div>
  ),
);

export class MemberDetailPass extends Component<Props, State> {
  state = {
    bookingToRevert: null,
  };

  componentDidMount() {
    this.fetchData();
    if (this.props.consumerPassId) {
      this.props.fetchConsumerPaymentPackPenalty(
        this.props.consumerPassId,
        1,
        PENALTY_PAGE_SIZE,
      );
      this.props.retrieveConsumerPackBulk([this.props.consumerPassId], {
        onSuccess: ([pass]: Array<ConsumerPaymentPack>) => {
          if (pass.invoice) {
            this.props.fetchInvoice(pass.invoice);
          } else if (
            pass.linked_private_consumer_pass &&
            !pass.is_universal_consumer_pass_source
          ) {
            this.props.fetchInvoiceByInvoiceItem(
              BUYABLE_ITEM_PRIVATE_PASS,
              pass.linked_private_consumer_pass,
            );
          }
        },
      });
    }
    if (this.props.consumerPassId) {
      this.props.fetchConsumerPaymentPackCreditRefundList(
        this.props.consumerPassId,
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
    if (
      prevProps.consumerPassId !== this.props.consumerPassId &&
      this.props.consumerPassId
    ) {
      this.props.fetchConsumerPaymentPackPenalty(
        this.props.consumerPassId,
        1,
        PENALTY_PAGE_SIZE,
      );
      this.props.retrieveConsumerPackBulk([this.props.consumerPassId]);
    }
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchConsumerPacks(this.props.id, 1, 7, this.props.filters, {
        onSuccess: (cppList) => {
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp) => cpp.payment_pack),
          );
          this.props.fetchConsumerPaymentPackLinks(
            flatten(
              cppList.map((cpp) =>
                cpp.src_consumer_payment_pack.map((id) => id),
              ),
            ),
          );
        },
      });
      this.props.updateFiltersSettings(this.props.filters);
    }

    if (
      this.props.selectedConsumerPass &&
      (!prevProps.selectedConsumerPass ||
        this.props.selectedConsumerPass.id !==
          prevProps.selectedConsumerPass.id)
    ) {
      if (this.props.selectedConsumerPass.invoice) {
        this.props.fetchInvoice(this.props.selectedConsumerPass.invoice);
      } else if (
        !!this.props.selectedConsumerPass.linked_private_consumer_pass &&
        !this.props.selectedConsumerPass.is_universal_consumer_pass_source
      ) {
        this.props.fetchInvoiceByInvoiceItem(
          BUYABLE_ITEM_PRIVATE_PASS,
          this.props.selectedConsumerPass.linked_private_consumer_pass,
        );
      }

      this.props.fetchExtensions(this.props.selectedConsumerPass.id);
      this.fetchBookings(1, 5);
      if (this.props.consumerPassId) {
        this.props.fetchConsumerPaymentPackCreditRefundList(
          this.props.consumerPassId,
        );
      }
    }
  }

  fetchData = () => {
    if (this.props.id) {
      this.props.fetchMember(this.props.id);
      this.props.resetConsumerPackByMemberAction();
    }
  };

  goToBooking = (booking: Booking) => {
    this.props.goToBooking(this.props.id, booking.id);
  };

  fetchBookings = (page: number, page_size: number) => {
    this.props.fetchBookingsByConsumerPack(
      this.props.selectedConsumerPass.id,
      page,
      page_size,
    );
  };

  render() {
    const dataLoading =
      this.props.consumerPackLoading ||
      this.props.passExtensionsLoading ||
      this.props.bookingLoading ||
      this.props.refundLoading ||
      this.props.userFiltersLoading;
    return (
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <ConsumerPaymentPackFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={!dataLoading && this.props.filters}
            />
            <Divider />
            <PaginatedListBase
              itemPerPage={CONSUMER_PAYMENT_PACK_PAGE_SIZE}
              loading={this.props.consumerPackLoading}
              listProps={{ disablePadding: true }}
              items={this.props.consumerPacks}
              nbItems={this.props.consumerPackCount}
              additionalFilters={this.props.filters}
              page={this.props.consumerPackCurrentPage}
              onPageRequested={(page, pageSize) =>
                this.props.fetchConsumerPackList(page, pageSize)
              }
              renderItem={(cpp) => (
                <ConsumerPackRowItem
                  hideConsumer
                  timezone={this.props.timezone}
                  key={cpp.id}
                  selected={
                    this.props.selectedConsumerPass &&
                    this.props.selectedConsumerPass.id === cpp.id
                  }
                  consumerPack={cpp}
                  paymentPack={cpp.payment_pack}
                  incrementCredit={() => this.props.incrementCredit(cpp.id)}
                  decrementCredit={() => this.props.decrementCredit(cpp.id)}
                  unblock={() => this.props.unblock(cpp.id)}
                  onClick={() =>
                    this.props.onSelectConsumerPass(this.props.id, cpp.id)
                  }
                />
              )}
            />
          </Paper>
          {this.props.consumerPacks.length ? (
            <div className={this.props.classes.shareButtonContainer}>
              <Button
                variant="outlined"
                onClick={() => this.props.goToRelationship(this.props.id)}
                color="primary"
              >
                {this.props.t('details.shareAPass')}
              </Button>
            </div>
          ) : null}
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.selectedConsumerPass &&
          this.props.selectedConsumerPass.payment_pack ? (
            <ConsumerPackDetail
              requestRefund={this.props.requestRefund}
              paymentPack={this.props.selectedConsumerPass.payment_pack}
              consumerPack={this.props.selectedConsumerPass}
              timezone={this.props.timezone}
              bookings={this.props.bookings}
              consumerPaymentPackCreditRefundList={
                this.props.consumerPaymentPackCreditRefundList
              }
              onBookingRequested={(page, page_size) =>
                this.fetchBookings(page, page_size)
              }
              currentBookingPage={this.props.bookingCurrentPage}
              bookingLoading={this.props.bookingLoading}
              bookingCount={this.props.bookingCount}
              invoice={this.props.consumerPackInvoice}
              discardBookingAttendance={this.props.discardBookingAttendance}
              confirmBookingAttendance={this.props.confirmBookingAttendance}
              onBookingClick={this.goToBooking}
              extensions={this.props.passExtensions}
              extensionsLoading={this.props.passExtensionsLoading}
              handleRevert={(bookingToRevert) =>
                this.setState({ bookingToRevert })
              }
              member={this.props.member}
              penalties={this.props.consumerPackPenalties}
              onPageRequested={(page, pageSize) =>
                this.props.fetchConsumerPaymentPackPenalty(
                  this.props.consumerPassId,
                  page,
                  pageSize,
                )
              }
              penaltyPageSize={PENALTY_PAGE_SIZE}
              onInvoiceClick={this.props.goToInvoice}
              onCreateExtension={
                this.props.selectedConsumerPass?.payment_pack &&
                !this.props.selectedConsumerPass.consumer_payment_pack_source &&
                (() => this.props.setOpenCreateExtension(true))
              }
              deleteExtension={(id) => {
                this.props.deleteExtension(id, {
                  onSuccess: () =>
                    this.props.refreshConsumerPack(
                      this.props.selectedConsumerPass.id,
                    ),
                });
              }}
              showVaccinationStatus={this.props.showVaccinationStatus}
            />
          ) : (
            <ClickOnConsumerPack classes={this.props.classes} />
          )}
        </Grid>
        <ConsumerPaymentPackExtensionFormDialog
          open={this.props.openCreateExtension}
          onClose={() => this.props.setOpenCreateExtension(false)}
          consumerPaymentPack={this.props.selectedConsumerPass}
          onSubmit={(data) => {
            this.props.createExtension(
              {
                ...data,
                consumer_payment_pack: this.props.selectedConsumerPass.id,
              },
              {
                onSuccess: () => {
                  this.props.refreshConsumerPack(
                    this.props.selectedConsumerPass.id,
                  );
                  this.props.setOpenCreateExtension(false);
                },
              },
            );
          }}
        />
        <RevertBookingDialog
          handleBookingDeletion={(data, options) => {
            this.props.deleteBooking(
              this.state.bookingToRevert.id,
              data,
              options,
            );
            this.setState({ bookingToRevert: null });
          }}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable
          closeRevertBookingDialog={() =>
            this.setState({ bookingToRevert: null })
          }
        />
        {!!this.props.consumerPaymentPackToRefund && (
          <RefundConsumerPaymentPackDialog
            open
            loading={this.props.refundLoading}
            consumerPaymentPack={this.props.consumerPaymentPackToRefund}
            showCreditRefund={this.props.showCreditRefund}
            onClose={this.props.closeRefund}
            onSubmit={this.props.refundConsumerPaymentPack}
          />
        )}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  emptyMessageText: {
    marginTop: theme.spacing(2),
  },
  shareButtonContainer: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default compose(
  routerParamsToProps({
    id: 'id:number',
    consumerPassId: 'consumerPassId:number',
  }),
  withTranslation(['paymentPack']),
  withStyles(styles),
  withState('open', 'setOpen', {}),
  withState('openCreateExtension', 'setOpenCreateExtension', false),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  connect(
    (state, { id, consumerPassId, relatedInvoice }) => ({
      member: getMember(state, id),
      consumerPacks: withIsSharedActive(
        withPaymentPack(getConsumerPaymentPackByMember),
      )(state, id),
      consumerPackCount: state.consumerPaymentPack.byMember.count,
      consumerPackCurrentPage: state.consumerPaymentPack.byMember.page,
      selectedConsumerPass: withPaymentPack(getConsumerPack)(
        state,
        consumerPassId,
      ),
      consumerPackInvoice: getInvoice(state, relatedInvoice),
      consumerPaymentPackCreditRefundList:
        state.consumerPaymentPack.partialRefund.items,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,
      consumerPackPenalties: {
        items: state.consumerPaymentPack.penalty.items,
        page: state.consumerPaymentPack.penalty.page,
        count: state.consumerPaymentPack.penalty.count,
        loading: state.consumerPaymentPack.penalty.loading,
      },
      passExtensions: getConsumerPaymentPackExtensions(state),
      passExtensionsLoading: state.consumerPaymentPack.extension.loading,
      bookings: getConsumerPackBookingListWithConsumerPack(state),
      bookingCurrentPage: state.booking.byConsumerPack.page,
      bookingLoading: state.booking.byConsumerPack.loading,
      bookingCount: state.booking.byConsumerPack.count,
      refundLoading: state.consumerPaymentPack.partialRefund.loading,
      timezone: state.theme.theme.timezone_name,
      userFilters: state.dashboardSettings.managerFiltersSettings.data.filters,
      userFiltersLoading:
        state.dashboardSettings.managerFiltersSettings.loading,
      showVaccinationStatus: showVaccinationStatus(state),
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToRelationship: (memberId) => push(`/member/${memberId}/relation`),
      goToBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
      fetchBookingsByConsumerPack,
      onSelectConsumerPass: (memberId: number, id: number) =>
        replace(`/member/${memberId}/pass/${id}/`),
      deleteBooking,

      fetchExtensions: fetchPackExtensions,
      createExtension: createPackExtension,
      deleteExtension: deletePackExtension,
      refreshConsumerPack: (id) => retrieveConsumerPackBulk([id]),
      fetchConsumerPaymentPackCreditRefundList:
        fetchConsumerPaymentPackCreditRefundListAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,

      discardBookingAttendance,
      confirmBookingAttendance,
      fetchMember: fetchMemberAction,
      fetchManagerFilters: fetchManagerFiltersSettings,
      updateManagerFilters: updateManagerFiltersSettings,

      incrementCredit: (id_: number) => updateCreditAction(id_, 1),
      decrementCredit: (id_: number) => updateCreditAction(id_, -1),
      unblock,
      refundConsumerPaymentPack: refundConsumerPaymentPackActions,

      fetchInvoice: (uuid: string, options) =>
        fetchSpecificInvoice(uuid, options),

      retrieveConsumerPackBulk,
      fetchConsumerPacks: (
        memberId: number,
        page: number,
        page_size: number,
        filters: any,
        options,
      ) =>
        fetchConsumerPackByMemberAction(memberId, page, page_size, options, {
          ...filters,
          with_amortized_price: true,
        }),
      resetConsumerPackByMemberAction,
      fetchConsumerPaymentPackPenalty: fetchConsumerPaymentPackPenaltyAction,
      fetchConsumerPaymentPackLinks: fetchConsumerPaymentPackLinksAction,
      fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
    },
  ),
  withState('filters', 'setFilters', (props) => {
    const { userFilters } = props;
    if (userFilters && userFilters.pass_filters) {
      return userFilters.pass_filters;
    }
    return { reverted: false };
  }),
  withStateHandlers(
    { consumerPaymentPackToRefund: null, showCreditRefund: true },
    {
      closeRefund: () => () => ({ consumerPaymentPackToRefund: null }),
      requestRefund: () => (consumerPaymentPackToRefund, showCreditRefund) => ({
        consumerPaymentPackToRefund,
        showCreditRefund,
      }),
    },
  ),
  withHandlers({
    fetchInvoice:
      ({ fetchInvoice, setRelatedInvoice }) =>
      (uuid) => {
        setRelatedInvoice(null);
        fetchInvoice(uuid, {
          onSuccess: (inv) => setRelatedInvoice(inv.uuid),
        });
      },
    fetchInvoiceByInvoiceItem:
      ({ fetchInvoiceByInvoiceItem, setRelatedInvoice }) =>
      (buyableId, objectId, options) => {
        fetchInvoiceByInvoiceItem(buyableId, objectId, {
          onSuccess: (inv) => {
            setRelatedInvoice(inv.uuid);
            if (options && options.onSuccess) {
              options.onSuccess(inv);
            }
          },
          onError: (err) => {
            if (options && options.onError) {
              options.onError(err);
            }
          },
        });
      },
    fetchConsumerPackList:
      ({
        id,
        filters,
        fetchConsumerPacks,
        fetchPaymentPackBulk,
        fetchConsumerPaymentPackLinks,
      }) =>
      (page, pageSize) => {
        fetchConsumerPacks(id, page, pageSize, filters, {
          onSuccess: (cppList) => {
            fetchPaymentPackBulk(cppList.map((cpp) => cpp.payment_pack));
            fetchConsumerPaymentPackLinks(
              flatten(
                cppList.map((cpp) =>
                  cpp.src_consumer_payment_pack.map((i) => i),
                ),
              ),
            );
          },
        });
      },
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
    refundConsumerPaymentPack:
      ({
        refundConsumerPaymentPack,
        fetchConsumerPaymentPackCreditRefundList,
        id,
        fetchMember,
        closeRefund,
        refreshConsumerPack,
      }) =>
      (idPass, data) => {
        refundConsumerPaymentPack(idPass, data, {
          onSuccess: () => {
            fetchMember(id);
            refreshConsumerPack(idPass);
            closeRefund();

            fetchConsumerPaymentPackCreditRefundList(idPass);
          },
        });
      },
    fetchConsumerPaymentPackPenalty:
      ({ fetchConsumerPaymentPackPenalty }) =>
      (consumerPassId, page, pageSize) => {
        fetchConsumerPaymentPackPenalty(consumerPassId, page, pageSize);
      },
  }),
  withHandlers({
    fetchFiltersSettings:
      ({ fetchManagerFilters, setFilters }) =>
      () => {
        fetchManagerFilters({
          onSuccess: (payload) => {
            setFilters(payload.filters.pass_filters);
          },
        });
      },
  }),
  withHandlers({
    updateFiltersSettings:
      ({ updateManagerFilters, userFilters }) =>
      (filters: object) => {
        updateManagerFilters({
          ...userFilters,
          pass_filters: filters,
        });
      },
  }),
)(MemberDetailPass);
