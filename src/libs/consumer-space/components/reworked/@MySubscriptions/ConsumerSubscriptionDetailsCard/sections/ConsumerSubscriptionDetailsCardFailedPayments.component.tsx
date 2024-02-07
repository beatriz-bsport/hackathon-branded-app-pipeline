import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';

import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Alert from '#Fabrique/Alert';

import { formatAsDatetimeAdapted } from '#utils/datetime';
import { getCurrencyDisplay } from '#libs/theme/selectors';

import type { ConsumerSubscriptionDetailsCardProps } from '..';

type Props = Pick<ConsumerSubscriptionDetailsCardProps, 'failedInvoices'>;

const ConsumerSubscriptionDetailsCardFailedPayments: React.FC<Props> = ({
  failedInvoices,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
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
                captionText={`${payment.price.toString()}${getCurrencyDisplay()}`}
                classes={{
                  label:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__title',
                  captionText:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__caption-text',
                }}
                className="bs-consumer__subscription-details-card__failed_payments__section__list-item"
                label={formatAsDatetimeAdapted(invoice.date, 'L')}
              />
              <Alert
                key={`${payment.uuid}-alert`}
                className="bs-consumer__subscription-details-card__failed_payments__section__alert"
                color="error"
              >
                {t(
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
