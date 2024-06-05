import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerCardDescription from '#libs/consumer-space/components/reworked/common/ConsumerCardDescription';
import type { ConsumerSubscriptionDetailsCardProps } from '..';

type Props = Pick<ConsumerSubscriptionDetailsCardProps, 'description'>;

const ConsumerSubscriptionDetailsCardDescription: React.FC<Props> = ({
  description,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer__subscription-details-card__description__section',
        {
          'bs-consumer__subscription-details-card__description__section--hidden':
            !description,
        },
      )}
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.description',
      )}
    >
      <ConsumerCardDescription
        classes={{
          text: 'bs-consumer__subscription-details-card__description__text',
        }}
        description={description}
      />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardDescription);
