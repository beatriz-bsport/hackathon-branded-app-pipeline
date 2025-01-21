import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChevronRight } from '#src/components/untitledui';
import { ConsumerGenericCardBodyContainer } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { convertCtsToFullPrice } from '#src/libs/consumer-space/components/reworked/@MyInvoices/helpers/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';

import type { ConsumerInvoice } from '#src/libs/invoice/types';

import '../styles.css';
import clsx from 'clsx';

type Props = {
  consumerInvoice: ConsumerInvoice;
  seeDetails: () => void;
};

const ConsumerInvoiceCardBody: React.FC<Props> = ({
  consumerInvoice,
  seeDetails,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer-invoice-card__body__container">
      <div className="bs-consumer-invoice-card__body__description">
        <Typography
          className="bs-consumer-invoice-card__body__description-title"
          variant="body-lg"
        >
          {consumerInvoice?.main_invoice_item_name}
        </Typography>
        {consumerInvoice?.invoice_items?.length > 1 && (
          <Typography className="bs-consumer-invoice-card__body__description-label">
            {t('reworked.myInvoices.card.otherItems', {
              count: consumerInvoice.invoice_items.length - 1,
            })}
          </Typography>
        )}
      </div>
      <div className="bs-consumer-invoice-card__body__price-section">
        <Typography
          className="bs-consumer-invoice-card__body__price"
          variant="title-md"
        >
          {getCurrencyDisplayWithPrice(
            convertCtsToFullPrice(consumerInvoice?.amount_due_cts),
          )}
        </Typography>
        <Typography
          className={clsx('bs-consumer-invoice-card__body__amount-due', {
            'bs-consumer-invoice-card__body__amount-due--hidden':
              !consumerInvoice?.amount_left_to_pay_cts,
          })}
          variant="body-md"
        >
          {t('reworked.myInvoices.card.amountDue', {
            amount: getCurrencyDisplayWithPrice(
              convertCtsToFullPrice(consumerInvoice?.amount_left_to_pay_cts),
            ),
          })}
        </Typography>
      </div>
      <Button
        className="bs-consumer-invoice-card__body__button"
        color="primary"
        onClick={seeDetails}
        rightIcon={<ChevronRight stroke="currentColor" />}
        size="md"
        variant="text"
      >
        {t('reworked.myInvoices.card.seeDetails')}
      </Button>
    </ConsumerGenericCardBodyContainer>
  );
};

export default React.memo(ConsumerInvoiceCardBody);
