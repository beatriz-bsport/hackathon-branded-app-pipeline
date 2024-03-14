import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  AnnotationX,
  CheckCircle,
  RefreshCW05,
  SVGComponentProps,
} from '#components/untitledui';
import Chip from '#Fabrique/Chip';

import '../../styles.css';

type Props = {
  paymentReceived: boolean | null;
};

type ChipDataType = {
  label: string;
  color: 'info' | 'error' | 'success';
  LeftIcon: React.FC<SVGComponentProps>;
};

const ConsumerInvoiceDisputeChip: React.FC<Props> = ({ paymentReceived }) => {
  const { t } = useTranslation('consumerSpace');

  const chipData: ChipDataType = React.useMemo(() => {
    switch (paymentReceived) {
      case null: // Dispute is processing
        return {
          label: t('reworked.myInvoices.detailsCard.dispute.processing'),
          color: 'info',
          LeftIcon: RefreshCW05,
        };
      case true: // Dispute is won for the customer (lost for manager)
        return {
          label: t('reworked.myInvoices.detailsCard.dispute.won'),
          color: 'success',
          LeftIcon: CheckCircle,
        };
      default: // Dispute is lost for the customer (won for manager)
        return {
          label: t('reworked.myInvoices.detailsCard.dispute.lost'),
          color: 'error',
          LeftIcon: AnnotationX,
        };
    }
  }, [paymentReceived, t]);

  return (
    <Chip
      className="bs-consumer-invoice-details-card__body__payment-section__item-dispute-chip"
      color={chipData.color}
      leftIcon={<chipData.LeftIcon stroke="currentColor" />}
      size="sm"
      variant="weak"
    >
      {chipData.label}
    </Chip>
  );
};

export default React.memo(ConsumerInvoiceDisputeChip);
