import React from 'react';
import classNames from 'classnames';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConsumerDetailsCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton';
import ConsumerCardPlaceholder from '#src/libs/consumer-space/components/reworked/common/ConsumerCardPlaceholder';

import type { Establishment } from '#src/libs/establishment/types';
import type { PrivateConsumerPassCompatibility } from '#src/libs/consumer-space/types';
import {
  PrivateConsumerPassDetailsCardHeader,
  PrivateConsumerPassDetailsCardDescriptionSection,
  PrivateConsumerPassDetailsCardCompatibleEstablishmentsSection,
  PrivateConsumerPassDetailsCardSharedSection,
  PrivateConsumerPassDetailsCardCompatibilitySection,
} from './sections';

import './styles.css';

type Props = {
  /** If the pass is an appointment pass, this props indicates which appointments and/or sessions are compatible with it */
  appointmentCompatibilities?: PrivateConsumerPassCompatibility[];
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
  /** Should wrap the component in a card. Set it true in mobile version */
  isMobile?: boolean;
  /** Loading property, to display skeleton */
  isLoading?: boolean;
  /** The pass is suspended */
  isSuspended?: boolean;
  /** The pass has unlimited credits */
  isUnlimited?: boolean;
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
  className,
  creditsLeft,
  description,
  expirationDate,
  isMobile,
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
    <Card
      className={classNames(
        'bs-private-consumer-pass-details-card__root',
        className,
      )}
    >
      <PrivateConsumerPassDetailsCardHeader
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

      <PrivateConsumerPassDetailsCardDescriptionSection
        description={description}
      />

      <PrivateConsumerPassDetailsCardCompatibleEstablishmentsSection
        compatibleEstablishments={compatibleEstablishments}
      />

      <PrivateConsumerPassDetailsCardSharedSection
        members={[sharedBy]}
        title={t('reworked.myPasses.consumerPassDetailsCard.shared.by')}
      />

      <PrivateConsumerPassDetailsCardSharedSection
        members={sharedWith}
        title={t('reworked.myPasses.consumerPassDetailsCard.shared.with')}
      />

      <PrivateConsumerPassDetailsCardCompatibilitySection
        appointmentCompatibilities={appointmentCompatibilities}
        isCompatibleWithVod={isCompatibleWithVod}
      />
    </Card>
  );
};

export const PrivateConsumerPassDetailsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof PrivateConsumerPassDetailsCard>
>()(PrivateConsumerPassDetailsCard);

export default React.memo(PrivateConsumerPassDetailsCard);
