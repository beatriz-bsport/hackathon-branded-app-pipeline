import React from 'react';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { isDateInTheFuture } from '#src/utils/datetime';
import { Alert } from '@material-ui/lab';
import { WithIsSharedActive } from '#src/libs/relationship/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';

type Props = {
  action: () => void;
  close: () => void;
  open: boolean;
  consumerPaymentPack: WithIsSharedActive<ConsumerPaymentPack<PaymentPack>>;
  isActivating?: boolean;
};

export const ManualActivationDialog = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const isActiveInTheFuture = isDateInTheFuture(
    props.consumerPaymentPack.starting_date,
  );
  const copies = {
    description: t(
      'manualActivation.' +
        (isActiveInTheFuture ? 'replaceActiveStartDate' : 'setActiveStartDate'),
    ),
    alert: isActiveInTheFuture
      ? t('manualActivation.replaceActiveStartDateAlert')
      : undefined,
  };

  return (
    <Dialog maxWidth="sm" open={props.open}>
      <DialogTitle>{t('manualActivation.title')}</DialogTitle>
      <List>
        <ListItem>
          <ListItemText>{copies.description}</ListItemText>
        </ListItem>
        {copies.alert && (
          <ListItem>
            <Alert severity="info">{copies.alert}</Alert>
          </ListItem>
        )}
      </List>
      <DialogActions>
        <Button onClick={props.close}>{t('manualActivation.close')}</Button>
        <Button
          color="primary"
          disabled={props.isActivating}
          onClick={props.action}
          startIcon={props.isActivating ? <CircularProgress size={20} /> : null}
          variant="contained"
        >
          {t('manualActivation.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
