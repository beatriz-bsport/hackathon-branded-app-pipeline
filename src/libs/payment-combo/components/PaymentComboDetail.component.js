// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PaginatedListBase from '../../../components/PaginatedListBase.component';
import PaymentComboCard from './PaymentComboCard.component';
import PaymentComboPurchaseListItem from './PaymentComboPurchaseListItem.component';

import type { PaymentCombo, PaymentComboPurchase } from '../types';

type Props = {
  paymentCombo: PaymentCombo,
  onPaymentPackClick: (id: number) => void,
  onShopItemClick: (id: number) => void,
  onPrivatePassClick: (id: number) => void,

  paymentComboPurchaseList: Array<PaymentComboPurchase>,
  fetchPaymentComboPurchaseList: (
    page: number,
    options: { onSuccess?: (any) => void, onError?: (any) => void },
  ) => void,
  paymentComboPurchaseLoading: boolean,
  paymentComboPurchaseCount: number,
  page: number,
  setPage: (page: number) => void,

  goToInvoice: (uuid: string) => void,
  snackbarSuccess: (string) => void,

  classes: Object,
  t: TFunction,
};
export const PaymentComboDetail = (props: Props) => (
  <Grid container spacing={16}>
    <Grid item xs={12} md={6}>
      <PaymentComboCard
        paymentCombo={props.paymentCombo}
        onPaymentPackClick={props.onPaymentPackClick}
        onPrivatePassClick={props.onPrivatePassClick}
        onShopItemClick={props.onShopItemClick}
        snackbarSuccess={props.snackbarSuccess}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <div className={props.classes.centerRight}>
        <Typography variant="h5" align="right">
          {props.t('detail.purchases')}
        </Typography>
      </div>
      <Paper>
        <PaginatedListBase
          items={props.paymentComboPurchaseList}
          listProps={{ disablePadding: true }}
          renderItem={(item) => (
            <PaymentComboPurchaseListItem
              key={item.id}
              divider
              paymentComboPurchase={item}
              onClick={() => props.goToInvoice(item.invoice)}
            />
          )}
          itemPerPage={15}
          nbItems={props.paymentComboPurchaseCount}
          loading={props.paymentComboPurchaseLoading}
          page={props.page}
          onPageRequested={(page) =>
            props.fetchPaymentComboPurchaseList(page, {
              onSuccess: () => props.setPage(page),
            })
          }
        />
      </Paper>
    </Grid>
  </Grid>
);

const styles = (theme) => ({
  container: {},
  centerRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['paymentCombo']),
  withStyles(styles),
  withState('page', 'setPage', 1),
)(PaymentComboDetail);
