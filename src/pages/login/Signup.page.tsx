// @flow

import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form';

import type { Dispatch, OptionCallback } from '../../state/types';
import themeSelectors from '#libs/theme/selectors';
import { parseQueryString } from '../../http';
import { requestLogin } from '../../actions/auth.actions';

import { fetchCompanyTheme } from '#libs/theme/actions';
import Analytics from '#components/analytics/Analytics.component';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#libs/custom-form/actions';
import CustomFormView from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import { getSignUpCustomFormWithEnabledField } from '#libs/custom-form/selectors';
import type { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import {
  CustomFormFilled,
  CustomFormFieldAnswer,
} from '#libs/custom-form/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { CustomFormTitle } from '#libs/custom-form/components/CustomFormTitle.component';

type OwnProps = {
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
  membership: string;
  // franchisor: string;
  goBackToLogin: (id: string | null) => void;
  doEmailLogin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof properMapDispatchToProps;

type Props = OwnProps &
  StateHandlerType &
  ConnectedProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class SignupPage extends Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.fetchCompanyCustomSignUp({
        company: parseInt(this.props.membership),
      });
    }
  }

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(
      formdata,
      this.props?.membership || null,
      {
        onSuccess: () => {
          this.props.doEmailLogin(this.props.loginInformations);
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => options?.onError,
      },
    );
  };

  handleCancel = () => {
    // if (this.props.franchisor) {
    //   this.props.goBackToFranchisePage(this.props.franchisor);
    // } else {
    this.props.goBackToLogin(this.props.membership);
    // }
  };

  render() {
    const {
      authenticated,
      classes,
      t,
      membership,
      signUpCustomForm,
      theme,
      location,
    } = this.props;

    if (authenticated) {
      const { next } = parseQueryString(location.search);
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }

    return (
      <div className={classes.container}>
        <CustomFormTitle title={t('signup.title')} company={!!membership} />
        {signUpCustomForm && (
          <div className={classes.customForm}>
            <CustomFormView
              initial={signUpCustomForm}
              onSubmit={this.submitCustomForm}
              onSubmitDraft={this.props.setLoginInformations}
              layouts={signUpCustomForm.layout}
              waiver={theme.waiver}
              general_terms_and_conditions={theme.general_terms_of_use}
              onCancel={this.handleCancel}
            />
          </div>
        )}

        {!!theme && membership && <Analytics username="" theme={theme} />}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch, props: OwnProps) {
  const search = ((props && props.location) || {}).search || '';
  const opts = {
    goNext: ({ is_franchisor }: { is_franchisor: boolean }) =>
      !is_franchisor ? push(parseQueryString(search).next) : null,
    company: parseQueryString(search).membership,
  };
  return {
    doEmailLogin({ email, password }: { email: string; password: string }) {
      dispatch(requestLogin(email, password, opts));
    },
  };
}

const properMapDispatchToProps = {
  submitSignUpCustomForm,
  fetchCompanyTheme,
  fetchCompanyCustomSignUp,
  goBackToLogin: (membership: string | null) =>
    membership ? push(`/login?membership=${membership}`) : push(`/login`),
  goBackToFranchisePage: (franchisor: string | null) =>
    franchisor ? push(`/login?franchisor=${franchisor}`) : push(`/login`),
};
const mapStateToProps = (
  state: RootState,
  { membership }: { membership: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  authenticated: state.auth.authenticated,
  signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
});
const withStateHandlersInit = {
  loginInformations: { email: '', password: '' },
};

const withStateHandlersSetter = {
  setLoginInformations: () => (customFormAnswers: CustomFormFilled) => {
    const email =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
      )?.answer || '';

    const password =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
      )?.answer || '';
    return { loginInformations: { email, password } };
  },
};
const styles = (theme: Theme): any => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(1),
    width: '100%',
    overflow: 'auto',
    height: WidgetUtils.isWidget() ? '100%' : '92vh',
    marginTop: WidgetUtils.isWidget() ? 0 : '8vh',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
    },
  },
  customForm: {
    marginBottom: theme.spacing(14),
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

export default compose(
  withRouter,
  withStyles(styles),
  withTranslation(['login']),
  withProps((props: OwnProps) => ({
    membership: parseQueryString(props.location.search).membership,
    franchisor: parseQueryString(props.location.search).franchisor,
    goNext: parseQueryString(props.location.search).next,
  })),
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(SignupPage);
