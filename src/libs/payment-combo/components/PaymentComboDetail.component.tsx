import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { OptionCallback } from '../../../state/types';
// @ts-expect-error
import PaginatedListBase from '#components/PaginatedListBase.component';
// @ts-expect-error
import PaymentComboCard from '#libs/payment-combo/components/PaymentComboCard.component';
import PaymentComboPurchaseListItem from './PaymentComboPurchaseListItem.component';

import type { PaymentCombo, PaymentComboPurchase } from '../types';

type Props = {
  paymentCombo: PaymentCombo;
  onPaymentPackClick: (id: number) => void;
  onShopItemClick: (id: number) => void;
  onPrivatePassClick: (id: number) => void;

  paymentComboPurchaseList: Array<PaymentComboPurchase>;
  fetchPaymentComboPurchaseList: (
    page: number,
    options: OptionCallback,
  ) => void;
  paymentComboPurchaseLoading: boolean;
  paymentComboPurchaseCount: number;

  goToInvoiceUsingPaymentComboPurchaseId: (
    buyable_item_identifier: number,
    id: number,
  ) => void;
  snackbarSuccess: (message: string) => void;
};

const useStyles = makeStyles((theme) => ({
  centerRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(1),
  },
}));

export const PaymentComboDetail: React.FC<Props> = ({
  paymentCombo,
  onPaymentPackClick,
  onShopItemClick,
  onPrivatePassClick,
  paymentComboPurchaseList,
  fetchPaymentComboPurchaseList,
  paymentComboPurchaseLoading,
  paymentComboPurchaseCount,
  goToInvoiceUsingPaymentComboPurchaseId,
  snackbarSuccess,
}) => {
  const { t } = useTranslation('paymentCombo');
  const classes = useStyles();

  const [page, setPage] = useState(1);

  const onPageRequestedHandler = useCallback(
    (newPage: number) =>
      fetchPaymentComboPurchaseList(newPage, {
        onSuccess: () => setPage(newPage),
      }),
    [fetchPaymentComboPurchaseList],
  );

  const renderItem = useCallback(
    (item: PaymentComboPurchase<PaymentCombo>) => (
      <PaymentComboPurchaseListItem
        key={item.id}
        divider
        onClick={goToInvoiceUsingPaymentComboPurchaseId}
        paymentComboPurchase={item}
      />
    ),
    [goToInvoiceUsingPaymentComboPurchaseId],
  );

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <PaymentComboCard
          onPaymentPackClick={onPaymentPackClick}
          onPrivatePassClick={onPrivatePassClick}
          onShopItemClick={onShopItemClick}
          paymentCombo={paymentCombo}
          snackbarSuccess={snackbarSuccess}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <div className={classes.centerRight}>
          <Typography align="right" variant="h5">
            {t('detail.purchases')}
          </Typography>
        </div>
        <Paper>
          <PaginatedListBase
            itemPerPage={15}
            items={paymentComboPurchaseList}
            listProps={{ disablePadding: true }}
            loading={paymentComboPurchaseLoading}
            nbItems={paymentComboPurchaseCount}
            onPageRequested={onPageRequestedHandler}
            page={page}
            renderItem={renderItem}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default React.memo(PaymentComboDetail);
