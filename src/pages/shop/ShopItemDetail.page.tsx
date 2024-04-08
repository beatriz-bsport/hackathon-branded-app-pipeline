import React, { Component } from 'react';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';

// --- ACTIONS ---
import {
  retrieveShopItemDetails as retrieveShopItemDetailsAction,
  fetchShopItemVariantList as fetchShopItemVariantListAction,
  updateShopItem as updateShopItemAction,
  updateShopItemVariantBulk as updateShopItemVariantBulkAction,
  deleteShopItem as deleteShopItemAction,
  createShopItemVariants as createShopItemVariantsAction,
  deleteShopItemVariant as deleteShopItemVariantAction,
  createShopItemProvisionBulk as createShopItemProvisionBulkAction,
  createShopItemProvision as createShopItemProvisionAction,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAction,
  fetchShopItemVariantCombinationList as fetchShopItemVariantCombinationListAction,
} from '#libs/shop/actions/shopItemReworked';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#libs/payment/actions';

import {
  retrieveShopItemSupplier as retrieveShopItemSupplierAction,
  fetchShopSupplierList as fetchShopSupplierListAction,
} from '#libs/shop/actions/supplier';

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
  getShopItemVariantCombinationList,
  getShopSupplierState,
} from '#libs/shop/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';

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
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItem,
  ShopItemEdit,
  ShopItemVariant,
  ShopItemVariantAttributes,
} from '#libs/shop/types';
import type { OptionCallback } from '../../state/types';

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

type OwnProps = {
  id: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export class ShopItemDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.retrieveShopItemUsedInCombo(this.props.id);
    this.props.fetchShopSupplierList();
    this.retrieveShopItemDetails();
    this.props.fetchShopItemVariantCombinationList(this.props.id);
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  retrieveShopItemDetails = () => {
    this.props.retrieveShopItemDetails(this.props.id, {
      onSuccess: () => {
        this.fetchShopItemVariantList(1);
      },
    });
  };

  fetchShopItemVariantList = (page: number) =>
    this.props.fetchShopItemVariantList({ id: this.props.id, page });

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
          this.fetchShopItemVariantList(this.props.shopItemVariantState.page);
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  handleCreateShopItemProvision = (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) =>
    this.props.createShopItemProvision(data, {
      onSuccess: () => {
        this.fetchShopItemVariantList(this.props.shopItemVariantState.page);
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });

  handleCreateShopItemProvisionBulk = (
    data: ProvisionBulkCreate,
    options?: OptionCallback,
  ) => {
    this.props.createShopItemProvisionBulk(this.props.id, data, {
      onSuccess: () => {
        this.fetchShopItemVariantList(this.props.shopItemVariantState.page);
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
          this.fetchShopItemVariantList(this.props.shopItemVariantState.page);
          this.props.fetchShopItemVariantCombinationList(this.props.id);
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  handleDeleteShopItemVariant = (id: number) => {
    const currentPage = this.props.shopItemVariantState.page;
    const isLastItemInPage =
      this.props.shopItemVariantState.variants.length === 1;

    this.props.deleteShopItemVariant(id, {
      onSuccess: () => {
        this.fetchShopItemVariantList(
          /**
           * When performing a variant deletion, we want to fetch the previous page
           * if we did delete the last remaining variant in the page. This avoid pagination
           * number issues (e.g refetching a page that doesnt exist anymore).
           */
          isLastItemInPage && currentPage > 1 ? currentPage - 1 : currentPage,
        );
      },
    });
  };

  handleRetrieveShopItemUsedInCombo = (id: number) =>
    this.props.retrieveShopItemUsedInCombo(id);

  render() {
    return (
      <ShopItemDetail
        bookkeepingAccountById={this.props.bookkeepingAccountById}
        bookkeepingAccounts={this.props.bookkeepingAccounts}
        companyId={this.props.theme.company}
        count={this.props.shopItemVariantState.count}
        createShopItemProvision={this.handleCreateShopItemProvision}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemVariants={this.handleCreateShopItemVariants}
        deleteShopItem={this.handleDeleteShopItem}
        deleteShopItemVariant={this.handleDeleteShopItemVariant}
        fetchShopItemVariantList={this.fetchShopItemVariantList}
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
        supplierList={this.props.supplierState.suppliers}
        updateShopItem={this.handleUpdateShopItem}
        updateShopItemVariantBulk={this.handleUpdateShopItemVariantBulk}
        variantCombinationList={this.props.variantCombinationList ?? []}
        variantList={this.props.shopItemVariantState.variants ?? []}
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
    supplierState: getShopSupplierState(state),
    isUpdateVariantLoading: getShopItemVariantUpdateLoading(state),
    isDeleteVariantLoading: getShopItemVariantDeleteLoading(state),
    shopItemVariantState: getShopItemVariantState(state, id),
    variantCombinationList: getShopItemVariantCombinationList(state, id),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountById: getBookkeepingAccountById(state),
  }),
  {
    retrieveShopItemUsedInCombo: retrieveShopItemUsedInComboAction,
    retrieveShopItemDetails: retrieveShopItemDetailsAction,
    fetchShopItemVariantList: fetchShopItemVariantListAction,
    updateShopItem: updateShopItemAction,
    retrieveShopItemSupplier: retrieveShopItemSupplierAction,
    fetchShopSupplierList: fetchShopSupplierListAction,
    updateShopItemVariantBulk: updateShopItemVariantBulkAction,
    deleteShopItem: deleteShopItemAction,
    createShopItemVariants: createShopItemVariantsAction,
    deleteShopItemVariant: deleteShopItemVariantAction,
    createShopItemProvisionBulk: createShopItemProvisionBulkAction,
    createShopItemProvision: createShopItemProvisionAction,
    fetchShopItemVariantCombinationList:
      fetchShopItemVariantCombinationListAction,
    backToShopPage: () => push('/shop'),
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
  },
);

export default compose<Props, OwnProps>(
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withHandlers({
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
  }),
  withTitle(({ shopItem }) => (shopItem ? shopItem.name : '')),
)(ShopItemDetailPage);
