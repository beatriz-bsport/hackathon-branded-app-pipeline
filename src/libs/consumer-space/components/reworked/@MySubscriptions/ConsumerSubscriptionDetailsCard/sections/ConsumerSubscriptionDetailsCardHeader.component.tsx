import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSubscriptionDetailsCardProps } from '..';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';

import { getSubscriptionRecurrenceLabel } from '#libs/consumer-space/components/reworked/@MySubscriptions/utils';
import { BellRinging04 } from '#components/untitledui';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'subscriptionName'
  | 'subtitleDate'
  | 'subscriptionNextPaymentDate'
  | 'recurrence'
  | 'price'
  | 'subscriptionInterval'
>;

const ConsumerSubscriptionDetailsCardHeader: React.FC<Props> = ({
  subscriptionName,
  subtitleDate,
  subscriptionNextPaymentDate,
  recurrence,
  price,
  subscriptionInterval,
}) => {
  const { t } = useTranslation('consumerSpace');
  const recurrenceLabel = getSubscriptionRecurrenceLabel(
    recurrence,
    price,
    t,
    subscriptionInterval,
  );
  return (
    <ConsumerCardSection
      classes={{
        textContainer:
          'bs-consumer__subscription-details-card__header__text-container',
      }}
      className="bs-consumer__subscription-details-card__header__section"
      subtitle={subtitleDate}
      title={subscriptionName}
    >
      <List className="bs-consumer__subscription-details-card__header__list">
        {subscriptionNextPaymentDate && (
          <ListItem
            captionText={`on ${subscriptionNextPaymentDate}`}
            className="bs-consumer__subscription-details-card__header__list-item__status"
            icon={<BellRinging04 />}
            label={t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.nextPayment',
            )}
          />
        )}
        <ListItem
          className="bs-consumer__subscription-details-card__header__list-item__price"
          label={recurrenceLabel}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardHeader);
