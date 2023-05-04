import React from 'react';

import {
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { createStyles, withStyles } from '@material-ui/styles';
import EventIcon from '@material-ui/icons/Event';
import Settings from '@material-ui/icons/Settings';

import { useOfferFormStyles } from '#libs/offer/hooks';

type Props = {
  activeStep: number;
};

type StepProps = {
  active: boolean;
};

enum EDIT_STEPS {
  INFOS = 'INFOS',
  SETTINGS = 'SETTINGS',
}

const InfoStepIcon = (props: StepProps) => {
  const { active } = props;
  const classes = useOfferFormStyles(true, !active);
  return (
    <div className={classes.sectionIconContainer}>
      <EventIcon className={classes.sectionIcon} />
    </div>
  );
};

const SettingsStepIcon = (props: StepProps) => {
  const { active } = props;
  const classes = useOfferFormStyles(true, !active);
  return (
    <div className={classes.sectionIconContainer}>
      <Settings className={classes.sectionIcon} />
    </div>
  );
};

const StepperConnector = withStyles((theme: Theme) =>
  createStyles({
    alternativeLabel: {
      top: 20,
      left: `calc(-50% + 44px + ${theme.spacing(1)}px)`,
      right: `calc(50% + 44px + ${theme.spacing(1)}px)`,
      margin: '0 auto',
    },
    line: {
      borderColor: '#C4C4C4',
    },
  }),
)(StepConnector);

const EditOfferStepper = (props: Props) => {
  const { t } = useTranslation('offer');
  const { activeStep } = props;

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<StepperConnector />}
    >
      <Step>
        <StepLabel StepIconComponent={InfoStepIcon}>
          {t(`form.stepper.step.${EDIT_STEPS.INFOS}`)}
        </StepLabel>
      </Step>

      <Step>
        <StepLabel StepIconComponent={SettingsStepIcon}>
          {t(`form.stepper.step.${EDIT_STEPS.SETTINGS}`)}
        </StepLabel>
      </Step>
    </Stepper>
  );
};

export default EditOfferStepper;
