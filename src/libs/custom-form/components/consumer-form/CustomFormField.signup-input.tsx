import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ErrorMessage } from 'formik';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';
import Grid from '@material-ui/core/Grid';
import amber from '@material-ui/core/colors/amber';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import moment from 'moment-timezone';
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
  CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE,
  CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
} from '@bsport/common/lib/master-data/custom-form';

import {
  MAX_LENGTH_FOR_SHORT_ANSWER,
  get_custom_form_sign_question_label,
  getCustomFormFieldMaxLength,
} from '../../utils';

import { countries } from '../../../../i18n/utils/countries';
import { MaterialStyleType } from '../../../../utils/types';
import Selector from '../../../../components/Selector.component';
import type { CustomFormField, FormikCustomFormFilled } from '../../types';
import { browserCountryCode } from '../../../../i18n';

import {
  DateField,
  TextFieldEnhancedLabelWithError,
  SelectFieldWithEnhancedLabeLError,
} from '../../../../components/forms';
import AvatarFieldWithButton from '../../../../components/forms/AvatarFieldWithButton.component';
import AcceptTermsAndConditions from '../../../payment/components/AcceptTermsAndConditions.component';
import { CheckboxField } from '../GenericFormik.input';

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

  const now = moment().startOf('year').add(-1, 'years').format('YYYY-MM-DD');
  switch (props.field.signup_question_kind) {
    case CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME:
    case CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME:
    case CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE:
    case CUSTOM_FORM_FIELD_SIGN_UP_CITY:
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1:
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2:
    case CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT:
      return (
        <div className={classes.textField}>
          <TextFieldEnhancedLabelWithError
            name={`custom_form_field.${props.index}.answer`}
            label={label}
            disabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            fullWidth
            InputLabelProps={{ color: 'red' }}
            inputProps={{
              maxlength: getCustomFormFieldMaxLength(
                props.field.signup_question_kind,
              ),
            }}
            margin="dense"
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_EMAIL:
      return (
        <div className={classes.emailField}>
          <TextFieldEnhancedLabelWithError
            name={`custom_form_field.${props.index}.answer`}
            label={label}
            disabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            onBlur={props.handleBlur}
            fullWidth
            InputLabelProps={{ color: 'red' }}
            inputProps={{ maxlength: MAX_LENGTH_FOR_SHORT_ANSWER }}
            type="email"
            autoComplete="email"
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_PHONE:
      return (
        <div className={classes.phoneField}>
          <PhoneInput
            name={`custom_form_field.${props.index}.answer`}
            flags={flags}
            value={props.field?.answer}
            label={label}
            disabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            fullWidth
            country={browserCountryCode()}
            placeholder={`${label}${props.field.mandatory ? ' *' : ''}`}
            autoComplete="tel"
            onChange={(phone_number: string) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                phone_number || null,
              )
            }
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD:
      return (
        <>
          <Grid container direction="row" spacing={3}>
            <Grid item xs={6}>
              <TextFieldEnhancedLabelWithError
                name={`custom_form_field.${props.index}.answer`}
                label={label}
                disabled={props.asManager}
                required
                type={passwordVisibility ? 'text' : 'password'}
                fullWidth
                onBlur={props.handleBlur}
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldEnhancedLabelWithError
                type={confirmPasswordVisibility ? 'text' : 'password'}
                name="passwordConfirm"
                fullWidth
                required
                disabled={props.asManager}
                placeholder={t('customForm.field.repeatPassword')}
                label={t('customForm.field.repeatPassword')}
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
              />
            </Grid>
          </Grid>
        </>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY:
      return (
        <div className={classes.countryField}>
          <SelectFieldWithEnhancedLabeLError
            name={`custom_form_field.${props.index}.answer`}
            label={label}
            placeholder={label}
            isDisabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            suggestions={[...countries.slice()].map(
              (country: { code: string; label: string; phone: string }) => ({
                label: country.label,
                value: country.label,
              }),
            )}
            onChange={(item: { label: string; value: string }) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                item ? item.value : null,
              )
            }
            selected={props.field.answer}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_GENDER:
      return (
        <div className={classes.countryField}>
          <SelectFieldWithEnhancedLabeLError
            name={`custom_form_field.${props.index}.answer`}
            label={label}
            placeholder={label}
            isDisabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            suggestions={[
              { label: t('translation:common.female'), value: 'F' },
              { label: t('translation:common.male'), value: 'M' },
              { label: t('translation:common.otherGender'), value: 'X' },
            ]}
            onChange={(item: { label: string; value: string }) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                item ? item.value : null,
              )
            }
            selected={props.field.answer}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY:
      return (
        <>
          <DateField
            name={`custom_form_field.${props.index}.answer`}
            label={label}
            disabled={props.asManager || !props.field.editable}
            required={props.field.mandatory}
            keyboard
            format="L"
            fullWidth
            openToYearSelection
            clearable
            returnMoment={false}
            disableFuture
            clearLabel={t('translation:form.clearDate')}
            cancelLabel={t('translation:common.cancel')}
            initialFocusedDate={now}
            parseAsString
          />
        </>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_PHOTO:
      return (
        <div className={classes.photoContainerOutter}>
          <div className={classes.photoContainerInner}>
            <AvatarFieldWithButton
              name={`custom_form_field.${props.index}.answer`}
              label={label}
              disabled={props.asManager || !props.field.editable}
              required={props.field.mandatory}
              buttonText={t('translation:form.modify')}
            />
          </div>
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL:
      return (
        <CheckboxField
          name={`custom_form_field.${props.index}.answer`}
          label={
            <Typography variant="caption">
              {t('translation:form.signup.fields.accept_email')}
            </Typography>
          }
          disabled={props.asManager}
          required={props.field.mandatory}
        />
      );
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS:
      return (
        <CheckboxField
          name={`custom_form_field.${props.index}.answer`}
          label={
            <Typography variant="caption">
              {t('translation:form.signup.fields.accept_sms')}
            </Typography>
          }
          disabled={props.asManager}
          required={props.field.mandatory}
        />
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS:
      return (
        <>
          <div style={{ width: '100%' }}>
            <Selector
              name={`custom_form_field.${props.index}.answer`}
              label={`${label}${props.field.mandatory ? ' *' : ''}`}
              placeholder={`${label}${props.field.mandatory ? ' *' : ''}`}
              isDisabled={props.asManager || !props.field.editable}
              suggestions={VACCINATION_STATUS_CHOICES}
              onChange={(item: { label: string; value: string }) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  item ? item.value : null,
                )
              }
              selected={props.values.custom_form_field[props.index]?.answer}
              isClearable
            />
          </div>
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </>
      );

    case CUSTOM_FORM_FIELD_SIGN_UP_WAIVER:
      if (waiver) {
        return (
          <>
            <AcceptTermsAndConditions
              accepted={props.values?.custom_form_field[props.index]?.answer}
              required={props.field.mandatory}
              disabled={
                props.asManager ||
                props.initial?.custom_form_field[props.index]?.answer
              }
              onChecked={(checked: boolean) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  checked,
                )
              }
              termsAndConditions={waiver}
              type="waiver"
              label={label}
            />
            <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
              {(error_msg) => (
                <Typography variant="caption" color="error">
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
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AcceptTermsAndConditions
              accepted={props.values.custom_form_field[props.index]?.answer}
              required
              disabled={
                props.asManager ||
                props.initial?.custom_form_field[props.index]?.answer
              }
              onChecked={(checked: boolean) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  checked,
                )
              }
              termsAndConditions={general_terms_and_conditions}
              type="generalTermsOfUse"
              label={label}
            />
            <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
              {(error_msg) => (
                <Typography variant="caption" color="error">
                  {t(`${error_msg}`)}
                </Typography>
              )}
            </ErrorMessage>
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            control={
              <CheckBox
                required
                disabled={
                  props.asManager ||
                  props.initial?.custom_form_field[props.index]?.answer
                }
                checked={props.values.custom_form_field[props.index]?.answer}
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
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${t('payment:generalTermsAndConditions.iAccept')} ${label}`}
                </a>
              </Typography>
            }
          />

          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
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
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormConsumerInput);
