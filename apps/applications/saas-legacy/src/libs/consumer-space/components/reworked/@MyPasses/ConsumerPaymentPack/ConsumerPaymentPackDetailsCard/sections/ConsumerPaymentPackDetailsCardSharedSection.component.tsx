import React from 'react';
import clsx from 'clsx';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

type Props = {
  members: string[];
  title: string;
};

const ConsumerPaymentPackDetailsCardSharedSection: React.FC<Props> = ({
  members,
  title,
}) => {
  const membersFiltered = members?.filter((member) => !!member) || [];
  return (
    <ConsumerCardSection
      className={clsx('bs-consumer-payment-pack-details-card__shared-section', {
        'bs-consumer-payment-pack-details-card__shared-section--hidden':
          !membersFiltered.length,
      })}
      title={title}
    >
      <List className="bs-consumer-payment-pack-details-card__shared-section__list">
        {membersFiltered.map((member) => (
          <ListItem
            key={member}
            className="bs-consumer-payment-pack-details-card__shared-section__list__item"
            label={member}
          />
        ))}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPaymentPackDetailsCardSharedSection);
