import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Typography, makeStyles } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
// @ts-expect-error
import { TextField } from '#components/forms';
import { MAX_CUT_OFF_HOUR, MAX_CUT_OFF_MINUTE } from '#libs/theme/constants';
import { minsToHrMins } from '#libs/theme/utils';
import { OptionCallback } from '../../../state/types';

type Props = {
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
  minute: number;
  company: number;
};

const CheckInTabletSettingsFormSchema = Yup.object().shape({
  hours: Yup.number().required().max(MAX_CUT_OFF_HOUR).min(0),
  minutes: Yup.number().required().max(MAX_CUT_OFF_MINUTE).min(0),
});

export const CheckInTabletSettingsForm: React.FC<Props> = ({
  onSubmit,
  minute,
  company,
}) => {
  const { t } = useTranslation('theme');
  const classes = useStyles();
  const handleOnBlur = React.useCallback(
    (
        setFieldValue: (
          field: string,
          value: any,
          shouldValidate?: boolean,
        ) => void,
        formikField: string,
        timeLimit: number,
      ) =>
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value) > timeLimit) {
          setFieldValue(formikField, timeLimit);
        }
      },
    [],
  );

  return (
    <Formik
      initialValues={company ? minsToHrMins(minute) : { hours: 2, minutes: 0 }}
      onSubmit={(values, { setSubmitting }) => {
        const sanitizedData = new FormData();
        sanitizedData.append(
          'checkin_tablet_visible_session_cutoff_minute',
          (values.hours * 60 + values.minutes).toString(),
        );
        onSubmit(company, sanitizedData, {
          onSuccess: () => setSubmitting(false),
          onError: () => {
            setSubmitting(false);
          },
        });
      }}
      validationSchema={CheckInTabletSettingsFormSchema}
    >
      {({ handleSubmit, isSubmitting, setFieldValue }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Typography className={classes.namesHeader}>
              {t('forms.checkInPersonalization.title')}
            </Typography>
            <Typography className={classes.container}>
              <Trans
                components={[
                  <TextField
                    castAsNumber
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 23,
                      },
                    }}
                    name="hours"
                    onBlur={handleOnBlur(
                      setFieldValue,
                      'hours',
                      MAX_CUT_OFF_HOUR,
                    )}
                    type="number"
                  />,
                  <TextField
                    castAsNumber
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 59,
                      },
                    }}
                    name="minutes"
                    onBlur={handleOnBlur(
                      setFieldValue,
                      'minutes',
                      MAX_CUT_OFF_MINUTE,
                    )}
                    type="number"
                  />,
                ]}
                i18nKey="forms.checkInPersonalization.settings.beforeStartTime"
                t={t}
              />
            </Typography>
            <Button
              color="primary"
              disabled={isSubmitting}
              type="submit"
              variant="contained"
            >
              {t('forms.checkInPersonalization.settings.save')}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: `${theme.spacing(2)}px 0`,
  },
}));

export default React.memo(CheckInTabletSettingsForm);
