// @flow
import React from 'react';
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

type Props = {
  invoiceItem: InvoiceItem,
  onDelete: () => void,
  /** An optional handler when clicking on an invoice item that is a printable gift card */
  handleShowPrintableGiftcardDetails?: (id: number) => () => void,
};

// Copy the logic in backend InvoiceItem.voucher_reasons_translated property
// so that we use the language set in the frontend
const translateVoucherReasons = (voucherReasons, t) => {
  return voucherReasons.map((voucherReason) => {
    switch (voucherReason.kind) {
      case InvoiceItemVoucherTraceKind.PAYMENT_COMBO:
      case InvoiceItemVoucherTraceKind.COUPON_REFERRED:
      case InvoiceItemVoucherTraceKind.COUPON_REFERRING:
      case InvoiceItemVoucherTraceKind.PRO_RATED_FROM_SUBSCRIPTION:
        return t(`invoiceItem.voucherReason.${voucherReason.kind}`);
      case InvoiceItemVoucherTraceKind.COUPON_CODE:
        return t(`invoiceItem.voucherReason.${voucherReason.kind}`, {
          coupon_name: voucherReason.value ?? '',
        });
      case InvoiceItemVoucherTraceKind.MANUAL:
        return voucherReason.value
          ? t(
              `invoiceItem.voucherReason.${InvoiceItemVoucherTraceKind.MANUAL}`,
              {
                manual_reason: voucherReason.value,
                interpolation: { escapeValue: false },
              },
            )
          : t('invoiceItem.voucherReason.manualWithNoReason');
      default:
        return '';
    }
  });
};

const InvoiceItem = (props: Props) => {
  const { onDelete, invoiceItem, handleShowPrintableGiftcardDetails } = props;
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const subtitle = React.useMemo(
    () => invoiceItem.incremental_consumer_giftcard_identifier,
    [invoiceItem.incremental_consumer_giftcard_identifier],
  );

  const voucherData = React.useMemo(() => {
    if (parseFloat(invoiceItem.voucher) === 0)
      return { voucher: null, voucher_reason: null };

    const voucher = invoiceItem.voucher;
    const voucherReasons = invoiceItem.voucher_reasons || [];
    const voucherReasonsTranslated = translateVoucherReasons(voucherReasons, t);
    const voucher_reason = voucherReasonsTranslated.join(' + ');

    return { voucher, voucher_reason };
  }, [invoiceItem.voucher, invoiceItem.voucher_reasons, t]);

  const voucherDisplayText = React.useMemo(() => {
    if (!voucherData.voucher) return '';
    if (voucherData.voucher_reason) {
      return `${voucherData.voucher_reason} ${getCurrencyDisplayWithPrice(
        voucherData.voucher,
      )}`;
    }
    return t('invoiceItem.voucher', {
      voucher: getCurrencyDisplayWithPrice(voucherData.voucher),
    });
  }, [voucherData.voucher, voucherData.voucher_reason, t]);

  return (
    <div className={classes.container}>
      <div className={classes.leftText}>
        <Typography className={invoiceItem.reverted ? classes.revert : null}>
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
          className={invoiceItem.reverted ? classes.revert : null}
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
          onClick={handleShowPrintableGiftcardDetails?.(invoiceItem?.object_id)}
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
        <Typography className={invoiceItem.reverted ? classes.revert : null}>
          {getCurrencyDisplayWithPrice(
            parseFloat(invoiceItem.price - (voucherData.voucher || 0)).toFixed(
              2,
            ),
          )}
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

export default InvoiceItem;
