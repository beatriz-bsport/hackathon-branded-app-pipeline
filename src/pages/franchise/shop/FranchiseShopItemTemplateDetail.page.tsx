import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';
import omit from 'lodash/omit';

import {
  retrieveShopItemTemplate as retrieveShopItemTemplateAction,
  updateShopItemTemplate as updateShopItemTemplateAction,
  deleteShopItemTemplate as deleteShopItemTemplateAction,
  createShopItemProvision as createShopItemProvisionAction,
  createShopItemProvisionBulk as createShopItemProvisionBulkAction,
  updateShopItemTemplateVariantBulk as updateShopItemTemplateVariantBulkAction,
  fetchShopItemTemplateVariantList as fetchShopItemTemplateVariantListAction,
  fetchShopItemTemplateVariantInstanceList as fetchShopItemTemplateVariantInstanceListAction,
  createShopItemTemplateVariants as createShopItemTemplateVariantsAction,
} from '#libs/shop/actions/shopItemReworked';

import { fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAction } from '#libs/shop/actions/supplier';

import { getTheme } from '#libs/theme/selectors';
import {
  getShopItemTemplateDeleteLoading,
  getShopItemTemplateDetail,
  getShopItemTemplateDetailLoading,
  getShopItemTemplateSupplier,
  getShopItemTemplateVariantDeleteLoading,
  getShopItemTemplateVariantFilterOptionList,
  getShopItemTemplateVariantListLoading,
  getShopItemTemplateVariantState,
  getShopItemTemplateVariantInstanceState,
  getShopItemTemplateVariantUpdateLoading,
  getShopSupplierTemplateState,
} from '#libs/shop/selectors';

import FranchiseShopItemTemplateDetail from '#libs/franchise/components/FranchiseShopItemTemplateDetail.component';

// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';
// @ts-expect-error
import { mapFormDataWithObject } from '#src/pages/form.utils';

import type { OptionCallback } from '#src/state/types';
import type { RootState } from '#src/reducers';
import type {
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItemEdit,
  ShopItemTemplate,
  ShopItemVariantAttributes,
} from '#libs/shop/types';
import type { SelectOption } from '#src/libs/types';

import { SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER } from '#libs/shop/constants';

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

export class FranchiseShopItemTemplateDetailPage extends Component<Props> {
  componentDidMount() {
    this.retrieveShopItemTemplateDetails();
    this.handleFetchShopSupplierTemplateList();
    this.fetchShopItemTemplateVariantInstanceList();
    this.fetchShopItemTemplateVariantList();
  }

  handleFetchShopSupplierTemplateList = (page?: number) => {
    this.props.fetchShopSupplierTemplateList({
      page: page ?? 1,
    });
  };

  retrieveShopItemTemplateDetails = () => {
    this.props.retrieveShopItemTemplate(this.props.id);
  };

  fetchShopItemTemplateVariantList = () => {
    const page =
      parseInt(this.props.queryParams?.page, 10) ||
      this.props.shopItemTemplateVariantState.page ||
      1;
    this.props.fetchShopItemTemplateVariantList({
      id: this.props.id,
      page,
    });
  };

  handleCreateShopItemTemplateVariants = (
    baseItemId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback,
  ) => {
    this.props.createShopItemTemplateVariants({
      id: baseItemId,
      data,
      options: {
        onSuccess: () => {
          this.fetchShopItemTemplateVariantList();
          this.fetchShopItemTemplateVariantInstanceList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  fetchShopItemTemplateVariantInstanceList = () => {
    const page =
      parseInt(this.props.queryParams?.page, 10) ||
      this.props.shopItemTemplateVariantState.page ||
      1;
    const colorFilter = this.props.queryParams?.color?.split(',');
    const sizeFilter = this.props.queryParams?.size?.split(',');

    this.props.fetchShopItemTemplateVariantInstanceList({
      id: this.props.id,
      page,
      colors: colorFilter,
      sizes: sizeFilter,
    });
  };

  handleUpdateShopItemTemplate = (
    formValues: ShopItemEdit,
    options?: OptionCallback,
  ) => {
    const shopItemTemplateFormValues = {
      ...omit(formValues, ['subshop', 'supplier']),
      supplier_template: formValues.supplier,
      sub_shop_template: formValues.subshop,
    };

    const formData = mapFormDataWithObject(
      shopItemTemplateFormValues,
      SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    if (formValues.cover) formData.append('cover', formValues.cover);
    formData.append('company_ids', 1); // TEMP -> https://bsporttest.atlassian.net/browse/BS-3909

    this.props.updateShopItemTemplate({
      formData,
      id: this.props.id,
      options: {
        onSuccess: () => {
          this.retrieveShopItemTemplateDetails();
          options?.onSuccess();
        },
        onError: options?.onError,
      },
    });
  };

  handleUpdateShopItemTemplateVariantBulk = (
    data: FormData,
    options?: OptionCallback,
  ) => {
    this.props.updateShopItemTemplateVariantBulk({
      data,
      id: this.props.id,
      options: {
        onSuccess: () => {
          this.fetchShopItemTemplateVariantList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  handleDeleteShopItemTemplate = () => {
    this.props.deleteShopItemTemplate(this.props.id, {
      onSuccess: this.props.backToShopPage,
    });
  };

  handleDeleteShopItemTemplateVariant = (id: number) => {
    this.props.deleteShopItemTemplate(id, {
      onSuccess: () => {
        this.fetchShopItemTemplateVariantList();
        this.fetchShopItemTemplateVariantInstanceList();
      },
    });
  };

  handleChangeInventoryVariantFilters =
    (type: 'colors' | 'sizes') => (options: SelectOption[]) => {
      const availableOptions = options.map((option) => option.value).join(',');
      type === 'colors' && this.props.setQueryParam('color')(availableOptions);
      type === 'sizes' && this.props.setQueryParam('size')(availableOptions);
    };

  handleCreateShopItemProvision = (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) =>
    this.props.createShopItemProvision(data, {
      onSuccess: () => {
        this.fetchShopItemTemplateVariantInstanceList();
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
        this.fetchShopItemTemplateVariantInstanceList();
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
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
      <FranchiseShopItemTemplateDetail
        changeInventoryVariantFilter={this.handleChangeInventoryVariantFilters}
        count={this.props.shopSupplierTemplateState.count}
        createShopItemProvision={this.handleCreateShopItemProvision}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemTemplateVariants={
          this.handleCreateShopItemTemplateVariants
        }
        deleteShopItemTemplate={this.handleDeleteShopItemTemplate}
        deleteShopItemTemplateVariant={this.handleDeleteShopItemTemplateVariant}
        isDeleting={this.props.isDeleteLoading}
        isDeletingVariant={this.props.isDeleteVariantLoading}
        isLoading={this.props.isLoading}
        isUpdatingVariant={this.props.isUpdateVariantLoading}
        isVariantListLoading={this.props.isVariantListLoading}
        page={this.props.shopSupplierTemplateState.page}
        provincialTaxValue={this.props.theme.provincial_tax_value}
        setQueryParam={this.props.setQueryParam}
        shopItemTemplate={this.props.shopItemTemplate}
        shopItemTemplateSupplierName={
          this.props.getShopItemTemplateSupplier(
            this.props.shopItemTemplate?.supplier_template,
          )?.name
        }
        shopItemVariantFilterOptionList={
          this.props.shopItemVariantFilterOptionList
        }
        shopItemVariantFilterOptionValues={this.getVariantFilterOptionValues()}
        supplierTemplateList={this.props.shopSupplierTemplateState.suppliers}
        tab={this.props.queryParams.tab}
        updateShopItemTemplate={this.handleUpdateShopItemTemplate}
        updateShopItemTemplateVariantBulk={
          this.handleUpdateShopItemTemplateVariantBulk
        }
        variantInstanceList={
          this.props.shopItemTemplateVariantInstanceState.variants ?? []
        }
        variantList={this.props.shopItemTemplateVariantState.variants ?? []}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    theme: getTheme(state),
    isLoading: getShopItemTemplateDetailLoading(state),
    isDeleteLoading: getShopItemTemplateDeleteLoading(state),
    shopItemTemplate: getShopItemTemplateDetail(state, id),
    shopSupplierTemplateState: getShopSupplierTemplateState(state),
    shopItemTemplateVariantState: getShopItemTemplateVariantState(state, id),
    shopItemTemplateVariantInstanceState:
      getShopItemTemplateVariantInstanceState(state, id),
    isVariantListLoading: getShopItemTemplateVariantListLoading(state),
    isUpdateVariantLoading: getShopItemTemplateVariantUpdateLoading(state),
    isDeleteVariantLoading: getShopItemTemplateVariantDeleteLoading(state),
    shopItemVariantFilterOptionList: getShopItemTemplateVariantFilterOptionList(
      state,
      id,
    ),
    getShopItemTemplateSupplier: (supplierTemplateId: number) =>
      getShopItemTemplateSupplier(state, supplierTemplateId),
  }),
  {
    retrieveShopItemTemplate: retrieveShopItemTemplateAction,
    updateShopItemTemplate: updateShopItemTemplateAction,
    deleteShopItemTemplate: deleteShopItemTemplateAction,
    fetchShopSupplierTemplateList: fetchShopSupplierTemplateListAction,
    createShopItemProvision: createShopItemProvisionAction,
    createShopItemProvisionBulk: createShopItemProvisionBulkAction,
    fetchShopItemTemplateVariantList: fetchShopItemTemplateVariantListAction,
    fetchShopItemTemplateVariantInstanceList:
      fetchShopItemTemplateVariantInstanceListAction,
    updateShopItemTemplateVariantBulk: updateShopItemTemplateVariantBulkAction,
    createShopItemTemplateVariants: createShopItemTemplateVariantsAction,
    backToShopPage: () => push('/f/shop'),
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
  withTitle(({ shopItemTemplate }: { shopItemTemplate: ShopItemTemplate }) =>
    shopItemTemplate ? shopItemTemplate.name : '',
  ),
)(FranchiseShopItemTemplateDetailPage);
