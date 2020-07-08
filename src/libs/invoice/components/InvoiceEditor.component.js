// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import InvoiceItemEditor from './InvoiceItemEditor.component';
import PaymentForm from './PaymentEditor.component';
import InvoiceEditorActions from './InvoiceEditorActions.component';

import { STEP_INVOICE_ITEM, STEP_PAYMENT } from './invoice-step-constants';

type Props = {
  step: number,
  setStep: (number) => void,
  invoiceItemIsEmpty: boolean,

  availableBuyableItems: { [buyableItemIdentifier: string]: Array<any> },
  onAddBuyableItem: (InvoiceItem) => void,
  onAddPaymentItem: (PaymentItem) => void,

  goToSubscription: (id: number) => void,
  finalizeInvoice: (uuid: string) => void,
  invoiceHasChanged: boolean,
  amountInvoiceitem: number,
  amountPaymentItem: number,
  isEquilibrated: boolean,

  revertInvoice: (uuid: string) => void,

  onSubmit: () => void,
  invoice: ?Invoice,
  member: Member,
};

const NonEditableMessage = ({
  goToSubscription,
  invoice,
  t,
  classes,
}: {
  classes: Object,
  goToSubscription: (id: number) => void,
  invoice: Invoice,
  t: TFunction,
}) => {
  if (invoice.is_finalized) {
    return (
      <Typography style={{ padding: 12 }}>
        {t('uneditableMessage.invoiceFinalizedThusNotEditable')}
      </Typography>
    );
  }
  if (invoice.reverted) {
    return (
      <Typography style={{ padding: 12 }}>
        {t('uneditableMessage.invoiceRevertedThusNotEditable')}
      </Typography>
    );
  }
  if (invoice && invoice.plannedinvoice) {
    return (
      <div>
        <Typography style={{ padding: 12 }}>
          {t('uneditableMessage.invoiceFromSubscriptionThusNotEditable')}
        </Typography>
        <Button
          className={classes.buttonWithMargin}
          onClick={() => goToSubscription(invoice.billing_plan)}
          color="primary"
          variant="outlined"
        >
          {t('actions.goToSubscription')}
          <ArrowForwardIcon className={classes.rightIcon} />
        </Button>
      </div>
    );
  }
  return <div />;
};

export const InvoiceEditor = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  const nonEditable =
    props.invoice &&
    (props.invoice.plannedinvoice ||
      props.invoice.is_finalized ||
      props.invoice.reverted);
  return (
    <div className={classes.container}>
      <Typography variant="h4">{t('invoice.editor.title')}</Typography>
      <Paper>
        {nonEditable ? (
          <div className={classes.uneditableContainer}>
            <NonEditableMessage
              classes={classes}
              t={t}
              invoice={props.invoice}
              goToSubscription={props.goToSubscription}
            />
          </div>
        ) : (
          <div>
            {!props.invoice && props.step === STEP_INVOICE_ITEM && (
              <InvoiceItemEditor
                availableBuyableItems={props.availableBuyableItems}
                onAddBuyableItem={props.onAddBuyableItem}
                member={props.member}
              />
            )}
            {(!!props.invoice || props.step === STEP_PAYMENT) && (
              <PaymentForm
                onCancel={() => props.setStep(STEP_INVOICE_ITEM)}
                onSubmit={props.onAddPaymentItem}
                amountDue={
                  Math.max(
                    props.amountInvoiceitem - props.amountPaymentItem,
                    0,
                  ) || 0
                }
              />
            )}
          </div>
        )}
      </Paper>
      <InvoiceEditorActions
        onBackToInvoiceItem={() => props.setStep(STEP_INVOICE_ITEM)}
        invoiceItemIsEmpty={props.invoiceItemIsEmpty}
        invoiceHasChanged={props.invoiceHasChanged}
        isEquilibrated={props.isEquilibrated}
        onSubmit={props.onSubmit}
        step={props.step}
        finalizeInvoice={props.finalizeInvoice}
        revertInvoice={props.revertInvoice}
        setStep={props.setStep}
        invoice={props.invoice}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'stretch',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  buttonWithMargin: {
    margin: theme.spacing(1),
  },
  uneditableContainer: {
    backgroundColor: '#F8F8F8',
    border: '2px solid #E8E8E8',
  },
}));

export default compose(
  // eslint-disable-next-line
  withState('step', 'setStep', ({ step, invoice }) =>
    invoice ? STEP_PAYMENT : step || STEP_INVOICE_ITEM,
  ),
)(InvoiceEditor);
