import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSubscriptionDetailsCardProps } from '..';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';

import { getSubscriptionRecurrenceLabel } from '#libs/consumer-space/components/reworked/@MySubscriptions/utils';
import {
  BellRinging04,
  ClockRefresh,
  PauseCircle,
} from '#components/untitledui';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'subscriptionName'
  | 'subtitleDate'
  | 'subscriptionNextPaymentDate'
  | 'recurrence'
  | 'price'
  | 'subscriptionInterval'
  | 'isPaused'
  | 'hasAutoRenewal'
  | 'pauseEndDate'
  | 'autoRenewalDate'
>;

const ConsumerSubscriptionDetailsCardHeader: React.FC<Props> = ({
  subscriptionName,
  subtitleDate,
  subscriptionNextPaymentDate,
  recurrence,
  price,
  subscriptionInterval,
  isPaused,
  hasAutoRenewal,
  pauseEndDate,
  autoRenewalDate,
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
        <ListItem
          captionText={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.pauseEndDate',
            { pauseEndDate },
          )}
          classes={{
            label:
              'bs-consumer__subscription-details-card__header__list-item__text--paused',
            captionText:
              'bs-consumer__subscription-details-card__header__list-item__text--paused',
          }}
          className={classNames(
            'bs-consumer__subscription-details-card__header__list-item--paused',
            {
              'bs-consumer__subscription-details-card__header__list-item--paused--hidden':
                !isPaused,
            },
          )}
          icon={<PauseCircle stroke="currentColor" />}
          label={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.paused',
          )}
        />
        <ListItem
          captionText={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.autoRenewalDate',
            { autoRenewalDate },
          )}
          classes={{
            label:
              'bs-consumer__subscription-details-card__header__list-item__text--auto-renewed',
            captionText:
              'bs-consumer__subscription-details-card__header__list-item__text--auto-renewed',
          }}
          className={classNames(
            'bs-consumer__subscription-details-card__header__list-item--auto-renewed',
            {
              'bs-consumer__subscription-details-card__header__list-item--hidden':
                !hasAutoRenewal,
            },
          )}
          icon={<ClockRefresh stroke="currentColor" />}
          label={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.autoRenewed',
          )}
        />
        {subscriptionNextPaymentDate && (
          <ListItem
            captionText={t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.nextPaymentDate',
              { subscriptionNextPaymentDate },
            )}
            className={classNames(
              'bs-consumer__subscription-details-card__header__list-item__status',
              {
                'bs-consumer__subscription-details-card__header__list-item--hidden':
                  !subscriptionNextPaymentDate,
              },
            )}
            icon={<BellRinging04 stroke="currentColor" />}
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
