// @flow
import React from 'react';
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
import { withFormik, Form, connect as formikConnect } from 'formik';
import { compose, withPropsOnChange, withProps, withState } from 'recompose';
import { FormLabel } from '@material-ui/core';
import { browserCountryCode, Moment } from '../../i18n';
import { getAuth, postAuth, API_URI } from '../../http';
import AvatarFieldWithButton from '../../components/forms/AvatarFieldWithButton.component';
import {
  CheckboxField,
  TextField,
  DelayTextField,
  PhoneField,
  GenderField,
  VaccinationStatusField,
  Actions,
  Submit,
  DateField,
} from '../../components/forms';
import AlertExistingUser from './AlertExistingUser.component';
import { DATE_FORMAT } from '../../utils/datetime';
import withConfirm from '../../hocs/with-confirm.hoc';

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
});

type Props = {
  classes: Object,
  t: TFunction,
  isSubmitting: boolean,
  emailExists: any,
  variant?: 'merge-form' | '',
  disabled?: boolean,
  fromConsumerAccess: ?boolean,
  memberId: number,
  emailExistsError: boolean,
  asManager?: boolean,
  onCancel?: () => void,
  checkUserExists: (data: { email?: string, phonenumber?: string }) => void,
  goToMember: (id: number) => void,
  goToMerge: (idSrc: number, idDst: number) => void,

  linkMember: (id: number) => void,
  userStatus: number,
  initial: object,
  errors: any,
  setFieldValue: (fieldname: string, value: any) => void,
  waiver: string,
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

const MemberExistsBanner = (props: {
  emailExists: { phonenumber: string, email: string, exists: boolean },
  goToMember: () => void,
  linkMember: () => void,
  goToMerge: () => void,
  memberId: number,
  emailExistsError: boolean,
}) => {
  const {
    emailExists,
    goToMember,
    goToMerge,
    linkMember,
    memberId,
    emailExistsError,
  } = props;
  if (!emailExists) {
    return null;
  }
  const { email, phonenumber, exists } = emailExists;
  if (!exists) {
    return null;
  }

  if ((exists, emailExistsError)) {
    return null;
  }

  return (
    <AlertExistingUser
      email={email}
      memberId={memberId}
      phonenumber={phonenumber}
      existingMemberId={exists.member_pk}
      goToMember={goToMember}
      goToMerge={goToMerge}
      linkMember={linkMember}
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
    checkUserExists({ email: nextEmail });
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
  } = props;
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
          linkMember={props.linkMember}
          goToMember={props.goToMember}
          goToMerge={props.goToMerge}
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
            <Typography variant="h6" component="h2">
              {disabled
                ? t('c.merge.srcMember')
                : t('member:forms.merge.dstMember')}
            </Typography>
          </div>
        ) : null}

        <div className={classes.title}>
          <MemberFormTitle userStatus={userStatus} t={t} />
        </div>

        <Form>
          <Effect
            onChange={(prev, nxt) =>
              checkIfMemberExists(prev, nxt, checkUserExists)
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.photoContainer}>
              <div className={classes.photoWithError}>
                <AvatarFieldWithButton
                  name="avatar"
                  disabled={disabled}
                  buttonText={t('translation:form.modify')}
                />
              </div>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={mdSize}>
                <div className={classes.marginLeft}>
                  <TextField
                    shrink
                    name="firstname"
                    label={t('translation:form.firstname')}
                    required
                    disabled={disabled}
                    fullWidth
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="lastname"
                  shrink
                  label={t('translation:form.lastname')}
                  required
                  fullWidth
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={mdSize}>
                <div className={classes.marginLeft}>
                  {variant === 'merge-form' ? (
                    <TextField
                      name="email"
                      shrink
                      label={t('translation:form.email')}
                      type="email"
                      fullWidth
                      required={!asManager}
                      disabled={disabled || variant === 'merge-form'}
                    />
                  ) : (
                    <DelayTextField
                      name="email"
                      label={t('translation:form.email')}
                      type="email"
                      fullWidth
                      required={!asManager}
                      disabled={disabled || variant === 'merge-form'}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={mdSize}>
                <GenderField
                  name="gender"
                  label={t('translation:form.gender')}
                  fullWidth
                  required={!asManager}
                  disabled={disabled || !asManager}
                />
              </Grid>
            </Grid>

            {!asManager ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="membership_ID"
                  label={t('form.member.referenceNumber')}
                  helperText={t('form.member.referenceNumberHelper')}
                  fullWidth
                  shrink
                  disabled={disabled || !!props.fromConsumerAccess}
                />
              </Grid>
            )}
            {!asManager ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="barcode"
                  shrink
                  label={t('form.member.barcode')}
                  helperText={t('form.member.barcodeHelper')}
                  fullWidth
                  disabled={disabled || !!props.fromConsumerAccess}
                />
              </Grid>
            )}
            <Grid item xs={12} md={mdSize}>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <DateField
                    keyboard
                    format="L"
                    required={!asManager}
                    openToYearSelection
                    clearable
                    disabled={disabled || !asManager}
                    label={t('translation:form.birthday')}
                    name="birthday"
                    returnMoment={false}
                    disableFuture
                    clearLabel={t('translation:form.clearDate')}
                    cancelLabel={t('translation:common.cancel')}
                    initialFocusedDate="1990/01/01"
                  />
                </Grid>

                {!asManager ? null : (
                  <Grid item>
                    <DateField
                      keyboard
                      returnMoment={false}
                      format="YYYY-MM-DD"
                      name="date_joined"
                      disabled={disabled}
                      label={t('member:date_joined')}
                      cancelLabel={t('translation:common.cancel')}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <Grid container direction="row" spacing={2}>
                <Grid item md={12} xs={12}>
                  <PhoneField
                    name="phone"
                    label={t('translation:form.phone')}
                    fullWidth
                    required={!asManager}
                    disabled={disabled || !asManager}
                    country={browserCountryCode()}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container xs={12} md={12} direction="row">
              <Grid item xs={12} md={mdSize}>
                <div className={classes.gridColumn}>
                  <TextField
                    required={!asManager}
                    name="address_line_1"
                    fullWidth
                    disabled={disabled || !asManager}
                    label={t('form.address.addressLine1')}
                  />
                  <TextField
                    name="address_line_2"
                    required={!asManager}
                    fullWidth
                    disabled={disabled || !asManager}
                    label={t('form.address.addressLine2')}
                  />
                  <Grid container direction="row" spacing={2}>
                    <Grid item>
                      <TextField
                        name="zipcode"
                        label={t('form.address.zipcode')}
                        disabled={disabled || !asManager}
                        required={!asManager}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        name="city"
                        label={t('form.address.city')}
                        disabled={disabled || !asManager}
                        required={!asManager}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="country"
                    required={!asManager}
                    disabled={disabled || !asManager}
                    label={t('form.address.country')}
                  />
                </div>
              </Grid>
              <Grid item xs={6} md={mdSize}>
                <div className={classes.gridColumn}>
                  <Grid container direction="column">
                    <TextField
                      name="emergency_contact"
                      label={t('translation:form.emergencyContact')}
                      fullWidth
                      required={!asManager}
                      disabled={disabled || !asManager}
                    />
                  </Grid>
                  <Grid
                    style={{ marginTop: 12, marginBottom: 12 }}
                    item
                    xs={12}
                    md={mdSize}
                  >
                    <VaccinationStatusField
                      name="vaccination_status"
                      label={t('translation:common.vaccination_status')}
                      fullWidth
                      required={!asManager}
                      disabled={disabled || !asManager}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      <Grid item xs={12} md={12}>
                        <FormLabel>
                          {t('translation:form.member.rgpdTitle')}
                        </FormLabel>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <CheckboxField
                          id="checkbox_accept_email"
                          name="accept_email"
                          disabled={disabled || !asManager}
                          label={t('translation:form.member.rgpd.email')}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <CheckboxField
                          id="checkbox_accept_sms"
                          name="accept_sms"
                          disabled={disabled || !asManager}
                          label={t('translation:form.member.rgpd.sms')}
                        />
                      </Grid>

                      <Grid item xs={12} md={12}>
                        {props.waiver && (
                          <CheckboxField
                            id="checkbox_waiver"
                            name="waiver"
                            disabled={
                              disabled ||
                              (props.initial && props.initial.waiver) ||
                              !asManager
                            }
                            required={!asManager}
                            label={
                              <Typography component="div">
                                {t('translation:form.member.waiver.iAccept')}
                                <WaiverPopUp
                                  waiver={props.waiver}
                                  onClick={() =>
                                    !asManager && setFieldValue('waiver', true)
                                  }
                                >
                                  <Typography color="secondary">
                                    {`${' '}${t(
                                      'translation:form.member.waiver.conditions',
                                    )}`}
                                  </Typography>
                                </WaiverPopUp>
                              </Typography>
                            }
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
                    <Typography color="error">
                      {t(`translation:form.member.errors.${error}`)}
                    </Typography>
                  );
                })}
            </div>
            <Grid item xs={12}>
              {!disabled ? (
                <Actions>
                  {props.onCancel ? (
                    <Button onClick={props.onCancel} disabled={isSubmitting}>
                      {t('translation:common.cancel')}
                    </Button>
                  ) : null}
                  <Submit disabled={isSubmitting || props.emailExists}>
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
          linkMember={props.linkMember}
          goToMember={props.goToMember}
          goToMerge={props.goToMerge}
          memberId={props.memberId}
        />
      )}
    </div>
  );
}

export default compose(
  withStyles(styles),
  withTranslation(['translation', 'member']),
  withState('emailExists', 'setEmailExists', false),
  withState('emailExistsError', 'setemailExistsError', false),

  withPropsOnChange(
    ['setEmailExists', 'setCurrentEmailExist'],
    ({ setEmailExists, setemailExistsError, ignoreMail }) => {
      if (!ignoreMail) {
        return {
          checkUserExists: debounce(({ email, phonenumber }) => {
            const q = email
              ? `email=${encodeURIComponent(email)}`
              : `phonenumber=${encodeURIComponent(phonenumber)}`;
            getAuth(`${API_URI}/saas/members/members/exists/?${q}`).catch(
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
      postAuth(`${API_URI}/saas/members/members/link/`, {
        email,
        phonenumber,
      })
        .then(() => {
          if (snackbarSuccess) {
            snackbarSuccess('member.link.success');
          }
          goToMemberList();
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
      (initial && { ...initial }) || {
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
        date_joined: Moment().format(DATE_FORMAT),
        accept_sms: true,
        accept_email: true,
        waiver: false,
        address_line_1: '',
        address_line_2: '',
        city: '',
        country: '',
        zipcode: '',

        vaccination_status: 'null',
      },
    enableReinitialize: true,

    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      setSubmitting(true);
      let { avatar } = values;
      if (typeof avatar === 'string' && avatar.includes('data:image/')) {
        const byteString = atob(avatar.split(',')[1]);
        const mimeString = avatar.split(',')[0].split(':')[1].split(';')[0];

        const buffer = new ArrayBuffer(byteString.length);
        const data = new DataView(buffer);

        // eslint-disable-next-line
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
        email: values.email || '',
        emergency_contact: values.emergency_contact || undefined,
        gender: values.gender || 'X',
        birthday:
          values &&
          values.birthday &&
          Moment(values.birthday).format('YYYY-MM-DD'),
      };
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(MemberForm);
