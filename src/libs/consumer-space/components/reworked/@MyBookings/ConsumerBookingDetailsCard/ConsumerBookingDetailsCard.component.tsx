import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';

import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerBookingDetailsCardSkeleton from './ConsumerBookingDetailsCardSkeleton.component';
import ConsumerBookingDetailsCardHeaderSection from './sections/ConsumerBookingDetailsCardHeaderSection.component';
import ConsumerBookingDetailsCardCancelledSection from './sections/ConsumerBookingDetailsCardCancelledSection.component';
import ConsumerBookingDetailsCardPassSection from './sections/ConsumerBookingDetailsCardPassSection.component';
import ConsumerBookingDetailsCardLocationSection from './sections/ConsumerBookingDetailsCardLocationSection.component';
import ConsumerBookingDetailsCardDescriptionSection from './sections/ConsumerBookingDetailsCardDescriptionSection.component';
import ConsumerBookingDetailsCardWaitlistSection from './sections/ConsumerBookingDetailsCardWaitlistSection.component';
import ConsumerBookingDetailsCardPolicySection from './sections/ConsumerBookingDetailsCardPolicySection.component';
import ConsumerBookingDetailsCardTeacherSection from './sections/ConsumerBookingDetailsCardTeacherSection.component';
import ConsumerBookingDetailsCardWorkshopSection from './sections/ConsumerBookingDetailsCardWorkshopSection.component';

import type { ConsumerBooking } from '#libs/booking/types';

import './styles.css';

export type Props = {
  /**  Optional CSS class name to pass to the root element */
  className?: string;
  /** If `true` the placeholder will be displayed instead */
  showPlaceholder?: boolean;
  /** Whether the card is in loading state or not */
  isLoading?: boolean;
  /** The formatted date of the offer */
  date: string;
  /** The time display configuration retrieved from the company offer */
  sessionTimeDisplay: MarketPlaceSessionTimeDisplay;
  /** The name of the timezone retrieved from the company offer */
  timezoneName: string;
  /** Optional picture from the offer's activity */
  metaActivityPicture: string;
  /** The name of the activity related to the offer */
  metaActivityName: string;
  /** The level name associated to the offer */
  levelName: string;
  /** Whether the booking has been cancelled or not */
  isCancelled?: boolean;
  /** The number of credits to refund after the booking cancellation */
  creditsToRefund?: number;
  /** The date of when the booking has been cancelled */
  cancellationDate?: string;
  /** Whether the booking has been cancelled by the manager or not */
  isCancelledFromManager?: boolean;
  /** Whether the booking has been cancelled lately and is not eligible for a refund */
  isLateCancellation?: boolean;
  /** Name of the pass the member booked with */
  paymentPackName?: string;
  /** Whether the pass of the member is disabled or not */
  isConsumerPaymentPackDisabled?: boolean;
  /** Optional penalty start date on the member's pass */
  consumerPaymentPackPenaltyDisabledFrom?: string;
  /** Optional penalty end date on the member's pass */
  consumerPaymentPackPenaltyDisabledUntil?: string;
  /** The number of remaining credits on the member's pass */
  consumerPaymentPackAvailableCredits: number;
  /** The number of used credits on the member's pass */
  consumerPaymentPackUsedCredits: number;
  /** The initial number of the pass bought by the member */
  paymentPackTotalCredits: number;
  /** Whether the member's pass has unlimited credits or not */
  isPaymentPackUnlimited?: boolean;
  /** Optional room name to display above of the establishment address */
  establishmentRoomName?: string;
  /** The address of the establishment related to the offer */
  establishmentAddress: string;
  /** The description related to the offer's activity */
  description: string;
  /** Optional member position in the waitlist if any */
  waitlistPosition?: number;
  /** The policy for cancellations related to the offer's activity (duration in minutes) */
  metaActivityLastDiscardMinutes: number;
  /** Optional picture of the original teacher */
  coachPicture?: string;
  /** Name of the original teacher */
  coachName: string;
  /** Optional description of the original teacher */
  coachDescription?: string;
  /** Optional picture of the substitute teacher */
  coachOverridePicture?: string;
  /** Optional name of the substitute teacher */
  coachOverrideName?: string;
  /** Optional description of the substitute teacher */
  coachOverrideDescription?: string;
  /** Optional URL of the teacher's facebook profile */
  coachFacebookURL?: string;
  /** Optional URL of the teacher's instagram profile */
  coachInstagramURL?: string;
  /** If the offer's meta activity is from a workshop, these are the similar offers from the same workshop */
  workshopLinkedOffers?: ConsumerBooking[];
};

const ConsumerBookingDetailsCard: React.FC<Props> = ({
  className,
  showPlaceholder,
  isLoading,
  date,
  sessionTimeDisplay,
  timezoneName,
  metaActivityPicture,
  metaActivityName,
  levelName,
  isCancelled,
  creditsToRefund,
  cancellationDate,
  isCancelledFromManager,
  isLateCancellation,
  paymentPackName,
  isConsumerPaymentPackDisabled,
  consumerPaymentPackPenaltyDisabledFrom,
  consumerPaymentPackPenaltyDisabledUntil,
  consumerPaymentPackAvailableCredits,
  consumerPaymentPackUsedCredits,
  isPaymentPackUnlimited,
  paymentPackTotalCredits,
  establishmentRoomName,
  establishmentAddress,
  description,
  waitlistPosition,
  metaActivityLastDiscardMinutes,
  coachPicture,
  coachName,
  coachDescription,
  coachOverridePicture,
  coachOverrideName,
  coachOverrideDescription,
  coachFacebookURL,
  coachInstagramURL,
  workshopLinkedOffers,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (showPlaceholder) {
    return (
      <ConsumerCardPlaceholder
        message={t('consumerSpace:reworked.placeholderCard.myBookings')}
      />
    );
  }

  if (isLoading) {
    return <ConsumerBookingDetailsCardSkeleton />;
  }

  return (
    <Card className={classNames('bs-consumer-booking-details-card', className)}>
      <ConsumerBookingDetailsCardHeaderSection
        date={date}
        levelName={levelName}
        metaActivityName={metaActivityName}
        metaActivityPicture={metaActivityPicture}
      />

      {isCancelled && (
        <ConsumerBookingDetailsCardCancelledSection
          cancellationDate={cancellationDate}
          creditsToRefund={creditsToRefund}
          isCancelledFromManager={isCancelledFromManager}
          isLateCancellation={isLateCancellation}
        />
      )}

      {!!paymentPackName && (
        <ConsumerBookingDetailsCardPassSection
          consumerPaymentPackAvailableCredits={
            consumerPaymentPackAvailableCredits
          }
          consumerPaymentPackPenaltyDisabledFrom={
            consumerPaymentPackPenaltyDisabledFrom
          }
          consumerPaymentPackPenaltyDisabledUntil={
            consumerPaymentPackPenaltyDisabledUntil
          }
          consumerPaymentPackUsedCredits={consumerPaymentPackUsedCredits}
          isConsumerPaymentPackDisabled={isConsumerPaymentPackDisabled}
          isPaymentPackUnlimited={isPaymentPackUnlimited}
          paymentPackName={paymentPackName}
          paymentPackTotalCredits={paymentPackTotalCredits}
        />
      )}

      <ConsumerBookingDetailsCardLocationSection
        establishmentAddress={establishmentAddress}
        establishmentRoomName={establishmentRoomName}
      />

      <ConsumerBookingDetailsCardDescriptionSection description={description} />

      {!!waitlistPosition && (
        <ConsumerBookingDetailsCardWaitlistSection
          waitlistPosition={waitlistPosition}
        />
      )}

      <ConsumerBookingDetailsCardPolicySection
        metaActivityLastDiscardMinutes={metaActivityLastDiscardMinutes}
      />

      <ConsumerBookingDetailsCardTeacherSection
        coachDescription={coachDescription}
        coachFacebookURL={coachFacebookURL}
        coachInstagramURL={coachInstagramURL}
        coachName={coachName}
        coachOverrideDescription={coachOverrideDescription}
        coachOverrideName={coachOverrideName}
        coachOverridePicture={coachOverridePicture}
        coachPicture={coachPicture}
      />

      {workshopLinkedOffers?.length > 0 && (
        <ConsumerBookingDetailsCardWorkshopSection
          sessionTimeDisplay={sessionTimeDisplay}
          timezoneName={timezoneName}
          workshopLinkedOffers={workshopLinkedOffers}
        />
      )}
    </Card>
  );
};

export const ConsumerBookingDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerBookingDetailsCard>
>()(ConsumerBookingDetailsCard);

export default React.memo(ConsumerBookingDetailsCard);
