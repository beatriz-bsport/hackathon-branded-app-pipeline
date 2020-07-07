// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { compose } from 'recompose';

import { Moment } from '../../i18n';
import AvatarField from '../../components/forms/AvatarField.component';

import {
  MultipleCheckboxField,
  TextField,
  DelayTextField,
  PhoneField,
  GenderField,
  Actions,
  Submit,
  DateField,
  AddressFields,
} from '../../components/forms';
import { DATE_FORMAT } from '../../datetime';

const styles = (theme) => ({
  redPaperContainer: {
    padding: theme.spacing(3),
    background: 'rgba(206, 17, 38, 0.05)',
  },
  paperContainer: {
    padding: theme.spacing(3),
  },
  textInput: {
    marginRight: theme.spacing(1),
  },
  formControl: {
    minWidth: 130,
    marginRight: theme.spacing(1),
  },
  mergeTitle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
});

type Props = {
  classes: Object,
  t: TFunction,
  isSubmitting: boolean,
  theme: Object,
  emailExists: *,
  variant?: 'merge-form' | '',
  disabled?: boolean,
  fromConsumerAccess: ?boolean,
  hideManagerStuff: boolean,
  onCancel?: () => void,
};

export function MemberForm(props: Props) {
  const {
    classes,
    t,
    disabled,
    isSubmitting,
    variant,
    hideManagerStuff,
  } = props;
  const mdSize = variant === 'merge-form' ? 12 : 6;
  return (
    <div>
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
                ? t('member:forms.merge.srcMember')
                : t('member:forms.merge.dstMember')}
            </Typography>
          </div>
        ) : null}
        <Form>
          <Grid container spacing={2}>
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
                label={
                  props.theme && props.theme.first_name_label
                    ? props.theme.first_name_label
                    : t('translation:form.firstname')
                }
                required
                disabled={disabled}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <TextField
                name="lastname"
                label={
                  props.theme && props.theme.last_name_label
                    ? props.theme.last_name_label
                    : t('translation:form.lastname')
                }
                required
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <GenderField
                name="gender"
                label={t('translation:form.gender')}
                fullWidth
                required
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              {variant === 'merge-form' ? (
                <TextField
                  name="email"
                  label={t('translation:form.email')}
                  type="email"
                  fullWidth
                  required={!!props.fromConsumerAccess}
                  disabled={disabled || variant === 'merge-form'}
                />
              ) : (
                <DelayTextField
                  name="email"
                  label={t('translation:form.email')}
                  type="email"
                  fullWidth
                  required={!!props.fromConsumerAccess}
                  disabled={disabled || variant === 'merge-form'}
                />
              )}
            </Grid>
            {hideManagerStuff ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="membership_ID"
                  label={t('form.member.referenceNumber')}
                  helperText={t('form.member.referenceNumberHelper')}
                  fullWidth
                  disabled={disabled || !!props.fromConsumerAccess}
                />
              </Grid>
            )}
            {hideManagerStuff ? null : (
              <Grid item xs={12} md={mdSize}>
                <TextField
                  name="barcode"
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
                    label={t('translation:form.birthday')}
                    name="birthday"
                    returnMoment={false}
                    disableFuture
                    clearLabel={t('translation:form.clearDate')}
                    cancelLabel={t('translation:common.cancel')}
                    initialFocusedDate="1990/01/01"
                  />
                </Grid>
                {hideManagerStuff ? null : (
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
                      label={t('member:date_joined')}
                      cancelLabel={t('translation:common.cancel')}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <PhoneField
                name="phone"
                label={t('translation:form.phone')}
                fullWidth
                required={!!props.fromConsumerAccess}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <AddressFields
                name="address"
                required={!!props.fromConsumerAccess}
                label={t('translation:form.address')}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} md={mdSize}>
              <MultipleCheckboxField
                choices={[
                  {
                    id: 'accept_email',
                    optionLabel: t('translation:form.member.rgpd.email'),
                  },
                  {
                    id: 'accept_sms',
                    optionLabel: t('translation:form.member.rgpd.sms'),
                  },
                ]}
                label={t('translation:form.member.rgpdTitle')}
                name="rgpd"
                disabled={disabled}
              />
            </Grid>
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
  barcode: Yup.string().nullable(),
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
  withTranslation(['translation', 'member']),
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
        barcode: '',
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
    enableReinitialize: true,

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
