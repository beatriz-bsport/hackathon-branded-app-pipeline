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
  resetDisabledPaymentPack as resetDisabledPaymentPackAction,
} from '../../libs/payment-packs/actions';
import {
  fetchBulk as fetchSelectedShopItems,
  fetchShopItemAsManager as fetchAllShop,
} from '#libs/shop/actions/shopitem';
import { fetchPrivatePassList } from '#libs/private-service/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
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
  getPrivatePassAvailable as getPrivatePass
} from '#libs/private-service/selectors/private-pass';
import { getPaymentComboList } from '#libs/payment-combo/selectors';
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
  fetchAllShop: () => void,
  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,
  tagsLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  allPaymentPacksById: Object,
  shopItems: Array<ShopItem>,
  allShopItemsById: Object,
  privatePasses: Array<PrivatePass>,
  allPrivatePassesById: Object,
  paymentCombos: Array<PaymentCombo>,
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
          discounts={this.props.discounts}
          goToInvoice={this.props.goToInvoice}
          goToBillingPlan={this.props.goToBillingPlan}
          discountLoading={this.props.discountLoading}
          goToEdit={() =>
            this.setState({
              couponFormState: { open: true, initial: this.props.coupon },
            })
          }
          itemPerPage={PAGE_SIZE}
          fetchCouponDiscounts={this.props.fetchCouponDiscounts}
        />
        <BottomActionButtons
          onEdit={() =>
            this.setState({
              couponFormState: { open: true, initial: this.props.coupon },
            })
          }
          onDelete={
            this.props.coupon.coupon_template_instance
              ? null
              : this.openDeleteModal
          }
        />
        <CouponDeleteModal
          open={!!this.props.deleteModalOpen}
          onClose={this.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
        />
        <CouponFormDrawer
          open={this.state.couponFormState.open}
          initial={this.state.couponFormState.initial}
          processing={this.props.createOrUpdateLoading}
          onSubmit={this.updateCoupon}
          onCancel={this.onCloseFormDrawer}
          onClose={this.onCloseFormDrawer}
          paymentPacks={this.props.paymentPacks}
          allPaymentPacksById={this.props.allPaymentPacksById}
          shopItems={this.props.shopItems}
          allShopItemsById={this.props.allShopItemsById}
          privatePasses={this.props.privatePasses}
          allPrivatePassesById={this.props.allPrivatePassesById}
          paymentCombos={this.props.paymentCombos}
          tagList={this.props.tagList}
          tagsLoading={this.props.tagsLoading}
          fetchSelectedShopItems={this.props.fetchSelectedShopItems}
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
    fetchAllShop,
    fetchSelectedShopItems,
    fetchPrivatePassList,
    fetchPaymentComboList,
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
