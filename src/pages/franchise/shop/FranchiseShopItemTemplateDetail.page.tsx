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
  fetchShopItemTemplateInstanceList as fetchShopItemTemplateInstanceListAction,
  createShopItemTemplateVariants as createShopItemTemplateVariantsAction,
} from '#src/libs/shop/actions/shopItemReworked';

import { fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAction } from '#src/libs/shop/actions/supplier';

import { getTheme } from '#src/libs/theme/selectors';
import {
  getShopItemTemplateDeleteLoading,
  getShopItemTemplateDetail,
  getShopItemTemplateDetailLoading,
  getShopItemTemplateSupplier,
  getShopItemTemplateVariantDeleteLoading,
  getShopItemTemplateVariantFilterOptionList,
  getShopItemTemplateVariantListLoading,
  getShopItemTemplateVariantState,
  getShopItemTemplateInstanceState,
  getShopItemTemplateVariantUpdateLoading,
  getShopSupplierTemplateState,
} from '#src/libs/shop/selectors';

import FranchiseShopItemTemplateDetail from '#src/libs/franchise/components/FranchiseShopItemTemplateDetail.component';

// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withTitle from '#src/hocs/with-title.hoc';
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
} from '#src/libs/shop/types';

import type { SelectOption } from '#src/libs/types';

import { SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER } from '#src/libs/shop/constants';

type OwnProps = {
  id: number;
  queryParams: {
    tab?: string;
    variantspage?: string;
    inventorypage?: string;
    color?: string;
    size?: string;
    company?: string;
  };
  setQueryParam: (queryParam: string) => (value: string) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export class FranchiseShopItemTemplateDetailPage extends Component<Props> {
  componentDidMount() {
    this.retrieveShopItemTemplateDetails({
      onSuccess: () => {
        this.fetchShopItemTemplateInstanceList();
      },
    });
    this.handleFetchShopSupplierTemplateList();
    this.fetchShopItemTemplateVariantList();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.queryParams.inventorypage !==
      this.props.queryParams.inventorypage
    ) {
      this.fetchShopItemTemplateInstanceList();
    }
    if (
      prevProps.queryParams.variantspage !== this.props.queryParams.variantspage
    ) {
      this.fetchShopItemTemplateVariantList();
    }
  }

  handleFetchShopSupplierTemplateList = (page?: number) => {
    this.props.fetchShopSupplierTemplateList({
      page: page ?? 1,
    });
  };

  retrieveShopItemTemplateDetails = (
    options?: OptionCallback<ShopItemTemplate>,
  ) => {
    this.props.retrieveShopItemTemplate(this.props.id, options);
  };

  fetchShopItemTemplateVariantList = () => {
    const page =
      parseInt(this.props.queryParams?.variantspage, 10) ||
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
          this.fetchShopItemTemplateInstanceList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  fetchShopItemTemplateInstanceList = () => {
    const page =
      parseInt(this.props.queryParams?.inventorypage, 10) ||
      this.props.shopItemTemplateVariantState.page ||
      1;
    const colorFilter = this.props.queryParams?.color?.split(',');
    const sizeFilter = this.props.queryParams?.size?.split(',');
    const companyIdsFilter = this.props.queryParams?.company?.split(',');

    !!this.props.shopItemTemplate &&
      this.props.fetchShopItemTemplateInstanceList({
        id: this.props.id,
        page,
        colors: colorFilter,
        sizes: sizeFilter,
        company: companyIdsFilter,

        ...(this.props.shopItemTemplate?.number_of_variants > 0
          ? {
              is_variant: true,
            }
          : {}),
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
        this.fetchShopItemTemplateInstanceList();
      },
    });
  };

  handleChangeInventoryVariantFilters =
    (type: 'colors' | 'sizes' | 'company') => (options: SelectOption[]) => {
      const availableOptions = options.map((option) => option.value).join(',');
      type === 'colors' && this.props.setQueryParam('color')(availableOptions);
      type === 'sizes' && this.props.setQueryParam('size')(availableOptions);
      type === 'company' &&
        this.props.setQueryParam('company')(availableOptions);
    };

  handleCreateShopItemProvision = (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) =>
    this.props.createShopItemProvision(data, {
      onSuccess: () => {
        this.fetchShopItemTemplateInstanceList();
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
        this.fetchShopItemTemplateInstanceList();
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
  };

  /**
   * Transform the color/size/compeny query params into an array of selector options
   * to set selector options on page render (if any query params)
   */
  getVariantFilterOptionValues = () => {
    const shopItemTemplateSyncCompanies =
      this.props.shopItemTemplate?.synced_companies ?? [];

    const colors: SelectOption[] = (this.props.queryParams.color ?? '')
      .split(',')
      .map((value) => ({ label: value, value }))
      .filter((option) => !!option.value);
    const sizes: SelectOption[] = (this.props.queryParams.size ?? '')
      .split(',')
      .map((value) => ({ label: value, value }))
      .filter((option) => !!option.value);
    const company: SelectOption[] = (this.props.queryParams.company ?? '')
      .split(',')
      .map((value) => ({
        label:
          shopItemTemplateSyncCompanies.find(
            (companyItem) => companyItem.id === parseInt(value, 10),
          )?.name ?? value,
        value,
      }))
      .filter((option) => !!option.value);
    return { colors, sizes, company };
  };

  render() {
    return (
      <FranchiseShopItemTemplateDetail
        changeInventoryVariantFilter={this.handleChangeInventoryVariantFilters}
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
        provincialTaxValue={this.props.theme.provincial_tax_value}
        setQueryParam={this.props.setQueryParam}
        shopItemTemplate={this.props.shopItemTemplate}
        shopItemTemplateInstanceCount={
          this.props.shopItemTemplateInstanceState.count
        }
        shopItemTemplateInstanceList={
          this.props.shopItemTemplateInstanceState.items ?? []
        }
        shopItemTemplateInstancePage={
          this.props.shopItemTemplateInstanceState.page
        }
        shopItemTemplateSupplierName={
          this.props.getShopItemTemplateSupplier(
            this.props.shopItemTemplate?.supplier_template,
          )?.name
        }
        shopItemTemplateVariantCount={
          this.props.shopItemTemplateVariantState.count
        }
        shopItemTemplateVariantPage={
          this.props.shopItemTemplateVariantState.page
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
    shopItemTemplateInstanceState: getShopItemTemplateInstanceState(state, id),
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
    fetchShopItemTemplateInstanceList: fetchShopItemTemplateInstanceListAction,
    updateShopItemTemplateVariantBulk: updateShopItemTemplateVariantBulkAction,
    createShopItemTemplateVariants: createShopItemTemplateVariantsAction,
    backToShopPage: () => push('/f/shop'),
  },
);

export default compose<Props, OwnProps>(
  withQueryParams([
    ['tab', 'variantspage', 'inventorypage', 'color', 'size', 'company'],
    'queryParams',
    'setQueryParam',
  ]),
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withTitle(({ shopItemTemplate }: { shopItemTemplate: ShopItemTemplate }) =>
    shopItemTemplate ? shopItemTemplate.name : '',
  ),
)(FranchiseShopItemTemplateDetailPage);
