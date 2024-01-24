import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import Avatar from '#Fabrique/Temporary/Avatar';
import { List } from '#Fabrique/List/List.component';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { Establishment } from '#libs/establishment/types';

type Props = {
  compatibleEstablishments: Establishment[];
};

type EstablishmentListItemProps = {
  picture: string;
  name: string;
};

const EstablishmentListItem: React.FC<EstablishmentListItemProps> = React.memo(
  ({ picture, name }) => {
    return (
      <ListItem
        className="bs-consumer-payment-pack-details-card__establishment-section__list__item"
        icon={<Avatar picture={picture} size="lg" type="place" />}
        label={name}
        size="lg"
      />
    );
  },
);

const CompatibleEstablishmentsSection: React.FC<Props> = ({
  compatibleEstablishments,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-payment-pack-details-card__establishment-section',
        {
          'bs-consumer-payment-pack-details-card__establishment-section--hidden':
            !compatibleEstablishments?.length,
        },
      )}
      title={t(
        'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.studios',
      )}
    >
      <List className="bs-consumer-payment-pack-details-card__establishment-section__list">
        {compatibleEstablishments?.map((establishment) => (
          <EstablishmentListItem
            key={establishment.id}
            name={establishment.title}
            picture={establishment.cover}
          />
        ))}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(CompatibleEstablishmentsSection);
