import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { ConsumerGenericCardFooter } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { CreditCard01 } from '#src/components/untitledui';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

import '../styles.css';

type Props = {
  isMobile?: boolean;
  selectedFilter: InvoicesFiltersEnum;
  onDownload: () => void;
  onPay: () => void;
  onReceiptDownload: () => void;
  onRefundedInvoiceDownload: () => void;
};

const ConsumerInvoiceDetailsCardFooter: React.FC<Props> = ({
  isMobile,
  selectedFilter,
  onDownload,
  onPay,
  onReceiptDownload,
  onRefundedInvoiceDownload,
}) => {
  const { t } = useTranslation('consumerSpace');

  const mainButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay: selectedFilter === InvoicesFiltersEnum.UNPAID,
        color: 'primary' as ButtonColor,
        onClick: onPay,
        leftIcon: <CreditCard01 />,
        variant: 'contained' as ButtonVariant,
        isDisabled: !onPay,
        label: t('reworked.myInvoices.detailsCard.pay'),
        buttonClassName: classNames(
          {
            'bs-consumer-invoice-details-card__footer__button': !isMobile,
            'bs-consumer-invoice-details-card__footer__button--mobile':
              !!isMobile,
          },
          'bs-consumer-invoice-details-card__footer__button-pay',
        ),
        typographyClassName:
          'bs-consumer-invoice-details-card__footer__label-pay',
      },
      {
        shouldDisplay: !!onDownload,
        color: 'grey' as ButtonColor,
        onClick: onDownload,
        leftIcon: null,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onDownload,
        label:
          selectedFilter === InvoicesFiltersEnum.REFUNDED
            ? t('reworked.myInvoices.detailsCard.downloadOriginalInvoice')
            : t('reworked.myInvoices.detailsCard.download'),
        buttonClassName: classNames(
          {
            'bs-consumer-invoice-details-card__footer__button': !isMobile,
            'bs-consumer-invoice-details-card__footer__button--mobile':
              !!isMobile,
          },
          'bs-consumer-invoice-details-card__footer__button-download',
        ),
        typographyClassName:
          'bs-consumer-invoice-details-card__footer__label-download',
      },
      {
        shouldDisplay: !!onReceiptDownload,
        color: 'grey' as ButtonColor,
        onClick: onReceiptDownload,
        leftIcon: null,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onReceiptDownload,
        label: t('reworked.myInvoices.detailsCard.downloadReceipt'),
        buttonClassName: classNames(
          {
            'bs-consumer-invoice-details-card__footer__button': !isMobile,
            'bs-consumer-invoice-details-card__footer__button--mobile':
              !!isMobile,
          },
          'bs-consumer-invoice-details-card__footer__button-download-receipt',
        ),
        typographyClassName:
          'bs-consumer-invoice-details-card__footer__label-download-receipt',
      },
      {
        shouldDisplay:
          selectedFilter === InvoicesFiltersEnum.REFUNDED &&
          !!onRefundedInvoiceDownload,
        color: 'grey' as ButtonColor,
        onClick: onRefundedInvoiceDownload,
        leftIcon: null,
        variant: 'outlined' as ButtonVariant,
        isDisabled: !onRefundedInvoiceDownload,
        label: t('reworked.myInvoices.detailsCard.downloadRefundedInvoice'),
        buttonClassName: classNames(
          {
            'bs-consumer-invoice-details-card__footer__button': !isMobile,
            'bs-consumer-invoice-details-card__footer__button--mobile':
              !!isMobile,
          },
          'bs-consumer-invoice-details-card__footer__button-download-refunded-invoice',
        ),
        typographyClassName:
          'bs-consumer-invoice-details-card__footer__label-download-refunded-invoice',
      },
    ],
    [
      isMobile,
      onDownload,
      onPay,
      onReceiptDownload,
      onRefundedInvoiceDownload,
      selectedFilter,
      t,
    ],
  );

  return (
    <ConsumerGenericCardFooter
      className="bs-consumer-invoice-details-card__footer"
      mainButtonsList={mainButtonsList}
    />
  );
};

export default React.memo(ConsumerInvoiceDetailsCardFooter);
