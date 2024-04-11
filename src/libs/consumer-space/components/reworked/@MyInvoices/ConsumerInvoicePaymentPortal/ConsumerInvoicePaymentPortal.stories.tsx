import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConsumerInvoicePaymentPortalStorybook } from './ConsumerInvoicePaymentPortal.component';
import { consumerInvoiceFactory } from '#libs/invoice/factories';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
} from '@bsport/common/lib/master-data/payment-group';

const availablePaymentMethodList = [
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
];

export default {
  title: 'Component/Consumer-space/ConsumerInvoicePaymentPortal',
  component: ConsumerInvoicePaymentPortalStorybook,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
    description: {
      component:
        'Payment portal used to enable members to settle their invoices directly within their profile page.',
    },
  },
  argTypes: {
    availablePaymentMethodList: {
      description: 'The list of availaple payment methods',
      defaultValue: availablePaymentMethodList,
    },
    clientSecret: {
      control: 'text',
      description: 'The stripe intent secret key for the company',
      defaultValue: 'Secret',
    },
    clientSecretLoading: {
      control: 'boolean',
      description: 'Loading state for client secret',
      defaultValue: false,
    },
    companyId: {
      control: 'number',
      description: 'Company ID',
      defaultValue: 1,
    },
    consumerInvoice: {
      control: 'object',
      description: 'The invoice for which to pay',
      defaultValue: consumerInvoiceFactory({}),
    },
    creditAccountBalance: {
      control: 'number',
      description: 'The account balance of the current consumer',
      defaultValue: 10,
    },
    detachPaymentMethodLoading: {
      control: 'boolean',
      description: 'Loading state for detach payment method',
      defaultValue: false,
    },
    displayBottomDrawer: {
      control: 'boolean',
      description: 'Toggle for displaying bottom drawer',
      defaultValue: false,
    },
    isConsumerAllowedToUseInternalAccount: {
      control: 'boolean',
      description: 'Toggle for consumer internal account usage',
      defaultValue: true,
    },
    isMultiLocalizationEnabled: {
      control: 'boolean',
      description: 'Toggle for multi-localization feature',
      defaultValue: true,
    },
    isOpen: {
      control: 'boolean',
      description: 'Toggle for the portal open state',
      defaultValue: true,
    },
    memberId: {
      control: 'number',
      description: 'ID of the current member',
      defaultValue: 1,
    },
    paymentGroupId: {
      control: 'number',
      description: 'ID of the payment method',
      defaultValue: 43,
    },
    stripeId: {
      control: 'text',
      description: 'Stripe ID',
      defaultValue: 'DefaultStripeIdForStorybook',
    },
    applyBalanceToInvoice: {
      action: 'applyBalanceToInvoice',
      description: 'Function to pay the invoice with account credit balance',
    },
    detachPaymentMethod: {
      action: 'detachPaymentMethod',
      description: 'Function to detach a payment method',
    },
    onClose: {
      action: 'onClose',
      description: 'Function to handle closing the portal',
    },
    onPaymentSuccess: {
      action: 'onPaymentSuccess',
      description: 'Function called when the payment has been successful',
    },
  },
} as ComponentMeta<typeof ConsumerInvoicePaymentPortalStorybook>;

const Template: ComponentStory<typeof ConsumerInvoicePaymentPortalStorybook> = (
  args: React.ComponentProps<typeof ConsumerInvoicePaymentPortalStorybook>,
) => <ConsumerInvoicePaymentPortalStorybook {...args} />;

export const Modal = Template.bind({});
Modal.args = {};

export const BottomDrawer = Template.bind({});
BottomDrawer.args = { displayBottomDrawer: true };
