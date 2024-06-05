import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Typography from '#Fabrique/Typography';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { ConsumerPassRestriction } from '#src/libs/consumer-space/types';

type Props = {
  restriction: ConsumerPassRestriction;
};

const PrivateConsumerPassDetailsCardRestrictionSection: React.FC<Props> = ({
  restriction,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { frequency, amount } = restriction;
  const frequencyMap = {
    day: 'frequencyDaily',
    week: 'frequencyWeekly',
    month: 'frequencyMonthly',
  };
  const content = frequencyMap?.[frequency]
    ? t(
        `reworked.myPasses.consumerPassDetailsCard.restriction.${frequencyMap[frequency]}`,
        {
          amount,
        },
      )
    : '';

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-private-consumer-pass-details-card__restriction-section',
        {
          'bs-private-consumer-pass-details-card__restriction-section--hidden':
            !content,
        },
      )}
      title={t('reworked.myPasses.consumerPassDetailsCard.restriction.title')}
    >
      <Typography
        className="bs-private-consumer-pass-details-card__restriction-section__text"
        variant="body-sm"
      >
        {content}
      </Typography>
    </ConsumerCardSection>
  );
};

export default React.memo(PrivateConsumerPassDetailsCardRestrictionSection);
