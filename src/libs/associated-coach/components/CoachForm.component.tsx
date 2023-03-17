import React from 'react';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';

import moment from 'moment-timezone';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import HelpCircleOutlinedIcon from '@material-ui/icons/HelpOutline';

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
} from '#components/forms';

import type { CoachDetailed } from '../../../api/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Coach,
);

type Props = {
  isSubmitting: boolean;
  onCancel: () => void;
  initial?: CoachDetailed;
  country: string;
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
  facebook_url: string;
  instagram_url: string;
};

export const CoachForm: React.FC<Props & FormikProps<InitialValues>> = ({
  isSubmitting,
  onCancel,
  initial,
  country,
  errors,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('translation');

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
          <AvatarField name="avatar" />
        </div>

        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField name="firstname" label={t('form.firstname')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="lastname" label={t('form.lastname')} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              InputLabelProps={{ shrink: true }}
              name="email"
              label={t('form.email')}
              type="email"
              disabled={!!initial && !!initial.email}
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
              fullWidth
              error={!!errors.email}
              helperText={!!errors.email && t('form.emailError')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PhoneField
              name="phone"
              label={t('form.phone')}
              fullWidth
              country={country}
            />
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
              format="L"
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
          <Button color="secondary" onClick={cancel} disabled={isSubmitting}>
            {t('form.discard')}
          </Button>
          <Submit
            disabled={isSubmitting}
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
    description: Yup.string().nullable(false),
    facebook_url: Yup.string().nullable(false),
    instagram_url: Yup.string().nullable(false),
  });

export const CoachFormHOC = withFormik({
  enableReinitialize: true,
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
      facebook_url: '',
      instagram_url: '',
    },
  validationSchema: CoachSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const { avatar, birthday, phone, email } = values;
    const data = {
      ...values,
      avatar: typeof avatar !== 'string' ? avatar : undefined,
      birthday:
        (values && birthday && moment(birthday).format('DD/MM/YYYY')) || '',
      phone: phone || undefined,
      email: (email && email.toLowerCase()) ?? '',
    };
    onSubmit(data, {
      onSuccess: () => {
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
