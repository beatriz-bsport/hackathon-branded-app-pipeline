import React from 'react';

import moment from 'moment-timezone';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form } from 'formik';
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
} from '#components/forms';

type Props = {
  values: any;
  handleExportation: () => void;
};

const ClockInHistoryHeaderSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;

        return moment(dateStart).isSameOrBefore(moment(dateEnd));
      },
    ),
});

export function ClockInHistoryHeaderForm(props: Props) {
  const { handleExportation } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Form>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <DateField name="dateStart" fullWidth label={t('common.from')} />
          <AlertError name="dateStart" />
        </Grid>
        <Grid item>
          <DateField name={'dateEnd'} fullWidth label={t('common.until')} />
          <AlertError name={'dateEnd'} />
        </Grid>
        <Grid item>
          <Actions>
            <Button variant="outlined" type="submit" color="primary">
              {t('common.generate')}
            </Button>
          </Actions>
        </Grid>
        <Grid item>
          <Actions>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleExportation()}
            >
              {t('common.export')}
              <CloudDownloadIcon className={classes.rightIcon} />
            </Button>
          </Actions>
        </Grid>
      </Grid>
    </Form>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default compose<any, Props>(
  withFormik({
    mapPropsToValues: ({ config }) => {
      return {
        dateStart: config.dateStart,
        dateEnd: config.dateEnd,
      };
    },
    validationSchema: ClockInHistoryHeaderSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ClockInHistoryHeaderForm);
