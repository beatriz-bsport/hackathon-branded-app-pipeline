import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import CadenceBubble from './CadenceBubble.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

export type ChangeInExitBubbleProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
};

const ChangeInExitBubble: React.FC<ChangeInExitBubbleProps> = ({
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const [value, setValue] = useState('won');

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setValue(event.target.value);
    },
    [],
  );

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.LOSE_COLOR}
      icon="Stop"
      onCancelClick={onCancel}
      onConfirmClick={onConfirm}
      title={t('cadence.bubble.changeInExit.title')}
    >
      <div>
        <Typography className={classes.label}>
          {t('cadence.bubble.changeInExit.label')}
        </Typography>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          onChange={handleChange}
          value={value}
        >
          <FormControlLabel
            control={<Radio color="primary" />}
            label={t('cadence.cadenceCard.win')}
            value="won"
          />
          <FormControlLabel
            control={<Radio color="primary" />}
            label={t('cadence.cadenceCard.lost')}
            value="lost"
          />
        </RadioGroup>
      </div>
    </CadenceBubble>
  );
};

const useStyles = makeStyles((theme) => ({
  label: {
    color: 'default',
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(ChangeInExitBubble);
