// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import { getShopItemName } from '../../shop/utils';

import classNames from 'classnames';
import { AttachFile } from '@material-ui/icons';
import { ConsumerGiftcardKind } from '@bsport/common/lib/master-data/giftcard.js';

type Props = {
  invoiceItem: InvoiceItem,
  onDelete: () => void,
  /** An optional handler when clicking on an invoice item that is a printable gift card */
  handleShowPrintableGiftcardDetails?: (id: number) => () => void,
};

export const InvoiceItem = (props: Props) => {
  const { onDelete, invoiceItem } = props;
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  let voucher = null;

  const subtitle = React.useMemo(
    () => invoiceItem.incremental_consumer_giftcard_identifier,
    [invoiceItem.incremental_consumer_giftcard_identifier],
  );

  if (parseFloat(invoiceItem.voucher) !== 0) {
    // eslint-disable-next-line
    voucher = invoiceItem.voucher;
  }

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
          className={classNames({
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
          {(invoiceItem.subtitle || '') +
            (voucher
              ? `${t('invoiceItem.voucher', {
                  voucher: getCurrencyDisplayWithPrice(voucher),
                })}`
              : '')}
        </Typography>
      </div>

      {invoiceItem?.consumer_giftcard_kind ===
        ConsumerGiftcardKind.PRINTABLE && (
        <IconButton
          className={classes.printableGiftcardShowDetails}
          onClick={props.handleShowPrintableGiftcardDetails?.(
            invoiceItem?.object_id,
          )}
          size="small"
        >
          <AttachFile fontSize="inherit" />
        </IconButton>
      )}

      <div
        className={classNames({
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
            parseFloat(invoiceItem.price - (voucher || 0)).toFixed(2),
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
