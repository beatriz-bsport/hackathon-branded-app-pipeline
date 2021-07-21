import React from 'react';
import lodash from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import FormField, {
  FormFieldEnumOrdering,
  FormFieldWrapper,
} from './CustomSignUpFormField.component';
import { MaterialStyleType } from '../../../utils/types';
import type { SignUpFormConfig } from '../types';
import { mapFormDataWithObject } from '../../../pages/form.utils';

interface SignUpDataRequest {
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  phone?: string;
  birthday?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  photo?: string;
  emergency_contact?: string;
  accept_email: boolean;
  accept_sms: boolean;
  general_terms_and_conditions_accepted: boolean;
  waiver: boolean;
  password?: string;
  passwordConfirm?: string;
}

interface SignUpFormDataItemString {
  value: string;
  error: boolean;
}
interface SignUpFormDataItemBoolean {
  value: boolean;
  error: boolean;
}
interface SignUpFormDataItemArray {
  value: boolean;
  error_fields: Array<string>;
}

interface SignUpFormData {
  first_name: SignUpFormDataItemString;
  last_name: SignUpFormDataItemString;
  email: SignUpFormDataItemString;
  gender?: SignUpFormDataItemString;
  phone?: SignUpFormDataItemString;
  birthday?: SignUpFormDataItemString;
  address_line_1?: SignUpFormDataItemString;
  address_line_2?: SignUpFormDataItemString;
  city?: SignUpFormDataItemString;
  zipcode?: SignUpFormDataItemString;
  country?: SignUpFormDataItemString;
  photo?: SignUpFormDataItemString;
  emergency_contact?: SignUpFormDataItemString;
  accept_email: SignUpFormDataItemBoolean;
  accept_sms: SignUpFormDataItemBoolean;
  general_terms_and_conditions_accepted: SignUpFormDataItemBoolean;
  waiver: SignUpFormDataItemBoolean;
  password?: SignUpFormDataItemString;
  passwordConfirm?: SignUpFormDataItemString;
  enableRegistration: SignUpFormDataItemArray;
}

type OwnProps = {
  loading: boolean;
  onComplete: (data: SignUpDataRequest, formData: FormData) => void;
  onFormFieldChange: (id: string) => void;
  signUpConfig: SignUpFormConfig;
  signUpConfigDict: any;
  checkEmailExistsLoading: boolean;
  waiver: string;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type ProcessingState = {
  processing: boolean;
};

type State = SignUpFormData & ProcessingState;

const CustomSignUpFormMap = {
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  gender: 'gender',
  phone: 'phone',
  birthday: 'birthday',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  city: 'city',
  zipcode: 'zipcode',
  country: 'country',
  photo: 'photo',
  emergency_contact: 'emergency_contact',
  accept_email: 'accept_email',
  accept_sms: 'accept_sms',
  general_terms_and_conditions_accepted:
    'general_terms_and_conditions_accepted',
  waiver: 'waiver',
  password: 'password',
};
class CustomSignUpFormFieldsRoot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      first_name: { value: '', error: false },
      last_name: { value: '', error: false },
      email: { value: '', error: false },
      gender: { value: '', error: false },
      phone: { value: '', error: false },
      birthday: {
        value: moment().add(-30, 'years').format('YYYY-MM-DD'),
        error: false,
      },
      address_line_1: { value: '', error: false },
      address_line_2: { value: '', error: false },
      city: { value: '', error: false },
      zipcode: { value: '', error: false },
      country: { value: '', error: false },
      photo: { value: '', error: false },
      emergency_contact: { value: '', error: false },
      accept_email: { value: true, error: false },
      accept_sms: { value: true, error: false },
      general_terms_and_conditions_accepted: { value: false, error: false },
      waiver: { value: false, error: false },
      password: { value: '', error: false },
      passwordConfirm: { value: '', error: false },
      enableRegistration: { value: true, error_fields: [] },
      processing: false,
    };
  }

  submitInfo = (event: any) => {
    event.preventDefault();
    this.setState({ processing: true });
    const {
      first_name,
      last_name,
      email,
      gender,
      phone,
      birthday,
      address_line_1,
      address_line_2,
      city,
      zipcode,
      country,
      photo,
      emergency_contact,
      accept_email,
      accept_sms,
      general_terms_and_conditions_accepted,
      waiver,
      password,
      passwordConfirm,
    } = this.state;
    if (password.value === passwordConfirm.value) {
      const data: SignUpDataRequest = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        gender: gender.value,
        phone: phone.value,
        birthday: birthday.value,
        address_line_1: address_line_1.value,
        address_line_2: address_line_2.value,
        city: city.value,
        zipcode: zipcode.value,
        country: country.value,
        photo: photo.value,
        emergency_contact: emergency_contact.value,
        accept_email: accept_email.value,
        accept_sms: accept_sms.value,
        general_terms_and_conditions_accepted:
          general_terms_and_conditions_accepted.value,
        waiver: waiver.value,
        password: password.value,
      };
      if (photo.value && typeof photo.value !== 'string') {
        data.photo = photo.value;
      }
      const formData = mapFormDataWithObject(data, CustomSignUpFormMap, [
        'photo',
      ]);
      this.props.onComplete(formData, {
        onSuccess: () => this.setState({ processing: false }),
        onError: () => this.setState({ processing: false }),
      });
    }
  };

  globalError = () => {
    const buff = this.state;
    const globalError = lodash.reduce(
      Object.entries(buff),
      (acc: any, [key, field]) => {
        if (key === 'password') {
          if ((this.state.password.value || '').length < 6) {
            acc.error_fields.push(key);
            return { ...acc, value: true };
          }
        }
        if (key === 'passwordConfirm') {
          const passwordConfirmationOk =
            field.value === this.state.password.value;
          if (!passwordConfirmationOk && !!this.state.passwordConfirm.value) {
            acc.error_fields.push(key);
            return { ...acc, value: true };
          }
        }
        return acc;
      },
      { value: false, error_fields: [] },
    );
    this.setState({ enableRegistration: globalError, processing: false });
  };

  onFormFieldChange = (id: keyof SignUpFormData) => (
    value: string | boolean,
    error: boolean,
  ) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        [id]: { value, error },
      }),
      () => this.globalError(),
    );
  };

  render() {
    const { classes, t, signUpConfigDict } = this.props;
    if (!this.props.signUpConfigDict) return null;
    return (
      <form onSubmit={this.submitInfo}>
        <Grid container direction="row">
          {FormFieldEnumOrdering.map((field) => {
            if (signUpConfigDict.poll_fields[field].show_on_creation) {
              return FormFieldWrapper(
                signUpConfigDict.poll_fields[field].field_identifier,
                <FormField
                  id={`${signUpConfigDict.poll_fields[field].field_identifier}`}
                  identifier={`${signUpConfigDict.poll_fields[field].field_identifier}`}
                  label={`${
                    signUpConfigDict.poll_fields[field].label ||
                    t(
                      `form.signup.fields.${signUpConfigDict.poll_fields[field].field_identifier}`,
                    )
                  }`}
                  onChange={this.onFormFieldChange}
                  required={
                    signUpConfigDict.poll_fields[field].is_always_required ||
                    signUpConfigDict.poll_fields[field].mandatory_on_creation
                  }
                  value={
                    this.state[
                      signUpConfigDict.poll_fields[field].field_identifier
                    ].value
                  }
                  helperTextError={this.state.enableRegistration.error_fields}
                  waiver={this.props.waiver}
                />,
              );
            }
            return null;
          })}
        </Grid>
        <div className={classes.actions}>
          <Button
            color="secondary"
            className={classes.bottomButton}
            onClick={this.props.onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className={classes.bottomButton}
            disabled={
              this.state.enableRegistration.value || this.state.processing
            }
            color="primary"
            variant="contained"
            type="submit"
            id="btn-singup"
          >
            {t('form.signup.signupButton')}
          </Button>
        </div>
      </form>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  actions: {
    '& > *': {
      marginLeft: theme.spacing(2),
    },
    textAlign: 'right',
    marginTop: theme.spacing(2),
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
});

export default withStyles(styles)(
  withTranslation()(CustomSignUpFormFieldsRoot),
);
