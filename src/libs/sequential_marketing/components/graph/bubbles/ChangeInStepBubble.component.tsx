import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CadenceBubble from './CadenceBubble.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

export type ChangeInStepBubbleProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
};

const ChangeInStepBubble: React.FC<ChangeInStepBubbleProps> = ({
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const [stepName, setStepName] = useState<string>(
    t('cadence.bubble.changeInStep.default'),
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setStepName(event.target.value);
    },
    [],
  );

  return (
    <CadenceBubble
      title={stepName}
      icon="DeviceHub"
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      onCancelClick={onCancel}
      onConfirmClick={onConfirm}
      minimalIcon
    >
      <TextField
        required
        name="stepName"
        type="text"
        label={t('cadence.bubble.changeInStep.label')}
        defaultValue={t('cadence.bubble.changeInStep.default')}
        className={classes.label}
        onChange={handleChange}
        fullWidth
      />
    </CadenceBubble>
  );
};

const useStyles = makeStyles((theme) => ({
  label: {
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(ChangeInStepBubble);
