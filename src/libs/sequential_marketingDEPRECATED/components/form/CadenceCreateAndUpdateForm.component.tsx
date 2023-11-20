// @ts-nocheck
import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, FormikProps, useFormikContext, Form } from 'formik';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Submit, TextField } from '#components/forms';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import type { Cadence } from '#libs/sequential_marketingDEPRECATED/types';
import type { OptionCallback } from '../../../../state/types';

export type ComponentProps = {
  onCancel: () => void;
  open: boolean;
  loading: boolean;
  initial?: Cadence;
};

export type FormProps = {
  initial?: Cadence;
  onSubmit: (data: Values, options: OptionCallback) => void;
};

export type Values = {
  id?: number;
  name: string;
};

type FormikValues = FormikProps<Values>;

export const CadenceCreateAndUpdateForm: React.FC<ComponentProps> = ({
  open,
  onCancel,
  loading,
  initial,
}) => {
  const { t } = useTranslation('marketing');

  const { isSubmitting, isValid }: FormikValues = useFormikContext();

  const title = useMemo(
    () =>
      initial?.id && initial?.name
        ? t('audience.form.updateTitle')
        : t('audience.form.title'),
    [initial, t],
  );

  const submitButtonText = useMemo(
    () =>
      initial?.id && initial?.name
        ? t('cadence.form.updateSubmit')
        : t('cadence.form.submit'),
    [initial, t],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      {loading && <LinearProgress />}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Form>
          <TextField
            fullWidth
            required
            label={t('audience.form.audienceNameLabel')}
            name="name"
          />
          <DialogActions>
            <Button onClick={onCancel}>{t('cadence.form.cancel')} </Button>
            <Submit
              color="primary"
              disabled={isSubmitting || !isValid || loading}
            >
              {isSubmitting ? <CircularProgress /> : submitButtonText}
            </Submit>
          </DialogActions>
        </Form>
      </DialogContent>
    </GenericResponsiveDialog>
  );
};

const CadenceCreationSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  name: Yup.string().required(),
});

const formikFormWrapper = withFormik<ComponentProps & FormProps, Values>({
  mapPropsToValues: ({ initial }: ComponentProps & FormProps) => {
    if (initial) {
      return {
        id: initial.id,
        name: initial.name,
      };
    }
    return {
      id: null,
      name: '',
    };
  },
  enableReinitialize: true,
  validationSchema: CadenceCreationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
        resetForm();
      },
      onError: () => setSubmitting(false),
    });
  },
});
export default formikFormWrapper(CadenceCreateAndUpdateForm);
