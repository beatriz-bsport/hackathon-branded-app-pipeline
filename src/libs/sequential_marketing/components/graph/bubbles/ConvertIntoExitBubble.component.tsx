import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import CadenceBubble from './CadenceBubble.component';

export type Props = {
  onCancel?: () => void;
  onConfirm?: (status: DestinationStatus) => void;
};

const ConvertIntoExitBubble: React.FC<Props> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const [value, setValue] = useState(DestinationStatus.WIN);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setValue(event.target.value as DestinationStatus);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    onConfirm?.(value);
  }, [onConfirm, value]);

  return (
    <CadenceBubble
      minimalIcon
      color={SequentialMarketingColors.LOSE_COLOR}
      icon="Stop"
      onCancelClick={onCancel}
      onConfirmClick={handleSubmit}
      title={t('cadence.bubble.convertIntoExit.title')}
    >
      <div>
        <Typography className={classes.label}>
          {t('cadence.bubble.convertIntoExit.label')}
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
            value={DestinationStatus.WIN}
          />
          <FormControlLabel
            control={<Radio color="primary" />}
            label={t('cadence.cadenceCard.lost')}
            value={DestinationStatus.FAIL}
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

export default React.memo(ConvertIntoExitBubble);
