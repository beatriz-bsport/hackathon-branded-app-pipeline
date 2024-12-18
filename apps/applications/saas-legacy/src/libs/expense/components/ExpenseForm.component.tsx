import React, { useState } from 'react';
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
import { RRule } from 'rrule';
import { DateTime } from 'luxon';
import { UserRole } from '#src/libs/role/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { OptionCallback } from '../../../state/types';
import { ExpenseFormValues, ExpenseWithUser } from '../types';
import {
  SelectField,
  Actions,
  TextField,
  DateField,
  PriceField,
  // @ts-expect-error
} from '../../../components/forms';
import ExpenseRecurrencySelector from '../../../components/input/ExpenseRecurrencySelector.component';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Expense,
);

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
  isInDrawer: boolean;
  setEditChoice: (editForm: string | null) => void;
};

type Props = OwnProps & FormikProps<ExpenseFormValues>;

export const ExpenseForm = (props: Props) => {
  const { t } = useTranslation(['expense']);
  const classes = useStyles();
  const { initial, editChoice, isInDrawer } = props;
  const now = DateTime.now().toISODate();

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
  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const staffChoices = [...props.staffList].map((staff) => {
    return {
      value: staff.id,
      label:
        staff.first_name && staff.last_name
          ? `${staff.first_name} ${staff.last_name}`
          : staff.email,
    };
  });
  staffChoices.push({
    value: 0,
    label: t('form.noStaff'),
  });

  return (
    <div className={!isInDrawer ? classes.formContainer : null}>
      {!isInDrawer && (
        <div className={classes.marginBottom}>
          <Typography variant="h5">
            {initial ? t('form.titleEdit') : t('form.titleAdd')}
          </Typography>
        </div>
      )}

      {!!initial?.rrule && (
        <FormControl className={classes.marginBottom}>
          <RadioGroup
            aria-label="edit-choice"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setEditChoice(e.target.value);
            }}
            value={editChoice}
          >
            <FormControlLabel
              control={<Radio />}
              label={t('form.editChoices.editDateDue')}
              value="date_due"
            />
            <Typography className={classes.grey} variant="caption">
              {t('form.editChoices.explanation.dateDue')}
            </Typography>

            <FormControlLabel
              control={<Radio />}
              label={t('form.editChoices.editDetails')}
              value="details"
            />
            <Typography className={classes.grey} variant="caption">
              {t('form.editChoices.explanation.details')}
            </Typography>
          </RadioGroup>
        </FormControl>
      )}

      <Formik
        enableReinitialize
        initialValues={
          initial?.id
            ? {
                ...initial,
                assigned_staff: initial.assigned_staff
                  ? initial.assigned_staff.id
                  : 0,
              }
            : {
                date_due: now,
                amount: 0,
                category: null,
                assigned_staff: 0,
                supplier: null,
                description: null,
                rrule: null,
              }
        }
        onSubmit={(values, actions) => {
          const sanithizedValues = {
            ...values,
            date_due: DateTime.fromISO(values.date_due).toISODate(),
            assigned_staff:
              values.assigned_staff === 0 ? null : values.assigned_staff,
          };
          if (!values.rrule) {
            sanithizedValues.rrule = null;
          }
          const options = {
            onSuccess: () => {
              trackFormSuccess(initial?.id);
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
        validationSchema={expenseSchema}
      >
        {(formikProps: FormikProps<ExpenseFormValues>) => {
          return (
            <React.Fragment>
              <Form>
                {editChoice !== 'details' && (
                  <div className={classes.field}>
                    <DateField
                      disabled={showRepeat && editChoice !== 'date_due'}
                      label={t('form.date_due')}
                      name="date_due"
                    />
                  </div>
                )}

                {editChoice !== 'date_due' && (
                  <React.Fragment>
                    <div className={classes.field}>
                      <SelectField
                        fullWidth
                        choices={staffChoices}
                        label={t('form.staff')}
                        name="assigned_staff"
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        fullWidth
                        label={t('form.category')}
                        name="category"
                        type="text"
                      />
                    </div>
                    <div className={classes.field}>
                      <PriceField
                        fullWidth
                        required
                        label={t('form.amount')}
                        name="amount"
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        fullWidth
                        required
                        label={t('form.supplier')}
                        name="supplier"
                        type="text"
                      />
                    </div>
                    <div className={classes.field}>
                      <TextField
                        fullWidth
                        multiline
                        required
                        label={t('form.description')}
                        name="description"
                        type="text"
                      />
                    </div>

                    <Field name="rrule">
                      {
                        // @ts-expect-error
                        ({ field, form: { setFieldValue } }) => (
                          <ExpenseRecurrencySelector
                            {...field}
                            disabled
                            initial={initial}
                            onChange={(recRule) => {
                              const rule = { ...recRule };
                              for (const key in rule) {
                                // @ts-expect-error
                                if (rule[key] === null) {
                                  // @ts-expect-error
                                  delete rule[key];
                                } else if (
                                  key === 'until' ||
                                  key === 'dtstart'
                                ) {
                                  // @ts-expect-error
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
                            radioRepeatValue={radioRepeatValue}
                            radioValue={radioValue}
                            rrule={rrule}
                            setRadioRepeatValue={setRadioRepeatValue}
                            setRadioValue={setRadioValue}
                            setRrule={setRrule}
                            setShowRepeat={setShowRepeat}
                            showRepeat={showRepeat}
                            value={field.value}
                          />
                        )
                      }
                    </Field>
                  </React.Fragment>
                )}
                <Actions>
                  {!formikProps.isSubmitting && (
                    <div className={classes.actionContainer}>
                      <Button
                        onClick={() => {
                          trackFormCancel(initial?.id);
                          props.onClose();
                        }}
                      >
                        {t('form.actions.cancel')}
                      </Button>
                      <Button
                        color="primary"
                        disabled={formikProps.isSubmitting}
                        onClick={() => {
                          trackFormSubmitIntent(initial?.id);
                          if (initial?.rrule && editChoice === 'details') {
                            setEditDialogOpen(true);
                            setEditScope('current');
                          } else {
                            formikProps.handleSubmit();
                          }
                        }}
                        variant="contained"
                      >
                        {!!initial && !!initial.id
                          ? t('form.actions.edit')
                          : t('form.actions.save')}
                      </Button>
                    </div>
                  )}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEditScope(e.target.value);
                      }}
                      value={editScope}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label={t('dialogEditExpense.future')}
                        value="future"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label={t('dialogEditExpense.all')}
                        value="all"
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <div className={classes.actionButtons}>
                    <Button
                      className={classes.cancel}
                      onClick={() => {
                        setEditDialogOpen(false);
                        setEditScope(null);
                      }}
                    >
                      {t('dialogEditExpense.cancel')}
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        formikProps.handleSubmit();
                      }}
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

export default ExpenseForm;

export const expenseSchema = Yup.object().shape({
  date_due: Yup.string().required('form.requiredField'),
  amount: Yup.string().required('form.requiredField'),
  category: Yup.string().nullable(),
  assigned_staff: Yup.number(),
  supplier: Yup.string().required('form.requiredField'),
  description: Yup.string().required('form.requiredField'),
  rrule: Yup.object().nullable(),
});
