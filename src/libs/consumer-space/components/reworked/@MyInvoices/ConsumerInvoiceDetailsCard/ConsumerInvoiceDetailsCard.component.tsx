import React from 'react';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import {
  ConsumerInvoiceDetailsCardBody,
  ConsumerInvoiceDetailsCardFooter,
  ConsumerInvoiceDetailsCardHeader,
} from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard/sections';
import { InvoicesFiltersEnum } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import Card from '#Fabrique/Card';
import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import type { ConsumerInvoice, Invoice } from '#libs/invoice/types';

import './styles.css';

type Props = {
  /** The invoice to display in the card. */
  consumerInvoice?: ConsumerInvoice;
  /** Loading state to display skeleton. */
  isLoading?: boolean;
  /** Indicates if the device used is a mobile device or not. */
  isMobile?: boolean;
  /** Indicates if the company has the multilocation upsell. */
  isMultilocationEnabled: boolean;
  /** The invoice filter currently selected. */
  selectedFilter: InvoicesFiltersEnum;
  /** Opens the invoice PDF in a new tab. */
  downloadInvoice?: (consumerInvoice: ConsumerInvoice | Invoice) => void;
  /** Opens the invoice receipt PDF in a new tab. */
  downloadReceipt?: (consumerInvoice: ConsumerInvoice) => void;
  /** Returns the corresponding invoice. */
  getInvoice: (uuid: string) => Invoice;
  /** Opens the payment portal. */
  payInvoice?: (consumerInvoice: ConsumerInvoice) => void;
};

const ConsumerInvoiceDetailsCard: React.FC<Props> = ({
  consumerInvoice,
  isLoading,
  isMobile,
  isMultilocationEnabled,
  selectedFilter,
  downloadInvoice,
  downloadReceipt,
  getInvoice,
  payInvoice,
}) => {
  const { t } = useTranslation('consumerSpace');

  const reverseInvoice = React.useMemo(() => {
    if (consumerInvoice?.reverse_invoices?.length > 0) {
      const reverseInvoiceUuid = consumerInvoice.reverse_invoices[0];
      return getInvoice(reverseInvoiceUuid);
    }
    return null;
  }, [consumerInvoice?.reverse_invoices, getInvoice]);

  const handleDownloadInvoice = React.useCallback(
    () => downloadInvoice?.(consumerInvoice),
    [consumerInvoice, downloadInvoice],
  );
  const handlePayInvoice = React.useCallback(
    () => payInvoice?.(consumerInvoice),
    [consumerInvoice, payInvoice],
  );

  const handleDownloadRefundedInvoice = React.useCallback(
    () => reverseInvoice && downloadInvoice?.(reverseInvoice),
    [reverseInvoice, downloadInvoice],
  );

  const handleDownloadReceipt = React.useCallback(
    () => downloadReceipt?.(consumerInvoice),
    [consumerInvoice, downloadReceipt],
  );

  // Determine whether to display the footer based on available actions
  const isFooterDisplayed =
    !!downloadInvoice ||
    !!payInvoice ||
    !!downloadReceipt ||
    (!!downloadInvoice && !!reverseInvoice);

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton />;
  }

  if (!consumerInvoice) {
    return (
      <ConsumerCardPlaceholder
        message={t('reworked.myInvoices.detailsCard.placeholder')}
      />
    );
  }

  return (
    <Card className="bs-consumer-invoice-details-card__root">
      <ConsumerInvoiceDetailsCardHeader
        consumerInvoice={consumerInvoice}
        isMultilocationEnabled={isMultilocationEnabled}
      />
      <ConsumerInvoiceDetailsCardBody
        consumerInvoice={consumerInvoice}
        selectedFilter={selectedFilter}
      />
      {isFooterDisplayed && (
        <ConsumerInvoiceDetailsCardFooter
          isMobile={isMobile}
          onDownload={downloadInvoice ? handleDownloadInvoice : null}
          onPay={payInvoice ? handlePayInvoice : null}
          onReceiptDownload={downloadReceipt ? handleDownloadReceipt : null}
          onRefundedInvoiceDownload={
            !!downloadInvoice && !!reverseInvoice
              ? handleDownloadRefundedInvoice
              : null
          }
          selectedFilter={selectedFilter}
        />
      )}
    </Card>
  );
};

export const ConsumerInvoiceDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerInvoiceDetailsCard>
>()(ConsumerInvoiceDetailsCard);

export default React.memo(ConsumerInvoiceDetailsCard);
