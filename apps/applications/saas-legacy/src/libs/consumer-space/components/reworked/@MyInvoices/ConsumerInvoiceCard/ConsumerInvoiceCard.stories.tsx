import React from 'react';
import ConsumerInvoiceCard, { ConsumerInvoiceCardStorybook } from '.';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { consumerInvoiceFactory } from '#src/libs/invoice/factories';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';

const ConsumerInvoiceCardTemplate: ComponentStory<
  typeof ConsumerInvoiceCardStorybook
> = (args: React.ComponentProps<typeof ConsumerInvoiceCard>) => {
  return <ConsumerInvoiceCardStorybook {...args} />;
};

export const Displayed = ConsumerInvoiceCardTemplate.bind({});
Displayed.args = {
  consumerInvoice: consumerInvoiceFactory(),
};

export const Loading = ConsumerInvoiceCardTemplate.bind({});
Loading.args = {
  isLoading: true,
};

export default {
  title: 'Component/Consumer-space/ConsumerInvoiceCard',
  component: ConsumerInvoiceCardStorybook,
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This component is used to display invoice information in the reworked member profile page.',
      },
    },
  },
  argTypes: {
    consumerInvoice: {
      control: 'object',
      description: 'The invoice to display in the card',
    },
    selectedFilter: {
      control: 'radio',
      options: Object.values(InvoicesFiltersEnum),
      defaultValue: InvoicesFiltersEnum.UNPAID,
      description: 'The invoice filter currently selected',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state to display skeleton',
    },
    isSelected: {
      control: 'boolean',
      description:
        'Indicates if the invoice is selected, used to elevate the card',
    },
    downloadInvoice: {
      action: 'downloadInvoice',
      description: 'Opens the invoice pdf in a new tab',
    },
    payInvoice: {
      action: 'payInvoice',
      description: 'Opens the payment portal',
    },
    seeDetails: {
      action: 'seeDetails',
      description: 'Displays the invoice details on the right panel',
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
} as ComponentMeta<typeof ConsumerInvoiceCardStorybook>;
