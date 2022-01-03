// @flow
import React, { MouseEvent } from 'react';
import { Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack';

import * as Yup from 'yup';
import { Form, withFormik, FormikProps } from 'formik';

import {
  IntegerField,
  TextField,
  PercentField,
  SwitchField,
  PriceField,
  RadioGroupField,
} from '../../../../components/forms';
import { PrivatePassWithCompatibility } from '../../types';
import { getValidityInfo } from '../../utils';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';

interface FormikValues {
  name: string | null;
  tax: number;
  credits: number;
  price: number;
  manager_only: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  start_date_method: string;
  expiration_days_before_first_use: number;
}
type Props = {
  isSubmitting: boolean;
  onCancel: (ev: MouseEvent) => void;
  values: any;
  initial?: PrivatePassWithCompatibility;
} & WithSegmentAnalyticsFormTrackerHandlers &
  FormikProps<FormikValues>;

export const PrivatePassTemplateForm = (props: Props) => {
  React.useEffect(() => {
    props?.formAdd(
      props.initial?.id ? { private_pass_id: props.initial.id } : {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { isSubmitting } = props;

  return (
    <Form className={classes.container}>
      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.info')}
          </Typography>
        </div>

        <TextField
          name="name"
          fullWidth
          label={`${t('privatePass.form.name.label')}*`}
          helperText={t('privatePass.form.name.helperText')}
        />
        <div className={classes.fieldBlock}>
          <IntegerField
            name="credits"
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            label={t('privatePass.form.credits.label')}
            helperText={t('privatePass.form.credits.helperText')}
          />
        </div>
        <div className={`${classes.fieldBlock} ${classes.flexRowCenter}`}>
          <PriceField
            name="price"
            fullWidth
            label={t('privatePass.form.price.label')}
            className={classes.priceField}
            helperText={t('privatePass.form.price.helperText')}
          />
          <PercentField
            name="tax"
            fullWidth
            label={t('privatePass.form.tax.label')}
            type="number"
            required
            max={100}
            InputProps={{
              inputProps: { min: 0, max: 100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            className={classes.taxField}
          />
        </div>

        <div className={`${classes.fieldBlock} ${classes.flexColumn}`}>
          <SwitchField
            name="manager_only"
            label={t('privatePass.form.managerOnly.label')}
          />
        </div>
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
            name="duration_days"
            label={t('privatePass.form.durationDays.label')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            style={{ alignSelf: 'flex-start' }}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            name="duration_months"
            label={t('privatePass.form.durationMonths.label')}
            helperText={t('privatePass.form.durationMonths.helperText')}
            InputProps={{ min: 0, max: 24, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            name="duration_years"
            label={t('privatePass.form.durationYears.label')}
            helperText={t('privatePass.form.durationYears.helperText')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
          />
        </div>
        <Typography variant="caption">
          {getValidityInfo(props.values, t, true, true)}
        </Typography>
        <div style={{ paddingBottom: 16 }}>
          <Typography variant="body1" className={classes.startDate}>
            {t('privatePass.form.startDate')}
          </Typography>
          <RadioGroupField
            name="start_date_method"
            disabled={props.initial && props.initial.editable === false}
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
          />
          <Collapse
            in={props.values.start_date_method !== `${START_ON_PURCHASE}`}
          >
            <TextField
              name="expiration_days_before_first_use"
              label={t('privatePass.form.expirationDaysBeforeFirstUse.label')}
              disabled={props.initial && props.initial.editable === false}
              helperText={t(
                'privatePass.form.expirationDaysBeforeFirstUse.helperText',
              )}
              type="number"
              fullWidth
              className={classes.firstBooking}
            />
          </Collapse>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={`${classes.buttonContainer} ${classes.flexRowCenter}`}>
        <Button
          onClick={(e: MouseEvent) => {
            props.onCancel(e);
            props?.formCancel(
              props.initial?.id ? { private_pass_id: props.initial.id } : {},
            );
          }}
        >
          {t('privatePass.form.actions.cancel')}
        </Button>
        <Button
          onClick={() => {
            props?.formSubmitIntent(
              props.initial?.id ? { private_pass_id: props.initial.id } : {},
            );
            props.handleSubmit();
          }}
          disabled={isSubmitting}
          color="primary"
          variant="contained"
        >
          {t('privatePass.form.actions.submit')}
        </Button>
      </div>
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
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
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
  paymentMeansHelpertext: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  yellowIcon: {
    color: '#FFA71D',
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
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  emptyListItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
}));

export const PrivatePassSchema = Yup.object().shape({
  name: Yup.string().required(),
  tax: Yup.number().required(),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  duration_days: Yup.number().required().integer().min(0),
  duration_months: Yup.number().required().integer().min(0),
  duration_years: Yup.number().required().integer().min(0),
  start_date_method: Yup.number().required().integer().min(0).max(2),
  expiration_days_before_first_use: Yup.number(),
});

export const PrivatePassTemplateFormikHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ initial }) => {
    if (initial && initial.id)
      return {
        ...initial,
        start_date_method: `${initial.start_date_method}`,
      };

    return {
      name: null,
      tax: 0,
      credits: 1,
      price: 0,
      manager_only: false,
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      start_date_method: `${START_ON_PURCHASE}`,
      expiration_days_before_first_use: 365,
    };
  },
  enableReinitialize: true,
  validationSchema: PrivatePassSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, initial, formSuccess }, setSubmitting },
  ) => {
    onSubmit(values, {
      onSuccess: () => {
        formSuccess &&
          formSuccess(initial?.id ? { private_pass_id: initial.id } : {});
        setSubmitting(false);
      },
      onError: (err) => {
        console.error(err);
        setSubmitting(false);
      },
    });
  },
});

export default compose<any, Props>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.PRIVATE_PASS_TEMPLATE,
  }),
  PrivatePassTemplateFormikHOC,
)(PrivatePassTemplateForm);
