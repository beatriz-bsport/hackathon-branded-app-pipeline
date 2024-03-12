import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';

// --- ACTIONS ---
import {
  retrieveShopItemDetails as retrieveShopItemDetailsAction,
  retrieveShopItemVariantList as retrieveShopItemVariantListAction,
  updateShopItem as updateShopItemAction,
  updateShopItemVariantBulk as updateShopItemVariantBulkAction,
  deleteShopItem as deleteShopItemAction,
  createShopItemVariants as createShopItemVariantsAction,
  deleteShopItemVariant as deleteShopItemVariantAction,
  retrieveShopItemSupplier as retrieveShopItemSupplierAction,
  createShopItemProvisionBulk as createShopItemProvisionBulkAction,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAction,
} from '#libs/shop/actions/shopItemReworked';

// --- SELECTORS ---
import { getTheme } from '#libs/theme/selectors';
import {
  getIsShopItemUsedInCombo as getIsShopItemUsedInComboSelector,
  getShopItemDetailLoading,
  getShopItemDetail,
  getShopItemDetailDeleteLoading,
  getShopItemVariantListLoading,
  getShopItemVariantState,
  getShopItemVariantDeleteLoading,
  getShopItemVariantUpdateLoading,
  getShopItemSupplier as getShopItemSupplierSelector,
} from '#libs/shop/selectors';

// --- COMPONENTS ---
import ShopItemDetail from '#libs/shop/components/ShopItemDetail';

// --- UTILS ---
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
// @ts-expect-error
import { mapFormDataWithObject } from '../form.utils';

// --- TYPES ---
import type { RootState } from '../../reducers';
import type {
  ProvisionBulkCreate,
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
    this.props.retrieveShopItemUsedInCombo(this.props.id);
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
      options,
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
        onError: options?.onError,
      },
    });
  };

  handleCreateShopItemProvisionBulk = (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => {
    this.props.createShopItemProvisionBulk(this.props.id, data, {
      onSuccess: () => {
        this.retrieveShopItemVariantList(this.props.shopItemVariantState.page);
        options?.onSuccess?.();
      },
      onError: options?.onError,
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
        onError: options?.onError,
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

  handleRetrieveShopItemUsedInCombo = (id: number) =>
    this.props.retrieveShopItemUsedInCombo(id);

  render() {
    return (
      <ShopItemDetail
        companyId={this.props.theme.company}
        count={this.props.shopItemVariantState.count}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemVariants={this.handleCreateShopItemVariants}
        deleteShopItem={this.handleDeleteShopItem}
        deleteShopItemVariant={this.handleDeleteShopItemVariant}
        fetchShopItemVariantList={this.retrieveShopItemVariantList}
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        isDeleting={this.props.isDeleteLoading}
        isDeletingVariant={this.props.isDeleteVariantLoading}
        isLoading={this.props.isLoading}
        isUpdatingVariant={this.props.isUpdateVariantLoading}
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
    getIsShopItemUsedInCombo: (shopItemId: number) =>
      getIsShopItemUsedInComboSelector(state, shopItemId),
    getShopItemSupplier: (supplierId: number) =>
      getShopItemSupplierSelector(state, supplierId),
    isUpdateVariantLoading: getShopItemVariantUpdateLoading(state),
    isDeleteVariantLoading: getShopItemVariantDeleteLoading(state),
    shopItemVariantState: getShopItemVariantState(state, id),
  }),
  {
    retrieveShopItemUsedInCombo: retrieveShopItemUsedInComboAction,
    retrieveShopItemDetails: retrieveShopItemDetailsAction,
    retrieveShopItemVariantList: retrieveShopItemVariantListAction,
    updateShopItem: updateShopItemAction,
    retrieveShopItemSupplier: retrieveShopItemSupplierAction,
    updateShopItemVariantBulk: updateShopItemVariantBulkAction,
    deleteShopItem: deleteShopItemAction,
    createShopItemVariants: createShopItemVariantsAction,
    deleteShopItemVariant: deleteShopItemVariantAction,
    createShopItemProvisionBulk: createShopItemProvisionBulkAction,
    backToShopPage: () => push('/shop'),
  },
);

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withTitle(({ shopItem }) => (shopItem ? shopItem.name : '')),
)(ShopItemDetailPage);
