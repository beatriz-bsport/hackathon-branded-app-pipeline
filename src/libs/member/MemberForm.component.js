// @flow
import React from 'react';
import lodash from 'lodash';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, Form, connect as formikConnect } from 'formik';

import { compose, withPropsOnChange, withProps, withState } from 'recompose';
import { getAuth, postAuth, API_URI } from '../../http';

import { Moment } from '../../i18n';
import AvatarField from '../../components/forms/AvatarField.component';

import {
  MultipleCheckboxField,
  TextField,
  PhoneField,
  GenderField,
  Actions,
  Submit,
  DateField,
  AddressFields,
} from '../../components/forms';
import AlertExistingUser from './AlertExistingUser.component';
import { DATE_FORMAT } from '../../datetime';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  textInput: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    minWidth: 130,
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  classes: Object,
  t: TFunction,
  isSubmitting: boolean,
  onCancel: (*) => void,
  emailExists: *,
  variant?: 'merge-form' | '',
  disabled?: boolean,
  fromConsumerAccess: ?boolean,

  checkUserExists: ({ email?: string, phonenumber?: string }) => void,
  goToMember: (number) => void,
  linkMember: (number) => void,
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
  emailExists: { email: string, exists: boolean },
  goToMember: () => void,
  linkMember: () => void,
}) => {
  const { emailExists, goToMember, linkMember } = props;
  if (!emailExists) {
    return null;
  }
  const { email, phonenumber, exists } = emailExists;
  if (!exists) {
    return null;
  }

  return (
    <AlertExistingUser
      email={email}
      phonenumber={phonenumber}
      memberId={exists.member_pk}
      goToMember={goToMember}
      linkMember={linkMember}
    />
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
    onCancel,
    checkUserExists,
  } = props;
  const mdSize = variant === 'merge-form' ? 12 : 6;

  return (
    <div>
      <MemberExistsBanner
        emailExists={props.emailExists}
        linkMember={props.linkMember}
        goToMember={props.goToMember}
      />
      <div className={classes.paperContainer}>
        <Form>
          <Effect
            onChange={(prev, nxt) =>
              checkIfMemberExists(prev, nxt, checkUserExists)
            }
          />
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <div
                style={props.fromConsumerAccess ? { visibility: 'hidden' } : {}}
              >
                <AvatarField name="avatar" disabled={disabled} />
              </div>
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <TextField
                name="firstname"
                label={t('form.firstname')}
                required
                disabled={disabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <TextField
                name="lastname"
                label={t('form.lastname')}
                required
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <GenderField
                name="gender"
                label={t('form.gender')}
                fullWidth
                required
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <TextField
                name="email"
                label={t('form.email')}
                type="email"
                fullWidth
                required={!!props.fromConsumerAccess}
                disabled={disabled || variant === 'merge-form'}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <TextField
                name="membership_ID"
                label={t('form.member.referenceNumber')}
                helperText={t('form.member.referenceNumberHelper')}
                fullWidth
                disabled={disabled || !!props.fromConsumerAccess}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <Grid container direction="row" spacing={16}>
                <Grid item>
                  <DateField
                    format="DD/MM/YYYY"
                    keyboard
                    required={!!props.fromConsumerAccess}
                    mask={(value) => {
                      if (value) {
                        return [
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ];
                      }
                      return [];
                    }}
                    openToYearSelection
                    clearable
                    disabled={disabled}
                    label={t('form.birthday')}
                    name="birthday"
                    returnMoment={false}
                    disableFuture
                    clearLabel={t('form.clearDate')}
                    cancelLabel={t('common.cancel')}
                    initialFocusedDate="1990/01/01"
                  />
                </Grid>
                <Grid item>
                  <DateField
                    required={!!props.fromConsumerAccess}
                    mask={(value) => {
                      if (value) {
                        return [
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                        ];
                      }
                      return [];
                    }}
                    keyboard
                    format="YYYY-MM-DD"
                    name="date_joined"
                    disabled={disabled}
                    label={t('member.date_joined')}
                    cancelLabel={t('common.cancel')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <PhoneField
                name="phone"
                label={t('form.phone')}
                fullWidth
                required={!!props.fromConsumerAccess}
                disabled={disabled || variant === 'merge-form'}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <AddressFields
                name="address"
                required={!!props.fromConsumerAccess}
                label={t('form.address')}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <MultipleCheckboxField
                choices={[
                  {
                    id: 'accept_email',
                    optionLabel: t('form.member.rgpd.email'),
                  },
                  {
                    id: 'accept_sms',
                    optionLabel: t('form.member.rgpd.sms'),
                  },
                ]}
                label={t('form.member.rgpdTitle')}
                name="rgpd"
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12}>
              {!disabled ? (
                <Actions>
                  <Button
                    color="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    {t('form.discard')}
                  </Button>
                  <Submit disabled={isSubmitting}>{t('form.send')}</Submit>
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
      <MemberExistsBanner
        emailExists={props.emailExists}
        linkMember={props.linkMember}
        goToMember={props.goToMember}
      />
    </div>
  );
}

const MemberSchema = Yup.object().shape({
  firstname: Yup.string(),
  lastname: Yup.string(),
  email: Yup.string().nullable(),
  phone: Yup.string()
    .nullable()
    .notRequired(),
  gender: Yup.string().matches(/(F|M|X)/),
  birthday: Yup.string()
    .nullable()
    .notRequired(),
  membership_ID: Yup.string().nullable(),
  date_joined: Yup.string().nullable(),
  rgpd: Yup.object()
    .shape({})
    .nullable(),
  address: Yup.object()
    .nullable()
    .shape({
      address_line_1: Yup.string(),
      address_line_2: Yup.string(),
      city: Yup.string(),
      country: Yup.string(),
      zipcode: Yup.string(),
    }),
  avatar: Yup.object().nullable(),
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
  withState('emailExists', 'setEmailExists', false),
  withPropsOnChange(['setEmailExists'], ({ setEmailExists }) => ({
    checkUserExists: lodash.debounce(({ email, phonenumber }) => {
      const q = email
        ? `email=${email}`
        : `phonenumber=${encodeURIComponent(phonenumber)}`;
      getAuth(`${API_URI}/saas/members/members/exists/?${q}`).catch((error) => {
        const { status, data } = error.response || {};
        if (status !== 404) {
          setEmailExists({ email, phonenumber, exists: data || {} });
          window.scrollTo(0, 0);
        }
      });
    }, 1000),
  })),
  withProps(
    ({ emailExists, goToMemberList, goToMember, snackbarSuccess, t }) => ({
      linkMember: () => {
        const { email, phonenumber } = emailExists;
        postAuth(`${API_URI}/saas/members/members/link/`, {
          email,
          phonenumber,
        })
          .then(() => {
            snackbarSuccess(t('member.link.success'));
            goToMemberList();
          })
          .catch((error) => {
            const { status, data } = error.response || {};
            if (status === 302) {
              goToMember(data.member_pk);
            }
          });
      },
    }),
  ),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        avatar: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: 'F',
        birthday: undefined,
        membership_ID: '',
        date_joined: Moment().format(DATE_FORMAT),
        rgpd: {
          accept_sms: true,
          accept_email: true,
        },
        address: {
          address_line_1: '',
          address_line_2: '',
          city: '',
          country: '',
          zipcode: '',
        },
      },
    validationSchema: MemberSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const { avatar } = values;
      const data = {
        ...values,
        avatar: typeof avatar !== 'string' ? avatar : undefined,
        email: values.email || '',
        birthday:
          values &&
          values.birthday &&
          Moment(values.birthday).format('DD/MM/YYYY'),
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
