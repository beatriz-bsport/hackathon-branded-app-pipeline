import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';

// --- ACTIONS ---
import { isShopItemUsedInCombo as isShopItemUsedInComboAction } from '#libs/shop/actions/shopitem';
import {
  retrieveShopItemDetails as retrieveShopItemDetailsAction,
  updateShopItem as updateShopItemAction,
  deleteShopItem as deleteShopItemAction,
} from '#libs/shop/actions/shopItemReworked';

// --- SELECTORS ---
import { getTheme } from '#libs/theme/selectors';
import {
  getIsShopItemUsedInCombo,
  getShopItemDetailLoading,
  getShopItemDetail,
  getShopItemDetailDeleteLoading,
} from '#libs/shop/selectors';

// --- COMPONENTS ---
import ShopItemDetail from '#libs/shop/components/ShopItemDetail';

// --- UTILS ---
// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
// @ts-expect-error
import { mapFormDataWithObject } from '../form.utils';

// --- TYPES ---
import type { RootState } from '../../reducers';
import type { ShopItem, ShopItemEdit } from '#libs/shop/types';
import type { OptionCallback } from '../../state/types';

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';

type OwnProps = {
  id: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export class ShopItemDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchIsShopItemUsedInCombo(this.props.id);
    this.retrieveShopItemDetails();
  }

  retrieveShopItemDetails = () => {
    this.props.retrieveShopItemDetails(this.props.id);
  };

  handleUpdateShopItem = (
    formData: ShopItemEdit,
    id: number,
    options: OptionCallback<ShopItem>,
  ) => {
    const finalShopItemData = mapFormDataWithObject(
      formData,
      SHOPITEM_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    if (formData.cover) finalShopItemData.append('cover', formData.cover);

    this.props.updateShopItem({
      formData: finalShopItemData,
      id,
      options: {
        onSuccess: () => {
          options?.onSuccess?.();
        },
      },
    });
  };

  handleDeleteShopitem = () => {
    this.props.deleteShopItem(this.props.id, {
      onSuccess: this.props.backToShopPage,
    });
  };

  render() {
    return (
      <ShopItemDetail
        deleteShopItem={this.handleDeleteShopitem}
        isDeleting={this.props.isDeleteLoading}
        isLoading={this.props.isLoading}
        isShopItemUsedInCombo={this.props.isShopItemUsedInCombo}
        provincialTaxValue={this.props.theme.provincial_tax_value}
        shopItem={this.props.shopItem}
        updateShopItem={this.handleUpdateShopItem}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    theme: getTheme(state),
    isLoading: getShopItemDetailLoading(state),
    isDeleteLoading: getShopItemDetailDeleteLoading(state),
    shopItem: getShopItemDetail(state, id),
    isShopItemUsedInCombo: getIsShopItemUsedInCombo(state, id),
  }),
  {
    fetchIsShopItemUsedInCombo: isShopItemUsedInComboAction,
    retrieveShopItemDetails: retrieveShopItemDetailsAction,
    updateShopItem: updateShopItemAction,
    deleteShopItem: deleteShopItemAction,
    backToShopPage: () => push('/shop'),
  },
);

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withTitle(({ shopItem }) => (shopItem ? shopItem.name : '')),
)(ShopItemDetailPage);
