import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Theme } from '@material-ui/core';
import { TFunction } from 'i18next';

import type { PaymentCombo } from '../../payment-combo/types';
import Analytics from '../../../components/analytics/Analytics.component';
import PaymentPackComboItem from '../../payment-combo/components/PaymentComboBookableItem.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  paymentComboList: Array<PaymentCombo>;
  onAddBasket: (comboId: number) => void;
  isExcludingTax: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const PaymentComboCard = (
  props: {
    t: TFunction;
    paymentCombo: PaymentCombo;
    isExcludingTax: boolean;
    onAddBasket: () => void;
  } & MaterialStyleType<ReturnType<typeof styles>>,
) => {
  return (
    <Card className={props.classes.card}>
      <div className={props.classes.cardInner}>
        <CardContent>
          <PaymentPackComboItem
            paymentCombo={props.paymentCombo}
            isExcludingTax={props.isExcludingTax}
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            disabled={!props.onAddBasket}
            onClick={props.onAddBasket}
          >
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
              isExcludingTax={props.isExcludingTax}
              t={props.t}
              classes={props.classes}
              paymentCombo={pc}
              onAddBasket={() => {
                props.onAddBasket(pc.id);
                Analytics.addPackToCart(pc);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  comboListContainer: {
    overflowX: 'auto',
    padding: theme.spacing(2),

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  cardContainer: {
    paddingRight: theme.spacing(2),
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

export default compose<any, OwnProps>(
  withTranslation(['marketplace']),
  // @ts-ignore
  withStyles(styles),
)(MarketplacePaymentComboList);
