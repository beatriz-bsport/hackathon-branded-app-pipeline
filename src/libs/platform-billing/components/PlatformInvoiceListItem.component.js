// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AttachIcon from '@material-ui/icons/Attachment';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  platformInvoice: PlatformInvoice,
  divider?: boolean,
  payNowInvoice: (payment_backend_id: string) => void,
};

const StatusIcon = ({ status }: any) => {
  switch (status) {
    case 'failed': {
      return <ErrorIcon color="error" />;
    }
    case 'processing': {
      return <RefreshIcon color="secondary" />;
    }
    case 'succeeded': {
      return <CheckIcon color="primary" />;
    }
    case 'disputed': {
      return <WarningIcon color="error" />;
    }
    case 'missing_charge': {
      return <WarningIcon color="secondary" />;
    }
    default:
      return null;
  }
};

export const PlatformInvoiceListItem = (props: Props) => {
  const { t } = useTranslation(['platformBilling']);
  const classes = useStyles();

  const { platformInvoice } = props;
  const { pdf_url, month, year, status, total_price_cts } = platformInvoice;

  const [paymentProcessing, setPaymentProcessing] = React.useState(false);

  const secondaryText = (
    <div className={classes.row}>
      <Typography variant="caption" color="textSecondary">
        {`${getCurrencyDisplayWithPrice(total_price_cts / 100)}`}
      </Typography>
      <Typography
        variant="caption"
        color={status === 'succeeded' ? 'inherit' : 'error'}
      >
        {` - ${t(`platformInvoice.status.${status}`)}`}
      </Typography>
    </div>
  );

  return (
    <ListItem divider={props.divider}>
      <Tooltip title={t(`platformInvoice.status.${status}`)}>
        <ListItemAvatar>
          <StatusIcon status={status} />
        </ListItemAvatar>
      </Tooltip>
      <ListItemText
        primary={t('platformInvoice.label', { month, year })}
        secondary={secondaryText}
      />
      <Button
        color="primary"
        variant="outlined"
        disabled={paymentProcessing}
        onClick={() => {
          setPaymentProcessing(true);
          props.payNowInvoice(platformInvoice.payment_backend_id, {
            onSuccess: () => setPaymentProcessing(false),
            onError: () => setPaymentProcessing(false),
          });
        }}
      >
        {t('platformInvoice.bill')}
      </Button>
      {!!pdf_url && (
        <IconButton
          onClick={() => {
            window.location = pdf_url;
          }}
        >
          <AttachIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

const useStyles = makeStyles(() => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default PlatformInvoiceListItem;
