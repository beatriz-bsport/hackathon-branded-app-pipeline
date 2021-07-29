// @flow
import React, { Component } from 'react';
import { Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithTranslation, withTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import GenderInput from '../../../components/input/GenderInput.component';
import { browserCountryCode, Moment } from '../../../i18n';
import { MaterialStyleType } from '../../../utils/types';
import Avatar from '../../../components/Avatar.component';
import AcceptTermsAndConditions from '../../payment/components/AcceptTermsAndConditions.component';

type OwnProps = {
  id: string;
  value: Object;
  onChange: () => void;
  required: boolean;
  type: string;
  label: string;
  helperTextError: Array<string>;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  value: string | boolean;
  error: boolean;
  showpassword: boolean;
  previewUrl: string;
};

// prettier-ignore
// eslint-disable-next-line no-useless-escape
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');
export const FormFieldEnumOrdering: Array<string> = [
  'first_name',
  'last_name',
  'email',
  'password',
  'passwordConfirm',
  'gender',
  'birthday',
  'address_line_1',
  'address_line_2',
  'city',
  'zipcode',
  'country',
  'phone',
  'emergency_contact',
  'photo',
  'general_terms_and_conditions_accepted',
  'waiver',
  'accept_email',
  'accept_sms',
];
export const FormFieldWrapper = (identifier: string, children: any) => {
  switch (identifier) {
    case 'first_name':
    case 'last_name':
    case 'password':
    case 'passwordConfirm':
    case 'emergency_contact':
      return (
        <Grid item xs={12} md={6}>
          <div style={{ marginRight: 10 }}>{children}</div>
        </Grid>
      );
    case 'email':
    case 'gender':
      return (
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <div style={{ marginRight: 10 }}>{children}</div>
          </Grid>
        </Grid>
      );
    case 'birthday':
      return (
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: 10,
            }}
          >
            {children}
          </Grid>
        </Grid>
      );
    case 'phone':
      return (
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            md={6}
            style={{
              marginTop: 20,
            }}
          >
            {children}
          </Grid>
        </Grid>
      );
    case 'country':
    case 'zipcode':
    case 'city':
      return (
        <Grid item xs={6} md={4}>
          <div style={{ marginRight: 10 }}>{children}</div>
        </Grid>
      );
    case 'general_terms_and_conditions_accepted':
    case 'waiver':
    case 'accept_email':
    case 'accept_sms':
    case 'photo':
      return (
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'flex-start', margin: 0 }}
          >
            {children}
          </Grid>
        </Grid>
      );
    default:
      return (
        <Grid item xs={12} md={6}>
          <div style={{ marginRight: 10 }}>{children}</div>
        </Grid>
      );
  }
};
export class FormField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.value) {
      this.state = {
        value: props.value,
        error: false,
        showpassword: false,
        previewUrl: '',
      };
    } else {
      this.state = {
        error: false,
        value: null,
        showpassword: false,
        previewUrl: '',
      };
    }
  }

  handleDateChange = (date: Object) => {
    this.setState({ selectedDate: date });
    this.handleChange({ target: { value: Moment(date).format('YYYY-MM-DD') } });
  };

  validator = (value: string | boolean) => {
    /*
     * Return true if error in input
     */
    const { id, required } = this.props;
    if (required && !value) {
      return true;
    }
    switch (id) {
      case 'email':
        if (value) {
          return !emailRegexp.test(value);
        }
        return true;

      case 'birthday':
        return parseInt(value, 10) > 2020 || parseInt(value, 10) < 1900;
      case 'accept_sms':
      case 'emai_notification':
      case 'general_terms_and_conditions_accepted':
      case 'waiver':
        return !required ? this.state.value : false;
      case 'password':
        return value.length < 6;
      default:
        return false;
    }
  };

  helperTextErrorCheck = () => {
    const { id, t, helperTextError } = this.props;
    if (helperTextError) {
      switch (id) {
        case 'password':
          // eslint-disable-next-line no-case-declarations
          const check = helperTextError.find((helper) => helper === 'password');
          return check ? t(`form.signup.error.${id}`) : null;
        case 'passwordConfirm':
          // eslint-disable-next-line no-case-declarations
          const check_ = helperTextError.find(
            (helper) => helper === 'passwordConfirm',
          );
          return check_ ? t(`form.signup.error.${id}`) : null;

        case 'photo':
          // eslint-disable-next-line no-case-declarations
          const photo_check_ = helperTextError.find(
            (helper) => helper === 'photo',
          );
          return photo_check_ ? t(`form.signup.error.${id}`) : null;
        default:
          return '';
      }
    }
    return '';
  };

  formatInput = (input: string | boolean) => {
    const { id } = this.props;
    switch (id) {
      case 'phone':
        return input.replace(/[^0-9+]/g, '');
      case 'accept_sms':
      case 'accept_email':
      case 'general_terms_and_conditions_accepted':
      case 'waiver':
        return !this.state.value;
      default:
        return input;
    }
  };

  handlePhoneChange = (phone: string) => {
    if (!phone) {
      return;
    }
    const { id } = this.props;
    const formattedInput = this.formatInput(phone);
    const error = this.validator(formattedInput);
    this.props.onChange(id)(formattedInput, error);
  };

  handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const { id } = this.props;
    if (
      id ===
      ('accept_sms' ||
        'general_terms_and_conditions_accepted' ||
        'accept_email' ||
        'waiver')
    ) {
      this.setState((prevState) => ({ value: !prevState.value }));
    }
    if (id === 'photo') {
      const { files } = event.target;
      this.setState({
        previewUrl: (window.URL || window.webkitURL).createObjectURL(files[0]),
      });
    }

    const formattedInput = this.formatInput(
      // eslint-disable-next-line
      id === 'photo'
        ? event.target.files[0]
        : id === 'waiver' ||
          (id === 'general_terms_and_conditions_accepted' &&
            this.props.generalTermsAndConditions)
        ? event
        : event.target.value,
    );
    const error = this.validator(formattedInput);
    this.setState({
      value: formattedInput,
      error,
    });
    this.props.onChange(id)(formattedInput, error);
  };

  render() {
    const {
      id,
      required,
      type,
      label,
      multiline,
      fullWidth,
      t,
      classes,
      waiver,
    } = this.props;
    const { value, error, showpassword } = this.state;
    const InputProps = (fieldidentifier: string) => {
      if (
        fieldidentifier === 'password' ||
        fieldidentifier === 'passwordConfirm'
      ) {
        return {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={`toggle ${fieldidentifier}visibility`}
                onClick={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    showpassword: !prevState.showpassword,
                  }))
                }
                onMouseDown={(event) => event.preventDefault()}
              >
                {showpassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        };
      }
      return {};
    };
    switch (id) {
      case 'email':
      case 'last_name':
      case 'first_name':
      case 'city':
      case 'zipcode':
      case 'country':
      case 'emergency_contact':
      case 'address_line_1':
      case 'address_line_2':
        return (
          <TextField
            className={classes.textInput}
            required={required}
            value={value}
            shrink={!!value}
            id={id}
            label={label}
            onChange={this.handleChange}
            error={error}
            multiline={multiline}
            fullWidth={fullWidth}
            InputProps={InputProps(id)}
            type={type}
          />
        );
      case 'gender':
        return (
          <GenderInput
            value={value}
            onChange={this.handleChange}
            required={required}
            error={required && !value}
            fullWidth
          />
        );
      case 'phone':
        return (
          <FormControl fullWidth>
            <InputLabel shrink htmlFor="phone-helper">
              {t('form.signup.typePhone')}
            </InputLabel>
            <PhoneInput
              fullWidth
              country={browserCountryCode()}
              autoComplete="tel"
              name="phonenumber"
              value={value}
              selectCountryComponent={Select}
              required={required}
              className={classes.phoneInput}
              onChange={(phone: string) => this.handlePhoneChange(phone)}
            />
          </FormControl>
        );
      case 'birthday':
        return (
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={Moment}
            locale={Moment.locale()}
          >
            <DatePicker
              format="L"
              keyboard
              value={Moment(value)}
              label={label}
              onChange={this.handleDateChange}
            />
          </MuiPickersUtilsProvider>
        );
      case 'password':
        return (
          <TextField
            className={classes.textInput}
            required
            value={value}
            id={id}
            label={label}
            onChange={this.handleChange}
            error={error || !!this.helperTextErrorCheck()}
            multiline={multiline}
            fullWidth={fullWidth}
            type={showpassword ? 'text' : 'password'}
            InputProps={InputProps(id)}
            helperText={this.helperTextErrorCheck()}
          />
        );
      case 'passwordConfirm':
        return (
          <TextField
            className={classes.textInput}
            required={required}
            value={value}
            id={id}
            label={label}
            onChange={this.handleChange}
            error={error || !!this.helperTextErrorCheck()}
            multiline={multiline}
            fullWidth={fullWidth}
            type={showpassword ? 'text' : 'password'}
            InputProps={InputProps(id)}
            helperText={this.helperTextErrorCheck()}
          />
        );
      case 'general_terms_and_conditions_accepted':
        return this.props.generalTermsAndConditions ? (
          <AcceptTermsAndConditions
            accepted={value}
            required
            onChecked={this.handleChange}
            termsAndConditions={this.props.generalTermsAndConditions}
            type="generalTermsOfUse"
          />
        ) : (
          <FormControlLabel
            control={
              <Checkbox required checked={value} onClick={this.handleChange} />
            }
            label={
              <Typography align="left" variant="caption">
                <a
                  href="https://www.notion.so/RGPD-4b8e6a8a215a418a95f91197efd94847"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              </Typography>
            }
          />
        );
      case 'accept_email':
      case 'accept_sms':
        return (
          <FormControlLabel
            control={<Checkbox checked={value} onClick={this.handleChange} />}
            label={
              <FormLabel className={classes.labelRoot} component="legend">
                {label}
              </FormLabel>
            }
          />
        );
      case 'waiver':
        return (
          <>
            {this.props.waiver && (
              <AcceptTermsAndConditions
                accepted={value}
                required={required}
                onChecked={this.handleChange}
                termsAndConditions={waiver}
                type="waiver"
              />
            )}
          </>
        );
      case 'photo':
        return (
          <div className={classes.pictureSection}>
            <input
              accept="image/*"
              className={classes.input}
              id="profile-picture-loader-button"
              onChange={this.handleChange}
              type="file"
            />
            <label
              htmlFor="profile-picture-loader-button"
              style={{ cursor: 'pointer' }}
            >
              <div className={classes.pictureInputcontainer}>
                <div style={{ marginLeft: 0, marginRight: 10 }}>
                  <Avatar
                    user={{
                      photo: getUrl(this.state.previewUrl, this.props.value),
                    }}
                    noname
                  />
                </div>
                <div className={classes.pictureLabel}>
                  <div className={classes.buttonAndErrorContainer}>
                    <div className={classes.buttonContainer}>
                      <div className={classes.button}>
                        <PhotoCameraIcon color="secondary" />
                        {required
                          ? t(
                              'form.signup.addProfilePictureRequired',
                            ).toUpperCase()
                          : t('form.signup.addProfilePicture').toUpperCase()}
                      </div>
                    </div>
                    <div>
                      {this.helperTextErrorCheck() && (
                        <Typography variant="caption" color="error">
                          {t('form.signup.addProfilePictureRequiredLabel')}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        );
      default:
        return null;
    }
  }
}

const defaultAvatar = require('./avatar-circle-blue.png');

function getUrl(previewUrl, value) {
  return previewUrl || (typeof value === 'string' ? value : defaultAvatar);
}
FormField.defaultProps = {
  fullWidth: true,
};
const styles = (theme: Theme) => ({
  textInput: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing(1),
  },
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing(1),
  },
  phoneInput: {
    marginTop: 18,
  },
  labelRoot: {
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    textAlign: 'left',
  },
  pictureSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: theme.spacing(2),
  },
  pictureInputcontainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  pictureLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  buttonContainer: {
    border: `solid 1px`,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    borderRadius: 5,
  },
  buttonAndErrorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5px',
  },
});
export default withTranslation()(withStyles(styles)(FormField));
