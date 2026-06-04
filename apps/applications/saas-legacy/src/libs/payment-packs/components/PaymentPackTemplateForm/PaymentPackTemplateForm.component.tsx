import React, { memo } from 'react';
import pick from 'lodash/pick';
import { compose, withState } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import { withFormik } from 'formik';
import Divider from '@material-ui/core/Divider';
import { START_ON_PURCHASE } from '@bsport/common/lib/master-data/payment-pack.js';

import { DateTime } from 'luxon';

import {
  offPeakGroupDefault,
  formatOffPeakScheduleOnSubmit,
  formatOffPeakScheduleOnEdit,
} from '#src/libs/payment-packs/utils';
import type { OptionCallback } from '#src/state/types';
import PaymentPackTemplateFormRestrictions from './PaymentPackTemplateFormRestrictions.component';
import PaymentPackTemplateFormValidity from './PaymentPackTemplateFormValidity.component';
import PaymentPackTemplateFormGeneral from './PaymentPackTemplateFormGeneral.component';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
  PENALTY_MODE_FRANCHISOR_PRORATA,
} from '#src/libs/payment-packs/constants';
import type {
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
} from '#src/libs/payment-packs/types';
import {
  VALID_BY_DATERANGE,
  VALID_BY_DURATION,
} from '#src/libs/payment-packs/components/PaymentPackTemplateForm/constants';
import PaymentPackTemplateSchema from '#src/libs/payment-packs/components/PaymentPackTemplateForm/PaymentPackTemplateSchema';

const penaltyKindDict = {
  [PENALTY_KIND_BLOCK_CPP]: 'block',
  [PENALTY_KIND_NEGATIVE_ACCOUNT]: 'account',
};

type WithState = {
  isEditConfirmationDialogOpen?: boolean;
  setIsEditConfirmationDialogOpen?: (
    isEditConfirmationDialogOpen: boolean,
  ) => void;
};

type Props = {
  initial?: PaymentPackTemplate;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    data: PaymentPackTemplateAPI,
    options: OptionCallback<PaymentPackTemplateAPI>,
  ) => Promise<void>;
  isUniversal?: boolean;
};

const offPeakGroupDefaultValue = [offPeakGroupDefault()];

const PaymentPackTemplateForm: React.FC<Props> = ({ initial, isUniversal }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <PaymentPackTemplateFormGeneral
        initial={initial}
        isUniversal={isUniversal}
      />
      <Divider className={classes.divider} />
      <div className={classes.section}>
        <PaymentPackTemplateFormValidity
          initial={initial}
          isUniversal={isUniversal}
        />
      </div>
      <Divider className={classes.divider} />
      <div className={classes.section}>
        <PaymentPackTemplateFormRestrictions
          initial={initial}
          isUniversal={isUniversal}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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

export const PaymentPackTemplateFormikHOC = compose<Props, any>(
  withState(
    'isEditConfirmationDialogOpen',
    'setIsEditConfirmationDialogOpen',
    false,
  ),
  withFormik({
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
          lower_date: DateTime.now(),
          upper_date: DateTime.now().plus({ months: 1 }),
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
          // @ts-expect-error
          categories: initial.categories || [],
          // @ts-expect-error
          establishments: initial.establishments || [],
          penalty_kind: penaltyKindDict[initial?.penalty_kind] || 'block',
          no_show_penalty_kind:
            penaltyKindDict[initial?.no_show_penalty_kind] || 'block',
          timeType: initial.validity_daterange
            ? VALID_BY_DATERANGE
            : VALID_BY_DURATION,
          lower_date: initial.validity_daterange
            ? // @ts-expect-error
              DateTime.fromISO(JSON.parse(initial.validity_daterange).lower)
            : DateTime.now(),
          upper_date: initial.validity_daterange
            ? // @ts-expect-error
              DateTime.fromISO(JSON.parse(initial.validity_daterange).upper)
            : DateTime.now().plus({ year: 1 }),
          apply_penalties:
            initial?.penalty_active || initial?.no_show_penalty_active,
          unusable_by_staff: !initial.is_usable_by_staff,
          expiration_date_active: !!initial?.expiration_date,
          expiration_date: initial.expiration_date
            ? DateTime.fromISO(initial.expiration_date)
            : null,
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
    handleSubmit: (
      values,
      {
        props: {
          onSubmit,
          isEditConfirmationDialogOpen,
          setIsEditConfirmationDialogOpen,
        },
        setSubmitting,
      }: { props: Props & WithState; setSubmitting: (value: boolean) => void },
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
          lower: DateTime.fromISO(values.lower_date).toISODate(),
          upper: DateTime.fromISO(values.upper_date).toISODate(),
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

      if (!values.apply_penalties || !values.unlimited) {
        data.penalty_active = false;
        data.no_show_penalty_active = false;
      }

      data.max_bookings_per_day = values.max_bookings_per_day || null;
      data.max_bookings_per_month = values.max_bookings_per_month || null;
      data.max_bookings_per_week = values.max_bookings_per_week || null;
      data.max_purchase_per_member = values.max_purchase_per_member || null;

      if (values.expiration_date_active && values.expiration_date) {
        data.expiration_date = values.expiration_date.toISODate();
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
      if (!values?.id || isEditConfirmationDialogOpen) {
        // @ts-expect-error
        onSubmit(data, {
          onSuccess: () => {
            setIsEditConfirmationDialogOpen(false);
            setSubmitting(false);
          },
          onError: () => {
            setIsEditConfirmationDialogOpen(false);
            setSubmitting(false);
          },
        });
      } else {
        setIsEditConfirmationDialogOpen(true);
      }
    },
  }),
);

export default memo(PaymentPackTemplateForm);
