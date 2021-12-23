// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import CompanyOnboardingWelcomePage from './CompanyOnboardingWelcome.page';
import CompanyOnboardingFormPage from './CompanyOnboardingForm.page';
import EmailValidationPage from './EmailValidation.page';
import ClassicLoginBackground from '#libs/login/components/ClassicLoginBackground.component';

type OwnProps = {
  activeStep: string,
};

const WELCOME = 0;
const FORM = 1;
const VALIDATE_EMAIL = 2;

const getSteps = () => [WELCOME, FORM, VALIDATE_EMAIL];

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
    case 'email_validation': {
      activeStepNumber = 2;
      break;
    }
    default:
      break;
  }
  return (
    <div className={classes.container}>
      <Stepper activeStep={activeStepNumber} alternativeLabel>
        {getSteps().map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Switch>
        <Route
          path="/login/company_onboarding/welcome/"
          component={CompanyOnboardingWelcomePage}
        />
        <Route
          path="/login/company_onboarding/form/"
          component={CompanyOnboardingFormPage}
        />
        <Route
          path="/login/company_onboarding/email_validation/:email"
          component={EmailValidationPage}
        />
      </Switch>
    </div>
  );
};

type ThemeProps = {
  theme: CompanyTheme,
};

type Props = OwnProps & ThemeProps;

export const CompanyOnboardingRouterWithBackground = (props: Props) => {
  return (
    <ClassicLoginBackground theme={props.theme}>
      <CompanyOnboardingRouter {...props} />
    </ClassicLoginBackground>
  );
};

export default compose(routerParamsToProps({ activeStep: 'activeStep' }))(
  CompanyOnboardingRouterWithBackground,
);

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing(6),
    width: '100%',
    marginTop: '10vh',
    maxWidth: 600,
  },
}));
