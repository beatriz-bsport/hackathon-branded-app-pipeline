// @ts-nocheck
import React from 'react';

import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';
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

import StyleIcon from '@material-ui/icons/Style';
import PaymentPackCard from '../../payment-packs/components/PaymentPackCard.component';
import PaymentPackItem from '../../payment-packs/components/PaymentPackBookableItem.component';
import Analytics from '../../../components/analytics/Analytics.component';
import { MaterialStyleType } from '../../../utils/types';
import type {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '../../payment-packs/types';
import Tooltip from '#components/Tooltip.component';

type OwnProps = {
  pushPackCheckout: (id: number) => void;
  paymentPackByCategory: Array<PaymentPackCategoryWithPacks>;
  paymentPackCategories: number[];
  isExcludingTax: boolean;
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
  isExcludingTax: boolean;
}) => {
  const { t } = useTranslation('paymentPack');

  return (
    <ListItem button divider onClick={props.onSelect}>
      <PaymentPackItem
        isExcludingTax={props.isExcludingTax}
        paymentPack={props.paymentPack}
      />

      {!!props.paymentPack.linked_private_pass && (
        <Tooltip title={t('form.paymentPack.universalPass.marketplaceLabel')}>
          <IconButton onClick={null}>
            <StyleIcon color="inherit" />
          </IconButton>
        </Tooltip>
      )}
      <IconButton
        disableRipple
        onClick={props.onSelect}
        style={{ marginRight: 16 }}
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
};

export function MarketplacePassList(props: Props) {
  const {
    t,
    pushPackCheckout,
    selectedPass,
    paymentPackByCategory,
    paymentPackCategories,
  } = props;

  let filteredPaymentPackByCategory: Array<PaymentPackCategoryWithPacks> =
    paymentPackByCategory;

  if (paymentPackCategories?.length) {
    filteredPaymentPackByCategory = paymentPackByCategory?.filter((pp) =>
      paymentPackCategories.includes(pp.id),
    );
  }

  return (
    <>
      <div>
        <Typography
          className={props.classes.sectionTitle}
          component="h3"
          variant="h6"
        >
          {props.t('marketplace.passListTitle')}
        </Typography>
      </div>
      {filteredPaymentPackByCategory.map(
        (ppCat: PaymentPackCategoryWithPacks) => {
          return ppCat.packs?.filter((e) => !e.manager_only).length ? (
            <div className={!ppCat.name ? props.classes.noCategory : ''}>
              {ppCat.name && (
                <Typography
                  className={props.classes.sectionTitleWithDivider}
                  component="h3"
                  variant="subtitle1"
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
                        key={pp.id}
                        disabled={!pushPackCheckout}
                        isExcludingTax={props.isExcludingTax}
                        onCartAdd={() => {
                          pushPackCheckout(pp.id);
                          Analytics.addPassToCart(pp, 'payment_pack');
                        }}
                        onSelect={() => {
                          props.setSelectedPass(pp);
                          Analytics.selectPaymentPack(pp);
                        }}
                        paymentPack={pp}
                        t={props.t}
                      />
                    ))}
                </List>
                <Dialog
                  onClose={() => props.setSelectedPass(null)}
                  open={!!selectedPass}
                >
                  <div>
                    {selectedPass ? (
                      <PaymentPackCard
                        onlyPublic
                        isExcludingTax={props.isExcludingTax}
                        pack={selectedPass}
                      />
                    ) : null}
                    <Button
                      color="primary"
                      onClick={() => {
                        pushPackCheckout(selectedPass.id);
                        Analytics.addPassToCart(selectedPass, 'payment_pack');
                        props.setSelectedPass(null);
                      }}
                      style={{ width: '100%' }}
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
    marginBottom: theme.spacing(1),
  },
  sectionTitleWithDivider: {
    marginTop: theme.spacing(2),
  },
  sectionDivider: {
    marginBottom: theme.spacing(1),
  },
  noCategory: {
    marginTop: theme.spacing(5),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
  withState('selectedPass', 'setSelectedPass', null),
)(MarketplacePassList);
