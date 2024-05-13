import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import Title from '#Fabrique/Title';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import {
  ConsumerSummaryCardHeader,
  ConsumerAddressSection,
  ConsumerInfoSection,
  ConsumerNotificationsSection,
  ConsumerSpiviSection,
} from './sections';
import useFeaturesProvider from '#src/libs/company/hooks/feature-list-provider.hook';
import type { ConsumerSummaryCardProps } from '#libs/consumer-space/components/reworked/@MyProfile/types';
import './styles.css';

const ConsumerSummaryCard: React.FC<ConsumerSummaryCardProps> = ({
  acceptEmail,
  acceptSms,
  address,
  birthday,
  creditAccountBalance,
  email,
  emergencyContact,
  firstName,
  gender,
  handleToggleBarcodeModal,
  isMobile,
  lastName,
  memberId,
  membershipId,
  officialDocumentId,
  phoneNumber,
  photo,
  spiviPrivacySettingsAccepted,
  spiviPrivacySettingsLoading,
  totalUnpaidAmount,
  updateSpiviPrivacySettings,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { spiviEnabled } = useFeaturesProvider();
  return (
    <div className="bs-consumer-summary-card__container">
      <Card className={classNames('bs-consumer-summary-card__root')}>
        <ConsumerSummaryCardHeader
          creditAccountBalance={creditAccountBalance}
          email={email}
          firstName={firstName}
          handleToggleBarcodeModal={handleToggleBarcodeModal}
          isMobile={isMobile}
          lastName={lastName}
          photo={photo}
          totalUnpaidAmount={totalUnpaidAmount}
        />
        <ConsumerInfoSection
          birthday={birthday}
          emergencyContact={emergencyContact}
          gender={gender}
          officialDocumentId={officialDocumentId}
          phoneNumber={phoneNumber}
        />
        <ConsumerAddressSection address={address} />
        <ConsumerNotificationsSection
          acceptEmail={acceptEmail}
          acceptSms={acceptSms}
        />
        <ConsumerCardSection
          className={classNames(
            'bs-consumer-summary-card-section',
            'bs-consumer-summary-card__membership-section',
          )}
        >
          <Title
            subtitle={membershipId}
            title={t('reworked.myProfile.membershipId')}
            variant="xs"
          />
        </ConsumerCardSection>
        {spiviEnabled && (
          <ConsumerSpiviSection
            isMobile={isMobile}
            memberId={memberId}
            spiviPrivacySettingsAccepted={spiviPrivacySettingsAccepted}
            spiviPrivacySettingsLoading={spiviPrivacySettingsLoading}
            updateSpiviPrivacySettings={updateSpiviPrivacySettings}
          />
        )}
      </Card>
    </div>
  );
};

export const ConsumerSummaryCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerSummaryCard>>()(
    ConsumerSummaryCard,
  );
export default React.memo(ConsumerSummaryCard);
