import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronLeft } from '#src/components/untitledui';
import ConsumerHeaderSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerHeaderSkeleton';
import ConsumerInvoiceFilters, {
  InvoicesFiltersEnum,
} from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import Button from '#Fabrique/ButtonV2';
import ConsumerInvoiceTitleWithAction from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceTitleWithAction';
import Typography from '#Fabrique/Typography';

import type { ConsumerInvoice } from '#src/libs/invoice/types';

import './styles.css';

type Props = {
  isLoading?: boolean;
  isMobile?: boolean;
  selectedConsumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
  totalUnpaid: number;
  handleGoBack: () => void;
  onBookSession: () => void;
  onChangeFilter: (filter: InvoicesFiltersEnum) => void;
};

const ConsumerInvoiceHeader: React.FC<Props> = ({
  isLoading,
  isMobile,
  selectedConsumerInvoice,
  selectedFilter,
  totalUnpaid,
  handleGoBack,
  onBookSession,
  onChangeFilter,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isLoading) {
    return (
      <ConsumerHeaderSkeleton className="bs-consumer-invoice-page__header" />
    );
  }

  if (isMobile && !!selectedConsumerInvoice) {
    return (
      <div className="bs-consumer-invoice-page__header__go-back-button__container--mobile">
        <Button
          className="bs-consumer-invoice-page__header__go-back-button--mobile"
          color="grey"
          leftIcon={
            <ChevronLeft className="bs-consumer-invoice-page__header__go-back-button__icon--mobile" />
          }
          onClick={handleGoBack}
          size="md"
          variant="text"
        >
          <Typography
            align="center"
            className="bs-consumer-invoice-page__header__go-back-button__label--mobile"
            variant="body-lg"
          >
            {t('reworked.myInvoices.header.buttons.goBack')}
          </Typography>
        </Button>
      </div>
    );
  }

  return (
    <div className="bs-consumer-invoice-page__header">
      <ConsumerInvoiceTitleWithAction
        isMobile={isMobile}
        onBookSessionClick={onBookSession}
      />
      <ConsumerInvoiceFilters
        onChangeFilter={onChangeFilter}
        selectedFilter={selectedFilter}
        unpaidInvoicesCount={totalUnpaid}
      />
    </div>
  );
};

export default React.memo(ConsumerInvoiceHeader);
