import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ErrorMessage } from 'formik';
import amber from '@material-ui/core/colors/amber';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_GENDER,
  CUSTOM_FORM_FIELD_SIGN_UP_PHONE,
  CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2,
  CUSTOM_FORM_FIELD_SIGN_UP_CITY,
  CUSTOM_FORM_FIELD_SIGN_UP_STATE,
  CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE,
  CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
  CUSTOM_FORM_FIELD_SIGN_UP_OFFICIAL_DOCUMENT_ID,
} from '@bsport/common/lib/master-data/custom-form.js';
import { TermsAndConditionType } from '#src/libs/payment/types';
import { CUSTOM_FORM_FIELD_SIGN_UP_PREFIX } from '#src/libs/custom-form/constants';

import FabriqueTextfield from '#Fabrique/Temporary/Textfield';
import FabriquePasswordField from '#Fabrique/Temporary/PasswordField';
import FabriqueCountrySignUpField from '#Fabrique/Temporary/CountrySignUpField';
import FabriqueSelectfield from '#Fabrique/Temporary/Selectfield';
import FabriqueDateField from '#Fabrique/Temporary/DateField/DateField.component';
import FabriqueAvatarField from '#Fabrique/Temporary/AvatarField';
import FabriqueCheckboxfield from '#Fabrique/Temporary/Checkboxfield/Checkboxfield.component';
import FabriqueAcceptTermsAndConditions from '#Fabrique/Temporary/AcceptTermsAndConditions';
import {
  get_custom_form_sign_question_label,
  generateUniqueCustomFormFieldIdentifier,
} from '../../utils';

import { countries } from '../../../../i18n/utils/countries';
import { MaterialStyleType } from '../../../../utils/types';
import type { CustomFormField, FormikCustomFormFilled } from '../../types';
// @ts-expect-error
import { browserCountryCode } from '../../../../i18n';

import { EnhancedPhoneInput } from '#src/components/form-fields';
import './styles.css';

type OwnProps = {
  field: CustomFormField & { answer: string | number | boolean };
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  handleBlur: (str: string) => void;
  values: FormikCustomFormFilled;
  waiver?: string;
  general_terms_and_conditions: string;
  initial: FormikCustomFormFilled;
  disableLayout: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT =
  get_custom_form_sign_question_label();
export const CustomFormConsumerInput = (props: Props) => {
  const { t, waiver, general_terms_and_conditions } = props;
  const layoutActive =
    props.values.layout &&
    Object.keys(props.values.layout || {})?.length === 4 &&
    !props.disableLayout;
  const classes = useStyles(layoutActive);
  const VACCINATION_STATUS_CHOICES = [
    { value: 2, label: t('translation:common.vaccinationNotDone') },
    { value: 1, label: t('translation:common.vaccinationDone') },
    {
      value: 0,
      label: t('translation:common.vaccinationDontWantToCommunicate'),
    },
  ];
  const label =
    props.field.label ||
    t(
      `customForm.field.${
        CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT[
          props.field?.signup_question_kind
        ]
      }`,
    );

  const uniqueCustomFormFieldIdentifier =
    generateUniqueCustomFormFieldIdentifier(
      props.field,
      label,
      CUSTOM_FORM_FIELD_SIGN_UP_PREFIX,
    );

  const genderSuggestions = React.useMemo(
    () => [
      { label: t('common:gender.F'), value: 'F' },
      { label: t('common:gender.M'), value: 'M' },
      { label: t('common:gender.X'), value: 'X' },
    ],
    [t],
  );

  const selectedGenderFieldValue = React.useMemo(
    () =>
      !!props.field.answer && {
        label: t(`common:gender.${props.field.answer}`) as string,
        value: props.field.answer as string,
      },
    [props.field.answer, t],
  );

  switch (props.field.signup_question_kind) {
    case CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME:
    case CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME:
    case CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE:
    case CUSTOM_FORM_FIELD_SIGN_UP_CITY:
    case CUSTOM_FORM_FIELD_SIGN_UP_STATE:
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1:
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2:
    case CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT:
    case CUSTOM_FORM_FIELD_SIGN_UP_OFFICIAL_DOCUMENT_ID:
      return (
        <FabriqueTextfield
          inputId={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_EMAIL:
      return (
        <FabriqueTextfield
          inputId={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
          type="email"
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_PHONE:
      return (
        <div className={classes.phoneField}>
          <EnhancedPhoneInput
            fullWidth
            country={browserCountryCode()}
            disabled={props.asManager || !props.field.editable}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            onChange={(phone_number: string) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                phone_number || null,
              )
            }
            placeholder={`${label}${props.field.mandatory ? ' *' : ''}`}
            required={props.field.mandatory}
            // @ts-expect-error
            value={props.field?.answer}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD:
      return (
        <FabriquePasswordField
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY:
      return (
        <FabriqueCountrySignUpField
          countries={countries}
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
          placeholder={label}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_GENDER:
      return (
        <FabriqueSelectfield
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
          placeholder={label}
          selectedItem={selectedGenderFieldValue}
          suggestions={genderSuggestions}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY:
      return (
        <FabriqueDateField
          isForcedDatePicker
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_PHOTO:
      return (
        <FabriqueAvatarField
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          name={`custom_form_field.${props.index}.answer`}
        />
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL:
      return (
        <FabriqueCheckboxfield
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager}
          isRequired={props.field.mandatory}
          label={t('translation:form.signup.fields.accept_email')}
          name={`custom_form_field.${props.index}.answer`}
        />
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS:
      return (
        <FabriqueCheckboxfield
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager}
          isRequired={props.field.mandatory}
          label={t('translation:form.signup.fields.accept_sms')}
          name={`custom_form_field.${props.index}.answer`}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS:
      return (
        <FabriqueSelectfield
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={props.asManager || !props.field.editable}
          isRequired={props.field.mandatory}
          label={label}
          name={`custom_form_field.${props.index}.answer`}
          placeholder={label}
          suggestions={VACCINATION_STATUS_CHOICES}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_WAIVER:
      if (waiver) {
        return (
          <FabriqueAcceptTermsAndConditions
            disabled={
              props.asManager ||
              !!props.initial?.custom_form_field[props.index]?.answer
            }
            id={uniqueCustomFormFieldIdentifier}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
            termsAndConditions={waiver}
            type={TermsAndConditionType.WAIVER}
          />
        );
      }
      return <div />;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS:
      if (general_terms_and_conditions) {
        return (
          <FabriqueAcceptTermsAndConditions
            required
            disabled={
              props.asManager ||
              !!props.initial?.custom_form_field[props.index]?.answer
            }
            id={uniqueCustomFormFieldIdentifier}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            termsAndConditions={general_terms_and_conditions}
            type={TermsAndConditionType.GENERAL_TERMS_OF_USE}
          />
        );
      }
      return (
        <FabriqueCheckboxfield
          isRequired
          id={uniqueCustomFormFieldIdentifier}
          isDisabled={
            props.asManager ||
            !!props.initial?.custom_form_field[props.index]?.answer
          }
          label={
            <a
              href="https://bright-shovel-41b.notion.site/RGPD-4b8e6a8a215a418a95f91197efd94847"
              rel="noopener noreferrer"
              target="_blank"
            >
              {`${t('payment:generalTermsAndConditions.iAccept')} ${label}`}
            </a>
          }
          name={`custom_form_field.${props.index}.answer`}
        />
      );

    default:
      return <div />;
  }
};
const styles = (theme: Theme) => ({
  textField: {
    marginTop: theme.spacing(-2),
  },
  emailField: {
    marginTop: theme.spacing(-1.4),
  },
  phoneField: {
    paddingTop: theme.spacing(1.4),
  },
  countryField: {
    maringTop: theme.spacing(0),
  },
  spacedField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  labelClass: {
    color: 'black',
    paddingBottom: theme.spacing(1),
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  signature: {
    maxWidth: '100%',
    maxHeight: '100px',
  },
  signatureContainer: {
    border: `1px solid ${theme.palette.grey[600]}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    width: '80%',
    position: 'relative',
  },
  fixedIconContainer: {
    width: '100%',
    position: 'absolute',
    zIndex: 1000,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fixedIcon: {
    marginLeft: 'auto',
  },
  fixedButton: {
    padding: '0 10 0 0',
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  photoContainerOutter: {
    '&& img': {
      width: '100px',
      height: '100px',
    },
  },
  photoContainerInner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptEmailField: {
    width: '100%',
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    marginTop: (layoutActive) =>
      layoutActive ? theme.spacing(-2) : theme.spacing(0),
  },
  emailField: {
    marginTop: (layoutActive) =>
      layoutActive ? theme.spacing(-2) : theme.spacing(0),
  },
  phoneField: {
    paddingTop: theme.spacing(1.4),
  },
  countryField: {
    maringTop: theme.spacing(0),
  },
  spacedField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  labelClass: {
    color: 'black',
    paddingBottom: theme.spacing(1),
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  signature: {
    maxWidth: '100%',
    maxHeight: '100px',
  },
  signatureContainer: {
    border: `1px solid ${theme.palette.grey[600]}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    width: '80%',
    position: 'relative',
  },
  fixedIconContainer: {
    width: '100%',
    position: 'absolute',
    zIndex: 1000,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fixedIcon: {
    marginLeft: 'auto',
  },
  fixedButton: {
    padding: '0 10 0 0',
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  photoContainerOutter: {
    '&& img': {
      width: '100px',
      height: '100px',
    },
  },
  photoContainerInner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptEmailField: {
    width: '100%',
  },
}));
export default compose<any, OwnProps>(
  withTranslation(['marketing', 'payment', 'common']),
  // @ts-expect-error
  withStyles(styles),
)(CustomFormConsumerInput);
