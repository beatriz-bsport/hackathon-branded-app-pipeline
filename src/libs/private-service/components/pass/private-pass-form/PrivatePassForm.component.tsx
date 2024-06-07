import React, { MouseEvent, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { CB } from '@bsport/common/lib/master-data/payment-methods';

import { START_ON_PURCHASE } from '@bsport/common/lib/master-data/payment-pack';

import * as Yup from 'yup';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { SCT } from '#src/libs/category/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import { ALMOST_100 } from '../../../../../constants';
import { Form, FormikProps, FormikBag, Formik } from 'formik';
import {
  PrivatePassCategory,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
  PrivatePassWithCompatibility,
  CompatiblePrivateService,
} from '../../../types';
import PrivatePassFormDetailsAndRestrictionsStep from './PrivatePassFormDetailsAndRestrictionsStep.component';
import { OptionCallback } from '#src/state/types';
import { Tag, TagGroup } from '#src/libs/tag/types';

export interface FormikValues {
  name: string | null;
  category: number | null;
  tax: number;
  credits: number;
  price: number;
  manager_only: boolean;
  new_member_only: boolean;
  full_vod_access: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: Array<number>;
  start_date_method: string;
  expiration_days_before_first_use: number;
  expiration_date_active: boolean;
  compatibility: Array<CompatiblePrivateService>;
  is_universal_pass: boolean;
  linked_payment_pack?: PaymentPack;
  linked_payment_pack_categories: Array<number>;
  linked_payment_pack_establishments: Array<number>;
  linked_payment_pack_metaActivities: Array<number>;
  unusable_by_staff: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher?: boolean;
  expiration_date: DateTime | null;
  description?: string | null;
  tags_on_consumer_item_creation?: Array<number>;
  bookkeeping_account?: number;
}
type Props = {
  provincialTax: number;
  initial?: PrivatePassWithCompatibility<PaymentPack>;
  privatePassCategories: Array<PrivatePassCategory>;

  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass?: Array<ServiceCompatibilityPass>;

  onCancel: (ev: MouseEvent) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (data: FormikValues, options?: OptionCallback) => void;

  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;

  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
} & FormikProps<FormikValues>;

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivatePass,
);
export const PrivatePassForm = (props: Props) => {
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { onSubmit, initial } = props;

  const initialValues = useMemo(
    () =>
      props.initial?.id
        ? {
            ...props.initial,
            start_date_method: `${props.initial.start_date_method}`,
            new_member_only: props.initial.new_member_only,
            is_universal_pass: !!props.initial.linked_payment_pack,
            linked_payment_pack_categories:
              props.initial.linked_payment_pack?.categories || [],
            linked_payment_pack_establishments:
              props.initial.linked_payment_pack?.establishments || [],
            linked_payment_pack_metaActivities:
              props.initial.linked_payment_pack?.metaActivities || [],
            unusable_by_staff: !props.initial.is_usable_by_staff,
            // @ts-expect-error
            applies_for_payroll: props.initial.applies_for_payroll,
            // @ts-expect-error
            on_behalf_of_teachr: props.initial.on_behalf_of_teacher,
            expiration_date_active: !!props.initial?.expiration_date,
            expiration_date: props.initial.expiration_date
              ? DateTime.fromISO(props.initial.expiration_date)
              : null,
            credits: props.initial?.credits,
            tags_on_consumer_item_creation:
              props.initial.tags_on_consumer_item_creation || [],
          }
        : {
            name: null,
            category: null,
            tax: 0,
            credits: 1,
            price: 0,
            manager_only: false,
            new_member_only: false,
            full_vod_access: true,
            duration_days: 0,
            duration_months: 0,
            duration_years: 1,
            available_payment_method_identifiers: [CB.id],
            start_date_method: `${START_ON_PURCHASE}`,
            expiration_days_before_first_use: 365,
            compatibility: [],
            is_universal_pass: false,
            linked_payment_pack_categories: [],
            linked_payment_pack_establishments: [],
            linked_payment_pack_metaActivities: [],
            unusable_by_staff: false,
            applies_for_payroll: true,
            on_behalf_of_teacher: false,
            expiration_date: null,
            expiration_date_active: false,
            description: null,
            tags_on_consumer_item_creation: [],
          },
    [props.initial],
  );

  const submitForm = useCallback(
    (
      values: FormikValues,
      { setSubmitting }: FormikBag<Props, FormikValues>,
    ) => {
      const { linked_payment_pack, credits, ...otherValues } = values;

      const newValues = {
        ...otherValues,
        available_payment_method_identifiers:
          values.available_payment_method_identifiers.length === 0
            ? [CB.id]
            : values.available_payment_method_identifiers,
        ...(linked_payment_pack && linked_payment_pack?.id
          ? {
              linked_payment_pack: linked_payment_pack.id,
            }
          : {}),
        is_usable_by_staff: !values.unusable_by_staff,
        expiration_date:
          values.expiration_date_active && values.expiration_date
            ? values.expiration_date.toISODate()
            : null,
        credits,
      };
      // @ts-expect-error
      onSubmit(newValues, {
        onSuccess: () => {
          trackFormSuccess(initial?.id);
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      });
    },
    [initial?.id, onSubmit],
  );

  return (
    <Formik
      enableReinitialize
      // @ts-expect-error
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={PrivatePassSchema}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<FormikValues>) => (
        <Form className={classes.container} data-testid="private-pass-form">
          <PrivatePassFormDetailsAndRestrictionsStep
            bookkeepingAccountById={props.bookkeepingAccountById}
            bookkeepingAccounts={props.bookkeepingAccounts}
            categoryList={props.categoryList}
            compatibleServicePass={props.compatibleServicePass}
            establishmentList={props.establishmentList}
            metaActivityList={props.metaActivityList}
            privatePassCategories={props.privatePassCategories}
            privateServices={props.privateServices}
            provincialTax={props.provincialTax}
            tagList={props.tagList}
          />

          <div
            className={`${classes.buttonContainer} ${classes.flexRowCenter}`}
            id="private-pass-form-actions-buttons"
          >
            <Button
              onClick={(e: MouseEvent) => {
                props.onCancel(e);
                trackFormCancel(props.initial?.id);
              }}
            >
              {t('privatePass.form.actions.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting}
              onClick={() => {
                trackFormSubmitIntent(props.initial?.id);
                handleSubmit();
              }}
              variant="contained"
            >
              {t('privatePass.form.actions.create')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  fieldBlockFlex: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItem: 'center',
    flexDirection: 'column',
  },
  buttonContainer: {
    marginTop: -theme.spacing(2),
    justifyContent: 'flex-end',
    padding: theme.spacing(4),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  priceField: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taxField: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    height: 2,
    color: '#C6C6C6',
  },
  categoryBlock: {
    paddingBottom: theme.spacing(2),
  },
  paymentMeansHelpertext: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  yellowIcon: {
    color: '#FFA71D',
  },
  durationNbBlock: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  startDate: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: theme.spacing(3),
  },
  greyIcon: {
    color: '#868686',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },

  firstBooking: {
    marginTop: theme.spacing(2),
  },
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  emptyListItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
  paymentMethodMeansInfo: {
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 5,
    top: theme.spacing(7.5),
    marginLeft: theme.spacing(5),
    marginTop: -theme.spacing(4),
    visibility: 'hidden',
  },
  paymentMethodSelector: {
    marginTop: theme.spacing(1),
    '&:hover': {
      '& $paymentMethodMeansInfo': {
        visibility: 'visible',
      },
    },
  },
  privateServiceSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 600,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(4),

    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  helperTextError: {
    color: theme.palette.error.main,
  },
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  redIcon: {
    color: 'red',
  },
  rowExpirationDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabelExpirationDate: { marginTop: theme.spacing(1), fontSize: 12 },
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
}));

export const PrivatePassSchema = Yup.object().shape({
  name: Yup.string().required(),
  tax: Yup.number().required().min(0).max(ALMOST_100),
  category: Yup.number().nullable(true),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  new_member_only: Yup.boolean().required(),
  full_vod_access: Yup.boolean().required(),
  duration_days: Yup.number().required().integer().min(0),
  duration_months: Yup.number().required().integer().min(0),
  duration_years: Yup.number().required().integer().min(0),
  start_date_method: Yup.number().required().integer().min(0).max(2),
  expiration_days_before_first_use: Yup.number(),
  available_payment_method_identifiers: Yup.array().of(Yup.number().integer()),
  compatibility: Yup.array().of(
    Yup.object().shape({
      private_service: Yup.number(),
      excluded_slot_ids: Yup.array().of(Yup.number()),
    }),
  ),

  linked_payment_pack_categories: Yup.array().of(Yup.number()).nullable(true),
  linked_payment_pack_establishments: Yup.array()
    .of(Yup.number())
    .nullable(true),
  linked_payment_pack_metaActivities: Yup.array()
    .of(Yup.number())
    .nullable(true),
  unusable_by_staff: Yup.boolean().required(),
  applies_for_payroll: Yup.boolean().required(),
  on_behalf_of_teacher: Yup.boolean().required(),
  expiration_date: Yup.date().nullable(),
  description: Yup.string().nullable(),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
});

export default PrivatePassForm;
