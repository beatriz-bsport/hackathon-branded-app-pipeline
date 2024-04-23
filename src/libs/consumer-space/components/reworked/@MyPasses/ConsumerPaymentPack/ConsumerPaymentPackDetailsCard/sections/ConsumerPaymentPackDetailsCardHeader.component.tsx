import React from 'react';

import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerPaymentPackCreditStatus from '#libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';

import { useConsumerPassDetailsCardHeaderData } from '#libs/consumer-space/components/reworked/@MyPasses/GenericPass/DetailsCard/hooks';

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

const ConsumerPaymentPackDetailsCardHeader: React.FC<Props> = ({
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
    Icon,
    label,
    customClassName,
    usedCredits,
    hideList,
    customIconClassName,
    caption,
  } = useConsumerPassDetailsCardHeaderData({
    creditsLeft,
    cssVariant: 'consumer-payment-pack',
    totalCredits,
    expirationDate,
    isSuspended,
    startDate,
    suspensionDate,
  });

  return (
    <ConsumerCardSection
      classes={{
        title: 'bs-consumer-payment-pack-details-card__header__title',
      }}
      className="bs-consumer-payment-pack-details-card__header__root"
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
          'bs-consumer-payment-pack-details-card__header__list',
          {
            'bs-consumer-payment-pack-details-card__header__list--hidden':
              hideList,
          },
        )}
      >
        <ListItem
          captionText={caption}
          classes={{ label: customClassName, icon: customIconClassName }}
          className={classNames(
            'bs-consumer-payment-pack-details-card__header__list__item',
            customClassName,
          )}
          icon={<Icon stroke="currentColor" />}
          label={label}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPaymentPackDetailsCardHeader);
