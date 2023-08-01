import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CadenceSettingsFormStepper, {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
  StepChoice,
} from '../CadenceSettingsFormStepper.component';

import TriggerForm, { Values } from '../Trigger/components';

import useConnectedTriggerFormStyles from './styles.hook';

import type { OptionCallback } from '../../../../../state/types';
import type { BaseFormComponentProps } from './types';

type InitialSetUpComponentProps = BaseFormComponentProps & {
  onSubmit: (
    data: {
      [CADENCE_STEPPER_ENTRY_STEP]: Values | {};
      [CADENCE_STEPPER_WIN_STEP]: Values | {};
      [CADENCE_STEPPER_LOSE_STEP]: Values | {};
    },
    options?: OptionCallback,
  ) => void;
};

export const CadenceInitialSetupForm: React.FC<InitialSetUpComponentProps> = ({
  smartlists,
  onSubmit,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [formStep, setFormStep] = React.useState<StepChoice>(
    CADENCE_STEPPER_ENTRY_STEP,
  );

  const [formValuesSubmitted, setFormValuesSubmitted] = React.useState<{
    [CADENCE_STEPPER_ENTRY_STEP]: Values | {};
    [CADENCE_STEPPER_WIN_STEP]: Values | {};
    [CADENCE_STEPPER_LOSE_STEP]: Values | {};
  }>({
    [CADENCE_STEPPER_ENTRY_STEP]: {},
    [CADENCE_STEPPER_WIN_STEP]: {},
    [CADENCE_STEPPER_LOSE_STEP]: {},
  });

  const handleSubmitEntryForm = (data: Values) => {
    setFormValuesSubmitted({
      ...formValuesSubmitted,
      [CADENCE_STEPPER_ENTRY_STEP]: data,
    });
    setFormStep(CADENCE_STEPPER_WIN_STEP);
  };

  const handleCancelWinForm = () => setFormStep(CADENCE_STEPPER_ENTRY_STEP);

  const handleSubmitWinForm = (data: Values) => {
    setFormValuesSubmitted({
      ...formValuesSubmitted,
      [CADENCE_STEPPER_WIN_STEP]: data,
    });
    setFormStep(CADENCE_STEPPER_LOSE_STEP);
  };

  const handleCancelLoseStep = () => setFormStep(CADENCE_STEPPER_WIN_STEP);

  const handleSubmitLoseStep = (data: Values) => {
    setFormValuesSubmitted({
      ...formValuesSubmitted,
      [CADENCE_STEPPER_LOSE_STEP]: data,
    });
    // Formik warning here : setFieldValue and setValues are not async thus, have to use data.
    onSubmit({
      ...formValuesSubmitted,
      [CADENCE_STEPPER_LOSE_STEP]: data,
    });
    setFormStep(CADENCE_STEPPER_ENTRY_STEP);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.cadenceParameters')}</Typography>
      </div>
      <div className={classes.stepperContainer}>
        <CadenceSettingsFormStepper
          displaySteps={[
            CADENCE_STEPPER_ENTRY_STEP,
            CADENCE_STEPPER_WIN_STEP,
            CADENCE_STEPPER_LOSE_STEP,
          ]}
          step={formStep}
        />
      </div>
      <Divider />
      {formStep === CADENCE_STEPPER_ENTRY_STEP && (
        <TriggerForm
          cadenceEntry
          noEmptyTrigger
          formValues={formValuesSubmitted}
          onSubmit={handleSubmitEntryForm}
          smartlists={smartlists}
        />
      )}

      {formStep === CADENCE_STEPPER_WIN_STEP && (
        <TriggerForm
          cadenceExitSuccess
          noEmptyTrigger
          formValues={formValuesSubmitted}
          onCancel={handleCancelWinForm}
          onSubmit={handleSubmitWinForm}
          smartlists={smartlists}
        />
      )}

      {formStep === CADENCE_STEPPER_LOSE_STEP && (
        <TriggerForm
          cadenceExitFail
          noEmptyTrigger
          withTimeout
          formValues={formValuesSubmitted}
          onCancel={handleCancelLoseStep}
          onSubmit={handleSubmitLoseStep}
          smartlists={smartlists}
        />
      )}
    </div>
  );
};

export default CadenceInitialSetupForm;
