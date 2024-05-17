import React from 'react';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import HelpCircleOutlinedIcon from '@material-ui/icons/HelpOutline';

import { Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import Tooltip from '#components/Tooltip.component';
import AvatarField from '#components/forms/AvatarField.component';
import {
  TextField,
  PhoneField,
  DateField,
  GenderField,
  Actions,
  Submit,
  ColorField,
  // @ts-expect-error
} from '#components/forms';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

import type { CoachUpdateOrCreatedPayload } from '#libs/associated-coach/types';

import type { CoachDetailed } from '../../../api/types';
import type { OptionCallback } from '#state/types';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Coach,
);

type Props = {
  onCancel: () => void;
  initial?: CoachDetailed;
  country: string;
};

type HOCProps = {
  onSubmit: (
    payload: CoachUpdateOrCreatedPayload,
    options?: OptionCallback,
  ) => void;
  defaultEmail: string;
};
type InitialValues = {
  initial?: CoachDetailed;
  avatar: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  color: string;
  birthday: string;
  description: string;
  notes: string;
  date_joined_company: string | null;
  date_left_company: string | null;
  facebook_url: string;
  instagram_url: string;
};

export type CoachFormValues = Omit<InitialValues, 'initial'>;

export const CoachForm: React.FC<Props & FormikProps<InitialValues>> = ({
  isSubmitting,
  isValid,
  onCancel,
  initial,
  country,
  errors,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['translation', 'coach']);

  React.useEffect(() => {
    trackFormAdd(initial?.id);
  }, [initial?.id]);

  const cancel = React.useCallback(() => {
    onCancel();
    trackFormCancel(initial?.id);
  }, [initial?.id, onCancel]);

  return (
    <Paper className={classes.paperContainer}>
      <Form className={classes.content}>
        <div className={classes.avatar}>
          <AvatarField
            // @ts-expect-error
            name="avatar"
          />
        </div>

        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <TextField fullWidth label={t('form.firstname')} name="firstname" />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField fullWidth label={t('form.lastname')} name="lastname" />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              disabled={!!initial && !!initial.email}
              error={!!errors.email}
              helperText={!!errors.email && t('form.emailError')}
              InputLabelProps={{ shrink: true }}
              InputProps={
                !!initial && !!initial.email
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title={t('form.explainNoEmailChange')}>
                            <HelpCircleOutlinedIcon />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
              label={t('form.email')}
              name="email"
              type="email"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <PhoneField
              fullWidth
              country={country}
              label={t('form.phone')}
              name="phone"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <GenderField
              fullWidth
              required
              label={t('form.gender')}
              name="gender"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateField
              clearable
              disableFuture
              openToYearSelection
              cancelLabel={t('common.cancel')}
              clearLabel={t('form.clearDate')}
              format="D"
              initialFocusedDate="1990/01/01"
              label={t('form.birthday')}
              name="birthday"
              returnMoment={false}
            />
          </Grid>
          <Grid item className={classes.largeTopMargin} xs={12}>
            <TextField
              fullWidth
              multiline
              error={!!errors.description}
              helperText={
                errors.description
                  ? t(errors.description)
                  : t('form.descriptionHelperText')
              }
              label={t('form.description')}
              minRows={2}
              name="description"
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.largeBottomMargin} xs={12}>
            <TextField
              fullWidth
              multiline
              helperText={t('form.notesHelperText')}
              label={t('form.notes')}
              name="notes"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>{t('form.workingDateSection')}</Typography>
          </Grid>
          <Grid item className={classes.largeBottomMargin} md={6} xs={12}>
            <DateField
              allowNullValue
              clearable
              format="D"
              label={t('form.startWorking')}
              name="date_joined_company"
            />
          </Grid>
          <Grid item className={classes.largeBottomMargin} md={6} xs={12}>
            <DateField
              allowNullValue
              bottomError
              clearable
              format="D"
              label={t('form.endWorking')}
              name="date_left_company"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              error={!!errors.facebook_url}
              helperText={!!errors.facebook_url && t(errors.facebook_url)}
              label="Facebook URL"
              name="facebook_url"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              error={!!errors.instagram_url}
              helperText={!!errors.instagram_url && t(errors.instagram_url)}
              label="Instagram URL"
              name="instagram_url"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <ColorField
              transparentColorAvailable
              label={t('coach:color')}
              name="color"
            />
          </Grid>
        </Grid>
        <Actions>
          <Button color="secondary" disabled={isSubmitting} onClick={cancel}>
            {t('form.discard')}
          </Button>
          <Submit
            disabled={isSubmitting || !isValid}
            onClick={() => {
              trackFormSubmitIntent(initial?.id);
            }}
          >
            {t('form.send')}
          </Submit>
        </Actions>
      </Form>
      <LinearProgress
        style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
      />
    </Paper>
  );
};

const MARGIN_AVATAR = 140;

const useStyles = makeStyles((theme: Theme) => ({
  paperContainer: {
    maxWidth: 800,
    marginTop: MARGIN_AVATAR / 2,
  },
  content: {
    paddingTop: MARGIN_AVATAR / 2 + theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    position: 'relative',
  },
  avatar: {
    top: -MARGIN_AVATAR / 2,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  largeBottomMargin: {
    marginBottom: theme.spacing(4),
  },
  largeTopMargin: {
    marginTop: theme.spacing(1),
  },
}));

const CoachSchema = (props: Props) =>
  Yup.object().shape({
    avatar: Yup.string().nullable(false),
    firstname: Yup.string().nullable(false).required(),
    lastname: Yup.string().nullable(false).required(),
    email:
      props.initial?.email || !props.initial
        ? Yup.string().nullable(false).required().email()
        : Yup.string().nullable(true).email(),
    phone: Yup.string().nullable(true),
    gender: Yup.string().nullable(false).required(),
    color: Yup.string().nullable(false),
    birthday: Yup.string().nullable(true),
    description: Yup.string()
      .nullable(false)
      .max(1000, 'coach:forms.errorDescription'),
    notes: Yup.string().nullable(true),
    date_joined_company: Yup.string().nullable(true),
    date_left_company: Yup.string()
      .nullable(true)
      .test(
        'is-after-start',
        'errors.end_before_start',
        function checkIsAfterStart(date_left_company) {
          const { date_joined_company } = this.parent;

          return (
            date_left_company === null ||
            date_joined_company === null ||
            DateTime.fromISO(date_joined_company) <=
              DateTime.fromISO(date_left_company)
          );
        },
      ),
    facebook_url: Yup.string()
      .url('coach:forms.errorInvalidURL')
      .max(150, 'coach:forms.errorLinkLength')
      .nullable(false),
    instagram_url: Yup.string()
      .url('coach:forms.errorInvalidURL')
      .max(150, 'coach:forms.errorLinkLength')
      .nullable(false),
  });

const CoachFormHOC = withFormik<Props & HOCProps, InitialValues>({
  enableReinitialize: true,
  // @ts-expect-error
  mapPropsToValues: ({ initial, defaultEmail }: Props) =>
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
      notes: null,
      date_joined_company: null,
      date_left_company: null,
      facebook_url: '',
      instagram_url: '',
    },
  validationSchema: CoachSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const {
      avatar,
      birthday,
      phone,
      email,
      notes,
      date_joined_company,
      date_left_company,
    } = values;
    const data = {
      ...values,
      // @ts-expect-error
      avatar: typeof avatar !== 'string' ? avatar : undefined,
      birthday:
        (values && birthday && DateTime.fromISO(birthday).toISODate()) || '',
      phone: phone || undefined,
      email: (email && email.toLowerCase()) ?? '',
      notes: notes ?? '',
      date_joined_company: date_joined_company
        ? DateTime.fromISO(date_joined_company).toISODate()
        : undefined,
      date_left_company: date_left_company
        ? DateTime.fromISO(date_left_company).toISODate()
        : undefined,
    };
    onSubmit(data, {
      onSuccess: () => {
        // @ts-expect-error
        trackFormSuccess(data?.id);
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default CoachFormHOC(CoachForm);
