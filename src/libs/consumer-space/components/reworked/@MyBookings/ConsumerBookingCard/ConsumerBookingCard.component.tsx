import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import {
  ConsumerBookingCardHeader,
  ConsumerBookingCardBody,
  ConsumerBookingCardFooter,
} from './sections';

import './styles.css';

type Props = {
  isLoading?: boolean;
  offerDate?: string;
  activityName?: string;
  coachPhoto?: string;
  coachName?: string;
  waitingListPosition?: string;
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
  isCancelDisabled?: boolean;
  isBookableDisabled?: boolean;
  isMoreDisabled?: boolean;
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
  menuId?: string;
  // TO BE REMOVED FROM PROPS AFTER INTEGRATION
  isMoreDisplayed?: boolean;
  className?: string;
  isSelected?: boolean;
};

const ConsumerBookingCard: React.FC<Props> = ({
  isLoading,
  offerDate,
  coachName,
  className,
  activityName,
  coachPhoto,
  establishmentAddress,
  waitingListPosition,
  isDetailsDisabled,
  isCancelDisabled,
  isMoreDisabled,
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
  menuId,
  // TO BE REMOVED FROM PROPS AFTER INTEGRATION
  isMoreDisplayed,
  isSelected,
}) => {
  if (isLoading) {
    return <ConsumerCardSkeleton />;
  }

  return (
    <Card
      className={classNames(
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
          establishmentAddress={establishmentAddress}
          isBookingCancelled={isBookingCancelled}
          isDetailsDisabled={isDetailsDisabled}
          onDetailsClick={onDetailsClick}
          onSpotSchedulingClick={onSpotSchedulingClick}
          spotSchedulingPosition={spotSchedulingPosition}
          waitingListPosition={waitingListPosition}
        />
        {!isBookingCancelled && (
          <ConsumerBookingCardFooter
            isBookable={isBookable}
            isBookableDisabled={isBookableDisabled}
            isBookableForAGuest={isBookableForAGuest}
            isCancelDisabled={isCancelDisabled}
            isCancellable={isCancellable}
            isJoinableOnline={isJoinableOnline}
            isJoinableOnlineDisabled={isJoinableOnlineDisabled}
            isMoreDisabled={isMoreDisabled}
            isMoreDisplayed={isMoreDisplayed}
            menuId={menuId}
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
