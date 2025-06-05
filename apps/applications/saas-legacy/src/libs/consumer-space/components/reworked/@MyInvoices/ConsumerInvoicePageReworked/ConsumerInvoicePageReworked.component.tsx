import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import ConsumerInvoiceBodyContainer from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceBodyContainer';
import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';

import ConsumerInvoicePaymentPortal from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoicePaymentPortal';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';
import useViewport from '#Fabrique/hooks/useViewport';

import ConsumerInvoiceModals from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceModals';

import type { StripePaymentElementConfig } from '#src/libs/company/types';
import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import type { Membership } from '#src/libs/membership/types';

import './styles.css';

type Props = {
  consumerInvoices: ConsumerInvoice[];
  isMultilocationEnabled: boolean;
  membership: Membership;
  selectedFilter: InvoicesFiltersEnum;
  totalUnpaid: number;
  selectedInvoiceUuid: string | null;
  currentCount: number;
  currentPage: number;
  isLoading: boolean;
  changeSelectedFilter: (filter: InvoicesFiltersEnum) => void;
  handleChangePage: (page?: number) => void;
  getInvoice: (uuid: string) => Invoice;
  refreshConsumerInvoices: () => void;
  refreshMembership: () => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

const ConsumerInvoicePageReworked: React.FC<Props> = ({
  consumerInvoices,
  isMultilocationEnabled,
  selectedInvoiceUuid,
  membership,
  selectedFilter,
  totalUnpaid,
  currentCount,
  currentPage,
  isLoading,
  changeSelectedFilter,
  handleChangePage,
  getInvoice,
  refreshConsumerInvoices,
  refreshMembership,
  stripePaymentElementConfig,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [consumerInvoiceToPay, setConsumerInvoiceToPay] =
    useState<ConsumerInvoice | null>(null);

  const [selectedConsumerInvoice, setSelectedConsumerInvoice] =
    React.useState<ConsumerInvoice | null>(null);

  React.useEffect(() => {
    const invoice = selectedInvoiceUuid
      ? consumerInvoices.filter(
          (consumerInvoice) => consumerInvoice.uuid === selectedInvoiceUuid,
        )[0]
      : null;
    setSelectedConsumerInvoice(invoice);
  }, [consumerInvoices, selectedInvoiceUuid]);

  const [
    isConsumerInvoiceDetailsDrawerOpen,
    setIsConsumerInvoiceDetailsDrawerOpen,
  ] = React.useState(false);

  const handleOpenConsumerInvoiceDetailsDrawer = React.useCallback(
    () => setIsConsumerInvoiceDetailsDrawerOpen(true),
    [],
  );

  const handleCloseConsumerInvoiceDetailsDrawer = React.useCallback(
    () => setIsConsumerInvoiceDetailsDrawerOpen(false),
    [],
  );

  const seeInvoiceDetails = React.useCallback(
    (consumerInvoice: ConsumerInvoice) => {
      setSelectedConsumerInvoice(consumerInvoice);
      isMobile && handleOpenConsumerInvoiceDetailsDrawer();
    },
    [handleOpenConsumerInvoiceDetailsDrawer, isMobile],
  );

  const clearSelectedConsumerInvoice = React.useCallback(
    () => setSelectedConsumerInvoice(null),
    [],
  );

  const handleChangeFilter = React.useCallback(
    (filter: InvoicesFiltersEnum) => {
      changeSelectedFilter(filter);
    },
    [changeSelectedFilter],
  );

  const handleChangeInvoicePage = React.useCallback(
    (page: number) => {
      handleChangePage(page);
    },
    [handleChangePage],
  );

  const payConsumerInvoice = React.useCallback(
    (consumerInvoice: ConsumerInvoice) => {
      refreshMembership?.();
      setConsumerInvoiceToPay(consumerInvoice);
    },
    [refreshMembership],
  );

  const closePaymentPortal = React.useCallback(
    () => setConsumerInvoiceToPay(null),
    [],
  );

  const refreshAndClose = React.useCallback(() => {
    refreshConsumerInvoices?.();
    closePaymentPortal();
  }, [refreshConsumerInvoices, closePaymentPortal]);

  const applyBalanceToInvoiceCallbacks = React.useMemo(
    () => ({
      onSuccess: refreshAndClose,
      onError: refreshAndClose,
    }),
    [refreshAndClose],
  );

  const handleRefreshAfterPayment = React.useCallback(() => {
    clearSelectedConsumerInvoice();
    refreshConsumerInvoices?.();
  }, [refreshConsumerInvoices, clearSelectedConsumerInvoice]);

  const filterUnpaidInvoices = React.useCallback(
    () => handleChangeFilter(InvoicesFiltersEnum.UNPAID),
    [handleChangeFilter],
  );

  const filterPaidInvoices = React.useCallback(
    () => handleChangeFilter(InvoicesFiltersEnum.PAID),
    [handleChangeFilter],
  );

  const filterRefundedInvoices = React.useCallback(
    () => handleChangeFilter(InvoicesFiltersEnum.REFUNDED),
    [handleChangeFilter],
  );

  const filters = React.useMemo(
    () => [
      {
        hasBadge: totalUnpaid > 0,
        type: InvoicesFiltersEnum.UNPAID,
        label: t('reworked.myInvoices.header.filters.unpaid'),
        onClick: filterUnpaidInvoices,
        value: totalUnpaid,
      },
      {
        hasBadge: false,
        type: InvoicesFiltersEnum.PAID,
        label: t('reworked.myInvoices.header.filters.paid'),
        onClick: filterPaidInvoices,
      },
      {
        hasBadge: false,
        type: InvoicesFiltersEnum.REFUNDED,
        label: t('reworked.myInvoices.header.filters.refunded'),
        onClick: filterRefundedInvoices,
      },
    ],
    [
      totalUnpaid,
      t,
      filterUnpaidInvoices,
      filterPaidInvoices,
      filterRefundedInvoices,
    ],
  );
  return (
    <PageContentContainer
      contentClassName={
        isMobile && !!selectedConsumerInvoice
          ? 'bs-consumer-invoice-page__root__details--mobile'
          : 'bs-consumer-invoice-page__root'
      }
    >
      <ConsumerInvoiceModals
        getInvoice={getInvoice}
        handleCloseConsumerInvoiceDetailsDrawer={
          handleCloseConsumerInvoiceDetailsDrawer
        }
        isConsumerInvoiceDetailsDrawerOpen={isConsumerInvoiceDetailsDrawerOpen}
        isMobile={isMobile}
        isMultilocationEnabled={isMultilocationEnabled}
        payConsumerInvoice={payConsumerInvoice}
        selectedConsumerInvoice={selectedConsumerInvoice}
        selectedFilter={selectedFilter}
      />

      <ConsumerPageHeader
        FilterProps={{ filters, selectedFilter: selectedFilter }}
        isMobile={isMobile}
        TitleProps={{
          title: t('reworked.myInvoices.header.title'),
        }}
      />

      <ConsumerInvoiceBodyContainer
        clearSelectedConsumerInvoice={clearSelectedConsumerInvoice}
        consumerInvoiceList={consumerInvoices}
        currentCount={currentCount}
        currentPage={currentPage}
        getInvoice={getInvoice}
        handleChangePage={handleChangeInvoicePage}
        isLoading={isLoading}
        isMobile={isMobile}
        isMultilocationEnabled={isMultilocationEnabled}
        payConsumerInvoice={payConsumerInvoice}
        seeInvoiceDetails={seeInvoiceDetails}
        selectedConsumerInvoice={selectedConsumerInvoice}
        selectedFilter={selectedFilter}
      />
      {!!consumerInvoiceToPay && (
        <ConsumerInvoicePaymentPortal
          applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
          companyId={membership.company}
          consumerInvoice={consumerInvoiceToPay}
          displayBottomDrawer={isMobile}
          isOpen={!!consumerInvoiceToPay}
          memberId={membership.id}
          onClose={closePaymentPortal}
          onPaymentSuccess={handleRefreshAfterPayment}
          stripePaymentElementConfig={stripePaymentElementConfig}
        />
      )}
    </PageContentContainer>
  );
};

export default React.memo(ConsumerInvoicePageReworked);
