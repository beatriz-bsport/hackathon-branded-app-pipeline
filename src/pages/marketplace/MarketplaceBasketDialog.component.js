// @flow
import React from 'react';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import BasketConsumer from '../../libs/checkout/components/BasketConsumer.component';
import type { Basket } from '../../libs/checkout/types';

type Props = {
  t: TFunction,
  basket: Basket,
  loading: boolean,
  open: boolean,
  fullScreen: boolean,
  onCancel: () => void,
  addItemToBasket: (data: any) => void,
  goToCheckout: () => void,
  onRemoveCheckoutItem: (data: any) => void,
  classes: Object,
};

export const MarketplaceBasketDialog = (props: Props) => (
  <Dialog open={props.open} fullScreen={props.fullScreen}>
    <Typography variant="h4" className={props.classes.title}>
      {props.t('checkout:myBasket.title')}
    </Typography>
    <BasketConsumer
      basket={props.basket}
      withPrice
      onCancel={props.onCancel}
      loading={props.loading}
      onRemoveCheckoutItem={props.onRemoveCheckoutItem}
      onAddCheckoutItem={props.addItemToBasket}
    />
    <DialogActions>
      <Button color="secondary" onClick={props.onCancel}>
        {props.t('checkout:myBasket.actions.closeBasket')}
      </Button>
      <Button
        color="primary"
        disabled={props.basket && props.basket.checkout_items.length === 0}
        onClick={props.goToCheckout}
      >
        {props.t('checkout:myBasket.actions.checkoutBasket')}
      </Button>
    </DialogActions>
  </Dialog>
);

const styles = (theme) => ({
  title: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withMobileDialog(),
)(MarketplaceBasketDialog);
