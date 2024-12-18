import React, { PureComponent } from 'react';

import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// --- ACTIONS ---
import {
  fetchShopSupplierList as fetchShopSupplierListAction,
  createShopSupplier as createShopSupplierAction,
  updateShopSupplier as updateShopSupplierAction,
  deleteShopSupplier as deleteShopSupplierAction,
} from '#src/libs/shop/actions/supplier';
import {
  fetchConfiguration as fetchConfigurationAction,
  patchConfiguration as patchConfigurationAction,
  createOrUpdateDeliveryFee as createOrUpdateDeliveryFeeAction,
  disableDeliveryFee as disableDeliveryFeeAction,
  fetchAllDeliveryFee as fetchAllDeliveryFeeAction,
} from '#src/libs/order/actions';
import { fetchBookkeepingAccountList } from '#src/libs/payment/actions';

// --- SELECTORS ---
import {
  getShopSupplierState,
  getShopSupplierListLoading,
} from '#src/libs/shop/selectors';
import {
  getDeliveryFeesActive,
  getOrderConfigurationData,
} from '#src/libs/order/selectors';

// --- COMPONENTS ---
import ShopReworkedSettings from '#src/libs/shop/components/ShopReworkedSettings';

// --- UTILS/HOCS ---
import withTitle from '#src/hocs/with-title.hoc';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

// --- TYPES ---
import type {
  ShopSupplierCreate,
  ShopSupplierUpdate,
  ShopSupplier,
} from '#src/libs/shop/types';
import type { DeliveryFee } from '#src/libs/order/types';
import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';

// --- CONSTANTS ---
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';

type Handlers = {
  fetchBookkeepingAccountList: () => void;
};

type Props = ConnectedProps<typeof connector> & Handlers & WithObjectSearch;

export class ShopReworkedSettingsPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchShopSupplierList();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.handleFetchShopSupplierList();
    this.props.fetchAllDeliveryFee();
    this.props.fetchConfiguration();
  }

  handleChangeSupplierPage = (
    page: number,
    options?: OptionCallback<ShopSupplier[]>,
  ) => {
    this.props.fetchShopSupplierList(page, options);
  };

  handleFetchShopSupplierList = (page?: number) => {
    this.props.fetchShopSupplierList(page ?? this.props.supplierState.page);
  };

  handleCreateSupplier = (
    values: ShopSupplierCreate,
    options?: OptionCallback<ShopSupplier>,
  ) => {
    this.props.createShopSupplier(values, {
      onError: options?.onError,
      onSuccess: (shopSupplier) => {
        this.handleFetchShopSupplierList();
        options?.onSuccess?.(shopSupplier);
      },
    });
  };

  handleUpdateSupplier = (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplier>,
  ) => {
    this.props.updateShopSupplier(values, {
      onError: options?.onError,
      onSuccess: (shopSupplier) => {
        this.handleFetchShopSupplierList();
        options?.onSuccess?.(shopSupplier);
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
      onSuccess: (supplierId) => {
        this.handleFetchShopSupplierList(
          isRemovingLastListItem ? suppliersPage - 1 : suppliersPage,
        );
        options?.onSuccess?.(supplierId);
      },
    });
  };

  handleDisableDeliveryFee = (deliveryFee: DeliveryFee) =>
    this.props.disableDeliveryFee(deliveryFee);

  render() {
    return (
      <ShopReworkedSettings
        changeSupplierPage={this.handleChangeSupplierPage}
        createOrUpdateDeliveryFee={this.props.createOrUpdateDeliveryFee}
        createSupplier={this.handleCreateSupplier}
        deleteSupplier={this.handleDeleteSupplier}
        deliveryConfiguration={this.props.deliveryConfiguration}
        deliveryFees={this.props.deliveryFees}
        disableDeliveryFee={this.handleDisableDeliveryFee}
        isOrderConfigurationLoading={this.props.orderConfigurationLoading}
        isOrderConfigurationUpdateLoading={
          this.props.orderConfigurationUpdateLoading
        }
        isSupplierListLoading={this.props.isSupplierListLoading}
        patchDeliveryFee={this.props.patchConfiguration}
        supplierList={this.props.supplierState.suppliers}
        supplierListCount={this.props.supplierState.count}
        supplierListPage={this.props.supplierState.page}
        updateSupplier={this.handleUpdateSupplier}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    supplierState: getShopSupplierState(state),
    isSupplierListLoading: getShopSupplierListLoading(state),
    deliveryConfiguration: getOrderConfigurationData(state),
    deliveryFees: getDeliveryFeesActive(state),
    orderConfigurationLoading: state.order.configuration.loading,
    orderConfigurationUpdateLoading: state.order.configuration.update.loading,
  }),
  {
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

export default compose<Props, {}>(
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
)(ShopReworkedSettingsPage);
