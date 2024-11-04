import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import ConsumerInvoiceDetailsCard from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard';

import { getReceiptUrl as getReceiptUrlAPI } from '#src/libs/invoice/api';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerInvoiceContext } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceContext';

import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

type Props = {
  isMobile?: boolean;
  isOpen?: boolean;
  isMultilocationEnabled?: boolean;
  selectedConsumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
  getInvoice: (uuid: string) => Invoice;
  payConsumerInvoice: (consumerInvoice: ConsumerInvoice) => void;
  handleClose: () => void;
};

const ConsumerInvoiceDetailsDrawer: React.FC<Props> = ({
  isOpen,
  isMobile,
  isMultilocationEnabled,
  selectedConsumerInvoice,
  selectedFilter,
  getInvoice,
  payConsumerInvoice,
  handleClose,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);

  const { getReceiptUrl } = useContext(ConsumerInvoiceContext);

  const isInvoiceDownloadable = React.useCallback(
    (invoice: ConsumerInvoice | Invoice) =>
      !invoice?.is_draft && invoice?.stripe_invoice_pdf,
    [],
  );

  const handleDownloadInvoice = React.useCallback(
    (invoice: ConsumerInvoice | Invoice) => {
      if (isInvoiceDownloadable(invoice)) {
        window.open(invoice.stripe_invoice_pdf);
      }
    },
    [isInvoiceDownloadable],
  );

  const handleDownloadReceipt = React.useCallback(
    (consumerInvoice: ConsumerInvoice) => {
      if (consumerInvoice?.payments?.length) {
        if (
          WidgetUtils.getConsumerSpaceContext() ===
          ConsumerSpaceContextEnum.WIDGET
        ) {
          return getReceiptUrl(consumerInvoice.uuid, {
            onSuccess: (URL: string) => window.open(URL),
          });
        }
        getReceiptUrlAPI(consumerInvoice.uuid).then((response) =>
          window.open(response.data),
        );
      }
    },
    [getReceiptUrl],
  );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer__subscription-page__details-drawer__root"
      modalDialogProps={{
        title: t('consumerSpace:reworked.myInvoices.detailsCard.drawerTitle'),
        onClose: handleClose,
        onCancel: handleClose,
        cancelLabel: t('common:back'),
      }}
    >
      <ConsumerInvoiceDetailsCard
        consumerInvoice={selectedConsumerInvoice}
        downloadInvoice={
          isInvoiceDownloadable(selectedConsumerInvoice)
            ? handleDownloadInvoice
            : null
        }
        downloadReceipt={
          selectedConsumerInvoice?.payments?.length
            ? handleDownloadReceipt
            : null
        }
        getInvoice={getInvoice}
        isMobile={isMobile}
        isMultilocationEnabled={isMultilocationEnabled}
        payInvoice={payConsumerInvoice}
        selectedFilter={selectedFilter}
      />
    </BottomDrawer>
  );
};

export default React.memo(ConsumerInvoiceDetailsDrawer);
