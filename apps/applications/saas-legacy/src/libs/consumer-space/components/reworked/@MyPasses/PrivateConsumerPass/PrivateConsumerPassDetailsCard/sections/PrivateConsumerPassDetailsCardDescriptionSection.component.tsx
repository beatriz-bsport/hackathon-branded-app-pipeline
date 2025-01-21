import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ConsumerCardDescription from '#src/libs/consumer-space/components/reworked/common/ConsumerCardDescription';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

type Props = {
  description: string;
};

const PrivateConsumerPassDetailsCardDescriptionSection: React.FC<Props> = ({
  description,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={clsx('bs-private-consumer-pass-details-card__description', {
        'bs-private-consumer-pass-details-card__description--hidden':
          !description,
      })}
      title={t('reworked.myPasses.consumerPassDetailsCard.description.title')}
    >
      <ConsumerCardDescription description={description} />
    </ConsumerCardSection>
  );
};

export default React.memo(PrivateConsumerPassDetailsCardDescriptionSection);
