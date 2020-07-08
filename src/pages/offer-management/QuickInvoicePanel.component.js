// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
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
  revertQuickInvoice: (uuid: string) => void,
  availableBuyableItems: { [buyable_item_identifier: number]: BuyableItem },

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
            return (
              <QuickInvoice
                quickInvoiceTitle={`${
                  inv.member ? inv.member.name : ' - '
                } (${t('common.booking')})`}
                member={inv.member}
                key={inv.uuid}
                quickInvoice={inv}
                uneditableInvoiceItems={inv.invoice_items}
                onSubmit={() => {}}
                editMode
                availableBuyableItems={props.availableBuyableItems}
                createInvoice={() => {}}
                onClose={() => props.revertQuickInvoice(inv.uuid)}
                updateInvoice={(invoiceData) =>
                  createInvoice({ ...inv, ...invoiceData }, inv.member.id, true)
                }
              />
            );
          })}
          {quickInvoices.map((qi) => (
            <QuickInvoice
              memberCreditAccountBalance={qi.creditAccount || 0.0}
              member={qi.member}
              quickInvoiceTitle={qi.memberName}
              key={qi.memberId}
              quickInvoice={qi}
              availableBuyableItems={props.availableBuyableItems}
              onClose={() => closeQuickInvoice(qi.memberId, qi)}
              onSubmit={saveQuickInvoice}
              createInvoice={(invoiceData) =>
                createInvoice(invoiceData, qi.memberId)
              }
            />
          ))}
        </div>
      ) : (
        <div className={classes.emptyTextContainer}>
          <Typography variant="caption" color="textSecondary">
            {t('offer.noQuickInvoiceOpened')}
          </Typography>
        </div>
      )}
    </Paper>
  );
}

const styles = (theme) => ({
  bookingsHeader: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  emptyTextContainer: {
    padding: theme.spacing(2),
  },
});

export default withStyles(styles)(withTranslation()(QuickInvoicePanel));
