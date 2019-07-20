// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
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
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <TextField
              label={t('activity.name')}
              name="name"
              required
              fullWidth
            />
          </Grid>
          {imageUploader ? (
            <Grid item xs={12} style={{ marginTop: 20 }}>
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
            </Grid>
          ) : (
            <p>
              {variant === 'workshop'
                ? t('workshopActivity.imageUploaderRequireEditMessage')
                : t('metaActivity.update.imageUploaderRequireEditMessage')}
            </p>
          )}
          <Grid item>
            <SCTSelectField
              choices={SCTs}
              label={t('activity.category')}
              fullWidth
              name="category"
              required
            />
          </Grid>
          <Grid item>
            <TextField
              name="description"
              label={t('activity.description')}
              required
              multiline
              fullWidth
            />
          </Grid>
          <Grid item>
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
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-end"
          className={classes.topSpacing}
          spacing={8}
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
	      onClick={props.onCancel}
	      disabled={isSubmitting}
            >
              {t('form.discard')}
            </Button>
          </Grid>
          <Grid item>
            <Submit disabled={isSubmitting}>{t('form.send')}</Submit>
          </Grid>
        </Grid>
      </div>
    </Form>
  );
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 3,
  },
  topSpacing: {
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
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(MetaActivityForm);
