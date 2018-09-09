// @flow

import React, { Component } from 'react';

import { CircularProgress, Typography, Grid } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  SignUpForm,
  ConsumerModalContainer,
  SMSCodeForm,
} from '../../components';
import api from '../../api';
import { auth as authActions } from '../../actions';

type Props = {
  t: (x: string) => string,
  authenticated: boolean,
  signUpPhone: ({
    phone: string,
    code: string,
    email: string,
    lastname: string,
    firstname: string,
  }) => void,
  updateProfile: ({
    email: string,
    lastname: string,
    firstname: string,
  }) => void,
};

type State = {
  loading: boolean,
  step: number,
  phone: string,
  email: string,
  lastname: string,
  firstname: string,
};

const STEPS = {
  REQUEST_INFO: 0,
  REQUEST_SMS_CODE_CONFIRMATION: 1,
};

export class ConsumerSignUp extends Component<Props, State> {
  state = {
    loading: false,
    step: STEPS.REQUEST_INFO,
    phone: '',
    email: '',
    firstname: '',
    lastname: '',
  };

  onChange = (phone: string) => {
    this.setState({ phone });
  };

  onFormFieldChange = (id: string) => (value: Object, error: boolean) => {
    this.setState({ [id]: value });
  };

  onFormComplete = async (data: {
    phone: string,
    email: string,
    firstname: string,
    lastname: string,
  }) => {
    const { phone, email, firstname, lastname } = data;
    this.setState({ loading: true, email, phone, firstname, lastname });

    const response = await api.auth.requestSMSCode(phone);

    if (response.status === 200) {
      this.setState({
        step: STEPS.REQUEST_SMS_CODE_CONFIRMATION,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  };

  validateSMSCode = (code: string) => {
    const { phone, email, firstname, lastname } = this.state;
    this.props.signUpPhone({ phone, code, email, lastname, firstname });
  };

  getContent = () => {
    const { loading, step } = this.state;
    if (loading) {
      return (
        <Grid container item justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }
    switch (step) {
      case STEPS.REQUEST_INFO:
        return <SignUpForm onComplete={this.onFormComplete} />;
      case STEPS.REQUEST_SMS_CODE_CONFIRMATION:
        return <SMSCodeForm onComplete={this.validateSMSCode} />;
      default:
        return this.getInitialForm();
    }
  };

  render() {
    const { t, authenticated, updateProfile } = this.props;
    if (authenticated) {
      const { email, firstname, lastname } = this.state;
      updateProfile({ email, firstname, lastname });
      return <Redirect to="/" />;
    }
    return (
      <ConsumerModalContainer>
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <Typography variant="title">{t('form.signUpTitle')}</Typography>
          </Grid>
          <Grid item>{this.getContent()}</Grid>
        </Grid>
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signUpPhone({ phone, code, email, firstname, lastname }) {
      dispatch(
        authActions.signUpPhone({ phone, code, email, firstname, lastname }),
      );
    },
    updateProfile({ email, firstname, lastname }) {
      dispatch(authActions.updateProfile({ email, firstname, lastname }));
    },
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConsumerSignUp),
);
