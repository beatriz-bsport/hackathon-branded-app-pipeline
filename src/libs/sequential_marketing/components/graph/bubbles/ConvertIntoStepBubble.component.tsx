import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CadenceBubble from './CadenceBubble.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

type Props = {
  onCancel?: () => void;
  onConfirm?: (stepName: string) => void;
};

const ConvertIntoStepBubble: React.FC<Props> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const [stepName, setStepName] = useState<string>(
    t('cadence.bubble.convertIntoStep.default'),
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setStepName(event.target.value);
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
      onCancelClick={onCancel}
      onConfirmClick={handleConfirm}
      title={stepName}
    >
      <TextField
        fullWidth
        required
        className={classes.label}
        defaultValue={t('cadence.bubble.convertIntoStep.default')}
        label={t('cadence.bubble.convertIntoStep.label')}
        name="stepName"
        onChange={handleChange}
        type="text"
      />
    </CadenceBubble>
  );
};

const useStyles = makeStyles((theme) => ({
  label: {
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(ConvertIntoStepBubble);
