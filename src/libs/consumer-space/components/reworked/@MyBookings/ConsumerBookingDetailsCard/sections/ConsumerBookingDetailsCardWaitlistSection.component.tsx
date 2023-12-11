import React from 'react';
import { useTranslation } from 'react-i18next';

import { HourGlass03 } from '#components/untitledui';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

type Props = {
  waitlistPosition: number;
};

const ConsumerBookingDetailsCardWaitlistSection: React.FC<Props> = ({
  waitlistPosition,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection className="bs-consumer-booking-details-card__waitlist-section">
      <List className="bs-consumer-booking-details-card__waitlist-section__list">
        <ListItem
          className="bs-consumer-booking-details-card__waitlist-section__list__item"
          icon={<HourGlass03 stroke="currentColor" />}
          label={t(
            'consumerSpace:reworked.myBookings.detailsCard.waitlist.position',
            { position: waitlistPosition },
          )}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardWaitlistSection);
