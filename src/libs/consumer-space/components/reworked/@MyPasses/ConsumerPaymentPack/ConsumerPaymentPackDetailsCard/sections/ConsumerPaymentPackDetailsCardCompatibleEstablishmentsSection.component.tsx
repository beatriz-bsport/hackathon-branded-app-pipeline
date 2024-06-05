import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import Avatar from '#Fabrique/Temporary/Avatar';
import List from '#Fabrique/List';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { Establishment } from '#src/libs/establishment/types';

type Props = {
  compatibleEstablishments: Establishment[];
};

const ConsumerPaymentPackDetailsCardCompatibleEstablishmentsSection: React.FC<
  Props
> = ({ compatibleEstablishments }) => {
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
          <ListItem
            key={establishment.id}
            className="bs-consumer-payment-pack-details-card__establishment-section__list__item"
            icon={
              <Avatar picture={establishment.cover} size="lg" type="place" />
            }
            label={establishment.title}
            size="lg"
          />
        ))}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(
  ConsumerPaymentPackDetailsCardCompatibleEstablishmentsSection,
);
