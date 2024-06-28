import React, { useState } from 'react';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_INVOICE,
} from '@bsport/common/lib/master-data/payment-group';
import { useTranslation } from 'react-i18next';

import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import ConsumerInvoiceBodyContainer from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceBodyContainer';
import ConsumerInvoiceHeader from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceHeader';
import ConsumerInvoicePaymentPortal from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoicePaymentPortal';
import useViewport from '#Fabrique/hooks/useViewport';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';
import { ChevronRight } from '#src/components/untitledui';

import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';

import type { ConsumerInvoice, Invoice } from '#src/libs/invoice/types';
import type { Membership } from '#src/libs/membership/types';

import './styles.css';

type Props = {
  availablePaymentMethodList: number[];
  consumerInvoices: ConsumerInvoice[];
  detachPaymentMethodLoading: boolean;
  hasMoreInvoicesToFetch: boolean;
  isBodyLoading?: boolean;
  isConsumerAllowedToUseInternalAccount: boolean;
  isLoading?: boolean;
  isMultilocationEnabled: boolean;
  membership: Membership;
  selectedFilter: InvoicesFiltersEnum;
  totalUnpaid: number;
  applyBalanceToInvoice: (invoiceUuid: string) => void;
  changeSelectedFilter: (filter: InvoicesFiltersEnum) => void;
  detachPaymentMethod: (paymentMethodId: string) => void;
  fetchMoreInvoices: () => void;
  getInvoice: (uuid: string) => Invoice;
  goToBookSession: () => void;
  refreshConsumerInvoices: () => void;
  refreshMembership: () => void;
};

const ConsumerInvoicePageReworked: React.FC<Props> = ({
  availablePaymentMethodList,
  consumerInvoices,
  detachPaymentMethodLoading,
  hasMoreInvoicesToFetch,
  isBodyLoading,
  isConsumerAllowedToUseInternalAccount,
  isLoading,
  isMultilocationEnabled,
  membership,
  selectedFilter,
  totalUnpaid,
  applyBalanceToInvoice,
  changeSelectedFilter,
  detachPaymentMethod,
  fetchMoreInvoices,
  getInvoice,
  goToBookSession,
  refreshConsumerInvoices,
  refreshMembership,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [consumerInvoiceToPay, setConsumerInvoiceToPay] =
    useState<ConsumerInvoice | null>(null);

  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  const [clientSecretError, setClientSecretError] =
    React.useState<Error | null>(null);

  const [clientSecretLoading, setClientSecretLoading] = React.useState(false);

  const [paymentGroupId, setPaymentGroupId] = React.useState<number | null>(
    null,
  );

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

  const handleApplyBalanceToInvoice = React.useCallback(
    (invoiceUuid: string) => {
      applyBalanceToInvoice?.(invoiceUuid);
      closePaymentPortal();
    },
    [applyBalanceToInvoice, closePaymentPortal],
  );

  const handleRefreshAfterPayment = React.useCallback(() => {
    clearSelectedConsumerInvoice();
    refreshConsumerInvoices?.();
  }, [refreshConsumerInvoices, clearSelectedConsumerInvoice]);

  const requestClientSecret = React.useCallback((invoiceUuid: string) => {
    setClientSecret(null);
    setClientSecretError(null);
    setClientSecretLoading(true);
    setPaymentGroupId(null);

    requestClientSecretAPI(PAYMENT_ENGINE_STRIPE, PAYMENT_INTENT_TYPE_INVOICE, {
      invoice: invoiceUuid,
    })
      .then((response) => {
        setClientSecret(response.data.client_secret);
        setPaymentGroupId(response.data.payment_group);
        setClientSecretLoading(false);
      })
      .catch((error) => {
        setClientSecretError(error);
        setClientSecretLoading(false);
      });
  }, []);

  const isWidget = WidgetUtils.isWidget();

  const buttonsData: HeaderButton[] = React.useMemo(
    () =>
      isWidget
        ? []
        : [
            {
              label: t('reworked.myInvoices.header.buttons.bookSession'),
              onClick: goToBookSession,
              rightIcon: <ChevronRight stroke="currentColor" />,
            },
          ],
    [goToBookSession, t, isWidget],
  );

  return (
    <>
      <div
        className={
          isMobile && !!selectedConsumerInvoice
            ? 'bs-consumer-invoice-page__root__details--mobile'
            : 'bs-consumer-invoice-page__root'
        }
      >
        <ConsumerInvoiceHeader
          buttonsData={buttonsData}
          handleGoBack={clearSelectedConsumerInvoice}
          isLoading={isLoading}
          isMobile={isMobile}
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
          payConsumerInvoice={payConsumerInvoice}
          seeInvoiceDetails={seeInvoiceDetails}
          selectedConsumerInvoice={selectedConsumerInvoice}
          selectedFilter={selectedFilter}
        />
      </div>
      {!!consumerInvoiceToPay && (
        <ConsumerInvoicePaymentPortal
          applyBalanceToInvoice={handleApplyBalanceToInvoice}
          availablePaymentMethodList={availablePaymentMethodList}
          clientSecret={clientSecret}
          clientSecretError={clientSecretError}
          clientSecretLoading={clientSecretLoading}
          companyId={membership.company}
          consumerInvoice={consumerInvoiceToPay}
          creditAccountBalance={membership.credit_account_balance}
          detachPaymentMethod={detachPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          displayBottomDrawer={isMobile}
          isConsumerAllowedToUseInternalAccount={
            isConsumerAllowedToUseInternalAccount
          }
          isMultiLocalizationEnabled={isMultilocationEnabled}
          isOpen={!!consumerInvoiceToPay}
          memberId={membership.id}
          onClose={closePaymentPortal}
          onPaymentSuccess={handleRefreshAfterPayment}
          paymentGroupId={paymentGroupId}
          requestClientSecret={requestClientSecret}
        />
      )}
    </>
  );
};

export default React.memo(ConsumerInvoicePageReworked);
