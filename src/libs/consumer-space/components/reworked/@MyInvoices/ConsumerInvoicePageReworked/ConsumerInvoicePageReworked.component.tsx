import React from 'react';

import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#libs/consumer-space/constants';
import { InvoicesFiltersEnum } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import ConsumerInvoiceHeader from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceHeader';
import ConsumerInvoiceBodyContainer from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceBodyContainer';
import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import useViewport from '#Fabrique/hooks/useViewport';

import type { ConsumerInvoice, Invoice } from '#libs/invoice/types';

import './styles.css';

type Props = {
  consumerInvoices: ConsumerInvoice[];
  hasMoreInvoicesToFetch: boolean;
  isBodyLoading?: boolean;
  isLoading?: boolean;
  isMultilocationEnabled: boolean;
  selectedFilter: InvoicesFiltersEnum;
  totalUnpaid: number;
  changeSelectedFilter: (filter: InvoicesFiltersEnum) => void;
  fetchMoreInvoices: () => void;
  getInvoice: (uuid: string) => Invoice;
  goToBookSession: () => void;
};

const ConsumerInvoicePageReworked: React.FC<Props> = ({
  consumerInvoices,
  hasMoreInvoicesToFetch,
  isBodyLoading,
  isLoading,
  isMultilocationEnabled,
  selectedFilter,
  totalUnpaid,
  changeSelectedFilter,
  fetchMoreInvoices,
  getInvoice,
  goToBookSession,
}) => {
  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [selectedConsumerInvoice, setSelectedConsumerInvoice] =
    React.useState<ConsumerInvoice | null>(null);

  const seeInvoiceDetails = React.useCallback(
    (consumerInvoice: ConsumerInvoice) =>
      setSelectedConsumerInvoice(consumerInvoice),
    [],
  );

  const clearSelectedConsumerInvoice = React.useCallback(
    () => setSelectedConsumerInvoice(null),
    [],
  );

  const handleChangeFilter = React.useCallback(
    (filter: InvoicesFiltersEnum) => changeSelectedFilter(filter),
    [changeSelectedFilter],
  );

  return (
    <MarketplacePageContent>
      <div
        className={
          isMobile && !!selectedConsumerInvoice
            ? 'bs-consumer-invoice-page__root__details--mobile'
            : 'bs-consumer-invoice-page__root'
        }
      >
        <ConsumerInvoiceHeader
          handleGoBack={clearSelectedConsumerInvoice}
          isLoading={isLoading}
          isMobile={isMobile}
          onBookSession={goToBookSession}
          onChangeFilter={handleChangeFilter}
          selectedConsumerInvoice={selectedConsumerInvoice}
          selectedFilter={selectedFilter}
          totalUnpaid={totalUnpaid}
        />
        <ConsumerInvoiceBodyContainer
          clearSelectedConsumerInvoice={clearSelectedConsumerInvoice}
          consumerInvoiceList={consumerInvoices}
          fetchMoreInvoices={fetchMoreInvoices}
          getInvoice={getInvoice}
          hasMoreInvoicesToFetch={hasMoreInvoicesToFetch}
          isLoading={isBodyLoading}
          isMobile={isMobile}
          isMultilocationEnabled={isMultilocationEnabled}
          seeInvoiceDetails={seeInvoiceDetails}
          selectedConsumerInvoice={selectedConsumerInvoice}
          selectedFilter={selectedFilter}
        />
      </div>
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerInvoicePageReworked);
