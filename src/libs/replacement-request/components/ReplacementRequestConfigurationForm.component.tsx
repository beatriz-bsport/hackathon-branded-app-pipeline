import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';

import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles, Theme } from '@material-ui/core';
import {
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK,
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
  LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR,
} from '@bsport/common/lib/master-data/replacement';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';

import { OptionCallback } from '../../../state/types';
import { ReplacementRequestConfiguration } from '#libs/replacement-request/types';
import { IntegerField, SwitchField } from '#components/forms';

interface FormikValues {
  days_before_offer_replacement_request_is_late: number;
  days_before_offer_replacement_request_closing_date: number;
  is_late_replacement_request_limited: boolean;
  late_request_limitation_period_type: number;
  late_request_limitation_period_nb: number;
  max_late_requests_per_limitation_period: number;
}
type Props = {
  configuration: ReplacementRequestConfiguration;
  onSubmit: (
    id: number,
    data: Partial<ReplacementRequestConfiguration>,
    options: OptionCallback,
  ) => void;
};

const ReplacementRequestConfigurationForm: React.FC<
  FormikProps<FormikValues>
> = ({ isSubmitting, dirty, isValid, values }) => {
  const { t } = useTranslation('theme');
  const classes = useStyles();

  const periodOptions = useMemo(
    () => [
      {
        label: t(
          'forms.themePersonalization.coachUserspace.requestLimitationPeriods.week',
        ),
        value: LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK,
      },
      {
        label: t(
          'forms.themePersonalization.coachUserspace.requestLimitationPeriods.month',
        ),
        value: LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
      },
      {
        label: t(
          'forms.themePersonalization.coachUserspace.requestLimitationPeriods.year',
        ),
        value: LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR,
      },
    ],
    [t],
  );

  return (
    <form>
      <Form>
        <>
          <Paper elevation={0} className={classes.section}>
            <Typography variant="h6">
              {t(
                'forms.themePersonalization.coachUserspace.replacementSettings',
              )}
            </Typography>
            <div>
              <Typography variant="body1">
                {t(
                  'forms.themePersonalization.coachUserspace.daysBeforeRequestIsLate.helperText',
                )}
              </Typography>
              <IntegerField
                className={classes.integerField}
                name="days_before_offer_replacement_request_is_late"
                label={t(
                  'forms.themePersonalization.coachUserspace.daysBeforeRequestIsLate.placeholder',
                )}
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                  classes: { input: classes.integerInput },
                }}
                fullWidth
                variant="outlined"
              />
              <div className={classes.descriptionContainer}>
                <InfoOutlinedIcon className={classes.infoIcon} />
                <Typography className={classes.description} variant="body2">
                  {t(
                    'forms.themePersonalization.coachUserspace.daysBeforeRequestIsLate.description',
                    {
                      count:
                        values.days_before_offer_replacement_request_is_late,
                    },
                  )}
                </Typography>
              </div>
            </div>
            <div>
              <SwitchField
                name="is_late_replacement_request_limited"
                label={t(
                  'forms.themePersonalization.coachUserspace.isLateReplacementRequestLimited',
                )}
              />
              <Collapse in={values.is_late_replacement_request_limited}>
                <IntegerField
                  className={classes.integerField}
                  name="max_late_requests_per_limitation_period"
                  label={t(
                    'forms.themePersonalization.coachUserspace.maxNbRequestPerPeriod.helperText',
                  )}
                  InputProps={{
                    inputProps: { min: 1, step: 1 },
                    classes: { input: classes.integerInput },
                  }}
                  fullWidth
                  variant="outlined"
                />
                <div
                  className={classnames(
                    classes.everyContainer,
                    classes.periodContainer,
                  )}
                >
                  <Typography className={classes.periodTypo}>
                    {t(
                      'forms.themePersonalization.coachUserspace.daysBeforeReplacementClosing.every',
                    )}
                  </Typography>
                  <IntegerField
                    className={classes.nbPeriods}
                    name="late_request_limitation_period_nb"
                    InputProps={{
                      inputProps: { min: 1, step: 1 },
                    }}
                  />
                  <MaterialUiSingleSelectorField
                    className={classes.periodSelector}
                    options={periodOptions}
                    name="late_request_limitation_period_type"
                    placeholder={t(
                      'forms.themePersonalization.coachUserspace.requestLimitationPeriods.placeholder',
                    )}
                    inScrollBar
                  />
                </div>
                <div className={classes.descriptionContainer}>
                  <InfoOutlinedIcon className={classes.infoIcon} />
                  <Typography className={classes.description} variant="body2">
                    {t(
                      `forms.themePersonalization.coachUserspace.maxNbRequestPerPeriod.recap.${values.late_request_limitation_period_type}`,
                      {
                        nbPeriods: values.late_request_limitation_period_nb,
                        nbRequests:
                          values.max_late_requests_per_limitation_period,
                      },
                    )}
                  </Typography>
                </div>
              </Collapse>
            </div>
            <div>
              <Typography variant="body1">
                {t(
                  'forms.themePersonalization.coachUserspace.daysBeforeReplacementClosingAcceptance.helperText',
                )}
              </Typography>
              <IntegerField
                className={classes.integerField}
                name="days_before_offer_replacement_request_closing_date"
                label={t(
                  'forms.themePersonalization.coachUserspace.daysBeforeReplacementClosingAcceptance.placeholder',
                )}
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                  classes: { input: classes.integerInput },
                }}
                value={
                  values.days_before_offer_replacement_request_closing_date
                }
                fullWidth
                variant="outlined"
              />
              <div className={classes.descriptionContainer}>
                <InfoOutlinedIcon className={classes.infoIcon} />
                <Typography className={classes.description} variant="body2">
                  {t(
                    'forms.themePersonalization.coachUserspace.daysBeforeReplacementClosingAcceptance.description',
                    {
                      count:
                        values.days_before_offer_replacement_request_closing_date,
                    },
                  )}
                </Typography>
              </div>
            </div>
          </Paper>
          <div>
            <Button
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
              variant="contained"
              color="primary"
              className={classes.confirm}
            >
              {t('forms.submit')}
            </Button>
          </div>
        </>
      </Form>
    </form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  integerField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  integerInput: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  confirm: {
    marginBottom: theme.spacing(5),
  },
  descriptionContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  description: {
    color: chroma(theme.palette.info.dark).darken(1.5).hex(),
  },
  everyContainer: {
    display: 'flex',
    alignContent: 'center',
  },
  infoIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(1),
  },
  periodTypo: { marginRight: theme.spacing(2) },
  periodSelector: { maxWidth: '400px', flex: 1 },
  periodContainer: { alignItems: 'center', marginTop: theme.spacing(1) },
  nbPeriods: { marginRight: theme.spacing(2), flex: 1, maxWidth: '200px' },
}));

const ReplacementRequestConfigurationSchema = Yup.object().shape({
  days_before_offer_replacement_request_is_late: Yup.number().min(1),
  is_late_replacement_request_limited: Yup.boolean(),
  max_late_requests_per_limitation_period: Yup.number().min(1),
  late_request_limitation_period_type: Yup.number().oneOf([
    LATE_REQUEST_LIMITATION_PERIOD_TYPE_WEEK,
    LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
    LATE_REQUEST_LIMITATION_PERIOD_TYPE_YEAR,
  ]),
  days_before_offer_replacement_request_closing_date: Yup.number().min(1),
  late_request_limitation_period_nb: Yup.number().min(1),
});

const ThemePersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ configuration }) => {
    if (configuration) {
      return {
        days_before_offer_replacement_request_is_late:
          configuration.days_before_offer_replacement_request_is_late,
        max_late_requests_per_limitation_period:
          configuration.max_late_requests_per_limitation_period,
        is_late_replacement_request_limited:
          configuration.is_late_replacement_request_limited,
        late_request_limitation_period_type:
          configuration.late_request_limitation_period_type,
        days_before_offer_replacement_request_closing_date:
          configuration.days_before_offer_replacement_request_closing_date,
        late_request_limitation_period_nb:
          configuration.late_request_limitation_period_nb,
      };
    }
    return {
      days_before_offer_replacement_request_is_late: 21,
      max_late_requests_per_limitation_period: 3,
      is_late_replacement_request_limited: true,
      late_request_limitation_period_type:
        LATE_REQUEST_LIMITATION_PERIOD_TYPE_MONTH,
      days_before_offer_replacement_request_closing_date: 14,
      late_request_limitation_period_nb: 1,
    };
  },
  validationSchema: ReplacementRequestConfigurationSchema,
  handleSubmit: (
    values,
    { props: { onSubmit, configuration }, setSubmitting },
  ) => {
    const data = {
      days_before_offer_replacement_request_is_late:
        values.days_before_offer_replacement_request_is_late,
      max_late_requests_per_limitation_period:
        values.max_late_requests_per_limitation_period,
      is_late_replacement_request_limited:
        values.is_late_replacement_request_limited,
      late_request_limitation_period_type:
        values.late_request_limitation_period_type,
      days_before_offer_replacement_request_closing_date:
        values.days_before_offer_replacement_request_closing_date,
      late_request_limitation_period_nb:
        values.late_request_limitation_period_nb,
    };

    onSubmit(configuration.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default ThemePersonalizeFormFormikHOC(
  ReplacementRequestConfigurationForm,
);
