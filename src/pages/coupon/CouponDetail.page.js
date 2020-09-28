// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { compose, withState, withProps } from 'recompose';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import withTitle from '../../hocs/with-title.hoc';
import { getCouponById, getCouponDiscounts } from '../../libs/coupon/selectors';
import {
  fetchCouponPage,
  fetchCouponDiscounts,
  deleteCoupon,
  resetDiscounts,
} from '../../libs/coupon/actions';
import type { Coupon, Discount } from '../../libs/coupon/types';
import CouponDetail from '../../libs/coupon/components/CouponDetail.component';

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
  goToEdit: () => void,
  resetDiscounts: () => void,
};

const PAGE_SIZE = 5;

export class CouponCreate extends Component<Props> {
  componentWillMount() {
    this.props.resetDiscounts();
    this.props.fetchCouponDiscounts(this.props.id, {
      page: 1,
      page_size: PAGE_SIZE,
    });
  }

  componentDidMount() {
    this.props.fetchCouponPage(1);
  }

  openDeleteModal = () => this.props.setDeleteModalOpen(true);

  closeDeleteModal = () => this.props.setDeleteModalOpen(false);

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
          goToEdit={this.props.goToEdit}
          itemPerPage={PAGE_SIZE}
          fetchCouponDiscounts={this.props.fetchCouponDiscounts}
        />
        <BottomActionButtons
          onEdit={this.props.goToEdit}
          onDelete={this.openDeleteModal}
        />
        <CouponDeleteModal
          open={!!this.props.deleteModalOpen}
          onClose={this.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  connect(
    (state, { id }) => ({
      coupon: getCouponById(state, id),
      discounts: {
        items: getCouponDiscounts(state, id),
        page: state.coupon.discount.page,
        count: state.coupon.discount.count,
      },
      loading: state.coupon.coupon.loading,
      discountLoading: state.coupon.discount.loading,
    }),
    {
      goToCouponList: () => pushRouter('/coupon'),
      goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
      goToBillingPlan: (id: number) => pushRouter(`/subscription/${id}`),
      fetchCouponPage,
      fetchCouponDiscounts,
      deleteCouponAction: deleteCoupon,
      push: pushRouter,
      resetDiscounts,
    },
  ),
  withProps(({ push, id }) => ({
    goToEdit: () => push(`/coupon/${id}/edit/`),
  })),
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
  withTitle(({ t, coupon }: { t: TFunction, coupon: Coupon }) =>
    t('titles:coupon.couponDetail', { name: coupon ? coupon.name : '' }),
  ),
)(CouponCreate);
