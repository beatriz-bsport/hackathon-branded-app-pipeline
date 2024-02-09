import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import {
  ConsumerPaymentPackDetailsCardHeader,
  ConsumerPaymentPackDetailsCardDescriptionSection,
  ConsumerPaymentPackDetailsCardCompatibleEstablishmentsSection,
  ConsumerPaymentPackDetailsCardSharedSection,
  ConsumerPaymentPackDetailsCardRestrictionSection,
  ConsumerPaymentPackDetailsCardCompatibilitySection,
} from './sections';

import type { Establishment } from '#libs/establishment/types';
import type {
  ConsumerPassRestriction,
  ConsumerPaymentPackCompatibility,
  TimeSlot,
} from '#libs/consumer-space/types';

import './styles.css';

type Props = {
  /** If the pass is an activity pass, this props indicates which categories, activities or rooms are copatible with it */
  activityCompatibilities?: ConsumerPaymentPackCompatibility[];
  /** Custom class name */
  className?: string;
  /** List of the studios the pass is compatible with */
  compatibleEstablishments?: Establishment[];
  /** Number of credits available left */
  creditsLeft?: number;
  /** The pass description */
  description?: string;
  /** The pass expiration date */
  expirationDate?: string;
  /** The pass is compatible with booking for guests */
  isCompatibleWithBookingForGuest?: boolean;
  /** The pass is compatible with VOD */
  isCompatibleWithVod?: boolean;
  /** Loading property, to display skeleton */
  isLoading?: boolean;
  /** Should wrap the component in a card. Set it true in mobile version */
  isMobile?: boolean;
  /** The pass is suspended */
  isSuspended?: boolean;
  /** The pass has unlimited credits */
  isUnlimited?: boolean;
  /** The pass name */
  name: string;
  /** The pass restrictions data */
  restriction?: ConsumerPassRestriction;
  /** The pass is shared by this member (name only) */
  sharedBy?: string;
  /** The pass is shared with these members (names only) */
  sharedWith?: string[];
  /** The pass start date */
  startDate?: string;
  /** If no pass data, show placeholder instead */
  showPlaceholder?: boolean;
  /** The pass suspension date */
  suspensionDate?: string;
  /** The pass is compatible with these time slots */
  timeSlots?: TimeSlot[];
  /** The pass total initial credits */
  totalCredits?: number;
};

const ConsumerPaymentPackDetailsCard: React.FC<Props> = ({
  activityCompatibilities,
  className,
  compatibleEstablishments,
  creditsLeft,
  description,
  expirationDate,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
  isLoading,
  isMobile,
  isSuspended,
  name,
  restriction,
  sharedBy,
  sharedWith,
  showPlaceholder,
  startDate,
  suspensionDate,
  timeSlots,
  totalCredits,
  isUnlimited,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton className={className} />;
  }

  if (showPlaceholder) {
    return (
      <ConsumerCardPlaceholder
        className={className}
        message={t('reworked.placeholderCard.myPasses')}
      />
    );
  }

  return (
    <Card className={className}>
      <>
        <ConsumerPaymentPackDetailsCardHeader
          creditsLeft={creditsLeft}
          expirationDate={expirationDate}
          isMobile={isMobile}
          isSuspended={isSuspended}
          isUnlimited={isUnlimited}
          name={name}
          startDate={startDate}
          suspensionDate={suspensionDate}
          totalCredits={totalCredits}
        />

        <ConsumerPaymentPackDetailsCardDescriptionSection
          description={description}
        />

        <ConsumerPaymentPackDetailsCardCompatibleEstablishmentsSection
          compatibleEstablishments={compatibleEstablishments}
        />

        <ConsumerPaymentPackDetailsCardSharedSection
          members={[sharedBy]}
          title={t('reworked.myPasses.consumerPassDetailsCard.shared.by')}
        />

        <ConsumerPaymentPackDetailsCardSharedSection
          members={sharedWith}
          title={t('reworked.myPasses.consumerPassDetailsCard.shared.with')}
        />

        <ConsumerPaymentPackDetailsCardCompatibilitySection
          activityCompatibilities={activityCompatibilities}
          isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
          isCompatibleWithVod={isCompatibleWithVod}
          timeSlots={timeSlots}
        />

        {!!restriction && (
          <ConsumerPaymentPackDetailsCardRestrictionSection
            restriction={restriction}
          />
        )}
      </>
    </Card>
  );
};

export const ConsumerPaymentPackDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ConsumerPaymentPackDetailsCard>
>()(ConsumerPaymentPackDetailsCard);

export default React.memo(ConsumerPaymentPackDetailsCard);
