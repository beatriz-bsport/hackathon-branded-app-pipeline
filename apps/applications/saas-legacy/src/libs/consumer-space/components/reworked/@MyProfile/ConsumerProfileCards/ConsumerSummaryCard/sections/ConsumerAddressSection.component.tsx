import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Typography from '#src/components/css-only/Fabrique/Typography';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import Title from '#src/components/css-only/Fabrique/Title';
import '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';

type Props = Pick<ConsumerSummaryCardProps, 'address'>;

const ConsumerAddressSection: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation('consumerSpace');

  if (!address || !Object.keys(address).length) return null;

  const { address_line_1, address_line_2, city, country, state, zipcode } =
    address;

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__address-section',
      )}
    >
      <Title title={t('reworked.myProfile.address')} variant="xs" />
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--address-line-1',
          {
            'bs-consumer-summary-card__address-section__address--address-line-1--hidden':
              !address_line_1,
          },
        )}
        variant="body-sm"
      >
        {address_line_1}
      </Typography>
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--address-line-2',
          {
            'bs-consumer-summary-card__address-section__address--address-line-2--hidden':
              !address_line_2,
          },
        )}
        variant="body-sm"
      >
        {address_line_2}
      </Typography>
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--city',
          {
            'bs-consumer-summary-card__address-section__address--city--hidden':
              !city,
          },
        )}
        variant="body-sm"
      >
        {city}
      </Typography>
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--country',
          {
            'bs-consumer-summary-card__address-section__address--country--hidden':
              !country,
          },
        )}
        variant="body-sm"
      >
        {country}
      </Typography>
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--state',
          {
            'bs-consumer-summary-card__address-section__address--state--hidden':
              !state,
          },
        )}
        variant="body-sm"
      >
        {state}
      </Typography>
      <Typography
        className={classNames(
          'bs-consumer-summary-card__address-section__address',
          'bs-consumer-summary-card__address-section__address--zipcode',
          {
            'bs-consumer-summary-card__address-section__address--zipcode--hidden':
              !zipcode,
          },
        )}
        variant="body-sm"
      >
        {zipcode}
      </Typography>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerAddressSection);
