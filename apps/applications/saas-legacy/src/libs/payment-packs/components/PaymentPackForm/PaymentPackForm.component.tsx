import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Formik,
  FormikBag,
  FormikValues,
  type FormikProps,
} from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';

import Button from '@material-ui/core/Button';
import { Divider, LinearProgress } from '@material-ui/core';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack.js';

import { DateTime } from 'luxon';
import { NotificationsActive, Settings } from '@material-ui/icons';
import {
  offPeakGroupDefault,
  formatOffPeakScheduleOnSubmit,
  formatOffPeakScheduleOnEdit,
} from '#src/libs/payment-packs/utils';
import {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '#src/libs/payment-packs/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#src/libs/payment-packs/constants';
// @ts-expect-error
import { Actions } from '#src/components/forms';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { SCT } from '#src/libs/category/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type {
  PrivateServiceWithSlots,
  PrivatePass,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import { ALMOST_100 } from '../../../../constants';
import { OptionCallback } from '../../../../state/types';
import { MultiStepper } from '#src/components/forms/Stepper';
import type { MarketingNotification } from '#src/libs/marketing/types';
import PassFormNoNotificationsWarning from '#src/libs/marketing/components/marketing-rule-pass-forms/PassFormNoNotificationWarning.component';
import { useStyles } from './styles';
import PaymentPackFormDetailsAndRestrictionsStep from './PaymentPackFormDetailsAndRestrictionsStep.component';
import PassFormNotificationStep from '#src/libs/marketing/components/marketing-rule-pass-forms/PassFormNotificationStep.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import { PassType } from '#src/components/passes/types';
import { getCreditFactor } from '#src/libs/theme/selectors';

const penaltyKindDict = {
  [PENALTY_KIND_BLOCK_CPP]: 'block',
  [PENALTY_KIND_NEGATIVE_ACCOUNT]: 'account',
};

const paymentPackFormFields = [
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
  'notifications',
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
  'tags_on_consumer_item_creation',
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
  'bookkeeping_account',
  'grants_door_access',

  'addToNotifications',
  'removeFromNotifications',
];

export const offPeakScheduleSchemaValidation = Yup.array().of(
  Yup.object().shape({
    timeSlots: Yup.array().of(
      Yup.array().test({
        name: 'startBeforeEnd',
        test: function startBeforeEnd(timeSlot) {
          if (timeSlot && Array.isArray(timeSlot) && timeSlot.length === 2) {
            const [startTime, endTime] = timeSlot;
            if (
              DateTime.fromISO(startTime).startOf('minute') >
              DateTime.fromISO(endTime).startOf('minute')
            ) {
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
  startAtStep?: PaymentPackFormStep;

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
  compatibleServicePass: ServiceCompatibilityPass[];
  allowGuestMaster?: boolean;
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;

  // Props for the PaymentPackFormNotificationStep component
  enableNotificationStep?: boolean;
  notifications?: MarketingNotification[];
  emailSummariesById?: Record<number, EmailTemplateSummary>;
  emailDetailLoading?: boolean;
  emailDetails?: { [key: string]: EmailTemplateDetail };
  getEmailDetail?: (id: number) => void;
  resolvedGenericTags?: ResolvedGenericTags;
  smartListsById?: { [key: string]: SmartList };
  smartListLoading?: boolean;
  theme?: CompanyTheme;
};

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PaymentPack,
);

export enum PaymentPackFormStep {
  DetailsAndRestrictions,
  Notification,
}

export const PaymentPackForm: React.FC<Props> = ({
  startAtStep,

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
  bookkeepingAccounts,
  bookkeepingAccountById,

  // Props for the PaymentPackFormNotificcationStep component
  enableNotificationStep = false,
  notifications,
  emailSummariesById,
  emailDetailLoading,
  emailDetails,
  getEmailDetail,
  resolvedGenericTags,
  smartListsById,
  smartListLoading,
  theme,
}) => {
  const [currentStep, setCurrentStep] = React.useState<PaymentPackFormStep>(
    startAtStep ?? PaymentPackFormStep.DetailsAndRestrictions,
  );
  const { t } = useTranslation('paymentPack');

  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  // Add startOf('day') to make sure the initalValues injected in formik do not change between
  // two renders because enableReinitialize is enabled
  const now = DateTime.now().startOf('day');
  const oneMonthLater = DateTime.now().startOf('day').plus({ month: 1 });

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

  const onCloseForm = useCallback(() => {
    trackFormCancel(initial?.id);
    clearPaymentPackToEdit?.();
    closeForm?.();
    onCancel?.();
  }, [clearPaymentPackToEdit, closeForm, initial?.id, onCancel]);

  const notificationStepAvailable = notifications?.length > 0;

  const cancelText =
    onCancelText ||
    (currentStep === PaymentPackFormStep.DetailsAndRestrictions
      ? t('form.paymentPack.actions.cancel')
      : t('form.paymentPack.actions.back'));

  const nextOrSubmitText =
    currentStep === PaymentPackFormStep.DetailsAndRestrictions &&
    notificationStepAvailable &&
    enableNotificationStep
      ? t('form.paymentPack.actions.next')
      : t('form.paymentPack.actions.submit');

  const initialValues = useMemo(
    () =>
      initial
        ? {
            ...initial,
            credit_number: initial?.unlimited ? 'unlimited' : 'limited',
            credits: initial?.credits || 0,
            penalty_active: !!initial?.penalty_active,
            no_show_penalty_active: !!initial?.no_show_penalty_active,
            validity: initial?.validity_daterange ? 'slot' : 'givenNumber',
            lower_date: initial?.validity_daterange
              ? DateTime.fromISO(
                  // @ts-expect-error
                  JSON.parse(initial?.validity_daterange).lower,
                )
              : now,
            upper_date: initial?.validity_daterange
              ? DateTime.fromISO(
                  // @ts-expect-error
                  JSON.parse(initial?.validity_daterange).upper,
                )
              : oneMonthLater,
            validity_daterange: initial?.validity_daterange
              ? {
                  lower: DateTime.fromISO(
                    // @ts-expect-error
                    JSON.parse(initial?.validity_daterange).lower,
                  ),
                  upper: DateTime.fromISO(
                    // @ts-expect-error
                    JSON.parse(initial?.validity_daterange).upper,
                  ),
                }
              : {
                  lower: now,
                  upper: oneMonthLater,
                },
            start_date_method: `${
              initial?.start_date_method ?? START_ON_PURCHASE
            }`,
            // @ts-expect-error
            penalty_kind: penaltyKindDict[initial?.penalty_kind] || 'block',
            no_show_penalty_kind:
              penaltyKindDict[initial?.no_show_penalty_kind] || 'block',
            categories:
              initial?.categories
                // @ts-expect-error
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
            expiration_date: initial.expiration_date
              ? DateTime.fromISO(initial.expiration_date)
              : null,
            grants_door_access: !!initial?.grants_door_access,
          }
        : {
            id: null,
            name: '',
            category: null,
            price: 0,
            tax: 0,
            credit_number: 'limited',
            // Initial credits value is set to the creditFactor so that the helperText beneath the credit input displays exactly one credit
            credits: getCreditFactor(),
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
            tags_on_consumer_item_creation: [],
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
            grants_door_access: false,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getFormInitialValue,
      initial,
      offPeakGroupDefaultValue,
      offPeakGroupOnEdit,
      offPeakScheduleIsEmpty,
    ],
  );

  const submitForm = useCallback(
    (values, { setSubmitting }: FormikBag<Props, FormikValues>) => {
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
          lower: values.lower_date.toISODate(),
          upper: values.upper_date.toISODate(),
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
          sanitizedValues.no_show_penalty_kind = PENALTY_KIND_NEGATIVE_ACCOUNT;
          break;
      }
      if (values.credit_number === 'limited') {
        sanitizedValues.apply_penalties = false;
      }
      if (!values.full_vod_access) {
        sanitizedValues.only_vod_access = false;
      }
      if (values.only_vod_access) {
        sanitizedValues.grants_door_access = false;
      }
      if (!values.apply_penalties) {
        sanitizedValues.penalty_active = false;
        sanitizedValues.no_show_penalty_active = false;
      }
      if (values.expiration_date_active && values.expiration_date) {
        sanitizedValues.expiration_date = values.expiration_date.toISODate();
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

      const data = pick(sanitizedValues, paymentPackFormFields);
      // @ts-expect-error
      onSubmit(data, {
        onSuccess: () => {
          trackFormSuccess(initial?.id);
          setSubmitting(false);
          clearPaymentPackToEdit?.();
          closeForm?.();
        },
        onError: () => {
          setSubmitting(false);
          clearPaymentPackToEdit?.();
          closeForm?.();
        },
      });
    },
    [clearPaymentPackToEdit, closeForm, initial?.id, onSubmit],
  );

  const handleNext = useCallback(
    (values, formikHelpers) => {
      if (
        currentStep === PaymentPackFormStep.DetailsAndRestrictions &&
        notificationStepAvailable &&
        enableNotificationStep
      ) {
        // if first step, trigger form validation first
        setCurrentStep(PaymentPackFormStep.Notification);
        formikHelpers.setSubmitting(false);
      } else {
        submitForm(values, formikHelpers);
      }
    },
    [
      currentStep,
      enableNotificationStep,
      notificationStepAvailable,
      submitForm,
    ],
  );

  const handleCancel = useCallback(() => {
    currentStep === PaymentPackFormStep.Notification
      ? setCurrentStep(PaymentPackFormStep.DetailsAndRestrictions)
      : onCloseForm();
  }, [currentStep, onCloseForm]);

  const formSteps = useMemo(
    () => [
      {
        title: t('paymentPack:form.paymentPack.detailsAndRestrictions'),
        icon: Settings,
      },
      {
        title: t('paymentPack:form.paymentPack.notification'),
        icon: NotificationsActive,
      },
    ],
    [t],
  );

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleNext}
        validationSchema={paymentPackSchema}
      >
        {({
          handleSubmit,
          isSubmitting,
          values,
        }: FormikProps<PaymentPackFormValues>) => {
          return (
            <Form data-testid="paymentpack-form">
              {enableNotificationStep && (
                <>
                  <div className={classes.formContainer}>
                    <MultiStepper activeStep={currentStep} steps={formSteps} />
                  </div>
                  <Divider className={classes.divider} />
                </>
              )}
              <div
                className={enableNotificationStep && classes.formikContainer}
              >
                {currentStep === PaymentPackFormStep.DetailsAndRestrictions && (
                  <PaymentPackFormDetailsAndRestrictionsStep
                    allowGuestMaster={allowGuestMaster}
                    availableEstablishmentList={availableEstablishmentList}
                    bookkeepingAccountById={bookkeepingAccountById}
                    bookkeepingAccounts={bookkeepingAccounts}
                    categoryList={categoryList}
                    compatibleServicePass={compatibleServicePass}
                    initial={initial}
                    isInDrawer={isInDrawer}
                    metaActivityList={metaActivityList}
                    paymentPackCategories={paymentPackCategories}
                    privateServices={privateServices}
                    provincialTax={provincialTax}
                    tagList={tagList}
                    values={values}
                  />
                )}

                {enableNotificationStep &&
                  !notificationStepAvailable &&
                  currentStep ===
                    PaymentPackFormStep.DetailsAndRestrictions && (
                    <>
                      <div className={classes.formContainer}>
                        <PassFormNoNotificationsWarning
                          passType={PassType.PAYMENT_PACK}
                        />
                      </div>
                      <Divider className={classes.divider} />
                    </>
                  )}

                {currentStep === PaymentPackFormStep.Notification && (
                  <PassFormNotificationStep
                    emailDetailLoading={emailDetailLoading}
                    emailDetails={emailDetails}
                    emailSummariesById={emailSummariesById}
                    getEmailDetail={getEmailDetail}
                    notifications={notifications}
                    passId={initial?.id}
                    passType={PassType.PAYMENT_PACK}
                    resolvedGenericTags={resolvedGenericTags}
                    smartListLoading={smartListLoading}
                    smartListsById={smartListsById}
                    theme={theme}
                  />
                )}

                <div
                  className={classes.actionContainer}
                  id="paymentpack-form-actions"
                >
                  <Actions>
                    {!!onCancel || !!closeForm ? (
                      <Button onClick={handleCancel}>{cancelText}</Button>
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
                      {nextOrSubmitText}
                    </Button>
                  </Actions>
                </div>
                <LinearProgress
                  style={{
                    visibility: isSubmitting ? 'visible' : 'hidden',
                  }}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

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
  lower_date: Yup.date()
    .required('paymentPack:addPaymentPack.requiredField')
    .test(
      'endAfterStart',
      'paymentPack:addPaymentPack.endBeforeStart',
      function testEndAfterStart(item) {
        if (this.parent.validity === 'slot') {
          return (
            DateTime.fromJSDate(this.parent.upper_date) >
            DateTime.fromJSDate(item)
          );
        }

        return true;
      },
    ),
  upper_date: Yup.date()
    .required('paymentPack:addPaymentPack.requiredField')
    .test(
      'endAfterStart',
      'paymentPack:addPaymentPack.endBeforeStart',
      function testEndAfterStart(item) {
        if (this.parent.validity === 'slot') {
          return (
            DateTime.fromJSDate(this.parent.lower_date) <
            DateTime.fromJSDate(item)
          );
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
  tags_on_consumer_item_creation: Yup.array().of(Yup.number()),
  allow_guest_pass: Yup.boolean(),
  unusable_by_staff: Yup.boolean(),
  applies_for_payroll: Yup.boolean().required(),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  off_peak_schedule: offPeakScheduleSchemaValidation,
  highlighted_as_recommended: Yup.boolean(),
  bookkeeping_account: Yup.number().nullable(),
  notifications: Yup.array().of(Yup.object()).notRequired(),
  grants_door_access: Yup.boolean(),
});
