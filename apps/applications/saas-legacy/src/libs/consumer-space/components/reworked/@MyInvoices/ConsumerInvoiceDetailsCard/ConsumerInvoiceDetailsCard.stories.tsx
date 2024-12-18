import React from 'react';
import ConsumerInvoiceDetailsCard, {
  ConsumerInvoiceDetailsCardStorybook,
} from '.';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  consumerInvoiceFactory,
  invoiceItemBatchFactory,
  paymentItemBatchFactory,
} from '#src/libs/invoice/factories';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';

const ConsumerInvoiceDetailsCardTemplate: ComponentStory<
  typeof ConsumerInvoiceDetailsCardStorybook
> = (args: React.ComponentProps<typeof ConsumerInvoiceDetailsCard>) => {
  return <ConsumerInvoiceDetailsCardStorybook {...args} />;
};

export const Displayed = ConsumerInvoiceDetailsCardTemplate.bind({});
Displayed.args = {
  consumerInvoice: consumerInvoiceFactory({
    payments: paymentItemBatchFactory(2),
    invoice_items: invoiceItemBatchFactory(3),
  }),
  isLoading: false,
};

export const NothingSelected = ConsumerInvoiceDetailsCardTemplate.bind({});
NothingSelected.args = {
  isLoading: false,
};
export const Loading = ConsumerInvoiceDetailsCardTemplate.bind({});
Loading.args = {
  isLoading: true,
};

export default {
  title: 'Component/Consumer-space/ConsumerInvoiceDetailsCard',
  component: ConsumerInvoiceDetailsCardStorybook,
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This component is used to display invoice detailed information in the reworked member profile page.',
      },
    },
  },
  argTypes: {
    consumerInvoice: {
      control: 'object',
      description: 'The invoice to display in the card',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state to display skeleton',
    },
    isMobile: {
      control: 'boolean',
      description: 'Indicates if the device used is a mobile device or not',
    },
    isMultilocationEnabled: {
      control: 'boolean',
      description: 'Indicates if the company has the multilocation upsell',
    },
    selectedFilter: {
      control: 'radio',
      options: Object.values(InvoicesFiltersEnum),
      defaultValue: InvoicesFiltersEnum.UNPAID,
      description: 'The invoice filter currently selected',
    },
    downloadInvoice: {
      action: 'downloadInvoice',
      description: 'Opens the invoice pdf in a new tab',
    },
    downloadReceipt: {
      action: 'downloadReceipt',
      description: 'Opens the invoice receipt pdf in a new tab',
    },
    getInvoice: {
      action: 'getInvoice',
      description: 'Returns the corresponding invoice',
    },
    payInvoice: {
      action: 'payInvoice',
      description: 'Opens the payment portal',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '2em 15em 2em 15em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ConsumerInvoiceDetailsCardStorybook>;
