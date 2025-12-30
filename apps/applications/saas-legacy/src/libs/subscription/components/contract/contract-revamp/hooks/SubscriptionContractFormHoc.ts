import { withFormik } from 'formik';
import {
  FormValues,
  InvoicingType,
  ObjectType,
  SubscriptionContractFormDrawerPropsWithoutFormik,
} from '../types';
import { getIdOrObject } from '../utils';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { PrivatePass } from '#src/libs/private-service/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import { SubscriptionContractFieldsSchema } from '../schema';
import { omit } from 'lodash';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Subscription,
);

export const SubscriptionContractFormHoc = withFormik<
  SubscriptionContractFormDrawerPropsWithoutFormik,
  FormValues
>({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        // recurrent_price: parseFloat(initial.recurrent_price),
        payment_pack: initial.payment_pack
          ? getIdOrObject<PaymentPack>(initial.payment_pack)
          : null,
        private_pass: initial.private_pass
          ? getIdOrObject<PrivatePass>(initial.private_pass)
          : null,
        payment_combo: initial.payment_combo
          ? getIdOrObject<PaymentCombo>(initial.payment_combo)
          : null,
        object_type: initial.private_pass
          ? ObjectType.privatePass
          : initial.payment_pack
          ? ObjectType.paymentPack
          : ObjectType.paymentCombo,
        unusable_by_staff: !initial.is_usable_by_staff,
        tags_on_first_billing: initial.tags_on_first_billing || [],
        invoicing_type: initial.month_billing_day
          ? InvoicingType.fixedDay
          : InvoicingType.sameDayAsSubscription,
        commitment_period_unit: initial.commitment_period_unit || 'month',
        commitment_period_value: initial.commitment_period_value || 1,
      };
    }
    return {
      name: '',
      recurrent_price: '0',
      flat_fee: '0',
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
      invoicing_type: InvoicingType.sameDayAsSubscription,
      month_billing_day: 1,
      highlighted_as_recommended: false,
      tags_on_first_billing: [],
      nb_interval_after_auto_renewal: null,
      contract_template: null,
      editable: true,
      has_mandatory_commitment_period: false,
      commitment_period_unit: 'month',
      commitment_period_value: 1,
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
          ? // @ts-expect-error - Fixed next PR
            values.private_pass
          : null,
      payment_combo:
        values.object_type === ObjectType.paymentCombo
          ? // @ts-expect-error - Fixed next PR
            values.payment_combo
          : null,
      payment_pack:
        values.object_type === ObjectType.paymentPack
          ? // @ts-expect-error - Fixed next PR
            values.payment_pack
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
