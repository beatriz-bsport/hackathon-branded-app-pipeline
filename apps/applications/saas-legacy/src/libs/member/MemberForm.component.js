// @flow
import React from 'react';
import * as Yup from 'yup';
import { DateTime } from 'luxon';
import debounce from 'lodash/debounce';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import {
  withFormik,
  Form,
  connect as formikConnect,
  Field,
  ErrorMessage,
} from 'formik';
import { compose, withPropsOnChange, withProps, withState } from 'recompose';
import { FormLabel } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToolTip from '#src/components/Tooltip.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { browserCountryCode } from '../../i18n';
import { getAuth, postAuth } from '../../http';
import AvatarFieldWithButton from '../../components/forms/AvatarFieldWithButton.component';
import Config from '../../config';

import {
  CheckboxField,
  TextField,
  DelayTextField,
  GenderField,
  Actions,
  Submit,
  DateField,
  TextFieldEnhancedLabelWithError,
  SelectField,
} from '../../components/forms';
import { PhoneFieldV2 } from '../../components/form-fields';
import AlertExistingUser from './AlertExistingUser.component';
import withConfirm from '../../hocs/with-confirm.hoc';
import FullCountrySelect from '../../components/input/FullCountrySelect.component';
import { validateSpanishNIF } from '../invoice/verifactu/validation';

import { ALLOWED_COUNTRIES_FOR_STATES } from './constants';
const API_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V0;

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Member,
);

const styles = (theme) => ({
  redPaperContainer: {
    padding: theme.spacing(3),
    background: 'rgba(206, 17, 38, 0.05)',
  },
  paperContainer: {
    padding: theme.spacing(3),
  },
  mergeTitle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  memberGreeting: {
    paddingBottom: theme.spacing(2),
  },
  photoContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  gridColumn: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  buttonWaiver: {
    paddingBottom: theme.spacing(-3),
  },
  marginLeft: {
    paddingLeft: theme.spacing(1),
  },
  gridItem: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  nationalityField: {
    marginBottom: theme.spacing(2),
  },
});

type Props = {
  classes: Object,
  t: TFunction,
  isSubmitting: boolean,
  emailExists: any,
  variant?: 'merge-form' | '',
  disabled?: boolean,
  fromConsumerAccess?: boolean,
  memberId: number,
  companyCountry: string,
  emailExistsError: boolean,
  asManager?: boolean,
  onCancel?: () => void,
  checkUserExists: (data: { email?: string, phonenumber?: string }) => void,
  goToMember: (id: number) => void,
  userStatus: number,
  initial: object,
  errors: any,
  setFieldValue: (fieldname: string, value: any) => void,
  waiver: string,
  withoutTitle?: Boolean,
  alreadyExistingGoToButtonText?: string,
};

const Effect = formikConnect(
  class __ extends React.Component<{
    formik: any,
    onChange: (data: any) => void,
  }> {
    componentDidUpdate(prevProps) {
      if (prevProps.formik !== this.props.formik) {
        this.props.onChange(prevProps.formik, this.props.formik);
      }
    }

    render() {
      return null;
    }
  },
);

const MemberExistsBanner = ({
  emailExists,
  goToMember,
  memberId,
  emailExistsError,
  goToButtonText,
}: {
  emailExists: { phonenumber: string, email: string, exists: boolean },
  goToMember: () => void,
  memberId: number,
  emailExistsError: boolean,
  goToButtonText?: string,
}) => {
  if (!emailExists) {
    return null;
  }
  const { email, phonenumber, exists } = emailExists;
  if (!exists || !exists.member_pk || exists.member_pk === memberId) {
    return null;
  }

  if ((exists, emailExistsError)) {
    return null;
  }

  return (
    <AlertExistingUser
      email={email}
      emailConfirmed={exists.email_confirmed}
      existingMemberId={exists.member_pk}
      goToButtonText={goToButtonText}
      goToMember={goToMember}
      memberId={memberId}
      phonenumber={phonenumber}
    />
  );
};
const MemberFormTitle = (props: { t: TFunction }) => {
  const { t } = props;
  return (
    <>
      <Typography component="h2" variant="h6">
        {t('member:forms.title')}
      </Typography>
      <Divider />
    </>
  );
};

const checkIfMemberExists = (
  currentFormikState,
  nextFormikState,
  checkUserExists,
) => {
  const prevEmail = currentFormikState.values.email;
  const nextEmail = nextFormikState.values.email;
  if (prevEmail !== nextEmail) {
    checkUserExists({ email: nextEmail?.toLowerCase() || '' });
  }
};

export function MemberForm(props: Props) {
  const {
    classes,
    t,
    disabled,
    isSubmitting,
    variant,
    checkUserExists,
    asManager,
    userStatus,
    setFieldValue,
    memberId,
    withoutTitle,
    alreadyExistingGoToButtonText,
  } = props;
  React.useEffect(() => {
    trackFormAdd(memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const mdSize = variant === 'merge-form' ? 12 : 6;
  const validationErrors = () => {
    const { errors } = props;
    if (errors) {
      const errors_array = Object.keys(errors);
      return errors_array.filter(
        (error) =>
          error === 'accept_email' ||
          error === 'accept_sms' ||
          error === 'waiver' ||
          error === 'photo',
      );
    }
    return [];
  };
  const WaiverPopUp = withConfirm(ButtonBase, 'onClick', {
    title: 'translation:form.member.waiver.dialog.title',
    confirm: 'translation:form.member.waiver.dialog.confirm',
    Content: () => <p>{props.waiver}</p>,
  });
  return (
    <div>
      {variant === 'merge-form' || !asManager ? null : (
        <MemberExistsBanner
          emailExists={props.emailExists}
          emailExistsError={props.emailExistsError}
          goToButtonText={alreadyExistingGoToButtonText}
          goToMember={props.goToMember}
          memberId={props.memberId}
        />
      )}

      <div
        className={
          variant === 'merge-form' && disabled
            ? classes.redPaperContainer
            : classes.paperContainer
        }
      >
        {variant === 'merge-form' ? (
          <div className={classes.mergeTitle}>
            <Typography component="h2" variant="h6">
              {disabled
                ? t('member:forms.merge.srcMember')
                : t('member:forms.merge.dstMember')}
            </Typography>
          </div>
        ) : null}

        {!withoutTitle && (
          <div className={classes.title}>
            <MemberFormTitle t={t} userStatus={userStatus} />
          </div>
        )}

        <Form>
          <Effect
            onChange={(prev, nxt) =>
              checkIfMemberExists(prev, nxt, checkUserExists)
            }
          />
          <Grid container spacing={2}>
            <Grid item className={classes.photoContainer} xs={12}>
              <div className={classes.photoWithError}>
                <AvatarFieldWithButton
                  buttonText={t('translation:form.modify')}
                  disabled={disabled}
                  name="avatar"
                />
              </div>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={mdSize} xs={12}>
                <div className={classes.marginLeft}>
                  <TextField
                    fullWidth
                    required
                    shrink
                    disabled={disabled}
                    label={t('translation:form.firstname')}
                    name="firstname"
                  />
                </div>
              </Grid>
              <Grid item md={mdSize} xs={12}>
                <TextField
                  fullWidth
                  required
                  shrink
                  disabled={disabled}
                  label={t('translation:form.lastname')}
                  name="lastname"
                />
              </Grid>
              <Grid item md={mdSize} xs={12}>
                <div className={classes.marginLeft}>
                  {variant === 'merge-form' ? (
                    <TextField
                      fullWidth
                      shrink
                      disabled={disabled || variant === 'merge-form'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            {props.initial && props.initial.pending_email && (
                              <ToolTip
                                title={t(
                                  'member:changeEmailRequest.pendingValidation',
                                  {
                                    email: props.initial.pending_email,
                                  },
                                )}
                              >
                                <div className={classes.iconContainer}>
                                  <HourglassEmptyIcon color="disabled" />
                                </div>
                              </ToolTip>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      label={t('translation:form.email')}
                      name="email"
                      required={!asManager}
                      type="email"
                    />
                  ) : (
                    <>
                      <DelayTextField
                        fullWidth
                        disabled={disabled || variant === 'merge-form'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment>
                              {props.initial && props.initial.pending_email && (
                                <ToolTip
                                  title={t(
                                    'member:changeEmailRequest.pendingValidation',
                                    {
                                      email: props.initial.pending_email,
                                    },
                                  )}
                                >
                                  <div className={classes.iconContainer}>
                                    <HourglassEmptyIcon color="disabled" />
                                  </div>
                                </ToolTip>
                              )}
                            </InputAdornment>
                          ),
                        }}
                        label={t('translation:form.email')}
                        name="email"
                        required={!asManager}
                        type="email"
                      />
                    </>
                  )}
                </div>
              </Grid>
              <Grid item md={mdSize} xs={12}>
                <GenderField
                  fullWidth
                  disabled={disabled || !asManager}
                  label={t('translation:form.gender')}
                  name="gender"
                  required={!asManager}
                />
              </Grid>
            </Grid>

            {!asManager ? null : (
              <Grid item md={mdSize} xs={12}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  shrink
                  disabled={disabled || !!props.fromConsumerAccess}
                  helperText={t('form.member.referenceNumberHelper')}
                  label={t('form.member.referenceNumber')}
                  name="membership_ID"
                />
              </Grid>
            )}
            {!asManager ? null : (
              <Grid item md={mdSize} xs={12}>
                <TextFieldEnhancedLabelWithError
                  fullWidth
                  shrink
                  disabled={disabled || !!props.fromConsumerAccess}
                  helperText={t('form.member.barcodeHelper')}
                  label={t('form.member.barcode')}
                  name="barcode"
                />
              </Grid>
            )}
            <Grid item md={mdSize} xs={12}>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <DateField
                    clearable
                    disableFuture
                    keyboard
                    openToYearSelection
                    cancelLabel={t('translation:common.cancel')}
                    clearLabel={t('translation:form.clearDate')}
                    disabled={disabled || !asManager}
                    format="D"
                    // TODO : This is not working as expected
                    initialFocusedDate="1990/01/01"
                    label={t('translation:form.birthday')}
                    name="birthday"
                    required={!asManager}
                    returnMoment={false}
                  />
                </Grid>

                {!asManager ? null : (
                  <Grid item>
                    <DateField
                      keyboard
                      cancelLabel={t('translation:common.cancel')}
                      disabled={disabled}
                      format="D"
                      label={t('member:date_joined')}
                      name="date_joined"
                      returnMoment={false}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item md={mdSize} xs={12}>
              <Grid container direction="row" spacing={2}>
                <Grid item md={12} xs={12}>
                  <PhoneFieldV2
                    fullWidth
                    disabled={disabled || !asManager}
                    label={t('translation:form.phone')}
                    name="phone"
                    phoneCountry={browserCountryCode()}
                    required={!asManager}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction="row" md={12} xs={12}>
              <Grid item md={mdSize} xs={12}>
                <div className={classes.gridColumn}>
                  <TextField
                    fullWidth
                    disabled={disabled || !asManager}
                    label={t('form.address.addressLine1')}
                    name="address_line_1"
                    required={!asManager}
                  />
                  <TextField
                    fullWidth
                    disabled={disabled || !asManager}
                    label={t('form.address.addressLine2')}
                    name="address_line_2"
                    required={!asManager}
                  />
                  <Grid container direction="row" spacing={2}>
                    {ALLOWED_COUNTRIES_FOR_STATES.includes(
                      props.companyCountry,
                    ) && (
                      <Grid item>
                        <TextField
                          disabled={disabled || !asManager}
                          label={t('form.address.state')}
                          name="state"
                          required={!asManager}
                        />
                      </Grid>
                    )}

                    <Grid item>
                      <TextField
                        disabled={disabled || !asManager}
                        label={t('form.address.zipcode')}
                        name="zipcode"
                        required={!asManager}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        disabled={disabled || !asManager}
                        label={t('form.address.city')}
                        name="city"
                        required={!asManager}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    disabled={disabled || !asManager}
                    label={t('form.address.country')}
                    name="country"
                    required={!asManager}
                  />
                </div>
              </Grid>
              <Grid item md={mdSize} xs={12}>
                <div className={classes.gridColumn}>
                  <Grid container direction="column">
                    <TextField
                      fullWidth
                      disabled={disabled || !asManager}
                      label={t('translation:form.emergencyContact')}
                      name="emergency_contact"
                      required={!asManager}
                    />
                  </Grid>

                  {!asManager ? null : (
                    <>
                      <Grid
                        item
                        className={classes.nationalityField}
                        md={12}
                        xs={12}
                      >
                        <Field name="nationality">
                          {({ field, form: { values, setFieldValue } }) => {
                            const handleNationalityChange = (
                              newNationality,
                            ) => {
                              const previousNationality = values.nationality;
                              setFieldValue('nationality', newNationality);

                              // Default-selection behavior instead of clearing
                              const currentDocType =
                                values.official_document_type;
                              if (currentDocType) {
                                const availableChoices = [
                                  'passport',
                                  ...(newNationality !== 'ES'
                                    ? ['national_id']
                                    : []),
                                  ...(newNationality === 'ES'
                                    ? ['es_dni']
                                    : []),
                                ];

                                // If current type is still valid, keep it
                                if (availableChoices.includes(currentDocType)) {
                                  return;
                                }

                                // Smart defaults when switching between Spain and non-Spain
                                if (
                                  previousNationality === 'ES' &&
                                  newNationality !== 'ES'
                                ) {
                                  // Changing from Spain to non-Spain: default es_dni -> national_id
                                  if (currentDocType === 'es_dni') {
                                    setFieldValue(
                                      'official_document_type',
                                      'national_id',
                                    );
                                    return;
                                  }
                                } else if (
                                  previousNationality !== 'ES' &&
                                  newNationality === 'ES'
                                ) {
                                  // Changing from non-Spain to Spain: default national_id -> es_dni
                                  if (currentDocType === 'national_id') {
                                    setFieldValue(
                                      'official_document_type',
                                      'es_dni',
                                    );
                                    return;
                                  }
                                }

                                // If no smart default applies, clear it
                                setFieldValue('official_document_type', '');
                              }
                            };
                            return (
                              <FullCountrySelect
                                disabled={disabled}
                                label={t('b2c_member:form.member.nationality')}
                                onChange={(e) =>
                                  handleNationalityChange(e.target.value)
                                }
                                value={field.value || ''}
                              />
                            );
                          }}
                        </Field>
                      </Grid>

                      <Field name="documentTypeFields">
                        {({ form: { values } }) => {
                          const documentTypeChoices = [
                            {
                              value: 'passport',
                              label:
                                'b2c_member:form.member.documentType.passport',
                            },
                            ...(values.nationality !== 'ES'
                              ? [
                                  {
                                    value: 'national_id',
                                    label:
                                      'b2c_member:form.member.documentType.nationalId',
                                  },
                                ]
                              : []),
                            ...(values.nationality === 'ES'
                              ? [
                                  {
                                    value: 'es_dni',
                                    label:
                                      'b2c_member:form.member.documentType.nif',
                                  },
                                ]
                              : []),
                          ];
                          return (
                            <Grid container direction="row" spacing={2}>
                              <Grid item md={6} xs={12}>
                                <SelectField
                                  choices={documentTypeChoices}
                                  disabled={disabled}
                                  fullWidth={true}
                                  label={t(
                                    'b2c_member:form.member.documentType.label',
                                  )}
                                  name="official_document_type"
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <Field name="official_document_id">
                                  {({ form: { submitCount } }) => (
                                    <>
                                      <TextField
                                        disabled={disabled}
                                        fullWidth={true}
                                        label={t(
                                          'b2c_member:form.member.documentId.label',
                                        )}
                                        name="official_document_id"
                                      />
                                      {submitCount > 0 && (
                                        <ErrorMessage name="official_document_id">
                                          {(message) => (
                                            <Typography
                                              color="error"
                                              variant="caption"
                                            >
                                              {t(message)}
                                            </Typography>
                                          )}
                                        </ErrorMessage>
                                      )}
                                    </>
                                  )}
                                </Field>
                              </Grid>
                            </Grid>
                          );
                        }}
                      </Field>
                    </>
                  )}

                  <Grid item md={12} xs={12}>
                    <FormControl>
                      <Grid item md={12} xs={12}>
                        <FormLabel>
                          {t('translation:form.member.rgpdTitle')}
                        </FormLabel>
                      </Grid>

                      <Grid item md={12} xs={12}>
                        <CheckboxField
                          disabled={disabled || !asManager}
                          id="checkbox_accept_email"
                          label={t('translation:form.member.rgpd.email')}
                          name="accept_email"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <CheckboxField
                          disabled={disabled || !asManager}
                          id="checkbox_accept_sms"
                          label={t('translation:form.member.rgpd.sms')}
                          name="accept_sms"
                        />
                      </Grid>

                      <Grid item md={12} xs={12}>
                        {props.waiver && (
                          <CheckboxField
                            disabled={
                              disabled ||
                              (props.initial && props.initial.waiver) ||
                              !asManager
                            }
                            id="checkbox_waiver"
                            label={
                              <Typography component="div">
                                {t('translation:form.member.waiver.iAccept')}
                                <WaiverPopUp
                                  onClick={() =>
                                    !asManager && setFieldValue('waiver', true)
                                  }
                                  waiver={props.waiver}
                                >
                                  <Typography color="secondary">
                                    {`${' '}${t(
                                      'translation:form.member.waiver.conditions',
                                    )}`}
                                  </Typography>
                                </WaiverPopUp>
                              </Typography>
                            }
                            name="waiver"
                            required={!asManager}
                          />
                        )}
                      </Grid>
                    </FormControl>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {validationErrors() &&
                validationErrors().map((error) => {
                  return (
                    <Typography key={error} color="error">
                      {t(`translation:form.member.errors.${error}`)}
                    </Typography>
                  );
                })}
            </div>
            <Grid item xs={12}>
              {!disabled ? (
                <Actions>
                  {props.onCancel ? (
                    <Button
                      disabled={isSubmitting}
                      onClick={() => {
                        trackFormCancel(memberId);
                        props.onCancel();
                      }}
                    >
                      {t('translation:common.cancel')}
                    </Button>
                  ) : null}
                  <Submit
                    disabled={
                      isSubmitting ||
                      (props.emailExists &&
                        props.emailExists?.exists?.member_pk &&
                        props.emailExists?.exists?.email_confirmed &&
                        !props.emailExistsError &&
                        !props.memberId)
                    }
                    onClick={() => {
                      trackFormSubmitIntent(memberId);
                    }}
                  >
                    {t('translation:form.send')}
                  </Submit>
                </Actions>
              ) : null}
            </Grid>
          </Grid>
        </Form>
        {variant === 'merge-form' ? null : (
          <LinearProgress
            style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
          />
        )}
      </div>
      {variant === 'merge-form' || !asManager ? null : (
        <MemberExistsBanner
          emailExists={props.emailExists}
          emailExistsError={props.emailExistsError}
          goToButtonText={alreadyExistingGoToButtonText}
          goToMember={props.goToMember}
          memberId={props.memberId}
        />
      )}
    </div>
  );
}

export default compose(
  withStyles(styles),
  withTranslation(['translation', 'member', 'b2c_member']),
  withState('emailExists', 'setEmailExists', false),
  withState('emailExistsError', 'setemailExistsError', false),
  withPropsOnChange(
    ['setEmailExists', 'setCurrentEmailExist'],
    ({ setEmailExists, setemailExistsError, ignoreMail }) => {
      if (!ignoreMail) {
        return {
          checkUserExists: debounce(({ email, phonenumber }) => {
            const q = email
              ? `email=${encodeURIComponent(email.toLowerCase())}`
              : `phonenumber=${encodeURIComponent(phonenumber)}`;
            getAuth(`${API_URI_CORE}/saas/members/members/exists/?${q}`).catch(
              (error) => {
                const { status, data } = error.response || {};
                if (status !== 404) {
                  setEmailExists({ email, phonenumber, exists: data || {} });
                  setemailExistsError(false);
                  window.scrollTo(0, 0);
                }
                if (status === 404) {
                  setemailExistsError(true);
                }
              },
            );
          }, 1000),
        };
      }
      return {
        checkUserExists: debounce(() => {}, 1000),
      };
    },
  ),
  withProps(({ emailExists, goToMemberList, goToMember, snackbarSuccess }) => ({
    linkMember: () => {
      const { email, phonenumber } = emailExists;
      postAuth(`${API_URI_CORE}/saas/members/members/link/`, {
        email: email?.toLowerCase() || '',
        phonenumber,
      })
        .then(() => {
          if (snackbarSuccess) {
            snackbarSuccess('member.link.success');
          }
          goToMemberList?.();
        })
        .catch((error) => {
          const { status, data } = error.response || {};
          if (status === 302) {
            goToMember(data.member_pk);
          }
        });
    },
  })),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      (initial && {
        ...initial,
        birthday: initial?.birthday ? DateTime.fromISO(initial.birthday) : null,
      }) || {
        avatar: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: undefined,
        emergency_contact: '',
        gender: 'X',
        birthday: null,
        membership_ID: '',
        barcode: '',
        date_joined: DateTime.now().toISODate(),
        accept_sms: true,
        accept_email: true,
        waiver: false,
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        nationality: '',
        official_document_type: '',
        official_document_id: '',
      },
    enableReinitialize: true,

    handleSubmit: (
      values,
      { props: { onSubmit, memberId }, setSubmitting },
    ) => {
      setSubmitting(true);
      let { avatar } = values;
      if (typeof avatar === 'string' && avatar.includes('data:image/')) {
        const byteString = atob(avatar.split(',')[1]);
        const mimeString = avatar.split(',')[0].split(':')[1].split(';')[0];

        const buffer = new ArrayBuffer(byteString.length);
        const data = new DataView(buffer);

        for (let i = 0; i < byteString.length; i++) {
          data.setUint8(i, byteString.charCodeAt(i));
        }
        avatar = new File(
          [buffer],
          `${parseInt(Math.random() * 10000000000000000, 10)}.png`,
          { type: mimeString },
        );
      }
      const data = {
        ...values,
        avatar: typeof avatar !== 'string' ? avatar : undefined,
        email: values.email?.toLowerCase() || '',
        emergency_contact: values.emergency_contact || undefined,
        gender: values.gender || 'X',
        birthday: values?.birthday && values.birthday.toISODate(),
      };
      onSubmit(data, {
        onSuccess: () => {
          trackFormSuccess(memberId);
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      });
    },
    validationSchema: Yup.object().shape({
      official_document_id: Yup.string().test(
        'document-id-validation',
        function (value) {
          const { official_document_type } = this.parent;
          // Only validate if official_document_type is es_dni
          if (official_document_type === 'es_dni') {
            if (!validateSpanishNIF(value)) {
              return this.createError({
                message: 'b2c_member:form.member.documentId.invalidNIF',
              });
            }
            return true;
          }
          // For passport and national_id, validate alphanumeric format
          if (
            official_document_type === 'passport' ||
            official_document_type === 'national_id'
          ) {
            if (value && !/^[A-Za-z0-9]+$/.test(value)) {
              return this.createError({
                message:
                  'marketing:customForm.submit.errors.invalidOfficialDocumentId',
              });
            }
            return true;
          }
          // No validation if document type is not set
          return true;
        },
      ),
      barcode: Yup.string().max(
        16,
        'marketing:customForm.submit.errors.barcodeMaximumLength',
      ),
      membership_ID: Yup.string().max(
        24,
        'marketing:customForm.submit.errors.membershipIdMaximumLength',
      ),
    }),
  }),
)(MemberForm);
