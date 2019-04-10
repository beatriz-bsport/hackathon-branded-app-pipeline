// @flow
import React from 'react';
import lodash from 'lodash';
import { Button, LinearProgress, Grid, withStyles } from '@material-ui/core';
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
  const { classes, t, isSubmitting, onCancel, checkUserExists } = props;
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
            <Grid item xs={12} md={12}>
              <AvatarField name="avatar" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstname"
                label={t('form.firstname')}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastname"
                label={t('form.lastname')}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <GenderField
                name="gender"
                label={t('form.gender')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label={t('form.email')}
                type="email"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="membership_ID"
                label={t('form.member.referenceNumber')}
                helperText={t('form.member.referenceNumberHelper')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container direction="row" spacing={16}>
                <Grid item>
                  <TextField
                    type="number"
                    label={t('form.birthdayYear')}
                    name="birthdayYear"
                  />
                </Grid>
                <Grid item>
                  <DateField
                    format="DD/MM/YYYY"
                    name="date_joined"
                    label={t('member.date_joined')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <PhoneField name="phone" label={t('form.phone')} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <AddressFields name="address" label={t('form.address')} />
            </Grid>
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </Form>
        <LinearProgress
          style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
        />
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
  gender: Yup.string().matches(/(F|M)/),
  birthdayYear: Yup.string()
    .matches(/((19|20)[0-9][0-9])/)
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
        }
      });
    }, 1000),
  })),
  withProps(
    ({
      emailExists,
      goToMemberList,
      goToMember,
      refreshListMember,
      snackbar,
      t,
    }) => ({
      linkMember: () => {
        const { email, phonenumber } = emailExists;
        postAuth(`${API_URI}/saas/members/members/link/`, {
          email,
          phonenumber,
        })
          .then(() => {
            snackbar.success(t('member.link.success'));
            refreshListMember();
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
        birthdayYear: '',
        membership_ID: '',
        date_joined: Moment().format('DD/MM/YYYY'),
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
        birthdayYear: values.birthdayYear || '',
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
