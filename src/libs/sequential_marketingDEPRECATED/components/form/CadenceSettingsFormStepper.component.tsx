import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';

export const CADENCE_STEPPER_ENTRY_STEP = 1;
export const CADENCE_STEPPER_WIN_STEP = 2;
export const CADENCE_STEPPER_LOSE_STEP = 3;

const IconStepperEnum = {
  [CADENCE_STEPPER_ENTRY_STEP]: PlayArrowIcon,
  [CADENCE_STEPPER_WIN_STEP]: CheckCircleIcon,
  [CADENCE_STEPPER_LOSE_STEP]: CancelIcon,
};

const IconStepLabel = {
  [CADENCE_STEPPER_ENTRY_STEP]: 'cadence.form.entry_step',
  [CADENCE_STEPPER_WIN_STEP]: 'cadence.form.win_step',
  [CADENCE_STEPPER_LOSE_STEP]: 'cadence.form.lose_step',
};

export type StepChoice = keyof typeof IconStepperEnum;

export type Props = {
  step: StepChoice;
  displaySteps: Array<StepChoice>;
};

export const CadenceSettingsFormStepper: React.FC<Props> = ({
  step,
  displaySteps,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <>
      <div className={classes.stepperContainer}>
        {displaySteps.map((step_identifier: StepChoice, index: number) => (
          <div
            key={`${step_identifier}_${index}`}
            className={classes.stepWithIcon}
          >
            <div className={classes.iconRelativeContainer}>
              {step_identifier !== CADENCE_STEPPER_ENTRY_STEP &&
                displaySteps.length >= 2 && (
                  <div className={classes.stepperLineContainer}>
                    <div className={classes.stepperLine} />
                  </div>
                )}
              <div className={classes.iconContainer}>
                <CustomMuiIcon
                  MuiIcon={IconStepperEnum[step_identifier]}
                  variant={step >= step_identifier ? 'primary' : 'disabled'}
                  MuiIconProps={{ fontSize: 'large' }}
                />
                <div className={classes.stepLabel}>
                  <Typography
                    variant="caption"
                    color={
                      step >= step_identifier ? 'textPrimary' : 'textSecondary'
                    }
                  >
                    {t(IconStepLabel[step_identifier])}
                  </Typography>
                </div>
              </div>
              {step_identifier !== CADENCE_STEPPER_LOSE_STEP &&
                displaySteps.length >= 2 && (
                  <div className={classes.stepperLineContainer}>
                    <div className={classes.stepperLine} />
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    position: 'relative',
  },
  stepperLineContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  stepperLine: {
    height: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    width: '100%',
  },
  iconRelativeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  stepWithIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  stepLabel: {
    paddingTop: theme.spacing(10),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  stepperContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: theme.spacing(5),
  },
}));

export default CadenceSettingsFormStepper;
