// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import omit from 'lodash/omit';
import moment from 'moment';

import * as Yup from 'yup';
import { withFormik, FieldArray } from 'formik';

import { TextField, DateField } from '../../../components/forms';

import UserSelector from './UserSelector.component';
import UserItem from './UserItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  staffList: Array<User>,
};

export const TaskForm = (props: Props) => (
  <div>
    <TextField
      name="name"
      label={props.t('task.form.name.label')}
      required
      fullWidth
    />
    <FieldArray name="task_owner_ids">
      {({
        push,
        remove,
        form: {
          values: { task_owner_ids },
        },
      }) => (
        <div>
          <UserSelector
            helperText={props.t('task.form.task_owner.helperText')}
            userList={props.staffList.filter(
              (s) => !task_owner_ids.includes(s.id),
            )}
            multi
            onChange={(id) => {
              if (id) push(id);
            }}
          />
          {task_owner_ids.map((id, i) => (
            <UserItem
              key={`${id}-${i}`}
              dense
              isFocused
              user={props.staffList.find((u) => u.id === id)}
              onDelete={() => remove(i)}
            />
          ))}
        </div>
      )}
    </FieldArray>
    <div className={props.classes.paddedField}>
      <DateField label={props.t('task.form.date_due.label')} name="date_due" />
    </div>
    <div className={props.classes.paddedField}>
      <TextField
        name="description"
        label={props.t('task.form.description.label')}
        required
        fullWidth
        multiline
        rows={10}
        variant="outlined"
      />
    </div>
  </div>
);

const styles = (theme) => ({
  paddedField: {
    marginTop: theme.spacing(2),
  },
});

export const TaskFormFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  task_owner_ids: Yup.array()
    .of(Yup.number())
    .required(),
  date_due: Yup.string().required(),
});

export const TaskFormFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        task_owner_ids: [...initial.task_owners.map((to) => to.id)],
      };
    }
    return {
      name: null,
      description: null,
      task_owners: [],
      date_due: moment(),
      task_owner_ids: [],
    };
  },
  validationSchema: TaskFormFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(
      omit(
        {
          ...values,
          date_due: moment(values.date_due).format('YYYY-MM-DD'),
        },
        ['task_owners', 'author', 'member'],
      ),
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default compose(
  withNamespaces(['reminder']),
  withStyles(styles),
)(TaskForm);
