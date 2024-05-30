import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';
import omit from 'lodash/omit';

import {
  retrieveShopItemTemplate as retrieveShopItemTemplateAction,
  updateShopItemTemplate as updateShopItemTemplateAction,
  deleteShopItemTemplate as deleteShopItemTemplateAction,
} from '#libs/shop/actions/shopItemReworked';

import { fetchShopSupplierTemplateList as fetchShopSupplierTemplateListAction } from '#libs/shop/actions/supplier';

import { getTheme } from '#libs/theme/selectors';
import {
  getShopItemTemplateDeleteLoading,
  getShopItemTemplateDetail,
  getShopItemTemplateDetailLoading,
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
import type { ShopItemEdit, ShopItemTemplate } from '#libs/shop/types';

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
  }

  handleFetchShopSupplierTemplateList = (page?: number) => {
    this.props.fetchShopSupplierTemplateList({
      page: page ?? 1,
    });
  };

  retrieveShopItemTemplateDetails = () => {
    this.props.retrieveShopItemTemplate(this.props.id);
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

  handleDeleteShopItemTemplate = () => {
    this.props.deleteShopItemTemplate(this.props.id, {
      onSuccess: this.props.backToShopPage,
    });
  };

  render() {
    return (
      <FranchiseShopItemTemplateDetail
        deleteShopItemTemplate={this.handleDeleteShopItemTemplate}
        isDeleting={this.props.isDeleteLoading}
        isLoading={this.props.isLoading}
        provincialTaxValue={this.props.theme.provincial_tax_value}
        shopItemTemplate={this.props.shopItemTemplate}
        supplierTemplateList={this.props.shopSupplierTemplateState.suppliers}
        tab={this.props.queryParams.tab}
        updateShopItemTemplate={this.handleUpdateShopItemTemplate}
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
  }),
  {
    retrieveShopItemTemplate: retrieveShopItemTemplateAction,
    updateShopItemTemplate: updateShopItemTemplateAction,
    deleteShopItemTemplate: deleteShopItemTemplateAction,
    fetchShopSupplierTemplateList: fetchShopSupplierTemplateListAction,
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
