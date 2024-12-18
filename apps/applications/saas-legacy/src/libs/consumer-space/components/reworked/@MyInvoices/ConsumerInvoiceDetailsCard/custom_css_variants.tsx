import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  VariationConfigurationChoice,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import {
  consumerInvoiceFactory,
  invoiceFactory,
  invoiceItemBatchFactory,
  paymentItemBatchFactory,
  paymentItemFactory,
} from '#src/libs/invoice/factories';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
// @ts-expect-error
import ConsumerInvoiceDetailsCardCss from './styles.css?raw';
import ConsumerInvoiceDetailsCard from '.';

const ConsumerInvoiceDetailsCardVariationRegistry = [
  {
    label: 'isMultilocationEnabled',
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

type VariationsProps = Pick<
  React.ComponentProps<typeof ConsumerInvoiceDetailsCard>,
  'isMultilocationEnabled' | 'selectedFilter'
>;

export const CONSUMER_INVOICE_DETAILS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_INVOICE_DETAILS_CARD,
    css: ConsumerInvoiceDetailsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerInvoiceDetailsCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): VariationsProps => {
  const isMultilocationEnabled =
    variationsSelected?.isMultilocationEnabled?.value === 'true';

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

  return { isMultilocationEnabled, selectedFilter };
};

export const CONSUMER_INVOICE_DETAILS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyMethod = React.useCallback(() => {}, []);
  const getInvoice = React.useCallback(
    (uuid: string) => invoiceFactory({ uuid }),
    [],
  );

  const invoiceItems = invoiceItemBatchFactory(3);

  const price = invoiceItems.reduce<number>(
    (sum, invoiceItem) => sum + parseFloat(invoiceItem.total_price),
    0,
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
          payments: paymentItemBatchFactory(2, {
            price: (price / 2).toString(),
          }),
        });
      case InvoicesFiltersEnum.REFUNDED:
        return consumerInvoiceFactory({
          amount_due_cts: price * 100,
          amount_paid_cts: price * 50,
          amount_left_to_pay_cts: 0,
          reverted: true,
          establishment_billing_group_name: 'Paris',
          invoice_items: invoiceItems,
          payments: [paymentItemFactory({ price: (price / 2).toString() })],
        });
    }
  }, [componentProps?.selectedFilter, invoiceItems, price]);

  return (
    <ConsumerInvoiceDetailsCard
      consumerInvoice={fakeConsumerInvoice}
      downloadInvoice={emptyMethod}
      getInvoice={getInvoice}
      {...componentProps}
    />
  );
});
