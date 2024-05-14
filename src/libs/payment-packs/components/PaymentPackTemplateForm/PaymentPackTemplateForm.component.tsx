import React, { memo } from 'react';
import pick from 'lodash/pick';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';
import * as Yup from 'yup';
import { START_ON_PURCHASE } from '@bsport/common/lib/master-data/payment-pack';

import { DATE_FORMAT } from '../../../../utils/datetime';

import PaymentPackTemplateFormRestrictions from './PaymentPackTemplateFormRestrictions.component';
import PaymentPackTemplateFormValidity from './PaymentPackTemplateFormValidity.component';
import PaymentPackTemplateFormGeneral from './PaymentPackTemplateFormGeneral.component';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
  PENALTY_MODE_FRANCHISOR_PRORATA,
} from '../../constants';
import {
  offPeakGroupDefault,
  formatOffPeakScheduleOnSubmit,
  formatOffPeakScheduleOnEdit,
} from '#libs/payment-packs/utils';
import { offPeakScheduleSchemaValidation } from '../PaymentPackForm/PaymentPackForm.component';
import { ALMOST_100 } from '../../../../constants';
import type { PaymentPackTemplate } from '../../types';
import type { OptionCallback } from '#src/state/types';

export const VALID_BY_DURATION = 'VALID_BY_DURATION';
export const VALID_BY_DATERANGE = 'VALID_BY_DATERANGE';

const penaltyKindDict = {
  [PENALTY_KIND_BLOCK_CPP]: 'block',
  [PENALTY_KIND_NEGATIVE_ACCOUNT]: 'account',
};

type Props = {
  initial: PaymentPackTemplate;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (data: PaymentPackTemplate, options: OptionCallback) => void;
};

const offPeakGroupDefaultValue = [offPeakGroupDefault()];

const PaymentPackTemplateForm = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <PaymentPackTemplateFormGeneral initial={props.initial} />
      <Divider className={classes.divider} />
      <div className={classes.section}>
        <PaymentPackTemplateFormValidity />
      </div>
      <Divider className={classes.divider} />
      <div className={classes.section}>
        <PaymentPackTemplateFormRestrictions initial={props.initial} />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingBottom: theme.spacing(2),
  },
  section: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  divider: {
    backgroundColor: '#C6C6C6',
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
}));

const PaymentPackTemplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0),
  tax: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0)
    .max(ALMOST_100),
  credit_number: Yup.string().required(
    'paymentPack:addPaymentPack.requiredField',
  ),
  credits: Yup.number().when('credit_number', {
    is: 'limited',
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(0)
      .nullable(),
    otherwise: Yup.number().nullable(),
  }),
  theorical_margin_value: Yup.number().when('credit_number', {
    is: 'unlimited',
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(0)
      .nullable(),
    otherwise: Yup.number(),
  }),
  timeType: Yup.string().required(),
  expiration_days_before_first_use: Yup.number(),
  start_date_method: Yup.string()
    .required('paymentPack:form.paymentPack.error.start_date_method_type')
    .typeError('paymentPack:form.paymentPack.error.start_date_method_type'),
  duration_days: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_months: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_years: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  lower_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  upper_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  manager_only: Yup.boolean(),
  max_bookings_per_day: Yup.number().min(0).nullable(),
  max_bookings_per_week: Yup.number().min(0).nullable(),
  max_bookings_per_month: Yup.number().min(0).nullable(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  new_member_only: Yup.boolean(),
  full_vod_access: Yup.boolean(),
  only_vod_access: Yup.boolean(),
  apply_penalties: Yup.boolean().test(
    'required',
    'paymentPack:form.paymentPack.penalty.errorNoPenaltyRule',
    function testRequired() {
      if (
        this.parent.apply_penalties &&
        !this.parent.penalty_active &&
        !this.parent.no_show_penalty_active
      ) {
        return false;
      }
      return true;
    },
  ),
  penalty_active: Yup.boolean(),
  penalty_mode_franchisor: Yup.number(),
  penalty_nb_late_cancellations: Yup.number().when('penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),

  penalty_nb_days: Yup.number().when('penality', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),
  penalty_kind: Yup.string(),
  penalty_days_blocked: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (this.parent.penalty_active && this.parent.penalty_kind === 'block') {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),
  penalty_account_value: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.penalty_active &&
        this.parent.penalty_kind === 'account'
      ) {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),

  no_show_penalty_mode_franchisor: Yup.number(),
  no_show_penalty_threshold: Yup.number().when('no_show_penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),
  no_show_penalty_time_window_days: Yup.number().when(
    'no_show_penalty_active',
    {
      is: true,
      then: Yup.number()
        .required('paymentPack:addPaymentPack.requiredField')
        .min(1, 'paymentPack:addPaymentPack.minusZero'),
      otherwise: Yup.number(),
    },
  ),
  no_show_penalty_kind: Yup.string(),
  no_show_penalty_days_blocked: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.no_show_penalty_active &&
        this.parent.no_show_penalty_kind === 'block'
      ) {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),
  unusable_by_staff: Yup.boolean(),
  no_show_penalty_amount: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (
        this.parent.no_show_penalty_active &&
        this.parent.no_show_penalty_kind === 'account'
      ) {
        return typeof item === 'number' && item > 0;
      }
      return true;
    },
  ),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  off_peak_schedule: offPeakScheduleSchemaValidation,
});

export const PaymentPackTemplateFormikHOC = withFormik({
  mapPropsToValues: ({ initial }: Props) =>
    Object.assign(
      {
        name: '',
        price: 0,
        tax: 0,
        credit_number: 'limited',
        unlimited: false,
        credits: 1,
        timeType: `${VALID_BY_DURATION}`,
        duration_days: 0,
        duration_months: 1,
        duration_years: 0,
        lower_date: moment(),
        upper_date: moment().add('months', 1),
        manager_only: false,
        start_date_method: `${START_ON_PURCHASE}`,
        expiration_days_before_first_use: 365,
        theorical_margin_value: 0,
        max_bookings_per_day: null,
        max_bookings_per_week: null,
        max_bookings_per_month: null,
        max_purchase_per_member: null,
        new_member_only: false,
        full_vod_access: false,
        only_vod_access: false,
        apply_penalties: false,
        penalty_active: false,
        penalty_mode_franchisor: PENALTY_MODE_FRANCHISOR_PRORATA,
        penalty_nb_late_cancellations: 3,
        penalty_nb_days: 7,
        penalty_kind: 'block',
        penalty_days_blocked: 7,
        penalty_account_value: 10,
        unusable_by_staff: false,
        no_show_penalty_active: false,
        no_show_penalty_mode_franchisor: PENALTY_MODE_FRANCHISOR_PRORATA,
        no_show_penalty_threshold: 3,
        no_show_penalty_time_window_days: 7,
        no_show_penalty_kind: 'block',
        no_show_penalty_days_blocked: 7,
        no_show_penalty_amount: 10,
        expiration_date: null,
        expiration_date_active: false,
        description: null,
        off_peak_active:
          !!initial?.off_peak_schedule &&
          !!Object.keys(initial.off_peak_schedule ?? {}).length,
        off_peak_schedule:
          !!initial?.off_peak_schedule &&
          Object.keys(initial.off_peak_schedule ?? {}).length
            ? formatOffPeakScheduleOnEdit(initial.off_peak_schedule)
            : offPeakGroupDefaultValue,
      },
      (initial && {
        ...initial,
        credit_number: initial?.unlimited ? 'unlimited' : 'limited',
        credits: initial?.credits || 0,
        start_date_method: `${initial.start_date_method}`,
        // @ts-ignore
        categories: initial.categories || [],
        // @ts-ignore
        establishments: initial.establishments || [],
        penalty_kind: penaltyKindDict[initial?.penalty_kind] || 'block',
        no_show_penalty_kind:
          penaltyKindDict[initial?.no_show_penalty_kind] || 'block',
        timeType: initial.validity_daterange
          ? VALID_BY_DATERANGE
          : VALID_BY_DURATION,
        lower_date: initial.validity_daterange
          ? moment(JSON.parse(initial.validity_daterange).lower)
          : moment(),
        upper_date: initial.validity_daterange
          ? moment(JSON.parse(initial.validity_daterange).upper)
          : moment().add('days', 365),
        apply_penalties:
          initial?.penalty_active || initial?.no_show_penalty_active,
        unusable_by_staff: !initial.is_usable_by_staff,
        expiration_date_active: !!initial?.expiration_date,
        off_peak_active:
          !!initial?.off_peak_schedule &&
          !!Object.keys(initial.off_peak_schedule).length,
        off_peak_schedule:
          initial?.off_peak_schedule &&
          Object.keys(initial.off_peak_schedule).length
            ? formatOffPeakScheduleOnEdit(initial?.off_peak_schedule)
            : offPeakGroupDefaultValue,
      }) ||
        {},
    ),
  validationSchema: PaymentPackTemplateSchema,
  // @ts-ignore
  handleSubmit: (
    values,
    {
      props: { onSubmit },
      setSubmitting,
    }: { props: Props; setSubmitting: (value: boolean) => void },
  ) => {
    const keys = [
      'name',
      'price',
      'tax',
      'theorical_margin_value',
      'unlimited',
      'credits',
      'id',
      'manager_only',
      'expiration_days_before_first_use',
      'start_date_method',
      'max_bookings_per_day',
      'max_bookings_per_week',
      'max_bookings_per_month',
      'max_purchase_per_member',
      'new_member_only',
      'full_vod_access',
      'only_vod_access',
      'onsite_payment_available',
      'validity_daterange',
      'penalty_active',
      'penalty_mode_franchisor',
      'penalty_nb_late_cancellations',
      'penalty_nb_days',
      'penalty_kind',
      'penalty_days_blocked',
      'penalty_account_value',
      'no_show_penalty_active',
      'no_show_penalty_mode_franchisor',
      'no_show_penalty_threshold',
      'no_show_penalty_time_window_days',
      'no_show_penalty_amount',
      'no_show_penalty_days_blocked',
      'is_usable_by_staff',
      'expiration_date',
      'description',
      'off_peak_schedule',
    ];
    const data = pick(
      { ...values, is_usable_by_staff: !values.unusable_by_staff },
      keys,
    );
    if (values.timeType === VALID_BY_DATERANGE) {
      data.duration_days = null;
      data.duration_months = null;
      data.duration_years = null;
      data.validity_daterange = {
        lower: moment(values.lower_date).format(DATE_FORMAT),
        upper: moment(values.upper_date).format(DATE_FORMAT),
      };
    } else {
      data.duration_days = values.duration_days;
      data.duration_months = values.duration_months;
      data.duration_years = values.duration_years;
      data.validity_daterange = null;
    }
    if (!values.full_vod_access) {
      data.only_vod_access = false;
    }
    if (values.unlimited) {
      data.credits = null;
    }
    switch (values.penalty_kind) {
      case 'block':
        data.penalty_kind = PENALTY_KIND_BLOCK_CPP;
        break;
      default:
        data.penalty_kind = PENALTY_KIND_NEGATIVE_ACCOUNT;
        break;
    }

    switch (values.no_show_penalty_kind) {
      case 'block':
        data.no_show_penalty_kind = PENALTY_KIND_BLOCK_CPP;
        break;

      default:
        data.no_show_penalty_kind = PENALTY_KIND_NEGATIVE_ACCOUNT;
        break;
    }

    if (!values.apply_penalties) {
      data.penalty_active = false;
      data.no_show_penalty_active = false;
    }

    data.max_bookings_per_day = values.max_bookings_per_day || null;
    data.max_bookings_per_month = values.max_bookings_per_month || null;
    data.max_bookings_per_week = values.max_bookings_per_week || null;
    data.max_purchase_per_member = values.max_purchase_per_member || null;

    if (values.expiration_date_active && values.expiration_date) {
      data.expiration_date = moment(values.expiration_date).format(
        'YYYY-MM-DD',
      );
    } else {
      data.expiration_date = null;
    }
    if (values.off_peak_active && values.off_peak_schedule) {
      data.off_peak_schedule = formatOffPeakScheduleOnSubmit(
        values.off_peak_schedule,
      );
    } else {
      data.off_peak_schedule = {};
    }
    // @ts-ignore
    onSubmit(data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default memo(PaymentPackTemplateForm);
