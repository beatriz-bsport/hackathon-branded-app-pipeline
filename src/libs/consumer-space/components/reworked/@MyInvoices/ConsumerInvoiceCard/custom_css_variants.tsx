import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#libs/exportable-components/types';
import {
  consumerInvoiceFactory,
  invoiceFactory,
  invoiceItemBatchFactory,
} from '#libs/invoice/factories';
import { InvoicesFiltersEnum } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerInvoiceCardCss from './styles.css?raw';
import ConsumerInvoiceCard from '.';

const ConsumerInvoiceCardVariationRegistry = [
  {
    label: 'isSelected',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'invoiceType',
    choices: [
      { label: 'unpaid', value: InvoicesFiltersEnum.UNPAID },
      { label: 'paid', value: InvoicesFiltersEnum.PAID },
      { label: 'refunded', value: InvoicesFiltersEnum.REFUNDED },
    ],
    default: { label: 'unpaid', value: InvoicesFiltersEnum.UNPAID },
  },
];

const invoiceItems = invoiceItemBatchFactory(3);

const price = invoiceItems.reduce<number>(
  (sum, invoiceItem) => sum + parseFloat(invoiceItem.total_price),
  0,
);

type VariationsProps = Pick<
  React.ComponentProps<typeof ConsumerInvoiceCard>,
  'isSelected' | 'selectedFilter'
>;

export const CONSUMER_INVOICE_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_INVOICE_CARD,
    css: ConsumerInvoiceCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerInvoiceCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const isSelected = variationsSelected?.isSelected?.value === 'true';

  const selectedFilter = React.useMemo(() => {
    switch (variationsSelected?.invoiceType?.value) {
      case 'unpaid':
      default:
        return InvoicesFiltersEnum.UNPAID;
      case 'paid':
        return InvoicesFiltersEnum.PAID;
      case 'refunded':
        return InvoicesFiltersEnum.REFUNDED;
    }
  }, [variationsSelected?.invoiceType?.value]);

  return { isSelected, selectedFilter };
};

export const CONSUMER_INVOICE_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyMethod = React.useCallback(() => {}, []);
  const getInvoice = React.useCallback(
    (uuid: string) => invoiceFactory({ uuid }),
    [],
  );

  const fakeConsumerInvoice = React.useMemo(() => {
    switch (componentProps?.selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
      default:
        return consumerInvoiceFactory({
          amount_due_cts: price * 100,
          amount_paid_cts: 0,
          amount_left_to_pay_cts: price * 100,
          reverted: false,
          establishment_billing_group_name: 'Paris',
          invoice_items: invoiceItems,
        });
      case InvoicesFiltersEnum.PAID:
        return consumerInvoiceFactory({
          amount_due_cts: price * 100,
          amount_paid_cts: price * 100,
          amount_left_to_pay_cts: 0,
          reverted: false,
          establishment_billing_group_name: 'Paris',
          invoice_items: invoiceItems,
        });
      case InvoicesFiltersEnum.REFUNDED:
        return consumerInvoiceFactory({
          amount_due_cts: price * 100,
          amount_paid_cts: price * 50,
          amount_left_to_pay_cts: 0,
          reverted: true,
          establishment_billing_group_name: 'Paris',
          invoice_items: invoiceItems,
        });
    }
  }, [componentProps?.selectedFilter]);

  return (
    <ConsumerInvoiceCard
      consumerInvoice={fakeConsumerInvoice}
      downloadInvoice={emptyMethod}
      getInvoice={getInvoice}
      seeDetails={emptyMethod}
      {...componentProps}
    />
  );
});
