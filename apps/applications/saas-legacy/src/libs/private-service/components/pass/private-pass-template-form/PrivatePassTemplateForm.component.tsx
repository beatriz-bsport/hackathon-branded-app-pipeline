import React, { MouseEvent, useCallback } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Form, withFormik, FormikProps, FormikErrors } from 'formik';
import { DateTime } from 'luxon';

import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';
import InputLabel from '@material-ui/core/InputLabel';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack.js';

import ToolTip from '#src/components/Tooltip.component';
import PrivatePassTemplateEditConfirmationDialog from '#src/libs/private-service/components/pass/PrivatePassTemplateEditConfirmationDialog.component';
import {
  IntegerField,
  TextField,
  PercentField,
  SwitchField,
  PriceField,
  RadioGroupField,
  DateField,
  // @ts-expect-error
} from '#src/components/forms';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import type { PrivatePassWithCompatibility } from '#src/libs/private-service/types';
import { getValidityInfo } from '#src/libs/private-service/utils';
import { ALMOST_100 } from '#src/constants';
import WarningIcon from '@material-ui/icons/Warning';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivatePassTemplate,
);
interface FormikValues {
  name: string | null;
  description: string | null;
  tax: number;
  credits: number;
  price: number;
  manager_only: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  start_date_method: string;
  expiration_days_before_first_use: number;
  unusable_by_staff: boolean;
  expiration_date_active: boolean;
  expiration_date: DateTime | null;
}
type Props = {
  onCancel: (ev: MouseEvent) => void;
  values: any;
  initial?: PrivatePassWithCompatibility;
} & FormikProps<FormikValues>;

export const PrivatePassTemplateForm = (props: Props) => {
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { isSubmitting, isValid } = props;
  const [editConfirmationDialogOpen, setEditConfirmationDialogOpen] =
    React.useState<boolean>(false);

  const handleAddOrEdit = useCallback(() => {
    if (!props.initial) {
      trackFormSubmitIntent(props.initial?.id);
      props.handleSubmit();
    } else {
      setEditConfirmationDialogOpen(true);
    }
  }, [props]);

  const submitEditConfirmation = useCallback(() => {
    setEditConfirmationDialogOpen(false);

    trackFormSubmitIntent(props.initial?.id);
    props.handleSubmit();
  }, [props]);

  const handleCloseEditConfirmationDialog = useCallback(() => {
    setEditConfirmationDialogOpen(false);
  }, []);

  return (
    <Form className={classes.container}>
      <div className={classes.categoryBlock}>
        {props?.initial && props?.initial?.editable === false ? (
          <div className={classes.flexRowCenter}>
            <WarningIcon className={classes.iconLeftSpacing} color="error" />
            <Typography color="error" variant="body1">
              {t('privatePass.form.notEditable')}
            </Typography>
          </div>
        ) : null}
        <div className={classes.flexRowCenter}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.info')}
          </Typography>
        </div>

        <TextField
          fullWidth
          helperText={t('privatePass.form.name.helperText')}
          label={`${t('privatePass.form.name.label')}*`}
          name="name"
        />
        <TextField
          fullWidth
          multiline
          label={t('privatePass.form.description.label')}
          minRows={6}
          name="description"
          variant="outlined"
        />
        <div className={classes.fieldBlock}>
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.credits.helperText')}
            label={t('privatePass.form.credits.label')}
            name="credits"
          />
        </div>
        <div className={`${classes.fieldBlock} ${classes.flexRowCenter}`}>
          <PriceField
            fullWidth
            className={classes.priceField}
            helperText={t('privatePass.form.price.helperText')}
            label={t('privatePass.form.price.label')}
            name="price"
          />
          <PercentField
            fullWidth
            required
            className={classes.taxField}
            InputProps={{
              inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            label={t('privatePass.form.tax.label')}
            max={ALMOST_100}
            name="tax"
            type="number"
          />
        </div>

        <div className={`${classes.fieldBlock} ${classes.flexColumn}`}>
          <SwitchField
            label={t('privatePass.form.managerOnly.label')}
            name="manager_only"
          />
        </div>

        <div className={`${classes.fieldBlock} ${classes.flexColumn}`}>
          <SwitchField
            label={t('privatePass.listItem.unusableByStaff')}
            name="unusable_by_staff"
          />
        </div>
        <div className={classes.rowExpirationDate}>
          <SwitchField
            label={t('privatePass.form.expiration_date.label')}
            name="expiration_date_active"
          />
          <ToolTip title={t('privatePass.form.expiration_date.tooltip')}>
            <InfoIcon color="disabled" />
          </ToolTip>
        </div>
        <Collapse in={props.values.expiration_date_active}>
          <InputLabel className={classes.inputLabelExpirationDate}>
            {t('privatePass.form.expiration_date.helperText')}
          </InputLabel>
          <DateField
            allowNullValue
            minDate={DateTime.now()}
            name="expiration_date"
          />
        </Collapse>
      </div>

      <Divider className={classes.divider} />

      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <DateRangeIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.validity')}
          </Typography>
        </div>
        <div className={`${classes.durationNbBlock} ${classes.flexRowCenter}`}>
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            InputProps={{ min: 0, max: 30, step: 1 }}
            label={t('privatePass.form.durationDays.label')}
            name="duration_days"
            style={{ alignSelf: 'flex-start' }}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.durationMonths.helperText')}
            InputProps={{ min: 0, max: 24, step: 1 }}
            label={t('privatePass.form.durationMonths.label')}
            name="duration_months"
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            helperText={t('privatePass.form.durationYears.helperText')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            label={t('privatePass.form.durationYears.label')}
            name="duration_years"
          />
        </div>
        <Typography variant="caption">
          {getValidityInfo(props.values, t, true, true)}
        </Typography>
        <div style={{ paddingBottom: 16 }}>
          <Typography className={classes.startDate} variant="body1">
            {t('privatePass.form.startDate')}
          </Typography>
          <RadioGroupField
            choices={[
              {
                label: t('privatePass.form.start_date_method.on_purchase'),
                value: START_ON_PURCHASE,
              },
              {
                label: t('privatePass.form.start_date_method.on_booking'),
                value: START_ON_FIRST_BOOKING,
              },
            ]}
            disabled={props.initial && props.initial.editable === false}
            name="start_date_method"
          />
          <Collapse
            in={props.values.start_date_method !== `${START_ON_PURCHASE}`}
          >
            <TextField
              fullWidth
              className={classes.firstBooking}
              disabled={props.initial && props.initial.editable === false}
              helperText={t(
                'privatePass.form.expirationDaysBeforeFirstUse.helperText',
              )}
              label={t('privatePass.form.expirationDaysBeforeFirstUse.label')}
              name="expiration_days_before_first_use"
              type="number"
            />
          </Collapse>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={`${classes.buttonContainer} ${classes.flexRowCenter}`}>
        <Button
          onClick={(e: MouseEvent) => {
            props.onCancel(e);
            trackFormCancel(props.initial?.id);
          }}
        >
          {t('privatePass.form.actions.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={isSubmitting || !isValid}
          onClick={handleAddOrEdit}
          variant="contained"
        >
          {t('privatePass.form.actions.submit')}
        </Button>
      </div>
      <PrivatePassTemplateEditConfirmationDialog
        onClose={handleCloseEditConfirmationDialog}
        onSubmit={submitEditConfirmation}
        open={editConfirmationDialogOpen}
      />
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: -theme.spacing(2),
    justifyContent: 'flex-end',
    padding: theme.spacing(4),
  },

  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  iconLeftSpacing: {
    marginRight: theme.spacing(2),
  },
  priceField: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taxField: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    height: 2,
    width: '100%',
    color: '#C6C6C6',
  },
  categoryBlock: {
    padding: theme.spacing(4),
  },
  durationNbBlock: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  startDate: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: theme.spacing(3),
  },
  greyIcon: {
    color: '#868686',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  firstBooking: {
    marginTop: theme.spacing(2),
  },
  rowExpirationDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabelExpirationDate: { marginTop: theme.spacing(1), fontSize: 12 },
}));

const MAX_TOTAL_DURATION_IN_DAYS = 50 * 365;

const isInvalidDuration = (days: number, months: number, years: number) => {
  const totalInDays = days + months * 31 + years * 365;
  return totalInDays <= 0 || totalInDays > MAX_TOTAL_DURATION_IN_DAYS;
};

export const PrivatePassSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().nullable(),
  tax: Yup.number().required().min(0).max(ALMOST_100),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  duration_days: Yup.number().required().integer().min(0),
  duration_months: Yup.number().required().integer().min(0),
  duration_years: Yup.number().required().integer().min(0),
  start_date_method: Yup.number().required().integer().min(0).max(2),
  expiration_days_before_first_use: Yup.number(),
  unusable_by_staff: Yup.boolean().required(),
  expiration_date: Yup.date().nullable(),
});

export const PrivatePassTemplateFormikHOC = withFormik<Props, FormikValues>({
  // @ts-expect-error
  mapPropsToValues: ({ initial }) => {
    if (initial && initial.id)
      return {
        ...initial,
        start_date_method: `${initial.start_date_method}`,
        unusable_by_staff: !initial.is_usable_by_staff,
        expiration_date_active: !!initial?.expiration_date,
        expiration_date: initial.expiration_date
          ? DateTime.fromISO(initial.expiration_date)
          : null,
      };

    return {
      name: null,
      description: null,
      tax: 0,
      credits: 1,
      price: 0,
      manager_only: false,
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      start_date_method: `${START_ON_PURCHASE}`,
      expiration_days_before_first_use: 365,
      unusable_by_staff: false,
      expiration_date: null,
      expiration_date_active: false,
    };
  },
  enableReinitialize: true,
  validateOnMount: true,
  validationSchema: PrivatePassSchema,
  validate(values) {
    const errors: FormikErrors<FormikValues> = {};
    if (
      isInvalidDuration(
        values.duration_days,
        values.duration_months,
        values.duration_years,
      )
    ) {
      // the error texts are not displayed anywhere,
      // but it's only used here as a multi field error marker
      errors.duration_days = 'Invalid';
      errors.duration_months = 'Invalid';
      errors.duration_years = 'Invalid';
    }
    return errors;
  },
  // @ts-expect-error
  handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
    onSubmit(
      {
        ...values,
        is_usable_by_staff: !values.unusable_by_staff,
        expiration_date:
          values.expiration_date_active && values.expiration_date
            ? values.expiration_date.toISODate()
            : null,
      },

      {
        onSuccess: () => {
          trackFormSuccess(initial?.id);
          setSubmitting(false);
        },
        onError: (err: Error) => {
          console.error(err);
          setSubmitting(false);
        },
      },
    );
  },
});

export default compose<any, Props>(PrivatePassTemplateFormikHOC)(
  PrivatePassTemplateForm,
);
