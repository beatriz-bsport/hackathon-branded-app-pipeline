import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerCardDescription from '#libs/consumer-space/components/reworked/common/ConsumerCardDescription';

type Props = {
  description?: string;
};

const ConsumerBookingDetailsCardDescriptionSection: React.FC<Props> = ({
  description,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__description-section"
      title={t(
        'consumerSpace:reworked.myBookings.detailsCard.description.title',
      )}
    >
      <ConsumerCardDescription
        classes={{
          text: 'bs-consumer-booking-details-card__description-section__description',
        }}
        description={description}
      />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardDescriptionSection);
