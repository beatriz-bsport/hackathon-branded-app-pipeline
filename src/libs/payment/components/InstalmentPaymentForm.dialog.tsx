import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import moment from 'moment-timezone';
import { compose } from 'recompose';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group';
import { Form } from 'formik';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Submit } from '../../../components/forms';
import InstalmentPaymentForm, {
  InstalPaymentFormHOC,
} from './instalment-payment';
import PaymentMethodTypeSwitcher from './PaymentMethodTypeSwitcher.component';
import PaymentMethodSelector from './PaymentMethodSelector.component';
import { PaymentInstalmentData, PaymentConfigData } from '../types';
import { OptionCallback } from '../../../state/types';

type Props = {
  enabledPaymentGroupMethodIdentifier: Array<number>;
  loading: boolean;
  onSubmit: (
    data: PaymentConfigData & PaymentInstalmentData,
    options: OptionCallback,
  ) => void;
  onClose: () => void;
  enabledPaymentMethods: Array<number>;
  values: PaymentInstalmentData; // comes from the formik HOC
  totalPriceCts: number;
};

const STEP_CONFIG_RECURRENCE = 0;
const STEP_CONFIG_PAYMENT = 1;

const InstalmentPaymentFormDialog = (props: Props) => {
  const { t } = useTranslation(['payment']);
  const classes = useStyles();
  const [step, setStep] = React.useState(STEP_CONFIG_RECURRENCE);
  const [data, setData] = React.useState<PaymentInstalmentData>({
    nb_interval: 3,
    recurrence_basis: 1,
    interval: 'week',
    anchor_date: moment().format('YYYY-MM-DD'),
  });
  const [processing, setProcessing] = React.useState(false);
  const [paymentConfig, setPaymentConfig] = React.useState<PaymentConfigData>({
    payment_method: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    payment_method_id: '',
  });
  if (step === STEP_CONFIG_RECURRENCE) {
    return (
      <Dialog open>
        <DialogTitle>{t('instalment.form.title.scheduler')}</DialogTitle>
        <Form
          onSubmit={(ev: React.MouseEvent) => {
            ev.preventDefault();
            setData(props.values);
            setStep(STEP_CONFIG_PAYMENT);
          }}
        >
          <DialogContent>
            <div className={classes.priceContainer}>
              <Typography variant="h5">
                {`${getCurrencyDisplayWithPrice(
                  (props.totalPriceCts / 100).toFixed(2),
                )}`}
              </Typography>
            </div>
            <InstalmentPaymentForm {...props} />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>
              {t('instalment.form.actions.close')}
            </Button>
            <Submit variant="outlined" color="primary">
              {t('instalment.form.actions.next')}
            </Submit>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
  if (step === STEP_CONFIG_PAYMENT) {
    return (
      <Dialog open>
        <DialogTitle>{t('instalment.form.title.payment')}</DialogTitle>
        <DialogContent>
          <div className={classes.priceContainer}>
            <Typography variant="h5">
              {`${getCurrencyDisplayWithPrice(
                (props.totalPriceCts / 100).toFixed(2),
              )}`}
            </Typography>
          </div>
          <PaymentMethodTypeSwitcher
            classes={classes}
            payment_method={paymentConfig.payment_method}
            onChange={(payment_method) =>
              setPaymentConfig({ payment_method, payment_method_id: '' })
            }
            enabledPaymentGroupMethodIdentifier={
              props.enabledPaymentGroupMethodIdentifier
            }
            disabled={processing || props.loading}
          />
          <Divider />
          <PaymentMethodSelector
            selectedSavedPaymentMethodId={paymentConfig.payment_method_id}
            paymentGroupMethodIdentifier={paymentConfig.payment_method}
            paymentMethodType={paymentConfig.payment_method}
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            savedPaymentMethodList={props.savedPaymentMethodList}
            refreshSavedPaymentMethodList={props.fetchPaymentMethodList}
            selectPaymentMethod={(payment_method_id) =>
              setPaymentConfig({ ...paymentConfig, payment_method_id })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStep(STEP_CONFIG_RECURRENCE)}>
            {t('instalment.form.actions.previous')}
          </Button>
          <Button
            disabled={
              processing || props.loading || !paymentConfig.payment_method_id
            }
            variant="contained"
            color="primary"
            onClick={() => {
              props.onSubmit(
                {
                  ...data,
                  ...paymentConfig,
                },
                {
                  onError: () => setProcessing(false),
                  onSuccess: () => setProcessing(false),
                },
              );
            }}
          >
            {(processing || props.loading) && <CircularProgress />}
            {t('instalment.form.actions.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return <div />;
};

const useStyles = makeStyles((theme: Theme) => ({
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default compose(InstalPaymentFormHOC)(InstalmentPaymentFormDialog);
