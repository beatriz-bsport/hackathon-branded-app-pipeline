import React from 'react';

import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerPaymentPackCreditStatus from '#src/libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';

import { useConsumerPassDetailsCardHeaderData } from '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/DetailsCard/hooks';

type Props = {
  creditsLeft: number;
  expirationDate: string;
  isMobile?: boolean;
  isSuspended: boolean;
  isUnlimited: boolean;
  name: string;
  suspensionDate: string;
  startDate: string;
  totalCredits: number;
};

const PrivateConsumerPassDetailsCardHeader: React.FC<Props> = ({
  creditsLeft,
  expirationDate,
  isMobile,
  isSuspended,
  isUnlimited,
  name,
  suspensionDate,
  startDate,
  totalCredits,
}) => {
  const {
    caption,
    customClassName,
    customIconClassName,
    hideList,
    Icon,
    label,
    usedCredits,
  } = useConsumerPassDetailsCardHeaderData({
    creditsLeft,
    cssVariant: 'private-consumer-pass',
    totalCredits,
    expirationDate,
    isSuspended,
    startDate,
    suspensionDate,
  });

  return (
    <ConsumerCardSection
      classes={{
        title: 'bs-private-consumer-pass-details-card__header__title',
      }}
      className="bs-private-consumer-pass-details-card__header__root"
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
        className={classNames(
          'bs-private-consumer-pass-details-card__header__list',
          {
            'bs-private-consumer-pass-details-card__header__list--hidden':
              hideList,
          },
        )}
      >
        <ListItem
          captionText={caption}
          classes={{ label: customClassName, icon: customIconClassName }}
          className={classNames(
            'bs-private-consumer-pass-details-card__header__list__item',
            customClassName,
          )}
          icon={<Icon stroke="currentColor" />}
          label={label}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(PrivateConsumerPassDetailsCardHeader);
