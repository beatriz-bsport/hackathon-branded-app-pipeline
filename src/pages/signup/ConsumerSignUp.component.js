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
};

const STEPS = {
  REQUEST_INFO: 0,
  REQUEST_SMS_CODE_CONFIRMATION: 1,
};

export class ConsumerSignUp extends Component<Props> {
  state = {
    step: STEPS.REQUEST_INFO,
  };

  onChange = (phone) => {
    this.setState({ phone });
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  onFormComplete = async (data) => {
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

  validateSMSCode = (code) => {
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
    const { t, authenticated } = this.props;
    if (authenticated) {
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
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConsumerSignUp),
);
