import { withFormik } from 'formik';
import {
  FormValues,
  SubscriptionContractFormDrawerPropsWithoutFormik,
} from '../types';
import { SubscriptionContractFieldsSchema } from '../schema';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import {
  contractToFormValues,
  formValuesToContract,
} from '#src/libs/subscription/utils';
import { emptyContractForms } from '../constants';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Subscription,
);

export const SubscriptionContractFormHoc = withFormik<
  SubscriptionContractFormDrawerPropsWithoutFormik,
  FormValues
>({
  mapPropsToValues: ({
    initial,
    paymentPackList,
    privatePassList,
    compatibleServicePass,
  }) => {
    return !!initial
      ? contractToFormValues(
          initial,
          paymentPackList,
          privatePassList,
          compatibleServicePass,
        )
      : emptyContractForms;
  },
  enableReinitialize: true,
  validationSchema: SubscriptionContractFieldsSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, initial }, setSubmitting, resetForm },
  ) => {
    const contractPayload = formValuesToContract(values);

    onSubmit(contractPayload, {
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
