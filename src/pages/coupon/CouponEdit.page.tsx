// @flow
import React, { Component } from 'react';

import { TFunction, withTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';

import { createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import withTitle from '../../hocs/with-title.hoc';
import { getCouponById } from '../../libs/coupon/selectors';
import {
  fetchCouponPage as fetchCouponPageAction,
  updateCoupon,
} from '../../libs/coupon/actions';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

import { getAll as getPaymentPacks } from '../../libs/payment-packs/selectors';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';

import {
  fetchBulk as fetchShopBulkAction,
  fetchShopItemAsManager as fetchAllShop,
} from '../../libs/shop/actions/shopitem';
import { _getAllShopItems as getShopItems } from '../../libs/shop/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassListBase as getPrivatePass } from '../../libs/private-service/selectors/private-pass';
import { fetchTags } from '../../libs/tag/actions';
import { getallTagsWithTagGroup } from '../../libs/tag/selectors';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import type { Coupon } from '../../libs/coupon/types';

type Props = ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithHandlerType<typeof mapWithHandlers>;

export class CouponCreate extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
    this.props.fetchTags();
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
            tagList={this.props.tagList}
            tagsLoading={this.props.tagsLoading}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      padding: theme.spacing(2),
      minWidth: '60vw',
      marginBottom: theme.spacing(40),
      width: '70%',
    },
  });

const connector = connect(
  (state: RootState, props: { id: number }) => ({
    createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    tagsLoading: state.tag.tag.loading || state.tag.group.loading,
    initial: getCouponById(state, props.id),
    paymentPacks: getPaymentPacks(state),
    shopItems: getShopItems(state),
    privatePasses: getPrivatePass(state),
    tagList: getallTagsWithTagGroup(state),
  }),
  {
    updateCouponAction: updateCoupon,
    fetchAllPaymentPacks,
    fetchPrivatePassList,
    fetchTags,
    fetchShopBulk: fetchShopBulkAction,
    fetchAllShop,
    goToCouponList: () => push('/coupon'),
    fetchCouponPage: fetchCouponPageAction,
  },
);

const mapWithHandlers = {
  updateCoupon: (props: ConnectedProps<typeof connector> & { id: number }) => (
    data: any,
  ) =>
    props.updateCouponAction(props.id, data, {
      onSuccess: props.goToCouponList,
    }),
  fetchCouponPage: (
    props: ConnectedProps<typeof connector> & { id: number },
  ) => (pageId: number) =>
    props.fetchCouponPage(pageId, {
      onSuccess: (coupons: Array<Coupon>) => {
        const coupon = coupons.find((couponItem) => couponItem.id === props.id);
        if (coupon.applies_to === BUYABLE_ITEM_SHOP_ITEM) {
          props.fetchShopBulk(coupon.company, coupon.only_on_objects);
        }
      },
    }),
};

export default compose(
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withHandlers(mapWithHandlers),
  withTranslation('title'),
  withTitle(({ t }: { t: TFunction }) => t('coupon.couponEdit')),
)(CouponCreate);
