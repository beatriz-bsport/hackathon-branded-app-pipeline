// @flow
import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { compose, withState, withProps } from 'recompose';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import { getCouponById, getCouponDiscounts } from '../../libs/coupon/selectors';
import {
  fetchCouponPage,
  fetchCouponDiscounts,
  deleteCoupon,
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
  deleteModalOpen: boolean,
  loading: boolean,
  discountLoading: boolean,
  discounts: Array<Discount>,
  deleteCoupon: () => void,
  goToEdit: () => void,
};

export class CouponCreate extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchCouponDiscounts(this.props.id);
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
          discountLoading={this.props.discountLoading}
          goToEdit={this.props.goToEdit}
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
  connect(
    (state, { id }) => ({
      coupon: getCouponById(state, id),
      discounts: getCouponDiscounts(state, id),
      loading: state.coupon.coupon.loading,
      discountLoading: state.coupon.discount.loading,
    }),
    {
      goToCouponList: () => pushRouter('/coupon'),
      goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
      fetchCouponPage,
      fetchCouponDiscounts,
      deleteCouponAction: deleteCoupon,
      push: pushRouter,
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
)(CouponCreate);
