import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createTheme';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Form, Formik } from 'formik';
import { TextField } from '#components/forms';

type Props = {
  submit: (email: string) => void;
  onCancel: () => void;
};

const CoachEmailSchema = Yup.object({
  email: Yup.string().email().required(),
});

export const CoachEmailCheckDialog: React.FC<Props> = ({
  submit,
  onCancel,
}) => {
  const { t } = useTranslation('coach');
  const classes = useStyles();

  const initialValues = {
    email: '',
  };
  const handleSubmit = (values: { email: string }) => submit(values.email);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CoachEmailSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <DialogTitle>{t('forms.linkByEmail.title')}</DialogTitle>
          <DialogContent>
            <Typography>{t('forms.linkByEmail.explain')}</Typography>
            <TextField
              name="email"
              type="email"
              className={classes.marginTop}
              placeholder={t('forms.linkByEmail.emailPlaceHolder')}
              label={t('forms.linkByEmail.emailLabel')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>{t('forms.linkByEmail.cancel')}</Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!!formik.errors.email || !formik.values.email}
            >
              {t('forms.linkByEmail.submit')}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export default CoachEmailCheckDialog;
