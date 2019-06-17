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
  revertQuickInvoice: (uuid: string) => void,

  members: Array<Member>,
  className: {},
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
    className,
  } = props;
  return (
    <Paper className={className}>
      <Typography className={classes.bookingsHeader} variant="h6">
        {t('offer.myOpenedInvoices')}
      </Typography>
      <Divider />
      {quickInvoices.length || unevenSavedInvoices.length ? (
        <div>
          {unevenSavedInvoices.map((inv) => {
            const member = props.members.find((m) => m.id === inv.member);
            return (
              <QuickInvoice
                quickInvoiceTitle={`${member ? member.name : ' - '} (${t(
                  'common.booking',
                )})`}
                memberCreditAccountBalance={
                  member ? member.credit_account_balance : 0.0
                }
                key={inv.uuid}
                quickInvoice={inv}
                uneditableInvoiceItems={inv.invoice_items}
                onSubmit={() => {}}
                editMode
                shopItems={[]}
                activities={[]}
                createInvoice={() => {}}
                onClose={() => props.revertQuickInvoice(inv.uuid)}
                updateInvoice={(invoiceData) =>
                  createInvoice({ ...inv, ...invoiceData }, inv.member, true)
                }
                paymentPacks={[]}
              />
            );
          })}
          {quickInvoices.map((qi) => (
            <QuickInvoice
              memberCreditAccountBalance={qi.creditAccount || 0.0}
              quickInvoiceTitle={qi.memberName}
              key={qi.memberId}
              quickInvoice={qi}
              onClose={() => closeQuickInvoice(qi.memberId, qi)}
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
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.emptyTextContainer}
        >
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
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(QuickInvoicePanel));
