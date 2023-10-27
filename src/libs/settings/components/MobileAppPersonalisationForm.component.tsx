import React, { useMemo, useCallback } from 'react';

import Select from 'react-select';
import { withFormik, Form, FormikProps } from 'formik';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, InputLabel, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { OptionCallback } from '../../../state/types';
import { CompanyTheme, DefaultPageOption } from '#libs/theme/types';

const DEFAULT_HOME_PAGE = DefaultPageOption.HOME;

interface FormikValues {
  mobile_app_default_page: DefaultPageOption;
}

type Props = {
  theme: CompanyTheme;
  onSubmit: (id: number, data: FormData, options: OptionCallback) => void;
};

const MobileAppPersonalisationForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  isValid,
  handleSubmit,
  setFieldValue,
  values,
  initialValues,
}) => {
  const { t } = useTranslation('settings');
  const classes = useStyles();

  const mobileAppDefaultPageOptions = useMemo(
    () => [
      {
        label: t(
          'mobilePersonalization.customize.defaultPage.pageContent.options.membership',
        ),
        value: DefaultPageOption.MEMBERSHIP,
      },
      {
        label: t(
          'mobilePersonalization.customize.defaultPage.pageContent.options.bookings',
        ),
        value: DefaultPageOption.BOOKINGS,
      },
      {
        label: t(
          'mobilePersonalization.customize.defaultPage.pageContent.options.home',
        ),
        value: DefaultPageOption.HOME,
      },
      {
        label: t(
          'mobilePersonalization.customize.defaultPage.pageContent.options.marketplace',
        ),
        value: DefaultPageOption.MARKETPLACE,
      },
      {
        label: t(
          'mobilePersonalization.customize.defaultPage.pageContent.options.profile',
        ),
        value: DefaultPageOption.PROFILE,
      },
    ],
    [t],
  );

  const pageDisplayCurrent = React.useMemo(
    () =>
      mobileAppDefaultPageOptions.find(
        (element) => element.value === values.mobile_app_default_page,
      ),
    [mobileAppDefaultPageOptions, values.mobile_app_default_page],
  );

  const handleOnChangeDefaultPage = useCallback(
    (option: { label: string; value: DefaultPageOption }) => {
      setFieldValue('mobile_app_default_page', option.value);
    },
    [setFieldValue],
  );

  const isSubmitButtonDisabled =
    isSubmitting ||
    !isValid ||
    initialValues.mobile_app_default_page === values.mobile_app_default_page;

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.main}>
        <Paper className={classes.paper}>
          <Typography className={classes.namesHeader}>
            {t('mobilePersonalization.customize.defaultPage.title')}
          </Typography>
          <InputLabel>
            {t(
              'mobilePersonalization.customize.defaultPage.pageContent.helperText',
            )}
          </InputLabel>
          <div className={classes.selector}>
            <div className={classes.selector}>
              <Select
                name="mobile_app_default_page"
                onChange={handleOnChangeDefaultPage}
                options={mobileAppDefaultPageOptions}
                placeholder={t(
                  'mobilePersonalization.customize.defaultPage.pageContent.placeholder',
                )}
                value={pageDisplayCurrent}
                variant="outlined"
              />
            </div>
          </div>
          <Button
            className={classes.confirm}
            color="primary"
            disabled={isSubmitButtonDisabled}
            type="submit"
            variant="contained"
          >
            {t('common:save')}
          </Button>
        </Paper>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 500,
  },
  confirm: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'fit-content',
    },
  },
  selector: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
  },
}));

const MobileAppPersonalisationFormFormikHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ theme }) => {
    if (theme) {
      return {
        mobile_app_default_page: theme.mobile_app_default_page,
      };
    }
    return {
      mobile_app_default_page: DEFAULT_HOME_PAGE,
    };
  },
  enableReinitialize: true,
  handleSubmit: (values, { props: { onSubmit, theme }, setSubmitting }) => {
    const data = new FormData();
    data.append('mobile_app_default_page', values.mobile_app_default_page);
    onSubmit(theme.company, data, {
      onSuccess: () => {
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  },
});

export default React.memo(
  MobileAppPersonalisationFormFormikHOC(MobileAppPersonalisationForm),
);
