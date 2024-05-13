import React from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Title from '#src/components/css-only/Fabrique/Title';
import type { ConsumerSummaryCardProps } from '#libs/consumer-space/components/reworked/@MyProfile/types';
import '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';

type Props = Pick<
  ConsumerSummaryCardProps,
  | 'birthday'
  | 'emergencyContact'
  | 'gender'
  | 'officialDocumentId'
  | 'phoneNumber'
>;

const ConsumerInfoSection: React.FC<Props> = ({
  birthday,
  emergencyContact,
  gender,
  officialDocumentId,
  phoneNumber,
}) => {
  const { t } = useTranslation('consumerSpace');
  const consumerBirthDay = birthday
    ? DateTime.fromISO(birthday).toFormat('D')
    : '';
  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__info-section',
      )}
    >
      <Title
        subtitle={gender}
        title={t('reworked.myProfile.gender')}
        variant="xs"
      />
      <Title
        subtitle={consumerBirthDay}
        title={t('reworked.myProfile.birthday')}
        variant="xs"
      />
      <Title
        subtitle={officialDocumentId}
        title={t('reworked.myProfile.identityDocument')}
        variant="xs"
      />
      <Title
        subtitle={phoneNumber}
        title={t('reworked.myProfile.phone')}
        variant="xs"
      />
      <Title
        subtitle={emergencyContact}
        title={t('reworked.myProfile.emergencyNumber')}
        variant="xs"
      />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerInfoSection);
