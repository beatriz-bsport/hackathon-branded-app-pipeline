// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { createStyles, Theme, WithStyles } from '@material-ui/core/styles';

import { TFunction } from 'i18next';
import { OptionCallback } from '../../state/types';
import { createCoupon } from '../../libs/coupon/actions';
import withTitle from '../../hocs/with-title.hoc';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

import { getEnabled as getPaymentPacks } from '../../libs/payment-packs/selectors';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';

import { fetchShopItemAsManager as fetchAllShop } from '../../libs/shop/actions/shopitem';
import { getShopItemsAvailable as getShopItems } from '../../libs/shop/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable as getPrivatePass } from '../../libs/private-service/selectors/private-pass';

import { fetchTags } from '../../libs/tag/actions';
import { getallTagsWithTagGroup } from '../../libs/tag/selectors';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';

type Props = WithStyles<typeof styles> &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation;

export class CouponCreate extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
    this.props.fetchTags();
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
      marginBottom: theme.spacing(40),
      padding: theme.spacing(2),
      minWidth: '60vw',
      width: '70%',
    },
  });

const connector = connect(
  (state: RootState) => ({
    createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    tagsLoading: state.tag.tag.loading || state.tag.group.loading,
    paymentPacks: getPaymentPacks(state),
    shopItems: getShopItems(state),
    privatePasses: getPrivatePass(state),
    tagList: getallTagsWithTagGroup(state),
  }),
  {
    fetchAllPaymentPacks,
    fetchAllShop,
    fetchPrivatePassList,
    fetchTags,
    createCouponAction: createCoupon,
    goToCouponList: () => push('/coupon'),
  },
);

const mapWithHandlers = {
  createCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (data, options?: OptionCallback) =>
      props.createCouponAction(data, {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          props.goToCouponList();
        },
      }),
};

export default compose<any, Props>(
  withTranslation(),
  withStyles(styles),
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponCreate')),
  withHandlers(mapWithHandlers),
)(CouponCreate);
