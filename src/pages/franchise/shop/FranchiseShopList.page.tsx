import React, { PureComponent } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'connected-react-router';

import {
  fetchSubshopTemplateList as fetchSubshopTemplateListAction,
  createSubshopTemplate as createSubshopTemplateAction,
  updateSubshopTemplate as updateSubshopTemplateAction,
  deleteSubshopTemplate as deleteSubshopTemplateAction,
} from '#libs/shop/actions/subshopReworked';

import {
  fetchShopItemTemplateList as fetchShopItemTemplateListAction,
  createShopItemTemplate as createShopItemTemplateAction,
  updateShopItemTemplate as updateShopItemTemplateAction,
  deleteShopItemTemplate as deleteShopItemTemplateAction,
} from '#libs/shop/actions/shopItemReworked';

import {
  fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAction,
  createShopSupplierTemplate as createShopSupplierTemplateAction,
  updateShopSupplierTemplate as updateShopSupplierTemplateAction,
  deleteShopSupplierTemplate as deleteShopSupplierTemplateAction,
} from '#libs/shop/actions/supplier';

import {
  // subshop template selectors
  getSubshopTemplateList,
  getSubshopTemplateLoading,
  getSubshopTemplateCreateLoading,
  getSubshopTemplateUpdateLoading,
  getSubshopTemplateDeleteLoading,
  // shop item template selectors
  getShopItemTemplateState,
  getShopItemTemplateCreateLoading,
  getShopItemTemplateUpdateLoading,
  getShopItemTemplateDeleteLoading,
  // shop supplier template selectors
  getShopSupplierTemplateState,
  getShopSupplierTemplateListLoading,
  getShopSupplierTemplateCreateLoading,
  getShopSupplierTemplateUpdateLoading,
  getShopSupplierTemplateDeleteLoading,
} from '#libs/shop/selectors';

import FranchiseShopList from '#src/libs/franchise/components/FranchiseShopList.component';

import type { RootState } from '#src/reducers';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#src/libs/shop/components/ShopListSubshopForm/types';
import type {
  ShopItemTemplate,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopSupplierUpdate,
  SubshopTemplate,
} from '#src/libs/shop/types';

type Props = ConnectedProps<typeof connector>;

export class FranchiseShopListPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchSubshopTemplateList();
    this.handleFetchShopSupplierTemplateList();
  }

  handleCreateSubshopTemplate = (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => {
    this.props.createSubshopTemplate(
      /*
       * TEMP - company_ids param will not be required anymore in the future
       * @see https://bsporttest.atlassian.net/browse/BS-3909
       */
      { ...values, company_ids: [1], franchisor: this.props.franchisorId },
      {
        onSuccess: () => {
          this.props.fetchSubshopTemplateList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    );
  };

  handleUpdateSubshopTemplate = (
    values: ShopListSubshopFormValues,
    options: OptionCallback<SubshopTemplate>,
  ) => {
    this.props.updateSubshopTemplate(
      /*
       * TEMP - company_ids param will not be required anymore in the future
       * @see https://bsporttest.atlassian.net/browse/BS-3909
       */
      { ...values, company_ids: [1] },
      {
        onSuccess: () => {
          this.props.fetchSubshopTemplateList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    );
  };

  handleDeleteSubshopTemplate = (
    id: number,
    options?: OptionCallback<number>,
  ) => {
    this.props.deleteSubshopTemplate(id, {
      onSuccess: () => {
        this.props.fetchSubshopTemplateList();
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
  };

  handleFetchShopItemTemplateList = (
    subshopTemplateId: number,
    page?: number,
    options?: OptionCallback<PaginatedResponse<ShopItemTemplate>>,
  ) => {
    this.props.fetchShopItemTemplateList(
      { sub_shop_template: subshopTemplateId, page },
      options,
    );
  };

  handleFetchShopSupplierTemplateList = (page?: number) => {
    this.props.fetchShopSupplierTemplateList({
      page: page ?? this.props.shopSupplierTemplateState.page,
    });
  };

  handleChangeSupplierTemplatePage = (page: number) =>
    this.handleFetchShopSupplierTemplateList(page);

  handleCreateSupplierTemplate = (
    values: ShopSupplierTemplateCreate,
    options?: OptionCallback<ShopSupplierTemplate>,
  ) => {
    this.props.createShopSupplierTemplate(values, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierTemplateList();
        options?.onSuccess?.();
      },
    });
  };

  handleUpdateSupplierTemplate = (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplierTemplate>,
  ) => {
    this.props.updateShopSupplierTemplate(values, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierTemplateList();
        options?.onSuccess?.();
      },
    });
  };

  handleDeleteSupplierTemplate = (
    id: number,
    options?: OptionCallback<number>,
  ) => {
    const suppliersPage = this.props.shopSupplierTemplateState.page;
    const isRemovingLastListItem =
      (this.props.shopSupplierTemplateState.suppliers ?? []).length === 1 &&
      suppliersPage > 1;

    this.props.deleteShopSupplierTemplate(id, {
      onError: options?.onError,
      onSuccess: () => {
        this.handleFetchShopSupplierTemplateList(
          isRemovingLastListItem ? suppliersPage - 1 : suppliersPage,
        );
        options?.onSuccess?.();
      },
    });
  };

  render() {
    return (
      <FranchiseShopList
        changeSupplierTemplatePage={this.handleChangeSupplierTemplatePage}
        createSubshopTemplate={this.handleCreateSubshopTemplate}
        createSupplierTemplate={this.handleCreateSupplierTemplate}
        deleteSubshopTemplate={this.handleDeleteSubshopTemplate}
        deleteSupplierTemplate={this.handleDeleteSupplierTemplate}
        fetchShopItemTemplateList={this.handleFetchShopItemTemplateList}
        getShopItemTemplateState={this.props.getShopItemTemplateState}
        subshopTemplateList={this.props.subshopTemplateList}
        supplierTemplateList={
          this.props.shopSupplierTemplateState.suppliers ?? []
        }
        supplierTemplateListCount={
          this.props.shopSupplierTemplateState.count ?? 0
        }
        supplierTemplateListPage={
          this.props.shopSupplierTemplateState.page ?? 1
        }
        updateSubshopTemplate={this.handleUpdateSubshopTemplate}
        updateSupplierTemplate={this.handleUpdateSupplierTemplate}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    franchisorId: state.franchise.franchisor.id,
    // subshop template selectors
    subshopTemplateList: getSubshopTemplateList(state),
    isSubshopTemplateLoading: getSubshopTemplateLoading(state),
    iSubshopTemplateCreateLoading: getSubshopTemplateCreateLoading(state),
    iSubshopTemplateUpdateLoading: getSubshopTemplateUpdateLoading(state),
    iSubshopTemplateDeleteLoading: getSubshopTemplateDeleteLoading(state),
    // shop item template selectors
    getShopItemTemplateState: (subshopTemplateId: number) =>
      getShopItemTemplateState(state, subshopTemplateId),
    isShopItemTemplateCreateLoading: getShopItemTemplateCreateLoading(state),
    isShopItemTemplateUpdateLoading: getShopItemTemplateUpdateLoading(state),
    isShopItemTemplateDeleteLoading: getShopItemTemplateDeleteLoading(state),
    // shop supplier template selectors
    shopSupplierTemplateState: getShopSupplierTemplateState(state),
    isShopSupplierTemplateListLoading:
      getShopSupplierTemplateListLoading(state),
    isShopSupplierTemplateCreateLoading:
      getShopSupplierTemplateCreateLoading(state),
    isShopSupplierTemplateUpdateLoading:
      getShopSupplierTemplateUpdateLoading(state),
    isShopSupplierTemplateDeleteLoading:
      getShopSupplierTemplateDeleteLoading(state),
  }),
  {
    goToShopItemTemplate: (id: number) => push(`/f/shop/${id}`),
    // subshop template actions
    fetchSubshopTemplateList: fetchSubshopTemplateListAction,
    createSubshopTemplate: createSubshopTemplateAction,
    updateSubshopTemplate: updateSubshopTemplateAction,
    deleteSubshopTemplate: deleteSubshopTemplateAction,
    // shop item template actions
    fetchShopItemTemplateList: fetchShopItemTemplateListAction,
    createShopItemTemplate: createShopItemTemplateAction,
    updateShopItemTemplate: updateShopItemTemplateAction,
    deleteShopItemTemplate: deleteShopItemTemplateAction,
    // shop supplier template actions
    fetchShopSupplierTemplateList: fetchShopSupplierTemplateListAction,
    createShopSupplierTemplate: createShopSupplierTemplateAction,
    updateShopSupplierTemplate: updateShopSupplierTemplateAction,
    deleteShopSupplierTemplate: deleteShopSupplierTemplateAction,
  },
);

export default compose<Props, {}>(connector)(FranchiseShopListPage);
