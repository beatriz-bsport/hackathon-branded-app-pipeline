import React, { Component } from 'react';

import { compose } from 'recompose';
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
import { Theme as MaterialTheme } from '@material-ui/core';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { WithTranslation, withTranslation } from 'react-i18next';

import { GenderInput } from '../input';
import AddressForm from './AddressForm.component';
import DelayedTextField from '../DelayedTextField.component';
import AcceptTermsAndConditions from '../../libs/payment/components/AcceptTermsAndConditions.component';

import { ConsumerAddress } from '../../api/types';
import { MaterialStyleType } from '../../utils/types';
import { Theme } from '../../libs/theme/types';
import { browserCountryCode } from '../../i18n';

const STEP_GENERAL_INFORMATION = 0;
const STEP_REQUEST_ADDRESS = 1;

interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  accept_sms: boolean;
  accept_email: boolean;
  username: string;
  gender: string;
  address?: ConsumerAddress;
  accept_waiver?: boolean;
  accept_privacy_policy?: boolean;
}

type OwnProps = {
  onComplete: (data: SignupData) => void;
  onCancel: () => void;
  backToLogin: () => void;
  emailExists: boolean;
  theme: Theme;
  checkEmailExists: (email: string) => void;
  checkEmailExistsLoading: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  accept_sms: boolean;
  accept_email: boolean;
  acceptPrivacyPolicy: boolean;
  acceptWaiver: boolean;
  gender: string;
  address?: ConsumerAddress;
  step: number;
};

export class SignUpForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      step: STEP_GENERAL_INFORMATION,
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      passwordConfirm: '',
      accept_email: true,
      accept_sms: true,
      acceptPrivacyPolicy: false,
      acceptWaiver: !(props.theme && props.theme.waiver),
      gender: 'F',
    };
  }

  goToAddressForm = (event: any) => {
    event.preventDefault();
    if (!this.state.acceptPrivacyPolicy) {
      // eslint-disable-next-line
      alert(this.props.t('form.signup.pleaseAcceptPrivacyPolicy'));
      return;
    }
    this.setState({ step: STEP_REQUEST_ADDRESS });
  };

  submitInfo = (address?: ConsumerAddress) => {
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
      acceptWaiver,
      gender,
    } = this.state;
    const { t } = this.props;
    if (!acceptPrivacyPolicy || !acceptWaiver) {
      // eslint-disable-next-line
      alert(t('form.signup.pleaseAcceptPrivacyPolicy'));
      return;
    }
    if (password === passwordConfirm) {
      const data: SignupData = {
        email,
        password,
        first_name,
        last_name,
        phone,
        accept_sms,
        accept_email,
        username: email,
        gender,
        accept_privacy_policy: acceptPrivacyPolicy,
        accept_waiver: acceptWaiver,
      };

      if (address) {
        data.address = address;
      }

      this.props.onComplete(data);
    }
  };

  onFormFieldChange = (id: string) => (event: any) => {
    const { value } = event.target;
    // @ts-ignore
    this.setState({ [id]: value });
  };

  toggleSMS = (event: any) => {
    this.setState({ accept_sms: event.target.checked });
  };

  toggleEmail = (event: any) => {
    this.setState({ accept_email: event.target.checked });
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
                onChange={this.toggleEmail}
              />
            }
            label={t('form.signup.communication.email')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.accept_sms}
                onChange={this.toggleSMS}
              />
            }
            label={t('form.signup.communication.sms')}
          />
        </FormGroup>
      </FormControl>
    );
  };

  handleEmailChange = (ev: any) => {
    const email = ev.target.value;
    this.props.checkEmailExists(email);
    this.setState({ email });
  };

  renderPrivacyPolicy = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {!this.props.theme || !this.props.theme.general_terms_and_conditions ? (
          <FormControlLabel
            label={
              <Typography align="left" variant="caption">
                {this.props.t('form.signup.iAcceptPrivacyPolicy')}
                <a
                  href="https://www.notion.so/RGPD-4b8e6a8a215a418a95f91197efd94847"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.t('form.signup.privacyPolicy').toLowerCase()}
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
        ) : (
          <AcceptTermsAndConditions
            accepted={this.state.acceptPrivacyPolicy}
            onChecked={(acceptPrivacyPolicy: boolean) =>
              this.setState({ acceptPrivacyPolicy })
            }
            termsAndConditions={this.props.theme.general_terms_of_use}
            type="generalTermsOfUse"
          />
        )}

        {this.props.theme && this.props.theme.waiver && (
          <AcceptTermsAndConditions
            accepted={this.state.acceptWaiver}
            onChecked={(acceptWaiver: boolean) =>
              this.setState({ acceptWaiver })
            }
            termsAndConditions={this.props.theme.waiver}
            type="waiver"
          />
        )}
      </div>
    );
  };

  render() {
    const { classes, t } = this.props;
    const { password, passwordConfirm, step } = this.state;
    if (step === STEP_REQUEST_ADDRESS) {
      return (
        <AddressForm
          onCancel={() => this.setState({ step: STEP_GENERAL_INFORMATION })}
          autoComplete
          onSkip={this.submitInfo}
          onSubmit={this.submitInfo}
          submitText={t('form.signup.signupButton')}
        />
      );
    }

    return (
      <form onSubmit={this.goToAddressForm}>
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
              onChange={this.onFormFieldChange('gender')}
              required
              fullWidth
            />
          </div>
        </div>
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <div>
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
                    <Typography variant="caption" color="error" align="left">
                      {t('form.signup.emailExistsInDB1')}
                    </Typography>
                    <Typography color="primary" align="right">
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
                country={browserCountryCode()}
                autoComplete="tel"
                name="phonenumber"
                value={this.state.phone}
                selectCountryComponent={Select}
                required
                className={classes.phoneInput}
                onChange={(phone: string) => this.setState({ phone })}
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
              error={password.length && password.length < 8}
              onChange={this.onFormFieldChange('password')}
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
              error={passwordConfirm.length && password !== passwordConfirm}
              onChange={this.onFormFieldChange('passwordConfirm')}
              placeholder={t('form.signup.confirmPassword')}
              label={t('form.signup.confirmPasswordLabel')}
            />
          </Grid>
        </Grid>
        <div className={classes.row}>
          <FormGroup aria-label="privacy-policy" name="acceptPrivacyPolicy">
            {this.renderPrivacyPolicy()}
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
            disabled={
              !this.state.acceptPrivacyPolicy ||
              this.props.emailExists ||
              !this.state.acceptWaiver
            }
          >
            {t('form.signup.signupButton')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme: MaterialTheme) => ({
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
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
  },
});

export default compose<any, OwnProps>(
  withTranslation(),
  withStyles(styles),
)(SignUpForm);
