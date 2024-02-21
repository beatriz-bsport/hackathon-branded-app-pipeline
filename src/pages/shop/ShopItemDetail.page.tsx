import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';

// --- ACTIONS ---
import { isShopItemUsedInCombo as isShopItemUsedInComboAction } from '#libs/shop/actions/shopitem';
import {
  retrieveShopItemDetails as retrieveShopItemDetailsAction,
  retrieveShopItemVariantList as retrieveShopItemVariantListAction,
  updateShopItem as updateShopItemAction,
  updateShopItemVariantBulk as updateShopItemVariantBulkAction,
  deleteShopItem as deleteShopItemAction,
  createShopItemVariants as createShopItemVariantsAction,
  deleteShopItemVariant as deleteShopItemVariantAction,
  retrieveShopItemSupplier as retrieveShopItemSupplierAction,
} from '#libs/shop/actions/shopItemReworked';

// --- SELECTORS ---
import { getTheme } from '#libs/theme/selectors';
import {
  getIsShopItemUsedInCombo,
  getShopItemDetailLoading,
  getShopItemDetail,
  getShopItemDetailDeleteLoading,
  getShopItemVariantListLoading,
  getShopItemVariantState,
  getShopItemVariantDeleteLoading,
  getShopItemSupplier,
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
import type {
  ShopItem,
  ShopItemEdit,
  ShopItemVariant,
  ShopItemVariantAttributes,
} from '#libs/shop/types';
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
    this.props.retrieveShopItemDetails(this.props.id, {
      onSuccess: (shopItem) => {
        this.retrieveShopItemVariantList(1);
        if (shopItem.supplier) {
          this.props.retrieveShopItemSupplier(shopItem.supplier);
        }
      },
    });
  };

  retrieveShopItemVariantList = (page: number) =>
    this.props.retrieveShopItemVariantList({ id: this.props.id, page });

  handleUpdateShopItem = (
    formData: ShopItemEdit,
    id: number,
    options?: OptionCallback<ShopItem>,
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

  handleUpdateShopItemVariantBulk = (
    data: FormData,
    options?: OptionCallback,
  ) => {
    this.props.updateShopItemVariantBulk({
      data,
      id: this.props.id,
      options: {
        onSuccess: () => {
          this.retrieveShopItemVariantList(
            this.props.shopItemVariantState.page,
          );
          options?.onSuccess?.();
        },
      },
    });
  };

  handleDeleteShopItem = () => {
    this.props.deleteShopItem(this.props.id, {
      onSuccess: this.props.backToShopPage,
    });
  };

  handleCreateShopItemVariants = (
    baseItemId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback<ShopItemVariant[]>,
  ) => {
    this.props.createShopItemVariants({
      id: baseItemId,
      data,
      options: {
        onSuccess: () => {
          this.retrieveShopItemVariantList(
            this.props.shopItemVariantState.page,
          );
          options?.onSuccess?.();
        },
      },
    });
  };

  handleDeleteShopItemVariant = (id: number) => {
    const currentPage = this.props.shopItemVariantState.page;
    const isLastItemInList =
      this.props.shopItemVariantState.variants.length === 1;

    this.props.deleteShopItemVariant(id, {
      onSuccess: () => {
        this.retrieveShopItemVariantList(
          isLastItemInList ? currentPage - 1 : currentPage,
        );
      },
    });
  };

  render() {
    return (
      <ShopItemDetail
        companyId={this.props.theme.company}
        count={this.props.shopItemVariantState.count}
        createShopItemVariants={this.handleCreateShopItemVariants}
        deleteShopItem={this.handleDeleteShopItem}
        deleteShopItemVariant={this.handleDeleteShopItemVariant}
        fetchShopItemVariantList={this.retrieveShopItemVariantList}
        isDeleting={this.props.isDeleteLoading}
        isDeletingVariant={this.props.isDeleteVariantLoading}
        isLoading={this.props.isLoading}
        isShopItemUsedInCombo={this.props.isShopItemUsedInCombo}
        isVariantListLoading={this.props.isVariantListLoading}
        page={this.props.shopItemVariantState.page}
        provincialTaxValue={this.props.theme.provincial_tax_value}
        shopItem={this.props.shopItem}
        shopItemSupplier={this.props.getShopItemSupplier(
          this.props.shopItem?.supplier,
        )}
        updateShopItem={this.handleUpdateShopItem}
        updateShopItemVariantBulk={this.handleUpdateShopItemVariantBulk}
        variantList={this.props.shopItemVariantState.variants}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    theme: getTheme(state),
    isLoading: getShopItemDetailLoading(state),
    isVariantListLoading: getShopItemVariantListLoading(state),
    isDeleteLoading: getShopItemDetailDeleteLoading(state),
    shopItem: getShopItemDetail(state, id),
    isShopItemUsedInCombo: getIsShopItemUsedInCombo(state, id),
    getShopItemSupplier: (supplierId: number) =>
      getShopItemSupplier(state, supplierId),
    isDeleteVariantLoading: getShopItemVariantDeleteLoading(state),
    shopItemVariantState: getShopItemVariantState(state, id),
  }),
  {
    fetchIsShopItemUsedInCombo: isShopItemUsedInComboAction,
    retrieveShopItemDetails: retrieveShopItemDetailsAction,
    retrieveShopItemVariantList: retrieveShopItemVariantListAction,
    updateShopItem: updateShopItemAction,
    retrieveShopItemSupplier: retrieveShopItemSupplierAction,
    updateShopItemVariantBulk: updateShopItemVariantBulkAction,
    deleteShopItem: deleteShopItemAction,
    createShopItemVariants: createShopItemVariantsAction,
    deleteShopItemVariant: deleteShopItemVariantAction,
    backToShopPage: () => push('/shop'),
  },
);

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withTitle(({ shopItem }) => (shopItem ? shopItem.name : '')),
)(ShopItemDetailPage);
