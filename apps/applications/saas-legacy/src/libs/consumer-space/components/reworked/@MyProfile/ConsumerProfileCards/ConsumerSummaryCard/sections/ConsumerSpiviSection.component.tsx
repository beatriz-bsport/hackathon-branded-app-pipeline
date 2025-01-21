import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#src/components/css-only/Fabrique/List';
import ListItem from '#src/components/css-only/Fabrique/ListItem';

import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import InfoButton from '#src/components/css-only/InfoButton';
import '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';

type Props = Pick<
  ConsumerSummaryCardProps,
  'spiviPrivacySettingsAccepted' | 'memberId'
> & {
  isMobile: boolean;
  spiviPrivacySettingsLoading: boolean;
  updateSpiviPrivacySettings: (memberId: number, value: boolean) => void;
};

const ConsumerSpiviSection: React.FC<Props> = ({
  isMobile,
  memberId,
  spiviPrivacySettingsLoading,
  spiviPrivacySettingsAccepted,
  updateSpiviPrivacySettings,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleClick = useCallback(() => {
    updateSpiviPrivacySettings(memberId, !spiviPrivacySettingsAccepted);
  }, [updateSpiviPrivacySettings, memberId, spiviPrivacySettingsAccepted]);

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__spivi-section',
      )}
      title={t('reworked.myProfile.spivi.title')}
    >
      <List>
        <ListItem
          isDisabled={spiviPrivacySettingsLoading}
          isSelected={spiviPrivacySettingsAccepted}
          label={t('reworked.myProfile.spivi.displayData')}
          onClick={handleClick}
          rightSlot={
            <InfoButton
              isMobile={isMobile}
              severity="info"
              text={t('reworked.myProfile.spivi.information')}
              title={t('reworked.myProfile.spivi.drawerTitle')}
              toolTipProps={{ placement: 'left' }}
            />
          }
          size="sm"
          type="checkbox"
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSpiviSection);
