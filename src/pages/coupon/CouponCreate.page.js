// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import { compose, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';

import { createCoupon } from '../../libs/coupon/actions';
import withTitle from '../../hocs/with-title.hoc';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

import { getEnabled as getPaymentPacks } from '../../libs/payment-packs/selectors';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { PaymentPack } from '../../libs/payment-packs/types';

import { fetchShopItemAsManager as fetchAllShop } from '../../libs/shop/actions/shopitem';
import { ShopItem } from '../../libs/shop/types';
import { getShopItemsAvailable as getShopItems } from '../../libs/shop/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { PrivatePass } from '../../libs/private-service/types';
import { getPrivatePassAvailable as getPrivatePass } from '../../libs/private-service/selectors/private-pass';

type Props = {
  createOrUpdateLoading: boolean,
  createCoupon: (data: *) => void,
  goToCouponList: () => void,
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
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <CouponForm
            processing={this.props.createOrUpdateLoading}
            onSubmit={this.props.createCoupon}
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
  withTranslation(),
  withStyles(styles),
  connect(
    (state) => ({
      createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
      paymentPacks: getPaymentPacks(state),
      shopItems: getShopItems(state),
      privatePasses: getPrivatePass(state),
    }),
    {
      fetchAllPaymentPacks,
      fetchAllShop,
      fetchPrivatePassList,
      createCouponAction: createCoupon,
      goToCouponList: () => push('/coupon'),
    },
  ),
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponCreate')),
  withProps(({ createCouponAction, goToCouponList }) => ({
    createCoupon: (data) =>
      createCouponAction(data, { onSuccess: goToCouponList }),
  })),
)(CouponCreate);
