// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { Form } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import TaskFormFields, { TaskFormFormikHOC } from './TaskForm.component';

import { Submit } from '../../../components/forms';
import type { OptionCallback } from '../../../state/types.ts';

import type { TaskData } from '../types';

type Props = {
  t: TFunction,
  open: boolean,
  isSubmitting: boolean,
  onSubmit: (data: TaskData, options: OptionCallback) => void,
  onClose: () => void,
};
export const TaskFormDialog = (props: Props) => {
  const { t } = props;
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{t('task.form.title')}</DialogTitle>
        <DialogContent>
          {props.open ? <TaskFormFields {...props} /> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>{props.t('task.form.close')}</Button>
          <Submit disabled={props.isSubmitting}>{t('task.form.submit')}</Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default compose(
  withTranslation(['reminder']),
  withProps(({ onSubmit, onClose }) => ({
    onSubmit: (data, options) =>
      onSubmit(data, {
        onError: options.onError,
        onSuccess: (...args) => {
          options.onSuccess(...args);
          onClose();
        },
      }),
  })),
  TaskFormFormikHOC,
)(TaskFormDialog);
