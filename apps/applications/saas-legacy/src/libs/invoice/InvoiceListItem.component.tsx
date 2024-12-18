import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
// @ts-expect-error
import LoadingListItem from '#src/components/LoadingListItem.component';
import { Invoice } from '#src/libs/invoice/types';
import { getInvoiceIdentifier } from '#src/libs/invoice/utils';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { formatAsDatetime } from '../../utils/datetime';

type Props = {
  onClick: (uuid: string) => void;
  invoice: Invoice;
  disabled?: boolean;
};

const InvoiceListItem = (props: Props) => {
  const classes = useStyles({ reverted: props?.invoice?.reverted });
  const { invoice, disabled } = props;

  if (!invoice) {
    return <LoadingListItem dense divider />;
  }

  let color: 'primary' | 'error' | 'secondary' =
    invoice.price_due > invoice.price_payed ? 'error' : 'primary';
  if (invoice.reverted) {
    color = 'secondary';
  }

  const invoiceId = getInvoiceIdentifier(invoice);
  const invoiceDate = formatAsDatetime(invoice.date);
  const invoicePrice = getCurrencyDisplayWithPrice(invoice.price_due);

  return (
    <ListItem
      key={invoice.uuid}
      button
      dense
      divider
      disabled={disabled}
      onClick={() => props.onClick(invoice.uuid)}
    >
      <ListItemText primary={invoiceDate} secondary={invoiceId} />
      <ListItemSecondaryAction>
        <Typography
          classes={{ root: classes.listItemTitle }}
          color={color}
          variant="subtitle1"
        >
          {invoicePrice}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles<Theme, { reverted: boolean }>({
  listItemTitle: {
    paddingRight: 12,
    textDecoration: ({ reverted }) => (reverted ? 'line-through' : 'inherit'),
  },
});

export default InvoiceListItem;
