import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Button from '#Fabrique/ButtonV2';
import { Eye } from '#src/components/untitledui';
import type { ConsumerSubscriptionDetailsCardProps } from '..';

type Props = Required<
  Pick<ConsumerSubscriptionDetailsCardProps, 'termsDate' | 'onSeeClick'>
>;

const ConsumerSubscriptionDetailsCardTerms: React.FC<Props> = ({
  termsDate,
  onSeeClick,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer__subscription-details-card__terms__section"
      subtitle={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.termsAccepted',
        { termsDate },
      )}
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.terms',
      )}
    >
      <Button
        className="bs-consumer__subscription-details-card__terms__button"
        color="grey"
        leftIcon={<Eye stroke="currentColor" />}
        onClick={onSeeClick}
        size="md"
        variant="outlined"
      >
        {t(
          'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.see',
        )}
      </Button>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardTerms);
