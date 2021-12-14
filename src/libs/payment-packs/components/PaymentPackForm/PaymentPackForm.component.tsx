import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { Divider, LinearProgress } from '@material-ui/core';

import moment from 'moment';
import pick from 'lodash/pick';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';
import { DATE_FORMAT } from '../../../../utils/datetime';
import { OptionCallback } from '../../../../state/types';
import {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackFormValues,
} from '../../types';
import PaymentPackFormGeneral from './PaymentPackFormGeneral.component';
import PaymentPackFormValidity from './PaymentPackFormValidity.component';
import PaymentPackFormRestrictionsComponent from './PaymentPackFormRestrictions.component';
import { SCT } from '#libs/category/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import PaymentPackFormTag from './PaymentPackFormTag.component';
import { Tag, TagGroup } from '#libs/tag/types';
import { Actions, Submit } from '../../../../components/forms';
import { Moment } from '../../../../i18n';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

const validityDict = {
  [START_ON_PURCHASE]: 'billing',
  [START_ON_FIRST_BOOKING]: 'booking',
  [START_ON_FIRST_ATTENDANCE]: 'attendance',
};

const penaltyKindDict = {
  [PENALTY_KIND_BLOCK_CPP]: 'block',
  [PENALTY_KIND_NEGATIVE_ACCOUNT]: 'account',
};

type OwnProps = {
  paymentPackCategories: Array<PaymentPackCategory>;
  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  tagList: Array<Tag<TagGroup>>;
  initial?: PaymentPack;
  onCancel: () => void;
  onCancelText: string;
  closeDialog: () => void;
  onSubmit: (
    data: PaymentPackFormValues,
    options: OptionCallback<PaymentPack>,
  ) => void;
  clearPaymentPackToEdit: () => void;
};
type Props = OwnProps & WithTranslation;

export const PaymentPackForm = (props: Props) => {
  const {
    t,
    paymentPackCategories,
    categoryList,
    establishmentList,
    metaActivityList,
    tagList,
    initial,
    onCancel,
    onCancelText,
    onSubmit,
    closeDialog,
    clearPaymentPackToEdit,
  } = props;
  const classes = useStyles();
  const now = moment().format(DATE_FORMAT);
  const oneMonthLater = moment(now).add(1, 'M').format(DATE_FORMAT);
  return (
    <Formik
      enableReinitialize
      validationSchema={paymentPackSchema}
      initialValues={
        initial
          ? {
              ...initial,
              credit_number: initial?.unlimited ? 'unlimited' : 'limited',
              credits: initial?.credits || 0,
              penalty_active: !!initial?.penalty_active,
              validity: initial?.validity_daterange ? 'slot' : 'givenNumber',
              lower_date: initial?.validity_daterange
                ? Moment(JSON.parse(initial?.validity_daterange).lower).format(
                    DATE_FORMAT,
                  )
                : now,
              upper_date: initial?.validity_daterange
                ? Moment(JSON.parse(initial?.validity_daterange).upper).format(
                    DATE_FORMAT,
                  )
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
              start_date_method:
                validityDict[initial?.start_date_method] || 'billing',
              penalty_kind: penaltyKindDict[initial?.penalty_kind] || 'block',
              categories: initial?.categories?.map((category) => category.id),
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
              start_date_method: 'billing',
              expiration_days_before_first_use: 365,
              theorical_margin_value: 0,
              penalty_nb_late_cancellations: 3,
              penalty_nb_days: 7,
              penalty_kind: 'block',
              penalty_days_blocked: 7,
              penalty_account_value: 10,
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
            }
      }
      onSubmit={(values, actions) => {
        const sanithizedValues = {
          ...values,
          unlimited: values.credit_number === 'unlimited',
        };
        if (values.validity === 'slot') {
          sanithizedValues.duration_days = null;
          sanithizedValues.duration_months = null;
          sanithizedValues.duration_years = null;
          sanithizedValues.validity_daterange = {
            lower: Moment(values.lower_date).format(DATE_FORMAT),
            upper: Moment(values.upper_date).format(DATE_FORMAT),
          };
        } else {
          sanithizedValues.validity_daterange = null;
          sanithizedValues.duration_days = values.duration_days || 0;
          sanithizedValues.duration_months = values.duration_months || 0;
          sanithizedValues.duration_years = values.duration_years || 0;
        }
        switch (values.start_date_method) {
          case 'billing':
            sanithizedValues.start_date_method = START_ON_PURCHASE;
            break;
          case 'firstBooking':
            sanithizedValues.start_date_method = START_ON_FIRST_BOOKING;
            break;
          default:
            sanithizedValues.start_date_method = START_ON_FIRST_ATTENDANCE;
            break;
        }
        switch (values.penalty_kind) {
          case 'block':
            sanithizedValues.penalty_kind = PENALTY_KIND_BLOCK_CPP;
            break;

          default:
            sanithizedValues.penalty_kind = PENALTY_KIND_NEGATIVE_ACCOUNT;
            break;
        }
        if (values.credit_number === 'limited') {
          sanithizedValues.penalty_active = false;
        }
        if (!values.full_vod_access) {
          sanithizedValues.only_vod_access = false;
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
          'category',
          'whitelist_tags',
          'blacklist_tags',
          'duration_days',
          'duration_months',
          'duration_years',
          'validity_daterange',
        ];
        const data = pick(sanithizedValues, keys);
        onSubmit(data, {
          onSuccess: () => {
            actions.setSubmitting(false);
            if (clearPaymentPackToEdit) {
              clearPaymentPackToEdit();
            }
            if (closeDialog) {
              closeDialog();
            }
          },
          onError: () => {
            actions.setSubmitting(false);
            if (clearPaymentPackToEdit) {
              clearPaymentPackToEdit();
            }
            if (closeDialog) {
              closeDialog();
            }
          },
        });
      }}
    >
      {(formikProps: FormikProps<PaymentPackFormValues>) => {
        return (
          <Form>
            <div className={classes.formContainer}>
              <PaymentPackFormGeneral
                initial={initial}
                formikProps={formikProps}
                paymentPackCategories={paymentPackCategories}
              />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.formContainer}>
              <PaymentPackFormValidity
                formikProps={formikProps}
                initial={initial}
              />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.formContainer}>
              <PaymentPackFormRestrictionsComponent
                formikProps={formikProps}
                categoryList={categoryList}
                establishmentList={establishmentList}
                metaActivityList={metaActivityList}
                initial={initial}
              />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.formContainer}>
              <PaymentPackFormTag formikProps={formikProps} tagList={tagList} />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.actionContainer}>
              <Actions>
                {onCancel || closeDialog ? (
                  <Button
                    onClick={() => {
                      if (clearPaymentPackToEdit) {
                        clearPaymentPackToEdit();
                      }
                      if (closeDialog) {
                        closeDialog();
                      }
                      if (onCancel) {
                        onCancel();
                      }
                    }}
                  >
                    {onCancelText || t('form.paymentPack.actions.cancel')}
                  </Button>
                ) : null}
                <Submit id="button_payment_pack_onsubmit">
                  {initial && initial?.id
                    ? t('form.paymentPack.actions.edit')
                    : t('form.paymentPack.actions.create')}
                </Submit>
              </Actions>
            </div>
            <LinearProgress
              style={{
                visibility: formikProps.isSubmitting ? 'visible' : 'hidden',
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  actionButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  divider: {
    backgroundColor: '#C6C6C6',
  },
  formContainer: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  actionContainer: {
    padding: theme.spacing(2),
  },
}));

export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackForm,
);

const paymentPackSchema = Yup.object().shape({
  name: Yup.string().required('paymentPack:addPaymentPack.requiredField'),
  price: Yup.number()
    .required('paymentPack:addPaymentPack.requiredField')
    .min(0),
  tax: Yup.number().required('paymentPack:addPaymentPack.requiredField').min(0),
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
  penalty_active: Yup.boolean(),
  penalty_nb_late_cancellations: Yup.number().when('penality', {
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
      if (this.parent.penality && this.parent.penalty_kind === 'block') {
        return typeof item === 'number' && item > 0;
      }

      return true;
    },
  ),
  penalty_account_value: Yup.number().test(
    'required',
    'paymentPack:addPaymentPack.requiredField',
    function testRequired(item) {
      if (this.parent.penality && this.parent.penalty_kind === 'account') {
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
          this.parent.start_date_method === 'firstBooking' ||
          this.parent.start_date_method === 'attendance'
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
});
