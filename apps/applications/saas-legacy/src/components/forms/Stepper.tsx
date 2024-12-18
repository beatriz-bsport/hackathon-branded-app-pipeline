import React from 'react';

import {
  IconProps,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Theme,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import chroma from 'chroma-js';

const STEPPER_ICON_SIZE = '40px';

type StepProps = {
  active: boolean;
  icon: React.ComponentType<IconProps>;
};

const StepIcon = React.memo((props: StepProps) => {
  const { active, icon: Icon } = props;
  const classes = useIconStyle({ active });
  return (
    <div className={classes.sectionIconContainer}>
      <Icon className={classes.sectionIcon} />
    </div>
  );
});

const useIconStyle = makeStyles<Theme, { active: boolean }>((theme: Theme) =>
  createStyles({
    sectionIconContainer: ({ active }) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.spacing(1),
      background: active
        ? `${chroma(theme.palette.primary.main).hex()}1a`
        : theme.palette.grey[50],
      width: STEPPER_ICON_SIZE,
      height: STEPPER_ICON_SIZE,
    }),
    sectionIcon: ({ active }) => ({
      color: active ? theme.palette.primary.main : theme.palette.grey[400],
    }),
  }),
);

const StepperConnector = withStyles((theme: Theme) =>
  createStyles({
    alternativeLabel: {
      top: 20,
      left: `calc(-50% + ${STEPPER_ICON_SIZE} + ${theme.spacing(1)}px)`,
      right: `calc(50% + ${STEPPER_ICON_SIZE} + ${theme.spacing(1)}px)`,
      margin: '0 auto',
    },
    line: {
      borderColor: '#C4C4C4',
    },
  }),
)(StepConnector);

type FormStep = {
  title: string;
  icon: React.ComponentType<IconProps>;
};

type Props = {
  activeStep: number;
  steps: FormStep[];
};

export const MultiStepper = React.memo(({ activeStep, steps }: Props) => {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<StepperConnector />}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            StepIconComponent={StepIcon}
            StepIconProps={{ icon: step.icon, active: index === activeStep }}
          >
            {step.title}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
});
