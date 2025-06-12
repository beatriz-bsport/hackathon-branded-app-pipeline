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
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import CancelIcon from '@material-ui/icons/Cancel';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { OptionCallback } from '#src/state/types';
import { PlatformInvoice } from '../type';

type Props = {
  platformInvoice: PlatformInvoice;
  divider?: boolean;
  payNowInvoice: (payment_backend_id: string, options?: OptionCallback) => void;
  hasPaymentMethod: boolean;
  defaultCurrencyDisplay: String;
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
    case 'cancelled_with_credit_note':
    case 'cancelled_with_negative_invoice':
      return <CancelIcon color="error" />;
    case 'negative_invoice_cancelling_bad_debt_invoice':
      return <KeyboardReturnIcon color="secondary" />;
    default:
      return null;
  }
};

export const PlatformInvoiceListItem = (props: Props) => {
  const { t } = useTranslation(['platformBilling']);
  const classes = useStyles();

  const { platformInvoice, defaultCurrencyDisplay } = props;
  const { pdf_url, month, year, status, total_price_cts } = platformInvoice;

  const [paymentProcessing, setPaymentProcessing] = React.useState(false);

  const secondaryText = (
    <div className={classes.row}>
      <Typography color="textSecondary" variant="caption">
        {getCurrencyDisplayWithPrice(
          total_price_cts / 100,
          false,
          undefined,
          // @ts-expect-error
          defaultCurrencyDisplay,
        )}
      </Typography>
      <Typography
        color={
          [
            'succeeded',
            'cancelled_with_credit_note',
            'cancelled_with_negative_invoice',
            'negative_invoice_cancelling_bad_debt_invoice',
          ].includes(status)
            ? 'inherit'
            : 'error'
        }
        variant="caption"
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
      {['missing_charge', 'failed'].includes(platformInvoice.status) &&
        !!props.hasPaymentMethod &&
        !!props.payNowInvoice && (
          <Button
            color="primary"
            disabled={paymentProcessing}
            onClick={() => {
              setPaymentProcessing(true);
              props.payNowInvoice(platformInvoice.payment_backend_id, {
                onSuccess: () => setPaymentProcessing(false),
                onError: () => setPaymentProcessing(false),
              });
            }}
            variant="outlined"
          >
            {t('platformInvoice.bill')}
          </Button>
        )}
      {!!pdf_url && (
        <IconButton
          onClick={() => {
            // @ts-expect-error
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
