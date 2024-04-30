// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import omit from 'lodash/omit';
import {
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { getInvoice } from '../../libs/invoice/selectors';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import { getMember } from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  deletePrivateBooking,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateConsumerPassList,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  fetchPrivateConsumerPass,
  updatePrivateConsumerPassCredits,
  fetchPrivateConsumerPassExtensionList as fetchPrivateConsumerPassExtensionListAction,
  createPrivateConsumerPassExtension as createPrivateConsumerPassExtensionAction,
  deletePrivateConsumerPassExtension as deletePrivateConsumerPassExtensionAction,
  forceRegularizeUnpaid as forceRegularizeUnpaidAction,
  resetPrivateConsumerPassList as resetPrivateConsumerPassListAction,
} from '../../libs/private-service/actions';
import {
  fetchManagerFiltersSettings,
  updateManagerFiltersSettings,
} from '../../libs/dashboard/actions';
import {
  getPrivateConsumerPassList,
  getPrivateConsumerPass,
  excludeUnPaidPrivateConsumerPass,
  getPrivateConsumerPassExtensionsList,
  getPrivateConsumerPassExtensionState,
} from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import PrivateConsumerPassBookerListItem from '../../libs/private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import ConsumerExtensionCreateDialog from '../../components/ConsumerExtensionCreateDialog';
import PrivateConsumerPassDetail from '../../libs/private-service/components/consumer-pass/PrivateConsumerPassDetail.component';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '../../libs/invoice/actions';
import PrivateConsumerPassFilters from '../../libs/private-service/components/pass/PrivateConsumerPassFilters.component';
import { OptionCallback } from '../../state/types';
import { retrieveConsumerPackBulk } from '#libs/consumer-payment-pack/actions';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import {
  PrivateConsumerPassExtensionParams,
  PrivateConsumerPassExtensionCreate,
} from '#libs/private-service/types';
import { getExpirationDate } from '#libs/private-service/utils';

type Props = {
  fetchPrivateConsumerPassList: (filters: any, params: any) => void,
  id: number,
  fetchMember: (id: number) => void,
  privateConsumerPassId: ?number,
  fetchPrivateBookings: (params: any) => void,
  fetchPrivateConsumerPassExtensionList: (
    params: PrivateConsumerPassExtensionParams,
  ) => void,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
    options?: OptionCallback,
  ) => void,
  privateConsumerPassInvoice: ?Invoice,
  onInvoiceClick: (uuid: string) => void,
  privateBookingsLoading: boolean,
  privateConsumerPassSelected: ?PrivateConsumerPass,
  setOpenCreateExtension: (boolean) => void,
  openCreateExtension: () => void,
  createPrivateConsumerPassExtension: (
    data: PrivateConsumerPassExtensionCreate,
  ) => void,
  private_consumer_pass_list: Array<PrivateConsumerPass>,
  privateConsumerPassExtensionList: Array<PrivateConsumerPassExtension>,
  privateConsumerPassExtensionPage: number,
  privateConsumerPassExtensionCount: number,
  private_booking_list: Array<PrivateBooking>,
  updatePrivateConsumerPassCredits: (...any) => void,
  privateConsumerPassLoading: boolean,
  resetPrivateConsumerPassListAction: () => void,
  privateConsumerPassCount: number,
  privateConsumerPassPage: number,
  forceRegularizeUnpaid: (options: OptionCallback) => void,

  deletePrivateConsumerPassExtension: (number, OptionCallback) => void,
  privateConsumerPassExtensionLoading: boolean,
  privateConsumerPassExtensionDeleteLoading: boolean,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  goToPrivateConsumerPass: (memberId: number, consumerPassId: number) => void,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  fetchPrivateConsumerPass: (params: any) => void,

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
  fetchFiltersSettings: () => void,
  updateFiltersSettings: () => void,
  userFiltersLoading: boolean,
  privateConsumerPassExtensionCreationLoading: boolean,
  timezone: string,
};

export class MemberDetailPrivateConsumerPass extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchFiltersSettings();
    this.props.resetPrivateConsumerPassListAction();
    this.props.fetchMember(this.props.id);
    if (this.props.privateConsumerPassId) {
      this.fetchPrivateConsumerPassDetail();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.resetPrivateConsumerPassListAction();
      this.props.updateFiltersSettings(this.props.filters);
    }
    if (
      this.props.privateConsumerPassId &&
      (!prevProps.privateConsumerPassId ||
        prevProps.privateConsumerPassId !== this.props.privateConsumerPassId)
    ) {
      this.fetchPrivateConsumerPassDetail();
    }
    if (
      prevProps.privateConsumerPassSelected?.linked_consumer_payment_pack !==
        this.props.privateConsumerPassSelected?.linked_consumer_payment_pack &&
      this.props.privateConsumerPassSelected
    ) {
      if (
        this.props.privateConsumerPassSelected.linked_consumer_payment_pack &&
        !this.props.privateConsumerPassSelected
          .is_universal_consumer_pass_source
      ) {
        this.props.fetchInvoiceByInvoiceItem(
          BUYABLE_ITEM_PASS,
          this.props.privateConsumerPassSelected.linked_consumer_payment_pack,
        );
      }
    }
  }

  fetchPrivateConsumerPassDetail = () => {
    this.props.fetchPrivateBookings({
      private_consumer_pass: this.props.privateConsumerPassId,
    });
    this.props.fetchPrivateConsumerPassExtensionList({
      private_consumer_pass: this.props.privateConsumerPassId,
    });
    if (
      this.props.privateConsumerPassSelected?.linked_consumer_payment_pack &&
      !this.props.privateConsumerPassSelected?.is_universal_consumer_pass_source
    ) {
      this.props.fetchInvoiceByInvoiceItem(
        BUYABLE_ITEM_PASS,
        this.props.privateConsumerPassSelected.linked_consumer_payment_pack,
      );
    } else {
      this.props.fetchInvoiceByInvoiceItem(
        BUYABLE_ITEM_PRIVATE_PASS,
        this.props.privateConsumerPassId,
        {
          onError: () => {
            setTimeout(() => {
              if (
                this.props.privateConsumerPassSelected
                  ?.payment_combo_purchase_id
              ) {
                this.props.fetchInvoiceByInvoiceItem(
                  BUYABLE_ITEM_COMBO_ITEM,
                  this.props.privateConsumerPassSelected
                    .payment_combo_purchase_id,
                );
              }
            }, 1500);
          },
        },
      );
    }
  };

  handleCreateExtension = () => this.props.setOpenCreateExtension(true);

  getPassEndingDate = () =>
    this.props.privateConsumerPassSelected &&
    getExpirationDate(this.props.privateConsumerPassSelected);

  handleChangeExtensionPage = (page: number) => {
    if (this.props.privateConsumerPassId) {
      this.props.fetchPrivateConsumerPassExtensionList({
        private_consumer_pass: this.props.privateConsumerPassId,
        page,
      });
    }
  };

  render() {
    const dataLoading =
      this.props.privateConsumerPassExtensionLoading ||
      this.props.privateConsumerPassLoading ||
      this.props.privateBookingsLoading ||
      this.props.userFiltersLoading;
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.privatePass.allowed_actions.manageExtension',
          'product.privatePass.allowed_actions.manageCredit',
        ]}
      >
        {([
          hasManageExtensionPermission,
          hasManageCreditPermission,
        ]: boolean[]) => (
          <Grid container direction="row" spacing={3}>
            <Grid item lg={6} xs={12}>
              <Paper>
                <PrivateConsumerPassFilters
                  filters={!dataLoading && this.props.filters}
                  open={this.props.open}
                  setFiltersValue={this.props.setFilterValue}
                  setOpenValue={this.props.setOpenValue}
                />
                <Divider />
                <PaginatedListBase
                  additionalFilters={this.props.filters}
                  itemPerPage={5}
                  items={this.props.private_consumer_pass_list}
                  listProps={{ disablePadding: true }}
                  loading={
                    this.props.privateBookingsLoading ||
                    this.props.privateConsumerPassLoading
                  }
                  nbItems={this.props.privateConsumerPassCount}
                  onPageRequested={(page, page_size) =>
                    this.props.fetchPrivateConsumerPassList({
                      ...this.props.filters,
                      member: this.props.id,
                      page,
                      page_size,
                    })
                  }
                  page={this.props.privateConsumerPassPage}
                  renderItem={(pcp) => (
                    <PrivateConsumerPassBookerListItem
                      key={pcp.id}
                      divider
                      onClick={() =>
                        this.props.goToPrivateConsumerPass(
                          this.props.id,
                          pcp.id,
                        )
                      }
                      onUpdateCredit={
                        hasManageCreditPermission &&
                        this.props.updatePrivateConsumerPassCredits
                      }
                      private_consumer_pass={pcp}
                      selected={this.props.privateConsumerPassId === pcp.id}
                    />
                  )}
                />
              </Paper>
            </Grid>
            <Grid item lg={6} xs={12}>
              {this.props.privateConsumerPassId ? (
                <PrivateConsumerPassDetail
                  deleteExtension={(id) => {
                    const currentPage =
                      this.props.privateConsumerPassExtensionPage;
                    const isLastItemInPage =
                      this.props.privateConsumerPassExtensionList?.length === 1;

                    this.props.deletePrivateConsumerPassExtension(id, {
                      onSuccess: () => {
                        this.props.fetchPrivateConsumerPass(
                          this.props.privateConsumerPassId,
                        );
                        this.props.fetchPrivateConsumerPassExtensionList({
                          private_consumer_pass:
                            this.props.privateConsumerPassId,
                          /** Fetch the previous page if removing the last page item */
                          ...(isLastItemInPage &&
                            currentPage > 1 && { page: currentPage - 1 }),
                        });
                      },
                    });
                  }}
                  deletePrivateBooking={this.props.deletePrivateBooking}
                  disablePrivateBooking={this.props.disablePrivateBooking}
                  extensions={this.props.privateConsumerPassExtensionList}
                  extensionsCount={this.props.privateConsumerPassExtensionCount}
                  extensionsLoading={
                    this.props.privateConsumerPassExtensionLoading
                  }
                  extensionsPage={this.props.privateConsumerPassExtensionPage}
                  fetchPrivateConsumerPass={this.props.fetchPrivateConsumerPass}
                  forceRegularizeUnpaid={this.props.forceRegularizeUnpaid}
                  goToPrivateBooking={(privateBookingId) =>
                    this.props.goToPrivateBooking(
                      this.props.id,
                      privateBookingId,
                    )
                  }
                  invoice={this.props.privateConsumerPassInvoice}
                  onCreateExtension={
                    hasManageExtensionPermission && this.handleCreateExtension
                  }
                  onExtensionPageRequested={this.handleChangeExtensionPage}
                  onInvoiceClick={this.props.onInvoiceClick}
                  private_booking_list={this.props.private_booking_list || []}
                  private_consumer_pass={this.props.privateConsumerPassSelected}
                  privateBookingsLoading={this.props.privateBookingsLoading}
                  privateConsumerPassExtensionDeleteLoading={
                    this.props.privateConsumerPassExtensionDeleteLoading
                  }
                />
              ) : null}
            </Grid>
            <ConsumerExtensionCreateDialog
              isLoading={this.props.privateConsumerPassExtensionCreationLoading}
              onClose={() => this.props.setOpenCreateExtension(false)}
              onSubmit={(data) => {
                this.props.createPrivateConsumerPassExtension(
                  {
                    ...data,
                    private_consumer_pass: this.props.privateConsumerPassId,
                  },
                  {
                    onSuccess: () => {
                      this.props.fetchPrivateConsumerPass(
                        this.props.privateConsumerPassId,
                      );
                      this.props.fetchPrivateConsumerPassExtensionList({
                        private_consumer_pass: this.props.privateConsumerPassId,
                      });
                      this.props.setOpenCreateExtension(false);
                    },
                  },
                );
              }}
              open={this.props.openCreateExtension}
              passEndingDate={this.getPassEndingDate()}
              timezone={this.props.timezone}
            />
          </Grid>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateConsumerPassId: 'privateConsumerPassId:number',
  }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  withState('open', 'setOpen', {}),
  connect(
    (state, { id, privateConsumerPassId, relatedInvoice }) => ({
      member: getMember(state, id),
      private_consumer_pass_list: excludeUnPaidPrivateConsumerPass(
        getPrivateConsumerPassList,
      )(state),
      privateConsumerPassPage:
        state.privateService.privateConsumerPass.page || 0,
      privateConsumerPassCount: state.privateService.privateConsumerPass.count,
      privateConsumerPassInvoice: getInvoice(state, relatedInvoice),
      privateConsumerPassExtensionList:
        getPrivateConsumerPassExtensionsList(state),
      privateConsumerPassExtensionPage:
        getPrivateConsumerPassExtensionState(state).page,
      privateConsumerPassExtensionCount:
        getPrivateConsumerPassExtensionState(state).count,
      private_booking_list: getPrivateBookingListBase(state),
      privateConsumerPassExtensionLoading:
        state.privateService.privateConsumerPass.extension.loading,
      privateConsumerPassExtensionCreationLoading:
        state.privateService.privateConsumerPass.extension.create.loading,
      privateConsumerPassExtensionDeleteLoading:
        state.privateService.privateConsumerPass.extension.delete.loading,
      privateConsumerPassLoading:
        state.privateService.privateConsumerPass.loading,
      privateBookingsLoading: state.privateService.privateBooking.loading,
      privateConsumerPassSelected: getPrivateConsumerPass(
        state,
        privateConsumerPassId,
      ),
      userFilters: state.dashboardSettings.managerFiltersSettings.data.filters,
      userFiltersLoading:
        state.dashboardSettings.managerFiltersSettings.loading,
      timezone: state.theme.theme.timezone_name,
    }),
    {
      fetchPrivateConsumerPassList,
      fetchPrivateBookings: fetchPrivateBookingsAction,
      fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
      fetchPrivateConsumerPass,
      forceRegularizeUnpaid: forceRegularizeUnpaidAction,
      fetchPrivateConsumerPassExtensionList:
        fetchPrivateConsumerPassExtensionListAction,
      updatePrivateConsumerPassCredits,
      deletePrivateConsumerPassExtension:
        deletePrivateConsumerPassExtensionAction,
      deletePrivateBooking,
      disablePrivateBooking: disablePrivateBookingAction,
      createPrivateConsumerPassExtension:
        createPrivateConsumerPassExtensionAction,
      fetchManagerFilters: fetchManagerFiltersSettings,
      updateManagerFilters: updateManagerFiltersSettings,
      fetchMember,
      resetPrivateConsumerPassListAction,
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
      retrieveConsumerPackBulk,
    },
  ),
  withState('filters', 'setFilters', (props) => {
    const { userFilters } = props;
    if (userFilters && userFilters.private_pass_filters) {
      return userFilters.private_pass_filters;
    }
    return { reverted: false, is_valid_today: true };
  }),
  withState('openCreateExtension', 'setOpenCreateExtension', false),
  withTranslation(['privateService']),
  withHandlers({
    goToPrivateConsumerPass:
      ({ goToPrivateConsumerPass, setRelatedInvoice }) =>
      (memberId, privateConsumerPassId) => {
        setRelatedInvoice(null);
        goToPrivateConsumerPass(memberId, privateConsumerPassId);
      },
    forceRegularizeUnpaid:
      ({
        forceRegularizeUnpaid,
        fetchPrivateBookings,
        privateConsumerPassId,
        id,
      }) =>
      (options) => {
        forceRegularizeUnpaid(id, privateConsumerPassId, {
          onSuccess: fetchPrivateBookings(
            {
              private_consumer_pass: privateConsumerPassId,
            },
            {
              onSuccess: options?.onSuccess,
              onError: options?.onError,
            },
          ),
          onError: options?.onError,
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
      (filterDict: { [name: string]: boolean | null }) => {
        let newFilters = { ...filters };
        for (const [name, value] of Object.entries(filterDict)) {
          if (value === null) {
            newFilters = omit(newFilters, name);
          } else {
            newFilters[name] = value;
          }
        }
        setFilters(newFilters);
      },
  }),
  withHandlers({
    fetchFiltersSettings:
      ({ fetchManagerFilters, setFilters }) =>
      () => {
        fetchManagerFilters({
          onSuccess: (payload) => {
            if (payload.filters.private_pass_filters)
              setFilters(payload.filters.private_pass_filters);
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
          private_pass_filters: filters,
        });
      },
  }),
)(MemberDetailPrivateConsumerPass);
