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
import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core';

import PaymentPackCard from '../../payment-packs/components/PaymentPackCard.component';
import PaymentPackItem from '../../payment-packs/components/PaymentPackBookableItem.component';
import Analytics from '../../../components/analytics/Analytics.component';
import { MaterialStyleType } from '../../../utils/types';
import type {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '../../payment-packs/types';

type OwnProps = {
  pushPackCheckout: (id: number) => void;
  paymentPackByCategory: Array<PaymentPackCategoryWithPacks>;
  paymentPackCategories: number[];
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
  disabled?: boolean;
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
        <IconButton
          color="primary"
          disabled={props.disabled}
          onClick={props.onCartAdd}
        >
          <AddShoppingCartIcon />
        </IconButton>
      </React.Fragment>
    </ListItemSecondaryAction>
  </ListItem>
);

export function MarketplacePassList(props: Props) {
  const {
    t,
    pushPackCheckout,
    selectedPass,
    paymentPackByCategory,
    paymentPackCategories,
  } = props;

  const filteredPaymentPackByCategory =
    paymentPackCategories?.length > 0
      ? paymentPackByCategory?.filter((pp) =>
          paymentPackCategories?.includes(pp.id),
        )
      : paymentPackByCategory;

  return (
    <>
      <div>
        <Typography
          component="h3"
          variant="h6"
          className={props.classes.sectionTitle}
        >
          {props.t('marketplace.passListTitle')}
        </Typography>
      </div>
      {filteredPaymentPackByCategory.map(
        (ppCat: PaymentPackCategoryWithPacks) => {
          return ppCat?.packs?.filter((e) => !e.manager_only).length ? (
            <div>
              {ppCat?.name && (
                <Typography
                  component="h3"
                  variant="subtitle1"
                  className={props.classes.sectionTitleWithDivider}
                >
                  {ppCat.name}
                </Typography>
              )}
              <Divider className={props.classes.sectionDivider} />
              <Paper>
                <List dense disablePadding>
                  {ppCat.packs
                    .filter((e) => !e.manager_only)
                    .map((pp: PaymentPack) => (
                      <PaymentPackMarketplaceListItem
                        onSelect={() => {
                          props.setSelectedPass(pp);
                          Analytics.selectPaymentPack(pp);
                        }}
                        disabled={!pushPackCheckout}
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
          ) : null;
        },
      )}
    </>
  );
}

const styles = (theme: Theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1) * 1,
  },
  sectionTitleWithDivider: {
    marginTop: theme.spacing(2),
  },
  sectionDivider: {
    marginBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
  withState('selectedPass', 'setSelectedPass', null),
)(MarketplacePassList);
