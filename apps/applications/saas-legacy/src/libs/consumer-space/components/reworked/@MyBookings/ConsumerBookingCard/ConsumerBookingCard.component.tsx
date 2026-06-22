import React from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import {
  ConsumerBookingCardHeader,
  ConsumerBookingCardBody,
  ConsumerBookingCardFooter,
} from './sections';
import type { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import './styles.css';

type Props = {
  isLoading?: boolean;
  offerDate?: string;
  activityName?: string;
  coachPhoto?: string;
  coachName?: string;
  establishmentAddress?: string;
  isOnline?: boolean;
  isBookable?: boolean;
  isBookingCancelled?: boolean;
  isBookedForAGuest?: boolean;
  isJoinableOnline?: boolean;
  isJoinableOnlineDisabled?: boolean;
  isUnpaid?: boolean;
  isAtHome?: boolean;
  isDetailsDisabled?: boolean;
  isItemInThePast?: boolean;
  isBookableDisabled?: boolean;
  onDetailsClick?: () => void;
  onBookClick?: () => void;
  onBookingCancelClick?: () => void;
  onBookingForAGuestClick?: () => void;
  onJoinOnlineClick?: () => void;
  onSpotSchedulingClick?: () => void;
  spotSchedulingPosition?: string;
  isNoShow?: boolean;
  isCancellable?: boolean;
  isBookableForAGuest?: boolean;
  className?: string;
  isSelected?: boolean;
  displayWaitingListPosition?: boolean;
  waitingListPosition?: OfferStatusWaitingListPosition;
  isMobile?: boolean;
};

const ConsumerBookingCard: React.FC<Props> = ({
  isLoading,
  offerDate,
  coachName,
  className,
  activityName,
  coachPhoto,
  establishmentAddress,
  isDetailsDisabled,
  isItemInThePast,
  isBookableDisabled,
  isJoinableOnlineDisabled,
  onDetailsClick,
  onBookClick,
  onBookingCancelClick,
  onBookingForAGuestClick,
  onJoinOnlineClick,
  onSpotSchedulingClick,
  spotSchedulingPosition,
  isBookable,
  isBookingCancelled,
  isJoinableOnline,
  isOnline,
  isBookedForAGuest,
  isUnpaid,
  isAtHome,
  isNoShow,
  isCancellable,
  isBookableForAGuest,
  isSelected,
  displayWaitingListPosition,
  waitingListPosition,
  isMobile,
}) => {
  if (isLoading) {
    return <ConsumerCardSkeleton />;
  }

  return (
    <Card
      className={clsx(
        'bs-consumer-booking-card__root',
        'bs-consumer-page-root__bookings__list__item',
        {
          'bs-consumer-booking-card__root--canceled': isBookingCancelled,
        },
        className,
      )}
      variant={isSelected ? 'elevated' : 'rest'}
    >
      <ConsumerBookingCardHeader
        activityName={activityName}
        isAtHome={isAtHome}
        isBookedForAGuest={isBookedForAGuest}
        isBookingCancelled={isBookingCancelled}
        isNoShow={isNoShow}
        isOnline={isOnline}
        isUnpaid={isUnpaid}
        offerDate={offerDate}
      />
      <div className="bs-consumer-booking-card__container">
        <ConsumerBookingCardBody
          coachName={coachName}
          coachPhoto={coachPhoto}
          displayWaitingListPosition={displayWaitingListPosition}
          establishmentAddress={establishmentAddress}
          isBookingCancelled={isBookingCancelled}
          isDetailsDisabled={isDetailsDisabled}
          onDetailsClick={onDetailsClick}
          onSpotSchedulingClick={onSpotSchedulingClick}
          spotSchedulingPosition={spotSchedulingPosition}
          waitingListPosition={waitingListPosition}
        />
        {!isBookingCancelled && (!isItemInThePast || isJoinableOnline) && (
          <ConsumerBookingCardFooter
            isBookable={isBookable}
            isBookableDisabled={isBookableDisabled}
            isBookableForAGuest={isBookableForAGuest}
            isCancelDisabled={isItemInThePast}
            isCancellable={isCancellable}
            isJoinableOnline={isJoinableOnline}
            isJoinableOnlineDisabled={isJoinableOnlineDisabled}
            isMobile={isMobile}
            onBookClick={onBookClick}
            onBookingCancelClick={onBookingCancelClick}
            onBookingForAGuestClick={onBookingForAGuestClick}
            onJoinOnlineClick={onJoinOnlineClick}
          />
        )}
      </div>
    </Card>
  );
};

export const ConsumerBookingCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerBookingCard>>()(
    ConsumerBookingCard,
  );

export default React.memo(ConsumerBookingCard);
