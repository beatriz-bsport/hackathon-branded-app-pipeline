import React, { PureComponent } from 'react';

import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import omit from 'lodash/omit';

// --- ACTIONS ---
import {
  fetchShopSupplierList as fetchShopSupplierListAction,
  createShopSupplier as createShopSupplierAction,
  updateShopSupplier as updateShopSupplierAction,
  deleteShopSupplier as deleteShopSupplierAction,
} from '#libs/shop/actions/supplier';
import {
  fetchSubshopList as fetchSubshopListAction,
  createSubshop as createSubshopAction,
  updateSubshop as updateSubshopAction,
  deleteSubshop as deleteSubshopAction,
} from '#libs/shop/actions/subshopReworked';
import {
  createShopItem as createShopItemAction,
  fetchShopItemStandaloneList as fetchShopItemStandaloneListAction,
  fetchShopItemBaseList as fetchShopItemBaseListAction,
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAction,
  duplicateShopItem as duplicateShopItemAction,
  deleteShopItem as deleteShopItemAction,
} from '#libs/shop/actions/shopItemReworked';
import {
  fetchConfiguration as fetchConfigurationAction,
  patchConfiguration as patchConfigurationAction,
  createOrUpdateDeliveryFee as createOrUpdateDeliveryFeeAction,
  disableDeliveryFee as disableDeliveryFeeAction,
  fetchAllDeliveryFee as fetchAllDeliveryFeeAction,
} from '#libs/order/actions';
import { fetchBookkeepingAccountList } from '#libs/payment/actions';

// --- SELECTORS ---
import { getTheme } from '#libs/theme/selectors';
import {
  getIsShopItemUsedInCombo,
  getShopItemBaseLoading,
  getShopItemStandaloneLoading,
  getShopSupplierState,
  getShopSupplierListLoading,
  getSubshopList,
  getSubshopLoading,
} from '#libs/shop/selectors';
import {
  getDeliveryFeesActive,
  getOrderConfigurationData,
} from '#libs/order/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';

// --- COMPONENTS ---
import ShopListReworked from '#libs/shop/components/ShopListReworked';

// --- UTILS/HOCS ---
// @ts-expect-error
import { mapFormDataWithObject } from '#pages/form.utils';
import withTitle from '#hocs/with-title.hoc';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#libs/fuzzy-search/components/ObjectSearch.hoc';

// --- TYPES ---
import type {
  ShopItem,
  ShopItemCreate,
  ShopSupplierCreate,
  ShopSupplierUpdate,
  ShopSupplier,
  SubShop,
} from '#libs/shop/types';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { DeliveryFee } from '#libs/order/types';

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';
import {
  ShopListTab,
  SEARCH_BAR_PAGE_ADDITIONAL_PARAMS,
} from '#libs/shop/components/ShopListTabs/constants';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

type OwnProps = {};

type Handlers = {
  fetchBookkeepingAccountList: () => void;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  Handlers &
  WithObjectSearch;

export class ShopListReworkedPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchSubshopList();
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopItemBaseList();
    this.props.fetchShopSupplierList();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.handleFetchShopSupplierList();
  }

  /** Handler to retrieve standalone + base shop items */
  handleFetchStandaloneBaseItemList = () => {
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopItemBaseList();
  };

  handleChangeTab = (tab: ShopListTab, isSameTabAsSelected?: boolean) => {
    if (isSameTabAsSelected) return;
    switch (tab) {
      case ShopListTab.PRODUCTS:
        this.handleFetchStandaloneBaseItemList();
        this.props.fetchSubshopList();
        this.handleFetchShopSupplierList();
        break;
      case ShopListTab.SETTINGS:
        this.handleFetchShopSupplierList();
        this.props.fetchAllDeliveryFee();
        this.props.fetchConfiguration();
        break;
      default:
    }
  };

  handleChangeSupplierPage = (
    page: number,
    options: OptionCallback<ShopSupplier[]>,
  ) => {
    this.props.fetchShopSupplierList(page, options);
  };

  handleFetchShopSupplierList = (page?: number) => {
    this.props.fetchShopSupplierList(page ?? this.props.supplierState.page);
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
      onSuccess: () => {
        this.handleFetchStandaloneBaseItemList();
        options?.onSuccess?.();
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
      onSuccess: () => {
        this.handleFetchStandaloneBaseItemList();
        this.props.refreshOptions(
          'shop_item',
          SEARCH_BAR_PAGE_ADDITIONAL_PARAMS,
        );
        options?.onSuccess?.();
      },
    });
  };

  handleCreateSupplier = (
    values: ShopSupplierCreate,
    options?: OptionCallback<ShopSupplier>,
  ) => {
    this.props.createShopSupplier(values, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierList();
        options?.onSuccess?.();
      },
    });
  };

  handleUpdateSupplier = (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplier>,
  ) => {
    this.props.updateShopSupplier(values, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierList();
        options?.onSuccess?.();
      },
    });
  };

  handleDeleteSupplier = (id: number, options?: OptionCallback<number>) => {
    const suppliersPage = this.props.supplierState.page;
    const isRemovingLastListItem =
      (this.props.supplierState.suppliers ?? []).length === 1 &&
      suppliersPage > 1;

    this.props.deleteShopSupplier(id, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierList(
          isRemovingLastListItem ? suppliersPage - 1 : suppliersPage,
        );
        options?.onSuccess?.();
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

  handleDisableDeliveryFee = (deliveryFee: DeliveryFee) =>
    this.props.disableDeliveryFee(deliveryFee);

  render() {
    return (
      <ShopListReworked
        bookkeepingAccountById={this.props.bookkeepingAccountByid}
        bookkeepingAccounts={this.props.bookkeepingAccounts}
        changeSupplierPage={this.handleChangeSupplierPage}
        createOrUpdateDeliveryFee={this.props.createOrUpdateDeliveryFee}
        createShopItem={this.handleCreateShopItem}
        createSubshop={this.props.createSubshop}
        createSupplier={this.handleCreateSupplier}
        deleteShopItem={this.handleDeleteShopItem}
        deleteSubshop={this.handleDeleteSubshop}
        deleteSupplier={this.handleDeleteSupplier}
        deliveryConfiguration={this.props.deliveryConfiguration}
        deliveryFees={this.props.deliveryFees}
        disableDeliveryFee={this.handleDisableDeliveryFee}
        duplicateShopItem={this.handleDuplicateShopItem}
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        goToShopItem={this.props.goToShopItem}
        handleChangeTab={this.handleChangeTab}
        isLoading={
          this.props.subshopLoading ||
          this.props.shopItemStandaloneLoading ||
          this.props.shopItemBaseLoading ||
          this.props.isSupplierListLoading
        }
        isOrderConfigurationLoading={this.props.orderConfigurationLoading}
        isOrderConfigurationUpdateLoading={
          this.props.orderConfigurationUpdateLoading
        }
        patchDeliveryFee={this.props.patchConfiguration}
        provincialTax={this.props.theme.provincial_tax_value}
        retrieveShopItemUsedInCombo={this.handleRetrieveShopItemUsedInCombo}
        subshopList={this.props.subshopList}
        supplierList={this.props.supplierState.suppliers}
        supplierListCount={this.props.supplierState.count}
        supplierListPage={this.props.supplierState.page}
        updateSubshop={this.handleUpdateSubshop}
        updateSupplier={this.handleUpdateSupplier}
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
    deliveryConfiguration: getOrderConfigurationData(state),
    deliveryFees: getDeliveryFeesActive(state),
    orderConfigurationLoading: state.order.configuration.loading,
    orderConfigurationUpdateLoading: state.order.configuration.update.loading,
    getIsShopItemUsedInCombo: (id: number) =>
      getIsShopItemUsedInCombo(state, id),
    bookkeepingAccounts: getBookkeepingAccountList(state),
    bookkeepingAccountByid: getBookkeepingAccountById(state),
  }),
  {
    // SHOP ITEM
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
    fetchShopItemBaseList: fetchShopItemBaseListAction,
    retrieveShopItemUsedInCombo: retrieveShopItemUsedInComboAction,
    createShopItem: createShopItemAction,
    deleteShopItem: deleteShopItemAction,
    duplicateShopItem: duplicateShopItemAction,
    goToShopItem: (id: number) => push(`/shop/${id}`),
    // SUBSHOP
    fetchSubshopList: fetchSubshopListAction,
    createSubshop: createSubshopAction,
    updateSubshop: updateSubshopAction,
    deleteSubshop: deleteSubshopAction,
    // SUPPLIER
    fetchShopSupplierList: fetchShopSupplierListAction,
    createShopSupplier: createShopSupplierAction,
    updateShopSupplier: updateShopSupplierAction,
    deleteShopSupplier: deleteShopSupplierAction,
    // ORDER CONFIGURATION
    fetchConfiguration: fetchConfigurationAction,
    patchConfiguration: patchConfigurationAction,
    fetchAllDeliveryFee: fetchAllDeliveryFeeAction,
    createOrUpdateDeliveryFee: createOrUpdateDeliveryFeeAction,
    disableDeliveryFee: disableDeliveryFeeAction,
    // BOOKKEEPING ACCOUNT
    fetchBookkeepingAccountListAction: fetchBookkeepingAccountList,
  },
);

export default compose<Props, OwnProps>(
  withTranslation('titles'),
  connector,
  withObjectSearch,
  withHandlers({
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountListAction }) =>
      () =>
        fetchBookkeepingAccountListAction({ is_active: true }),
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:shop')),
)(ShopListReworkedPage);
