import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardDescription from '#src/libs/consumer-space/components/reworked/common/ConsumerCardDescription';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

type Props = {
  description: string;
};

const UniversalPassDetailsCardDescriptionSection: React.FC<Props> = ({
  description,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames('bs-universal-pass-details-card__description', {
        'bs-universal-pass-details-card__description--hidden': !description,
      })}
      title={t('reworked.myPasses.consumerPassDetailsCard.description.title')}
    >
      <ConsumerCardDescription description={description} />
    </ConsumerCardSection>
  );
};

export default React.memo(UniversalPassDetailsCardDescriptionSection);
