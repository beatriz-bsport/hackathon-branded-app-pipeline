// @flow

import React from 'react';

import * as Yup from 'yup';
import { withFormik, Form, FormikProps, Field, FieldProps } from 'formik';

import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';

import Moment from 'moment-timezone';
import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CalendarToday from '@material-ui/icons/CalendarToday';
import {
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { Submit, DateField } from '#components/forms';
import RedButton from '#components/button/RedButton.component';
import type { OptionCallback } from '../../../../../state/types';

type InitialValues = {
  dateStart: Moment.Moment;
};

type Props = {
  isSubmitting: boolean;
  disabled?: boolean;
  loading: boolean;
  hideExport?: boolean;
  exportExcelPerformance: (
    params: {
      start_timestamp: number;
      end_timestamp: number;
    },
    options?: OptionCallback & {
      closeInitialDialog: () => void;
      backgroundDialog?: {
        message: string;
        title: string;
      };
    },
  ) => void;
} & FormikProps<InitialValues>;

export function CoachPerformanceForm(props: Props) {
  const { isSubmitting } = props;
  const [openExportDialog, setOpenExportDialog] = React.useState<boolean>();
  const classes = useStyles();
  const { t } = useTranslation([
    'paymentRules',
    'coachPerformance',
    'translation',
  ]);
  const handleExcelExportation = () => {
    setOpenExportDialog(false);
    const backgroundDialog = {
      message: t('coachPerformance:export.completed.message'),
      title: t('coachPerformance:export.completed.title'),
    };
    const params = {
      start_timestamp: props.values.dateStart.unix(),
      end_timestamp: Moment(props.values.dateStart).endOf('month').unix(),
    };

    props.exportExcelPerformance(params, {
      backgroundDialog,
      closeInitialDialog: () => {
        setOpenExportDialog(false);
      },
    });
  };

  return (
    <>
      <Form className={classes.flexSection}>
        <div className={classes.date}>
          <DateField
            id="textfield_remuneration_beginning"
            variant="outlined"
            required
            name="dateStart"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
              className: classes.input,
            }}
          />

          <Field name="frequency">
            {(fieldProps: FieldProps) => (
              <RadioGroup
                name="row-radio-buttons-group"
                value={fieldProps.field.value}
                onChange={(ev) => {
                  fieldProps.form.setFieldValue('frequency', ev.target.value);
                }}
                row
              >
                <FormControlLabel
                  value="w"
                  control={<Radio />}
                  label={t('common:weekly')}
                />
                <FormControlLabel
                  value="M"
                  control={<Radio />}
                  label={t('common:monthly')}
                />
              </RadioGroup>
            )}
          </Field>
        </div>
        <>
          <Submit
            id="button_remuneration_calculate"
            variant="outlined"
            color="secondary"
            disabled={isSubmitting || !!props.disabled || props.loading}
          >
            {t('calculate')}
          </Submit>
          {!props.hideExport && (
            <Button
              id="button_remuneration_export"
              variant="outlined"
              color="secondary"
              disabled={isSubmitting || !!props.disabled || props.loading}
              onClick={() => setOpenExportDialog(true)}
            >
              {t('coachPerformance:export.buttonText')}
            </Button>
          )}
        </>
      </Form>

      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        aria-labelledby="popup-excel-report"
        aria-describedby="popup-excel-report"
      >
        <DialogTitle id="alert-dialog-title">
          {t('coachPerformance:export.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('coachPerformance:export.dialog.message')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <RedButton
            delayBeforeActivation={2}
            onClick={() => handleExcelExportation()}
          >
            {t('coachPerformance:export.dialog.buttonText')}
          </RedButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  date: {
    display: 'flex',
    gap: theme.spacing(2),
    width: '100%',
  },
  flexSection: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'sapce-between',
    alignItems: 'center',
    width: '100%',
  },

  input: {
    backgroundColor: 'white',
    color: '#868686',
  },
}));
const CoachPerformanceSchema = Yup.object().shape({
  dateStart: Yup.date(),
});

export default compose<any, Props>(
  withFormik({
    mapPropsToValues: () => ({
      dateStart: Moment().startOf('month'),
      frequency: 'M' as Moment.unitOfTime.DurationConstructor,
    }),
    validationSchema: CoachPerformanceSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const timeIntervalValue = {
        ...values,
        dateEnd: Moment(values.dateStart).add(1, values.frequency),
      };
      onSubmit(timeIntervalValue, {
        onError: () => setSubmitting(false),
        onSuccess: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(CoachPerformanceForm);
