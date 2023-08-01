import React from 'react';
import classNames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import PaymentIcon from '@material-ui/icons/Payment';
import EuroIcon from '@material-ui/icons/Euro';
import DollarIcon from '@material-ui/icons/AttachMoney';
import InvoiceIcon from '@material-ui/icons/Receipt';
import KeyIcon from '@material-ui/icons/VpnKey';
import SettingsIcon from '@material-ui/icons/Tune';
import Alert from '@material-ui/lab/Alert';
import * as Yup from 'yup';
import { FormikProps, useFormikContext, withFormik } from 'formik';
import { makeStyles } from '@material-ui/core';
import {
  TextField,
  PriceField,
  SwitchField,
  RadioGroupField,
  IntervalRecurrenceSelectField,
  IntegerField,
  SelectField,
  // @ts-expect-error
} from '../../../components/forms';
// @ts-expect-error
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';
// @ts-expect-error
import PrivatePassSelectorField from '../../private-service/components/pass/PrivatePassSelectorField.component';
// @ts-expect-error
import PaymentComboSelectorField from '../../payment-combo/components/PaymentComboSelectorField.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { ContractWithPaymentPack } from '../types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { OptionCallback } from '../../../state/types';
import FormSection from '#components/forms/FormSection';
import PopOver from '#components/Popover';
import { CONTRACT_MAX_NB_INTERVAL_ALLOWED } from '../constants';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Subscription,
  );

enum ObjectType {
  paymentPack = 'payment_pack',
  privatePass = 'private_pass',
  paymentCombo = 'payment_combo',
}

enum InvoicingType {
  sameDayAsSubscription = 'same_day_as_subscription',
  fixedDay = 'fixed_day',
}

const monthBillingDayChoice = [...Array(32).keys()]
  .filter((day) => !!day)
  .map((day) => ({
    label: day.toString(),
    value: day,
  }));
type FormValues = Omit<
  ContractWithPaymentPack,
  | 'payment_pack'
  | 'private_pass'
  | 'payment_combo'
  | 'company'
  | 'tax'
  | 'disabled'
  | 'id'
  | 'is_usable_by_staff'
> & {
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  object_type: ObjectType;
  unusable_by_staff: boolean;
  invoicing_type: InvoicingType;
};

export type SubscriptionContractFormDrawerPropsWithoutFormik = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any, options: OptionCallback) => void;
  isSubmitting: boolean;
  initial?: ContractWithPaymentPack<
    PrivatePass | number,
    PaymentCombo | number
  >;
  paymentPackList: PaymentPack[];
  privatePassList: PrivatePass[];
  paymentComboList: PaymentCombo[];
};

export type SubscriptionContractFormDrawerProps =
  SubscriptionContractFormDrawerPropsWithoutFormik & FormikProps<FormValues>;

export function SubscriptionContractFields(
  props: SubscriptionContractFormDrawerProps,
) {
  const { t } = useTranslation(['subscription']);
  const classes = useStyles();
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { values, setFieldValue } = useFormikContext<FormValues>();
  React.useEffect(() => {
    if (values.invoicing_type === InvoicingType.fixedDay) {
      setFieldValue('recurrence_basis', 1);
      setFieldValue('interval', 'month');
      if (!values.month_billing_day) {
        setFieldValue('month_billing_day', 1);
      }
    } else {
      setFieldValue('month_billing_day', null);
    }
  }, [
    values.invoicing_type,
    values.nb_interval,
    values.month_billing_day,
    setFieldValue,
  ]);

  let nbIntervalHelperText = '';
  if (values.nb_interval > CONTRACT_MAX_NB_INTERVAL_ALLOWED)
    nbIntervalHelperText = t('contract.form.nb_interval.error');
  else if (
    values.invoicing_type === InvoicingType.fixedDay &&
    (values.nb_interval > 12 || values.nb_interval < 2)
  )
    nbIntervalHelperText = t(
      'contract.form.nb_interval.restrictionForFixedBillingDay',
    );

  return (
    <div>
      <FormSection
        sectionIcon={InfoIcon}
        sectionTitle={t('contract.form.general_info.title')}
      >
        <TextField
          fullWidth
          required
          className={classes.field}
          label={t('contract.form.name.label')}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          required
          className={classes.field}
          label={t('contract.form.description.label')}
          name="description"
          placeholder={t('contract.form.description.placeholder')}
          rows={5}
          variant="outlined"
        />
      </FormSection>

      <FormSection
        sectionIcon={PaymentIcon}
        sectionTitle={t('contract.form.object_type.label')}
      >
        <RadioGroupField
          choices={[
            {
              label: t('contract.form.object_type.privatePass'),
              value: ObjectType.privatePass,
            },
            {
              label: t('contract.form.object_type.paymentPack'),
              value: ObjectType.paymentPack,
            },
            {
              label: t('contract.form.object_type.paymentCombo'),
              value: ObjectType.paymentCombo,
            },
          ]}
          name="object_type"
        />
        <div>
          <Collapse in={props.values.object_type === ObjectType.paymentPack}>
            <PaymentPackSelectorField
              fullWidth
              choices={props.paymentPackList}
              classes={classes}
              name="payment_pack"
            />
          </Collapse>
          <Collapse in={props.values.object_type === ObjectType.privatePass}>
            <PrivatePassSelectorField
              fullWidth
              choices={props.privatePassList}
              classes={classes}
              name="private_pass"
            />
          </Collapse>
          <Collapse in={props.values.object_type === ObjectType.paymentCombo}>
            <PaymentComboSelectorField
              fullWidth
              choices={props.paymentComboList}
              classes={classes}
              name="payment_combo"
            />
          </Collapse>
        </div>
      </FormSection>

      <FormSection
        sectionIcon={getCurrencyDisplay() === '€' ? EuroIcon : DollarIcon}
        sectionTitle={t('contract.form.price.title')}
      >
        <PriceField
          fullWidth
          required
          className={classes.fieldMargin2}
          label={t('contract.form.recurrent_price.label')}
          name="recurrent_price"
        />
        {props.initial?.id &&
          // the backend returns a string for recurrent_price as it is handled as a decimal
          parseFloat(props.values.recurrent_price as string) !==
            parseFloat(props.initial.recurrent_price as string) && (
            <Alert className={classes.fieldMargin2} severity="info">
              {t('contract.form.recurrent_price.infoBox')}
            </Alert>
          )}
        <PriceField
          fullWidth
          required
          className={classes.field}
          helperText={t('contract.form.flat_fee.helperText')}
          label={t('contract.form.flat_fee.label')}
          name="flat_fee"
        />
      </FormSection>

      <FormSection
        sectionIcon={InvoiceIcon}
        sectionTitle={t('contract.form.invoicing.title')}
      >
        <PopOver
          hide={!props.initial?.id}
          title={t('contract.form.invoicing.invoicing_type_readonly')}
        >
          <RadioGroupField
            choices={[
              {
                label: t(
                  'contract.form.invoicing.same_day_as_subscription.label',
                ),
                value: InvoicingType.sameDayAsSubscription,
              },
              {
                label: t('contract.form.invoicing.fixed_day.label'),
                value: InvoicingType.fixedDay,
              },
            ]}
            disabled={!!props.initial?.id}
            name="invoicing_type"
          />
        </PopOver>
        <Alert
          className={classNames(classes.fieldMargin2, classes.alert)}
          severity="info"
        >
          {props.values.invoicing_type === InvoicingType.sameDayAsSubscription
            ? t('contract.form.invoicing.same_day_as_subscription.explain')
            : t('contract.form.invoicing.fixed_day.explain')}
        </Alert>
        <Collapse
          in={values.invoicing_type === InvoicingType.sameDayAsSubscription}
        >
          <div className={classes.row}>
            <Typography variant="body2">
              {t('contract.form.recurrence_basis.label')}
            </Typography>
            <IntegerField
              required
              className={classes.intervalIntegerField}
              name="recurrence_basis"
            />
            <IntervalRecurrenceSelectField
              displayPeriod
              required
              className={classes.intervalSelectorField}
              name="interval"
              variant="outlined"
            />
          </div>
        </Collapse>
        <TextField
          fullWidth
          required
          className={classes.field}
          helperText={nbIntervalHelperText}
          label={t('contract.form.nb_interval.label', {
            interval: t(`contract.interval.${props.values.interval}`, {
              count: props.values.recurrence_basis,
            }),
          })}
          name="nb_interval"
        />

        <Collapse
          in={values.invoicing_type === InvoicingType.sameDayAsSubscription}
        >
          <Alert severity="info" variant="outlined">
            {t(
              `contract.form.invoicing.same_day_as_subscription.recurrence_explain.${props.values.interval}`,
              {
                // *1 to force count to update when values.recurrence_basis changes
                count: props.values.recurrence_basis * 1,
                recurrence_basis: props.values.recurrence_basis,
                nb_interval: props.values.nb_interval,
                time_unit: t(`contract.interval.${props.values.interval}`, {
                  count:
                    props.values.nb_interval * props.values.recurrence_basis,
                }),
                total_subscription_duration:
                  props.values.nb_interval * props.values.recurrence_basis,
                invoice: t('contract.form.invoicing.invoice', {
                  count: props.values.nb_interval * 1,
                }),
              },
            )}
          </Alert>
        </Collapse>

        <Collapse in={values.invoicing_type === InvoicingType.fixedDay}>
          <div className={classNames(classes.row, classes.field)}>
            <Typography variant="body2">
              {t('contract.form.month_billing_day.label1')}
            </Typography>
            <SelectField
              select
              choices={monthBillingDayChoice}
              className={classes.monthBillingDaySelect}
              id="select-month-billing-day"
              name="month_billing_day"
              variant="outlined"
            />
            <Typography variant="body2">
              {t('contract.form.month_billing_day.label2')}
            </Typography>
          </div>
          {props.initial?.id &&
            props.initial?.month_billing_day !== values.month_billing_day && (
              <Alert
                className={classNames(classes.alert, classes.field)}
                severity="info"
              >
                {t(
                  `contract.form.invoicing.fixed_day.modification_not_apply_to_past`,
                  {
                    month_billing_day: props.values.month_billing_day,
                  },
                )}
              </Alert>
            )}
          {props.values.month_billing_day >= 29 && (
            <Alert
              className={classNames(classes.alert, classes.field)}
              severity="warning"
            >
              {t(`contract.form.invoicing.fixed_day.end_of_month_explain`, {
                month_billing_day: props.values.month_billing_day,
              })}
            </Alert>
          )}
          <Alert className={classes.alert} severity="info" variant="outlined">
            {t(
              `contract.form.invoicing.fixed_day.recurrence_explain.${props.values.interval}`,
              {
                count: 1,
                nb_interval: props.values.nb_interval,
                invoice: t('contract.form.invoicing.invoice', {
                  count: props.values.nb_interval * 1,
                }),
                month_billing_day: props.values.month_billing_day,
              },
            )}
          </Alert>
        </Collapse>
      </FormSection>

      <FormSection
        sectionIcon={KeyIcon}
        sectionTitle={t('contract.form.contract.label')}
      >
        <TextField
          fullWidth
          multiline
          required
          className={classes.field}
          label={t('contract.form.contract.label')}
          name="contract"
          placeholder={t('contract.form.contract.placeholder')}
          rows={5}
          variant="outlined"
        />
      </FormSection>

      <FormSection
        sectionIcon={SettingsIcon}
        sectionTitle={t('contract.form.settings.title')}
      >
        <SwitchField
          label={t('contract.form.managerOnly.label')}
          name="manager_only"
        />
        <SwitchField
          label={t('contract.form.autoRenewal.label')}
          name="auto_renewal"
        />
        <SwitchField
          label={t('contract.form.unusableByStaff.label')}
          name="unusable_by_staff"
        />
      </FormSection>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  recurrenceSumup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(3),
  },
  fieldMargin2: {
    marginBottom: theme.spacing(2),
  },
  selectorField: {
    marginBottom: theme.spacing(0),
  },
  intervalIntegerField: {
    height: theme.spacing(-2),
    width: theme.spacing(5),
  },
  alert: {
    alignItems: 'center',
  },
  intervalSelectorField: {
    height: theme.spacing(5),
  },
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  smallTextField: {
    width: theme.spacing(3.75),
  },
  monthBillingDaySelect: {
    height: theme.spacing(5),
  },
}));

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  nb_interval: Yup.number()
    .integer()
    .min(1)
    .max(CONTRACT_MAX_NB_INTERVAL_ALLOWED)
    .required()
    .test(
      'Must-be-less-than-twelve-for-fixed-billing-day',
      'contract.form.nb_interval.errorForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(nb_interval) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          nb_interval <= 12
        );
      },
    )
    .test(
      'Must-be-more-than-one-for-fixed-billing-day',
      'contract.form.nb_interval.restrictionForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(nb_interval) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          nb_interval > 1
        );
      },
    ),
  recurrence_basis: Yup.number()
    .integer()
    .min(1)
    .required()
    .test(
      'Must-be-one-for-fixed-billing-day',
      'Fixed Billing Day must be one',
      function checkNbIntervalForFixedBillingDay(recurrence_basis) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          recurrence_basis === 1
        );
      },
    ),
  interval: Yup.string()
    .required()
    .test(
      'Must-be-month-if-month-billing-day-not-null',
      'Interval must be month',
      function checkIntervalBasedOnMonthBillingDay(interval) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          interval === 'month'
        );
      },
    ),
  recurrent_price: Yup.number().min(0),
  flat_fee: Yup.number().min(0),
  payment_pack: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'missing',
      function checkPaymentPackIsNullable(payment_pack) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.paymentPack || !!payment_pack;
      },
    ),
  private_pass: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'missing',
      function checkPrivatePassIsNullable(private_pass) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.privatePass || !!private_pass;
      },
    ),
  payment_combo: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'missing',
      function checkPaymentComboIsNullable(payment_combo) {
        const { object_type } = this.parent;
        return object_type !== ObjectType.paymentCombo || !!payment_combo;
      },
    ),
  description: Yup.string().required(),
  contract: Yup.string().required(),
  manager_only: Yup.boolean(),
  auto_renewal: Yup.boolean(),
  unusable_by_staff: Yup.boolean(),
  invoicing_type: Yup.string(),
  month_billing_day: Yup.number()
    .min(1)
    .max(31)
    .nullable()
    .test(
      'Must-set-if-fixed-day-invoicing-type',
      'missing',
      function checkIntervalBasedOnMonthBillingDay(month_billing_day) {
        return (
          this.parent.invoicing_type === InvoicingType.sameDayAsSubscription ||
          !!month_billing_day
        );
      },
    ),
});

function isNumber(value: unknown): value is number {
  return !Number.isNaN(Number(value));
}

function getIdOrObject<T extends { id: number }>(value: T | number): number {
  return isNumber(value) ? value : value.id;
}

export const SubscriptionContractFormHoc = withFormik<
  SubscriptionContractFormDrawerPropsWithoutFormik,
  FormValues
>({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        // recurrent_price: parseFloat(initial.recurrent_price),
        payment_pack: initial.payment_pack ? initial.payment_pack.id : null,
        private_pass: initial.private_pass
          ? getIdOrObject<PrivatePass>(initial.private_pass)
          : null,
        payment_combo: initial.payment_combo
          ? getIdOrObject<PaymentCombo>(initial.payment_combo)
          : null,
        // eslint-disable-next-line
        object_type: initial.private_pass
          ? ObjectType.privatePass
          : initial.payment_pack
          ? ObjectType.paymentPack
          : ObjectType.paymentCombo,
        unusable_by_staff: !initial.is_usable_by_staff,
        invoicing_type: initial.month_billing_day
          ? InvoicingType.fixedDay
          : InvoicingType.sameDayAsSubscription,
      };
    }
    return {
      name: '',
      recurrent_price: '0',
      flat_fee: 0,
      nb_interval: 12,
      recurrence_basis: 1,
      interval: 'month',
      payment_pack: null,
      private_pass: null,
      payment_combo: null,
      description: '',
      contract: '',
      manager_only: false,
      auto_renewal: false,
      object_type: ObjectType.paymentPack,
      unusable_by_staff: false,
      invoicing_type: InvoicingType.fixedDay,
      month_billing_day: 1,
    };
  },
  enableReinitialize: true,
  validationSchema: SubscriptionContractFieldsSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, initial }, setSubmitting, resetForm },
  ) => {
    const valuesCleaned = {
      ...omit(values, ['object_type']),
      private_pass:
        values.object_type === ObjectType.privatePass
          ? values.private_pass
          : null,
      payment_combo:
        values.object_type === ObjectType.paymentCombo
          ? values.payment_combo
          : null,
      payment_pack:
        values.object_type === ObjectType.paymentPack
          ? values.payment_pack
          : null,
      is_usable_by_staff: !values.unusable_by_staff,
    };

    onSubmit(valuesCleaned, {
      onSuccess: () => {
        trackFormSuccess(initial?.id);
        setSubmitting(false);
        resetForm();
      },
      onError: () => {
        setSubmitting(false);
        resetForm();
      },
    });
  },
});

export default SubscriptionContractFields;
