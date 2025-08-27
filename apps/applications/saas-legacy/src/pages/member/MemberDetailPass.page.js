// @flow

import React, { Component } from 'react';

import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from '@material-ui/lab/Alert/Alert';
import { push, replace } from 'connected-react-router';
import {
  compose,
  withState,
  withStateHandlers,
  withHandlers,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import flatten from 'lodash/flatten';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { Theme } from '#src/libs/theme/types';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchOfferBulk as fetchOfferBulkAction } from '#src/libs/offer/actions';
import { hasPaymentPackManagementPermission } from '#src/libs/payment-packs/utils';
import { getOfferById } from '#src/libs/offer/selectors';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
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
  activateManually,
  fetchConsumerPaymentPackExtensionList as fetchConsumerPaymentPackExtensionListAction,
  deleteConsumerPaymentPackExtension as deleteConsumerPaymentPackExtensionAction,
  createConsumerPaymentPackExtension as createConsumerPaymentPackExtensionAction,
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

import ConsumerExtensionCreateDialog from '../../components/ConsumerExtensionCreateDialog';
import {
  getConsumerPaymentPackExtensionList,
  getConsumerPaymentPackExtensionState,
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
import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackPenalty,
  ConsumerPaymentPackExtensionParams,
  ConsumerPaymentPackExtensionCreate,
  ConsumerPaymentPackExtension,
} from '../../libs/consumer-payment-pack/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Booking } from '../../libs/booking/types';
import { withIsSharedActive } from '../../libs/relationship/selectors';
import { WithIsSharedActive } from '../../libs/relationship/types';

type Props = {
  member?: Member,
  id: number,
  fetchMember: (id: number) => void,
  fetchConsumerPacks: ({
    memberId: number,
    page: number,
    page_size: number,
    filters: any,
    options: OptionCallBack,
    current_consumer_pack_id: number,
  }) => void,
  fetchBookingsByConsumerPack: (id: number) => void,
  fetchInvoice: (uuid: string) => void,
  fetchConsumerPaymentPackExtensionList: (
    params: ConsumerPaymentPackExtensionParams,
    options?: OptionCallback<ConsumerPaymentPackExtension[]>,
  ) => void,
  refreshConsumerPack: (id: number) => void,
  passExtensions: Array<ConsumerPaymentPackExtension>,
  passExtensionsPage: number,
  passExtensionsCount: number,
  consumerPackLoading: boolean,
  consumerPacks: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  selectedConsumerPass?: ConsumerPaymentPack,
  onSelectConsumerPass: (memberId: number, consumerPassId: number) => void,
  consumerPackInvoice: Invoice,
  goToInvoice: (uuid: string) => void,
  goToBooking: (memberId: number, bookingId: number) => void,
  deleteBooking: (id: number, data: any) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  unblock: (id: number) => void,
  activateManually: (id: number) => void,

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

  consumerPaymentPackToRefund?: ConsumerPaymentPack,
  refundLoading: boolean,
  closeRefund: () => void,
  refundConsumerPaymentPack: (id: number, data: any) => void,

  consumerPassId?: number,
  retrieveConsumerPackBulk: (
    consumerPaymentPacks: Array<number>,
    opt: OptionCallback,
  ) => void,
  resetConsumerPackByMemberAction: () => void,

  passExtensionsLoading: boolean,
  setOpenCreateExtension: (boolean) => void,
  deleteConsumerPaymentPackExtension: (
    id: number,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  openCreateExtension: boolean,
  setOpenCreateExtension: (boolean) => void,
  createConsumerPaymentPackExtension: (
    data: ConsumerPaymentPackExtensionCreate,
  ) => void,

  t: TFunction,
  classes: Object,

  fetchConsumerPaymentPackCreditRefundList: (id: number) => void,
  consumerPassId?: number,
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
  userFiltersLoading: boolean,

  fetchConsumerPaymentPackLinks: (
    links: Array<number>,
    options: OptionCallBack,
  ) => void,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
    options?: OptionCallback,
  ) => void,
  passExtensionDeleteLoading: boolean,
  passExtensionCreationLoading: boolean,
  consumerPaymentPacksLoadingById: { [key: string]: boolean },
  theme: Theme,
  getBookingOffer: (offerId: number) => void,
  fetchOfferBulk: (
    ids: Array<number>,
    options?: OptionCallback<Offer[]> & { onCacheUsed?: () => void },
    useCache?: boolean,
    ignoreManagerOnly?: boolean,
  ) => void,
};

type State = {
  bookingToRevert?: Booking,
  noShowChipMessageDialogIsOpen: boolean,
  statusChangedDialogIsOpen: boolean,
};

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 6;
const PENALTY_PAGE_SIZE = 5;

const ClickOnConsumerPack = withTranslation(['paymentPack'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <Alert className={props.classes.alertInfo} color="grey" severity="info">
          {props.t('details.pleaseSelectAPack')}
        </Alert>
      </div>
    </div>
  ),
);

export class MemberDetailPass extends Component<Props, State> {
  state = {
    bookingToRevert: null,
    noShowChipMessageDialogIsOpen: false,
    statusChangedDialogIsOpen: false,
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
    if (!isEqual(prevProps.filters, this.props.filters)) {
      this.props.fetchConsumerPacks({
        memberId: this.props.id,
        page: this.props.consumerPassId ? undefined : 1,
        page_size: CONSUMER_PAYMENT_PACK_PAGE_SIZE,
        filters: this.props.filters,
        options: {
          onSuccess: (consumerPaymentPackList) => {
            this.props.fetchPaymentPackBulk(
              consumerPaymentPackList.map(
                (consumerPaymentPack) => consumerPaymentPack.payment_pack,
              ),
            );
            this.props.fetchConsumerPaymentPackLinks(
              flatten(
                consumerPaymentPackList.map((consumerPaymentPack) =>
                  consumerPaymentPack.src_consumer_payment_pack.map((id) => id),
                ),
              ),
            );
          },
        },
        current_payment_pass_id: this.props.consumerPassId,
      });
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

      this.props.fetchConsumerPaymentPackExtensionList({
        consumer_payment_pack: this.props.selectedConsumerPass.id,
      });
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
    this.props.goToBooking(booking.member, booking.id);
  };

  fetchBookings = (page: number, page_size: number) => {
    this.props.fetchBookingsByConsumerPack(
      this.props.selectedConsumerPass.id,
      page,
      page_size,
      {
        onSuccess: (bookings) => {
          retrieveConsumerPackBulk(
            bookings.map((booking) => booking.consumer_payment_pack),
          );
          this.props.fetchOfferBulk(bookings.map((booking) => booking.offer));
        },
      },
    );
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

  openStatusChangedDialog = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    this.setState({ statusChangedDialogIsOpen: true });
  };

  closeStatusChangedDialog = () => {
    this.setState({ statusChangedDialogIsOpen: false });
  };

  handleCreateExtension = () => this.props.setOpenCreateExtension(true);

  handleChangeExtensionPage = (page: number) => {
    if (this.props.selectedConsumerPass?.id) {
      this.props.fetchConsumerPaymentPackExtensionList({
        consumer_payment_pack: this.props.selectedConsumerPass.id,
        page,
      });
    }
  };

  render() {
    const dataLoading =
      this.props.consumerPackLoading ||
      this.props.passExtensionsLoading ||
      this.props.bookingLoading ||
      this.props.refundLoading ||
      this.props.userFiltersLoading;
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.paymentPack.allowed_actions.manageExtension',
          'product.paymentPack.allowed_actions.manageCredit',
          'product.paymentPack.allowed_actions.block',
        ]}
      >
        {([
          hasManageExtensionPermission,
          hasManageCreditPermission,
          hasBlockPermission,
        ]: boolean[]) => (
          <Grid container direction="row" spacing={2}>
            <Grid item lg={6} xs={12}>
              <Dialog
                maxWidth="sm"
                open={this.state.noShowChipMessageDialogIsOpen}
              >
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
              <Dialog open={this.state.statusChangedDialogIsOpen}>
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
                <DialogActions>
                  <Button
                    className={this.props.classes.grey}
                    onClick={this.closeStatusChangedDialog}
                  >
                    {this.props.t('common:close')}
                  </Button>
                </DialogActions>
              </Dialog>
              <Paper>
                <ConsumerPaymentPackFilters
                  filters={!dataLoading && this.props.filters}
                  open={this.props.open}
                  setFiltersValue={this.props.setFilterValue}
                  setOpenValue={this.props.setOpenValue}
                />
                <Divider />
                {!this.props.userFiltersLoading && (
                  <PaginatedListBase
                    additionalFilters={this.props.filters}
                    itemPerPage={CONSUMER_PAYMENT_PACK_PAGE_SIZE}
                    items={this.props.consumerPacks}
                    listProps={{ disablePadding: true }}
                    loading={this.props.consumerPackLoading}
                    nbItems={this.props.consumerPackCount}
                    onPageRequested={(page, pageSize) =>
                      this.props.fetchConsumerPackList(page, pageSize)
                    }
                    page={this.props.consumerPackCurrentPage}
                    renderCustomPageFirst={!!this.props.consumerPassId}
                    renderItem={(consumerPaymentPack) => (
                      <ConsumerPackRowItem
                        key={consumerPaymentPack.id}
                        hideConsumer
                        activateManually={() =>
                          this.props.activateManually(consumerPaymentPack.id)
                        }
                        consumerPack={consumerPaymentPack}
                        decrementCredit={
                          hasPaymentPackManagementPermission(
                            consumerPaymentPack?.payment_pack,
                            hasManageCreditPermission,
                            hasBlockPermission,
                          ) && this.props.decrementCredit
                        }
                        incrementCredit={
                          hasPaymentPackManagementPermission(
                            consumerPaymentPack?.payment_pack,
                            hasManageCreditPermission,
                            hasBlockPermission,
                          ) && this.props.incrementCredit
                        }
                        onClick={() =>
                          this.props.onSelectConsumerPass(
                            this.props.id,
                            consumerPaymentPack.id,
                          )
                        }
                        paymentPack={consumerPaymentPack.payment_pack}
                        selected={
                          this.props.selectedConsumerPass &&
                          this.props.selectedConsumerPass.id ===
                            consumerPaymentPack.id
                        }
                        timezone={this.props.timezone}
                        unblock={() =>
                          this.props.unblock(consumerPaymentPack.id)
                        }
                        updating={
                          this.props.consumerPaymentPacksLoadingById[
                            consumerPaymentPack.id
                          ] ?? false
                        }
                      />
                    )}
                  />
                )}
              </Paper>
              {this.props.consumerPacks.length ? (
                <div className={this.props.classes.shareButtonContainer}>
                  <Button
                    color="primary"
                    onClick={() => this.props.goToRelationship(this.props.id)}
                    variant="outlined"
                  >
                    {this.props.t('details.shareAPass')}
                  </Button>
                </div>
              ) : null}
            </Grid>
            <Grid item lg={6} xs={12}>
              {this.props.selectedConsumerPass &&
              this.props.selectedConsumerPass.payment_pack ? (
                <ConsumerPackDetail
                  bookingCount={this.props.bookingCount}
                  bookingLoading={this.props.bookingLoading}
                  bookings={this.props.bookings}
                  confirmBookingAttendance={this.props.confirmBookingAttendance}
                  consumerPack={this.props.selectedConsumerPass}
                  consumerPaymentPackCreditRefundList={
                    this.props.consumerPaymentPackCreditRefundList
                  }
                  currentBookingPage={this.props.bookingCurrentPage}
                  deleteExtension={(id) => {
                    const currentPage = this.props.passExtensionsPage;
                    const isLastItemInPage =
                      this.props.passExtensions?.length === 1;

                    this.props.deleteConsumerPaymentPackExtension(id, {
                      onSuccess: () => {
                        this.props.refreshConsumerPack(
                          this.props.selectedConsumerPass.id,
                        );
                        this.props.fetchConsumerPaymentPackExtensionList({
                          consumer_payment_pack:
                            this.props.selectedConsumerPass.id,
                          /** Fetch the previous page if removing the last page item */
                          ...(isLastItemInPage &&
                            currentPage > 1 && { page: currentPage - 1 }),
                        });
                      },
                    });
                  }}
                  discardBookingAttendance={this.props.discardBookingAttendance}
                  extensions={this.props.passExtensions}
                  extensionsCount={this.props.passExtensionsCount}
                  extensionsLoading={this.props.passExtensionsLoading}
                  extensionsPage={this.props.passExtensionsPage}
                  getBookingOffer={this.props.getBookingOffer}
                  handleRevert={(bookingToRevert) =>
                    this.setState({ bookingToRevert })
                  }
                  invoice={this.props.consumerPackInvoice}
                  isRollCallMandatory={this.props.theme.is_roll_call_mandatory}
                  member={this.props.member}
                  onBookingClick={this.goToBooking}
                  onBookingRequested={(page, page_size) =>
                    this.fetchBookings(page, page_size)
                  }
                  onClickNoShowChip={this.openNoShowChipMessageDialog}
                  onClickWarningIcon={this.openStatusChangedDialog}
                  onCreateExtension={
                    hasManageExtensionPermission &&
                    this.props.selectedConsumerPass?.payment_pack &&
                    this.handleCreateExtension
                  }
                  onExtensionPageRequested={this.handleChangeExtensionPage}
                  onInvoiceClick={this.props.goToInvoice}
                  onPageRequested={(page, pageSize) =>
                    this.props.fetchConsumerPaymentPackPenalty(
                      this.props.consumerPassId,
                      page,
                      pageSize,
                    )
                  }
                  passExtenxionDeleteLoading={
                    this.props.passExtensionDeleteLoading
                  }
                  paymentPack={this.props.selectedConsumerPass.payment_pack}
                  penalties={this.props.consumerPackPenalties}
                  penaltyPageSize={PENALTY_PAGE_SIZE}
                  requestRefund={this.props.requestRefund}
                  timezone={this.props.timezone}
                />
              ) : (
                <ClickOnConsumerPack classes={this.props.classes} />
              )}
            </Grid>
            <ConsumerExtensionCreateDialog
              isLoading={this.props.passExtensionCreationLoading}
              onClose={() => this.props.setOpenCreateExtension(false)}
              onSubmit={(data) => {
                this.props.createConsumerPaymentPackExtension(
                  {
                    ...data,
                    consumer_payment_pack: this.props.selectedConsumerPass.id,
                  },
                  {
                    onSuccess: () => {
                      this.props.refreshConsumerPack(
                        this.props.selectedConsumerPass.id,
                      );
                      this.props.fetchConsumerPaymentPackExtensionList({
                        consumer_payment_pack:
                          this.props.selectedConsumerPass.id,
                      });
                      this.props.setOpenCreateExtension(false);
                    },
                  },
                );
              }}
              open={this.props.openCreateExtension}
              passEndingDate={this.props.selectedConsumerPass?.ending_date}
              timezone={this.props.timezone}
            />
            <RevertBookingDialog
              offerIsAvailable
              bookingToRevert={this.state.bookingToRevert}
              closeRevertBookingDialog={() =>
                this.setState({ bookingToRevert: null })
              }
              handleBookingDeletion={(data, options) => {
                this.props.deleteBooking(
                  this.state.bookingToRevert.id,
                  data,
                  options,
                );
                this.setState({ bookingToRevert: null });
              }}
            />
            {!!this.props.consumerPaymentPackToRefund && (
              <RefundConsumerPaymentPackDialog
                open
                consumerPaymentPack={this.props.consumerPaymentPackToRefund}
                loading={this.props.refundLoading}
                onClose={this.props.closeRefund}
                onSubmit={this.props.refundConsumerPaymentPack}
                showCreditRefund={this.props.showCreditRefund}
              />
            )}
          </Grid>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

const styles = (theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
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
  grey: {
    color: theme.palette.text.secondary,
  },
  bold: {
    fontWeight: 500,
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
      theme: themeSelectors.getTheme(state),
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
      consumerPaymentPacksLoadingById: state.consumerPaymentPack.updatingById,
      passExtensions: getConsumerPaymentPackExtensionList(state),
      passExtensionsPage: getConsumerPaymentPackExtensionState(state).page,
      passExtensionsCount: getConsumerPaymentPackExtensionState(state).count,
      passExtensionsLoading: state.consumerPaymentPack.extension.loading,
      passExtensionCreationLoading:
        state.consumerPaymentPack.extension.create.loading,
      passExtensionDeleteLoading:
        state.consumerPaymentPack.extension.delete.loading,
      bookings: getConsumerPackBookingListWithConsumerPack(state),
      bookingCurrentPage: state.booking.byConsumerPack.page,
      bookingLoading: state.booking.byConsumerPack.loading,
      bookingCount: state.booking.byConsumerPack.count,
      refundLoading: state.consumerPaymentPack.partialRefund.loading,
      timezone: state.theme.theme.timezone_name,
      userFilters: state.dashboardSettings.managerFiltersSettings.data.filters,
      userFiltersLoading:
        state.dashboardSettings.managerFiltersSettings.loading,
      getBookingOffer: (offerId: number) => getOfferById(state, offerId),
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

      fetchConsumerPaymentPackExtensionList:
        fetchConsumerPaymentPackExtensionListAction,
      createConsumerPaymentPackExtension:
        createConsumerPaymentPackExtensionAction,
      deleteConsumerPaymentPackExtension:
        deleteConsumerPaymentPackExtensionAction,
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
      activateManually,
      refundConsumerPaymentPack: refundConsumerPaymentPackActions,

      fetchInvoice: (uuid: string, options) =>
        fetchSpecificInvoice(uuid, options),

      retrieveConsumerPackBulk,
      fetchConsumerPacks: ({
        memberId,
        page,
        page_size,
        filters,
        options,
        current_consumer_pack_id,
      }) =>
        fetchConsumerPackByMemberAction({
          member: memberId,
          page,
          page_size,
          options,
          params: {
            ...filters,
            with_amortized_price: true,
          },
          current_consumer_pack_id,
        }),
      resetConsumerPackByMemberAction,
      fetchConsumerPaymentPackPenalty: fetchConsumerPaymentPackPenaltyAction,
      fetchConsumerPaymentPackLinks: fetchConsumerPaymentPackLinksAction,
      fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
      fetchOfferBulk: fetchOfferBulkAction,
    },
  ),
  withProps(({ userFilters }) => ({
    filters: userFilters?.pass_filters ?? {
      reverted: false,
      is_valid_today: true,
    },
  })),
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
    onSelectConsumerPass:
      ({ onSelectConsumerPass, setRelatedInvoice }) =>
      (memberId, id) => {
        setRelatedInvoice(null);
        onSelectConsumerPass(memberId, id);
      },

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
        consumerPassId,
      }) =>
      (page, pageSize) => {
        fetchConsumerPacks({
          memberId: id,
          page,
          page_size: pageSize,
          filters,
          options: {
            onSuccess: (consumerPaymentPackList) => {
              fetchPaymentPackBulk(
                consumerPaymentPackList.map(
                  (consumerPaymentPack) => consumerPaymentPack.payment_pack,
                ),
              );
              fetchConsumerPaymentPackLinks(
                flatten(
                  consumerPaymentPackList.map((consumerPaymentPack) =>
                    consumerPaymentPack.src_consumer_payment_pack.map((i) => i),
                  ),
                ),
              );
            },
          },
          current_consumer_pack_id: !page ? consumerPassId : null,
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
    setFilterValue:
      ({ filters, updateManagerFilters, userFilters }) =>
      (filterDict: { [name: string]: boolean | null }) => {
        let newFilters = { ...filters };
        for (const [name, value] of Object.entries(filterDict)) {
          if (value === null) {
            newFilters = omit(newFilters, name);
          } else {
            newFilters[name] = value;
          }
        }
        updateManagerFilters({
          ...userFilters,
          pass_filters: newFilters,
        });
      },
  }),
)(MemberDetailPass);
