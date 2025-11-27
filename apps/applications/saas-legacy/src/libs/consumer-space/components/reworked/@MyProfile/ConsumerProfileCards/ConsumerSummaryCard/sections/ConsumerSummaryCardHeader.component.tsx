import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import Avatar from '#src/components/css-only/Fabrique/Temporary/Avatar';
import Title from '#src/components/css-only/Fabrique/Title';
import Typography from '#src/components/css-only/Fabrique/Typography';
import { Scan } from '#src/components/untitledui';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

import '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';
import DoorAccessButton from '#src/libs/self-service-access/components/DoorAccessButton.component';

type Props = Pick<
  ConsumerSummaryCardProps,
  | 'creditAccountBalance'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'photo'
  | 'showAccountBalance'
  | 'showBarcodeButton'
  | 'regularizeBalanceAllowed'
  | 'companyId'
> & {
  isMobile: boolean;
  handleToggleBarcodeModal: () => void;
};

const ConsumerSummaryCardHeader: React.FC<Props> = ({
  creditAccountBalance,
  email,
  firstName,
  lastName,
  isMobile,
  handleToggleBarcodeModal,
  photo,
  showAccountBalance,
  showBarcodeButton,
  regularizeBalanceAllowed,
  companyId,
}) => {
  const { toggleRegularizeBalancePortal } = useContext(ConsumerProfileContext);
  const { t } = useTranslation('consumerSpace');

  const userName = [firstName ?? '', lastName ?? ''].join(' ');

  const consumerCreditAccountBalance = creditAccountBalance ?? 0;

  const accountBalanceColor = (() => {
    switch (Math.sign(consumerCreditAccountBalance)) {
      case 1:
        return 'success';
      case -1:
        return 'error';
      default:
        return 'success';
    }
  })();

  const accountBalance = getCurrencyDisplayWithPrice(
    consumerCreditAccountBalance.toFixed(2),
  );

  const isWidget =
    WidgetUtils.getConsumerSpaceContext() === ConsumerSpaceContextEnum.WIDGET;

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__header-section',
      )}
    >
      <div
        className={clsx('bs-consumer-summary-card__profile-header', {
          'bs-consumer-summary-card__profile-header--mobile': isMobile,
        })}
      >
        <Avatar picture={photo} size="xl" type="user" />
        <Title
          classes={{
            title: 'bs-consumer-summary-card__profile-header__username',
          }}
          className="bs-consumer-summary-card__profile-header__title"
          subtitle={email}
          title={userName}
          variant="md"
        />
      </div>
      <div
        className={clsx('bs-consumer-summary-card__account-balance', {
          'bs-consumer-summary-card__account-balance--hidden':
            !showAccountBalance,
        })}
      >
        <Typography>{`${t('reworked.myProfile.accountBalance')}:`}</Typography>
        <Typography color={accountBalanceColor} variant="title-md">
          {accountBalance}
        </Typography>
        <Button
          className={clsx('bs-consumer-summary-card__pay-balance-debt-button', {
            'bs-consumer-summary-card__pay-balance-debt-button--hidden':
              consumerCreditAccountBalance >= 0 ||
              isWidget ||
              !regularizeBalanceAllowed,
          })}
          color="error"
          isDisabled={isWidget}
          onClick={toggleRegularizeBalancePortal}
          size="sm"
          variant="contained"
        >
          {t('reworked.myProfile.regularizeBalance')}
        </Button>
      </div>
      <div className="bs-consumer-summary-card__buttons-container">
        <Button
          className={clsx('bs-consumer-summary-card__barcode-button', {
            'bs-consumer-summary-card__barcode-button--isMobile': isMobile,
            'bs-consumer-summary-card__barcode-button--hidden':
              !showBarcodeButton,
          })}
          color="primary"
          leftIcon={<Scan stroke="currentColor" />}
          onClick={handleToggleBarcodeModal}
          size="md"
        >
          {t('reworked.myProfile.barCode.entryBarcode')}
        </Button>
        <DoorAccessButton companyId={companyId} />
      </div>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSummaryCardHeader);
