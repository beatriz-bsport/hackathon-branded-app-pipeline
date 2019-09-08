// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import ImageList from '../../../components/ImageList.component';
import ImageField from '../../../components/forms/ImageField.component';
import {
  Submit,
  SCTSelectField,
  TextField,
  DurationMinuteSelectField,
} from '../../../components/forms';

type Props = {
  SCTs: *[],
  classes: Object,
  initial: ?MetaActivity,
  t: TFunction,
  onCancel: () => void,
  isSubmitting: boolean,
  variant: ?string,
  imageUploader: ?{
    onAddImage: (image: File) => void,
    onRemoveImage: (image: File) => void,
  },
};

export function MetaActivityForm(props: Props) {
  const { isSubmitting, SCTs, classes, t, imageUploader, variant } = props;
  const images = (props.initial || {}).images || [];
  return (
    <Form>
      <ImageField name="cover_main" />
      <div className={classes.container}>
        <TextField
          label={t('activity.name')}
          name="name"
          required
          fullWidth
          inputProps={{ maxLength: 100 }}
        />
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
          <SCTSelectField
            choices={SCTs}
            label={t('activity.category')}
            fullWidth
            name="category"
            required
          />
        </div>
        <div className={classes.field}>
          <TextField
            name="description"
            label={t('activity.description')}
            required
            multiline
            fullWidth
          />
        </div>
        <div className={classes.field}>
          <DurationMinuteSelectField
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
          <DurationMinuteSelectField
            name="last_discard_minutes"
            label={
              variant === 'workshop'
                ? t('workshopActivity.lastDiscardBeforeMinutes')
                : t('activity.lastDiscardBeforeMinutes')
            }
            variant={variant === 'workshop' ? 'long' : null}
            fullWidth
            required
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="secondary"
            onClick={props.onCancel}
            disabled={isSubmitting}
          >
            {t('form.discard')}
          </Button>
          <Submit disabled={isSubmitting}>{t('form.send')}</Submit>
        </div>
      </div>
    </Form>
  );
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  field: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  buttonContainer: {
    marginTop: theme.spacing.unit * 2,
  },
});

const MetaActivitySchema = Yup.object().shape({
  cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  last_booking_minutes: Yup.number(),
  last_discard_minutes: Yup.number(),
  SCT: Yup.number(),
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      Object.assign(
        {
          cover_main: '',
          name: '',
          description: '',
          category: null,
          last_booking_minutes: 0,
          last_discard_minutes: 0,
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
        'category',
        'last_booking_minutes',
        'last_discard_minutes',
      ];
      const { cover_main } = values;
      const data = {
        ..._.pick(values, keys),
        cover_main: typeof cover_main !== 'string' ? cover_main : undefined,
      };
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
