// @flow
import React, { Component } from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  TextField,
  Select,
  Grid,
  Button,
  Typography,
  InputLabel,
  withStyles,
} from '@material-ui/core';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { EmailInput, GenderInput } from '../input';
import AddressForm from './AddressForm.component';

import type { ConsumerAddress } from '../../api/types';

const STEP_GENERAL_INFORMATION = 0;
const STEP_REQUEST_ADDRESS = 1;

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
  passwordEqual: boolean,
  accept_sms: boolean,
  accept_email: boolean,
  acceptPrivacyPolicy: boolean,
  gender: string,
  step: number,
};
export class SignUpForm extends Component<Props, State> {
  state = {
    step: STEP_GENERAL_INFORMATION,
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

  goToAddressForm = (event: Object) => {
    event.preventDefault();
    if (!this.state.acceptPrivacyPolicy) {
      alert(this.props.t('form.signup.pleaseAcceptPrivacyPolicy'));
      return;
    }
    this.setState({ step: STEP_REQUEST_ADDRESS });
  };

  submitInfo = () => {
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

  isPasswordConform = (password: string) => {
    return password.length > 7;
  };

  onFormFieldChange = (id: string) => (event: Object) => {
    const { value } = event.target;
    // eslint-disable-next-line
    this.setState((prevState) => ({
      [id]: value,
    }));
  };

  onPasswordChange = (event: Object) => {
    const password = event.target.value;
    const passwordIsConform = this.isPasswordConform(password);
    this.setState((prevState) => ({
      password,
      passwordEqual: password === prevState.passwordConfirm,
      passwordIsConform,
    }));
  };

  onPasswordConfirmChange = (event: Object) => {
    const passwordConfirm = event.target.value;
    this.setState((prevState) => ({
      passwordConfirm,
      passwordEqual: passwordConfirm === prevState.password,
    }));
  };

  toogleSMS = (event: Object) => {
    this.setState({ accept_sms: event.target.checked });
  };

  toogleEmail = (event: Object) => {
    this.setState({ accept_email: event.target.checked });
  };

  handleGender = (event: Object) => {
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

  receiveAddress = (data: ConsumerAddress) => {
    const {
      email,
      password,
      passwordConfirm,
      first_name,
      last_name,
      phone,
      accept_sms,
      accept_email,
      gender,
    } = this.state;
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
        address: data,
      });
    }
  };

  render() {
    const { classes, t } = this.props;
    const { passwordEqual, password, passwordConfirm, step } = this.state;
    if (step === STEP_REQUEST_ADDRESS) {
      return (
        <AddressForm
          onCancel={() => this.setState({ step: STEP_GENERAL_INFORMATION })}
          autoComplete
          onSkip={this.submitInfo}
          onSubmit={this.receiveAddress}
          submitText={t('form.signup.signupButton')}
        />
      );
    }
    return (
      <form onSubmit={this.goToAddressForm} className={classes.container}>
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              autoComplete="first name"
              value={this.state.first_name}
              label={t('common.firstname')}
              onChange={this.onFormFieldChange('first_name')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              autoComplete="last name"
              value={this.state.last_name}
              label={t('common.lastname')}
              onChange={this.onFormFieldChange('last_name')}
            />
          </Grid>
          <Grid item xs={12}>
            <GenderInput
              fullWidth
              value={this.state.gender}
              onChange={this.handleGender}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <EmailInput
              fullWidth
              required
              type="email"
              autoComplete="email"
              value={this.state.email}
              label={t('common.email')}
              onChange={this.onFormFieldChange('email')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="phone-helper">
                {t('form.signup.typePhone')}
              </InputLabel>
              <PhoneInput
                fullWidth
                country="FR"
                autoComplete="tel"
                value={this.state.phone}
                selectCountryComponent={Select}
                required
                className={classes.phoneInput}
                onChange={(phone) => this.setState({ phone })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              fullWidth
              required
              value={password}
              error={!this.state.passwordIsConform}
              onChange={this.onPasswordChange}
              placeholder={t('form.password')}
              label={t('form.password')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              fullWidth
              required
              value={passwordConfirm}
              error={!passwordEqual}
              onChange={this.onPasswordConfirmChange}
              placeholder={t('form.signup.confirmPassword')}
              label={t('form.signup.confirmPasswordLabel')}
            />
          </Grid>
          <Grid item xs={12}>
            {this.renderRGPD()}
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12} className={classes.actions}>
            <Button color="secondary" onClick={this.props.onCancel}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!this.state.acceptPrivacyPolicy}
            >
              {t('form.signup.signupButton')}
            </Button>
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
  actions: {
    textAlign: 'right',
  },
  phoneInput: { marginTop: 18 },
});

export default translate()(withStyles(styles)(SignUpForm));
