import React, { useState } from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { LinearProgress, Theme, Typography } from '@material-ui/core';
import moment from 'moment';
import RRule from 'rrule';
import { DATE_FORMAT } from '../../../utils/datetime';
import { OptionCallback } from '../../../state/types';
import { ExpenseFormValues, ExpenseWithUser } from '../types';
import {
  SelectField,
  Actions,
  TextField,
  DateField,
  PriceField,
} from '../../../components/forms';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';
import { UserRole } from '#libs/role/types';
import ExpenseRecurrencySelector from '../../../components/input/ExpenseRecurrencySelector.component';

type OwnProps = {
  initial?: ExpenseWithUser;
  onClose: () => void;
  staffList: Array<UserRole>;
  onCreateSubmit: (data: ExpenseFormValues, options?: OptionCallback) => void;
  onUpdateSubmit: (
    data: ExpenseFormValues,
    editScope: string,
    options?: OptionCallback,
  ) => void;
  editChoice: string | null;
  setEditChoice: (editForm: string | null) => void;
};

type Props = OwnProps &
  WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<ExpenseFormValues>;

export const ExpenseForm = (props: Props) => {
  const { t } = useTranslation(['expense']);
  const classes = useStyles();
  const { initial, editChoice } = props;
  const now = moment().format(DATE_FORMAT);

  const [showRepeat, setShowRepeat] = useState(false);
  const [radioValue, setRadioValue] = useState(0);
  const [radioRepeatValue, setRadioRepeatValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editScope, setEditScope] = useState(null);
  const [rrule, setRrule] = useState({
    freq: null,
    interval: null,
    count: null,
    bymonthday: null,
    bymonth: null,
    byweekday: null,
    bysetpos: null,
    dtstart: null,
    until: null,
  });

  return (
    <div className={classes.formContainer}>
      <div className={classes.marginBottom}>
        <Typography variant="h5">
          {initial ? t('form.titleEdit') : t('form.titleAdd')}
        </Typography>
      </div>

      {!!initial?.rrule && (
        <FormControl className={classes.marginBottom}>
          <RadioGroup
            aria-label="edit-choice"
            value={editChoice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setEditChoice(e.target.value);
            }}
          >
            <FormControlLabel
              value="date_due"
              control={<Radio />}
              label={t('form.editChoices.editDateDue')}
            />
            <Typography variant="caption" className={classes.grey}>
              {t('form.editChoices.explanation.dateDue')}
            </Typography>

            <FormControlLabel
              value="details"
              control={<Radio />}
              label={t('form.editChoices.editDetails')}
            />
            <Typography variant="caption" className={classes.grey}>
              {t('form.editChoices.explanation.details')}
            </Typography>
          </RadioGroup>
        </FormControl>
      )}

      <Formik
        enableReinitialize
        validationSchema={expenseSchema}
        initialValues={
          initial?.id
            ? {
                ...initial,
                assigned_staff: initial.assigned_staff
                  ? initial.assigned_staff.id
                  : null,
              }
            : {
                date_due: now,
                amount: 0,
                category: null,
                assigned_staff: null,
                supplier: null,
                description: null,
                rrule: null,
              }
        }
        onSubmit={(values, actions) => {
          const sanithizedValues = {
            ...values,
            date_due: moment(values.date_due).format(DATE_FORMAT),
          };
          if (!values.rrule) {
            sanithizedValues.rrule = null;
          }
          const options = {
            onSuccess: () => {
              actions.setSubmitting(false);
              props.onClose();
            },
            onError: () => {
              actions.setSubmitting(false);
              props.onClose();
            },
          };
          if (!initial) {
            props.onCreateSubmit(sanithizedValues, options);
          } else {
            props.onUpdateSubmit(
              sanithizedValues,
              editScope || 'current',
              options,
            );
          }
        }}
      >
        {(formikProps: FormikProps<ExpenseFormValues>) => {
          return (
            <React.Fragment>
              <Form>
                {editChoice !== 'details' && (
                  <div className={classes.field}>
                    <DateField
                      label={t('form.date_due')}
                      name="date_due"
                      disabled={showRepeat && editChoice !== 'date_due'}
                    />
                  </div>
                )}

                {editChoice !== 'date_due' && (
                  <React.Fragment>
                    <div className={classes.field}>
                      <SelectField
                        choices={props.staffList.map((staff) => {
                          return {
                            value: staff.id,
                            label:
                              staff.first_name && staff.last_name
                                ? `${staff.first_name} ${staff.last_name}`
                                : staff.email,
                          };
                        })}
                        fullWidth
                        name="assigned_staff"
                        label={t('form.staff')}
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        name="category"
                        label={t('form.category')}
                        type="text"
                        fullWidth
                      />
                    </div>
                    <div className={classes.field}>
                      <PriceField
                        name="amount"
                        label={t('form.amount')}
                        required
                        fullWidth
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        name="supplier"
                        label={t('form.supplier')}
                        type="text"
                        fullWidth
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        name="description"
                        label={t('form.description')}
                        type="text"
                        fullWidth
                        multiline
                      />
                    </div>

                    <Field name="rrule">
                      {({ field, form: { setFieldValue } }) => (
                        <ExpenseRecurrencySelector
                          {...field}
                          showRepeat={showRepeat}
                          setShowRepeat={setShowRepeat}
                          radioValue={radioValue}
                          setRadioValue={setRadioValue}
                          radioRepeatValue={radioRepeatValue}
                          setRadioRepeatValue={setRadioRepeatValue}
                          initial={initial}
                          value={field.value}
                          rrule={rrule}
                          setRrule={setRrule}
                          onChange={(recRule) => {
                            const rule = { ...recRule };
                            for (const key in rule) {
                              if (rule[key] === null) {
                                delete rule[key];
                              } else if (key === 'until' || key === 'dtstart') {
                                rule[key] = new Date(rule[key]);
                              }
                            }
                            setFieldValue(
                              'rrule',
                              Object.keys(rule).length === 0
                                ? null
                                : new RRule(rule),
                            );
                          }}
                        />
                      )}
                    </Field>
                  </React.Fragment>
                )}
                <Actions>
                  <div className={classes.actionContainer}>
                    <Button
                      onClick={() => {
                        props.onClose();
                      }}
                    >
                      {t('form.actions.cancel')}
                    </Button>
                    <Button
                      onClick={() => {
                        if (initial?.rrule && editChoice === 'details') {
                          setEditDialogOpen(true);
                          setEditScope('current');
                        } else {
                          formikProps.handleSubmit();
                        }
                      }}
                      disabled={formikProps.isSubmitting}
                      color="primary"
                      variant="contained"
                    >
                      {!!initial && !!initial.id
                        ? t('form.actions.edit')
                        : t('form.actions.save')}
                    </Button>
                  </div>
                </Actions>
                <LinearProgress
                  style={{
                    visibility: formikProps.isSubmitting ? 'visible' : 'hidden',
                  }}
                />
              </Form>
              <Dialog open={editDialogOpen}>
                <DialogContent>
                  <FormControl>
                    <RadioGroup
                      aria-label="edit-scope"
                      value={editScope}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEditScope(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="current"
                        control={<Radio />}
                        label={t('dialogEditExpense.current')}
                      />
                      <FormControlLabel
                        value="future"
                        control={<Radio />}
                        label={t('dialogEditExpense.future')}
                      />
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label={t('dialogEditExpense.all')}
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <div className={classes.actionButtons}>
                    <Button
                      onClick={() => {
                        setEditDialogOpen(false);
                        setEditScope(null);
                      }}
                      className={classes.cancel}
                    >
                      {t('dialogEditExpense.cancel')}
                    </Button>
                    <Button
                      onClick={() => formikProps.handleSubmit()}
                      color="primary"
                      variant="contained"
                    >
                      {t('dialogEditExpense.validate')}
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          );
        }}
      </Formik>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    padding: theme.spacing(4),
  },
  actionContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: -theme.spacing(2),
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  marginBottom: {
    marginBottom: theme.spacing(4),
  },
  repeat: {
    marginTop: theme.spacing(4),
  },
  grey: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: theme.spacing(3),
  },
  cancel: {
    marginRight: theme.spacing(4),
  },
}));

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier: SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.EXPENSE,
  }),
)(ExpenseForm);

export const expenseSchema = Yup.object().shape({
  date_due: Yup.string().required('form.requiredField'),
  amount: Yup.string().required('form.requiredField'),
  category: Yup.string().nullable(),
  assigned_staff: Yup.number().nullable(),
  supplier: Yup.string(),
  description: Yup.string(),
  // eslint-disable-next-line react/forbid-prop-types
  rrule: Yup.object().nullable(),
});
