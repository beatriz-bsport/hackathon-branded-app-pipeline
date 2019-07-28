// @flow
import React from 'react';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';

import type { OrderWithProducts, ProductData } from '../types';

import ProductLine from './ProductLine.component';
import DeliveryForm from './DeliveryForm.component';
import DeliveryFeeListItem from './DeliveryFeeListItem.component';
import type { DeliveryData } from './DeliveryForm.component';

const STEP_CONFIRM_BASKET = 0;
const STEP_CONFIRM_DELIVERY = 1;

type Props = {
  order: OrderWithProducts,
  loading: boolean,
  classes: Object,
  t: TFunction,
  onCancel: () => void,
  onSubmit: () => void,

  onRemoveProduct: (product: ProductData) => void,
  consumerProfile: *,

  checkoutStep: number,
  setCheckoutStep: (number) => void,

  deliveryData: DeliveryData,
  setDeliveryData: (DeliveryData) => void,
};

const isDeliveryDataValid = (deliveryData: DeliveryData) =>
  !!deliveryData.first_name &&
  !!deliveryData.last_name &&
  !!deliveryData.address_line_1 &&
  !!deliveryData.city &&
  !!deliveryData.country &&
  !!deliveryData.zipcode;

export const CheckoutDialog = (props: Props) => {
  const {
    t,
    order,
    checkoutStep,
    onCancel,
    onSubmit,
    classes,
    deliveryData,
  } = props;

  let content = <div />;
  let actionButtons = <div />;

  if (checkoutStep === STEP_CONFIRM_DELIVERY) {
    if (!props.consumerProfile) {
      content = <CircularProgress />;
    } else {
      content = (
        <DeliveryForm
          consumerProfile={props.consumerProfile}
          onChange={props.setDeliveryData}
        />
      );
    }

    actionButtons = (
      <React.Fragment>
        <Button
          onClick={onCancel}
          color="secondary"
          className={classes.backButton}
        >
          {t('marketplace.checkout.dialog.cancel')}
        </Button>
        <Button
          variant="contained"
          disabled={!isDeliveryDataValid(deliveryData)}
          onClick={() => onSubmit(deliveryData)}
          color="primary"
        >
          {t('marketplace.checkout.dialog.goToPayment')}
        </Button>
      </React.Fragment>
    );
  } else {
    content =
      props.loading || !props.order ? (
        <CircularProgress />
      ) : (
        <div>
          <List dense disablePadding>
            <Paper style={{ marginTop: 12 }}>
              {(order.product_lines || []).map((pl) => (
                <ProductLine
                  product={pl}
                  key={pl.id}
                  onRemove={() => props.onRemoveProduct(pl)}
                />
              ))}
              {(order.product_lines || []).length &&
              order.delivery_fee &&
              order.delivery_fee.id ? (
                <DeliveryFeeListItem deliveryFee={order.delivery_fee} />
              ) : null}
            </Paper>
          </List>
          <div className={classes.totalPrice}>
            <Typography component="p" variant="h4">
              {`${order.total_price} €`}
            </Typography>
          </div>
        </div>
      );

    actionButtons = (
      <React.Fragment>
        <Button
          onClick={onCancel}
          color="secondary"
          className={classes.backButton}
        >
          {t('marketplace.checkout.dialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => props.setCheckoutStep(STEP_CONFIRM_DELIVERY)}
          color="primary"
          disabled={order && (order.product_lines || []).length === 0}
        >
          {t('marketplace.checkout.dialog.goToDelivery')}
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <DialogTitle>{t('marketplace.checkout.dialog.title')}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actionButtons}</DialogActions>
    </React.Fragment>
  );
};

const styles = (theme) => ({
  backButton: {
    marginRight: theme.spacing.unit * 2,
  },
  totalPrice: {
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 2,
    backgroundColor: '#eee',
    borderRadius: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withState('checkoutStep', 'setCheckoutStep', STEP_CONFIRM_BASKET),
  withState('deliveryData', 'setDeliveryData', {}),
)(CheckoutDialog);
