// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import pick from 'lodash/pick';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import ImageField from '../../../components/forms/ImageField.component';
import { TextField } from '../../../components/forms';

type Props = {
  classes: Object,
  t: TFunction,
};
export const PlaylistForm = (props: Props) => {
  const { classes, t } = props;
  return (
    <div className={classes.container}>
      <div className={classes.field}>
        <ImageField name="cover_main" />
      </div>
      <div className={classes.field}>
        <TextField
          label={t('playlist.name')}
          name="name"
          required
          fullWidth
          inputProps={{ maxLength: 500 }}
        />
      </div>
      <div className={classes.field}>
        <TextField
          label={t('playlist.description')}
          name="description"
          variant="outlined"
          required
          fullWidth
          multiline
          rows={10}
        />
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    minWidth: 400,
  },
  field: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['video']),
  withStyles(styles),
)(PlaylistForm);

export const PlaylistSchema = Yup.object().shape({
  cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
});

export const PlaylistFormHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
      };
    }
    return {
      name: '',
      description: '',
      cover_main: '',
    };
  },
  validationSchema: PlaylistSchema,
  handleSubmit: (
    values,
    { props: { initial, onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
    const keys = ['name', 'description'];
    const { cover_main } = values;
    const data = {
      ...pick(values, keys),
    };
    if (typeof cover_main !== 'string' && !!cover_main) {
      data.cover_main = cover_main;
    }
    if (initial && initial.id) {
      data.id = initial.id;
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
});
