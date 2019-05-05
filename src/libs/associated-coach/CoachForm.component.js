// @flow

import React from 'react';
import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AvatarField from '../../components/forms/AvatarField.component';

import {
  TextField,
  PhoneField,
  GenderField,
  Actions,
  Submit,
} from '../../components/forms';

type Props = {
  isSubmitting: boolean,
  classes: Object,
  t: TFunction,
  onCancel: () => void,
};

export function CoachForm(props: Props) {
  const { classes, t, isSubmitting, onCancel } = props;
  return (
    <Paper className={classes.paperContainer}>
      <Form className={classes.content}>
        <div className={classes.avatar}>
          <AvatarField name="avatar" />
        </div>

        <Grid container spacing={8} className={classes.fieldset}>
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
            <TextField
              name="email"
              label={t('form.email')}
              type="email"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PhoneField name="phone" label={t('form.phone')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <GenderField
              name="gender"
              label={t('form.gender')}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="birthYear"
              type="number"
              label={t('form.birthdayYear')}
              name="birthdayYear"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              name="description"
              label={t('form.description')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="facebook_url" label="Facebook URL" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="instagram_url" label="Instagram URL" fullWidth />
          </Grid>
        </Grid>
        <Actions>
          <Button color="secondary" onClick={onCancel} disabled={isSubmitting}>
            {t('form.discard')}
          </Button>
          <Submit disabled={isSubmitting}>{t('form.send')}</Submit>
        </Actions>
      </Form>
      <LinearProgress
        style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
      />
    </Paper>
  );
}

const MARGIN_AVATAR = 140;

const styles = (theme) => ({
  paperContainer: {
    maxWidth: 800,
    marginTop: MARGIN_AVATAR / 2,
  },
  content: {
    paddingTop: MARGIN_AVATAR / 2 + theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    position: 'relative',
  },
  avatar: {
    top: -MARGIN_AVATAR / 2,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
});

const CoachSchema = Yup.object().shape({});

export default compose(
  withStyles(styles),
  withNamespaces([]),
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
        description: '',
        facebook_url: '',
        instagram_url: '',
      },
    validationSchema: CoachSchema,
    handleSubmit: (
      values,
      { props: { onSubmit }, setSubmitting, setFieldError },
    ) => {
      const { avatar } = values;
      const data = {
        ...values,
        avatar: typeof avatar !== 'string' ? avatar : undefined,
        birthdayYear: values.birthdayYear || undefined,
        phone: values.phone || undefined,
        email: values.email || '',
      };
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: (errors) => {
          setSubmitting(false);
        },
      });
    },
  }),
)(CoachForm);
