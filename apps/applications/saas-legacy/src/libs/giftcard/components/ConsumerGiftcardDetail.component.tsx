import React, { type FC } from 'react';
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

const ConsumerGiftcardDetail: FC<Props> = ({
  consumerGiftcard,
  consumerGiftCardLoading,
  disabled,
  goToGiftcard,
  invoice,
  onInvoiceClick,
}) => {
  const { t } = useTranslation('giftcard');
  const classes = useStyles();

  if (!consumerGiftcard) {
    return consumerGiftCardLoading ? (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    ) : null;
  }

  return (
    <div className={classes.container}>
      {!!invoice && (
        <div className={classes.section}>
          <Typography className={classes.title} variant="h5">
            {t('consumerGiftcard.linkedInvoice')}
          </Typography>
          <Paper>
            <InvoiceListItem
              disabled={disabled}
              invoice={invoice}
              onClick={() => onInvoiceClick(invoice.uuid)}
            />
          </Paper>
        </div>
      )}

      {consumerGiftcard?.giftcard && (
        <div className={classes.section}>
          <Typography className={classes.title} variant="h5">
            {t('giftcard.configurationTitle')}
          </Typography>
          <Paper>
            <GiftcardListItem
              disabled={disabled}
              giftcard={consumerGiftcard.giftcard}
              onClick={() => goToGiftcard(consumerGiftcard.giftcard.id)}
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
