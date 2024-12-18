import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ErrorMessage } from 'formik';
import { DateTime } from 'luxon';
import Grid from '@material-ui/core/Grid';
import amber from '@material-ui/core/colors/amber';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
  MAX_LENGTH_FOR_SHORT_ANSWER,
  get_custom_form_sign_question_label,
  getCustomFormFieldMaxLength,
  generateUniqueCustomFormFieldIdentifier,
} from '../../utils';

import { countries } from '../../../../i18n/utils/countries';
import { MaterialStyleType } from '../../../../utils/types';
// @ts-expect-error
import Selector from '../../../../components/Selector.component';
import type { CustomFormField, FormikCustomFormFilled } from '../../types';
// @ts-expect-error
import { browserCountryCode } from '../../../../i18n';

import {
  DateField,
  TextFieldEnhancedLabelWithError,
  SelectFieldWithEnhancedLabeLError,
  // @ts-expect-error
} from '../../../../components/forms';
// @ts-expect-error
import AvatarFieldWithButton from '../../../../components/forms/AvatarFieldWithButton.component';
import AcceptTermsAndConditions from '../../../payment/components/AcceptTermsAndConditions.component';
import { CheckboxField } from '../GenericFormik.input';
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
  isCssVariantActivated?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT =
  get_custom_form_sign_question_label();
export const CustomFormConsumerInput = (props: Props) => {
  const { t, waiver, general_terms_and_conditions, isCssVariantActivated } =
    props;
  const layoutActive =
    props.values.layout &&
    Object.keys(props.values.layout || {})?.length === 4 &&
    !props.disableLayout;
  const classes = useStyles(layoutActive);
  const [passwordVisibility, setPasswordVibility] = React.useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVibility] =
    React.useState(false);
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

  const now = DateTime.now().startOf('year').plus({ years: -1 }).toISODate();
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
      if (isCssVariantActivated) {
        return (
          <FabriqueTextfield
            inputId={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager || !props.field.editable}
            isRequired={props.field.mandatory}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <div className={classes.textField}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            disabled={props.asManager || !props.field.editable}
            InputLabelProps={{ color: 'red' }}
            inputProps={{
              maxlength: getCustomFormFieldMaxLength(
                props.field.signup_question_kind,
              ),
            }}
            label={label}
            margin="dense"
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_EMAIL:
      if (isCssVariantActivated) {
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
      }
      return (
        <div className={classes.emailField}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            autoComplete="email"
            disabled={props.asManager || !props.field.editable}
            InputLabelProps={{ color: 'red' }}
            inputProps={{ maxlength: MAX_LENGTH_FOR_SHORT_ANSWER }}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            onBlur={props.handleBlur}
            required={props.field.mandatory}
            type="email"
          />
        </div>
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
      if (isCssVariantActivated) {
        return (
          <FabriquePasswordField
            id={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <>
          <Grid container direction="row" spacing={3}>
            <Grid item xs={6}>
              <TextFieldEnhancedLabelWithError
                fullWidth
                required
                disabled={props.asManager}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPasswordVibility(!passwordVisibility)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {passwordVisibility ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label={label}
                name={`custom_form_field.${props.index}.answer`}
                onBlur={props.handleBlur}
                type={passwordVisibility ? 'text' : 'password'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldEnhancedLabelWithError
                fullWidth
                required
                disabled={props.asManager}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setConfirmPasswordVibility(!confirmPasswordVisibility)
                        }
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {confirmPasswordVisibility ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label={t('customForm.field.repeatPassword')}
                name="passwordConfirm"
                placeholder={t('customForm.field.repeatPassword')}
                type={confirmPasswordVisibility ? 'text' : 'password'}
              />
            </Grid>
          </Grid>
        </>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY:
      if (isCssVariantActivated) {
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
      }
      return (
        <div className={classes.countryField}>
          <SelectFieldWithEnhancedLabeLError
            isDisabled={props.asManager || !props.field.editable}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            onChange={(item: { label: string; value: string }) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                item ? item.value : null,
              )
            }
            placeholder={label}
            required={props.field.mandatory}
            selected={props.field.answer}
            suggestions={[
              ...[...(countries ?? [])]
                .sort((a, b) => a.label.localeCompare(b.label))
                .slice(),
            ].map(
              (country: { code: string; label: string; phone: string }) => ({
                label: country.label,
                value: country.label,
              }),
            )}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_GENDER:
      if (isCssVariantActivated) {
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
      }
      return (
        <div className={classes.countryField}>
          <SelectFieldWithEnhancedLabeLError
            isDisabled={props.asManager || !props.field.editable}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            onChange={(item: { label: string; value: string }) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                item ? item.value : null,
              )
            }
            placeholder={label}
            required={props.field.mandatory}
            selected={props.field.answer}
            suggestions={genderSuggestions}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY:
      if (isCssVariantActivated) {
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
      }
      return (
        <>
          <DateField
            clearable
            disableFuture
            fullWidth
            keyboard
            openToYearSelection
            parseAsString
            cancelLabel={t('translation:common.cancel')}
            clearLabel={t('translation:form.clearDate')}
            disabled={props.asManager || !props.field.editable}
            format="D"
            initialFocusedDate={now}
            label={label}
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
          />
        </>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_PHOTO:
      if (isCssVariantActivated) {
        return (
          <FabriqueAvatarField
            id={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager || !props.field.editable}
            isRequired={props.field.mandatory}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <div className={classes.photoContainerOutter}>
          <div className={classes.photoContainerInner}>
            <AvatarFieldWithButton
              buttonText={t('translation:form.modify')}
              disabled={props.asManager || !props.field.editable}
              label={label}
              name={`custom_form_field.${props.index}.answer`}
              required={props.field.mandatory}
            />
          </div>
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL:
      if (isCssVariantActivated) {
        return (
          <FabriqueCheckboxfield
            id={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager}
            isRequired={props.field.mandatory}
            label={t('translation:form.signup.fields.accept_email')}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <CheckboxField
          disabled={props.asManager}
          label={
            <Typography variant="caption">
              {t('translation:form.signup.fields.accept_email')}
            </Typography>
          }
          name={`custom_form_field.${props.index}.answer`}
          // @ts-expect-error
          required={props.field.mandatory}
        />
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS:
      if (isCssVariantActivated) {
        return (
          <FabriqueCheckboxfield
            id={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager}
            isRequired={props.field.mandatory}
            label={t('translation:form.signup.fields.accept_sms')}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <CheckboxField
          disabled={props.asManager}
          label={
            <Typography variant="caption">
              {t('translation:form.signup.fields.accept_sms')}
            </Typography>
          }
          name={`custom_form_field.${props.index}.answer`}
          // @ts-expect-error
          required={props.field.mandatory}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS:
      if (isCssVariantActivated) {
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
      }
      return (
        <>
          <div style={{ width: '100%' }}>
            <Selector
              isClearable
              isDisabled={props.asManager || !props.field.editable}
              label={`${label}${props.field.mandatory ? ' *' : ''}`}
              name={`custom_form_field.${props.index}.answer`}
              onChange={(item: { label: string; value: string }) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  item ? item.value : null,
                )
              }
              placeholder={`${label}${props.field.mandatory ? ' *' : ''}`}
              selected={props.values.custom_form_field[props.index]?.answer}
              suggestions={VACCINATION_STATUS_CHOICES}
            />
          </div>
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </>
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_WAIVER:
      if (waiver) {
        if (isCssVariantActivated) {
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
        return (
          <>
            <AcceptTermsAndConditions
              // @ts-expect-error
              accepted={props.values?.custom_form_field[props.index]?.answer}
              // @ts-expect-error
              disabled={
                props.asManager ||
                props.initial?.custom_form_field[props.index]?.answer
              }
              label={label}
              onChecked={(checked: boolean) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  checked,
                )
              }
              required={props.field.mandatory}
              termsAndConditions={waiver}
              type={TermsAndConditionType.WAIVER}
            />
            <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
              {(error_msg) => (
                <Typography color="error" variant="caption">
                  {t(`${error_msg}`)}
                </Typography>
              )}
            </ErrorMessage>
          </>
        );
      }
      return <div />;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS:
      if (general_terms_and_conditions) {
        if (isCssVariantActivated) {
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AcceptTermsAndConditions
              required
              // @ts-expect-error
              accepted={props.values.custom_form_field[props.index]?.answer}
              // @ts-expect-error
              disabled={
                props.asManager ||
                props.initial?.custom_form_field[props.index]?.answer
              }
              label={label}
              onChecked={(checked: boolean) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  checked,
                )
              }
              termsAndConditions={general_terms_and_conditions}
              type={TermsAndConditionType.GENERAL_TERMS_OF_USE}
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
      }
      if (isCssVariantActivated) {
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
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <CheckBox
                required
                // @ts-expect-error
                checked={props.values.custom_form_field[props.index]?.answer}
                // @ts-expect-error
                disabled={
                  props.asManager ||
                  props.initial?.custom_form_field[props.index]?.answer
                }
                onClick={() =>
                  props.setFieldValue(
                    `custom_form_field.${props.index}.answer`,
                    !props.values?.custom_form_field[props.index]?.answer,
                  )
                }
              />
            }
            label={
              <Typography align="left" variant="caption">
                <a
                  href="https://www.notion.so/RGPD-4b8e6a8a215a418a95f91197efd94847"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {`${t('payment:generalTermsAndConditions.iAccept')} ${label}`}
                </a>
              </Typography>
            }
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
