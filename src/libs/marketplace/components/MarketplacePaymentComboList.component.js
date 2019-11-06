// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import TypographyWithSowMore from '../../../components/TypographyWithShowMore.component';

import type { PaymentCombo } from '../../payment-combo/types';

type Props = {
  t: TFunction,
  classes: Object,

  paymentComboList: Array<PaymentCombo>,
  onAddBasket: (comboId: number) => void,
};

const PaymentComboCard = (props: {
  t: TFunction,
  paymentCombo: PaymentCombo,
  classes: Object,
  onAddBasket: () => void,
}) => {
  let showTotalPrice = false;
  const totalItemsPrice =
    props.paymentCombo.payment_packs.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    ) +
    props.paymentCombo.shop_items.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    ) +
    props.paymentCombo.private_passes.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    );
  if (totalItemsPrice > props.paymentCombo.price) {
    showTotalPrice = true;
  }
  return (
    <Card className={props.classes.card}>
      <div className={props.classes.cardInner}>
        <CardContent>
          <div className={props.classes.cardHeader}>
            <Typography variant="h5" component="h4">
              {props.paymentCombo.name}
            </Typography>
            <div className={props.classes.priceContainer}>
              <Typography variant="h5" component="h4">
                {`${props.paymentCombo.price}€`}
              </Typography>
              {showTotalPrice ? (
                <Typography
                  style={{ textDecoration: 'line-through' }}
                  variant="h6"
                  component="h4"
                  color="textSecondary"
                >
                  {`${totalItemsPrice.toFixed(2)}€`}
                </Typography>
              ) : null}
            </div>
          </div>
          <TypographyWithSowMore multiline>
            {props.paymentCombo.description}
          </TypographyWithSowMore>
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={props.onAddBasket}>
            <AddShoppingCartIcon className={props.classes.leftIcon} />
            {props.t('paymentCombo.addToCart')}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};

export const MarketplacePaymentComboList = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={props.classes.comboListContainer}>
        {props.paymentComboList.map((pc) => (
          <div key={pc.id} className={props.classes.cardContainer}>
            <PaymentComboCard
              t={props.t}
              classes={props.classes}
              paymentCombo={pc}
              onAddBasket={() => props.onAddBasket(pc.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  comboListContainer: {
    overflowX: 'auto',
    padding: theme.spacing.unit * 2,

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingLeft: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  cardContainer: {
    paddingRight: theme.spacing.unit * 2,
    minWidth: 300,
  },
  card: {
    height: '100%',
  },
  cardInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default compose(
  withNamespaces(['marketplace']),
  withStyles(styles),
)(MarketplacePaymentComboList);
