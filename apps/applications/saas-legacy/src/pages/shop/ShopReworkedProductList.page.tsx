import React, { PureComponent } from 'react';

import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { push as pushRouter } from 'connected-react-router';
import omit from 'lodash/omit';

// --- ACTIONS ---
import { fetchShopSupplierList as fetchShopSupplierListAction } from '#src/libs/shop/actions/supplier';
import {
  fetchSubshopList as fetchSubshopListAction,
  createSubshop as createSubshopAction,
  updateSubshop as updateSubshopAction,
  deleteSubshop as deleteSubshopAction,
} from '#src/libs/shop/actions/subshopReworked';
import {
  createShopItem as createShopItemAction,
  fetchShopItemStandaloneList as fetchShopItemStandaloneListAction,
  fetchShopItemBaseList as fetchShopItemBaseListAction,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAction,
  duplicateShopItem as duplicateShopItemAction,
  deleteShopItem as deleteShopItemAction,
  retrieveShopItemBarcodeUnicity as retrieveShopItemBarcodeUnicityAction,
} from '#src/libs/shop/actions/shopItemReworked';
import { fetchBookkeepingAccountList } from '#src/libs/payment/actions';
import { fetchTags as fetchTagsAction } from '#src/libs/tag/actions';
import { fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction } from '#src/libs/establishment/actions';

// --- SELECTORS ---
import { getTheme } from '#src/libs/theme/selectors';
import {
  getIsShopItemUsedInCombo,
  getShopItemBaseLoading,
  getShopItemStandaloneLoading,
  getShopSupplierState,
  getShopSupplierListLoading,
  getSubshopList,
  getSubshopLoading,
  getShopItemBarcodeUnicity,
} from '#src/libs/shop/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';

// --- COMPONENTS ---
import ShopReworkedProductList from '#src/libs/shop/components/ShopReworkedProductList';

// --- UTILS/HOCS ---
// @ts-expect-error
import { mapFormDataWithObject } from '#src/pages/form.utils';
import withTitle from '#src/hocs/with-title.hoc';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

// --- TYPES ---
import type {
  ShopItem,
  ShopItemCreate,
  SubShop,
  ShopItemBarcodeUnicity,
  ShopItemFilterParams,
} from '#src/libs/shop/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';
import type { Dispatch } from 'src/state/types';

// --- CONSTANTS ---

import { FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED } from '#src/libs/shop/components/ShopReworkedProductList/constants';

import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#src/libs/shop/constants';

import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import { buildUrlParams } from '#src/http';
import { getAllEstablishmentBillingGroupIds } from '#src/libs/establishment/selectors';

type Handlers = {
  fetchBookkeepingAccountList: () => void;
  goToShopItem: (
    id: number,
    params?: Pick<ShopItemFilterParams, 'establishment_billing_group'>,
  ) => void;
};

type Props = ConnectedProps<typeof connector> & Handlers & WithObjectSearch;

export class ShopReworkedProductListPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchSubshopList();
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopItemBaseList();
    this.props.fetchShopSupplierList();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.props.fetchTags();
    this.props.fetchAllEstablishmentBillingGroup();
  }

  /** Handler to retrieve standalone + base shop items */
  handleFetchStandaloneBaseItemList = () => {
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopItemBaseList();
  };

  handleCreateShopItem = (
    values: ShopItemCreate,
    subshopId: number,
    options?: OptionCallback<ShopItem>,
  ) => {
    const formData = mapFormDataWithObject(
      omit(values, ['cover']),
      SHOPITEM_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    formData.append('subshop', subshopId.toString());
    if (values.cover) formData.append('cover', values.cover);

    this.props.createShopItem(formData, {
      onSuccess: (shopItem) => {
        this.handleFetchStandaloneBaseItemList();
        options?.onSuccess?.(shopItem);
      },
    });
  };

  handleDuplicateShopItem = (id: number, suffix: string) => {
    this.props.duplicateShopItem(id, suffix, {
      onSuccess: () => {
        this.handleFetchStandaloneBaseItemList();
      },
    });
  };

  handleDeleteShopItem = (id: number, options?: OptionCallback<number>) => {
    this.props.deleteShopItem(id, {
      onSuccess: (shopItemId) => {
        this.handleFetchStandaloneBaseItemList();
        this.props.refreshOptions(
          'shop_item',
          FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED,
        );
        options?.onSuccess?.(shopItemId);
      },
    });
  };

  handleRetrieveShopItemUsedInCombo = (id: number) => {
    this.props.retrieveShopItemUsedInCombo(id);
  };

  handleCreateSubshop = (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => {
    this.props.createSubshop(values, options);
  };

  handleUpdateSubshop = (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubShop>,
  ) => {
    this.props.updateSubshop(values, options);
  };

  handleDeleteSubshop = (id: number, options?: OptionCallback<number>) => {
    this.props.deleteSubshop(id, options);
  };

  /**
   * When entering a shop item barcode, we check first the unicity of it before submit
   * @param barcode The barcode to check
   */
  checkBarcodeUnicity = (
    barcode: string,
    companyIds?: number[],
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => this.props.retrieveShopItemBarcodeUnicity(barcode, companyIds, options);

  render() {
    return (
      <ShopReworkedProductList
        bookkeepingAccountById={this.props.bookkeepingAccountByid}
        bookkeepingAccounts={this.props.bookkeepingAccounts}
        checkBarcodeUnicity={this.checkBarcodeUnicity}
        createShopItem={this.handleCreateShopItem}
        createSubshop={this.props.createSubshop}
        deleteShopItem={this.handleDeleteShopItem}
        deleteSubshop={this.handleDeleteSubshop}
        duplicateShopItem={this.handleDuplicateShopItem}
        establishmentBillingGroup={this.props.establishmentBillingGroup}
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        getShopItemBarcodeUnicity={this.props.getShopItemBarcodeUnicity}
        goToShopItem={this.props.goToShopItem}
        isLoading={
          this.props.subshopLoading ||
          this.props.shopItemStandaloneLoading ||
          this.props.shopItemBaseLoading ||
          this.props.isSupplierListLoading
        }
        isMultiLocationWebshopEnabled={
          !!this.props.theme.is_multi_location_webshop_enabled
        }
        provincialTax={this.props.theme.provincial_tax_value}
        retrieveShopItemUsedInCombo={this.handleRetrieveShopItemUsedInCombo}
        subshopList={this.props.subshopList}
        supplierList={this.props.supplierState.suppliers}
        tagList={this.props.allTagsWithTagGroup}
        updateSubshop={this.handleUpdateSubshop}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    theme: getTheme(state),
    subshopList: getSubshopList(state),
    subshopLoading: getSubshopLoading(state),
    supplierState: getShopSupplierState(state),
    isSupplierListLoading: getShopSupplierListLoading(state),
    shopItemStandaloneLoading: getShopItemStandaloneLoading(state),
    shopItemBaseLoading: getShopItemBaseLoading(state),
    getIsShopItemUsedInCombo: (id: number) =>
      getIsShopItemUsedInCombo(state, id),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountByid: getBookkeepingAccountById(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    getShopItemBarcodeUnicity: (barcode: string) =>
      getShopItemBarcodeUnicity(state, barcode),
    establishmentBillingGroup: getAllEstablishmentBillingGroupIds(state)?.[0],
  }),
  {
    // SHOP ITEM
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
    fetchShopItemBaseList: fetchShopItemBaseListAction,
    retrieveShopItemUsedInCombo: retrieveShopItemUsedInComboAction,
    createShopItem: createShopItemAction,
    deleteShopItem: deleteShopItemAction,
    duplicateShopItem: duplicateShopItemAction,
    retrieveShopItemBarcodeUnicity: retrieveShopItemBarcodeUnicityAction,

    push: (path: string) => (dispatch: Dispatch) => dispatch(pushRouter(path)),
    // SUBSHOP
    fetchSubshopList: fetchSubshopListAction,
    createSubshop: createSubshopAction,
    updateSubshop: updateSubshopAction,
    deleteSubshop: deleteSubshopAction,
    // SUPPLIER
    fetchShopSupplierList: fetchShopSupplierListAction,
    // BOOKKEEPING ACCOUNT
    fetchBookkeepingAccountListAction: fetchBookkeepingAccountList,
    // TAGS
    fetchTags: fetchTagsAction,
    // ESTABLISHMENT BILLING GROUPS
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  },
);

export default compose<Props, {}>(
  withTranslation('titles'),
  connector,
  withObjectSearch,
  withHandlers({
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountListAction }) =>
      () =>
        fetchBookkeepingAccountListAction({ is_active: true }),
    goToShopItem:
      ({ push }) =>
      (
        id: number,
        params?: Pick<ShopItemFilterParams, 'establishment_billing_group'>,
      ) =>
        push(`/shop/products/${id}${buildUrlParams(params)}`),
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:shop')),
)(ShopReworkedProductListPage);
