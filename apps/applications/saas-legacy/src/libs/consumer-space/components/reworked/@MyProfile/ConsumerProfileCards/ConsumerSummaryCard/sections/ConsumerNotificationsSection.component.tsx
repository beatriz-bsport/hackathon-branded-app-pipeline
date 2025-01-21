import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import List from '#src/components/css-only/Fabrique/List';
import ListItem from '#src/components/css-only/Fabrique/ListItem';
import { Mail05, Phone01 } from '#src/components/untitledui';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';

type Props = Pick<ConsumerSummaryCardProps, 'acceptEmail' | 'acceptSms'>;

const ConsumerNotificationsSection: React.FC<Props> = ({
  acceptEmail,
  acceptSms,
}) => {
  const { t } = useTranslation('consumerSpace');

  const phoneNotificationLabel = acceptSms
    ? t('reworked.myProfile.notifications.phoneAllowed')
    : t('reworked.myProfile.notifications.phoneNotAllowed');

  const emailNotificationLabel = acceptEmail
    ? t('reworked.myProfile.notifications.emailAllowed')
    : t('reworked.myProfile.notifications.emailNotAllowed');

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__notification-section',
      )}
      title={t('reworked.myProfile.notifications.title')}
    >
      <List>
        <ListItem
          classes={{
            label: clsx({
              'bs-consumer-summary-card__notification-section__accepted-notification':
                acceptSms,
              'bs-consumer-summary-card__notification-section__refused-notification':
                !acceptSms,
            }),
          }}
          className={clsx({
            'bs-consumer-summary-card__notification-section__accepted-notification':
              acceptSms,
            'bs-consumer-summary-card__notification-section__refused-notification':
              !acceptSms,
          })}
          icon={<Phone01 stroke="currentColor" />}
          label={phoneNotificationLabel}
          size="sm"
        />
        <ListItem
          classes={{
            label: clsx({
              'bs-consumer-summary-card__notification-section__accepted-notification':
                acceptEmail,
              'bs-consumer-summary-card__notification-section__refused-notification':
                !acceptEmail,
            }),
          }}
          className={clsx({
            'bs-consumer-summary-card__notification-section__accepted-notification':
              acceptEmail,
            'bs-consumer-summary-card__notification-section__refused-notification':
              !acceptEmail,
          })}
          icon={<Mail05 stroke="currentColor" />}
          label={emailNotificationLabel}
          size="sm"
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerNotificationsSection);
