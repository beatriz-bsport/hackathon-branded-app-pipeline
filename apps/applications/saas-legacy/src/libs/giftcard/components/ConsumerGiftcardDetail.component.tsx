import React from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import type { Invoice } from '#src/libs/invoice/types';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';

import GiftcardListItem from './GiftcardListItem.component';
import type { ConsumerGiftcard, WithGiftcard } from '../types';

type Props = {
  consumerGiftcard: WithGiftcard<ConsumerGiftcard> | null;
  consumerGiftCardLoading: boolean;
  invoice: Invoice | null;
  disabled?: boolean;
  onInvoiceClick: (uuid: string) => void;
  goToGiftcard: (giftcardId: number) => void;
};

const ConsumerGiftcardDetail = (props: Props) => {
  const { t } = useTranslation('giftcard');
  const classes = useStyles();
  if (!props.consumerGiftcard) {
    return props.consumerGiftCardLoading ? (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    ) : null;
  }
  return (
    <div className={classes.container}>
      {!!props.invoice && (
        <div className={classes.section}>
          <Typography className={classes.title} variant="h5">
            {t('consumerGiftcard.linkedInvoice')}
          </Typography>
          <Paper>
            <InvoiceListItem
              disabled={props.disabled}
              invoice={props.invoice}
              onClick={() => props.onInvoiceClick(props.invoice.uuid)}
            />
          </Paper>
        </div>
      )}
      {props.consumerGiftcard?.giftcard && (
        <div className={classes.section}>
          <Typography className={classes.title} variant="h5">
            {t('giftcard.configurationTitle')}
          </Typography>
          <Paper>
            <GiftcardListItem
              disabled={props.disabled}
              giftcard={props.consumerGiftcard.giftcard}
              onClick={() =>
                props.goToGiftcard(props.consumerGiftcard.giftcard.id)
              }
            />
          </Paper>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  section: {
    marginBottom: theme.spacing(2),
  },
}));

export default ConsumerGiftcardDetail;
