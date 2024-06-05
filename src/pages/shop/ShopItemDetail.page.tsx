import React, { Component } from 'react';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';

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

import { retrieveFranchise as retrieveFranchiseAction } from '#libs/franchise/actions';

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
  getShopItemVariantFilterOptionList,
} from '#libs/shop/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';
import { getFranchisor } from '#libs/franchise/selectors';

// --- COMPONENTS ---
import ShopItemDetail from '#libs/shop/components/ShopItemDetail';

// --- UTILS ---
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
// @ts-expect-error

// --- TYPES ---
import type {
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItem,
  ShopItemEdit,
  ShopItemVariantAttributes,
} from '#libs/shop/types';

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';
import { ShopItemDetailTab } from '#libs/shop/components/ShopItemDetail/constants';
import { SelectOption } from '#libs/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import { mapFormDataWithObject } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';

type OwnProps = {
  id: number;
  queryParams: {
    tab?: string;
    page?: string;
    color?: string;
    size?: string;
  };
  setQueryParam: (queryParam: string) => (value: string) => void;
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
    this.props.theme.franchisor &&
      this.props.retrieveFranchise(this.props.theme.franchisor);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.queryParams.page !== this.props.queryParams.page) {
      this.fetchShopItemVariantList();
    }
    /*
      Whenever applying filters, we want to get back to page 1 to prevent
      fetching filtered pages that doesnt exist.
    */
    if (
      prevProps.queryParams.color !== this.props.queryParams.color ||
      prevProps.queryParams.size !== this.props.queryParams.size
    ) {
      this.props.setQueryParam('page')('1');
      // if we are applying filters but already on page 1
      if (this.props.queryParams.page === '1') {
        this.fetchShopItemVariantList();
      }
    }
    /*
      Whenever changing tab, we want to get back to page 1 to prevent
      keeping page number synchronized across tabs. 
    */
    if (prevProps.queryParams.tab !== this.props.queryParams.tab) {
      const currentPage = this.props.shopItemVariantState.page;
      const isTabRenderingVariants =
        this.props.queryParams.tab === ShopItemDetailTab.INVENTORY ||
        this.props.queryParams.tab === ShopItemDetailTab.VARIANTS;
      if (currentPage > 1 && isTabRenderingVariants) {
        this.props.setQueryParam('page')('1');
      }
    }
  }

  retrieveShopItemDetails = () => {
    this.props.retrieveShopItemDetails(this.props.id, {
      onSuccess: () => {
        this.fetchShopItemVariantList();
      },
    });
  };

  fetchShopItemVariantList = () => {
    const page =
      parseInt(this.props.queryParams?.page, 10) ||
      this.props.shopItemVariantState.page ||
      1;
    const colorFilter = this.props.queryParams?.color?.split(',');
    const sizeFilter = this.props.queryParams?.size?.split(',');

    this.props.fetchShopItemVariantList({
      id: this.props.id,
      page,
      colors: colorFilter,
      sizes: sizeFilter,
    });
  };

  handleChangeInventoryVariantFilters =
    (type: 'colors' | 'sizes') => (options: SelectOption[]) => {
      const availableOptions = options.map((option) => option.value).join(',');
      type === 'colors' && this.props.setQueryParam('color')(availableOptions);
      type === 'sizes' && this.props.setQueryParam('size')(availableOptions);
    };

  handleUpdateShopItem = (
    formData: ShopItemEdit,
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
      id: this.props.id,
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
          this.fetchShopItemVariantList();
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
        this.fetchShopItemVariantList();
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
        this.fetchShopItemVariantList();
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
    options?: OptionCallback<ShopItem[]>,
  ) => {
    this.props.createShopItemVariants({
      id: baseItemId,
      data,
      options: {
        onSuccess: () => {
          this.fetchShopItemVariantList();
          this.props.fetchShopItemVariantCombinationList(this.props.id);
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  handleDeleteShopItemVariant = (id: number) => {
    const currentPage = parseInt(this.props.queryParams.page, 10);
    const isLastItemInPage =
      this.props.shopItemVariantState.variants.length === 1;

    this.props.deleteShopItemVariant(id, {
      onSuccess: () => {
        /**
         * When performing a variant deletion, we want to fetch the previous page
         * if we did delete the last remaining variant in the page. This avoid pagination
         * number issues (e.g refetching a page that doesnt exist anymore).
         */
        isLastItemInPage &&
          currentPage &&
          this.props.setQueryParam('page')((currentPage - 1).toString());
      },
    });
  };

  handleRetrieveShopItemUsedInCombo = (id: number) =>
    this.props.retrieveShopItemUsedInCombo(id);

  /**
   * Computes if the current shop item has been created from the master account
   * If it is the case and
   * @returns {boolean}
   */
  isSupplierPriceHidden = () => {
    const isShopItemCreatedFromFranchise =
      !!this.props.shopItem?.shop_item_template;
    return (
      isShopItemCreatedFromFranchise &&
      this.props.franchisor?.hide_shop_supplier_price_for_franchisees
    );
  };

  /**
   * Transform the color/size query params into an array of selector options
   * to set selector options on page render (if any query params)
   */
  getVariantFilterOptionValues = () => {
    const colors: SelectOption[] = (this.props.queryParams.color ?? '')
      .split(',')
      .map((value) => ({ label: value, value }))
      .filter((option) => !!option.value);
    const sizes: SelectOption[] = (this.props.queryParams.size ?? '')
      .split(',')
      .map((value) => ({ label: value, value }))
      .filter((option) => !!option.value);
    return { colors, sizes };
  };

  render() {
    return (
      <ShopItemDetail
        bookkeepingAccountById={this.props.bookkeepingAccountById}
        bookkeepingAccounts={this.props.bookkeepingAccounts}
        changeInventoryVariantFilter={this.handleChangeInventoryVariantFilters}
        companyId={this.props.theme.company}
        count={this.props.shopItemVariantState.count}
        createShopItemProvision={this.handleCreateShopItemProvision}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemVariants={this.handleCreateShopItemVariants}
        deleteShopItem={this.handleDeleteShopItem}
        deleteShopItemVariant={this.handleDeleteShopItemVariant}
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        isDeleting={this.props.isDeleteLoading}
        isDeletingVariant={this.props.isDeleteVariantLoading}
        isLoading={this.props.isLoading}
        isSupplierPriceHidden={this.isSupplierPriceHidden()}
        isUpdatingVariant={this.props.isUpdateVariantLoading}
        isVariantListLoading={this.props.isVariantListLoading}
        page={this.props.shopItemVariantState.page}
        provincialTaxValue={this.props.theme.provincial_tax_value}
        setQueryParam={this.props.setQueryParam}
        shopItem={this.props.shopItem}
        shopItemSupplierName={
          this.props.getShopItemSupplier(this.props.shopItem?.supplier)?.name
        }
        shopItemVariantFilterOptionList={
          this.props.shopItemVariantFilterOptionList
        }
        shopItemVariantFilterOptionValues={this.getVariantFilterOptionValues()}
        supplierList={this.props.supplierState.suppliers}
        tab={this.props.queryParams.tab}
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
    franchisor: getFranchisor(state),
    theme: getTheme(state),
    isLoading: getShopItemDetailLoading(state),
    isVariantListLoading: getShopItemVariantListLoading(state),
    isDeleteLoading: getShopItemDetailDeleteLoading(state),
    shopItem: getShopItemDetail(state, id),
    shopItemVariantFilterOptionList: getShopItemVariantFilterOptionList(
      state,
      id,
    ),
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
    retrieveFranchise: retrieveFranchiseAction,
  },
);

export default compose<Props, OwnProps>(
  withQueryParams([
    ['tab', 'page', 'color', 'size'],
    'queryParams',
    'setQueryParam',
  ]),
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
