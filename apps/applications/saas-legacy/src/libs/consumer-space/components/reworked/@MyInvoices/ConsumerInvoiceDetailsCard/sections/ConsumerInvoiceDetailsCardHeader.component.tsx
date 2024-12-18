import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerGenericCardHeader } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { formatAsDatetimeAdapted } from '#src/utils/datetime';
import { useConsumerInvoiceTitle } from '#src/libs/consumer-space/components/reworked/@MyInvoices/helpers/hooks';

import type { ConsumerInvoice } from '#src/libs/invoice/types';

import '../styles.css';

type Props = {
  consumerInvoice: ConsumerInvoice;
  isMultilocationEnabled: boolean;
};

const ConsumerInvoiceDetailsCardHeader: React.FC<Props> = ({
  consumerInvoice,
  isMultilocationEnabled,
}) => {
  const { t } = useTranslation('consumerSpace');

  const title = useConsumerInvoiceTitle(
    consumerInvoice?.invoice_legal_identifier,
    consumerInvoice?.uuid,
  );

  const invoiceDate = React.useMemo(
    () => formatAsDatetimeAdapted(consumerInvoice?.date, 'D'),
    [consumerInvoice?.date],
  );

  const billingGroupLocationName = React.useMemo(
    () =>
      isMultilocationEnabled &&
      consumerInvoice?.establishment_billing_group_name
        ? t('reworked.myInvoices.card.location', {
            name: consumerInvoice.establishment_billing_group_name,
          })
        : null,
    [
      consumerInvoice.establishment_billing_group_name,
      isMultilocationEnabled,
      t,
    ],
  );

  return (
    <ConsumerGenericCardHeader
      chipsDataList={[]}
      chipsWrapperClassName="bs-consumer-invoice-details-card__header__chips-wrapper"
      className="bs-consumer-invoice-details-card__header"
      description={billingGroupLocationName}
      subtitle={invoiceDate}
      title={title}
    />
  );
};

export default React.memo(ConsumerInvoiceDetailsCardHeader);
