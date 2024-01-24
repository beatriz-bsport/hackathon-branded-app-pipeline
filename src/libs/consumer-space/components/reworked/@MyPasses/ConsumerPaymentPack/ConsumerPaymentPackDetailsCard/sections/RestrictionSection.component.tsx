import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Typography from '#Fabrique/Typography';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { ConsumerPassRestriction } from '#libs/consumer-space/types';

type Props = {
  restriction: ConsumerPassRestriction;
};

const RestrictionSection: React.FC<Props> = ({ restriction }) => {
  const { t } = useTranslation('consumerSpace');
  const { frequency, amount } = restriction;
  let content = '';

  if (frequency === 'day') {
    content = t(
      'reworked.myPasses.consumerPassDetailsCard.restriction.frequencyDaily',
      {
        amount,
      },
    );
  } else if (frequency === 'month') {
    content = t(
      'reworked.myPasses.consumerPassDetailsCard.restriction.frequencyMonthly',
      {
        amount,
      },
    );
  } else if (frequency === 'week') {
    content = t(
      'reworked.myPasses.consumerPassDetailsCard.restriction.frequencyWeekly',
      {
        amount,
      },
    );
  }

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-payment-pack-details-card__restriction-section',
        {
          'bs-consumer-payment-pack-details-card__restriction-section--hidden':
            !content,
        },
      )}
      title={t('reworked.myPasses.consumerPassDetailsCard.restriction.title')}
    >
      <Typography
        className="bs-consumer-payment-pack-details-card__restriction-section__text"
        variant="body-sm"
      >
        {content}
      </Typography>
    </ConsumerCardSection>
  );
};

export default React.memo(RestrictionSection);
