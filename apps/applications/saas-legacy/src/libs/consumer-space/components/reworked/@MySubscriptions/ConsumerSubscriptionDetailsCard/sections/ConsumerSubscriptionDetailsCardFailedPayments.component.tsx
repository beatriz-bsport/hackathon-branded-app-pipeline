import React from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Alert from '#Fabrique/Alert';

import { formatAsDate } from '#src/utils/datetime';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { ConsumerSubscriptionDetailsCardProps } from '..';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  'failedInvoices' | 'invoiceRetryNumber'
>;

const ConsumerSubscriptionDetailsCardFailedPayments: React.FC<Props> = ({
  failedInvoices,
  invoiceRetryNumber,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer__subscription-details-card__failed_payments__section',
        {
          'bs-consumer__subscription-details-card__failed_payments__section--hidden':
            !failedInvoices?.length,
        },
      )}
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.failedPayment',
      )}
    >
      {failedInvoices?.map((invoice) => (
        <List key={invoice.uuid}>
          {invoice?.payments?.map((payment) => (
            <>
              <ListItem
                key={payment.uuid}
                captionText={getCurrencyDisplayWithPrice(
                  payment.price.toString(),
                )}
                classes={{
                  label:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__title',
                  captionText:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__caption-text',
                }}
                className="bs-consumer__subscription-details-card__failed_payments__section__list-item"
                label={formatAsDate(invoice.date)}
              />
              <Alert
                key={`${payment.uuid}-alert`}
                className="bs-consumer__subscription-details-card__failed_payments__section__alert"
                color="error"
              >
                {invoiceRetryNumber > 0
                  ? t(
                      'reworked.mySubscriptions.consumerSubscriptionCardDetails.failedPaymentReasonWithRetry',
                      {
                        note: payment.payment_note,
                        nextRetryDate: formatAsDate(invoice.next_retry_date),
                      },
                    )
                  : t(
                      'reworked.mySubscriptions.consumerSubscriptionCardDetails.failedPaymentReason',
                      { note: payment.payment_note },
                    )}
              </Alert>
            </>
          ))}
        </List>
      ))}
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardFailedPayments);
