import React, { Component } from 'react';

import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { connect } from 'react-redux';

import SMSCodeForm from './SMSCodeForm.component';
import { auth as authActions } from '../../actions';
import api from '../../api';

const styles = (theme) => ({
  container: {},
});

type Props = {
  t: (x: string) => string,
  classes: Object,
};

const STEPS = { REQUEST_PHONE_NUMBER: 0, REQUEST_PHONE_CODE: 1 };

export class ConsumerSMSLoginForm extends Component<Props> {
  state = {
    phone: null,
    step: STEPS.REQUEST_PHONE_NUMBER,
  };

  onPhoneComplete = async (event) => {
    event.preventDefault();
    const { phone } = this.state;
    const response = await api.auth.requestSMSCodeNoRegistration(phone);
    if (response.status === 200) {
      this.setState({ step: STEPS.REQUEST_PHONE_CODE });
    }
  };

  validateSMSCode = (code) => {
    const { phone } = this.state;
    this.props.signInPhone({ phone, code });
  };

  getContent = () => {
    const { t } = this.props;
    const { step, phone } = this.state;
    switch (step) {
      case STEPS.REQUEST_PHONE_NUMBER:
        return (
          <form onSubmit={this.onPhoneComplete}>
            <Grid container direction="column" spacing={16}>
              <Grid item>
                <Typography>{t('form.signInPhoneInstruction')}</Typography>
              </Grid>
              <Grid item>
                <PhoneInput
                  country="FR"
                  placeholder="Enter phone number"
                  required
                  onChange={(phone) => this.setState({ phone })}
                />
              </Grid>
              <Grid item>
                <Button type="submit">OK</Button>
              </Grid>
            </Grid>
          </form>
        );
      case STEPS.REQUEST_PHONE_CODE:
        return <SMSCodeForm onComplete={this.validateSMSCode} />;
    }
  };

  render() {
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={32}>
        <Grid item>
          <Typography variant="title">{t('form.SMSSignInTitle')}</Typography>
        </Grid>
        <Grid item>{this.getContent()}</Grid>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    requestCode(phone) {
      dispatch(authActions.requestSMSCodeNoRegistration(phone));
    },
    signInPhone({ phone, code }) {
      dispatch(authActions.validatePhone({ phone, code }));
    },
  };
}

export default withStyles(styles)(
  translate()(
    connect(
      null,
      mapDispatchToProps,
    )(ConsumerSMSLoginForm),
  ),
);
