import React from 'react';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#src/components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import { getReceiptUrl as getReceiptUrlAPI } from '#src/libs/invoice/api';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import ConsumerInvoiceCard from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceCard';
import ConsumerInvoiceDetailsCard from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import {
  MY_INVOICES_LIST_CONTAINER_HEIGHT_DESKTOP,
  MY_INVOICES_LIST_CONTAINER_HEIGHT_MOBILE,
} from '.';

import './styles.css';

type Props = {
  consumerInvoiceList: ConsumerInvoice[];
  hasMoreInvoicesToFetch: boolean;
  isLoading?: boolean;
  isMobile?: boolean;
  isMultilocationEnabled: boolean;
  selectedConsumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
  clearSelectedConsumerInvoice: () => void;
  fetchMoreInvoices: () => void;
  getInvoice: (uuid: string) => Invoice;
  payConsumerInvoice: (consumerInvoice: ConsumerInvoice) => void;
  seeInvoiceDetails: (consumerInvoice: ConsumerInvoice) => void;
};

const ConsumerInvoiceBodyContainer: React.FC<Props> = ({
  consumerInvoiceList,
  hasMoreInvoicesToFetch,
  isLoading,
  isMobile,
  isMultilocationEnabled,
  selectedConsumerInvoice,
  selectedFilter,
  clearSelectedConsumerInvoice,
  fetchMoreInvoices,
  getInvoice,
  payConsumerInvoice,
  seeInvoiceDetails,
}) => {
  const { t } = useTranslation('consumerSpace');

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
        getReceiptUrlAPI(consumerInvoice.uuid).then((response) =>
          window.open(response.data),
        );
      }
    },
    [],
  );

  const handleSeeInvoiceDetails = React.useCallback(
    (consumerInvoice: ConsumerInvoice) => () =>
      seeInvoiceDetails(consumerInvoice),
    [seeInvoiceDetails],
  );

  const myInvoicesListHeight = React.useMemo(
    () =>
      isMobile
        ? MY_INVOICES_LIST_CONTAINER_HEIGHT_MOBILE
        : MY_INVOICES_LIST_CONTAINER_HEIGHT_DESKTOP,
    [isMobile],
  );

  const isCurrentTabContentEmpty =
    !isLoading && consumerInvoiceList?.length === 0;

  React.useEffect(
    () => clearSelectedConsumerInvoice(),
    [clearSelectedConsumerInvoice, selectedFilter],
  );

  return (
    <PageInnerContentLayout
      DetailComponent={
        <ConsumerInvoiceDetailsCard
          className={
            ((isMobile && !selectedConsumerInvoice) ||
              isCurrentTabContentEmpty) &&
            'bs-consumer-page-root__invoices__details-card--hidden'
          }
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
      }
      emptyPlaceholder={t(`reworked.myInvoices.placeholder.${selectedFilter}`)}
      InfiniteScrollComponent={
        isMobile && !!selectedConsumerInvoice ? null : (
          <GenericInfiniteScrollEnhancedCssOnly<ConsumerInvoice>
            fetchMoreData={fetchMoreInvoices}
            hasMore={hasMoreInvoicesToFetch}
            height={myInvoicesListHeight}
            items={consumerInvoiceList}
            loader={<ConsumerCardSkeleton />}
            renderItem={({ item }) => (
              <ConsumerInvoiceCard
                key={`ConsumerInvoiceCard-${item.uuid}`}
                consumerInvoice={item}
                downloadInvoice={
                  isInvoiceDownloadable(item) ? handleDownloadInvoice : null
                }
                downloadReceipt={
                  item?.payments?.length ? handleDownloadReceipt : null
                }
                getInvoice={getInvoice}
                isMobile={isMobile}
                isSelected={
                  !!selectedConsumerInvoice &&
                  selectedConsumerInvoice.uuid === item.uuid
                }
                payInvoice={payConsumerInvoice}
                seeDetails={handleSeeInvoiceDetails(item)}
                selectedFilter={selectedFilter}
              />
            )}
          />
        )
      }
      isEmpty={isCurrentTabContentEmpty}
    />
  );
};

export default React.memo(ConsumerInvoiceBodyContainer);
