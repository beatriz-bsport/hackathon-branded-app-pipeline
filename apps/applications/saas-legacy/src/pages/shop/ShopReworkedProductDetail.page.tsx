import React, { Component } from 'react';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';

// --- ACTIONS ---
import {
  retrieveShopItemDetails as retrieveShopItemDetailsAction,
  retrieveShopItemBarcodeUnicity as retrieveShopItemBarcodeUnicityAction,
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
} from '#src/libs/shop/actions/shopItemReworked';
import { fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction } from '#src/libs/establishment/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';

import {
  retrieveShopItemSupplier as retrieveShopItemSupplierAction,
  fetchShopSupplierList as fetchShopSupplierListAction,
} from '#src/libs/shop/actions/supplier';

import { retrieveFranchise as retrieveFranchiseAction } from '#src/libs/franchise/actions';
import { fetchTags as fetchTagsAction } from '#src/libs/tag/actions';
import { snackbarSuccess } from '#src/libs/snackbar/actions';

// --- SELECTORS ---
import { getTheme } from '#src/libs/theme/selectors';
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
  getShopItemBarcodeUnicityLoading,
  getShopItemBarcodeListUnicity,
  getShopItemBarcodeUnicity,
  getEstablishmentBillingGroupFilterOptionList,
} from '#src/libs/shop/selectors';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { getFranchisor } from '#src/libs/franchise/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';

// --- COMPONENTS ---
import ShopItemDetail from '#src/libs/shop/components/ShopItemDetail';

// --- UTILS ---
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

// --- TYPES ---
import type {
  Provision,
  ProvisionBulkCreate,
  ProvisionCreate,
  ShopItem,
  ShopItemBarcodeUnicity,
  ShopItemEdit,
  ShopItemVariantAttributes,
} from '#src/libs/shop/types';
import type { Dispatch } from 'src/state/types';

// --- CONSTANTS ---
import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '#src/libs/shop/constants';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';
import { SelectOption } from '#src/libs/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
// @ts-expect-error
import { mapFormDataWithObject } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';
import { doesBaseItemMutationAffectsVariants } from '#src/libs/shop/utils';

type OwnProps = {
  id: number;
  queryParams: {
    tab?: string;
    page?: string;
    color?: string;
    size?: string;
    establishment_billing_group?: number;
  };
  setQueryParam: (queryParam: string) => (value: string) => void;
  backToShopPage: () => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export class ShopReworkedProductDetailPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllEstablishmentBillingGroup({
      ...(!!this.props.theme?.company && {
        params: { company: this.props.theme.company },
      }),
    });
    this.props.retrieveShopItemUsedInCombo(this.props.id);
    this.props.fetchShopSupplierList();
    this.retrieveShopItemDetails();
    this.props.fetchShopItemVariantCombinationList(this.props.id);
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
    this.props.theme.franchisor &&
      this.props.retrieveFranchise(this.props.theme.franchisor);
    this.props.fetchTags();
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
      prevProps.queryParams.size !== this.props.queryParams.size ||
      (prevProps.queryParams?.establishment_billing_group !==
        this.props.queryParams?.establishment_billing_group &&
        !this.props.shopItem?.is_standalone_item)
    ) {
      this.props.setQueryParam('page')('1');
      // if we are applying filters but already on page 1
      if (this.props.queryParams.page === '1') {
        this.fetchShopItemVariantList();
      }
    }
    /*
      Whenever changing the establishment billing group in case of a standalone item, we want to refetch the
      main ShopItem Details to update the inventory tab with stock of the newly selected establishment billing group.
    */
    if (
      prevProps.queryParams?.establishment_billing_group !==
        this.props.queryParams?.establishment_billing_group &&
      !!this.props.shopItem?.is_standalone_item
    ) {
      this.retrieveShopItemDetails();
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
    this.props.retrieveShopItemDetails(
      this.props.id,
      this.props.queryParams?.establishment_billing_group,
      {
        onSuccess: () => {
          this.fetchShopItemVariantList();
        },
      },
    );
  };

  fetchShopItemVariantList = () => {
    const page =
      parseInt(this.props.queryParams?.page, 10) ||
      this.props.shopItemVariantState.page ||
      1;
    const colorFilter = this.props.queryParams?.color?.split(',');
    const sizeFilter = this.props.queryParams?.size?.split(',');
    const establishmentBillingGroupFilter =
      this.props.queryParams?.establishment_billing_group;

    this.props.fetchShopItemVariantList({
      id: this.props.id,
      page,
      colors: colorFilter,
      sizes: sizeFilter,
      establishment_billing_group: establishmentBillingGroupFilter,
      ...(this.props.shopItem?.number_of_variants > 0
        ? {
            is_variant: true,
          }
        : {}),
    });
  };

  handleChangeInventoryVariantFilters =
    (type: 'colors' | 'sizes') => (options: SelectOption[]) => {
      const availableOptions = options.map((option) => option.value).join(',');
      type === 'colors' && this.props.setQueryParam('color')(availableOptions);
      type === 'sizes' && this.props.setQueryParam('size')(availableOptions);
    };

  handleChangeEstablishmentBillingGroupFilter = (option: SelectOption) => {
    this.props.setQueryParam('establishment_billing_group')(option.value);
  };

  handleUpdateShopItem = (
    formData: ShopItemEdit,
    options?: OptionCallback<ShopItem>,
  ) => {
    /*
      Whenever the ShopItem is updated, some infos may have also changed for variants
      Then, we want to refetch the variant list too
    */
    const needToRefetchVariants = doesBaseItemMutationAffectsVariants(
      formData,
      this.props.shopItem,
    );

    const finalShopItemData = mapFormDataWithObject(
      formData,
      SHOPITEM_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    if (formData.cover) finalShopItemData.append('cover', formData.cover);

    this.props.updateShopItem({
      formData: finalShopItemData,
      id: this.props.id,
      options: {
        onSuccess: () => {
          if (needToRefetchVariants) this.fetchShopItemVariantList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    });
  };

  handleUpdateShopItemVariantBulk = (
    lowestVariantPrice: number,
    data: FormData,
    options?: OptionCallback,
  ) => {
    const needToRefetchShopItemDetails =
      lowestVariantPrice !== this.props.shopItem?.lowest_variant_price;
    this.props.updateShopItemVariantBulk({
      data,
      id: this.props.id,
      options: {
        onSuccess: () => {
          this.fetchShopItemVariantList();
          if (needToRefetchShopItemDetails)
            this.props.retrieveShopItemDetails(this.props.id);
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
    /*
      This boolean checks that the shopItem goes from a standalone item to a base item
      That way, we trigger a refetch of the variant list and the ShopItem Details
      to update both the variant tab and the inventory tab
    */
    const isShopItemMutated = !!this.props.shopItem?.is_standalone_item;
    this.props.createShopItemVariants({
      id: baseItemId,
      data,
      options: {
        onSuccess: () => {
          if (isShopItemMutated) this.retrieveShopItemDetails();
          if (!isShopItemMutated) this.fetchShopItemVariantList();
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

    /*
      This boolean checks that the shopItem goes from a base item to a standalone item
      That way, we trigger a refetch of the ShopItem Details to update the inventory tab
    */
    const isShopItemMutated =
      isLastItemInPage && (currentPage === 1 || !currentPage);

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
        this.fetchShopItemVariantList();
        if (isShopItemMutated)
          this.props.retrieveShopItemDetails(this.props.id);
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
   * Transform the color/size/establishmentBillingGroup query params into an array of selector options
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

    const establishmentBillingGroupLabel =
      this.props.establishmentBillingGroupFilterOptionList?.find(
        (option) =>
          option.value ===
          this.props.queryParams?.establishment_billing_group?.toString(),
      )?.label;

    const establishmentBillingGroup: SelectOption = {
      label: establishmentBillingGroupLabel ?? '',
      value:
        this.props.queryParams?.establishment_billing_group?.toString() ?? '',
    };

    return { colors, sizes, establishmentBillingGroup };
  };

  /**
   * When entering a barcode in the variant form, we check the unicity of it
   * @param barcode The barcode to check
   */
  checkBarcodeUnicity = (
    barcode: string,
    companyIds?: number[],
    options?: OptionCallback<ShopItemBarcodeUnicity>,
  ) => this.props.retrieveShopItemBarcodeUnicity(barcode, companyIds, options);

  render() {
    return (
      <ShopItemDetail
        bookkeepingAccountById={this.props.bookkeepingAccountById}
        bookkeepingAccounts={this.props.bookkeepingAccounts}
        changeEstablishmentBillingGroupFilter={
          this.handleChangeEstablishmentBillingGroupFilter
        }
        changeInventoryVariantFilter={this.handleChangeInventoryVariantFilters}
        checkBarcodeUnicity={this.checkBarcodeUnicity}
        companyId={this.props.theme.company}
        count={this.props.shopItemVariantState.count}
        createShopItemProvision={this.handleCreateShopItemProvision}
        createShopItemProvisionBulk={this.handleCreateShopItemProvisionBulk}
        createShopItemVariants={this.handleCreateShopItemVariants}
        deleteShopItem={this.handleDeleteShopItem}
        deleteShopItemVariant={this.handleDeleteShopItemVariant}
        establishmentBillingGroupFilterOptionList={
          this.props.establishmentBillingGroupFilterOptionList ?? []
        }
        getIsShopItemUsedInCombo={this.props.getIsShopItemUsedInCombo}
        getShopItemBarcodeListUnicity={this.props.getShopItemBarcodeListUnicity}
        getShopItemBarcodeUnicity={this.props.getShopItemBarcodeUnicity}
        isDeleting={this.props.isDeleteLoading}
        isDeletingVariant={this.props.isDeleteVariantLoading}
        isLoading={this.props.isLoading}
        isMultiLocationWebshopEnabled={
          !!this.props.theme.is_multi_location_webshop_enabled
        }
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
        snackbarSuccess={this.props.snackbarSuccess}
        supplierList={this.props.supplierState.suppliers}
        tab={this.props.queryParams.tab}
        tagList={this.props.allTagsWithTagGroup}
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
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    getShopItemBarcodeListUnicity: (barcodeList: string[]) =>
      getShopItemBarcodeListUnicity(state, barcodeList),
    getShopItemBarcodeUnicity: (barcode: string) =>
      getShopItemBarcodeUnicity(state, barcode),
    shopItemBarcodeUnicityLoading: getShopItemBarcodeUnicityLoading(state),
    establishmentBillingGroupFilterOptionList:
      getEstablishmentBillingGroupFilterOptionList(state),
  }),
  {
    retrieveShopItemUsedInCombo: retrieveShopItemUsedInComboAction,
    retrieveShopItemDetails: retrieveShopItemDetailsAction,
    retrieveShopItemBarcodeUnicity: retrieveShopItemBarcodeUnicityAction,
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
    fetchTags: fetchTagsAction,
    fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
    retrieveFranchise: retrieveFranchiseAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    push: (path: string) => (dispatch: Dispatch) => dispatch(pushRouter(path)),
    snackbarSuccess,
  },
);

export default compose<Props, OwnProps>(
  withQueryParams([
    ['tab', 'page', 'color', 'size', 'establishment_billing_group'],
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
    backToShopPage:
      ({ push }) =>
      () =>
        push('/shop/products'),
  }),
  withTitle(({ shopItem }) => (shopItem ? shopItem.name : '')),
)(ShopReworkedProductDetailPage);
