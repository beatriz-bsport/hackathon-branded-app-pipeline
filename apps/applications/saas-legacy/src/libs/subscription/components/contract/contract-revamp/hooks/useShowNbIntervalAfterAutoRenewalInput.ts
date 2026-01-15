import React from 'react';
import { FormValues } from '../types';

/** Custom hook to manage the display of the nb_interval_after_auto_renewal input
 *
 * The nb_interval_after_auto_renewal input is displayed only if the auto_renewal switch is enabled.
 * Also, the default value of nb_interval_after_auto_renewal is set to the value of nb_interval when the input is displayed.
 * @param initialValues Formik initial values
 * @param values Formik values
 * @param setFieldValue Formik setFieldValue
 * @returns A tuple containing the state of the nb_interval_after_auto_renewal input and a function to toggle it
 */
export const useShowNbIntervalAfterAutoRenewalInput = (
  initialValues: FormValues,
  values: FormValues,
  setFieldValue: (field: string, value: any) => void,
) => {
  const [
    showNbIntervalAfterAutoRenewalInput,
    setShowNbIntervalAfterAutoRenewalInput,
  ] = React.useState(initialValues.nb_interval_after_auto_renewal !== null);
  React.useEffect(() => {
    if (!values.auto_renewal) {
      setShowNbIntervalAfterAutoRenewalInput(false);
    }
  }, [values.auto_renewal, setFieldValue]);

  React.useEffect(() => {
    if (
      showNbIntervalAfterAutoRenewalInput &&
      values.nb_interval_after_auto_renewal === null
    ) {
      setFieldValue('nb_interval_after_auto_renewal', values.nb_interval);
    }
    if (!showNbIntervalAfterAutoRenewalInput) {
      setFieldValue('nb_interval_after_auto_renewal', null);
    }
  }, [
    showNbIntervalAfterAutoRenewalInput,
    setFieldValue,
    values.nb_interval,
    values.nb_interval_after_auto_renewal,
  ]);

  return {
    showNbIntervalAfterAutoRenewalInput,
    setShowNbIntervalAfterAutoRenewalInput,
  };
};
