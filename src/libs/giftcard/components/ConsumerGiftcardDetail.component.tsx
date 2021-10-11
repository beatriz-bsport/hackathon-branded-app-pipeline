import React from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';
import GiftcardListItem from './GiftcardListItem.component';
import { ConsumerGiftcard, WithGiftcard } from '../types';
import { Invoice } from '../../invoice/types';

type Props = {
  consumerGiftcard: WithGiftcard<ConsumerGiftcard> | null;
  invoice: Invoice | null;
  onInvoiceClick: (uuid: string) => void;
  goToGiftcard: (giftcardId: number) => void;
};

const ConsumerGiftcardDetail = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  if (!props.consumerGiftcard) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
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
              onClick={() => props.onInvoiceClick(props.invoice.uuid)}
              invoice={props.invoice}
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
              onClick={() =>
                props.goToGiftcard(props.consumerGiftcard.giftcard.id)
              }
              giftcard={props.consumerGiftcard.giftcard}
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
