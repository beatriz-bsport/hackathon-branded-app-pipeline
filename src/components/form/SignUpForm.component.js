// @flow
import React, { Component } from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  TextField,
  Grid,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EmailInput, GenderInput } from '../input';

type Props = {
  onComplete: (Object) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
};

type State = {
  email: string,
  first_name: string,
  last_name: string,
  phone: string,
  password: string,
  passwordConfirm: string,
  gender: string,
  passwordIsConform: boolean,
  accept_sms: boolean,
  accept_email: boolean,
  acceptPrivacyPolicy: boolean,
};
export class SignUpForm extends Component<Props, State> {
  state = {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    passwordIsConform: true,
    passwordEqual: true,
    accept_email: true,
    accept_sms: true,
    acceptPrivacyPolicy: false,
    gender: 'F',
  };

  submitInfo = (event: Object) => {
    event.preventDefault();
    const {
      email,
      password,
      passwordConfirm,
      first_name,
      last_name,
      phone,
      accept_sms,
      accept_email,
      acceptPrivacyPolicy,
      gender,
    } = this.state;
    const { t } = this.props;
    if (!acceptPrivacyPolicy) {
      alert(t('form.signup.pleaseAcceptPrivacyPolicy'));
      return;
    }
    if (password === passwordConfirm) {
      this.props.onComplete({
        email,
        password,
        first_name,
        last_name,
        phone,
        accept_sms,
        accept_email,
        username: email,
        gender,
      });
    }
  };

  isPasswordConform = (password) => {
    return password.length > 7;
  };

  onFormFieldChange = (id: string) => (event: Object) => {
    const { value } = event.target;
    // eslint-disable-next-line
    this.setState((prevState) => ({
      [id]: value,
    }));
  };

  onPasswordChange = (event) => {
    const password = event.target.value;
    const passwordIsConform = this.isPasswordConform(password);
    this.setState((prevState) => ({
      password,
      passwordEqual: password === prevState.passwordConfirm,
      passwordIsConform,
    }));
  };

  onPasswordConfirmChange = (event) => {
    const passwordConfirm = event.target.value;
    this.setState((prevState) => ({
      passwordConfirm,
      passwordEqual: passwordConfirm === prevState.password,
    }));
  };

  toogleSMS = (event) => {
    this.setState({ accept_sms: event.target.checked });
  };

  toogleEmail = (event) => {
    this.setState({ accept_email: event.target.checked });
  };

  handleGender = (event) => {
    this.setState({ gender: event.target.value });
  };

  renderRGPD = () => {
    const { classes, t } = this.props;
    return (
      <FormControl component="fieldset" className={classes.rgpdControl}>
        <FormLabel component="legend">{t('form.signup.rgpdTitle')}</FormLabel>
        <FormGroup aria-label="Communication" name="communication">
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.accept_email}
                onChange={this.toogleEmail}
              />
            }
            label={t('form.signup.communication.email')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.accept_sms}
                onChange={this.toogleSMS}
              />
            }
            label={t('form.signup.communication.sms')}
          />
        </FormGroup>
      </FormControl>
    );
  };

  render() {
    const { classes, t } = this.props;
    const { passwordEqual, password, passwordConfirm } = this.state;
    return (
      <form onSubmit={this.submitInfo} className={classes.container}>
        <Grid container direction="column" spacing={16} alignItems="flex-start">
          <Grid item>
            <Grid
              container
              direction="row"
              spacing={16}
              alignItems="flex-start"
            >
              <Grid item>
                <TextField
                  required
                  autoComplete="first name"
                  value={this.state.first_name}
                  label={t('common.firstname')}
                  onChange={this.onFormFieldChange('first_name')}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  autoComplete="last name"
                  value={this.state.last_name}
                  label={t('common.lastname')}
                  onChange={this.onFormFieldChange('last_name')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <GenderInput
              value={this.state.gender}
              onChange={this.handleGender}
              required
            />
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={16} alignItems="flex-end">
              <Grid item>
                <EmailInput
                  required
                  type="email"
                  autoComplete="email"
                  value={this.state.email}
                  label={t('common.email')}
                  onChange={this.onFormFieldChange('email')}
                />
              </Grid>
              <Grid item>
                <PhoneInput
                  country="FR"
                  autoComplete="tel"
                  placeholder={t('form.signup.typePhone')}
                  value={this.state.phone}
                  required
                  onChange={(phone) => this.setState({ phone })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={16} alignItems="flex-end">
              <Grid item>
                <TextField
                  type="password"
                  required
                  value={password}
                  error={!this.state.passwordIsConform}
                  onChange={this.onPasswordChange}
                  placeholder={t('form.password')}
                  label={t('form.password')}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  required
                  value={passwordConfirm}
                  error={!passwordEqual}
                  onChange={this.onPasswordConfirmChange}
                  placeholder={t('form.signup.confirmPassword')}
                  label={t('form.signup.confirmPasswordLabel')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{this.renderRGPD()}</Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="flex-start"
            >
              <Grid item>
                <FormGroup aria-label="privacy-policy" name="privacy-policy">
                  <FormControlLabel
                    label={
                      <Typography>
                        {t('form.signup.iAcceptPrivacyPolicy')}
                        <a href="https://bsport.io/blog/privacy_policy">
                          {t('form.signup.privacyPolicy').toLowerCase()}
                        </a>
                        {'.'}
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={this.state.acceptPrivacyPolicy}
                        onChange={(event) =>
                          this.setState({
                            acceptPrivacyPolicy: event.target.checked,
                          })
                        }
                      />
                    }
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              item
              direction="row"
              justify="flex-end"
              alignItems="flex-end"
              spacing={16}
            >
              <Button color="secondary" onClick={this.props.onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {t('form.signup.signupButton')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {},
  rgpdControl: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default translate()(withStyles(styles)(SignUpForm));
