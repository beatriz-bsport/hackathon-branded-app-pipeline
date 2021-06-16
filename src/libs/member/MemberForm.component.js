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
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import * as Yup from 'yup';
import { withFormik, Form, connect as formikConnect } from 'formik';
import { compose, withPropsOnChange, withProps, withState } from 'recompose';
import { FormLabel } from '@material-ui/core';
import i18n, { browserCountryCode, Moment } from '../../i18n';
import { getAuth, postAuth, API_URI } from '../../http';
import AvatarFieldWithButton from '../../components/forms/AvatarFieldWithButton.component';
import {
  CheckboxField,
  TextField,
  DelayTextField,
  PhoneField,
  GenderField,
  Actions,
  Submit,
  DateField,
} from '../../components/forms';
import AlertExistingUser from './AlertExistingUser.component';
import { DATE_FORMAT } from '../../utils/datetime';
import type { SignUpFormConfigDict } from '../sign-up-form/types';
import {
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_COMPLETED,
} from './utils';

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
    marginBottom: theme.spacing(1),
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
  hideManagerStuff: boolean,
  managerFormConfig: ?SignUpFormConfigDict,
  onCancel?: () => void,
  checkUserExists: ({ email?: string, phonenumber?: string }) => void,
  goToMember: (number) => void,
  goToMerge: (number, number) => void,

  linkMember: (number) => void,
  userStatus: number,
  initial: object,
  errors: *,
};

const Effect = formikConnect(
  class __ extends React.Component<{ formik: *, onChange: (*) => void }> {
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
    hideManagerStuff,
    managerFormConfig,
    userStatus,
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
          error === 'waiver',
      );
    }
    return [];
  };

  return (
    <div>
      {variant === 'merge-form' || hideManagerStuff ? null : (
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
            {((managerFormConfig && managerFormConfig.photo.show_on_edition) ||
              !managerFormConfig) && (
              <Grid item xs={12} className={classes.photoContainer}>
                <AvatarFieldWithButton
                  name="avatar"
                  disabled={disabled}
                  required={
                    hideManagerStuff &&
                    managerFormConfig.photo.mandatory_on_creation
                  }
                  buttonText={t('translation:form.modify')}
                />
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={mdSize}>
                <TextField
                  shrink="true"
                  name="firstname"
                  label={
                    managerFormConfig.first_name.label ||
                    t('translation:form.firstname')
                  }
                  required
                  disabled={disabled}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="lastname"
                  shrink="true"
                  label={
                    managerFormConfig.last_name.label ||
                    t('translation:form.lastname')
                  }
                  required
                  fullWidth
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12} md={mdSize}>
                {variant === 'merge-form' ? (
                  <TextField
                    name="email"
                    shrink="true"
                    label={
                      managerFormConfig.email.label ||
                      t('translation:form.email')
                    }
                    type="email"
                    fullWidth
                    required={!!props.fromConsumerAccess}
                    disabled={disabled || variant === 'merge-form'}
                  />
                ) : (
                  <DelayTextField
                    name="email"
                    label={
                      managerFormConfig.email.label ||
                      t('translation:form.email')
                    }
                    type="email"
                    fullWidth
                    required={!!props.fromConsumerAccess}
                    disabled={disabled || variant === 'merge-form'}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={mdSize}>
                {((managerFormConfig &&
                  managerFormConfig.gender.show_on_edition) ||
                  !managerFormConfig) && (
                  <GenderField
                    name="gender"
                    label={
                      managerFormConfig.gender.label ||
                      t('translation:form.gender')
                    }
                    fullWidth
                    required={
                      hideManagerStuff &&
                      managerFormConfig.gender.mandatory_on_creation
                    }
                    disabled={disabled}
                  />
                )}
              </Grid>
            </Grid>

            {hideManagerStuff ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="membership_ID"
                  label={t('form.member.referenceNumber')}
                  helperText={t('form.member.referenceNumberHelper')}
                  fullWidth
                  shrink="true"
                  disabled={disabled || !!props.fromConsumerAccess}
                />
              </Grid>
            )}
            {hideManagerStuff ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="barcode"
                  shrink="true"
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
                        !!props.fromConsumerAccess ||
                        (hideManagerStuff &&
                          managerFormConfig.birthday.mandatory_on_creation)
                      }
                      openToYearSelection
                      clearable
                      disabled={disabled}
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
                {hideManagerStuff ? null : (
                  <Grid item>
                    <DateField
                      required={!!props.fromConsumerAccess}
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
                        !!props.fromConsumerAccess ||
                        (hideManagerStuff &&
                          managerFormConfig.phone.mandatory_on_creation)
                      }
                      disabled={disabled}
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
                        !!props.fromConsumerAccess ||
                        (hideManagerStuff &&
                          managerFormConfig.address_line_1
                            .mandatory_on_creation)
                      }
                      name="address_line_1"
                      fullWidth
                      disabled={!!disabled}
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
                        !!props.fromConsumerAccess ||
                        (hideManagerStuff &&
                          managerFormConfig.address_line_2
                            .mandatory_on_creation)
                      }
                      fullWidth
                      disabled={!!disabled}
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
                          disabled={!!disabled}
                          required={
                            !!props.fromConsumerAccess ||
                            (hideManagerStuff &&
                              managerFormConfig.zipcode.mandatory_on_creation)
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
                          disabled={!!disabled}
                          required={
                            !!props.fromConsumerAccess ||
                            (hideManagerStuff &&
                              managerFormConfig.city.mandatory_on_creation)
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
                        !!props.fromConsumerAccess ||
                        (hideManagerStuff &&
                          managerFormConfig.country.mandatory_on_creation)
                      }
                      disabled={!!disabled}
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
                  <Grid conatiner direction="column">
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
                          !!props.fromConsumerAccess ||
                          (hideManagerStuff &&
                            managerFormConfig.emergency_contact
                              .mandatory_on_creation)
                        }
                        disabled={disabled}
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
                            disabled={disabled}
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
                            disabled={disabled}
                            label={t('translation:form.member.rgpd.sms')}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {((managerFormConfig &&
                          managerFormConfig.waiver.show_on_edition) ||
                          !managerFormConfig) && (
                          <CheckboxField
                            id="checkbox_waiver"
                            name="waiver"
                            disabled={disabled}
                            label={t('translation:form.member.waiver')}
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
      {variant === 'merge-form' || hideManagerStuff ? null : (
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

const phoneRegExp = /^\+?1?\d{9,15}$/;

const MemberSchema = Yup.object().shape({
  firstname: Yup.string().test(
    'first_name_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.first_name.mandatory_on_creation
        ? !!item
        : true;
    },
  ),
  lastname: Yup.string().test(
    'last_name_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.last_name.mandatory_on_creation
        ? !!item
        : true;
    },
  ),
  email: Yup.string().test('email_required', 'Required', function (item) {
    return this.parent.managerFormConfig.email.mandatory_on_creation
      ? !!item
      : true;
  }),
  gender: Yup.string().test('gender_required', 'Required', function (item) {
    return this.parent.managerFormConfig.gender.mandatory_on_creation
      ? !!item
      : true;
  }),
  birthday: Yup.string().test('birthday_required', 'Required', function (item) {
    return this.parent.managerFormConfig.birthday.mandatory_on_creation
      ? !!item
      : true;
  }),
  phone: Yup.string()
    .nullable()
    .matches(phoneRegExp, i18n.t('member:forms.phone.error'))
    .test('phone_required', 'Required', function (item) {
      return this.parent.managerFormConfig.phone.mandatory_on_creation
        ? !!item
        : true;
    }),
  emergency_contact: Yup.string().test(
    'emergency_contact_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.emergency_contact
        .mandatory_on_creation
        ? !!item
        : true;
    },
  ),
  address_line_1: Yup.string().test(
    'address_line_1_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.address_line_1.mandatory_on_creation
        ? !!item
        : true;
    },
  ),
  address_line_2: Yup.string().test(
    'address_line_2_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.address_line_2.mandatory_on_creation
        ? !!item
        : true;
    },
  ),

  city: Yup.string().test('city_required', 'Required', function (item) {
    return this.parent.managerFormConfig.city.mandatory_on_creation
      ? !!item
      : true;
  }),
  country: Yup.string().test('country_required', 'Required', function (item) {
    return this.parent.managerFormConfig.country.mandatory_on_creation
      ? !!item
      : true;
  }),
  zipcode: Yup.string().test('zipcode_required', 'Required', function (item) {
    return this.parent.managerFormConfig.zipcode.mandatory_on_creation
      ? !!item
      : true;
  }),
  avatar: Yup.string().test('avatar_required', 'Required', function (item) {
    return this.parent.managerFormConfig.photo.mandatory_on_creation
      ? !!item
      : true;
  }),
  accept_sms: Yup.boolean().test(
    'accept_sms_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.accept_sms.mandatory_on_creation
        ? item
        : true;
    },
  ),
  accept_email: Yup.boolean().test(
    'accept_email_required',
    'Required',
    function (item) {
      return this.parent.managerFormConfig.accept_email.mandatory_on_creation
        ? item
        : true;
    },
  ),
  waiver: Yup.boolean().test('waiver_required', 'Required', function (item) {
    return this.parent.managerFormConfig.waiver.mandatory_on_creation
      ? item
      : true;
  }),
  barcode: Yup.string().nullable(),
  membership_ID: Yup.string().nullable(),
  date_joined: Yup.string().nullable(),
});
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
        phone: '',
        emergency_contact: '',
        gender: 'F',
        birthday: undefined,
        membership_ID: '',
        barcode: '',
        date_joined: Moment().format(DATE_FORMAT),
        accept_sms: true,
        accept_email: true,
        waiver: false,
        address: {
          address_line_1: '',
          address_line_2: '',
          city: '',
          country: '',
          zipcode: '',
        },
        managerFormConfig,
      },
    enableReinitialize: true,

    validationSchema: MemberSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
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
