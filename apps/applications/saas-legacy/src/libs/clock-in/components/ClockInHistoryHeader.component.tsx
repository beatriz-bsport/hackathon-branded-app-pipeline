import React from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {
  AlertError,
  DateField,
  Actions,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#src/components/forms';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  handleExportation: () => void;
  onSubmit: (values: Values) => void;
} & Values;

export type Values = {
  dateStart: DateTime;
  dateEnd: DateTime;
};

type HOCProps = Props & FormikProps<Values>;

const ClockInHistoryHeaderSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;
        return dateStart <= dateEnd;
      },
    ),
});

const ClockInHistoryHeaderForm: React.FC<HOCProps> = ({
  handleExportation,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Form>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <DateField fullWidth label={t('common.from')} name="dateStart" />
          <AlertError name="dateStart" />
        </Grid>
        <Grid item>
          <DateField fullWidth label={t('common.until')} name="dateEnd" />
          <AlertError name="dateEnd" />
        </Grid>
        <Grid item>
          <Actions>
            <Button color="primary" type="submit" variant="outlined">
              {t('common.generate')}
            </Button>
          </Actions>
        </Grid>
        <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.attendance">
          {(hasPermission) =>
            hasPermission && (
              <Grid item>
                <Actions>
                  <Button
                    color="primary"
                    onClick={() => handleExportation()}
                    variant="outlined"
                  >
                    {t('common.export')}
                    <CloudDownloadIcon className={classes.rightIcon} />
                  </Button>
                </Actions>
              </Grid>
            )
          }
        </ObjectLevelPermissionProviderComponent>
      </Grid>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default compose<any, Props>(
  withFormik<HOCProps, Values>({
    mapPropsToValues: ({ dateStart, dateEnd }) => {
      return {
        dateStart,
        dateEnd,
      };
    },
    validationSchema: ClockInHistoryHeaderSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ClockInHistoryHeaderForm);
