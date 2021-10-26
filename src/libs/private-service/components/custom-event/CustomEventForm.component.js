// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';

import { withFormik, FieldArray } from 'formik';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import CoachSelector from '../../../associated-coach/components/coach-selector/CoachSelector.component';

import { TextField, ColorField } from '../../../../components/forms';

type Props = {
  coaches: Array<Coach>,
};

export const CustomEventForm = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <TextField
        className={classes.field}
        name="name"
        required
        fullWidth
        variant="outlined"
        label={t('customEvent.form.name.label')}
        placeholder={t('customEvent.form.name.placeholder')}
      />
      <div className={classes.field}>
        <ColorField
          label={t('customEvent.form.color')}
          name="color"
          transparentColorAvailable
        />
      </div>
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
              <div className={classes.row}>
                <Typography>{t('customEvent.form.coach.isEmpty')}</Typography>
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
              coaches={props.coaches.filter(
                (c) => !(coaches || []).find((c_) => c_.id === c.id),
              )}
              closeMenuOnSelect
              nullCurrentValue
              selectedCoaches={[]}
              selectOption={(ev) => {
                if (ev.length) push(ev[0].value);
              }}
            />
          </div>
        )}
      </FieldArray>
      <TextField
        className={classes.field}
        rows={10}
        multiline
        name="description"
        variant="outlined"
        required
        fullWidth
        label={t('customEvent.form.description.label')}
        placeholder={t('customEvent.form.description.placeholder')}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  container: {
    minWidth: 200,
  },
}));

export const CustomEventSchema = Yup.object().shape({
  // cover_main: Yup.object().nullable(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  coach: Yup.number().nullable(),
});

export const CustomEventFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        coaches: initial.coaches.map((c) => c.id),
      };
    }
    return {
      name: '',
      description: '',
      coaches: [],
    };
  },
  validationSchema: CustomEventSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    setSubmitting(true);
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default CustomEventForm;
