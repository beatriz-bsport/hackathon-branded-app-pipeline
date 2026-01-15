import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import Title from '#Fabrique/Title';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import {
  ConsumerSummaryCardHeader,
  ConsumerAddressSection,
  ConsumerInfoSection,
  ConsumerNotificationsSection,
} from './sections';
import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import ConsumerDetailsCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerDetailsCardSkeleton/ConsumerDetailsCardSkeleton.component';
import './styles.css';

const ConsumerSummaryCard: React.FC<ConsumerSummaryCardProps> = ({
  acceptEmail,
  acceptSms,
  address,
  birthday,
  companyId,
  creditAccountBalance,
  email,
  emergencyContact,
  firstName,
  gender,
  isLoading,
  iosAppUrl,
  lastName,
  membershipId,
  officialDocumentId,
  phoneNumber,
  photo,
  androidAppUrl,
  showAccountBalance,
  showBarcodeButton,
  showMembershipNumber,
  regularizeBalanceAllowed,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { toggleBarcodeModal, isMobile } =
    useContext(ConsumerProfileContext) ?? {};

  if (isLoading) return <ConsumerDetailsCardSkeleton />;

  return (
    <div className="bs-consumer-summary-card__container">
      <Card className={clsx('bs-consumer-summary-card__root')}>
        <ConsumerSummaryCardHeader
          androidAppUrl={androidAppUrl}
          companyId={companyId}
          creditAccountBalance={creditAccountBalance}
          email={email}
          firstName={firstName}
          handleToggleBarcodeModal={toggleBarcodeModal}
          iosAppUrl={iosAppUrl}
          isMobile={isMobile}
          lastName={lastName}
          photo={photo}
          regularizeBalanceAllowed={regularizeBalanceAllowed}
          showAccountBalance={showAccountBalance}
          showBarcodeButton={showBarcodeButton}
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
            className={clsx(
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
      </Card>
    </div>
  );
};

export const ConsumerSummaryCardStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerSummaryCard>>()(
    ConsumerSummaryCard,
  );
export default React.memo(ConsumerSummaryCard);
