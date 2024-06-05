import React from 'react';

import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerPaymentPackCreditStatus from '#src/libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';

import { useConsumerPassDetailsCardHeaderData } from '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/DetailsCard/hooks';

type Props = {
  isMobile?: boolean;
  creditsLeft: number;
  expirationDate: string;
  isSuspended: boolean;
  isUnlimited: boolean;
  name: string;
  suspensionDate: string;
  startDate: string;
  totalCredits: number;
};

const UniversalPassDetailsCardHeader: React.FC<Props> = ({
  isMobile,
  creditsLeft,
  isUnlimited,
  name,
  totalCredits,
  expirationDate,
  isSuspended,
  startDate,
  suspensionDate,
}) => {
  const {
    Icon,
    label,
    customClassName,
    usedCredits,
    hideList,
    customIconClassName,
    caption,
  } = useConsumerPassDetailsCardHeaderData({
    creditsLeft,
    cssVariant: 'universal-pass',
    totalCredits,
    expirationDate,
    isSuspended,
    startDate,
    suspensionDate,
  });

  return (
    <ConsumerCardSection
      classes={{
        title: 'bs-universal-pass-details-card__header__title',
      }}
      className="bs-universal-pass-details-card__header__root"
      title={!isMobile && name}
    >
      {!isMobile && (
        <ConsumerPaymentPackCreditStatus
          consumerPaymentPackAvailableCredits={creditsLeft}
          consumerPaymentPackUsedCredits={usedCredits}
          isPaymentPackUnlimited={isUnlimited}
          paymentPackTotalCredits={totalCredits}
        />
      )}
      <List
        className={classNames('bs-universal-pass-details-card__header__list', {
          'bs-universal-pass-details-card__header__list--hidden': hideList,
        })}
      >
        <ListItem
          captionText={caption}
          classes={{ label: customClassName, icon: customIconClassName }}
          className={classNames(
            'bs-universal-pass-details-card__header__list__item',
            customClassName,
          )}
          icon={<Icon stroke="currentColor" />}
          label={label}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(UniversalPassDetailsCardHeader);
