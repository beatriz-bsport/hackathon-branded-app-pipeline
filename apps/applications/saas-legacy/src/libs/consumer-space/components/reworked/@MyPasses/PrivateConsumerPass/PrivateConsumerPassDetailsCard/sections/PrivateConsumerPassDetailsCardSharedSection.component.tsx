import React from 'react';
import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

type Props = {
  members: string[];
  title: string;
};

const PrivateConsumerPassDetailsCardSharedSection: React.FC<Props> = ({
  members,
  title,
}) => {
  const membersFiltered = members?.filter((member) => !!member) || [];
  return (
    <ConsumerCardSection
      className={classNames(
        'bs-private-consumer-pass-details-card__shared-section',
        {
          'bs-private-consumer-pass-details-card__shared-section--hidden':
            !membersFiltered.length,
        },
      )}
      title={title}
    >
      <List className="bs-private-consumer-pass-details-card__shared-section__list">
        {membersFiltered.map((member) => (
          <ListItem
            key={member}
            className="bs-private-consumer-pass-details-card__shared-section__list__item"
            label={member}
          />
        ))}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(PrivateConsumerPassDetailsCardSharedSection);
