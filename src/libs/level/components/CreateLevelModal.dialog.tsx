import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import { OptionCallback } from '../../../state/types';
import { TextField, ColorField } from '#components/forms';
import { Level as LevelType } from '../types';
import Level from '#libs/level/components/Level.component';

const NAME_MAX_LENGTH = 30;

export type OuterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: LevelType;
  open: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (arg1: {
    id?: number;
    values: Omit<LevelType, 'id'>;
    options: OptionCallback;
  }) => void;
  onClose: () => void;
};

type Values = {
  name: string;
  color: string | null;
};

const CreateLeveLModalSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  color: Yup.string().required('required'),
});

export const CreateLeveLModal: React.FC<OuterProps & FormikProps<Values>> = ({
  open,
  values,
  isSubmitting,
  dirty,
  isValid,
  onClose,
}) => {
  const { t } = useTranslation(['offer']);
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.popup,
      }}
    >
      <Form>
        <DialogTitle>{t('levels.modal.title')}</DialogTitle>
        <DialogContent>
          <div className={classes.container}>
            <div className={classNames(classes.innerRow, classes.name)}>
              <TextField
                name="name"
                label={t('levels.modal.name')}
                required
                inputProps={{ maxLength: NAME_MAX_LENGTH }}
              />
              <Typography variant="caption">
                {t('levels.modal.nameCaption', {
                  count: values.name?.length,
                  max: NAME_MAX_LENGTH,
                })}
              </Typography>
            </div>
            <div className={classes.color}>
              <ColorField name="color" label={t('levels.modal.color')} />
            </div>
          </div>
          {values.name && values.color && (
            <div className={classes.level}>
              <Level
                customLevel={{
                  id: -1,
                  color: values.color,
                  name: values.name,
                }}
              />
            </div>
          )}

          <DialogActions>
            <Button color="secondary" onClick={onClose} disabled={isSubmitting}>
              {t('levels.modal.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
            >
              {t('levels.modal.submit')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popup: {
    minWidth: 600,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      minWidth: 'inherit',
      width: '80vh',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  innerRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    width: '80%',
  },
  color: {
    width: '40%',
  },
  level: {
    position: 'absolute',
    display: 'flex',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    mapPropsToValues: ({ initial }) => {
      if (initial) {
        return {
          name: initial.name,
          color: initial.color,
        };
      }

      return {
        name: '',
        color: '#FFFFFF',
      };
    },
    validationSchema: CreateLeveLModalSchema,
    handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
      onSubmit({
        id: initial?.id,
        values: {
          ...(initial ?? {}),
          ...values,
        },
        options: {
          onSuccess: () => {
            setSubmitting(false);
          },
          onError: () => {
            setSubmitting(false);
          },
        },
      });
    },
  }),
)(CreateLeveLModal);
