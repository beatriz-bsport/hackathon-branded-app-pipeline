import React, { PureComponent } from 'react';

import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
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
  retrieveShopItemUsedInCombo as retrieveShopItemUsedInComboAction,
  duplicateShopItem as duplicateShopItemAction,
  deleteShopItem as deleteShopItemAction,
} from '#libs/shop/actions/shopItemReworked';

// --- SELECTORS ---
import { getTheme } from '#libs/theme/selectors';
import {
  getIsShopItemUsedInCombo,
  getShopItemStandaloneList,
  getShopItemStandaloneLoading,
  getShopSupplierList,
  getShopSupplierListLoading,
  getSubshopList,
  getSubshopLoading,
} from '#libs/shop/selectors';

// --- COMPONENTS ---
import ShopListReworked from '#libs/shop/components/ShopListReworked';

// --- UTILS/HOCS ---
// @ts-expect-error
import { mapFormDataWithObject } from '#pages/form.utils';
import withTitle from '#hocs/with-title.hoc';

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

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';
import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';

type OwnProps = {};

type Props = OwnProps & ConnectedProps<typeof connector>;

export class ShopListReworkedPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchSubshopList();
    this.props.fetchShopItemStandaloneList();
    this.props.fetchShopSupplierList();
  }

  handleChangeTab = (tab: ShopListTab, isSameTabAsSelected?: boolean) => {
    if (isSameTabAsSelected) return;
    switch (tab) {
      case ShopListTab.PRODUCTS:
        this.props.fetchSubshopList();
        this.props.fetchShopItemStandaloneList();
        this.props.fetchShopSupplierList();
        break;
      case ShopListTab.SETTINGS:
        this.props.fetchShopSupplierList();
        break;
      default:
    }
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
        this.props.fetchShopItemStandaloneList();
        options?.onSuccess?.();
      },
    });
  };

  handleDuplicateShopItem = (id: number, suffix: string) => {
    this.props.duplicateShopItem(id, suffix, {
      onSuccess: () => {
        this.props.fetchShopItemStandaloneList();
      },
    });
  };

  handleDeleteShopItem = (id: number, options?: OptionCallback<number>) => {
    this.props.deleteShopItem(id, {
      onSuccess: () => {
        this.props.fetchShopItemStandaloneList();
        options?.onSuccess?.();
      },
    });
  };

  handleCreateSupplier = (
    values: ShopSupplierCreate,
    options?: OptionCallback<ShopSupplier>,
  ) => {
    this.props.createShopSupplier(values, options);
  };

  handleUpdateSupplier = (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplier>,
  ) => this.props.updateShopSupplier(values, options);

  handleDeleteSupplier = (id: number, options: OptionCallback<number>) =>
    this.props.deleteShopSupplier(id, options);

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

  render() {
    return (
      <ShopListReworked
        createShopItem={this.handleCreateShopItem}
        createSubshop={this.props.createSubshop}
        createSupplier={this.handleCreateSupplier}
        deleteShopItem={this.handleDeleteShopItem}
        deleteSubshop={this.handleDeleteSubshop}
        deleteSupplier={this.handleDeleteSupplier}
        duplicateShopItem={this.handleDuplicateShopItem}
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        goToShopItem={this.props.goToShopItem}
        handleChangeTab={this.handleChangeTab}
        isLoading={
          this.props.subshopLoading ||
          this.props.shopItemStandaloneLoading ||
          this.props.isSupplierListLoading
        }
        provincialTax={this.props.theme.provincial_tax_value}
        retrieveShopItemUsedInCombo={this.handleRetrieveShopItemUsedInCombo}
        subshopList={this.props.subshopList}
        supplierList={this.props.supplierList}
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
    supplierList: getShopSupplierList(state),
    isSupplierListLoading: getShopSupplierListLoading(state),
    shopItemStandaloneList: getShopItemStandaloneList(state),
    shopItemStandaloneLoading: getShopItemStandaloneLoading(state),
    getIsShopItemUsedInCombo: (id: number) =>
      getIsShopItemUsedInCombo(state, id),
  }),
  {
    // SHOP ITEM
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
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
  },
);

export default compose<Props, OwnProps>(
  withTranslation('titles'),
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:shop')),
)(ShopListReworkedPage);
