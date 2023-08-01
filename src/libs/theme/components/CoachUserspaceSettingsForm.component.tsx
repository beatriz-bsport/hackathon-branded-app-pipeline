// @ts-nocheck
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles, Theme } from '@material-ui/core';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';

import { OptionCallback } from '../../../state/types';
import type { CompanyTheme } from '../types';
import { SwitchField } from '#components/forms';
import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

interface FormikValues {
  is_coach_access_enabled_by_default: boolean;
  has_coach_access_to_calendar: boolean;
  has_coach_access_to_compensation: boolean;
  has_coach_access_to_replacement_request: boolean;
}
type Props = {
  theme: CompanyTheme;
  onSubmit: (id: number, data: Partial<Theme>, options: OptionCallback) => void;
  setDisplayConfiguration: (value: boolean) => void;
};

const CoachUserspaceSettingsForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  dirty,
  isValid,
  errors,
  setDisplayConfiguration,
  values,
}) => {
  const { t } = useTranslation('theme');
  const classes = useStyles();

  useEffect(
    () =>
      setDisplayConfiguration(values.has_coach_access_to_replacement_request),
    [values.has_coach_access_to_replacement_request, setDisplayConfiguration],
  );

  return (
    <form>
      <Form>
        <FeatureListProvider>
          {(featureList) => (
            <>
              <div className={classes.titleContainer}>
                <div
                  className={classnames(
                    classes.mainDescriptionContainer,
                    classes.descriptionContainer,
                  )}
                >
                  <InfoOutlinedIcon className={classes.infoIcon} />
                  <Typography className={classes.description} variant="body2">
                    {t('forms.themePersonalization.coachUserspace.description')}
                  </Typography>
                </div>
              </div>

              <Paper className={classes.section} elevation={0}>
                <div className={classes.subsection}>
                  <Typography variant="h6">
                    {t('forms.themePersonalization.coachUserspace.access')}
                  </Typography>
                  <SwitchField
                    label={t(
                      'forms.themePersonalization.coachUserspace.enable',
                    )}
                    name="is_coach_access_enabled_by_default"
                  />
                  <div className={classes.descriptionContainer}>
                    <InfoOutlinedIcon className={classes.infoIcon} />
                    <Typography className={classes.description} variant="body2">
                      {t(
                        'forms.themePersonalization.coachUserspace.enableDescription',
                      )}
                    </Typography>
                  </div>
                </div>
                <Typography variant="h6">
                  {t('forms.themePersonalization.coachUserspace.restrictions')}
                </Typography>
                <div className={classes.descriptionContainer}>
                  <InfoOutlinedIcon className={classes.infoIcon} />
                  <Typography className={classes.description} variant="body2">
                    {t(
                      'forms.themePersonalization.coachUserspace.restrictionsDescription',
                    )}
                  </Typography>
                </div>
                <SwitchField
                  label={t(
                    'forms.themePersonalization.coachUserspace.enableSchedule',
                  )}
                  name="has_coach_access_to_calendar"
                />
                <SwitchField
                  label={t(
                    'forms.themePersonalization.coachUserspace.enableRemuneration',
                  )}
                  name="has_coach_access_to_compensation"
                />
                <SwitchField
                  disabled={
                    !hasUpsell(featureList, UPSELL_IDENTIFIER_SUBTEACHER_TOOL)
                  }
                  label={t(
                    'forms.themePersonalization.coachUserspace.enableReplacement',
                  )}
                  name="has_coach_access_to_replacement_request"
                />
                {errors.has_coach_access_to_replacement_request && (
                  <Typography className={classes.error} variant="body2">
                    {t(errors.has_coach_access_to_replacement_request)}
                  </Typography>
                )}
              </Paper>

              <div>
                <Button
                  className={classes.confirm}
                  color="primary"
                  disabled={isSubmitting || !dirty || !isValid}
                  type="submit"
                  variant="contained"
                >
                  {t('forms.submit')}
                </Button>
              </div>
            </>
          )}
        </FeatureListProvider>
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
  subsection: { marginBottom: theme.spacing(2) },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confirm: {
    marginBottom: theme.spacing(5),
  },
  titleContainer: {
    display: 'table',
    marginBottom: theme.spacing(5),
    border: 'solid 1px',
    borderRadius: theme.spacing(0.5),
    borderColor: theme.palette.info.light,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  mainDescriptionContainer: {
    marginBottom: '0 !important',
    [theme.breakpoints.down('xs')]: {
      padding: '0 !important',
    },
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
  error: { color: theme.palette.error.main },
}));

const ThemePersonalizeFormSchema = Yup.object().shape({
  is_coach_access_enabled_by_default: Yup.boolean(),
  has_coach_access_to_calendar: Yup.boolean(),
  has_coach_access_to_compensation: Yup.boolean(),
  has_coach_access_to_replacement_request: Yup.boolean().test(
    'at-least-one-toggle-activated',
    'forms.themePersonalization.coachUserspace.errors.restrictionToggles',
    function checkAtLeastOneToggleActivated(
      has_coach_access_to_replacement_request,
    ) {
      const { has_coach_access_to_calendar, has_coach_access_to_compensation } =
        this.parent;
      return (
        has_coach_access_to_calendar ||
        has_coach_access_to_compensation ||
        has_coach_access_to_replacement_request
      );
    },
  ),
});

const ThemePersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ theme }) => {
    if (theme) {
      return {
        is_coach_access_enabled_by_default:
          theme.is_coach_access_enabled_by_default,
        has_coach_access_to_calendar: theme.has_coach_access_to_calendar,
        has_coach_access_to_compensation:
          theme.has_coach_access_to_compensation,
        has_coach_access_to_replacement_request:
          theme.has_coach_access_to_replacement_request,
      };
    }
    return {
      is_coach_access_enabled_by_default: false,
      has_coach_access_to_calendar: true,
      has_coach_access_to_compensation: true,
      has_coach_access_to_replacement_request: false,
    };
  },
  validationSchema: ThemePersonalizeFormSchema,
  handleSubmit: (values, { props: { onSubmit, theme }, setSubmitting }) => {
    const data = {
      is_coach_access_enabled_by_default:
        values.is_coach_access_enabled_by_default,
      has_coach_access_to_calendar: values.has_coach_access_to_calendar,
      has_coach_access_to_compensation: values.has_coach_access_to_compensation,
      has_coach_access_to_replacement_request:
        values.has_coach_access_to_replacement_request,
    };

    onSubmit(theme.company, data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default ThemePersonalizeFormFormikHOC(CoachUserspaceSettingsForm);
