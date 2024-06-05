import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerGenericCardFooter } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import {
  CreditCard01,
  FileCheck02,
  FileDownload02,
  ReceiptCheck,
} from '#src/components/untitledui';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

import '../styles.css';

type Props = {
  menuIdentifier: string;
  selectedFilter: InvoicesFiltersEnum;
  onDownload?: () => void;
  onPay?: () => void;
  onReceiptDownload?: () => void;
  onRefundedInvoiceDownload?: () => void;
};

const ConsumerInvoiceCardFooter: React.FC<Props> = ({
  menuIdentifier,
  selectedFilter,
  onDownload,
  onPay,
  onReceiptDownload,
  onRefundedInvoiceDownload,
}) => {
  const { t } = useTranslation('consumerSpace');

  const menuItemsList = React.useMemo(
    () => [
      {
        menuItemClassName: 'bs-consumer-invoice-card__menu-item',
        shouldDisplay: !!onDownload,
        label:
          selectedFilter === InvoicesFiltersEnum.REFUNDED
            ? t('reworked.myInvoices.card.originalInvoice')
            : t('reworked.myInvoices.card.invoice'),
        leftIcon: <FileDownload02 />,
        onClick: onDownload,
      },
      {
        menuItemClassName: 'bs-consumer-invoice-card__menu-item',
        shouldDisplay: !!onReceiptDownload,
        label: t('reworked.myInvoices.card.receipt'),
        leftIcon: <ReceiptCheck />,
        onClick: onReceiptDownload,
      },
      {
        menuItemClassName: 'bs-consumer-invoice-card__menu-item',
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.REFUNDED &&
          !!onRefundedInvoiceDownload,
        label: t('reworked.myInvoices.card.refundedInvoice'),
        leftIcon: <FileCheck02 />,
        onClick: onRefundedInvoiceDownload,
      },
    ],
    [
      onDownload,
      onReceiptDownload,
      onRefundedInvoiceDownload,
      selectedFilter,
      t,
    ],
  );

  const shouldDisplayMenuButton = React.useMemo(() => {
    const displayedItemsNumber = menuItemsList.reduce(
      (acc, item) => acc + (item.shouldDisplay ? 1 : 0),
      0,
    );
    return displayedItemsNumber > 1;
  }, [menuItemsList]);

  const mainButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay:
          !shouldDisplayMenuButton &&
          selectedFilter === InvoicesFiltersEnum.UNPAID &&
          !!onDownload,
        color: 'grey' as ButtonColor,
        onClick: onDownload,
        leftIcon: <FileDownload02 />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onDownload,
        label: t('reworked.myInvoices.card.download'),
        buttonClassName: 'bs-consumer-invoice-card__footer__button-download',
        typographyClassName: 'bs-consumer-invoice-card__footer__label-download',
      },
      {
        shouldDisplay:
          !shouldDisplayMenuButton &&
          selectedFilter === InvoicesFiltersEnum.PAID &&
          !!onDownload,
        color: 'grey' as ButtonColor,
        onClick: onDownload,
        leftIcon: <FileDownload02 />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onDownload,
        label: t('reworked.myInvoices.card.downloadInvoice'),
        buttonClassName:
          'bs-consumer-invoice-card__footer__button-download-invoice',
        typographyClassName:
          'bs-consumer-invoice-card__footer__label-download-invoice',
      },
      {
        shouldDisplay: !shouldDisplayMenuButton && !!onReceiptDownload,
        color: 'grey' as ButtonColor,
        onClick: onReceiptDownload,
        leftIcon: <ReceiptCheck />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onReceiptDownload,
        label: t('reworked.myInvoices.card.downloadReceipt'),
        buttonClassName:
          'bs-consumer-invoice-card__footer__button-download-receipt',
        typographyClassName:
          'bs-consumer-invoice-card__footer__label-download-receipt',
      },
      {
        shouldDisplay: !shouldDisplayMenuButton && !!onRefundedInvoiceDownload,
        color: 'grey' as ButtonColor,
        onClick: onRefundedInvoiceDownload,
        leftIcon: <FileCheck02 />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onRefundedInvoiceDownload,
        label: t('reworked.myInvoices.card.downloadRefundedInvoice'),
        buttonClassName:
          'bs-consumer-invoice-card__footer__button-download-refunded-invoice',
        typographyClassName:
          'bs-consumer-invoice-card__footer__label-download-refunded-invoice',
      },
      {
        shouldDisplay:
          !shouldDisplayMenuButton &&
          selectedFilter === InvoicesFiltersEnum.REFUNDED &&
          !!onDownload,
        color: 'grey' as ButtonColor,
        onClick: onDownload,
        leftIcon: <FileDownload02 />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onDownload,
        label: t('reworked.myInvoices.card.downloadOriginalInvoice'),
        buttonClassName:
          'bs-consumer-invoice-card__footer__button-download-original-invoice',
        typographyClassName:
          'bs-consumer-invoice-card__footer__label-download-original-invoice',
      },
      {
        shouldDisplay: selectedFilter === InvoicesFiltersEnum.UNPAID && !!onPay,
        color: 'primary' as ButtonColor,
        onClick: onPay,
        leftIcon: <CreditCard01 />,
        variant: 'contained' as ButtonVariant,
        isDisabled: !onPay,
        label: t('reworked.myInvoices.card.pay'),
        buttonClassName: 'bs-consumer-invoice-card__footer__button-pay',
        typographyClassName: 'bs-consumer-invoice-card__footer__label-pay',
      },
    ],
    [
      onDownload,
      onPay,
      onReceiptDownload,
      onRefundedInvoiceDownload,
      selectedFilter,
      shouldDisplayMenuButton,
      t,
    ],
  );

  const hasAtLeastOneMainButton = React.useMemo(() => {
    const displayedButtonsNumber = menuItemsList.reduce(
      (acc, item) => acc + (item.shouldDisplay ? 1 : 0),
      0,
    );
    return displayedButtonsNumber > 0;
  }, [menuItemsList]);

  const isFooterDisplayed = shouldDisplayMenuButton || hasAtLeastOneMainButton;

  if (!isFooterDisplayed) return null;

  return (
    <ConsumerGenericCardFooter
      className="bs-consumer-invoice-card__footer"
      mainButtonsList={mainButtonsList}
      menuButtonClassName="bs-consumer-invoice-card__footer__menu-button"
      menuButtonLabel={t('reworked.myInvoices.card.downloads')}
      menuClassName="bs-consumer-invoice-card__footer__menu"
      menuId={menuIdentifier}
      menuItemsList={menuItemsList}
      secondaryButtonsHidden={shouldDisplayMenuButton}
    />
  );
};

export default React.memo(ConsumerInvoiceCardFooter);
