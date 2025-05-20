import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import type { ContractTemplateFormValues } from '#src/libs/subscription/types';
import {
  SubscriptionInvoicingType,
  PassType,
} from '#src/libs/subscription/enums';
import {
  CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED,
  CONTRACT_MAX_NB_INTERVAL_ALLOWED,
  DEFAULT_CONTRACT_TEMPLATE_FORM_INITIAL_VALUES,
} from '#src/libs/subscription/constants';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

import ContractTemplateForm from '#src/libs/subscription/franchise-components/form/ContractTemplateForm.component';

type Props = {
  open?: boolean;
  initialValues?: ContractTemplateFormValues;
  handleSubmit: (values: ContractTemplateFormValues) => void;
} & React.ComponentProps<typeof ContractTemplateForm>;

const franchiseContractTemplateFormValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  numberOfIntervals: Yup.number()
    .integer()
    .min(1)
    .max(CONTRACT_MAX_NB_INTERVAL_ALLOWED)
    .required()
    .test(
      'Must-be-less-than-or-equal-to-twelve-for-fixed-billing-day',
      'contract.form.nb_interval.errorForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(numberOfIntervals) {
        return (
          this.parent.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          numberOfIntervals <= 12
        );
      },
    )
    .test(
      'Must-be-more-than-one-for-fixed-billing-day',
      'contract.form.nb_interval.restrictionForFixedBillingDay',
      function checkNbIntervalForFixedBillingDay(numberOfIntervals) {
        return (
          this.parent.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          numberOfIntervals > 1
        );
      },
    ),
  recurrenceBasis: Yup.number()
    .integer()
    .min(1)
    .required()
    .test(
      'Must-be-one-for-fixed-billing-day',
      'Fixed Billing Day must be one',
      function checkNbIntervalForFixedBillingDay(recurrenceBasis) {
        return (
          this.parent.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          recurrenceBasis === 1
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
          this.parent.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          interval === 'month'
        );
      },
    ),
  recurrentPrice: Yup.number()
    .min(0)
    .test(
      'is-decimal',
      'contract.form.error.moreThanThreeDecimalPrice',
      (value) => (value * 100) % 1 === 0,
    ),
  flatFee: Yup.number()
    .min(0)
    .test(
      'is-decimal',
      'contract.form.error.moreThanThreeDecimalPrice',
      (value) => (value * 100) % 1 === 0,
    ),
  paymentPackTemplate: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'contract.form.error.missingPaymentPack',
      function checkPaymentPackIsNullable(paymentPackTemplate) {
        const { productType } = this.parent;
        return productType !== PassType.PASSES || !!paymentPackTemplate;
      },
    ),
  privatePassTemplate: Yup.number()
    .integer()
    .nullable()
    .test(
      'is-nullable',
      'contract.form.error.missingPrivatePass',
      function checkPrivatePassIsNullable(privatePassTemplate) {
        const { productType } = this.parent;
        return (
          productType !== PassType.APPOINTMENT_PASSES || !!privatePassTemplate
        );
      },
    ),
  contract: Yup.string().required(),
  monthBillingDay: Yup.number()
    .min(1)
    .max(31)
    .nullable()
    .test(
      'Must-set-if-fixed-day-invoicing-type',
      'missing',
      function checkIntervalBasedOnMonthBillingDay(monthBillingDay) {
        return (
          this.parent.invoicingType ===
            SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION ||
          !!monthBillingDay
        );
      },
    ),
  managerOnly: Yup.boolean(),
  autoRenewal: Yup.boolean(),
  unusableByStaff: Yup.boolean(),
  invoicingType: Yup.string().required(),
  has_mandatory_commitment_period: Yup.boolean().required().default(false),
  commitment_period_value: Yup.number()
    .integer('common:form.validation.number')
    .min(1, 'common:positiveNumber')
    .max(
      CONTRACT_MAX_COMMITMENT_VALUE_ALLOWED,
      'contract.form.commitmentPeriod.error',
    )
    .nullable(),
  commitment_period_unit: Yup.string().nullable(),
});

const ContractTemplateFormDrawer: React.FC<Props> = ({
  displayStopSubscriptionFromMemberSideForFranchisees,
  open,
  initialValues,
  handleSubmit,
  handleClose,
  getPaymentPackTemplateList,
  getPrivatePassTemplateList,
  fetchPaymentPackTemplateBulk,
  fetchPrivatePassTemplateBulk,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  return (
    <GenericResponsiveDrawer
      withoutPadding
      customClasses={classes}
      onClose={handleClose}
      open={open}
      title={t('contractTemplate.form.title')}
    >
      <Formik
        initialValues={
          initialValues ?? DEFAULT_CONTRACT_TEMPLATE_FORM_INITIAL_VALUES
        }
        onSubmit={handleSubmit}
        validationSchema={franchiseContractTemplateFormValidationSchema}
      >
        <ContractTemplateForm
          contractTemplateId={initialValues?.id}
          contractTemplateMonthBillingDay={initialValues?.monthBillingDay}
          displayStopSubscriptionFromMemberSideForFranchisees={
            displayStopSubscriptionFromMemberSideForFranchisees
          }
          fetchPaymentPackTemplateBulk={fetchPaymentPackTemplateBulk}
          fetchPrivatePassTemplateBulk={fetchPrivatePassTemplateBulk}
          getPaymentPackTemplateList={getPaymentPackTemplateList}
          getPrivatePassTemplateList={getPrivatePassTemplateList}
          handleClose={handleClose}
        />
      </Formik>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  progress: {
    marginRight: theme.spacing(1),
  },
  actions: {
    paddingBottom: theme.spacing(2),
  },
  header: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(4),
    marginTop: 0,
  },
  topCancel: {
    marginLeft: 0,
  },
}));

export default React.memo(ContractTemplateFormDrawer);
