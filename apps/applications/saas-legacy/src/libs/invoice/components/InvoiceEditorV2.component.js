// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import Paper from '@material-ui/core/Paper';
import { useTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import InvoiceItemEditor from './InvoiceItemEditor.component';

import { STEP_INVOICE_ITEM, STEP_PAYMENT } from './invoice-step-constants';

type Props = {
  step: number,

  availableBuyableItems: { [buyableItemIdentifier: string]: Array<any> },
  onAddBuyableItem: (InvoiceItem) => void,

  goToSubscription: (id: number) => void,
  invoice?: Invoice,
  member: Member,

  displayNewWebshop: boolean,
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
          color="primary"
          onClick={() => goToSubscription(invoice.billing_plan)}
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
      <Typography className={classes.title} variant="h4">
        {t('invoice.editor.title')}
      </Typography>
      <Paper>
        {nonEditable ? (
          <div className={classes.uneditableContainer}>
            <NonEditableMessage
              classes={classes}
              goToSubscription={props.goToSubscription}
              invoice={props.invoice}
              t={t}
            />
          </div>
        ) : (
          <div>
            {!props.invoice && props.step === STEP_INVOICE_ITEM && (
              <InvoiceItemEditor
                availableBuyableItems={props.availableBuyableItems}
                displayNewWebshop={props.displayNewWebshop}
                member={props.member}
                onAddBuyableItem={props.onAddBuyableItem}
              />
            )}
          </div>
        )}
      </Paper>
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
  title: {
    marginLeft: theme.spacing(1),
  },
}));

export default compose(
  withState('step', 'setStep', ({ step, invoice }) =>
    invoice ? STEP_PAYMENT : step || STEP_INVOICE_ITEM,
  ),
)(InvoiceEditor);
