// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import PaymentComboFormDialog from '../../libs/payment-combo/components/PaymentComboFormDialog.component';

import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { getEnabled as getPaymentPackAvailable } from '../../libs/payment-packs/selectors';
import { getShopItemsAvailable } from '../../libs/shop/selectors';
import { fetchRelatedPrivatePassBulk } from '../../libs/payment-combo/actions';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchShopItemAsManager as fetchAllShopItem } from '../../libs/shop/actions/shopitem';
import { fetchPrivatePassList } from '../../libs/private-service/actions';

type Props = any;

export class PaymentComboFormContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShopItem();
    this.props.fetchPrivatePassList();
    const pass_ids = this.props.initial
      ? this.props.initial.private_passes.map((pass) => pass.id)
      : null;
    this.props.fetchRelatedPrivatePassBulk(pass_ids);
  }

  render() {
    return <PaymentComboFormDialog {...this.props} />;
  }
}

export default compose(
  withMobileDialog(),
  connect(
    (state) => ({
      shopItemList: getShopItemsAvailable(state),
      paymentPackList: getPaymentPackAvailable(state),
      privatePassList: getPrivatePassAvailable(state),
      relatedPrivatePass: state.paymentCombo.relatedPrivatePass.byId,
      relatedPrivatePassIds: state.paymentCombo.relatedPrivatePass.allIds,
      privatePassListLoading: state.paymentCombo.relatedPrivatePass.loading,
      loadingRelatedObjects:
        state.shop.loading ||
        state.privateService.privatePass.loading ||
        state.paymentPack.loading,
    }),
    {
      fetchAllPaymentPacks,
      fetchAllShopItem,
      fetchPrivatePassList,
      fetchRelatedPrivatePassBulk,
    },
  ),
)(PaymentComboFormContainer);
