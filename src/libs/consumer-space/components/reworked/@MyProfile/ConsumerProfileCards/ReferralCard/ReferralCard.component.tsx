import React from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import ReferralLinkAndTerms from '#src/libs/referral/components/ReferralLinkAndTerms';
import Card from '#src/components/css-only/Fabrique/Card';

import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import type { ReferralCardProps } from './types';

import './styles.css';

const ReferralCard: React.FC<ReferralCardProps> = ({
  hasUnknownError,
  isAuthenticated,
  isLoading,
  nbRemainingReferralUses,
  referralLink,
  referralProgram,
}) => {
  const hideCard =
    hasUnknownError ||
    !referralLink ||
    !referralProgram ||
    nbRemainingReferralUses === undefined;

  if (isLoading) return <ConsumerCardSkeleton />;
  return (
    <Card
      className={classNames('bs-consumer-referral-card__root', {
        'bs-consumer-referral-card__root--hidden': hideCard,
      })}
    >
      <ReferralLinkAndTerms
        hasUnknownError={hasUnknownError}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        nbRemainingReferralUses={nbRemainingReferralUses}
        referralLink={referralLink}
        referralProgram={referralProgram}
      />
    </Card>
  );
};

export const ReferralCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ReferralCard>>()(ReferralCard);
export default React.memo(ReferralCard);
