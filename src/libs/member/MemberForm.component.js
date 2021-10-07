// @flow
import React from 'react';
import lodash from 'lodash';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
import type { SignUpFormConfigDict } from '../sign-up-form/types';
import {
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_COMPLETED,
} from './utils';
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
  emailExists: *,
  variant?: 'merge-form' | '',
  disabled?: boolean,
  fromConsumerAccess: ?boolean,
  memberId: number,
  emailExistsError: boolean,
  asManager?: boolean,
  managerFormConfig: ?SignUpFormConfigDict,
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
  values: any,
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
const MemberGreetingBanner = (props: {
  userStatus: number,
  t: TFunction,
  initial: object,
}) => {
  const { userStatus, t, initial } = props;
  if (userStatus === USER_STATUS_VALIDATION_COMPLETED) {
    return null;
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
    return (
      <>
        <Typography variant="h5">
          {t('member:forms.needInformationValidation.welcome', {
            firstname: initial.firstname,
          })}
        </Typography>
        <Typography variant="h6">
          {t('member:forms.needInformationValidation.subtitle.memberOfCompany')}
        </Typography>
        <Typography variant="body1">
          {t('member:forms.needInformationValidation.legend.memberOfCompany')}
        </Typography>
      </>
    );
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY) {
    return (
      <>
        <Typography variant="h5">
          {t('member:forms.needInformationValidation.welcome', {
            firstname: initial.firstname,
          })}
        </Typography>
        <Typography variant="h6">
          {t('member:forms.needInformationValidation.subtitle.notMemberYet')}
        </Typography>
        <Typography variant="body1">
          {t('member:forms.needInformationValidation.legend.notMemberYet')}
        </Typography>
      </>
    );
  }
  return null;
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

const renderConfirmButtonText = (userStatus: number) => {
  if (userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY) {
    return 'member:forms.needInformationValidation.button.notMemberYet';
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
    return 'member:forms.needInformationValidation.button.memberOfCompany';
  }
  return 'translation:form.send';
};

const renderCancelButtonText = (userStatus: number) => {
  if (userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY) {
    return 'translation:common.disconnect';
  }
  if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
    return 'translation:common.disconnect';
  }
  return 'translation:common.cancel';
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
    managerFormConfig,
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
  if (
    !managerFormConfig ||
    !managerFormConfig.first_name ||
    !managerFormConfig.last_name ||
    !managerFormConfig.email ||
    !managerFormConfig.gender ||
    !managerFormConfig.phone ||
    !managerFormConfig.birthday ||
    !managerFormConfig.address_line_1 ||
    !managerFormConfig.address_line_2 ||
    !managerFormConfig.city ||
    !managerFormConfig.zipcode ||
    !managerFormConfig.country ||
    !managerFormConfig.photo ||
    !managerFormConfig.emergency_contact ||
    !managerFormConfig.accept_email ||
    !managerFormConfig.accept_sms ||
    !managerFormConfig.general_terms_and_conditions_accepted ||
    !managerFormConfig.waiver
  ) {
    return <LinearProgress />;
  }
  const WaiverPopUp = withConfirm(ButtonBase, 'onClick', {
    title: 'translation:form.member.waiver.dialog.title',
    confirm: 'translation:form.member.waiver.dialog.confirm',
    Content: () => <p>{props.waiver}</p>,
  });
  const checkUserProfilePicture = () => {
    if (props.values && !props.values.avatar) {
      return false;
    }
    if (props.values && props.values.avatar) {
      if (
        typeof props.values.avatar === 'string' &&
        (props.values.avatar.includes('gymnast-female.png') ||
          props.values.avatar.includes('gymnast-male.png'))
      ) {
        return false;
      }
    }
    return true;
  };
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

        {userStatus ? (
          <Grid className={classes.memberGreeting}>
            <MemberGreetingBanner
              userStatus={userStatus}
              t={t}
              initial={props.initial}
            />
          </Grid>
        ) : (
          <div className={classes.title}>
            <MemberFormTitle userStatus={userStatus} t={t} />
          </div>
        )}
        <Form>
          <Effect
            onChange={(prev, nxt) =>
              checkIfMemberExists(prev, nxt, checkUserExists)
            }
          />
          <Grid container spacing={2}>
            {((managerFormConfig &&
              managerFormConfig.photo &&
              managerFormConfig.photo.show_on_edition) ||
              !managerFormConfig) && (
              <Grid item xs={12} className={classes.photoContainer}>
                <div className={classes.photoWithError}>
                  <AvatarFieldWithButton
                    name="avatar"
                    disabled={
                      disabled ||
                      (!asManager &&
                        !managerFormConfig.photo.editable_on_edition)
                    }
                    required={
                      !asManager &&
                      !checkUserProfilePicture() &&
                      managerFormConfig.photo.mandatory_on_creation
                    }
                    buttonText={t('translation:form.modify')}
                  />
                  {!asManager &&
                    managerFormConfig.photo.mandatory_on_creation &&
                    !checkUserProfilePicture() && (
                      <Typography variant="caption" color="error">
                        {t('form.signup.addProfilePictureRequiredLabel')}
                      </Typography>
                    )}
                </div>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={mdSize}>
                <div className={classes.marginLeft}>
                  <TextField
                    shrink
                    name="firstname"
                    label={
                      (managerFormConfig &&
                        managerFormConfig.first_name &&
                        managerFormConfig.first_name.label) ||
                      t('translation:form.firstname')
                    }
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
                  label={
                    (managerFormConfig &&
                      managerFormConfig.last_name &&
                      managerFormConfig.last_name.label) ||
                    t('translation:form.lastname')
                  }
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
                      label={
                        (managerFormConfig &&
                          managerFormConfig.email &&
                          managerFormConfig.email.label) ||
                        t('translation:form.email')
                      }
                      type="email"
                      fullWidth
                      required={!asManager}
                      disabled={disabled || variant === 'merge-form'}
                    />
                  ) : (
                    <DelayTextField
                      name="email"
                      label={
                        (managerFormConfig &&
                          managerFormConfig.email &&
                          managerFormConfig.email.label) ||
                        t('translation:form.email')
                      }
                      type="email"
                      fullWidth
                      required={!asManager}
                      disabled={disabled || variant === 'merge-form'}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={mdSize}>
                {((managerFormConfig &&
                  managerFormConfig.gender.show_on_edition) ||
                  !managerFormConfig) && (
                  <GenderField
                    name="gender"
                    label={
                      (managerFormConfig && managerFormConfig.gender.label) ||
                      t('translation:form.gender')
                    }
                    fullWidth
                    required={
                      !asManager &&
                      managerFormConfig &&
                      managerFormConfig.gender.mandatory_on_creation
                    }
                    disabled={
                      disabled ||
                      (!asManager &&
                        managerFormConfig &&
                        !managerFormConfig.gender.editable_on_edition)
                    }
                  />
                )}
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
                {((managerFormConfig &&
                  managerFormConfig.birthday.show_on_edition) ||
                  !managerFormConfig) && (
                  <Grid item>
                    <DateField
                      keyboard
                      format="L"
                      required={
                        !asManager &&
                        (!!props.fromConsumerAccess ||
                          managerFormConfig.birthday.mandatory_on_creation)
                      }
                      openToYearSelection
                      clearable
                      disabled={
                        disabled ||
                        (!asManager &&
                          managerFormConfig &&
                          !managerFormConfig.birthday.editable_on_edition)
                      }
                      label={
                        managerFormConfig.birthday.label ||
                        t('translation:form.birthday')
                      }
                      name="birthday"
                      returnMoment={false}
                      disableFuture
                      clearLabel={t('translation:form.clearDate')}
                      cancelLabel={t('translation:common.cancel')}
                      initialFocusedDate="1990/01/01"
                    />
                  </Grid>
                )}
                {!asManager ? null : (
                  <Grid item>
                    <DateField
                      keyboard
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
                {((managerFormConfig &&
                  managerFormConfig.phone.show_on_edition) ||
                  !managerFormConfig) && (
                  <Grid item md={12} xs={12}>
                    <PhoneField
                      name="phone"
                      label={t('translation:form.phone')}
                      fullWidth
                      required={
                        !asManager &&
                        managerFormConfig.phone.mandatory_on_creation
                      }
                      disabled={
                        disabled ||
                        (!asManager &&
                          managerFormConfig &&
                          !managerFormConfig.phone.editable_on_edition)
                      }
                      country={browserCountryCode()}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid container xs={12} md={12} direction="row">
              <Grid item xs={12} md={mdSize}>
                <div className={classes.gridColumn}>
                  {((managerFormConfig &&
                    managerFormConfig.address_line_1.show_on_edition) ||
                    !managerFormConfig) && (
                    <TextField
                      required={
                        !asManager &&
                        managerFormConfig.address_line_1.mandatory_on_creation
                      }
                      name="address_line_1"
                      fullWidth
                      disabled={
                        disabled ||
                        (!asManager &&
                          managerFormConfig &&
                          !managerFormConfig.address_line_1.editable_on_edition)
                      }
                      label={
                        managerFormConfig.address_line_1.label ||
                        t('form.address.addressLine1')
                      }
                    />
                  )}
                  {((managerFormConfig &&
                    managerFormConfig.address_line_2.show_on_edition) ||
                    !managerFormConfig) && (
                    <TextField
                      name="address_line_2"
                      required={
                        !asManager &&
                        managerFormConfig.address_line_2.mandatory_on_creation
                      }
                      fullWidth
                      disabled={
                        disabled ||
                        (!asManager &&
                          managerFormConfig &&
                          !managerFormConfig.address_line_2.editable_on_edition)
                      }
                      label={
                        managerFormConfig.address_line_2.label ||
                        t('form.address.addressLine2')
                      }
                    />
                  )}
                  <Grid container direction="row" spacing={2}>
                    {((managerFormConfig &&
                      managerFormConfig.zipcode.show_on_edition) ||
                      !managerFormConfig) && (
                      <Grid item>
                        <TextField
                          name="zipcode"
                          label={
                            managerFormConfig.zipcode.label ||
                            t('form.address.zipcode')
                          }
                          disabled={
                            disabled ||
                            (!asManager &&
                              managerFormConfig &&
                              !managerFormConfig.zipcode.editable_on_edition)
                          }
                          required={
                            !asManager &&
                            managerFormConfig.zipcode.mandatory_on_creation
                          }
                        />
                      </Grid>
                    )}
                    {((managerFormConfig &&
                      managerFormConfig.city.show_on_edition) ||
                      !managerFormConfig) && (
                      <Grid item>
                        <TextField
                          name="city"
                          label={
                            managerFormConfig.city.label ||
                            t('form.address.city')
                          }
                          disabled={
                            disabled ||
                            (!asManager &&
                              managerFormConfig &&
                              !managerFormConfig.city.editable_on_edition)
                          }
                          required={
                            !asManager &&
                            managerFormConfig.city.mandatory_on_creation
                          }
                        />
                      </Grid>
                    )}
                  </Grid>
                  {((managerFormConfig &&
                    managerFormConfig.country.show_on_edition) ||
                    !managerFormConfig) && (
                    <TextField
                      name="country"
                      required={
                        !asManager &&
                        managerFormConfig.country.mandatory_on_creation
                      }
                      disabled={
                        disabled ||
                        (!asManager &&
                          managerFormConfig &&
                          !managerFormConfig.country.editable_on_edition)
                      }
                      label={
                        managerFormConfig.country.label ||
                        t('form.address.country')
                      }
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={6} md={mdSize}>
                <div className={classes.gridColumn}>
                  <Grid container direction="column">
                    {((managerFormConfig &&
                      managerFormConfig.emergency_contact.show_on_edition) ||
                      !managerFormConfig) && (
                      <TextField
                        name="emergency_contact"
                        label={
                          managerFormConfig.emergency_contact.label ||
                          t('translation:form.emergencyContact')
                        }
                        fullWidth
                        required={
                          !asManager &&
                          managerFormConfig.emergency_contact
                            .mandatory_on_creation
                        }
                        disabled={
                          disabled ||
                          (!asManager &&
                            managerFormConfig &&
                            !managerFormConfig.emergency_contact
                              .editable_on_edition)
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    style={{ marginTop: 12, marginBottom: 12 }}
                    item
                    xs={12}
                    md={mdSize}
                  >
                    {((managerFormConfig &&
                      managerFormConfig.vaccination_status?.show_on_edition) ||
                      !managerFormConfig) && (
                      <VaccinationStatusField
                        name="vaccination_status"
                        label={
                          (managerFormConfig &&
                            managerFormConfig.vaccination_status.label) ||
                          t('translation:common.vaccination_status')
                        }
                        fullWidth
                        required={
                          !asManager &&
                          managerFormConfig &&
                          managerFormConfig.vaccination_status
                            .mandatory_on_creation
                        }
                        disabled={
                          disabled ||
                          (!asManager &&
                            managerFormConfig &&
                            !managerFormConfig.vaccination_status
                              .editable_on_edition)
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl>
                      {((managerFormConfig &&
                        (managerFormConfig.accept_email.show_on_edition ||
                          managerFormConfig.accept_sms.show_on_edition)) ||
                        !managerFormConfig) && (
                        <Grid item xs={12} md={12}>
                          <FormLabel>
                            {t('translation:form.member.rgpdTitle')}
                          </FormLabel>
                        </Grid>
                      )}

                      <Grid item xs={12} md={12}>
                        {((managerFormConfig &&
                          managerFormConfig.accept_email.show_on_edition) ||
                          !managerFormConfig) && (
                          <CheckboxField
                            id="checkbox_accept_email"
                            name="accept_email"
                            disabled={
                              disabled ||
                              (!asManager &&
                                managerFormConfig &&
                                !managerFormConfig.accept_email
                                  .editable_on_edition)
                            }
                            label={t('translation:form.member.rgpd.email')}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {((managerFormConfig &&
                          managerFormConfig.accept_sms.show_on_edition) ||
                          !managerFormConfig) && (
                          <CheckboxField
                            id="checkbox_accept_sms"
                            name="accept_sms"
                            disabled={
                              disabled ||
                              (!asManager &&
                                managerFormConfig &&
                                !managerFormConfig.accept_sms
                                  .editable_on_edition)
                            }
                            label={t('translation:form.member.rgpd.sms')}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12} md={12}>
                        {props.waiver &&
                          ((managerFormConfig &&
                            managerFormConfig.waiver.show_on_edition) ||
                            !managerFormConfig) && (
                            <CheckboxField
                              id="checkbox_waiver"
                              name="waiver"
                              disabled={
                                disabled ||
                                (props.initial && props.initial.waiver) ||
                                (!asManager &&
                                  managerFormConfig &&
                                  !managerFormConfig.waiver.editable_on_edition)
                              }
                              required={
                                !asManager &&
                                managerFormConfig.waiver.mandatory_on_creation
                              }
                              label={
                                <Typography component="div">
                                  {t('translation:form.member.waiver.iAccept')}
                                  <WaiverPopUp
                                    waiver={props.waiver}
                                    onClick={() =>
                                      !asManager &&
                                      managerFormConfig &&
                                      !managerFormConfig.waiver
                                        .editable_on_edition &&
                                      setFieldValue('waiver', true)
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
                      {t(renderCancelButtonText(userStatus))}
                    </Button>
                  ) : null}
                  <Submit disabled={isSubmitting || props.emailExists}>
                    {t(renderConfirmButtonText(userStatus))}
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
          checkUserExists: lodash.debounce(({ email, phonenumber }) => {
            const q = email
              ? `email=${email}`
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
        checkUserExists: lodash.debounce(() => {}, 1000),
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
    mapPropsToValues: ({ initial, managerFormConfig }) =>
      (initial && { ...initial, managerFormConfig }) || {
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
        date_joined: Moment(),
        accept_sms: true,
        accept_email: true,
        waiver: false,
        address_line_1: '',
        address_line_2: '',
        city: '',
        country: '',
        zipcode: '',
        managerFormConfig,
        vaccination_status: 'null',
      },
    enableReinitialize: true,

    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      setSubmitting(true);
      const { managerFormConfig, ...cleanedValues } = values;
      let { avatar } = cleanedValues;
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
        ...cleanedValues,
        avatar: typeof avatar !== 'string' ? avatar : undefined,
        email: cleanedValues.email || '',
        emergency_contact: cleanedValues.emergency_contact || undefined,
        gender: cleanedValues.gender || 'X',
        birthday:
          cleanedValues &&
          cleanedValues.birthday &&
          Moment(cleanedValues.birthday).format('DD/MM/YYYY'),
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
