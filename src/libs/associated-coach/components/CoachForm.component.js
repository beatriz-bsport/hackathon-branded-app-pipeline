// @flow
import React from 'react';
import { compose } from 'recompose';

import * as Yup from 'yup';
import moment from 'moment';
import { withFormik, Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AvatarField from '../../../components/forms/AvatarField.component';

import {
  TextField,
  PhoneField,
  DateField,
  GenderField,
  Actions,
  Submit,
  ColorField,
} from '../../../components/forms';

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
              InputLabelProps={{ shrink: true }}
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
            <DateField
              format="DD/MM/YYYY"
              openToYearSelection
              clearable
              label={t('form.birthday')}
              name="birthday"
              returnMoment={false}
              disableFuture
              clearLabel={t('form.clearDate')}
              cancelLabel={t('common.cancel')}
              initialFocusedDate="1990/01/01"
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
          <Grid item xs={12} md={6}>
            <ColorField
              label={t('coach:color')}
              name="color"
              transparentColorAvailable
            />
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
    enableReinitialize: true,
    mapPropsToValues: ({ initial, defaultEmail }) =>
      initial || {
        avatar: '',
        firstname: '',
        lastname: '',
        email: defaultEmail,
        phone: '',
        gender: 'F',
        color: '',
        birthday: null,
        description: '',
        facebook_url: '',
        instagram_url: '',
      },
    validationSchema: CoachSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const { avatar } = values;
      const data = {
        ...values,
        avatar: typeof avatar !== 'string' ? avatar : undefined,
        birthday:
          (values &&
            values.birthday &&
            moment(values.birthday).format('DD/MM/YYYY')) ||
          '',
        phone: values.phone || undefined,
        email: values.email || '',
      };
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(CoachForm);
