import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConditionalWrapper from '#components/ConditionnalWrapper.component';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';
import ConsumerCardPlaceholder from '#libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';

import Header from './sections/Header.component';
import DescriptionSection from './sections/DescriptionSection.component';
import CompatibleEstablishmentsSection from './sections/CompatibleEstablishmentsSection.component';
import SharedSection from './sections/SharedSection.component';
import CompatibilitySection from './sections/CompatibilitySection.component';

import type { Establishment } from '#libs/establishment/types';
import type { PrivateConsumerPassCompatibility } from '#libs/consumer-space/types';

import './styles.css';

type Props = {
  /** If the pass is an appointment pass, this props indicates which appointments and/or sessions are compatible with it */
  appointmentCompatibilities?: PrivateConsumerPassCompatibility[];
  /** List of the studios the pass is compatible with */
  compatibleEstablishments?: Establishment[];
  /** Number of credits available left */
  creditsLeft?: number;
  /** The pass description */
  description?: string;
  /** The pass expiration date */
  expirationDate?: string;
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
  /** The pass is shared by this member (name only) */
  sharedBy?: string;
  /** The pass is shared with these members (names only) */
  sharedWith?: string[];
  /** If no pass data, show placeholder instead */
  showPlaceholder?: boolean;
  /** The pass start date */
  startDate?: string;
  /** The pass suspension date */
  suspensionDate?: string;
  /** The pass total initial credits */
  totalCredits?: number;
  /** The pass is compatible with VOD */
  isCompatibleWithVod?: boolean;
};

const PrivateConsumerPassDetailsCard: React.FC<Props> = ({
  appointmentCompatibilities,
  compatibleEstablishments,
  creditsLeft,
  description,
  expirationDate,
  isCompatibleWithVod,
  isLoading,
  isSuspended,
  isUnlimited,
  name,
  sharedBy,
  sharedWith,
  showPlaceholder,
  startDate,
  suspensionDate,
  totalCredits,
  mobileVersion,
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
      className="bs-private-consumer-pass-details-card__root"
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
          appointmentCompatibilities={appointmentCompatibilities}
          isCompatibleWithVod={isCompatibleWithVod}
        />
      </>
    </ConditionalWrapper>
  );
};

export const PrivateConsumerPassDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof PrivateConsumerPassDetailsCard>
>()(PrivateConsumerPassDetailsCard);

export default React.memo(PrivateConsumerPassDetailsCard);
