import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { getReceiptUrl as getReceiptUrlAPI } from '#src/libs/invoice/api';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import ConsumerInvoiceCard from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceCard';
import ConsumerInvoiceDetailsCard from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceList';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerInvoiceContext } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceContext';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';

import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

import './styles.css';

type Props = {
  consumerInvoiceList: ConsumerInvoice[];
  isMobile?: boolean;
  isMultilocationEnabled: boolean;
  selectedConsumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
  isLoading: boolean;
  currentCount: number;
  currentPage: number;
  clearSelectedConsumerInvoice: () => void;
  handleChangePage: (page?: number) => void;
  getInvoice: (uuid: string) => Invoice;
  payConsumerInvoice?: (consumerInvoice: ConsumerInvoice) => void;
  seeInvoiceDetails: (consumerInvoice: ConsumerInvoice) => void;
};

type ConsumerInvoiceBodyContainerRowProps = {
  selectedConsumerInvoiceUuid?: string;
  item: ConsumerInvoice;
  isInvoiceDownloadable: (invoice: ConsumerInvoice | Invoice) => string;
  handleSeeInvoiceDetails: (consumerInvoice: ConsumerInvoice) => () => void;
  handleDownloadInvoice: (invoice: ConsumerInvoice | Invoice) => void;
  handleDownloadReceipt: (consumerInvoice: ConsumerInvoice) => void;
} & Pick<
  Props,
  'getInvoice' | 'isMobile' | 'payConsumerInvoice' | 'selectedFilter'
>;

const ConsumerInvoiceBodyContainerRow: React.FC<
  ConsumerInvoiceBodyContainerRowProps
> = ({
  isMobile,
  selectedConsumerInvoiceUuid,
  selectedFilter,
  item,
  isInvoiceDownloadable,
  getInvoice,
  payConsumerInvoice,
  handleSeeInvoiceDetails,
  handleDownloadInvoice,
  handleDownloadReceipt,
}) => {
  return (
    <ConsumerInvoiceCard
      key={`ConsumerInvoiceCard-${item.uuid}`}
      consumerInvoice={item}
      downloadInvoice={
        isInvoiceDownloadable(item) ? handleDownloadInvoice : null
      }
      downloadReceipt={item?.payments?.length ? handleDownloadReceipt : null}
      getInvoice={getInvoice}
      isMobile={isMobile}
      isSelected={
        !isMobile &&
        !!selectedConsumerInvoiceUuid &&
        selectedConsumerInvoiceUuid === item.uuid
      }
      payInvoice={payConsumerInvoice}
      seeDetails={handleSeeInvoiceDetails(item)}
      selectedFilter={selectedFilter}
    />
  );
};

const ConsumerInvoiceBodyContainer: React.FC<Props> = ({
  consumerInvoiceList,
  isMobile,
  isMultilocationEnabled,
  selectedConsumerInvoice,
  selectedFilter,
  isLoading,
  currentCount,
  currentPage,
  clearSelectedConsumerInvoice,
  handleChangePage,
  getInvoice,
  payConsumerInvoice,
  seeInvoiceDetails,
}) => {
  const { t } = useTranslation('consumerSpace');

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

  const handleSeeInvoiceDetails = React.useCallback(
    (consumerInvoice: ConsumerInvoice) => () =>
      seeInvoiceDetails(consumerInvoice),
    [seeInvoiceDetails],
  );

  const isCurrentTabContentEmpty =
    !isLoading && consumerInvoiceList?.length === 0;

  React.useEffect(
    () => clearSelectedConsumerInvoice(),
    [clearSelectedConsumerInvoice, selectedFilter],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
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
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceList<ConsumerInvoice>
          data={consumerInvoiceList}
          isLoading={isLoading}
          rowRenderer={({ item }) => (
            <ConsumerInvoiceBodyContainerRow
              getInvoice={getInvoice}
              handleDownloadInvoice={handleDownloadInvoice}
              handleDownloadReceipt={handleDownloadReceipt}
              handleSeeInvoiceDetails={handleSeeInvoiceDetails}
              isInvoiceDownloadable={isInvoiceDownloadable}
              item={item}
              payConsumerInvoice={payConsumerInvoice}
              selectedFilter={selectedFilter}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerInvoiceBodyContainer);
