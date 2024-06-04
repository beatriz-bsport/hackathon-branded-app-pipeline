import React, { PureComponent } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import omit from 'lodash/omit';

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

import { updateFranchiseTheme as updateFranchiseThemeAction } from '#libs/franchise/actions';

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
import {
  getFranchiseCompanies,
  getFranchiseCompanyById,
  getFranchiseId,
  getFranchiseIsLoading,
  getFranchisor,
} from '#src/libs/franchise/selectors';

import FranchiseShopList from '#libs/franchise/components/FranchiseShopList.component';

// @ts-expect-error
import { mapFormDataWithObject } from '#pages/form.utils';
import { objectToFormData } from '#libs/utils';

import type { RootState } from '#src/reducers';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type {
  ShopItemCreate,
  ShopItemTemplate,
  ShopSupplierTemplate,
  ShopSupplierTemplateCreate,
  ShopSupplierUpdate,
  SubshopTemplate,
} from '#libs/shop/types';
import type { SelectOption } from '#libs/types';
import type { FranchiseCompany } from '#libs/franchise/types';

import { SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';

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
      { ...values, franchisor: this.props.franchisorId },
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
    this.props.updateSubshopTemplate(values, {
      onSuccess: () => {
        this.props.fetchSubshopTemplateList();
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
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

  handleCreateShopItemTemplate = (
    formValues: ShopItemCreate,
    subshopTemplateId: number,
    options?: OptionCallback,
  ) => {
    const shopItemTemplateFormValues = {
      ...omit(formValues, ['subshop', 'supplier']),
      supplier_template: formValues.supplier,
    };

    const formData = mapFormDataWithObject(
      omit(shopItemTemplateFormValues, ['cover']),
      SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    formData.append('sub_shop_template', subshopTemplateId.toString());
    if (formValues.cover) formData.append('cover', formValues.cover);

    this.props.createShopItemTemplate(formData, {
      ...options,
      onSuccess: () => {
        this.handleFetchShopItemTemplateList(subshopTemplateId);
        options?.onSuccess?.();
      },
    });
  };

  handleDeleteShopItemTemplate = (
    id: number,
    subshopTemplateId: number,
    options?: OptionCallback<number>,
  ) => {
    const shopItemTemplatePage =
      this.props.getShopItemTemplateState(subshopTemplateId)?.page ?? 1;
    const isRemovingLastListItem =
      (this.props.getShopItemTemplateState(subshopTemplateId)?.results ?? [])
        .length === 1 && shopItemTemplatePage > 1;

    this.props.deleteShopItemTemplate(id, {
      ...options,
      onSuccess: () => {
        this.handleFetchShopItemTemplateList(
          subshopTemplateId,
          isRemovingLastListItem
            ? shopItemTemplatePage - 1
            : shopItemTemplatePage,
        );
        options?.onSuccess?.(id);
      },
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

  getFranchiseCompanyListOptions: () => SelectOption[] = () =>
    // @ts-expect-error bad typing on legacy selector
    (this.props.franchisorCompanyList.asMutable() ?? []).map(
      (company: FranchiseCompany) => ({
        label: company.name,
        value: company.id,
      }),
    );

  handleChangeHideShopSupplierPrice = (
    _: React.ChangeEvent<HTMLInputElement>,
    hideShopSupplierPriceForFranchisees: boolean,
  ) => {
    const formData = objectToFormData({ hideShopSupplierPriceForFranchisees });

    this.props.franchisorId &&
      this.props.updateFranchiseTheme(this.props.franchisorId, formData);
  };

  render() {
    return (
      <FranchiseShopList
        changeHideShopSupplierPrice={this.handleChangeHideShopSupplierPrice}
        changeSupplierTemplatePage={this.handleChangeSupplierTemplatePage}
        createShopItemTemplate={this.handleCreateShopItemTemplate}
        createSubshopTemplate={this.handleCreateSubshopTemplate}
        createSupplierTemplate={this.handleCreateSupplierTemplate}
        deleteShopItemTemplate={this.handleDeleteShopItemTemplate}
        deleteSubshopTemplate={this.handleDeleteSubshopTemplate}
        deleteSupplierTemplate={this.handleDeleteSupplierTemplate}
        fetchShopItemTemplateList={this.handleFetchShopItemTemplateList}
        franchiseCompanyListOptions={this.getFranchiseCompanyListOptions()}
        getShopItemTemplateState={this.props.getShopItemTemplateState}
        goToShopItemTemplate={this.props.goToShopItemTemplate}
        isFranchiseeSupplierPriceHidden={
          this.props.franchisor?.hide_shop_supplier_price_for_franchisees
        }
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
    franchisorCompanyList: getFranchiseCompanies(state),
    franchisorCompanyListById: getFranchiseCompanyById(state),
    franchisorId: getFranchiseId(state),
    isFranchiseLoading: getFranchiseIsLoading(state),
    franchisor: getFranchisor(state),
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
    updateFranchiseTheme: updateFranchiseThemeAction,
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
