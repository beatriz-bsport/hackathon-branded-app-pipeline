import React from 'react';
import { ConsumerGenericCardHeader } from '#libs/consumer-space/components/reworked/common/ConsumerCard';

import type { ChipColor } from '#Fabrique/Chip';
import type { ConsumerSubscriptionCardProps } from '..';

type Props = Pick<
  ConsumerSubscriptionCardProps,
  'subscriptionDate' | 'subscriptionName'
>;

const ConsumerSubscriptionCardHeader: React.FC<Props> = ({
  subscriptionDate,
  subscriptionName,
}) => {
  // TODO : on payment related PR, for now random placeholder
  const chipsDataList = [
    {
      shouldDisplay: false,
      chipColor: 'error' as ChipColor,
      leftIcon: '',
      text: '',
      chipClassName: 'bs-consumer__booking-card__header__chip',
    },
  ];
  return (
    <ConsumerGenericCardHeader
      chipsDataList={chipsDataList}
      chipsWrapperClassName="bs-consumer__subscription-card__header__chips-wrapper"
      className="bs-consumer__subscription-card__header"
      subtitle={subscriptionDate}
      title={subscriptionName}
    />
  );
};

export default React.memo(ConsumerSubscriptionCardHeader);
