import React from 'react';
import { useTranslation } from 'react-i18next';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import { getReceiptUrl as getReceiptUrlAPI } from '#libs/invoice/api';
import { InvoicesFiltersEnum } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import {
  MY_INVOICES_LIST_CONTAINER_HEIGHT_DESKTOP,
  MY_INVOICES_LIST_CONTAINER_HEIGHT_MOBILE,
} from '.';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';
import ConsumerInvoiceCard from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceCard';
import ConsumerInvoiceDetailsCard from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard';
import Typography from '#Fabrique/Typography';

import type { ConsumerInvoice, Invoice } from '#libs/invoice/types';

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

  React.useEffect(
    () => clearSelectedConsumerInvoice(),
    [clearSelectedConsumerInvoice, selectedFilter],
  );

  if (isLoading && !(consumerInvoiceList?.length > 0)) {
    return (
      <div className="bs-consumer-invoice-page__body">
        <div className="bs-consumer-invoice-page__body-list__loading">
          <div className="bs-consumer-invoice-page__body-list-container">
            <ConsumerCardSkeleton className="bs-consumer-invoice-page__card-skeleton" />
            <ConsumerCardSkeleton className="bs-consumer-invoice-page__card-skeleton" />
            <ConsumerCardSkeleton className="bs-consumer-invoice-page__card-skeleton" />
            <ConsumerCardSkeleton className="bs-consumer-invoice-page__card-skeleton" />
          </div>
          <ConsumerDetailsCardSkeleton className="bs-consumer-invoice-page__details-card-skeleton" />
        </div>
      </div>
    );
  }

  if (isMobile && !!selectedConsumerInvoice) {
    return (
      <div className="bs-consumer-invoice-page__body">
        <div className="bs-consumer-invoice-page__body-details--mobile">
          <ConsumerInvoiceDetailsCard
            isMobile
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
            isMultilocationEnabled={isMultilocationEnabled}
            payInvoice={payConsumerInvoice}
            selectedFilter={selectedFilter}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bs-consumer-invoice-page__body">
      {!consumerInvoiceList || consumerInvoiceList.length === 0 ? (
        <Typography align="center" variant="body-lg">
          {t(`reworked.myInvoices.placeholder.${selectedFilter}`)}
        </Typography>
      ) : (
        <div className="bs-consumer-invoice-page__body-list">
          <GenericInfiniteScrollEnhancedCssOnly<ConsumerInvoice>
            className="bs-consumer-invoice-page__body-list-container"
            fetchMoreData={fetchMoreInvoices}
            hasMore={hasMoreInvoicesToFetch}
            height={myInvoicesListHeight}
            items={consumerInvoiceList}
            loader={
              <ConsumerInvoiceCard
                isLoading
                consumerInvoice={null}
                getInvoice={null}
                selectedFilter={null}
              />
            }
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
          {!isMobile && (
            <div className="bs-consumer-invoice-page__body-details">
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
                isMultilocationEnabled={isMultilocationEnabled}
                payInvoice={payConsumerInvoice}
                selectedFilter={selectedFilter}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ConsumerInvoiceBodyContainer);
