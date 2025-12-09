import React, { type FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { getShopItemName } from '../../shop/utils';

import clsx from 'clsx';
import { AttachFile } from '@material-ui/icons';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';
import { InvoiceItemVoucherTraceKind } from '@bsport/common/lib/master-data/invoice-item.js';
import type { BaseInvoiceItem } from '../invoice-item/types';
import { TFunction } from 'i18next';

type Props = {
  invoiceItem: BaseInvoiceItem;
  onDelete: () => void;
  /** An optional handler when clicking on an invoice item that is a printable gift card */
  handleShowPrintableGiftcardDetails?: (id: number) => () => void;
};

// Copy the logic in backend InvoiceItem.voucher_reasons_translated property
// so that we use the language set in the frontend
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const translateVoucherReasons = (
  voucherReasons: Array<{ kind: string; value: number }>,
  t: TFunction,
) => {
  return voucherReasons.map((voucherReason) => {
    switch (voucherReason.kind) {
      case InvoiceItemVoucherTraceKind.PAYMENT_COMBO:
      case InvoiceItemVoucherTraceKind.COUPON_REFERRED:
      case InvoiceItemVoucherTraceKind.COUPON_REFERRING:
      case InvoiceItemVoucherTraceKind.PRO_RATED_FROM_SUBSCRIPTION:
        return t(`invoiceItem.voucherReason.${voucherReason.kind}`, {
          ns: 'invoice',
        });
      case InvoiceItemVoucherTraceKind.COUPON_CODE:
        return t(`invoiceItem.voucherReason.${voucherReason.kind}`, {
          coupon_name: voucherReason.value ?? '',
          ns: 'invoice',
        });
      case InvoiceItemVoucherTraceKind.MANUAL:
        return voucherReason.value
          ? t(
              `invoiceItem.voucherReason.${InvoiceItemVoucherTraceKind.MANUAL}`,
              {
                manual_reason: voucherReason.value,
                interpolation: { escapeValue: false },
                ns: 'invoice',
              },
            )
          : t('invoiceItem.voucherReason.manualWithNoReason', {
              ns: 'invoice',
            });
      default:
        return '';
    }
  });
};

export const InvoiceListItem: FC<Props> = (props) => {
  const { onDelete, invoiceItem, handleShowPrintableGiftcardDetails } = props;
  const classes = useStyles();
  const { t } = useTranslation(['invoice', 'b2b_giftcard']);

  const subtitle = React.useMemo(
    () => invoiceItem.incremental_consumer_giftcard_identifier,
    [invoiceItem.incremental_consumer_giftcard_identifier],
  );

  const voucherDisplayText = React.useMemo(() => {
    if (!invoiceItem.voucher) return '';

    if (invoiceItem.voucher_reason) {
      return `${invoiceItem.voucher_reason} ${getCurrencyDisplayWithPrice(
        invoiceItem.voucher,
      )}`;
    }

    return t('invoiceItem.voucher', {
      voucher: getCurrencyDisplayWithPrice(invoiceItem.voucher),
      ns: 'invoice',
    });
  }, [invoiceItem.voucher, invoiceItem.voucher_reason, t]);

  const displayedPrice = invoiceItem.hasCustomPrice
    ? t('customAmount.billingForm.priceIsToBeDetermined', {
        ns: 'b2b_giftcard',
      })
    : getCurrencyDisplayWithPrice(
        (parseFloat(invoiceItem.price) - (invoiceItem.voucher ?? 0)).toFixed(2),
      );

  return (
    <div className={classes.container}>
      <div className={classes.leftText}>
        <Typography className={invoiceItem.reverted ? classes.revert : ''}>
          {getShopItemName({
            name: invoiceItem?.name ?? '',
            color: invoiceItem?.color ?? '',
            size: invoiceItem?.size ?? '',
          })}
        </Typography>
        {/*Show the sequential giftcard identifier if it exists, if the invoice item content is a ConsumerGiftcard*/}
        <Typography
          className={clsx({
            [classes.subtitleNotDisplayed]: !subtitle,
            [classes.revert]: invoiceItem.reverted,
          })}
          color="textSecondary"
          variant="body2"
        >
          {subtitle}
        </Typography>
        <Typography
          className={invoiceItem.reverted ? classes.revert : ''}
          color="textSecondary"
          variant="caption"
        >
          {voucherDisplayText}
        </Typography>
      </div>

      {invoiceItem?.consumer_giftcard_kind ===
        ConsumerGiftcardKind.PRINTABLE && (
        <IconButton
          className={classes.printableGiftcardShowDetails}
          onClick={
            invoiceItem?.object_id && handleShowPrintableGiftcardDetails
              ? handleShowPrintableGiftcardDetails(invoiceItem.object_id)
              : undefined
          }
          size="small"
        >
          <AttachFile fontSize="inherit" />
        </IconButton>
      )}

      <div
        className={clsx({
          [classes.line]: !(
            invoiceItem?.consumer_giftcard_kind ===
            ConsumerGiftcardKind.PRINTABLE
          ),
          [classes.compactLine]:
            invoiceItem?.consumer_giftcard_kind ===
            ConsumerGiftcardKind.PRINTABLE,
        })}
      />
      <div className={classes.secondaryAction}>
        <Typography className={invoiceItem.reverted ? classes.revert : ''}>
          {displayedPrice}
        </Typography>
        {!!invoiceItem.editable && onDelete && (
          <IconButton
            color="primary"
            disabled={!invoiceItem.editable}
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  secondaryAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  compactLine: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    wordBreak: 'break-word',
  },
  revert: {
    textDecoration: 'line-through',
  },
  subtitleNotDisplayed: {
    display: 'none',
  },
  printableGiftcardShowDetails: {
    marginLeft: theme.spacing(1),
  },
}));
