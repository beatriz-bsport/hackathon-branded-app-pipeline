import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertCircle,
  Building08,
  CalendarDate,
  Coins04,
  CreditCardX,
} from '#components/untitledui';
import { ConsumerGenericCardHeader } from '#libs/consumer-space/components/reworked/common/ConsumerCard';
import { formatAsDatetimeAdapted } from '#utils/datetime';
import { InvoicesFiltersEnum } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import { useConsumerInvoiceTitle } from '#libs/consumer-space/components/reworked/@MyInvoices/helpers/hooks';

import type { ChipColor } from '#Fabrique/Chip';
import type { ConsumerInvoice } from '#libs/invoice/types';

import '../styles.css';

type Props = {
  consumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
};

const ConsumerInvoiceCardHeader: React.FC<Props> = ({
  consumerInvoice,
  selectedFilter,
}) => {
  const { t } = useTranslation('consumerSpace');

  const title = useConsumerInvoiceTitle(
    consumerInvoice?.invoice_legal_identifier,
    consumerInvoice?.uuid,
  );

  const invoiceDate = React.useMemo(
    () => formatAsDatetimeAdapted(consumerInvoice?.date, 'L'),
    [consumerInvoice?.date],
  );

  const successfulPayments = React.useMemo(
    () =>
      consumerInvoice?.payments?.filter(
        (payment) =>
          !!payment &&
          payment.payment_received &&
          !consumerInvoice?.disputed_payments?.includes(payment.id),
      ) || [],
    [consumerInvoice?.disputed_payments, consumerInvoice?.payments],
  );

  const chipsDataList = React.useMemo(
    () => [
      {
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.UNPAID &&
          consumerInvoice?.disputed_payments?.length > 0,
        chipColor: 'grey' as ChipColor,
        leftIcon: <Building08 stroke="currentColor" />,
        text: t('reworked.myInvoices.card.chip.dispute'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.UNPAID &&
          successfulPayments.length > 0,
        chipColor: 'warning' as ChipColor,
        leftIcon: <Coins04 stroke="currentColor" />,
        text: t('reworked.myInvoices.card.chip.partiallyPaid'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay:
          [InvoicesFiltersEnum.UNPAID, InvoicesFiltersEnum.PAID].includes(
            selectedFilter,
          ) && consumerInvoice?.plannedpaymentevent_set?.length > 0,
        chipColor: 'success' as ChipColor,
        leftIcon: <CalendarDate stroke="currentColor" />,
        text: t('reworked.myInvoices.card.chip.plannedPayments'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.REFUNDED &&
          consumerInvoice?.reverted &&
          successfulPayments.length > 0,
        chipColor: 'info' as ChipColor,
        leftIcon: <CreditCardX stroke="currentColor" />,
        text: t('reworked.myInvoices.card.chip.refunded'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
      {
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.REFUNDED &&
          consumerInvoice?.reverted &&
          !(successfulPayments.length > 0),
        chipColor: 'error' as ChipColor,
        leftIcon: <AlertCircle stroke="currentColor" />,
        text: t('reworked.myInvoices.card.chip.cancelled'),
        chipClassName: 'bs-consumer__booking-card__header__chip',
      },
    ],
    [
      consumerInvoice?.disputed_payments?.length,
      consumerInvoice?.plannedpaymentevent_set?.length,
      consumerInvoice?.reverted,
      selectedFilter,
      successfulPayments.length,
      t,
    ],
  );

  return (
    <ConsumerGenericCardHeader
      chipsDataList={chipsDataList}
      chipsWrapperClassName="bs-consumer-invoice-card__header__chips-wrapper"
      className="bs-consumer-invoice-card__header"
      subtitle={invoiceDate}
      title={title}
    />
  );
};

export default React.memo(ConsumerInvoiceCardHeader);
