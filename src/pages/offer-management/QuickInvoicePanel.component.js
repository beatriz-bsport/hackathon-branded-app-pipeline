// @flow
import React from 'react';
import { withStyles, Divider, Typography, Paper } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import QuickInvoice from '../../libs/invoice/quick-invoice/QuickInvoice.component';

type Props = {
  classes: Object,
  t: TFunction,
  unevenSavedInvoices: Array<Invoice>,
  quickInvoices: Array<Invoice>,
  createInvoice: (InvoiceData) => void,
  closeQuickInvoice: (memberId: number) => void,
  saveQuickInvoice: (InvoiceData) => void,
  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  offers: Array<Offer>,
  activities: Array<Activity>,
};

export function QuickInvoicePanel(props: Props) {
  const {
    classes,
    t,
    unevenSavedInvoices,
    quickInvoices,
    createInvoice,
    closeQuickInvoice,
    saveQuickInvoice,
    paymentPacks,
    shopItems,
    offers,
    activities,
  } = props;
  return (
    <Paper>
      <Typography className={classes.bookingsHeader} variant="h6">
        {t('offer.myOpenedInvoices')}
      </Typography>
      <Divider />
      {quickInvoices.length || unevenSavedInvoices.length ? (
        <div>
          {unevenSavedInvoices.map((inv) => (
            <QuickInvoice
              quickInvoiceTitle={`inv.memberName
              } (${t('common.booking')})`}
              key={inv.uuid}
              quickInvoice={inv}
              uneditableInvoiceItems={inv.invoice_items}
              onSubmit={() => {}}
              editMode
              shopItems={[]}
              activities={[]}
              createInvoice={() => {}}
              updateInvoice={(invoiceData) =>
                createInvoice({ ...inv, ...invoiceData }, inv.member, true)
              }
              paymentPacks={[]}
            />
          ))}
          {quickInvoices.map((qi) => (
            <QuickInvoice
              quickInvoiceTitle={qi.memberName}
              key={qi.memberId}
              quickInvoice={qi}
              onClose={() => closeQuickInvoice(qi.memberId)}
              onSubmit={saveQuickInvoice}
              paymentPacks={paymentPacks}
              shopItems={shopItems}
              offers={offers}
              activities={activities}
              createInvoice={(invoiceData) =>
                createInvoice(invoiceData, qi.memberId)
              }
            />
          ))}
        </div>
      ) : (
        <Typography variant="caption" className={classes.emptyTextContainer}>
          {t('offer.noQuickInvoiceOpened')}
        </Typography>
      )}
    </Paper>
  );
}

const styles = (theme) => ({
  bookingsHeader: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  emptyTextContainer: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(withNamespaces()(QuickInvoicePanel));
