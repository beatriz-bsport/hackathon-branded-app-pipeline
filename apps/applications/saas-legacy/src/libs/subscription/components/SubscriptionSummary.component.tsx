import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/';
import { useTranslation, Trans } from 'react-i18next';
import { TFunction } from 'i18next';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { DateTime } from 'luxon';
import {
  getCompanyCountry,
  getCurrencyDisplayWithPrice,
} from '#src/libs/theme/selectors';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import ButtonBaseWithTypography from '#src/components/button/ButtonBaseWithTypography';
import { OptionCallback } from '../../../state/types';
import { Subscription, SubscriptionPause } from '../types';
import ContractTermsDialog from './contract/ContractTermsDialog.component';
import { isPaused } from '../utils';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import GermanMarketSetSubscriptionAutoRenewalAlert from '../GermanMarketSetSubscriptionAutoRenewalAlert.component';
import classNames from 'classnames';

type Props = {
  canEditPassBillingPlan: boolean;
  subscription: Subscription<PrivatePass, PaymentPack, PaymentCombo>;
  updateRenewal: (params: { auto_renewal: boolean }) => void;
  requestPaymentPackSwitch: () => void;
  requestPrivatePassSwitch: () => void;
  requestPaymentComboSwitch: () => void;
  loading: boolean;
  unflagPlannedInvoiceAsLast: (id: number) => void;
  downloadContractTerms: (options: OptionCallback) => void;
};

const isCycleMoreThanOneYearAfterAutoRenewal = (
  subscription: Subscription<PrivatePass, PaymentPack, PaymentCombo>,
): boolean => {
  const {
    month_billing_day,
    nb_interval,
    nb_interval_after_auto_renewal,
    interval,
  } = subscription;

  const getIntervalThreshold = (subInterval: string): number => {
    switch (subInterval) {
      case 'year':
        return 1;
      case 'month':
        return 12;
      case 'week':
        return 4 * 12;
      case 'day':
        return 365;
      default:
        return Infinity;
    }
  };
  const threshold = getIntervalThreshold(interval);
  if (month_billing_day !== null) {
    // Contract on a fixed day of the month
    return (nb_interval_after_auto_renewal ?? nb_interval) >= 12;
  }

  return (nb_interval_after_auto_renewal ?? nb_interval) >= threshold;
};

const renderStatus = (
  t: TFunction,
  canceled_at: string,
  has_ended: boolean,
  pauses: Array<SubscriptionPause>,
) => {
  if (has_ended) {
    return (
      <Typography color="primary">
        {t('subscriptionStatus.hasEnded')}
      </Typography>
    );
  }
  if (canceled_at) {
    return (
      <Typography color="error">
        {t('subscriptionStatus.canceledOn') +
          DateTime.fromISO(canceled_at).toFormat('D')}
      </Typography>
    );
  }
  if (isPaused(pauses)) {
    return (
      <Typography color="secondary">
        {t('subscriptionStatus.isPaused')}
      </Typography>
    );
  }
  return (
    <Typography color="secondary">{t('subscriptionStatus.pending')}</Typography>
  );
};

export const SubscriptionSummary = (props: Props) => {
  const { subscription, updateRenewal } = props;
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  const lastInvoice = subscription.planned_invoices.find(
    (invoice) => invoice.is_last_invoice_before_scheduled_stop,
  );
  const [openContractTermsDialog, setOpenContractTermsDialog] =
    React.useState(false);

  const [
    openGermanMarketSetSubscriptionAutoRenewalAlert,
    setOpenGermanMarketSetSubscriptionAutoRenewalAlert,
  ] = React.useState(false);

  const onValidateGermanMarketSetSubscriptionAutoRenewalAlert =
    React.useCallback(() => {
      updateRenewal({
        auto_renewal: true,
      });
    }, [updateRenewal]);

  const onAutoRenewalCheckboxChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      if (
        value &&
        getCompanyCountry() === 'DE' &&
        isCycleMoreThanOneYearAfterAutoRenewal(subscription)
      ) {
        setOpenGermanMarketSetSubscriptionAutoRenewalAlert(true);
      } else {
        updateRenewal({
          auto_renewal: value,
        });
      }
    },
    [
      setOpenGermanMarketSetSubscriptionAutoRenewalAlert,
      updateRenewal,
      subscription,
    ],
  );

  const isSharedFromFranchisor = subscription.is_shared_from_franchisor;

  const onOpenContractTermsDialog = () => setOpenContractTermsDialog(true);
  const onCloseContractTermsDialog = () => setOpenContractTermsDialog(false);
  if (!subscription) {
    return null;
  }
  const contractTermsDateAccepted =
    subscription.contract_terms_date_accepted &&
    formatAsDatetimeAdapted(subscription.contract_terms_date_accepted, 'DDD');
  return (
    <div className={classes.container}>
      <fieldset>
        <legend>{t('parameters.parameters')}</legend>
        {!!subscription.has_changed_after_renewal && (
          <div className={classes.field}>
            <Typography variant="body1">
              {t('parameters.secondBillingPlanEnabled')}
            </Typography>
          </div>
        )}
        <div className={classes.field}>
          <Typography variant="body2">{t('parameters.nbInterval')}</Typography>
          <Typography>
            {subscription.has_changed_after_renewal
              ? subscription.nb_interval_after_auto_renewal
              : subscription.nb_interval}
          </Typography>
        </div>
        <div className={classes.field}>
          <Typography variant="body2">
            {t('parameters.recurrent_price')}
          </Typography>
          <Typography>
            {getCurrencyDisplayWithPrice(subscription.recurrent_price)}
          </Typography>
        </div>
        <div className={classes.field}>
          <Typography variant="body2">{t('parameters.flat_fee')}</Typography>
          <Typography>
            {getCurrencyDisplayWithPrice(subscription.flat_fee)}
          </Typography>
        </div>
        {!subscription.is_v2 && (
          <div className={classes.field}>
            <Typography variant="body2">
              {t('parameters.payment_method.label')}
            </Typography>
            <Typography>
              {t(
                `invoice:paymentMethod.label.${subscription.payment_method_identifier}`,
              )}
            </Typography>
          </div>
        )}
        <div className={classes.fieldNotPadded}>
          <Typography variant="body2">{t('parameters.autoRenew')}</Typography>
          <Checkbox
            checked={subscription.auto_renewal}
            disabled={props.loading || !subscription.editable}
            onChange={onAutoRenewalCheckboxChange}
          />
        </div>
        {!!subscription.payment_pack && (
          <div
            className={classNames(classes.fieldNotPadded, {
              [classes.noEditAllowed]: isSharedFromFranchisor,
            })}
          >
            <Typography variant="body2">
              {t('parameters.payment_pack')}
            </Typography>
            <div className={classes.rowRight}>
              {props.canEditPassBillingPlan && !isSharedFromFranchisor && (
                <IconButton
                  color="primary"
                  disabled={!subscription.editable}
                  onClick={props.requestPaymentPackSwitch}
                >
                  <EditIcon />
                </IconButton>
              )}
              <Typography variant="body2">
                {subscription.payment_pack
                  ? subscription.payment_pack.name
                  : ' - '}
              </Typography>
            </div>
          </div>
        )}
        {!!subscription.private_pass && (
          <div
            className={classNames(classes.fieldNotPadded, {
              [classes.noEditAllowed]: isSharedFromFranchisor,
            })}
          >
            <Typography variant="body2">
              {t('parameters.private_pass')}
            </Typography>
            <div className={classes.rowRight}>
              {props.canEditPassBillingPlan && !isSharedFromFranchisor && (
                <IconButton
                  color="primary"
                  disabled={!subscription.editable}
                  onClick={props.requestPrivatePassSwitch}
                >
                  <EditIcon />
                </IconButton>
              )}
              <Typography variant="body2">
                {subscription.private_pass
                  ? subscription.private_pass.name
                  : ' - '}
              </Typography>
            </div>
          </div>
        )}
        {!!subscription.payment_combo && (
          <div className={classes.fieldNotPadded}>
            <Typography variant="body2">
              {t('parameters.payment_combo')}
            </Typography>
            <div className={classes.rowRight}>
              {props.canEditPassBillingPlan && (
                <IconButton
                  color="primary"
                  disabled={!subscription.editable}
                  onClick={props.requestPaymentComboSwitch}
                >
                  <EditIcon />
                </IconButton>
              )}
              <Typography variant="body2">
                {subscription.payment_combo
                  ? subscription.payment_combo.name
                  : ' - '}
              </Typography>
            </div>
          </div>
        )}

        <div className={classes.field}>
          <Typography variant="body2">{t('parameters.status')}</Typography>
          {renderStatus(
            t,
            subscription.canceled_at,
            subscription.has_ended,
            subscription.pauses,
          )}
        </div>
        <div className={classes.field}>
          <Typography variant="body2">{t('parameters.note')}</Typography>
          {subscription.note}
        </div>
        {!!subscription.stop_note && (
          <div className={classes.field}>
            <Typography variant="body2">{t('parameters.stopNote')}</Typography>
            {subscription.stop_note}
          </div>
        )}
        {contractTermsDateAccepted && (
          <div className={classes.field}>
            <Typography className={classes.contractTerms} variant="body2">
              <Trans
                components={[
                  <ButtonBaseWithTypography
                    key="OpenContractTermsDialogButton"
                    disableRipple
                    className={classes.contractTermsButton}
                    onClick={onOpenContractTermsDialog}
                    typographyColor="primary"
                    typographyVariant="body2"
                  >
                    .
                  </ButtonBaseWithTypography>,
                ]}
                i18nKey="parameters.contractTermsAccepted"
                t={t}
                values={{ dateAccepted: contractTermsDateAccepted }}
              />
            </Typography>
          </div>
        )}
        {lastInvoice &&
          !(subscription.has_ended || subscription.canceled_at) && (
            <div className={classes.field}>
              <Typography className={classes.scheduledStop} variant="body2">
                {t('subscription.scheduledStop.summary', {
                  date: DateTime.fromISO(lastInvoice.date).toFormat('D'),
                })}
              </Typography>
              <Button
                // @ts-expect-error
                color="error"
                disabled={DateTime.fromISO(lastInvoice.date) < DateTime.now()}
                onClick={() => props.unflagPlannedInvoiceAsLast(lastInvoice.id)}
                variant="outlined"
              >
                {t('form.cancel')}
              </Button>
            </div>
          )}
      </fieldset>
      <ContractTermsDialog
        closeContractTermsDialog={onCloseContractTermsDialog}
        contractTerms={subscription.legal_contract}
        contractTermsLink={subscription.contract_terms_pdf_link}
        downloadContractTerms={props.downloadContractTerms}
        open={openContractTermsDialog}
      />
      <GermanMarketSetSubscriptionAutoRenewalAlert
        onValidate={onValidateGermanMarketSetSubscriptionAutoRenewalAlert}
        open={openGermanMarketSetSubscriptionAutoRenewalAlert}
        setOpen={setOpenGermanMarketSetSubscriptionAutoRenewalAlert}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  fieldNotPadded: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  scheduledStop: {
    marginRight: theme.spacing(4),
  },
  contractTerms: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  contractTermsButton: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  noEditAllowed: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default SubscriptionSummary;
