// @flow

import React from 'react';

import moment from 'moment';

import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import {
  AlertError,
  DateField,
  Submit,
  Actions,
  defaultHandleSubmit,
} from '../../components/forms';

import { getAuth } from '../../http';

import type { ReportConfiguration as ReportConfigurationType } from './types';

type Props = {
  isSubmitting: boolean,
  t: TFunction,
  exportLink?: string,
  reportConfiguration: ReportConfigurationType,
  classes: { [string]: string },
  reportConfiguration: Object,
};

const ReportGenerationSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test('is-after-start', 'errors.end_before_start', function(dateEnd) {
      const { dateStart } = this.parent;
      return moment(dateStart).isSameOrBefore(moment(dateEnd));
    }),
});

function DownloadButton(props: DownloadButtonProps) {
  const { exportLink, classes, t } = props;
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={async () => {
        const response = await getAuth(exportLink);
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = response.data;
        link.download = response.data.split('/').pop();
        document.body.appendChild(link);
        link.click();
        link.remove();
      }}
      disabled={!exportLink}
    >
      {t('common.export')}
      <CloudDownloadIcon className={classes.rightIcon} />
    </Button>
  );
}

export function ReportGenerationForm(props: Props) {
  const { t, isSubmitting, exportLink, classes, reportConfiguration } = props;
  return (
    <Form>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          {reportConfiguration.date_type === 'none' ? (
            <div />
          ) : (
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <DateField
                  name="dateStart"
                  fullWidth
                  label={t('common.from')}
                />
                <AlertError name="dateStart" />
              </Grid>
              <Hidden
                only={
                  reportConfiguration.date_type === 'range'
                    ? []
                    : ['xs', 'sm', 'md', 'lg', 'xl']
                }
              >
                <Grid item xs={6}>
                  <DateField
                    name={
                      reportConfiguration.date_type === 'range'
                        ? 'dateEnd'
                        : 'dateStart'
                    }
                    fullWidth
                    label={t('common.until')}
                  />
                  <AlertError name="dateStart" />
                </Grid>
              </Hidden>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Actions>
            <DownloadButton exportLink={exportLink} classes={classes} t={t} />
            <Submit disabled={isSubmitting}>{t('common.generate')}</Submit>
          </Actions>
        </Grid>
      </Grid>
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
        dateStart: moment().subtract(7, 'days'),
        dateEnd: moment(),
      },
    validationSchema: ReportGenerationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ReportGenerationForm);
