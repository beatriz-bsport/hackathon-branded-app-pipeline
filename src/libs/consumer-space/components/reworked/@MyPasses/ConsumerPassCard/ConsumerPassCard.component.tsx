import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card from '#Fabrique/Card';
import ConsumerCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import { ConsumerPassCardHeader, ConsumerPassCardBody } from './sections';

import './styles.css';

type Props = {
  /** Number of credits the member can still use */
  creditsLeft?: string;
  /** End date for the validity of the pass */
  expirationDate?: string;
  /** Callback called when clinking on "See details" button */
  handleSeeDetails?: () => void;
  /** Loading prop, to display skeleton */
  isLoading?: boolean;
  /** Indicates if the pass has a multi-studio scope */
  isMultistudio?: boolean;
  /** Indicates if the pass is selected. Is used to elevate the card */
  isSelected?: boolean;
  /** Indicates if the pass is shared with an other member */
  isShared?: boolean;
  /** Indicates if the pass has been suspended by a manager */
  isSuspended?: boolean;
  /** Indicates if the pass is unlimited. It true, creditsLeft and totalCredits are unused */
  isUnlimited?: boolean;
  /** Name of the pass */
  passName: string;
  /** Start date for the validity of the pass */
  startDate?: string;
  /** Maximum number of credits the member can spend with the pass */
  totalCredits?: string;
};

/**
 * `ConsumerPassCard` is a React component that displays information about a consumer's pass.
 *
 * IMPORTANT: This component is use for payment packs, private passes and universal passes.
 * As a consequence, we will only use the generic 'pass' terminology.
 *
 * The component displays the pass name, whether it's shared or suspended, the number of credits left (if not unlimited),
 * the total number of credits (if not unlimited), the start date (if not passed), or the expiration date.
 * It also provides a "See Details" button that calls the `handleSeeDetails` function when clicked.
 */
const ConsumerPassCard: React.FC<Props> = ({
  creditsLeft,
  expirationDate,
  handleSeeDetails,
  isLoading,
  isMultistudio,
  isSelected,
  isShared,
  isSuspended,
  isUnlimited,
  passName,
  startDate,
  totalCredits,
}) => {
  if (isLoading) {
    return <ConsumerCardSkeleton />;
  }

  return (
    <Card
      className={classNames('bs-consumer-pass-card__root')}
      variant={isSelected ? 'elevated' : 'rest'}
    >
      <ConsumerPassCardHeader
        creditsLeft={creditsLeft}
        isMultistudio={isMultistudio}
        isShared={isShared}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        passName={passName}
        totalCredits={totalCredits}
      />
      <div className="bs-consumer-pass-card__container">
        <ConsumerPassCardBody
          expirationDate={expirationDate}
          handleSeeDetails={handleSeeDetails}
          startDate={startDate}
        />
      </div>
    </Card>
  );
};

export const ConsumerPassCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerPassCard>>()(
    ConsumerPassCard,
  );

export default React.memo(ConsumerPassCard);
