// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { getCurrencyDisplay } from '../../theme/selectors';

type Props = {
  invoiceItem: InvoiceItem,
  onDelete: () => void,
};

export const InvoiceItem = (props: Props) => {
  const { onDelete, invoiceItem } = props;
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  let voucher = null;
  if (parseFloat(invoiceItem.voucher) !== 0) {
    // eslint-disable-next-line
    voucher = invoiceItem.voucher;
  }
  return (
    <div className={classes.container}>
      <div className={classes.leftText}>
        <Typography className={invoiceItem.reverted ? classes.revert : null}>
          {invoiceItem.name}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={invoiceItem.reverted ? classes.revert : null}
        >
          {(invoiceItem.subtitle || '') +
            (voucher ? t('invoiceItem.voucher', { voucher }) : '')}
        </Typography>
      </div>

      <div className={classes.line} />
      <div className={classes.secondaryAction}>
        <Typography className={invoiceItem.reverted ? classes.revert : null}>
          {parseFloat(invoiceItem.price - (voucher || 0)).toFixed(2)}{' '}
          {getCurrencyDisplay()}
        </Typography>
        {!!invoiceItem.editable && onDelete && (
          <IconButton
            onClick={onDelete}
            disabled={!invoiceItem.editable}
            color="primary"
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
}));

export default InvoiceItem;
