// @flow

import React from 'react';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TuneIcon from '@material-ui/icons/Tune';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Alert from '@material-ui/lab/Alert';
import CancelIcon from '@material-ui/icons/Cancel';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import { compose } from 'recompose';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import ImageField from '../../../components/forms/ImageField.component';
import {
  Submit,
  TextField,
  DurationField,
  ColorField,
  CheckboxField,
  IntegerField,
} from '../../../components/forms';
import SCTSelectField from '../../category/components/SCTSelectorField.component';
import MetaActivityCustomRestrictionsForm from './MetaActivityCustomRestrictionsForm.component';
import { formatDurationFromMinute } from '../../../utils/duration';

const MetaActivitySchema = Yup.object().shape({
  cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  last_booking_minutes: Yup.number(),
  last_discard_minutes: Yup.number(),
  first_booking_minutes_until: Yup.number(),
  is_broadcast: Yup.boolean(),
  color: Yup.string(),
  SCT: Yup.number().required(),
  auto_discard_active: Yup.boolean(),
  auto_discard_hours_before_start: Yup.number(),
  auto_discard_min_bookings_nb: Yup.number(),
  alt_cover_main: Yup.string(),
  // category: Yup.number().nullable(true),
  custom_restriction_rule: Yup.array()
    .of(
      Yup.object().shape({
        tags: Yup.array().of(Yup.number()).min(1).required(),
        last_discard_minutes: Yup.number().nullable(false),
        last_booking_minutes: Yup.number().nullable(false),
        first_booking_minutes_until: Yup.number().nullable(false),
      }),
    )
    .max(3),
});

type Props = {
  SCTs: *[],
  classes: Object,
  t: TFunction,
  onCancel: () => void,
  isSubmitting: boolean,
  variant: ?string,
  is_broadcast_enabled: boolean,
  values: any,
  tags: number[],
  initial: any,
  handleBlur: {
    (e: React.FocusEvent<HTMLInputElement>): void,
  },
};

export function MetaActivityForm(props: Props) {
  const { isSubmitting, SCTs, classes, t, variant, tags, initial } = props;
  const {
    auto_discard_hours_before_start,
    auto_discard_min_bookings_nb,
    auto_discard_active,
    last_booking_minutes,
    first_booking_minutes_until,
  } = props.values;
  const {
    trackFormSubmitIntent,

    trackFormCancel,
    trackFormAdd,
  } = React.useMemo(
    () =>
      rudderStackFormTrackingFunctionsRegistry(
        variant === 'workshop'
          ? SegmentAnalyticsFormObjectIdentifier.Workshop
          : SegmentAnalyticsFormObjectIdentifier.Activity,
      ),
    [variant],
  );
  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Form>
      <ImageField
        id="button_activity_image"
        name="cover_main"
        subHelper={props.t('activity.explainImage')}
      />
      <div className={classnames(classes.field, classes.altField)}>
        <TextField
          fullWidth
          inputProps={{ maxLength: 100 }}
          label={t('activity.altCoverMain')}
          name="alt_cover_main"
        />
      </div>
      <div className={classes.container}>
        <div className={classes.headerWithIcon}>
          <InfoIcon
            className={classnames(classes.leftIcon, classes.greyIcon)}
          />
          <Typography variant="h6">{t('activity.generalInfo')}</Typography>
        </div>
        <TextField
          fullWidth
          required
          id="textfield_activity_title"
          inputProps={{ maxLength: 100 }}
          label={t('activity.name')}
          name="name"
        />
        <div className={classes.field}>
          <SCTSelectField
            fullWidth
            required
            id="select_activity_category"
            label={t('activity.category')}
            name="SCT"
            onBlur={props.handleBlur}
            scts={SCTs}
          />
          <Typography
            className={classes.explain}
            color="textSecondary"
            variant="caption"
          >
            {props.t('metaActivityCategory.sctExplain')}
          </Typography>
        </div>
        <div className={classes.field}>
          <TextField
            fullWidth
            multiline
            required
            id="textfield_activity_description"
            label={t('activity.description')}
            name="description"
            rows={5}
            variant="outlined"
          />
        </div>
        <div className={classes.field}>
          <CheckboxField
            disabled={!props.is_broadcast_enabled}
            id="checkbox_activity_broadcast"
            label={t('activity.is_broadcast')}
            name="is_broadcast"
          />
        </div>
        <div className={classes.field}>
          <ColorField
            transparentColorAvailable
            id="textfield_activity_color"
            label={t('activity.color')}
            name="color"
          />
        </div>
        <div className={classes.restrictionsSection}>
          <div className={classes.headerWithIcon}>
            <TuneIcon
              className={classnames(classes.leftIcon, classes.greyIcon)}
            />
            <Typography variant="h6">{t('restrictions.header')}</Typography>
          </div>
          <div className={classes.restrictionSubSection}>
            <div className={classes.headerWithIcon}>
              <EventAvailableIcon
                className={classnames(classes.leftIcon, classes.greyIcon)}
              />
              <Typography className={classes.subtitle1bold} variant="subtitle1">
                {t('restrictions.lastBookingBeforeMinutes')}
              </Typography>
            </div>
            <div className={classes.field}>
              <DurationField
                fullWidth
                required
                label={
                  variant === 'workshop'
                    ? t('workshopActivity.lastBookingBeforeMinutes')
                    : t('activity.lastBookingBeforeMinutes')
                }
                name="last_booking_minutes"
                variant={variant === 'workshop' ? 'long' : null}
              />
              {!!(last_booking_minutes && last_booking_minutes > 60 * 2) && (
                <Alert className={classes.alignCenter} severity="warning">
                  {t(
                    'metaActivity:forms.warning.highLastBookingBeforeWarning',
                    {
                      durationFormatted: formatDurationFromMinute(
                        last_booking_minutes,
                        t,
                      ),
                    },
                  )}
                </Alert>
              )}
            </div>
          </div>
          <div className={classes.restrictionSubSection}>
            <div className={classes.headerWithIcon}>
              <EventBusyIcon
                className={classnames(classes.leftIcon, classes.greyIcon)}
              />
              <Typography className={classes.subtitle1bold} variant="subtitle1">
                {t('restrictions.lastDiscardBeforeMinutes')}
              </Typography>
            </div>
            <div className={classes.field}>
              <DurationField
                fullWidth
                required
                label={
                  variant === 'workshop'
                    ? t('workshopActivity.lastDiscardBeforeMinutes')
                    : t('activity.lastDiscardBeforeMinutes')
                }
                name="last_discard_minutes"
              />
            </div>
          </div>
          <div className={classes.restrictionSubSection}>
            <div className={classes.headerWithIcon}>
              <DateRangeIcon
                className={classnames(classes.leftIcon, classes.greyIcon)}
              />
              <Typography className={classes.subtitle1bold} variant="subtitle1">
                {t('restrictions.firstBookingMinutesUntil')}
              </Typography>
            </div>
            <div className={classes.field}>
              <DurationField
                fullWidth
                required
                label={t('activity.firstBookingMinutesUntil')}
                name="first_booking_minutes_until"
              />
              {!!(
                first_booking_minutes_until &&
                first_booking_minutes_until < 60 * 24
              ) && (
                <Alert className={classes.alignCenter} severity="warning">
                  {t('metaActivity:forms.warning.lowFirsBookingUntilWarning', {
                    durationFormatted: formatDurationFromMinute(
                      first_booking_minutes_until,
                      t,
                    ),
                  })}
                </Alert>
              )}
              {!first_booking_minutes_until && (
                <Alert className={classes.alignCenter} severity="warning">
                  {t('activity.firstMinutesBookingUntilWarning')}
                </Alert>
              )}
            </div>
          </div>
        </div>
        <MetaActivityCustomRestrictionsForm tags={tags} variant={variant} />
        <div className={classes.autoDiscardSection}>
          <div className={classes.headerWithIcon}>
            <CancelIcon
              className={classnames(classes.leftIcon, classes.greyIcon)}
            />
            <Typography variant="h6">{t('activity.autoDiscard')}</Typography>
          </div>
          <div className={classes.autoDiscardInnerSection}>
            <div className={classes.field}>
              <CheckboxField
                id="checkbox_auto_discard_active"
                label={t('metaActivity.forms.autoDiscard.checkbox')}
                name="auto_discard_active"
              />
            </div>
            {auto_discard_active ? (
              <>
                <Typography className={classes.field}>
                  {t('metaActivity.forms.autoDiscard.explain', {
                    hours: auto_discard_hours_before_start,
                    bookings_nb: auto_discard_min_bookings_nb,
                  })}
                </Typography>
                <div className={classes.paramContainer}>
                  <div className={classes.inlineNumericField}>
                    <Typography className={classes.params} variant="caption">
                      {t('metaActivity.forms.autoDiscard.min_bookings_nb')}
                    </Typography>
                    <IntegerField
                      className={classes.numericField}
                      name="auto_discard_min_bookings_nb"
                    />
                  </div>
                  <div className={classes.inlineNumericField}>
                    <Typography className={classes.params} variant="caption">
                      {t('metaActivity.forms.autoDiscard.hours_before_start')}
                    </Typography>
                    <IntegerField
                      className={classes.numericField}
                      name="auto_discard_hours_before_start"
                    />
                  </div>
                </div>
                <Typography
                  className={`${classes.field} ${classes.grey}`}
                  variant="caption"
                >
                  {t('metaActivity.forms.autoDiscard.emailRecipients')}
                </Typography>
              </>
            ) : null}
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            disabled={isSubmitting}
            onClick={() => {
              props.onCancel();
              trackFormCancel(initial?.id);
            }}
          >
            {t('form.discard')}
          </Button>
          <Submit
            disabled={isSubmitting}
            id="button_activity_onsubmit"
            onClick={() => {
              trackFormSubmitIntent(initial?.id);
            }}
          >
            {t('form.send')}
          </Submit>
        </div>
      </div>
    </Form>
  );
}

const styles = (theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  altField: {
    marginLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  field: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
  },
  inlineNumericField: {
    paddingRight: theme.spacing(3),
    display: 'flex',
    alignItems: 'baseline',
  },
  params: {
    paddingRight: theme.spacing(2),
  },
  numericField: {
    width: 40,
  },
  paramContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  grey: {
    color: '#808080',
  },
  explain: {
    marginBottom: theme.spacing(2),
  },
  explainImage: {
    paddingLeft: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  greyIcon: {
    color: '#868686',
  },
  restrictionsSection: {
    paddingTop: theme.spacing(2),
  },
  autoDiscardSection: {
    paddingTop: theme.spacing(2),
  },
  autoDiscardInnerSection: {
    paddingLeft: theme.spacing(2),
  },
  subtitle1bold: {
    fontWeight: 500,
  },
  alignCenter: {
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      Object.assign(
        {
          cover_main: '',
          name: '',
          description: '',
          SCT: null,
          alt_cover_main: '',
          last_booking_minutes: 0,
          last_discard_minutes: 0,
          first_booking_minutes_until: 60 * 24 * 30 * 6,
          is_broadcast: false,
          color: '',
          auto_discard_active: false,
          auto_discard_hours_before_start: 6,
          auto_discard_min_bookings_nb: 1,
          custom_restriction_rule: [],
          // category: null,
        },
        {
          ...initial,
          custom_restriction_rule: initial?.custom_restriction_rule || [],
        } || {},
      ),
    validationSchema: MetaActivitySchema,
    handleSubmit: (
      values,
      {
        props: { onSubmit, onSuccess, onError, initial, variant },
        setSubmitting,
      },
    ) => {
      const keys = [
        'name',
        'description',
        'SCT',
        'alt_cover_main',
        'last_booking_minutes',
        'last_discard_minutes',
        'first_booking_minutes_until',
        'color',
        'is_broadcast',
        'auto_discard_active',
        'auto_discard_hours_before_start',
        'auto_discard_min_bookings_nb',
        'custom_restriction_rule',
        // 'category',
      ];
      const { cover_main } = values;
      const data = {
        ...pick(values, keys),
      };

      if (typeof cover_main !== 'string' && !!cover_main) {
        data.cover_main = cover_main;
      }
      const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
        variant === 'workshop'
          ? SegmentAnalyticsFormObjectIdentifier.Workshop
          : SegmentAnalyticsFormObjectIdentifier.Activity,
      );

      onSubmit(data, {
        onSuccess: () => {
          setSubmitting(false);
          trackFormSuccess(initial?.id);
          if (onSuccess && typeof onSuccess === 'function') onSuccess();
        },
        onError: () => {
          setSubmitting(false);
          if (onError && typeof onError === 'function') onError();
        },
      });
    },
  }),
)(MetaActivityForm);
