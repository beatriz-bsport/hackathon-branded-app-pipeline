import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { Building01, MarkerPin04 } from '#src/components/untitledui';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

type Props = {
  establishmentTitle?: string;
  establishmentAddress: string;
};

const ConsumerBookingDetailsCardLocationSection: React.FC<Props> = ({
  establishmentTitle,
  establishmentAddress,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__location-section"
      title={t('consumerSpace:reworked.myBookings.detailsCard.location.title')}
    >
      <List className="bs-consumer-booking-details-card__location-section__list">
        <ListItem
          className={clsx(
            'bs-consumer-booking-details-card__location-section__list__item',
            {
              'bs-consumer-booking-details-card__location-section__list__item--hidden':
                !establishmentTitle,
            },
          )}
          icon={<Building01 stroke="currentColor" />}
          label={establishmentTitle}
          size="sm"
        />
        <ListItem
          className="bs-consumer-booking-details-card__location-section__list__item"
          icon={<MarkerPin04 stroke="currentColor" />}
          label={establishmentAddress}
          size="sm"
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardLocationSection);
