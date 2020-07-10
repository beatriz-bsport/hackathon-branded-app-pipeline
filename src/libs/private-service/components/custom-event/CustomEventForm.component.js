// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import * as Yup from 'yup';

import { withFormik, FieldArray } from 'formik';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import CoachSelector from '../../../associated-coach/components/CoachSelector.component';

import { TextField, ColorField } from '../../../../components/forms';

type Props = {
  t: TFunction,
  classes: Object,
  values: PrivateServiceData,
  establishments: Array<Establishment>,
  coaches: Array<Coach>,
  onAddServiceGroup: ?() => void,
  serviceGroupList: Array<PrivateServiceGroup>,
};

export const CustomEventForm = (props: Props) => {
  const { classes, t } = props;
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
              coaches={props.coaches}
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

const styles = (theme) => ({
  field: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
});

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

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(CustomEventForm);
