import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import * as Yup from 'yup';
import { FormikProps, withFormik } from 'formik';
import { makeStyles } from '@material-ui/core';
import {
  TextField,
  PriceField,
  SwitchField,
  RadioGroupField,
  IntervalRecurrenceSelectField,
} from '../../../components/forms';
import PaymentPackSelectorField from '../../payment-packs/components/PaymentPackSelectorField.component';
import PrivatePassSelectorField from '../../private-service/components/pass/PrivatePassSelectorField.component';
import PaymentComboSelectorField from '../../payment-combo/components/PaymentComboSelectorField.component';
import InfoBox from '#components/box/InfoBox.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import { ContractWithPaymentPack } from '../types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { OptionCallback } from '../../../state/types';
import FormSection from '#components/forms/FormSection.component';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SUBSCRIPTION,
  );

enum ObjectType {
  paymentPack = 'payment_pack',
  privatePass = 'private_pass',
  paymentCombo = 'payment_combo',
}

type FormValues = Omit<
  ContractWithPaymentPack,
  | 'payment_pack'
  | 'private_pass'
  | 'payment_combo'
  | 'company'
  | 'tax'
  | 'disabled'
  | 'id'
> & {
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  object_type: ObjectType;
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

  return (
    <div>
      <FormSection
        sectionTitle={t('contract.form.general_info.title')}
        sectionIcon={InfoIcon}
      >
        <TextField
          name="name"
          label={t('contract.form.name.label')}
          required
          fullWidth
          className={classes.field}
        />
        <TextField
          name="description"
          label={t('contract.form.description.label')}
          placeholder={t('contract.form.description.placeholder')}
          className={classes.field}
          required
          fullWidth
          multiline
          variant="outlined"
          rows={5}
        />
      </FormSection>
      <fieldset className={classes.section}>
        <legend>{t('contract.form.object_type.label')}</legend>
        <RadioGroupField
          name="object_type"
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
        />
        <Collapse in={props.values.object_type === ObjectType.paymentPack}>
          <PaymentPackSelectorField
            choices={props.paymentPackList}
            name="payment_pack"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
        <Collapse in={props.values.object_type === ObjectType.privatePass}>
          <PrivatePassSelectorField
            choices={props.privatePassList}
            name="private_pass"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
        <Collapse in={props.values.object_type === ObjectType.paymentCombo}>
          <PaymentComboSelectorField
            choices={props.paymentComboList}
            name="payment_combo"
            fullWidth
            className={classes.fieldMain}
          />
        </Collapse>
      </fieldset>
      <fieldset className={classes.section}>
        <legend>{t('contract.form.recurrence.section')}</legend>
        <IntervalRecurrenceSelectField
          name="interval"
          label={t('contract.form.interval.label')}
          helperText={t('contract.form.interval.helperText')}
          className={classes.field}
          required
          fullWidth
        />
        <div className={classes.row}>
          <Typography variant="body2">
            {t('contract.form.recurrence_basis.label')}
          </Typography>
          <TextField name="recurrence_basis" required variant="outlined" />
          <Typography variant="body2">
            {t(
              `contract.form.recurrence_basis.intervalName.${props.values.interval}`,
              {
                count: props.values.recurrence_basis,
              },
            )}
          </Typography>
        </div>
        <TextField
          name="nb_interval"
          label={t('contract.form.nb_interval.label', {
            interval: t(`contract.interval.${props.values.interval}`, {
              count: props.values.recurrence_basis,
            }),
          })}
          className={classes.field}
          required
          fullWidth
        />
        <div className={classes.recurrenceSumup}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="body2" color="textSecondary">
            {t('contract.form.recurrence.explain', {
              recurrence_basis: props.values.recurrence_basis,
              interval: t(`contract.interval.${props.values.interval}`, {
                count: props.values.recurrence_basis,
              }),
              nb_interval: props.values.nb_interval,
              total_interval_duration:
                props.values.nb_interval * props.values.recurrence_basis,
            })}
          </Typography>
        </div>
      </fieldset>
      <PriceField
        name="recurrent_price"
        label={t('contract.form.recurrent_price.label')}
        required
        fullWidth
        className={classes.fieldMargin2}
      />
      {props.initial?.id &&
        // the backend returns a string for recurrent_price as it is handled as a decimal
        parseFloat(props.values.recurrent_price) !==
          parseFloat(props.initial.recurrent_price) && (
          <InfoBox
            content={t('contract.form.recurrent_price.infoBox')}
            className={classes.fieldMargin2}
          />
        )}
      <PriceField
        name="flat_fee"
        label={t('contract.form.flat_fee.label')}
        helperText={t('contract.form.flat_fee.helperText')}
        required
        fullWidth
        className={classes.field}
      />
      <TextField
        name="contract"
        label={t('contract.form.contract.label')}
        placeholder={t('contract.form.contract.placeholder')}
        className={classes.field}
        required
        fullWidth
        multiline
        rows={5}
        variant="outlined"
      />
      <SwitchField
        name="manager_only"
        label={t('contract.form.managerOnly.label')}
      />
      <SwitchField
        name="auto_renewal"
        label={t('contract.form.autoRenewal.label')}
      />
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
  fieldMain: { marginBottom: theme.spacing(5) },
  section: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
}));

export const SubscriptionContractFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  nb_interval: Yup.number().integer().min(1).max(90).required(),
  recurrence_basis: Yup.number().integer().min(1).required(),
  interval: Yup.string().required(),
  recurrent_price: Yup.number().min(0),
  flat_fee: Yup.number(),
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
      };
    }
    return {
      name: '',
      recurrent_price: 0,
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
