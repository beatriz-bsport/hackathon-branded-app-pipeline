import React, { useEffect } from 'react';

import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import moment from 'moment';

import {
  Button,
  CircularProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { OptionCallback } from '../../../state/types';
import {
  TextField,
  Submit,
  DateField,
  SwitchField,
  AlertError,
} from '#components/forms';
import { OffersGroup } from '#libs/group-offer/types';

type OuterProps = {
  initial: OffersGroup;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (arg1: { values: Values; options: OptionCallback }) => void;

  handlePreviousStep: () => void;
};

type Values = {
  name: string;
  timeStart: string;
  copyRecurrence: boolean;
};

const GroupedOfferCreateDuplicationSchema = Yup.object().shape({
  name: Yup.string().required(),
  timeStart: Yup.string().required(),
  copyRecurrence: Yup.boolean().required(),
});

export const GroupedOfferCreateDuplicationForm: React.FC<
  OuterProps & FormikProps<Values>
> = ({ initial, isSubmitting, isValid, handlePreviousStep, resetForm }) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  if (!initial) return null;

  return (
    <div className={classes.main}>
      <Form className={classes.form}>
        <div className={classes.wrapper}>
          <div className={classes.column}>
            <TextField
              name="name"
              label={t('groupedOption.modal.form.name')}
              required
            />
            <Typography color="textSecondary" variant="caption">
              {t('groupedOption.modal.form.nameCaption')}
            </Typography>
            <AlertError name="name" />
            <Typography className={classes.helper}>
              {t('groupedOption.modal.form.timeStartHelper')}
            </Typography>{' '}
            <DateField
              name="timeStart"
              label={t('groupedOption.modal.form.timeStart')}
            />
            <AlertError name="timeStart" />
            {initial.recurrence_id && (
              <SwitchField
                name="copyRecurrence"
                label={t('groupedOption.modal.form.copyRecurrence')}
                className={classes.recurrenceSwitch}
              />
            )}
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button onClick={handlePreviousStep}>
            {t('translation:common.cancel')}
          </Button>
          <Submit disabled={isSubmitting || !isValid} color="primary">
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              t('groupedOption.modal.form.preview')
            )}
          </Submit>
        </div>
      </Form>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  buttonContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  helper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  main: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  recurrenceSwitch: {
    marginTop: theme.spacing(2),
  },
}));

export default compose<any, OuterProps>(
  withTranslation('emailTemplate'),
  withFormik<OuterProps & { t: TFunction }, Values>({
    mapPropsToValues: ({ initial, t }: OuterProps & { t: TFunction }) => {
      if (initial) {
        return {
          name: `${initial.name} (${t('copy')})`,
          timeStart: moment().format('YYYY-MM-DD'),
          copyRecurrence: !!initial.recurrence_id,
        };
      }

      return {
        name: `(${t('copy')})`,
        timeStart: moment().format('YYYY-MM-DD'),
        copyRecurrence: false,
      };
    },
    validationSchema: GroupedOfferCreateDuplicationSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      onSubmit({
        values,
        options: {
          onSuccess: () => setSubmitting(false),
          onError: () => setSubmitting(false),
        },
      });
    },
  }),
)(GroupedOfferCreateDuplicationForm);
