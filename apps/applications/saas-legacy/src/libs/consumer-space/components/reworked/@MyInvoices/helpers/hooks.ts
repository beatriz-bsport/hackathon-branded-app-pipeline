import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function returning the title for a consumer invoice.
 * @param {ConsumerInvoice} consumerInvoice - The consumer invoice object
 * @returns {string} The title for the consumer invoice card
 *
 *
 * @example
 * const title = useConsumerInvoiceTitle('INV-12345', 'd23b1c45-1a2b-3c4d-5e6f-7g8h9i0j');
 * // title will be 'Invoice N°INV-12345' since consumerInvoiceLegalIdentifier is available
 *
 * const title = useConsumerInvoiceTitle(null, 'd23b1c45-1a2b-3c4d-5e6f-7g8h9i0j');
 * // title will be 'Invoice N°d23b1c45' since consumerInvoiceLegalIdentifier is not available
 *
 * const title = useConsumerInvoiceTitle(undefined, undefined);
 * // title will be 'Invoice N°-' since consumerInvoiceLegalIdentifier and consumerInvoiceUuid are both undefined
 */
export const useConsumerInvoiceTitle = (
  consumerInvoiceLegalIdentifier: string,
  consumerInvoiceUuid: string,
) => {
  const { t } = useTranslation('consumerSpace');

  const title = React.useMemo(
    () =>
      t('reworked.myInvoices.card.title', {
        identifier:
          consumerInvoiceLegalIdentifier ||
          consumerInvoiceUuid?.slice(0, 8) ||
          '-',
      }),
    [consumerInvoiceLegalIdentifier, consumerInvoiceUuid, t],
  );

  return title;
};
