import React from 'react';

import { PortalContainer } from '#Fabrique/PortalContainer';
import ConsumerInvoiceDetailsDrawer from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsDrawer';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';

type Props = {
  /* DETAILS DRAWER */
  isMobile?: boolean;
  isConsumerInvoiceDetailsDrawerOpen?: boolean;
  isMultilocationEnabled?: boolean;
  selectedConsumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
  getInvoice: (uuid: string) => Invoice;
  payConsumerInvoice?: (consumerInvoice: ConsumerInvoice) => void;
  handleCloseConsumerInvoiceDetailsDrawer: () => void;
};

const ConsumerInvoiceModals: React.FC<Props> = ({
  /* DETAILS DRAWER */
  isMobile,
  isConsumerInvoiceDetailsDrawerOpen,
  isMultilocationEnabled,
  selectedConsumerInvoice,
  selectedFilter,
  getInvoice,
  payConsumerInvoice,
  handleCloseConsumerInvoiceDetailsDrawer,
}) => {
  return (
    <PortalContainer wrapperId="bs-consumer-invoice-page__portal-container">
      <ConsumerInvoiceDetailsDrawer
        getInvoice={getInvoice}
        handleClose={handleCloseConsumerInvoiceDetailsDrawer}
        isMobile={isMobile}
        isMultilocationEnabled={isMultilocationEnabled}
        isOpen={isMobile && isConsumerInvoiceDetailsDrawerOpen}
        payConsumerInvoice={payConsumerInvoice}
        selectedConsumerInvoice={selectedConsumerInvoice}
        selectedFilter={selectedFilter}
      />
    </PortalContainer>
  );
};

export default React.memo(ConsumerInvoiceModals);
