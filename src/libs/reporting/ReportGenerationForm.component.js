// @flow

import React from 'react';

import moment from 'moment';

import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
  AlertError,
  DateField,
  Submit,
  Actions,
  defaultHandleSubmit,
} from '../../components/forms';

import type { ReportConfiguration } from './types';

import { getAuth } from '../../http';

type Props = {
  reportConfiguration: ReportConfiguration,
  isSubmitting: boolean,
  t: TFunction,
  exportLink?: string,
  classes: { [string]: string },
};

const ReportGenerationSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date().required('required'),
});

function DownloadButton(props: DownloadButtonProps) {
  const { exportLink, classes, t } = props;
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={async () => {
        const response = await getAuth(exportLink);
        const filename = /"(.+)"/gi.exec(
          response.headers['content-disposition'],
        )[1];
        const file = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = window.URL.createObjectURL(file);
        link.download = filename;
        link.click();
      }}
      disabled={!exportLink}
    >
      {t('common.export')}
      <CloudDownloadIcon className={classes.rightIcon} />
    </Button>
  );
}

export function ReportGenerationForm(props: Props) {
  const { t, isSubmitting, reportConfiguration, exportLink, classes } = props;
  return (
    <Form>
      <Typography variant="subtitle1">{reportConfiguration.name}</Typography>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <DateField name="dateStart" fullWidth label={t('common.from')} />
          <AlertError name="dateStart" />
        </Grid>
        <Grid item xs={6}>
          <DateField name="dateEnd" fullWidth label={t('common.until')} />
          <AlertError name="dateEnd" />
        </Grid>
      </Grid>
      <Actions>
        <DownloadButton exportLink={exportLink} classes={classes} t={t} />
        <Submit disabled={isSubmitting}>{t('common.generate')}</Submit>
      </Actions>
    </Form>
  );
}

ReportGenerationForm.defaultProps = {
  exportLink: null,
};

const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      initial || {
        dateStart: moment().subtract(30, 'days'),
        dateEnd: moment(),
      },
    validationSchema: ReportGenerationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ReportGenerationForm);
