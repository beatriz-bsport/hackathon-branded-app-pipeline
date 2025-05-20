import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import List from '#src/components/css-only/Fabrique/List';
import ListItem from '#src/components/css-only/Fabrique/ListItem';
import { Mail05, Phone01 } from '#src/components/untitledui';
import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';

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
  const {
    isFranchiseMarketingPreferencesActivated,
    toggleFranchiseMarketingPreferencesPortal,
  } = useContext(ConsumerProfileContext) ?? {};

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__notification-section',
      )}
      title={t('reworked.myProfile.notifications.title')}
    >
      <List>
        {isFranchiseMarketingPreferencesActivated ? (
          <>
            <ListItem
              classes={{
                label:
                  'bs-consumer-summary-card__notification-section__franchise-marketing-notification-preferences',
              }}
              className="bs-consumer-summary-card__notification-section__franchise-marketing-notification-preferences"
              icon={<Phone01 stroke="currentColor" />}
              label={t(
                'reworked.myProfile.notifications.manageYourFranchiseMarketingPrefencesLabel',
              )}
              onClick={toggleFranchiseMarketingPreferencesPortal}
              size="sm"
              type="clickableText"
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerNotificationsSection);
