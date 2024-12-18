import React from 'react';
import { ConsumerSubscriptionDetailsCardStorybook } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { subscriptionFactory } from '#src/libs/subscription/factory';
import { MarketplacePaymentMethods } from '#src/libs/marketplace/types';
import { fakeFailedInvoices, fakeSuccessfulInvoices } from './fakeData';
import { DateTime } from 'luxon';

const SUBSCRIPTION = subscriptionFactory();

ConsumerSubscriptionDetailsCardStorybook.displayName =
  'ConsumerSubscriptionCard';

// DONT REVIEW
const ConsumerSubscriptionDetailsCardTemplate: ComponentStory<
  typeof ConsumerSubscriptionDetailsCardStorybook
> = (args) => {
  return <ConsumerSubscriptionDetailsCardStorybook {...args} />;
};

export const ConsumerSubscriptionDetailsCardDefault =
  ConsumerSubscriptionDetailsCardTemplate.bind({});

export const ConsumerSubscriptionDetailsCardLoading =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCardLoading.args = {
  isLoading: true,
};

export const ConsumerSubscriptionDetailsCardMissingPaymentMethod =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCardMissingPaymentMethod.args = {
  hasMissingPaymentMethod: true,
};

export const ConsumerSubscriptionDetailsCardFailedPayments =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCardFailedPayments.args = {
  hasMissingPaymentMethod: true,
  failedInvoices: fakeFailedInvoices,
};

export const ConsumerSubscriptionDetailsCardBillingHistory =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCardBillingHistory.args = {
  selectedSubscriptionInvoiceDetails: fakeSuccessfulInvoices,
};

export const ConsumerSubscriptionDetailsCardFuturePauses =
  ConsumerSubscriptionDetailsCardTemplate.bind({});
ConsumerSubscriptionDetailsCardFuturePauses.args = {
  selectedSubscriptionsFuturePauses: SUBSCRIPTION.pauses,
};

export default {
  title: 'ConsumerSubscriptionDetailsCard',
  component: ConsumerSubscriptionDetailsCardStorybook,
  argTypes: {
    autoRenewalDate: {
      description: 'Indicate the date when the renewal will start',
    },
    areDetailsLoading: {
      description: 'Indicates if new invoices are being fetched',
      control: 'boolean',
      defaultValue: false,
    },
    description: {
      description: 'Description of subscription',
      control: 'boolean',
      defaultValue: false,
    },
    failedInvoices: {
      description: 'Loading state',
    },
    isPaused: {
      description: 'Indicate if subscription is currently in pause',
      control: 'boolean',
      defaultValue: false,
    },
    joiningFee: {
      description: 'Joining fee',
      control: 'text',
      defaultValue: '0',
    },
    hasMissingPaymentMethod: {
      description: 'Indicate if subscription has no payment method associated',
      control: 'boolean',
      defaultValue: false,
    },
    invoiceRetryNumber: {
      description:
        'Number of retry after failed payment based on InvoiceConfiguration',
      control: 'number',
      defaultValue: 0,
    },
    pauseEndDate: {
      description: 'Indicate the date when the current pause ends',
      control: 'boolean',
      defaultValue: false,
    },
    paymentMethodType: {
      description: 'Indicate the type of the payment method',
      control: 'inline-radio',
      options: [
        MarketplacePaymentMethods.card,
        MarketplacePaymentMethods.sepa,
        MarketplacePaymentMethods.terminal,
      ],
      defaultValue: [MarketplacePaymentMethods.card],
    },
    price: {
      description: 'Price displayed ',
      control: 'text',
      defaultValue: SUBSCRIPTION.recurrent_price.toString(),
    },
    recurrenceBasis: {
      description: 'recurrenceBasis of the subscription',
      control: 'number',
      defaultValue: SUBSCRIPTION.recurrence_basis,
    },
    readableIdentifier: {
      description: '4 number digit of the payment method',
      control: 'text',
      defaultValue: '4242',
    },
    selectedSubscriptionInvoiceDetails: {
      description: 'List of invoices with successful payments',
    },
    selectedSubscriptionsFuturePauses: {
      description: 'List of scheduled pauses in the future',
    },
    showPlaceholder: {
      description: 'Display placeholder',
      control: 'boolean',
      defaultValue: false,
    },
    subtitleDate: {
      description: "Display a date depending on subscription's status",
      defaultValue: DateTime.fromISO(SUBSCRIPTION.first_billing_date).toFormat(
        'D',
      ),
    },
    subscriptionInterval: {
      description: 'Interval of the subscription',
      control: 'inline-radio',
      options: ['day', 'week', 'month', 'year'],
      defaultValue: SUBSCRIPTION.interval,
    },
    subscriptionName: {
      description: 'Name of the subscription',
      control: 'text',
      defaultValue: SUBSCRIPTION.name_without_member_name,
    },
    subscriptionNextPaymentDate: {
      description: 'Next payment date',
      defaultValue: DateTime.fromISO(SUBSCRIPTION.next_billing_date).toFormat(
        'D',
      ),
    },
    termsDate: {
      description: 'Date when terms have been accepted',
      defaultValue: DateTime.fromISO(
        SUBSCRIPTION.contract_terms_date_accepted,
      ).toFormat('D'),
    },
  },
} as ComponentMeta<typeof ConsumerSubscriptionDetailsCardStorybook>;
