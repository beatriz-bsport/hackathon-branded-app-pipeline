import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import Avatar from '#src/components/css-only/Fabrique/Temporary/Avatar';
import Title from '#src/components/css-only/Fabrique/Title';
import Typography from '#src/components/css-only/Fabrique/Typography';
import { Scan } from '#src/components/untitledui';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard/styles.css';

type Props = Pick<
  ConsumerSummaryCardProps,
  | 'creditAccountBalance'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'photo'
  | 'totalUnpaidAmount'
  | 'showAccountBalance'
  | 'showBarcodeButton'
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
  totalUnpaidAmount,
}) => {
  const { t } = useTranslation('consumerSpace');

  const userName = [firstName ?? '', lastName ?? ''].join(' ');

  const totalUnpaidAmountNumber = parseFloat(totalUnpaidAmount);

  const consumerCreditAccountBalance =
    creditAccountBalance - totalUnpaidAmountNumber ?? 0;

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

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-summary-card-section',
        'bs-consumer-summary-card__header-section',
      )}
    >
      <div
        className={classNames('bs-consumer-summary-card__profile-header', {
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
        className={classNames('bs-consumer-summary-card__account-balance', {
          'bs-consumer-summary-card__account-balance--hidden':
            !showAccountBalance,
        })}
      >
        <Typography>{`${t('reworked.myProfile.accountBalance')}:`}</Typography>
        <Typography color={accountBalanceColor} variant="title-md">
          {accountBalance}
        </Typography>
      </div>
      <Button
        className={classNames('bs-consumer-summary-card__barcode-button', {
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
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSummaryCardHeader);
