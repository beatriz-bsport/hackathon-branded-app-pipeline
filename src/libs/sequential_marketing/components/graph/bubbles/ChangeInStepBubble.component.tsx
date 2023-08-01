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
      minimalIcon
      color={SequentialMarketingColors.INNER_STEP_COLOR}
      icon="DeviceHub"
      onCancelClick={onCancel}
      onConfirmClick={onConfirm}
      title={stepName}
    >
      <TextField
        fullWidth
        required
        className={classes.label}
        defaultValue={t('cadence.bubble.changeInStep.default')}
        label={t('cadence.bubble.changeInStep.label')}
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

export default React.memo(ChangeInStepBubble);
