// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { formatAsDatetime } from '../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';

import LoadingListItem from '../../components/LoadingListItem.component';

type Props = {
  onClick: (uuid: string) => void,
  invoice: Invoice,
};

const InvoiceListItem = (props: Props) => {
  const { invoice } = props;

  if (!invoice) {
    return <LoadingListItem dense divider />;
  }

  let color = invoice.price_due > invoice.price_payed ? 'error' : 'primary';
  if (invoice.reverted) {
    color = 'secondary';
  }

  return (
    <ListItem
      button
      key={invoice.uuid}
      dense
      divider
      onClick={() => props.onClick(invoice.uuid)}
    >
      <ListItemText
        primary={`${formatAsDatetime(invoice.date)}`}
        secondary={invoice.uuid.slice(0, 8).toUpperCase()}
      />
      <ListItemSecondaryAction>
        <Typography
          variant="subtitle1"
          color={color}
          style={{
            paddingRight: 12,
            ...(invoice.reverted ? { textDecoration: 'line-through' } : {}),
          }}
        >
          {`${getCurrencyDisplayWithPrice(invoice.price_due)}`}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default InvoiceListItem;
