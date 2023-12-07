import React from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';

import {
  MAX_LENGTH_CADENCE_STEP_NAME,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import CadenceBubble from './CadenceBubble.component';

import type { StoredStep } from '#libs/sequential_marketing/components/graph/hooks/types';

type Props = {
  step: StoredStep;
  onCancel?: () => void;
  onConfirm: (data: { name: string; stepId: number }) => void;
};

const StepNameEditionBubble: React.FC<Props> = ({
  step,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const [stepName, setStepName] = React.useState('');

  const handleSubmit = React.useCallback(() => {
    const isStepNameUnchanged = stepName === step?.name;
    !isStepNameUnchanged &&
      !!stepName &&
      onConfirm?.({ name: stepName, stepId: step?.id });
    onCancel();
  }, [stepName, step?.name, step?.id, onConfirm, onCancel]);

  const updateStepName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      event.preventDefault();
      setStepName(value);
    },
    [],
  );

  React.useEffect(() => setStepName(step?.name ?? ''), [step?.name]);

  return (
    <CadenceBubble
      squareIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon="DeviceHub"
      isSubmissionForbidden={!stepName}
      onCancelClick={onCancel}
      onConfirmClick={handleSubmit}
      title={t('cadence.form.cadenceStep')}
    >
      <TextField
        fullWidth
        required
        error={!stepName}
        helperText={!stepName && t('cadence.bubble.requiredField')}
        inputProps={{ maxLength: MAX_LENGTH_CADENCE_STEP_NAME }}
        label={t('cadence.bubble.step.name')}
        name="stepName"
        onChange={updateStepName}
        type="text"
        value={stepName}
        variant="outlined"
      />
    </CadenceBubble>
  );
};

export default React.memo(StepNameEditionBubble);
