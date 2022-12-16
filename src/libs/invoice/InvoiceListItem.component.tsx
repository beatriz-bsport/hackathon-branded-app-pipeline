import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { formatAsDatetime } from '../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import LoadingListItem from '#components/LoadingListItem.component';
import { Invoice } from '#libs/invoice/types';
import { getInvoiceIdentifier } from '#libs/invoice/utils';

type Props = {
  onClick: (uuid: string) => void;
  invoice: Invoice;
};

const InvoiceListItem = (props: Props) => {
  const classes = useStyles({ reverted: props?.invoice?.reverted });
  const { invoice } = props;

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
      button
      key={invoice.uuid}
      dense
      divider
      onClick={() => props.onClick(invoice.uuid)}
    >
      <ListItemText primary={invoiceDate} secondary={invoiceId} />
      <ListItemSecondaryAction>
        <Typography
          variant="subtitle1"
          color={color}
          classes={{ root: classes.listItemTitle }}
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
