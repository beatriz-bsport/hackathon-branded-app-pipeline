// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import PaymentComboFormDrawer from '../../libs/payment-combo/components/PaymentComboFormDrawer.component';

import {
  getPrivatePassAvailable,
  getRelatedPrivatePassAvailable,
} from '../../libs/private-service/selectors/private-pass';
import { getEnabled as getPaymentPackAvailable } from '../../libs/payment-packs/selectors';
import { getShopItemsBulk } from '../../libs/shop/selectors';
import { fetchRelatedPrivatePassBulk } from '../../libs/payment-combo/actions';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchAllShopItem } from '../../libs/shop/actions/shopitem';
import { fetchPrivatePassList } from '../../libs/private-service/actions';

type Props = any;

export class PaymentComboFormContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShopItem(this.props.initial?.company || null);
    this.props.fetchPrivatePassList();
    const pass_ids = this.props.initial
      ? this.props.initial.private_passes.map((pass) => pass.id)
      : null;
    this.props.fetchRelatedPrivatePassBulk(pass_ids);
  }

  render() {
    return <PaymentComboFormDrawer {...this.props} />;
  }
}

export default compose(
  withMobileDialog(),
  connect(
    (state) => ({
      shopItemList: getShopItemsBulk(state),
      paymentPackList: getPaymentPackAvailable(state),
      privatePassList: getPrivatePassAvailable(state),
      relatedPrivatePassList: getRelatedPrivatePassAvailable(state),
      privatePassListLoading: state.paymentCombo.relatedPrivatePass.loading,
      loadingRelatedObjects:
        state.shop.loading ||
        state.privateService.privatePass.loading ||
        state.paymentPack.loading,
    }),
    {
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchRelatedPrivatePassBulk,
      fetchAllShopItem,
    },
  ),
)(PaymentComboFormContainer);
