// @flow
import React from 'react';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

import BasketConsumer from '../../libs/checkout/components/BasketConsumer.component';
import type { Basket } from '../../libs/checkout/types';
import { OptionCallback } from '../../state/types';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    padding: theme.spacing(2),
  },
}));

type Props = {
  basket: Basket,
  loading: boolean,
  open: boolean,
  fullScreen: boolean,
  onCancel: () => void,
  onAddCheckoutItem: (data: any, options?: OptionCallback) => void,
  goToCheckout: () => void,
  onRemoveCheckoutItem: (data: any) => void,
  isExcludingTax?: boolean,
};

export const MarketplaceBasketDialog = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation([]);
  return (
    <Dialog open={props.open} fullScreen={props.fullScreen}>
      <Typography variant="h4" className={classes.title}>
        {t('checkout:myBasket.title')}
      </Typography>
      <BasketConsumer
        isExcludingTax={props.isExcludingTax}
        basket={props.basket}
        withPrice
        onCancel={props.onCancel}
        loading={props.loading}
        onRemoveCheckoutItem={props.onRemoveCheckoutItem}
        onAddCheckoutItem={props.onAddCheckoutItem}
      />
      <DialogActions>
        <Button color="secondary" onClick={props.onCancel}>
          {t('checkout:myBasket.actions.closeBasket')}
        </Button>
        <Button
          color="primary"
          disabled={props.basket && props.basket.checkout_items.length === 0}
          onClick={props.goToCheckout}
        >
          {t('checkout:myBasket.actions.checkoutBasket')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default compose(withMobileDialog())(MarketplaceBasketDialog);
