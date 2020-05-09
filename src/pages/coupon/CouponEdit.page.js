// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps } from 'recompose';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import withTitle from '../../hocs/with-title.hoc';
import { getCouponById } from '../../libs/coupon/selectors';
import {
  fetchCouponPage as fetchCouponPageAction,
  updateCoupon,
} from '../../libs/coupon/actions';
import type { Coupon } from '../../libs/coupon/types';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

import { getAll as getPaymentPacks } from '../../libs/payment-packs/selectors';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { PaymentPack } from '../../libs/payment-packs/types';

import {
  fetchBulk as fetchShopBulkAction,
  fetchShopItemAsManager as fetchAllShop,
} from '../../libs/shop/actions/shopitem';
import { ShopItem } from '../../libs/shop/types';
import { _getAllShopItems as getShopItems } from '../../libs/shop/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { PrivatePass } from '../../libs/private-service/types';
import { getPrivatePassListBase as getPrivatePass } from '../../libs/private-service/selectors/private-pass';

type Props = {
  createOrUpdateLoading: boolean,
  updateCoupon: (id: string, data: *) => void,
  fetchCouponPage: (number) => void,
  goToCouponList: () => void,
  initial: ?Coupon,
  classes: Object,
  fetchAllPaymentPacks: () => void,
  fetchAllShop: () => void,
  fetchPrivatePassList: () => void,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  privatePasses: Array<PrivatePass>,
};

export class CouponCreate extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
  }

  render() {
    const { classes } = this.props;
    if (!this.props.initial) {
      return <CircularProgress />;
    }
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <CouponForm
            initial={this.props.initial}
            processing={this.props.createOrUpdateLoading}
            onSubmit={this.props.updateCoupon}
            onCancel={this.props.goToCouponList}
            paymentPacks={this.props.paymentPacks}
            shopItems={this.props.shopItems}
            privatePasses={this.props.privatePasses}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: '60vw',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
      initial: getCouponById(state, id),
      paymentPacks: getPaymentPacks(state),
      shopItems: getShopItems(state),
      privatePasses: getPrivatePass(state),
    }),
    {
      updateCouponAction: updateCoupon,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchShopBulk: fetchShopBulkAction,
      fetchAllShop,
      goToCouponList: () => push('/coupon'),
      fetchCouponPage: fetchCouponPageAction,
    },
  ),
  withProps(({ updateCouponAction, id, goToCouponList }) => ({
    updateCoupon: (data) =>
      updateCouponAction(id, data, { onSuccess: goToCouponList }),
  })),
  withProps(({ fetchCouponPage, fetchShopBulk, id }) => ({
    fetchCouponPage: (pageId) =>
      fetchCouponPage(pageId, {
        onSuccess: (coupons) => {
          const coupon = coupons.find((couponItem) => couponItem.id === id);
          if (coupon.applies_to === BUYABLE_ITEM_SHOP_ITEM) {
            fetchShopBulk(coupon.company, coupon.only_on_objects);
          }
        },
      }),
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponEdit')),
)(CouponCreate);
