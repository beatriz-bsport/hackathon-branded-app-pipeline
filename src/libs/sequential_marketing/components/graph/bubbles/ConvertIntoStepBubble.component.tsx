import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import CadenceBubble from './CadenceBubble.component';
import {
  MAX_LENGTH_CADENCE_STEP_NAME,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

type Props = {
  onCancel?: () => void;
  onConfirm?: (stepName: string) => void;
};

const ConvertIntoStepBubble: React.FC<Props> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation('marketing');

  const [stepName, setStepName] = useState<string>(
    t('cadence.bubble.convertIntoStep.default'),
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      event.preventDefault();
      setStepName(value);
    },
    [],
  );

  const handleConfirm = useCallback(
    () => onConfirm?.(stepName),
    [onConfirm, stepName],
  );

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon="DeviceHub"
      isSubmissionForbidden={!stepName}
      onCancelClick={onCancel}
      onConfirmClick={handleConfirm}
      title={t('cadence.form.cadenceStep')}
    >
      <TextField
        fullWidth
        required
        error={!stepName}
        helperText={!stepName && t('cadence.bubble.requiredField')}
        inputProps={{ maxLength: MAX_LENGTH_CADENCE_STEP_NAME }}
        label={t('cadence.bubble.convertIntoStep.label')}
        name="stepName"
        onChange={handleChange}
        type="text"
        value={stepName}
        variant="outlined"
      />
    </CadenceBubble>
  );
};

export default React.memo(ConvertIntoStepBubble);
