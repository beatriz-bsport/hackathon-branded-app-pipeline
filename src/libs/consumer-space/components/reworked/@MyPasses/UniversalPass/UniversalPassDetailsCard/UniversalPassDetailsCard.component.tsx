import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConditionalWrapper from '#components/ConditionnalWrapper.component';
import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';

import Header from './sections/Header.component';
import DescriptionSection from './sections/DescriptionSection.component';
import CompatibleEstablishmentsSection from './sections/CompatibleEstablishmentsSection.component';
import SharedSection from './sections/SharedSection.component';
import CompatibilitySection from './sections/CompatibilitySection.component';

import type { Establishment } from '#libs/establishment/types';
import type {
  ConsumerPaymentPackCompatibility,
  PrivateConsumerPassCompatibility,
  TimeSlot,
} from '#libs/consumer-space/types';

import './styles.css';

type Props = {
  /** This props indicates which categories, activities or rooms are compatible with the pass */
  activityCompatibilities?: ConsumerPaymentPackCompatibility[];
  /** This props indicates which appointments and/or sessions are compatible with the pass */
  appointmentCompatibilities?: PrivateConsumerPassCompatibility[];
  /** List of the studios the pass is compatible with */
  compatibleEstablishments?: Establishment[];
  /** Number of credits available left */
  creditsLeft?: number;
  /** The pass description */
  description?: string;
  /** The pass expiration date */
  expirationDate?: string;
  /** The pass is compatible with booking for guests (activity passes only) */
  isCompatibleWithBookingForGuest?: boolean;
  /** The pass is compatible with VOD */
  isCompatibleWithVod?: boolean;
  /** Loading property, to display skeleton */
  isLoading?: boolean;
  /** The pass is suspended */
  isSuspended?: boolean;
  /** The pass has unlimited credits */
  isUnlimited?: boolean;
  /** Should wrap the component in a card. Set it true in mobile version */
  mobileVersion?: boolean;
  /** The pass name */
  name: string;
  /** The pass is shared by this member */
  sharedBy?: string;
  /** The pass is shared with these members */
  sharedWith?: string[];
  /** If no pass data, show placeholder instead */
  showPlaceholder?: boolean;
  /** The pass start date */
  startDate?: string;
  /** The pass suspension date */
  suspensionDate?: string;
  /** The pass is compatible with these time slots (activity passes only) */
  timeSlots?: TimeSlot[];
  /** The pass total initial credits */
  totalCredits?: number;
};

const UniversalPassDetailsCard: React.FC<Props> = ({
  activityCompatibilities,
  appointmentCompatibilities,
  compatibleEstablishments,
  creditsLeft,
  description,
  expirationDate,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
  isLoading,
  isSuspended,
  name,
  sharedBy,
  sharedWith,
  showPlaceholder,
  startDate,
  suspensionDate,
  timeSlots,
  totalCredits,
  mobileVersion,
  isUnlimited,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isLoading) {
    return <ConsumerDetailsCardSkeleton />;
  }

  if (showPlaceholder) {
    return (
      <ConsumerCardPlaceholder
        message={t('reworked.placeholderCard.myPasses')}
      />
    );
  }

  return (
    <ConditionalWrapper
      className="bs-universal-pass-details-card__root"
      condition={!mobileVersion}
      WrapperComponent={Card}
    >
      <>
        <Header
          creditsLeft={creditsLeft}
          expirationDate={expirationDate}
          isSuspended={isSuspended}
          isUnlimited={isUnlimited}
          name={name}
          startDate={startDate}
          suspensionDate={suspensionDate}
          totalCredits={totalCredits}
        />

        <DescriptionSection description={description} />

        <CompatibleEstablishmentsSection
          compatibleEstablishments={compatibleEstablishments}
        />

        <SharedSection
          members={[sharedBy]}
          title={t('reworked.myPasses.consumerPassDetailsCard.shared.by')}
        />

        <SharedSection
          members={sharedWith}
          title={t('reworked.myPasses.consumerPassDetailsCard.shared.with')}
        />

        <CompatibilitySection
          activityCompatibilities={activityCompatibilities}
          appointmentCompatibilities={appointmentCompatibilities}
          isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
          isCompatibleWithVod={isCompatibleWithVod}
          timeSlots={timeSlots}
        />
      </>
    </ConditionalWrapper>
  );
};

export const UniversalPassDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof UniversalPassDetailsCard>
>()(UniversalPassDetailsCard);

export default React.memo(UniversalPassDetailsCard);
