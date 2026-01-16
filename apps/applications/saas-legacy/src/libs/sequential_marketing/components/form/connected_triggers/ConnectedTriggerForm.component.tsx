import React from 'react';
import Immutable from 'seamless-immutable';
import { makeStyles } from '@material-ui/core/styles';

import { useFormikContext, withFormik } from 'formik';

import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';

import { getTriggerKind } from '#src/libs/sequential_marketing/components/helpers/utils';
import { getUniqueTriggerValidationSchema } from './validation/getValidationSchema';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import ConnectedTriggerContent from './ConnectedTriggerContent.component';

export type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  allowHourlyTimeout?: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateTrigger: (value: ConnectedTrigger) => void;
  updateFormValidation: (isValid: boolean) => void;
};

type FormValues = {
  trigger: ConnectedTrigger;
};

type HOCProps = Props & FormValues;

type HOCPropsWithoutFeatureFlag = Omit<HOCProps, 'allowHourlyTimeout'>;

/**
 * Form component to create and edit a ConnectedTrigger.
 *
 * @param {Immutable.ImmutableArray<SmartList>} smartlists - All smartlists of the company.
 * @param {(value: ConnectedTrigger) => void} updateTrigger - Updates the trigger state defined in a parent context.
 * @param {(isValid: boolean) => void} updateFormValidation - Updates the isValid state defined in a parent context. 
 *                                                            isValid is a boolean indicating whether the form is valid or not.
 *                                                            Used to disable submitButton if not valid.
= */
const ConnectedTriggerForm: React.FC<Props> = ({
  smartlists,
  updateTrigger,
  updateFormValidation,
}) => {
  const classes = useStyles();

  const { values, isValid } = useFormikContext<FormValues>();

  const handleUpdateTrigger = React.useCallback(
    (trigger: ConnectedTrigger) => updateTrigger(trigger),
    [updateTrigger],
  );

  const kind = React.useMemo(
    () => getTriggerKind(values.trigger),
    [values.trigger],
  );

  React.useEffect(() => {
    updateFormValidation(isValid);
  }, [isValid, updateFormValidation]);

  return (
    <div className={classes.content}>
      <ConnectedTriggerContent
        kind={kind}
        smartlists={smartlists}
        trigger={values.trigger}
        updateValue={handleUpdateTrigger}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    marginBottom: theme.spacing(1),
    maxHeight: '400px',
    width: '100%',
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ trigger }) => ({ trigger }),
  handleSubmit: (_values, { setSubmitting }) => {
    setSubmitting(false);
  },
  validateOnMount: true,
  validationSchema: ({ allowHourlyTimeout }: HOCProps) =>
    getUniqueTriggerValidationSchema(!!allowHourlyTimeout),
});

const ConnectedTriggerFormWithFormik = withFormikWrapper(ConnectedTriggerForm);

/**
 * Wrapper component that injects the feature flag value
 */
const ConnectedTriggerFormWithFeatureFlag: React.FC<
  HOCPropsWithoutFeatureFlag
> = (props) => {
  const allowHourlyTimeout = useSafeFlag(FeatureFlags.AUDIENCE_HOURLY_TIMEOUT);

  return (
    <ConnectedTriggerFormWithFormik
      {...props}
      allowHourlyTimeout={allowHourlyTimeout}
    />
  );
};

export default React.memo(ConnectedTriggerFormWithFeatureFlag);
