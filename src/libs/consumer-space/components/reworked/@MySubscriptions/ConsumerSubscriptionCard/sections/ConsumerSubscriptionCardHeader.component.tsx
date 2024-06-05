import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConsumerGenericCardHeader } from '#libs/consumer-space/components/reworked/common/ConsumerCard';

import type { ChipColor } from '#Fabrique/Chip';
import { AlertCircle, CreditCardX, PauseCircle } from '#components/untitledui';
import type { ConsumerSubscriptionCardProps } from '..';

type Props = Pick<
  ConsumerSubscriptionCardProps,
  | 'subscriptionDate'
  | 'subscriptionName'
  | 'isPaused'
  | 'hasFailedPayments'
  | 'hasMissingPaymentMethod'
>;

const ConsumerSubscriptionCardHeader: React.FC<Props> = ({
  subscriptionDate,
  subscriptionName,
  isPaused,
  hasFailedPayments,
  hasMissingPaymentMethod,
}) => {
  const { t } = useTranslation('consumerSpace');
  const chipsDataList = [
    {
      shouldDisplay: isPaused,
      chipColor: 'grey' as ChipColor,
      leftIcon: <PauseCircle stroke="currentColor" />,
      text: t(
        'reworked.mySubscriptions.consumerSubscriptionCard.chipsLabel.isPaused',
      ),
      chipClassName: 'bs-consumer__booking-card__header__chip',
    },
    {
      shouldDisplay: hasMissingPaymentMethod,
      chipColor: 'warning' as ChipColor,
      leftIcon: <AlertCircle stroke="currentColor" />,
      text: t(
        'reworked.mySubscriptions.consumerSubscriptionCard.chipsLabel.missingPaymentMethod',
      ),
      chipClassName: 'bs-consumer__booking-card__header__chip',
    },
    {
      shouldDisplay: hasFailedPayments,
      chipColor: 'error' as ChipColor,
      leftIcon: <CreditCardX stroke="currentColor" />,
      text: t(
        'reworked.mySubscriptions.consumerSubscriptionCard.chipsLabel.failedPayment',
      ),
      chipClassName: 'bs-consumer__booking-card__header__chip',
    },
  ];
  return (
    <ConsumerGenericCardHeader
      chipsDataList={chipsDataList}
      chipsWrapperClassName="bs-consumer__subscription-card__header__chips-wrapper"
      className="bs-consumer__subscription-card__header"
      subtitle={subscriptionDate}
      title={subscriptionName}
    />
  );
};

export default React.memo(ConsumerSubscriptionCardHeader);
