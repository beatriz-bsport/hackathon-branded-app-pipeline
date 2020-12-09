// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import pick from 'lodash/pick';

import { withFormik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import ImageField from '../../../components/forms/ImageField.component';
import SCTSelectField from '../../category/components/SCTSelectorField.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import CoachListItemBasic from '../../associated-coach/components/CoachListItemBasic.component';
import { TextField, IntegerField } from '../../../components/forms';
import LevelSelectorField from '../../category/components/LevelSelectorField.component';

type Props = {
  coaches: Array<Coach>,
  SCTs: Array<SCT>,
};
export const VideoForm = (props: Props) => {
  const { t } = useTranslation(['video']);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.field}>
        <ImageField name="cover_main" />
        <ErrorMessage
          name="cover_main"
          render={() => (
            <Typography variant="body2" className={classes.alertError}>
              {t('video.coverMain.alert')}
            </Typography>
          )}
        />
      </div>
      <div className={classes.field}>
        <TextField
          label={t('video.name')}
          name="name"
          required
          fullWidth
          inputProps={{ maxLength: 500 }}
        />
      </div>
      <div className={classes.field}>
        <SCTSelectField
          scts={props.SCTs}
          label={t('video.category')}
          fullWidth
          name="SCT"
          required
        />
      </div>
      <div className={classes.field}>
        <LevelSelectorField
          label={t('video.level')}
          fullWidth
          isNotMulti
          closeMenuOnSelect
          name="level"
          required
        />
      </div>
      <div className={classes.field}>
        <div className={classes.selectorWrapper}>
          <FieldArray name="coaches">
            {({
              push,
              remove,
              form: {
                values: { coaches },
              },
            }) => (
              <div>
                {coaches.length === 0 ? (
                  <div className={classes.emptyCoachText}>
                    <Typography variant="body2">
                      {t('video.form.coach.isEmpty')}
                    </Typography>
                  </div>
                ) : null}
                {coaches.map((id, i) => (
                  <CoachListItemBasic
                    key={`${id}-${i}`}
                    coach={props.coaches.find((c) => c.id === id)}
                    onDelete={() => remove(i)}
                  />
                ))}
                <CoachSelector
                  coaches={[
                    ...(props.coaches || []).filter(
                      (c) => !coaches.includes(c.id) && !c.disabled,
                    ),
                  ]}
                  closeMenuOnSelect
                  nullCurrentValue
                  helperText={t('video.form.coach.helperText')}
                  selectedCoaches={[]}
                  selectOption={(ev) => {
                    if (ev.length) push(ev[0].value);
                  }}
                />
              </div>
            )}
          </FieldArray>
        </div>
      </div>
      <div className={classes.field}>
        <IntegerField
          label={t('video.form.creditPrice.label')}
          name="credit_price"
          required
          fullWidth
          inputProps={{ maxLength: 500 }}
          helperText={t('video.form.creditPrice.helperText')}
        />
      </div>
      <div className={classes.field}>
        <TextField
          label={t('video.description')}
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

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 400,
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  selectorWrapper: {
    backgroundColor: '#F4F4F4',
    border: '1px solid white',
    borderRadius: 8,
  },
  emptyCoachText: {
    padding: theme.spacing(1),
  },
  alertError: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.error.dark,
  },
}));

export default VideoForm;

export const VideoSchema = Yup.object().shape({
  cover_main: Yup.object().required(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  coaches: Yup.array().of(Yup.number()),
  SCT: Yup.number().integer(),
  credit_price: Yup.number().integer(),
});

export const VideoFormHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        coaches: [...initial.coaches.map((ac) => ac.id)],
        SCT: initial.SCT ? initial.SCT.id : null,
      };
    }
    return {
      name: '',
      description: '',
      coaches: [],
      cover_main: '',
      SCT: null,
      level: 1,
      credit_price: 0,
    };
  },
  validationSchema: VideoSchema,
  handleSubmit: (
    values,
    { props: { initial, onSubmit, onSuccess, onError }, setSubmitting },
  ) => {
    const keys = [
      'name',
      'description',
      'SCT',
      'coaches',
      'level',
      'credit_price',
    ];
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
