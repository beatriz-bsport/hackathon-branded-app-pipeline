// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withState } from 'recompose';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AttachmentIcon from '@material-ui/icons/Attachment';
import FactCheckIcon from '@material-ui/icons/Receipt';
import CircularProgress from '@material-ui/core/CircularProgress';

import CancelIcon from '@material-ui/icons/Cancel';
import Hidden from '@material-ui/core/Hidden';

import RedButton from '../../../components/button/RedButton.component';

import { STEP_INVOICE_ITEM, STEP_PAYMENT } from './invoice-step-constants';

type Props = {
  invoice: ?Invoice,
  onSubmit: () => void,
  onBackToInvoiceItem: () => void,
  setStep: (number) => void,
  step: number,
  isEquilibrated: boolean,
  invoiceItemIsEmpty: boolean,

  loading: boolean,
  invoiceHasChanged: boolean,
  setLoading: (boolean) => void,
  finalizeInvoice: (OptionCallback) => void,
  revertInvoice: (uuid: string) => void,
};

const RevertButton = (props: {
  reverted: boolean,
  processing: boolean,
  disabled: boolean,
  onClick: () => void,
  classes: Object,
  t: TFunction,
}) => {
  if (props.processing) return <CircularProgress />;
  return (
    <RedButton
      color="primary"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <CancelIcon className={props.classes.leftIcon} />
      <Hidden xsDown>
        {props.reverted
          ? props.t('actions.invoiceReverted')
          : props.t('actions.revert')}
      </Hidden>
    </RedButton>
  );
};

export const InvoiceEditorActions = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  return (
    <div className={classes.container}>
      <ButtonGroup disabled={props.loading} variant="contained" color="primary">
        {!!props.invoice && !props.invoice.is_finalized && (
          <RevertButton
            t={t}
            classes={classes}
            reverted={props.invoice.reverted}
            disabled={props.invoice.reverted || props.loading}
            onClick={() => props.revertInvoice(props.invoice.uuid)}
          />
        )}
        {props.step === STEP_INVOICE_ITEM ? (
          <Button
            onClick={() => props.setStep(STEP_PAYMENT)}
            color="primary"
            disabled={props.invoiceItemIsEmpty}
          >
            <ArrowForwardIcon className={classes.leftIcon} />
            {t('actions.goToPaymentEditor')}
          </Button>
        ) : null}
        {!props.invoice && props.step === STEP_PAYMENT && (
          <Button onClick={props.onBackToInvoiceItem} color="primary">
            <ArrowBackIcon className={classes.leftIcon} />
            {t('actions.backToInvoiceItemEditor')}
          </Button>
        )}
        {props.invoice &&
          !props.isEquilibrated &&
          !props.invoice.plannedinvoice && (
            <Button onClick={props.onSubmit}>
              <FactCheckIcon className={classes.leftIcon} />
              {t('actions.equilibrate')}
            </Button>
          )}
        {(!props.invoice || props.invoiceHasChanged) &&
          props.onSubmit &&
          props.step === STEP_PAYMENT && (
            <Button onClick={props.onSubmit}>
              <SaveIcon className={classes.leftIcon} />

              {t('actions.save')}
            </Button>
          )}
        {props.invoice &&
          props.invoice.is_finalized &&
          props.isEquilibrated &&
          !props.invoice.reverted && (
            <Button
              onClick={() => {
                window.location.href = props.invoice.stripe_invoice_pdf;
              }}
            >
              <AttachmentIcon className={classes.leftIcon} />
              {t('actions.download')}
            </Button>
          )}
        {props.invoice &&
          props.finalizeInvoice &&
          props.isEquilibrated &&
          !props.invoice.reverted &&
          !props.invoice.is_finalized && (
            <Button
              onClick={() => {
                props.setLoading(true);
                props.finalizeInvoice({
                  onSuccess: () => props.setLoading(false),
                });
              }}
            >
              <AttachmentIcon className={classes.leftIcon} />
              {t('actions.finalize')}
            </Button>
          )}
      </ButtonGroup>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default withState('loading', 'setLoading', false)(InvoiceEditorActions);
