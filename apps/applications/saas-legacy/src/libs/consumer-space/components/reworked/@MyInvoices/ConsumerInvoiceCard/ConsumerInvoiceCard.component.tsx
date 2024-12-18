import React from 'react';

import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import {
  ConsumerInvoiceCardHeader,
  ConsumerInvoiceCardBody,
  ConsumerInvoiceCardFooter,
} from './sections';

import './styles.css';

type Props = {
  /** The invoice to display in the card. */
  consumerInvoice: ConsumerInvoice;
  /** Loading state to display skeleton. */
  isLoading?: boolean;
  /** Indicates if we are on a mobile device. */
  isMobile?: boolean;
  /** Indicates if the invoice is selected, used to elevate the card. */
  isSelected?: boolean;
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
  /** Displays the invoice details on the right panel. */
  seeDetails?: () => void;
};

const ConsumerInvoiceCard: React.FC<Props> = ({
  consumerInvoice,
  isLoading,
  isMobile,
  isSelected,
  selectedFilter,
  downloadInvoice,
  downloadReceipt,
  getInvoice,
  payInvoice,
  seeDetails,
}) => {
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

  if (isLoading) {
    return (
      <ConsumerCardSkeleton className="bs-consumer-invoice-page__card-skeleton" />
    );
  }

  return (
    <Card
      className="bs-consumer-invoice-card__root"
      variant={isSelected ? 'elevated' : 'rest'}
    >
      <ConsumerInvoiceCardHeader
        consumerInvoice={consumerInvoice}
        selectedFilter={selectedFilter}
      />
      <div className="bs-consumer-invoice-card__container">
        <ConsumerInvoiceCardBody
          consumerInvoice={consumerInvoice}
          seeDetails={seeDetails}
        />
        <ConsumerInvoiceCardFooter
          isMobile={isMobile}
          menuIdentifier={`ConsumerInvoiceCardFooter-MenuButton-${consumerInvoice.uuid}`}
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
      </div>
    </Card>
  );
};

export const ConsumerInvoiceCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerInvoiceCard>>()(
    ConsumerInvoiceCard,
  );

export default React.memo(ConsumerInvoiceCard);
