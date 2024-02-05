import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardDescription from '#libs/consumer-space/components/reworked/common/ConsumerCardDescription';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';

type Props = {
  description: string;
};

const ConsumerPaymentPackDetailsCardDescriptionSection: React.FC<Props> = ({
  description,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-payment-pack-details-card__description',
        {
          'bs-consumer-payment-pack-details-card__description--hidden':
            !description,
        },
      )}
      title={t('reworked.myPasses.consumerPassDetailsCard.description.title')}
    >
      <ConsumerCardDescription description={description} />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPaymentPackDetailsCardDescriptionSection);
