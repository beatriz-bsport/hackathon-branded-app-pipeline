import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Typography from '#Fabrique/Typography';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { ConsumerPassRestriction } from '#src/libs/consumer-space/types';

type Props = {
  restrictions: ConsumerPassRestriction[];
};

const ConsumerPaymentPackDetailsCardRestrictionSection: React.FC<Props> = ({
  restrictions,
}) => {
  const { t } = useTranslation('consumerSpace');

  const contents =
    restrictions?.map((restriction) => {
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
      return content;
    }) ?? [];

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-payment-pack-details-card__restriction-section',
        {
          'bs-consumer-payment-pack-details-card__restriction-section--hidden':
            !contents.length,
        },
      )}
      title={t('reworked.myPasses.consumerPassDetailsCard.restriction.title')}
    >
      {contents.map((content) => (
        <Typography
          key={content}
          className="bs-consumer-payment-pack-details-card__restriction-section__text"
          variant="body-sm"
        >
          {content}
        </Typography>
      ))}
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPaymentPackDetailsCardRestrictionSection);
