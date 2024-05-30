import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';

import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import ShopItemFormReworked from './ShopItemFormReworked.component';

import type { ShopItemFormValues } from './types';

import shopItemFormValidationSchema from './shopItemFormValidationSchema';

const ShopItemFormTemplate: ComponentStory<typeof ShopItemFormReworked> = (
  args,
) => <ShopItemFormReworked {...args} />;

const defaultArgs = {
  provincialTax: 1,
};

const initialValues: ShopItemFormValues = {
  name: '',
  subtitle: '',
  price: 0,
  supplierPrice: 0,
  cover: null,
  tva: 0,
  description: '',
  barcode: '',
  stockKeepingUnit: '',
  marketplaceEnabled: false,
  availablePaymentMethodIdentifiers: [CB.id, CREDIT_ACCOUNT.id],
  featured: false,
  sellOnlyOnProvision: false,
  isDeliverable: true,
  subshop: null,
  franchiseCompanyList: [],
};

export const EmptyForm = ShopItemFormTemplate.bind({});
EmptyForm.args = defaultArgs;

export default {
  title: 'Library/Shop/ShopItemFormReworked',
  component: ShopItemFormReworked,
  decorators: [withFormik],
  argTypes: {
    cover: {
      description: 'The optional image of the product',
    },
    name: {
      description: 'The name of the product',
      control: 'text',
    },
    subtitle: {
      description: 'The subtitle of the product',
      control: 'text',
    },
    price: {
      description: 'The price of the product',
      control: { type: 'number' },
    },
    tva: {
      description: 'The TVA percentage of the product',
      control: { type: 'number' },
    },
    supplierPrice: {
      description: 'The supplier price price of the product',
      control: { type: 'number' },
    },
    supplier: {
      description:
        'The supplier ID provided from the lsit of available suppliers in the selector',
    },
    marketplaceEnabled: {
      description: 'If true, this product will be visible on the marketplace',
      control: 'boolean',
    },
    availablePaymentMethodIdentifiers: {
      description: 'The list of available payment methods IDs for this product',
      control: 'select',
      options: [CB.id, CREDIT_ACCOUNT.id],
    },
    featured: {
      description: 'If true the product will be displayed as featured',
      control: 'boolean',
    },
    sellOnlyOnProvision: {
      description:
        'If true the product cannot be bought by members if not enough stock',
      control: 'boolean',
    },
    isDeliverable: {
      description: 'If true the product is marked as deliverable to members',
      control: 'boolean',
    },
    barcode: {
      description: 'The barcode of the product',
      control: 'text',
    },
    onCreateSubmit: {
      description: 'Function fired when creating a base shop item',
      action: 'onCreateSubmit',
    },
    onUpdateSubmit: {
      description: 'Function fired when updating a base/standalone shop item',
      action: 'onUpdateSubmit',
    },
    onCancel: {
      description: 'Function fired when closing the form drawer',
      action: 'onCancel',
    },
  },
  parameters: {
    formik: {
      initialValues,
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema: shopItemFormValidationSchema.product,
      onSubmit: () => {},
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof ShopItemFormReworked>;
