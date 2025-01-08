import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { CouponKind } from '@bsport/common/master-data/coupon.js';

import CouponFormDrawer from '#src/libs/coupon/components/CouponFormDrawer.component';
import UniqueCodeCouponFormDrawer from '#src/libs/coupon/components/UniqueCodeCouponForm/UniqueCodeCouponForm.drawer';
import VoucherCodesDialog from '#src/libs/coupon/components/VoucherCodesDialog/VoucherCodesDialog.component';

import { fetchBulk as fetchSelectedShopItems } from '#src/libs/shop/actions/shopitem';
import {
  fetchShopItemBaseList as fetchShopItemBaseListAction,
  fetchShopItemStandaloneList as fetchShopItemStandaloneListAction,
} from '#src/libs/shop/actions/shopItemReworked';
import {
  fetchPrivateSlotBulk as fetchSelectedPrivatePasses,
  fetchPrivatePassList,
} from '#src/libs/private-service/actions';
import {
  fetchPaymentComboBulk as fetchSelectedPaymentCombos,
  fetchPaymentComboList,
} from '#src/libs/payment-combo/actions';
import { fetchTags } from '#src/libs/tag/actions';
import {
  getPaymentPackById,
  getEnabled as getPaymentPacks,
} from '#src/libs/payment-packs/selectors';
import {
  getAllShopItemData,
  getShopItemBaseAndStandaloneById,
  getShopItemBaseAndStandaloneList,
} from '#src/libs/shop/selectors';
import {
  getPrivatePassById,
  getPrivatePassAvailable as getPrivatePass,
} from '#src/libs/private-service/selectors/private-pass';
import {
  getPaymentComboDataDict,
  getAvailablePaymentComboList,
} from '#src/libs/payment-combo/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import type { ShopItem } from '#src/libs/shop/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import { exportAsCsvWithFormattedData } from '../../utils/downloader';
import {
  fetchAllPaymentPacks,
  fetchPaymentPackBulk as fetchSelectedPaymentPacks,
  resetDisabledPaymentPack as resetDisabledPaymentPackAction,
} from '../../libs/payment-packs/actions';
import CouponDetail from '../../libs/coupon/components/CouponDetail.component';
import {
  fetchCouponPage,
  fetchCouponDiscounts,
  deleteCoupon,
  resetDiscounts,
  updateCoupon,
  updateUniqueCodeCoupon,
  markCodesAsRedeemed as markCodesAsRedeemedAction,
  exportCodesAsCsv as exportCodesAsCsvAction,
  retrieveCoupon,
} from '../../libs/coupon/actions';
import {
  getCouponById,
  getCouponDiscounts,
  withTags,
} from '../../libs/coupon/selectors';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import type { PaymentCombo } from '#src/libs/payment_combo/types';
import type { Tag, TagGroupAPI } from '../../tag/types';
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '../../state/types';
import { WithHandlerType } from '../../utils/types';
import type {
  Coupon,
  Discount,
  ExportCodesAsCsvResponse,
} from '../../libs/coupon/types';
import { CouponErrorCodes } from '../../libs/coupon/constants';

type Props = {
  id: number,
  coupon: ?Coupon,
  fetchCouponPage: (number, options?: OptionCallback<Coupon[]>) => void,
  fetchCouponDiscounts: (id: number) => void,
  setDeleteModalOpen: (open: boolean) => void,
  goToInvoice: (uuid: string) => void,
  goToBillingPlan: (id: number) => void,
  deleteModalOpen: boolean,
  loading: boolean,
  discountLoading: boolean,
  discounts: Array<Discount>,
  deleteCoupon: () => void,
  resetDiscounts: () => void,
  fetchTags: () => void,
  fetchAllPaymentPacks: () => void,
  fetchSelectedPaymentPacks: (ids: Number[]) => void,
  fetchPrivatePassList: () => void,
  fetchSelectedPrivatePasses: (ids: Number[]) => void,
  fetchPaymentComboList: () => void,
  fetchSelectedPaymentCombos: (
    params: { company: Number, id__in?: Number[] },
    options?: OptionCallback<PaymentCombo[]>,
  ) => void,
  retrieveCoupon: (
    couponId: string | number,
    options?: OptionCallback<Coupon>,
  ) => void,
  tagsLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  allPaymentPacksById: { [key: number]: PaymentPack },
  allShopItemsById: { [key: number]: ShopItem },
  privatePasses: Array<PrivatePass>,
  allPrivatePassesById: { [key: number]: PrivatePass },
  paymentCombos: Array<PaymentCombo>,
  allPaymentCombosById: { [key: number]: PaymentCombo },
  tagList: Array<Tag<TagGroupAPI>>,
  createOrUpdateLoading: boolean,
} & WithHandlerType<typeof mapWithHandlers>;

const PAGE_SIZE = 5;

type State = {
  couponFormState: { open: boolean, initial: Coupon | null },
  uniqueCodeCouponFormState: { open: boolean, initial: Coupon | null },
  voucherCodesDialogState: { open: boolean },
};
export class CouponCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      couponFormState: { open: false, initial: null },
      uniqueCodeCouponFormState: { open: false, initial: null },
      voucherCodesDialogState: { open: false },
    };
  }

  UNSAFE_componentWillMount() {
    this.props.resetDiscounts();
    this.props.fetchCouponDiscounts(this.props.id, {
      page: 1,
      page_size: PAGE_SIZE,
    });
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchTags();
  }

  componentDidMount() {
    this.props.retrieveCoupon(this.props.id);
    this.props.fetchTags();
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopItemBaseList();
  }

  componentWillUnmount() {
    this.props.resetDisabledPaymentPack();
  }

  openDeleteModal = () => this.props.setDeleteModalOpen(true);

  closeDeleteModal = () => this.props.setDeleteModalOpen(false);

  updateCoupon = (data: Coupon, options?: OptionCallback) => {
    return this.props.updateCoupon(
      this.state.couponFormState.initial.id,
      data,
      {
        onSuccess: () => {
          const id = JSON.parse(
            JSON.stringify(this.state.couponFormState.initial.id),
          );
          this.setState({
            couponFormState: {
              open: false,
              initial: null,
            },
          });
          this.props.fetchCouponPage(1);
          if (options && options.onSuccess) {
            options.onSuccess(id);
          }
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      },
    );
  };

  updateUniqueCodeCoupon = (data: Coupon, options?: OptionCallback) => {
    if (this.state.uniqueCodeCouponFormState?.initial?.id) {
      return this.props.updateUniqueCodeCoupon(
        this.state.uniqueCodeCouponFormState.initial.id,
        data,
        {
          onSuccess: () => {
            this.setState({
              uniqueCodeCouponFormState: {
                open: false,
                initial: null,
              },
            });
            this.props.retrieveCoupon(this.props.coupon.id);
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
          [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]:
            () => {
              if (
                options &&
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
                ]
              )
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
                ]();
            },
          [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]:
            () => {
              if (
                options &&
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
                ]
              )
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
                ]();
            },
        },
      );
    }
    return null;
  };

  handleOnEdit = () => {
    if (
      this.props.coupon &&
      this.props.coupon.coupon_type === CouponKind.COUPON_VIA_CODE
    ) {
      this.setState({
        couponFormState: { open: true, initial: this.props.coupon },
      });
    } else if (
      this.props.coupon &&
      this.props.coupon.coupon_type ===
        CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE
    ) {
      this.setState({
        uniqueCodeCouponFormState: { open: true, initial: this.props.coupon },
      });
    }
  };

  onCloseFormDrawer = () =>
    this.setState({ couponFormState: { open: false, initial: null } });

  onCloseUniqueCodeCouponFormDrawer = () =>
    this.setState({
      uniqueCodeCouponFormState: { open: false, initial: null },
    });

  openVoucherCodesDialog = () => {
    this.setState({
      voucherCodesDialogState: { open: true },
    });
  };

  onCloseVoucherCodesDialog = () => {
    this.setState({
      voucherCodesDialogState: { open: false },
    });
  };

  render() {
    if (!this.props.coupon) {
      return <CircularProgress />;
    }

    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <CouponDetail
          coupon={this.props.coupon}
          discountLoading={this.props.discountLoading}
          discounts={this.props.discounts}
          fetchCouponDiscounts={this.props.fetchCouponDiscounts}
          goToBillingPlan={this.props.goToBillingPlan}
          goToEdit={this.handleOnEdit}
          goToInvoice={this.props.goToInvoice}
          isLoading={this.props.loading}
          itemPerPage={PAGE_SIZE}
          openVoucherCodesDialog={this.openVoucherCodesDialog}
        />
        {!this.props.loading && (
          <BottomActionButtons
            onDelete={
              this.props.coupon.coupon_template_instance
                ? null
                : this.openDeleteModal
            }
            onEdit={this.handleOnEdit}
          />
        )}
        <CouponDeleteModal
          onClose={this.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
          open={!!this.props.deleteModalOpen}
        />
        <CouponFormDrawer
          allPaymentCombosById={this.props.allPaymentCombosById}
          allPaymentPacksById={this.props.allPaymentPacksById}
          allPrivatePassesById={this.props.allPrivatePassesById}
          allShopItemsById={this.props.shopItemBaseAndStandaloneById}
          fetchSelectedPaymentCombos={this.props.fetchSelectedPaymentCombos}
          fetchSelectedPaymentPacks={this.props.fetchSelectedPaymentPacks}
          fetchSelectedPrivatePasses={this.props.fetchSelectedPrivatePasses}
          fetchSelectedShopItems={this.props.fetchSelectedShopItems}
          initial={this.state.couponFormState.initial}
          onCancel={this.onCloseFormDrawer}
          onClose={this.onCloseFormDrawer}
          onSubmit={this.updateCoupon}
          open={this.state.couponFormState.open}
          paymentCombos={this.props.paymentCombos}
          paymentPacks={this.props.paymentPacks}
          privatePasses={this.props.privatePasses}
          processing={this.props.createOrUpdateLoading}
          shopItems={this.props.shopItemBaseAndStandaloneList ?? []}
          tagList={this.props.tagList}
          tagsLoading={this.props.tagsLoading}
        />

        <>
          <UniqueCodeCouponFormDrawer
            isLoading={this.props.loading}
            isProcessing={this.props.createOrUpdateLoading}
            onCancel={this.onCloseUniqueCodeCouponFormDrawer}
            onSubmit={this.updateUniqueCodeCoupon}
            open={this.state.uniqueCodeCouponFormState.open}
            paymentCombos={this.props.paymentCombos}
            paymentCombosById={this.props.allPaymentCombosById}
            paymentPacks={this.props.paymentPacks}
            paymentPacksById={this.props.allPaymentPacksById}
            privatePasses={this.props.privatePasses}
            privatePassesById={this.props.allPrivatePassesById}
            shopItems={this.props.shopItemBaseAndStandaloneList ?? []}
            shopItemsById={this.props.shopItemBaseAndStandaloneById}
            uniqueCodeCoupon={this.state.uniqueCodeCouponFormState.initial}
          />
          <VoucherCodesDialog
            exportAsCsv={this.props.exportCodesAsCsv}
            isLoading={this.props.loading}
            isOpen={this.state.voucherCodesDialogState.open}
            markCodeAsRedeemed={this.props.markCodesAsRedeemed}
            onClose={this.onCloseVoucherCodesDialog}
            uniqueCodeCoupon={this.props.coupon}
          />
        </>
      </div>
    );
  }
}

const mapWithHandlers = {
  updateCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (id: number, data: any, options?: OptionCallback<Coupon>) =>
      props.updateCouponAction(id, data, {
        onSuccess: (couponUpdated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponUpdated);
        },
      }),
  updateUniqueCodeCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (
      id: number,
      data: UniqueCodeCouponUpdatePayload,
      options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
    ) => {
      props.updateUniqueCodeCouponAction(id, data, {
        onSuccess: (couponUpdated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponUpdated);
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
        [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]:
          () => {
            if (
              options &&
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
              ]
            )
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
              ]();
          },
        [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]:
          () => {
            if (
              options &&
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
              ]
            )
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
              ]();
          },
      });
    },
  markCodesAsRedeemed:
    (props: ConnectedProps<typeof connector>) =>
    (
      id: string | number,
      codes: string[],
      options?: OptionCallback<Coupon>,
    ) => {
      props.markCodesAsRedeemed(id, codes, {
        onSuccess: (couponUpdated: Coupon) => {
          props.retrieveCoupon(couponUpdated.id);
          if (options && options.onSuccess) options.onSuccess(couponUpdated);
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
  exportCodesAsCsv:
    (props: ConnectedProps<typeof connector>) =>
    (
      id: string | number,
      codes: string[],
      options?: OptionCallback<ExportCodesAsCsvResponse>,
    ) => {
      props.exportCodesAsCsv(id, codes, {
        onSuccess: (response: string) => {
          exportAsCsvWithFormattedData(response);
          if (options && options.onSuccess) options.onSuccess(response);
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      });
    },
};

const connector = connect(
  (state, { id }) => ({
    coupon: withTags(getCouponById)(state, id),
    discounts: {
      items: getCouponDiscounts(state, id),
      page: state.coupon.discount.page,
      count: state.coupon.discount.count,
    },
    loading: state.coupon.coupon.loading,
    discountLoading: state.coupon.discount.loading,
    createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    tagsLoading: state.tag.tag.loading || state.tag.group.loading,
    paymentPacks: getPaymentPacks(state),
    allPaymentPacksById: getPaymentPackById(state),
    allShopItemsById: getAllShopItemData(state),
    privatePasses: getPrivatePass(state),
    allPrivatePassesById: getPrivatePassById(state),
    paymentCombos: getAvailablePaymentComboList(state),
    allPaymentCombosById: getPaymentComboDataDict(state),
    tagList: getAllTagsWithTagGroup(state),
    shopItemBaseAndStandaloneById: getShopItemBaseAndStandaloneById(state),
    shopItemBaseAndStandaloneList: getShopItemBaseAndStandaloneList(state),
  }),
  {
    goToCouponList: () => pushRouter('/coupon'),
    goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
    goToBillingPlan: (id: number) => pushRouter(`/subscription/${id}`),
    fetchCouponPage,
    fetchTags,
    fetchCouponDiscounts,
    deleteCouponAction: deleteCoupon,
    push: pushRouter,
    resetDiscounts,
    fetchAllPaymentPacks,
    fetchSelectedPaymentPacks,
    fetchSelectedShopItems,
    fetchPrivatePassList,
    fetchSelectedPrivatePasses,
    fetchPaymentComboList,
    fetchSelectedPaymentCombos,
    updateCouponAction: updateCoupon,
    updateUniqueCodeCouponAction: updateUniqueCodeCoupon,
    resetDisabledPaymentPack: resetDisabledPaymentPackAction,
    markCodesAsRedeemed: markCodesAsRedeemedAction,
    exportCodesAsCsv: exportCodesAsCsvAction,
    retrieveCoupon,
    fetchShopItemBaseList: fetchShopItemBaseListAction,
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
  },
);
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  connector,
  withState('deleteModalOpen', 'setDeleteModalOpen', false),
  withProps(
    ({ setDeleteModalOpen, id, deleteCouponAction, goToCouponList }) => ({
      deleteCoupon: () => {
        deleteCouponAction(id, {
          onSuccess: goToCouponList,
          onError: () => setDeleteModalOpen(false),
        });
      },
    }),
  ),
  withHandlers(mapWithHandlers),
  withTitle(({ coupon }: { coupon: Coupon }) => (coupon ? coupon.name : '')),
)(CouponCreate);
