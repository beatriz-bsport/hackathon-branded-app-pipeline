// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { compose, withState, withProps, withHandlers } from 'recompose';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import withTitle from '../../hocs/with-title.hoc';
import {
  getCouponById,
  getCouponDiscounts,
  withTags,
} from '../../libs/coupon/selectors';
import {
  fetchCouponPage,
  fetchCouponDiscounts,
  deleteCoupon,
  resetDiscounts,
  updateCoupon,
} from '../../libs/coupon/actions';
import type { Coupon, Discount } from '../../libs/coupon/types';
import CouponDetail from '../../libs/coupon/components/CouponDetail.component';
import CouponFormDrawer from '#libs/coupon/components/CouponFormDrawer.component';
import {
  fetchAllPaymentPacks,
  fetchPaymentPackBulk as fetchSelectedPaymentPacks,
  resetDisabledPaymentPack as resetDisabledPaymentPackAction,
} from '../../libs/payment-packs/actions';
import {
  fetchBulk as fetchSelectedShopItems,
  fetchShopItemAsManager as fetchAllShop,
} from '#libs/shop/actions/shopitem';
import {
  fetchPrivateSlotBulk as fetchSelectedPrivatePasses,
  fetchPrivatePassList,
} from '#libs/private-service/actions';
import {
  fetchPaymentComboBulk as fetchSelectedPaymentCombos,
  fetchPaymentComboList,
} from '#libs/payment-combo/actions';
import { fetchTags } from '#libs/tag/actions';
import {
  getPaymentPackById,
  getEnabled as getPaymentPacks,
} from '#libs/payment-packs/selectors';
import {
  getAllShopItemData,
  getShopItemsAvailable as getShopItems,
} from '#libs/shop/selectors';
import {
  getPrivatePassById,
  getPrivatePassAvailable as getPrivatePass,
} from '#libs/private-service/selectors/private-pass';
import {
  getPaymenComboDataDict,
  getPaymentComboList,
} from '#libs/payment-combo/selectors';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import type { ShopItem } from '#libs/shop/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment_combo/types';
import type { Tag, TagGroupAPI } from '../../tag/types';
import type { OptionCallback } from '../../state/types';
import { WithHandlerType } from '../../utils/types';

type Props = {
  id: number,
  coupon: ?Coupon,
  fetchCouponPage: (number) => void,
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
  fetchAllShop: () => void,
  fetchPrivatePassList: () => void,
  fetchSelectedPrivatePasses: (ids: Number[]) => void,
  fetchPaymentComboList: () => void,
  fetchSelectedPaymentCombos: (
    params: { company: Number, id__in?: Number[] },
    options?: OptionCallback<PaymentCombo[]>,
  ) => void,
  tagsLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  allPaymentPacksById: { [key: number]: PaymentPack },
  shopItems: Array<ShopItem>,
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
};
export class CouponCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      couponFormState: { open: false, initial: null },
    };
  }

  componentWillMount() {
    this.props.resetDiscounts();
    this.props.fetchCouponDiscounts(this.props.id, {
      page: 1,
      page_size: PAGE_SIZE,
    });
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchTags();
  }

  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchTags();
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

  onCloseFormDrawer = () =>
    this.setState({ couponFormState: { open: false, initial: null } });

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
          goToEdit={() =>
            this.setState({
              couponFormState: { open: true, initial: this.props.coupon },
            })
          }
          goToInvoice={this.props.goToInvoice}
          itemPerPage={PAGE_SIZE}
        />
        <BottomActionButtons
          onDelete={
            this.props.coupon.coupon_template_instance
              ? null
              : this.openDeleteModal
          }
          onEdit={() =>
            this.setState({
              couponFormState: { open: true, initial: this.props.coupon },
            })
          }
        />
        <CouponDeleteModal
          onClose={this.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
          open={!!this.props.deleteModalOpen}
        />
        <CouponFormDrawer
          allPaymentCombosById={this.props.allPaymentCombosById}
          allPaymentPacksById={this.props.allPaymentPacksById}
          allPrivatePassesById={this.props.allPrivatePassesById}
          allShopItemsById={this.props.allShopItemsById}
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
          shopItems={this.props.shopItems}
          tagList={this.props.tagList}
          tagsLoading={this.props.tagsLoading}
        />
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
    shopItems: getShopItems(state),
    allShopItemsById: getAllShopItemData(state),
    privatePasses: getPrivatePass(state),
    allPrivatePassesById: getPrivatePassById(state),
    paymentCombos: getPaymentComboList(state),
    allPaymentCombosById: getPaymenComboDataDict(state),
    tagList: getAllTagsWithTagGroup(state),
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
    fetchAllShop,
    fetchSelectedShopItems,
    fetchPrivatePassList,
    fetchSelectedPrivatePasses,
    fetchPaymentComboList,
    fetchSelectedPaymentCombos,
    updateCouponAction: updateCoupon,
    resetDisabledPaymentPack: resetDisabledPaymentPackAction,
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
