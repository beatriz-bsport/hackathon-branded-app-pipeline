import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import CompanyOnboardingWelcomePage from './CompanyOnboardingWelcome.page';
import CompanyOnboardingFormPage from './CompanyOnboardingForm.page';
import CompanyOnboardingConfirmationPage from './CompanyOnboardingConfirmation.page';

type OwnProps = {
  activeStep: string;
};

const WELCOME = 0;
const FORM = 1;
const CONFIRMATION = 2;

const getSteps = () => [WELCOME, FORM, CONFIRMATION];

export const CompanyOnboardingRouter = (props: OwnProps) => {
  const classes = useStyles();
  let activeStepNumber = 0;
  switch (props.activeStep) {
    case 'welcome': {
      activeStepNumber = 0;
      break;
    }
    case 'form': {
      activeStepNumber = 1;
      break;
    }
    case 'confirmation': {
      activeStepNumber = 2;
      break;
    }
    default:
      break;
  }
  return (
    <div className={classes.container}>
      <Stepper
        alternativeLabel
        activeStep={activeStepNumber}
        style={{ backgroundColor: 'transparent' }}
      >
        {getSteps().map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Switch>
        <Route
          component={CompanyOnboardingWelcomePage}
          path="/login/company_onboarding/welcome/"
        />
        <Route
          component={CompanyOnboardingFormPage}
          path="/login/company_onboarding/form/"
        />
        <Route
          component={CompanyOnboardingConfirmationPage}
          path="/login/company_onboarding/confirmation/"
        />
      </Switch>
    </div>
  );
};

// @ts-expect-error
export default compose(routerParamsToProps({ activeStep: 'activeStep' }))(
  // @ts-expect-error
  CompanyOnboardingRouter,
);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing(6),
    width: '100%',
    maxWidth: 600,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));
