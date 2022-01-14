// @flow
import React, { Component } from 'react';

import { withTranslation, TFunction } from 'react-i18next';
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
import { fetchAllPaymentPacks } from '#libs/payment-packs/actions';
import { fetchShopItemAsManager as fetchAllShop } from '#libs/shop/actions/shopitem';
import { fetchPrivatePassList } from '#libs/private-service/actions';
import { fetchTags } from '#libs/tag/actions';
import { getEnabled as getPaymentPacks } from '#libs/payment-packs/selectors';
import { getShopItemsAvailable as getShopItems } from '#libs/shop/selectors';
import { getPrivatePassAvailable as getPrivatePass } from '#libs/private-service/selectors/private-pass';
import { getallTagsWithTagGroup } from '#libs/tag/selectors';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { ShopItem } from '#libs/shop/types';
import type { PrivatePass } from '#libs/private-service/types';
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
  tagsLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  privatePasses: Array<PrivatePass>,
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
    this.props.fetchTags();
  }

  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchTags();
  }

  openDeleteModal = () => this.props.setDeleteModalOpen(true);

  closeDeleteModal = () => this.props.setDeleteModalOpen(false);

  updateCoupon = (data: Coupon, options?: OptionCallback) => {
    return this.props.updateCoupon(
      this.state.couponFormState.initial.id,
      data,
      {
        onSuccess: () => {
          this.setState({
            couponFormState: {
              open: false,
              initial: null,
            },
          });
          if (options && options.onSuccess) options.onSuccess();
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
          onDelete={this.openDeleteModal}
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
          shopItems={this.props.shopItems}
          privatePasses={this.props.privatePasses}
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
    shopItems: getShopItems(state),
    privatePasses: getPrivatePass(state),
    tagList: getallTagsWithTagGroup(state),
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
    fetchPrivatePassList,
    updateCouponAction: updateCoupon,
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
  withTitle(({ t, coupon }: { t: TFunction, coupon: Coupon }) =>
    t('titles:coupon.couponDetail', { name: coupon ? coupon.name : '' }),
  ),
)(CouponCreate);
