// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
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

  goToInvoiceUsingPaymentComboPurchaseId: (
    buyable_item_identifier: number,
    id: number,
  ) => void,
  snackbarSuccess: (string) => void,

  classes: Object,
  t: TFunction,
};

export const PaymentComboDetail = (props: Props) => (
  <Grid container spacing={2}>
    <Grid item md={6} xs={12}>
      <PaymentComboCard
        onPaymentPackClick={props.onPaymentPackClick}
        onPrivatePassClick={props.onPrivatePassClick}
        onShopItemClick={props.onShopItemClick}
        paymentCombo={props.paymentCombo}
        snackbarSuccess={props.snackbarSuccess}
      />
    </Grid>
    <Grid item md={6} xs={12}>
      <div className={props.classes.centerRight}>
        <Typography align="right" variant="h5">
          {props.t('detail.purchases')}
        </Typography>
      </div>
      <Paper>
        <PaginatedListBase
          itemPerPage={15}
          items={props.paymentComboPurchaseList}
          listProps={{ disablePadding: true }}
          loading={props.paymentComboPurchaseLoading}
          nbItems={props.paymentComboPurchaseCount}
          onPageRequested={(page) =>
            props.fetchPaymentComboPurchaseList(page, {
              onSuccess: () => props.setPage(page),
            })
          }
          page={props.page}
          renderItem={(item) => (
            <PaymentComboPurchaseListItem
              key={item.id}
              divider
              onClick={props.goToInvoiceUsingPaymentComboPurchaseId}
              paymentComboPurchase={item}
            />
          )}
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
    paddingBottom: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
  withState('page', 'setPage', 1),
)(PaymentComboDetail);
