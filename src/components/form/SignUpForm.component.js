// @flow
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ButtonBase from '@material-ui/core/ButtonBase';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { GenderInput } from '../input';
import AddressForm from './AddressForm.component';
import DelayedTextField from '../DelayedTextField.component';

import type { ConsumerAddress } from '../../api/types';

const STEP_GENERAL_INFORMATION = 0;
const STEP_REQUEST_ADDRESS = 1;

type Props = {
  onComplete: (Object) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
  backToLogin: () => void,
  emailExists: boolean,
  theme: Object,
  checkEmailExists: (email: string) => void,
  checkEmailExistsLoading: boolean,
};

type State = {
  email: string,
  first_name: string,
  last_name: string,
  phone: string,
  password: string,
  passwordConfirm: string,
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

  handleEmailChange = (ev: SyntheticEvent<HTMLEvent>) => {
    const email = ev.target.value;
    this.props.checkEmailExists(email);
    this.setState({ email });
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
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="first_name"
              autoComplete="first name"
              value={this.state.first_name}
              label={
                this.props.theme && this.props.theme.first_name_label
                  ? this.props.theme.first_name_label
                  : t('common.firstname')
              }
              onChange={this.onFormFieldChange('first_name')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              name="last_name"
              autoComplete="last name"
              value={this.state.last_name}
              label={
                this.props.theme && this.props.theme.last_name_label
                  ? this.props.theme.last_name_label
                  : t('common.lastname')
              }
              onChange={this.onFormFieldChange('last_name')}
            />
          </Grid>
        </Grid>
        <div className={classes.row}>
          <div className={classes.field}>
            <GenderInput
              value={this.state.gender}
              onChange={this.handleGender}
              required
              fullWidth
            />
          </div>
        </div>
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <div className={classes.emailInput}>
              <div className={classes.row}>
                <DelayedTextField
                  fullWidth
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={this.state.email}
                  label={t('common.email')}
                  onChange={this.handleEmailChange}
                />
                {this.props.checkEmailExistsLoading ? (
                  <CircularProgress size={12} />
                ) : null}
              </div>
              {this.props.emailExists ? (
                <ButtonBase onClick={this.props.backToLogin}>
                  <div className={classes.emailExists}>
                    <Typography color="error" align="center">
                      {t('form.signup.emailExistsInDB1')}
                    </Typography>
                    <Typography color="error" align="center">
                      {t('form.signup.emailExistsInDB2')}
                    </Typography>
                  </div>
                </ButtonBase>
              ) : null}
            </div>
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
                name="phonenumber"
                value={this.state.phone}
                selectCountryComponent={Select}
                required
                className={classes.phoneInput}
                onChange={(phone) => this.setState({ phone })}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              fullWidth
              required
              name="password"
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
              name="passwordConfirm"
              value={passwordConfirm}
              error={!passwordEqual}
              onChange={this.onPasswordConfirmChange}
              placeholder={t('form.signup.confirmPassword')}
              label={t('form.signup.confirmPasswordLabel')}
            />
          </Grid>
        </Grid>
        <div className={classes.row}>
          <FormGroup aria-label="privacy-policy" name="acceptPrivacyPolicy">
            <FormControlLabel
              label={
                <Typography align="left" variant="body2">
                  {t('form.signup.iAcceptPrivacyPolicy')}
                  <a
                    href="https://bsport.io/blog/privacy_policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('form.signup.privacyPolicy').toLowerCase()}
                  </a>
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
        </div>
        <div className={classes.actions}>
          <Button color="secondary" onClick={this.props.onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            id="btn-signup-next"
            type="submit"
            color="primary"
            variant="contained"
            disabled={!this.state.acceptPrivacyPolicy || this.props.emailExists}
          >
            {t('form.signup.signupButton')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {},
  rgpdControl: {
    marginTop: theme.spacing(2),
  },
  actions: {
    '& > *': {
      marginLeft: theme.spacing(2),
    },
    textAlign: 'right',
    marginTop: theme.spacing(2),
  },
  phoneInput: { marginTop: 18 },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(1),
  },
  field: {
    width: '45%',
  },
  emailExists: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default withNamespaces()(withStyles(styles)(SignUpForm));
