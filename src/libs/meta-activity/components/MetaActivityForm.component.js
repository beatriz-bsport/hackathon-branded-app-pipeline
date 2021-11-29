// @flow

import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import { compose } from 'recompose';
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import ImageList from '../../../components/ImageList.component';
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

type Props = {
  SCTs: *[],
  classes: Object,
  initial: ?MetaActivity,
  t: TFunction,
  onCancel: () => void,
  isSubmitting: boolean,
  variant: ?string,
  is_broadcast_enabled: boolean,
  imageUploader: ?{
    onAddImage: (image: File) => void,
    onRemoveImage: (image: File) => void,
  },
  values: any,
};

export function MetaActivityForm(props: Props) {
  const { isSubmitting, SCTs, classes, t, imageUploader, variant } = props;
  const images = (props.initial || {}).images || [];
  const {
    auto_discard_hours_before_start,
    auto_discard_min_bookings_nb,
    auto_discard_active,
  } = props.values;
  return (
    <Form>
      <ImageField id="button_activity_image" name="cover_main" />
      <Typography
        style={{ margin: 12 }}
        variant="caption"
        color="textSecondary"
      >
        {props.t('activity.explainImage')}
      </Typography>
      <div className={classes.container}>
        <TextField
          id="textfield_activity_title"
          label={t('activity.name')}
          name="name"
          required
          fullWidth
          inputProps={{ maxLength: 100 }}
        />
        <div className={classes.field}>
          <SCTSelectField
            scts={SCTs}
            id="select_activity_category"
            label={t('activity.category')}
            fullWidth
            name="SCT"
            required
          />
        </div>
        <div className={classes.field}>
          <TextField
            id="textfield_activity_description"
            name="description"
            label={t('activity.description')}
            required
            multiline
            rows={5}
            fullWidth
            variant="outlined"
          />
        </div>
        {imageUploader ? (
          <div className={classes.field}>
            <label>Carousel</label>
            <MultipleImageUploader
              initial={images}
              onAddImage={imageUploader.onAddImage}
              onRemoveImage={imageUploader.onRemoveImage}
            />
            {images.length ? (
              <ImageList
                images={images}
                onRemoveImage={imageUploader.onRemoveImage}
              />
            ) : null}
          </div>
        ) : (
          <p>
            {variant === 'workshop'
              ? t('workshopActivity.imageUploaderRequireEditMessage')
              : t('metaActivity.update.imageUploaderRequireEditMessage')}
          </p>
        )}
        <div className={classes.field}>
          <CheckboxField
            name="is_broadcast"
            id="checkbox_activity_broadcast"
            disabled={!props.is_broadcast_enabled}
            label={t('activity.is_broadcast')}
          />
        </div>
        <div className={classes.field}>
          <ColorField
            label={t('activity.color')}
            name="color"
            id="textfield_activity_color"
            transparentColorAvailable
          />
        </div>
        <div className={classes.field}>
          <DurationField
            label={
              variant === 'workshop'
                ? t('workshopActivity.lastBookingBeforeMinutes')
                : t('activity.lastBookingBeforeMinutes')
            }
            name="last_booking_minutes"
            variant={variant === 'workshop' ? 'long' : null}
            fullWidth
            required
          />
        </div>
        <div className={classes.field}>
          <DurationField
            name="last_discard_minutes"
            label={
              variant === 'workshop'
                ? t('workshopActivity.lastDiscardBeforeMinutes')
                : t('activity.lastDiscardBeforeMinutes')
            }
            fullWidth
            required
          />
        </div>
        <div className={classes.field}>
          <DurationField
            name="first_booking_minutes_until"
            label={t('activity.firstBookingMinutesUntil')}
            fullWidth
            required
          />
        </div>
        <div classNamre={classes.field}>
          <CheckboxField
            name="auto_discard_active"
            id="checkbox_auto_discard_active"
            label={t('metaActivity.forms.autoDiscard.checkbox')}
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
                <Typography variant="caption" className={classes.params}>
                  {t('metaActivity.forms.autoDiscard.min_bookings_nb')}
                </Typography>
                <IntegerField
                  name="auto_discard_min_bookings_nb"
                  className={classes.numericField}
                />
              </div>
              <div className={classes.inlineNumericField}>
                <Typography variant="caption" className={classes.params}>
                  {t('metaActivity.forms.autoDiscard.hours_before_start')}
                </Typography>
                <IntegerField
                  name="auto_discard_hours_before_start"
                  className={classes.numericField}
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
        <div className={classes.buttonContainer}>
          <Button onClick={props.onCancel} disabled={isSubmitting}>
            {t('form.discard')}
          </Button>
          <Submit id="button_activity_onsubmit" disabled={isSubmitting}>
            {t('form.send')}
          </Submit>
        </div>
      </div>
    </Form>
  );
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(3),
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
});

const MetaActivitySchema = Yup.object().shape({
  cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  last_booking_minutes: Yup.number(),
  last_discard_minutes: Yup.number(),
  first_booking_minutes_until: Yup.number(),
  is_broadcast: Yup.boolean(),
  color: Yup.string(),
  SCT: Yup.number(),
  auto_discard_active: Yup.boolean(),
  auto_discard_hours_before_start: Yup.number(),
  auto_discard_min_bookings_nb: Yup.number(),
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
          last_booking_minutes: 0,
          last_discard_minutes: 0,
          first_booking_minutes_until: 60 * 24 * 30 * 6,
          is_broadcast: false,
          color: '',
          auto_discard_active: false,
          auto_discard_hours_before_start: 6,
          auto_discard_min_bookings_nb: 1,
        },
        { ...initial } || {},
      ),
    validationSchema: MetaActivitySchema,
    handleSubmit: (
      values,
      { props: { onSubmit, onSuccess, onError }, setSubmitting },
    ) => {
      const keys = [
        'name',
        'description',
        'SCT',
        'last_booking_minutes',
        'last_discard_minutes',
        'first_booking_minutes_until',
        'color',
        'is_broadcast',
        'auto_discard_active',
        'auto_discard_hours_before_start',
        'auto_discard_min_bookings_nb',
      ];
      const { cover_main } = values;
      const data = {
        ...pick(values, keys),
      };
      if (typeof cover_main !== 'string' && !!cover_main) {
        data.cover_main = cover_main;
      }

      onSubmit(data, {
        onSuccess: () => {
          if (onSuccess && typeof onSuccess === 'function') onSuccess();
          setSubmitting(false);
        },
        onError: () => {
          if (onError && typeof onError === 'function') onError();
          setSubmitting(false);
        },
      });
    },
  }),
)(MetaActivityForm);
