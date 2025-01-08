import React from 'react';
import { useTranslation } from 'react-i18next';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/master-data/personalization.js';

import useConsumerBookingDateTime from '#src/libs/consumer-space/components/reworked/@MyBookings/hooks/useConsumerBookingDateTime';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import type { ConsumerBooking } from '#src/libs/booking/types';

type Props = {
  workshopLinkedOffers?: ConsumerBooking[];
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  timezoneName: string;
};

type WorkshopLinkedOfferProps = Pick<
  Props,
  'timezoneName' | 'sessionTimeDisplay'
> & {
  item: ConsumerBooking;
};

const WorkshopLinkedOfferItem: React.FC<WorkshopLinkedOfferProps> = React.memo(
  ({ item, timezoneName, sessionTimeDisplay }) => {
    const selectedBookingDate = useConsumerBookingDateTime({
      dateStart: item?.offer?.date_start,
      durationMinute: item?.offer?.duration_minute,
      establishmentTimezoneName: item?.establishment?.tzname,
      isMetaActivityBroadcast: item?.meta_activity?.is_broadcast,
      sessionTimeDisplay,
      timezoneName,
    });
    return (
      <ListItem
        captionText={item.meta_activity.name}
        classes={{
          label:
            'bs-consumer-booking-details-card__workshop-section__list__item__label',
        }}
        className="bs-consumer-booking-details-card__workshop-section__list__item"
        label={selectedBookingDate}
      />
    );
  },
);

const ConsumerBookingDetailsCardWorkshopSection: React.FC<Props> = ({
  workshopLinkedOffers,
  sessionTimeDisplay,
  timezoneName,
}) => {
  const { t } = useTranslation('consumerSpace');
  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__workshop-section"
      title={t('consumerSpace:reworked.myBookings.detailsCard.workshop.title')}
    >
      <List className="bs-consumer-booking-details-card__workshop-section__list">
        {workshopLinkedOffers.map((linkedBooking) => (
          <WorkshopLinkedOfferItem
            key={linkedBooking.id}
            item={linkedBooking}
            sessionTimeDisplay={sessionTimeDisplay}
            timezoneName={timezoneName}
          />
        ))}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardWorkshopSection);
