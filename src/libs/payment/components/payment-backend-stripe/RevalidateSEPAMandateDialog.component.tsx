// @ts-nocheck
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

import RevalidateSEPAMandate from './RevalidateSEPAMandate.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type ReplaceInvalidateMandateProps = {
  requestSetupIntentSecret: (
    paymentMethodId: string,
  ) => Promise<AxiosResponse<any>>;
  onSuccess?: () => void;
  paymentMethodIdToRevalidate: string;
  onCancel: () => void;
  open: boolean;
};

const useDialogStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '1px solid red',
    '&>*': {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  },
}));

const STEP = { INIT: 0, COLLECT: 1 };

const ReplaceInvalidMandateDialog = (props: ReplaceInvalidateMandateProps) => {
  const { t } = useTranslation(['invoice']);
  const classes = useDialogStyles();

  const [currentStep, setCurrentStep] = React.useState<number>(STEP.INIT);

  if (!props.open) return null;

  switch (currentStep) {
    case STEP.COLLECT:
      return (
        <GenericResponsiveDialog open>
          <RevalidateSEPAMandate
            variant="div"
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            paymentMethodIdToRevalidate={props.paymentMethodIdToRevalidate}
            onSuccess={props.onSuccess}
            onCancel={props.onCancel}
          />
        </GenericResponsiveDialog>
      );
    case STEP.INIT:
    default:
      return (
        <GenericResponsiveDialog open>
          <div className={classes.container}>
            <div className={classes.header}>
              <WarningIcon height={100} color="error" />
              <Typography variant="h5">
                {t('plannedPaymentEvent.dialog.invalidMandate.title')}
              </Typography>
            </div>
            <Typography>
              {t('plannedPaymentEvent.dialog.invalidMandate.explainSituation')}
            </Typography>
            <div className={classes.buttonRow}>
              <Button onClick={props.onCancel}>
                {t('plannedPaymentEvent.dialog.invalidMandate.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => setCurrentStep(STEP.COLLECT)}
              >
                {t('plannedPaymentEvent.dialog.invalidMandate.confirm')}
              </Button>
            </div>
          </div>
        </GenericResponsiveDialog>
      );
  }
};

export default ReplaceInvalidMandateDialog;
