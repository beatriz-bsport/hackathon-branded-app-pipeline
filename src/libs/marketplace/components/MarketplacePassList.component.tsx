import React from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withState } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Dialog from '@material-ui/core/Dialog';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Theme } from '@material-ui/core';

import PaymentPackCard from '../../payment-packs/components/PaymentPackCard.component';
import PaymentPackItem from '../../payment-packs/components/PaymentPackBookableItem.component';
import Analytics from '../../../components/analytics/Analytics.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  paymentPacks: any[];
  pushPackCheckout: (id: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation & {
    selectedPass: any;
    setSelectedPass: (pass: any) => void;
  };

const PaymentPackMarketplaceListItem = (props: {
  paymentPack: any;
  onSelect: () => void;
  onCartAdd: () => void;
}) => (
  <ListItem divider button onClick={props.onSelect}>
    <PaymentPackItem paymentPack={props.paymentPack} />
    <IconButton
      style={{ marginRight: 16 }}
      disableRipple
      onClick={props.onSelect}
    >
      <VisibilityIcon />
    </IconButton>
    <ListItemSecondaryAction>
      <React.Fragment>
        <IconButton color="primary" onClick={props.onCartAdd}>
          <AddShoppingCartIcon />
        </IconButton>
      </React.Fragment>
    </ListItemSecondaryAction>
  </ListItem>
);

export function MarketplacePassList(props: Props) {
  const { paymentPacks, t, pushPackCheckout, selectedPass } = props;
  return (
    <div>
      <Typography
        component="h3"
        variant="h6"
        className={props.classes.sectionTitle}
      >
        {props.t('marketplace.passListTitle')}
      </Typography>
      <Paper>
        <List dense disablePadding>
          {paymentPacks.map((pp) => (
            <PaymentPackMarketplaceListItem
              onSelect={() => {
                props.setSelectedPass(pp);
                Analytics.selectPaymentPack(pp);
              }}
              onCartAdd={() => {
                pushPackCheckout(pp.id);
                Analytics.addPassToCart(pp, 'payment_pack');
              }}
              key={pp.id}
              paymentPack={pp}
              t={props.t}
            />
          ))}
        </List>
        <Dialog
          open={!!selectedPass}
          onClose={() => props.setSelectedPass(null)}
        >
          <div>
            {selectedPass ? (
              <PaymentPackCard pack={selectedPass} onlyPublic />
            ) : null}
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                pushPackCheckout(selectedPass.id);
                Analytics.addPassToCart(selectedPass, 'payment_pack');
              }}
              color="primary"
              variant="contained"
            >
              {t('marketplace.buyPack')}
            </Button>
          </div>
        </Dialog>
      </Paper>
    </div>
  );
}

const styles = (theme: Theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1) * 1,
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
  withState('selectedPass', 'setSelectedPass', null),
)(MarketplacePassList);
