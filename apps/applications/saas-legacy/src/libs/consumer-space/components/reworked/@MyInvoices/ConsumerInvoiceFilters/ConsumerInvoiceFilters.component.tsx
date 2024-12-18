import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericFilters from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFilters';
import { InvoicesFiltersEnum } from '.';

type Props = {
  selectedFilter: InvoicesFiltersEnum;
  unpaidInvoicesCount: number;
  onChangeFilter: (type: InvoicesFiltersEnum) => void;
};

export const ConsumerInvoiceFilters: React.FC<Props> = ({
  selectedFilter,
  unpaidInvoicesCount,
  onChangeFilter,
}) => {
  const { t } = useTranslation('consumerSpace');

  const filterUnpaidInvoices = React.useCallback(
    () => onChangeFilter(InvoicesFiltersEnum.UNPAID),
    [onChangeFilter],
  );

  const filterPaidInvoices = React.useCallback(
    () => onChangeFilter(InvoicesFiltersEnum.PAID),
    [onChangeFilter],
  );

  const filterRefundedInvoices = React.useCallback(
    () => onChangeFilter(InvoicesFiltersEnum.REFUNDED),
    [onChangeFilter],
  );

  const filters = React.useMemo(
    () => [
      {
        hasBadge: unpaidInvoicesCount > 0,
        type: InvoicesFiltersEnum.UNPAID,
        label: t('reworked.myInvoices.header.filters.unpaid'),
        onClick: filterUnpaidInvoices,
        value: unpaidInvoicesCount,
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
      unpaidInvoicesCount,
      t,
      filterUnpaidInvoices,
      filterPaidInvoices,
      filterRefundedInvoices,
    ],
  );
  return (
    <ConsumerGenericFilters<InvoicesFiltersEnum>
      filters={filters}
      selectedTab={selectedFilter}
    />
  );
};

export default React.memo(ConsumerInvoiceFilters);
