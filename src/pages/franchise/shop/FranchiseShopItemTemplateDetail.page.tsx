import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';
import omit from 'lodash/omit';

import {
  retrieveShopItemTemplate as retrieveShopItemTemplateAction,
  retrieveShopItemBarcodeUnicity as retrieveShopItemBarcodeUnicityAction,
  updateShopItemTemplate as updateShopItemTemplateAction,
  deleteShopItemTemplate as deleteShopItemTemplateAction,
  createShopItemProvision as createShopItemProvisionAction,
  createShopItemProvisionBulk as createShopItemProvisionBulkAction,
  updateShopItemTemplateVariantBulk as updateShopItemTemplateVariantBulkAction,
  fetchShopItemTemplateVariantList as fetchShopItemTemplateVariantListAction,
  fetchShopItemTemplateInstanceList as fetchShopItemTemplateInstanceListAction,
  createShopItemTemplateVariants as createShopItemTemplateVariantsAction,
  fetchShopItemTemplateVariantCombinationList as fetchShopItemTemplateVariantCombinationListAction,
} from '#src/libs/shop/actions/shopItemReworked';

import { fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAction } from '#src/libs/shop/actions/supplier';

import { getTheme } from '#src/libs/theme/selectors';
import {
  getShopItemTemplateDeleteLoading,
  getShopItemTemplateDetail,
  getShopItemTemplateDetailLoading,
  getShopItemTemplateSupplier,
  getShopItemTemplateVariantCombinationList,
  getShopItemTemplateVariantDeleteLoading,
  getShopItemTemplateVariantFilterOptionList,
  getShopItemTemplateVariantListLoading,
  getShopItemTemplateVariantState,
  getShopItemTemplateInstanceState,
  getShopItemTemplateVariantUpdateLoading,
  getShopSupplierTemplateState,
  getShopItemBarcodeUnicity,
  getShopItemBarcodeUnicityLoading,
  getShopItemBarcodeListUnicity,
} from '#src/libs/shop/selectors';
import { getFranchiseCompanies } from '#src/libs/franchise/selectors';

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
  ShopItemBarcodeUnicity,
} from '#src/libs/shop/types';

import type { SelectOption } from '#src/libs/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

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
    this.props.fetchShopItemTemplateVariantCombinationList(this.props.id);
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
    /*
      Whenever applying filters, we want to get back to page 1 to prevent
      fetching filtered pages that doesnt exist.
    */
    if (
      prevProps.queryParams.color !== this.props.queryParams.color ||
      prevProps.queryParams.size !== this.props.queryParams.size ||
      prevProps.queryParams.company !== this.props.queryParams.company
    ) {
      this.props.setQueryParam('inventorypage')('1');
      // if we are applying filters but already on page 1
      if (this.props.queryParams.inventorypage === '1') {
        this.fetchShopItemTemplateInstanceList();
      }
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

  retrieveShopItemVariantCombinationListInventory = () => {
    this.retrieveShopItemTemplateDetails({
      onSuccess: () => {
        this.fetchShopItemTemplateInstanceList();
        this.props.fetchShopItemTemplateVariantCombinationList(this.props.id);
      },
    });
  };

  handleCreateShopItemTemplateVariants = (
    baseItemId: number,
    data: ShopItemVariantAttributes,
    options?: OptionCallback,
  ) => {
    /*
      This boolean checks that the shopItemTemplate goes from a standalone item to a base item
      That way, we trigger a refetch of the ShopItemTemplate Details to update the inventory tab
    */
    const isShopItemTemplateMutated =
      !!this.props.shopItemTemplate?.is_standalone_item;
    this.props.createShopItemTemplateVariants({
      id: baseItemId,
      data,
      options: {
        onSuccess: () => {
          this.fetchShopItemTemplateVariantList();
          if (!isShopItemTemplateMutated)
            this.fetchShopItemTemplateInstanceList();
          if (isShopItemTemplateMutated)
            this.retrieveShopItemVariantCombinationListInventory();
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
    const companyIdsFilter = this.props.queryParams?.company
      ?.split(',')
      ?.map((companyId) => parseInt(companyId, 10));

    !!this.props.shopItemTemplate &&
      this.props.fetchShopItemTemplateInstanceList({
        id: this.props.id,
        page,
        colors: colorFilter,
        sizes: sizeFilter,
        company__in: companyIdsFilter,
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

    this.props.updateShopItemTemplate({
      formData,
      id: this.props.id,
      options: {
        onBackgroundSuccess: () => {
          this.retrieveShopItemTemplateDetails();
          options?.onSuccess();
        },
        onBackgroundError: options?.onError,
      },
    });
  };

  handleUpdateShopItemTemplateVariantBulk = (
    lowestVariantPrice: number,
    data: FormData,
    options?: OptionCallback,
  ) => {
    const needToRefetchShopItemDetails =
      lowestVariantPrice !== this.props.shopItemTemplate?.lowest_variant_price;
    this.props.updateShopItemTemplateVariantBulk({
      data,
      id: this.props.id,
      options: {
        onSuccess: () => {
          this.fetchShopItemTemplateVariantList();
          if (needToRefetchShopItemDetails)
            this.retrieveShopItemTemplateDetails();
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
    const currentPage = Number(this.props.queryParams.variantspage);
    const isLastItemInPage =
      (this.props.shopItemTemplateVariantState.variants ?? []).length === 1;

    /*
      This boolean checks that the shopItemTemplate goes from a base item to a standalone item
      That way, we trigger a refetch of the ShopItemTemplate Details to update the inventory tab
    */
    const isShopItemTemplateMutated =
      isLastItemInPage && (currentPage === 1 || !currentPage);

    this.props.deleteShopItemTemplate(id, {
      onSuccess: () => {
        /**
         * When performing a variant deletion, we want to fetch the previous page
         * if we did delete the last remaining variant in the page. This avoid pagination
         * number issues (e.g refetching a page that doesnt exist anymore).
         */
        if (isLastItemInPage && currentPage > 1) {
          this.props.setQueryParam('variantspage')(`${currentPage - 1}`);
          this.props.setQueryParam('inventorypage')(`${currentPage - 1}`);
        }
        this.fetchShopItemTemplateVariantList();

        if (!isShopItemTemplateMutated)
          this.fetchShopItemTemplateInstanceList();

        if (isShopItemTemplateMutated) {
          this.retrieveShopItemTemplateDetails({
            onSuccess: () => {
              this.fetchShopItemTemplateInstanceList();
            },
          });
        }
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

  getFranchiseCompanyListOptions: () => SelectOption[] = () =>
    // @ts-expect-error bad typing on legacy selector
    (this.props.franchisorCompanyList.asMutable() ?? []).map(
      (company: FranchiseCompany) => ({
        label: company.name,
        value: company.id,
      }),
    );

  /**
   * When entering a shop item barcode, we check first the unicity of it before submit
   * @param barcode The barcode to check
   */
  checkBarcodeUnicity = (
    barcode: string,
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => this.props.retrieveShopItemBarcodeUnicity(barcode, options);

  render() {
    return (
      <FranchiseShopItemTemplateDetail
        changeInventoryVariantFilter={this.handleChangeInventoryVariantFilters}
        checkBarcodeUnicity={this.checkBarcodeUnicity}
        createShopItemProvision={this.handleCreateShopItemProvision}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemTemplateVariants={
          this.handleCreateShopItemTemplateVariants
        }
        deleteShopItemTemplate={this.handleDeleteShopItemTemplate}
        deleteShopItemTemplateVariant={this.handleDeleteShopItemTemplateVariant}
        franchiseCompanyListOptions={this.getFranchiseCompanyListOptions()}
        getShopItemBarcodeListUnicity={this.props.getShopItemBarcodeListUnicity}
        getShopItemBarcodeUnicity={this.props.getShopItemBarcodeUnicity}
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
        variantCombinationList={this.props.variantCombinationList}
        variantList={this.props.shopItemTemplateVariantState.variants ?? []}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    theme: getTheme(state),
    franchisorCompanyList: getFranchiseCompanies(state),
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
    variantCombinationList: getShopItemTemplateVariantCombinationList(
      state,
      id,
    ),
    getShopItemBarcodeListUnicity: (barcodeList: string[]) =>
      getShopItemBarcodeListUnicity(state, barcodeList),
    shopItemBarcodeUnicityLoading: getShopItemBarcodeUnicityLoading(state),
    getShopItemTemplateSupplier: (supplierTemplateId: number) =>
      getShopItemTemplateSupplier(state, supplierTemplateId),
    getShopItemBarcodeUnicity: (barcode: string) =>
      getShopItemBarcodeUnicity(state, barcode),
  }),
  {
    retrieveShopItemTemplate: retrieveShopItemTemplateAction,
    retrieveShopItemBarcodeUnicity: retrieveShopItemBarcodeUnicityAction,
    updateShopItemTemplate: updateShopItemTemplateAction,
    deleteShopItemTemplate: deleteShopItemTemplateAction,
    fetchShopSupplierTemplateList: fetchShopSupplierTemplateListAction,
    createShopItemProvision: createShopItemProvisionAction,
    createShopItemProvisionBulk: createShopItemProvisionBulkAction,
    fetchShopItemTemplateVariantList: fetchShopItemTemplateVariantListAction,
    fetchShopItemTemplateInstanceList: fetchShopItemTemplateInstanceListAction,
    updateShopItemTemplateVariantBulk: updateShopItemTemplateVariantBulkAction,
    createShopItemTemplateVariants: createShopItemTemplateVariantsAction,
    fetchShopItemTemplateVariantCombinationList:
      fetchShopItemTemplateVariantCombinationListAction,
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
