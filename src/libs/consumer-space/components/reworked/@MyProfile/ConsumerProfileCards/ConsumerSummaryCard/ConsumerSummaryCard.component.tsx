import React, { useContext } from 'react';
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
import { ConsumerProfileContext } from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import type { ConsumerSummaryCardProps } from '#libs/consumer-space/components/reworked/@MyProfile/types';
import ConsumerDetailsCardSkeleton from '#libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton/ConsumerDetailsCardSkeleton.component';
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
  isLoading,
  lastName,
  memberId,
  membershipId,
  officialDocumentId,
  phoneNumber,
  photo,
  showAccountBalance,
  showBarcodeButton,
  showMembershipNumber,
  spiviPrivacySettingsAccepted,
  spiviPrivacySettingsLoading,
  totalUnpaidAmount,
  updateSpiviPrivacySettings,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { spiviEnabled } = useFeaturesProvider();
  const { toggleBarcodeModal, isMobile } =
    useContext(ConsumerProfileContext) ?? {};

  if (isLoading) return <ConsumerDetailsCardSkeleton />;

  return (
    <div className="bs-consumer-summary-card__container">
      <Card className={classNames('bs-consumer-summary-card__root')}>
        <ConsumerSummaryCardHeader
          creditAccountBalance={creditAccountBalance}
          email={email}
          firstName={firstName}
          handleToggleBarcodeModal={toggleBarcodeModal}
          isMobile={isMobile}
          lastName={lastName}
          photo={photo}
          showAccountBalance={showAccountBalance}
          showBarcodeButton={showBarcodeButton}
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
        {showMembershipNumber && (
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
        )}
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
