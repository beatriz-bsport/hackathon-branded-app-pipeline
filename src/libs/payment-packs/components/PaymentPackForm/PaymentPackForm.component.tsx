// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import moment from 'moment-timezone';
import pick from 'lodash/pick';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { Divider, LinearProgress } from '@material-ui/core';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';

import {
  offPeakGroupDefault,
  formatOffPeakScheduleOnSubmit,
  formatOffPeakScheduleOnEdit,
} from '#libs/payment-packs/utils';
import { DATE_FORMAT } from '../../../../utils/datetime';
import { OptionCallback } from '../../../../state/types';
import {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '#libs/payment-packs/types';
import PaymentPackFormGeneral from './PaymentPackFormGeneral.component';
import PaymentPackFormValidity from './PaymentPackFormValidity.component';
import PaymentPackFormRestrictions from './PaymentPackFormRestrictions.component';
import UniversalPassFormPrivateserviceCompatibility from '#libs/universal-pass/components/UniversalPassFormPrivateserviceCompatibility.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#libs/payment-packs/constants';
import PaymentPackFormAdvancedOptions from './PaymentPackFormAdvancedOptions.component';
import { Actions } from '#components/forms';
import { Moment } from '../../../../i18n';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

import type { Tag, TagGroup } from '#libs/tag/types';
import type { SCT } from '#libs/category/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type {
  PrivateServiceWithSlots,
  PrivatePass,
  ServiceCompatibilityPass,
} from '#libs/private-service/types';
import { ALMOST_100 } from '../../../../constants';

const penaltyKindDict = {
  [PENALTY_KIND_BLOCK_CPP]: 'block',
  [PENALTY_KIND_NEGATIVE_ACCOUNT]: 'account',
};

export const offPeakScheduleSchemaValidation = Yup.array().of(
  Yup.object().shape({
    timeSlots: Yup.array().of(
      Yup.array().test({
        name: 'startBeforeEnd',
        test: function startBeforeEnd(timeSlot) {
          if (timeSlot && Array.isArray(timeSlot) && timeSlot.length === 2) {
            const [startTime, endTime] = timeSlot;
            if (!moment(startTime).isBefore(moment(endTime), 'minute')) {
              return this.createError({
                message: 'paymentPack:addPaymentPack.startAfterEnd',
                path: this.path,
              });
            }
          }
          return true;
        },
      }),
    ),
    recurrenceWeekDay: Yup.object()
      .shape({
        '1': Yup.boolean().required(),
        '2': Yup.boolean().required(),
        '3': Yup.boolean().required(),
        '4': Yup.boolean().required(),
        '5': Yup.boolean().required(),
        '6': Yup.boolean().required(),
        '7': Yup.boolean().required(),
      })
      .test({
        name: 'at-least-one-day',
        test: function atLeastOneTrue(isoWeekDay) {
          const { timeSlots } = this.parent;
          if (
            timeSlots &&
            !Object.values(isoWeekDay).some((day) => day === true)
          ) {
            return this.createError({
              message: 'paymentPack:addPaymentPack.atLeastOneDay',
              path: this.path,
            });
          }
          return true;
        },
      }),
    slotDurationChoice: Yup.string().matches(/^(all_day|time_slot)$/),
  }),
);

const getFormInitial = (
  compatibleServicePass: ServiceCompatibilityPass[] = [],
) => {
  if (
    compatibleServicePass?.length > 0 &&
    compatibleServicePass?.filter(
      (c: ServiceCompatibilityPass) => c.excluded_slot_ids,
    ).length !== 0
  ) {
    const private_services = compatibleServicePass.map(
      (cs: ServiceCompatibilityPass) => ({
        private_service: cs.private_service.id,
        excluded_slot_ids: cs.excluded_slot_ids,
      }),
    );

    return private_services;
  }
  return [];
};

type Props = {
  paymentPackCategories: PaymentPackCategory[];
  categoryList: SCT[];
  availableEstablishmentList: Establishment[];
  metaActivityList: MetaActivity[];
  tagList: Tag<TagGroup>[];
  initial?: PaymentPack<PrivatePass>;
  onCancel?: () => void;
  onCancelText: string;
  closeForm: () => void;
  onSubmit: (
    data: PaymentPackFormValues<PrivatePass>,
    options: OptionCallback<PaymentPack>,
  ) => void;
  clearPaymentPackToEdit: () => void;
  provincialTax: number;
  isInDrawer: boolean;
  privateServices: PrivateServiceWithSlots[];
  displayNewCheckoutFlow: boolean;
  compatibleServicePass: ServiceCompatibilityPass[];
  allowGuestMaster?: boolean;
};

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PaymentPack,
);

export const PaymentPackForm: React.FC<Props> = ({
  paymentPackCategories,
  categoryList,
  availableEstablishmentList,
  metaActivityList,
  tagList,
  initial,
  onCancelText,
  provincialTax,
  isInDrawer,
  onCancel,
  onSubmit,
  closeForm,
  clearPaymentPackToEdit,
  privateServices,
  compatibleServicePass,
  allowGuestMaster,
  creditScaleFactor,
  displayNewCheckoutFlow,
}) => {
  const [disabledUniversalPassFields, setDisableUniversalPassFields] =
    React.useState<boolean>(false);

  const { t } = useTranslation('paymentPack');
  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  const now = moment().format(DATE_FORMAT);

  const oneMonthLater = moment(now).add(1, 'M').format(DATE_FORMAT);

  const offPeakGroupDefaultValue = useMemo(() => {
    return [offPeakGroupDefault()];
  }, []);

  const offPeakScheduleIsEmpty = useMemo(() => {
    return (
      !!initial?.off_peak_schedule &&
      !!Object.keys(initial.off_peak_schedule)?.length
    );
  }, [initial?.off_peak_schedule]);

  const offPeakGroupOnEdit = useMemo(() => {
    return offPeakScheduleIsEmpty
      ? formatOffPeakScheduleOnEdit(initial?.off_peak_schedule)
      : offPeakGroupDefaultValue;
  }, [
    initial?.off_peak_schedule,
    offPeakGroupDefaultValue,
    offPeakScheduleIsEmpty,
  ]);

  const getFormInitialValue = useMemo(
    () => getFormInitial(compatibleServicePass),
    [compatibleServicePass],
  );

  const handleCancel = useCallback(() => {
    trackFormCancel(initial?.id);
    clearPaymentPackToEdit?.();
    closeForm?.();
    onCancel?.();
  }, [clearPaymentPackToEdit, closeForm, initial?.id, onCancel]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={
          initial
            ? {
                ...initial,
                credit_number: initial?.unlimited ? 'unlimited' : 'limited',
                credits: initial?.credits / (creditScaleFactor || 1) || 0,
                penalty_active: !!initial?.penalty_active,
                no_show_penalty_active: !!initial?.no_show_penalty_active,
                validity: initial?.validity_daterange ? 'slot' : 'givenNumber',
                lower_date: initial?.validity_daterange
                  ? Moment(
                      JSON.parse(initial?.validity_daterange).lower,
                    ).format(DATE_FORMAT)
                  : now,
                upper_date: initial?.validity_daterange
                  ? Moment(
                      JSON.parse(initial?.validity_daterange).upper,
                    ).format(DATE_FORMAT)
                  : oneMonthLater,
                validity_daterange: initial?.validity_daterange
                  ? {
                      lower: Moment(
                        JSON.parse(initial?.validity_daterange).lower,
                      ).format(DATE_FORMAT),
                      upper: Moment(
                        JSON.parse(initial?.validity_daterange).upper,
                      ).format(DATE_FORMAT),
                    }
                  : {
                      lower: now,
                      upper: oneMonthLater,
                    },
                start_date_method: `${
                  initial?.start_date_method ?? START_ON_PURCHASE
                }`,
                penalty_kind: penaltyKindDict[initial?.penalty_kind] || 'block',
                no_show_penalty_kind:
                  penaltyKindDict[initial?.no_show_penalty_kind] || 'block',
                categories:
                  initial?.categories
                    ?.map((category) => category?.id)
                    ?.filter((category_id) => !!category_id) ?? [],

                is_universal_pass: !!initial?.linked_private_pass,
                linked_private_pass_compatibility: getFormInitialValue,
                apply_penalties:
                  initial?.penalty_active || initial?.no_show_penalty_active,
                applies_for_payroll: initial?.applies_for_payroll,
                expiration_date_active: !!initial?.expiration_date,
                off_peak_active: offPeakScheduleIsEmpty,
                off_peak_schedule: offPeakGroupOnEdit,
                unusable_by_staff: !initial.is_usable_by_staff,
              }
            : {
                id: null,
                name: '',
                category: null,
                price: 0,
                tax: 0,
                credit_number: 'limited',
                credits: 1,
                penalty_active: false,
                no_show_penalty_active: false,
                validity: 'givenNumber',
                lower_date: now,
                upper_date: oneMonthLater,
                validity_daterange: {
                  lower: now,
                  upper: oneMonthLater,
                },
                duration_days: 0,
                duration_months: 1,
                duration_years: 0,
                start_date_method: `${START_ON_PURCHASE}`,
                expiration_days_before_first_use: 365,
                theorical_margin_value: 0,
                penalty_nb_late_cancellations: 3,
                penalty_nb_days: 7,
                penalty_kind: 'block',
                penalty_days_blocked: 7,
                penalty_account_value: 10,
                no_show_penalty_threshold: 3,
                no_show_penalty_time_window_days: 7,
                no_show_penalty_kind: 'block',
                no_show_penalty_days_blocked: 7,
                no_show_penalty_amount: 10,
                max_bookings_per_day: null,
                max_bookings_per_week: null,
                max_bookings_per_month: null,
                max_purchase_per_member: null,
                new_member_only: false,
                manager_only: false,
                onsite_payment_available: false,
                categories: [],
                establishments: [],
                metaActivities: [],
                full_vod_access: false,
                only_vod_access: false,
                whitelist_tags: [],
                blacklist_tags: [],
                linked_private_pass: null,
                is_universal_pass: false,
                linked_private_pass_compatibility: [],
                allow_guest_pass: true,
                unusable_by_staff: false,
                applies_for_payroll: true,
                expiration_date: null,
                expiration_date_active: false,
                description: null,
                off_peak_schedule: offPeakGroupDefaultValue,
                off_peak_active: false,
                highlighted_as_recommended: false,
              }
        }
        onSubmit={(values, actions) => {
          const sanitizedValues = {
            ...values,
            unlimited: values.credit_number === 'unlimited',
            is_usable_by_staff: !values.unusable_by_staff,
          };
          if (values.validity === 'slot') {
            sanitizedValues.duration_days = null;
            sanitizedValues.duration_months = null;
            sanitizedValues.duration_years = null;
            sanitizedValues.validity_daterange = {
              lower: Moment(values.lower_date).format(DATE_FORMAT),
              upper: Moment(values.upper_date).format(DATE_FORMAT),
            };
          } else {
            sanitizedValues.validity_daterange = null;
            sanitizedValues.duration_days = values.duration_days || 0;
            sanitizedValues.duration_months = values.duration_months || 0;
            sanitizedValues.duration_years = values.duration_years || 0;
          }
          switch (values.penalty_kind) {
            case 'block':
              sanitizedValues.penalty_kind = PENALTY_KIND_BLOCK_CPP;
              break;

            default:
              sanitizedValues.penalty_kind = PENALTY_KIND_NEGATIVE_ACCOUNT;
              break;
          }
          switch (values.no_show_penalty_kind) {
            case 'block':
              sanitizedValues.no_show_penalty_kind = PENALTY_KIND_BLOCK_CPP;
              break;

            default:
              sanitizedValues.no_show_penalty_kind =
                PENALTY_KIND_NEGATIVE_ACCOUNT;
              break;
          }
          if (values.credit_number === 'limited') {
            sanitizedValues.credits *= creditScaleFactor || 1;
            sanitizedValues.apply_penalties = false;
          }
          if (!values.full_vod_access) {
            sanitizedValues.only_vod_access = false;
          }
          if (!values.apply_penalties) {
            sanitizedValues.penalty_active = false;
            sanitizedValues.no_show_penalty_active = false;
          }
          if (values.expiration_date_active && values.expiration_date) {
            sanitizedValues.expiration_date = moment(
              values.expiration_date,
            ).format('YYYY-MM-DD');
          } else {
            sanitizedValues.expiration_date = null;
          }
          if (values.off_peak_active && values.off_peak_schedule) {
            sanitizedValues.off_peak_schedule = formatOffPeakScheduleOnSubmit(
              values.off_peak_schedule,
            );
          } else {
            sanitizedValues.off_peak_schedule = {};
          }
          const keys = [
            'name',
            'price',
            'tax',
            'theorical_margin_value',
            'unlimited',
            'credits',
            'max_bookings_per_day',
            'max_bookings_per_week',
            'max_bookings_per_month',
            'max_purchase_per_member',
            'id',
            'new_member_only',
            'manager_only',
            'onsite_payment_available',
            'full_vod_access',
            'only_vod_access',
            'expiration_days_before_first_use',
            'start_date_method',
            'categories',
            'metaActivities',
            'establishments',
            'penalty_active',
            'penalty_nb_late_cancellations',
            'penalty_nb_days',
            'penalty_kind',
            'penalty_days_blocked',
            'penalty_account_value',
            'no_show_penalty_active',
            'no_show_penalty_threshold',
            'no_show_penalty_time_window_days',
            'no_show_penalty_amount',
            'no_show_penalty_days_blocked',
            'no_show_penalty_kind',
            'category',
            'whitelist_tags',
            'blacklist_tags',
            'duration_days',
            'duration_months',
            'duration_years',
            'validity_daterange',
            'linked_private_pass_compatibility',
            'is_universal_pass',
            'allow_guest_pass',
            'is_usable_by_staff',
            'applies_for_payroll',
            'expiration_date',
            'description',
            'off_peak_schedule',
            'highlighted_as_recommended',
          ];
          const data = pick(sanitizedValues, keys);
          onSubmit(data, {
            onSuccess: () => {
              actions.setSubmitting(false);
              trackFormSuccess(initial?.id);
              clearPaymentPackToEdit?.();
              closeForm?.();
            },
            onError: () => {
              actions.setSubmitting(false);
              clearPaymentPackToEdit?.();
              closeForm?.();
            },
          });
        }}
        validationSchema={paymentPackSchema}
      >
        {({
          handleSubmit,
          isSubmitting,
          values,
        }: FormikProps<PaymentPackFormValues>) => {
          return (
            <Form data-testid="paymentpack-form">
              <div
                className={
                  !isInDrawer
                    ? classes.formContainer
                    : classes.firstFormContainer
                }
              >
                <PaymentPackFormGeneral
                  disabledUniversalPassFields={disabledUniversalPassFields}
                  displayNewCheckoutFlow={displayNewCheckoutFlow}
                  initial={initial}
                  paymentPackCategories={paymentPackCategories}
                  provincialTax={provincialTax}
                  setDisableUniversalPassFields={setDisableUniversalPassFields}
                />
              </div>
              <Divider className={classes.divider} />
              <div className={classes.formContainer}>
                <PaymentPackFormValidity
                  disabledUniversalPassFields={disabledUniversalPassFields}
                  initial={initial}
                />
              </div>
              <Divider className={classes.divider} />
              <div className={classes.formContainer}>
                <PaymentPackFormRestrictions
                  allowGuestMaster={!!allowGuestMaster}
                  availableEstablishmentList={availableEstablishmentList}
                  categoryList={categoryList}
                  disabledUniversalPassFields={disabledUniversalPassFields}
                  initial={initial}
                  metaActivityList={metaActivityList}
                />
              </div>
              <Divider className={classes.divider} />
              {values.is_universal_pass && (
                <>
                  <div className={classes.formContainer}>
                    <UniversalPassFormPrivateserviceCompatibility
                      compatibleServicePass={compatibleServicePass}
                      field_name="linked_private_pass_compatibility"
                      initial={initial}
                      privateServices={privateServices}
                    />
                  </div>
                  <Divider className={classes.divider} />
                </>
              )}
              <div className={classes.formContainer}>
                <PaymentPackFormAdvancedOptions
                  disabledUniversalPassFields={disabledUniversalPassFields}
                  tagList={tagList}
                />
              </div>
              <Divider className={classes.divider} />
              <div
                className={classes.actionContainer}
                id="paymentpack-form-actions"
              >
                <Actions>
                  {!!onCancel || !!closeForm ? (
                    <Button onClick={handleCancel}>
                      {onCancelText || t('form.paymentPack.actions.cancel')}
                    </Button>
                  ) : null}
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      trackFormSubmitIntent(initial?.id);
                      handleSubmit();
                    }}
                    variant="contained"
                  >
                    {t('form.paymentPack.actions.create')}
                  </Button>
                </Actions>
              </div>
              <LinearProgress
                style={{
                  visibility: isSubmitting ? 'visible' : 'hidden',
                }}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  actionButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  divider: {
    backgroundColor: '#C6C6C6',
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  formContainer: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  firstFormContainer: {
    paddingBottom: theme.spacing(4),
  },
  actionContainer: {
    padding: theme.spacing(2),
  },
}));

export default React.memo(PaymentPackForm);

const paymentPackSchema = Yup.object().shape({
  name: Yup.string().required('paymentPack:addPaymentPack.requiredField'),
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
  penalty_nb_late_cancellations: Yup.number().when('penalty_active', {
    is: true,
    then: Yup.number()
      .required('paymentPack:addPaymentPack.requiredField')
      .min(1, 'paymentPack:addPaymentPack.minusZero'),
    otherwise: Yup.number(),
  }),

  penalty_nb_days: Yup.number().when('penalty_active', {
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
  validity: Yup.string().required('paymentPack:addPaymentPack.requiredField'),
  lower_date: Yup.string()
    .required('paymentPack:addPaymentPack.requiredField')
    .test(
      'endAfterStart',
      'paymentPack:addPaymentPack.endBeforeStart',
      function testEndAfterStart(item) {
        if (this.parent.validity === 'slot') {
          return Moment(this.parent.upper_date) > Moment(item);
        }

        return true;
      },
    ),
  upper_date: Yup.string()
    .required('paymentPack:addPaymentPack.requiredField')
    .test(
      'endAfterStart',
      'paymentPack:addPaymentPack.endBeforeStart',
      function testEndAfterStart(item) {
        if (this.parent.validity === 'slot') {
          return Moment(this.parent.lower_date) < Moment(item);
        }

        return true;
      },
    ),

  duration_days: Yup.number()
    .when('validity', {
      is: 'givenNumber',
      then: Yup.number().min(0).nullable(),
      otherwise: Yup.number().nullable(),
    })
    .test(
      'sumNotZero',
      'paymentPack:addPaymentPack.sumNotZero',
      function testSumNotZero(item) {
        if (
          this.parent.validity === 'givenNumber' &&
          this.parent.duration_months === 0 &&
          this.parent.duration_years === 0
        ) {
          return item !== 0;
        }

        return true;
      },
    ),
  duration_months: Yup.number().when('validity', {
    is: 'givenNumber',
    then: Yup.number().min(0).nullable(),
    otherwise: Yup.number().nullable(),
  }),
  duration_years: Yup.number().when('validity', {
    is: 'givenNumber',
    then: Yup.number().min(0).nullable(),
    otherwise: Yup.number().nullable(),
  }),
  start_date_method: Yup.string(),
  expiration_days_before_first_use: Yup.number().when('validity', {
    is: 'givenNumber',
    then: Yup.number().test(
      'required',
      'paymentPack:addPaymentPack.requiredField',
      function testExpirationDate(item) {
        if (
          this.parent.start_date_method === `${START_ON_FIRST_BOOKING}` ||
          this.parent.start_date_method === `${START_ON_FIRST_ATTENDANCE}`
        ) {
          return typeof item === 'number';
        }

        return true;
      },
    ),
    otherwise: Yup.number(),
  }),
  max_bookings_per_day: Yup.number().min(0).nullable(),
  max_bookings_per_week: Yup.number().min(0).nullable(),
  max_bookings_per_month: Yup.number().min(0).nullable(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  new_member_only: Yup.boolean(),
  manager_only: Yup.boolean(),
  onsite_payment_available: Yup.boolean(),
  categories: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  metaActivities: Yup.array().of(Yup.number()),
  full_vod_access: Yup.boolean(),
  only_vod_access: Yup.boolean(),
  whitelist_tags: Yup.array().of(Yup.number()),
  blacklist_tags: Yup.array().of(Yup.number()),
  allow_guest_pass: Yup.boolean(),
  unusable_by_staff: Yup.boolean(),
  applies_for_payroll: Yup.boolean().required(),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  off_peak_schedule: offPeakScheduleSchemaValidation,
  highlighted_as_recommended: Yup.boolean(),
});
