import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import Alert from '#Fabrique/Alert';

import { getSubscriptionTextBasedOnCouponApplied } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/utils';
import {
  BellRinging04,
  ClockRefresh,
  PauseCircle,
} from '#src/components/untitledui';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { formatAsDate } from '#src/utils/datetime';
import type { ConsumerSubscriptionDetailsCardProps } from '..';
import ConsumerSubscriptionRecurrenceLabel from '../../ConsumerSubscriptionRecurrenceLabel';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'autoRenewalDate'
  | 'hasAutoRenewal'
  | 'isPaused'
  | 'joiningFee'
  | 'lastInvoiceDateBeforeRenewal'
  | 'pauseEndDate'
  | 'price'
  | 'recurrenceBasis'
  | 'recurrentPrice'
  | 'selectedSubscriptionsFuturePauses'
  | 'subscriptionInterval'
  | 'subscriptionName'
  | 'subscriptionNextPaymentDate'
  | 'subtitleDate'
>;

const ConsumerSubscriptionDetailsCardHeader: React.FC<Props> = ({
  autoRenewalDate,
  hasAutoRenewal,
  isPaused,
  joiningFee,
  lastInvoiceDateBeforeRenewal,
  pauseEndDate,
  price,
  recurrenceBasis,
  recurrentPrice,
  selectedSubscriptionsFuturePauses,
  subscriptionInterval,
  subscriptionName,
  subscriptionNextPaymentDate,
  subtitleDate,
}) => {
  const { t } = useTranslation(['consumerSpace', 'subscription']);
  const recurrentPriceDisplayed = getSubscriptionTextBasedOnCouponApplied(
    lastInvoiceDateBeforeRenewal,
    recurrenceBasis,
    recurrentPrice,
    subscriptionInterval,
    t,
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
        {selectedSubscriptionsFuturePauses?.map((pause) => (
          <Alert key={pause.id} color="grey" variant="weak">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.futurePauses',
              {
                dateStart: formatAsDate(pause.from_date),
                dateEnd: formatAsDate(pause.date_ended),
              },
            )}
          </Alert>
        ))}
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
          captionText={`${recurrentPriceDisplayed}${
            recurrentPriceDisplayed && '\n'
          } ${
            joiningFee &&
            t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.headerListItemLabels.joiningFee',
              { fees: `${getCurrencyDisplayWithPrice(joiningFee)}` },
            )
          }`}
          classes={{
            captionText: classNames(
              'bs-consumer__subscription-details-card__header__list-item__price__caption-text',
              {
                'bs-consumer__subscription-details-card__header__list-item--hidden':
                  parseFloat(joiningFee) === 0 && !recurrentPriceDisplayed,
              },
            ),
          }}
          className="bs-consumer__subscription-details-card__header__list-item__price"
          label={
            <ConsumerSubscriptionRecurrenceLabel
              price={price}
              recurrenceBasis={recurrenceBasis}
              subscriptionInterval={subscriptionInterval}
            />
          }
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardHeader);
