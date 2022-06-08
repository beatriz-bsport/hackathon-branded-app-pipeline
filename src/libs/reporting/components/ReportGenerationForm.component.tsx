// @flow
import React, { useCallback } from 'react';
import moment from 'moment-timezone';

import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  AlertError,
  DateField,
  Submit,
  Actions,
  defaultHandleSubmit,
} from '#components/forms';

import { ReportConfiguration as ReportConfigurationType } from '../types';

type Props = {
  isSubmitting_: boolean;
  reportConfiguration: ReportConfigurationType;
  handleExcelExportation: () => void;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  disableContinue: boolean;
  setDisableContinue: (show: boolean) => void;
  values: any;
};

type DownloadButtonProps = {
  handleExcelExportation: (data: any) => void;
  isSubmitting_: boolean;
  values: any;
};

const ReportGenerationSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;
        const { dateType } = this.parent;

        return (
          (dateType === 'range' &&
            moment(dateStart).isSameOrBefore(moment(dateEnd))) ||
          dateType === 'single' ||
          dateType === 'none'
        );
      },
    ),
});

const DownloadButton: React.FC<DownloadButtonProps> = ({
  handleExcelExportation,
  isSubmitting_,
  values,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleExcelExportation(values)}
      disabled={isSubmitting_}
    >
      {t('common.export')}
      <CloudDownloadIcon className={classes.rightIcon} />
    </Button>
  );
};

const ReportGenerationForm: React.FC<Props> = ({
  isSubmitting_,
  reportConfiguration,
  values,
  disableContinue,
  showDialog,
  setShowDialog,
  handleExcelExportation,
  setDisableContinue,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleCloseDialog = useCallback(() => {
    if (disableContinue) return;
    setShowDialog(false);
    setDisableContinue(true);
  }, [disableContinue, setDisableContinue, setShowDialog]);

  const handleOpenDialog = useCallback(() => {
    if (disableContinue) return;
    setShowDialog(false);
    setDisableContinue(true);
  }, [disableContinue, setDisableContinue, setShowDialog]);

  return (
    <React.Fragment>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        aria-labelledby="popup-excel-report"
        aria-describedby="popup-excel-report"
      >
        <DialogTitle id="alert-dialog-title">
          <div className={classes.flexTitle}>
            {t('reporting:export.excel_report')}
            {disableContinue && <CircularProgress color="primary" />}
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('reporting:export.processing')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={disableContinue}
            onClick={handleOpenDialog}
            color="primary"
            autoFocus
          >
            {t('reporting:export.continue')}
          </Button>
        </DialogActions>
      </Dialog>
      <Form>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            {reportConfiguration.date_type === 'none' ? (
              <div />
            ) : (
              <Grid container spacing={2}>
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
                    <AlertError
                      name={
                        reportConfiguration.date_type === 'range'
                          ? 'dateEnd'
                          : 'dateStart'
                      }
                    />
                  </Grid>
                </Hidden>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Actions>
              <DownloadButton
                values={values}
                handleExcelExportation={handleExcelExportation}
                isSubmitting_={isSubmitting_}
              />
              <Submit disabled={isSubmitting_}>{t('common.generate')}</Submit>
            </Actions>
          </Grid>
        </Grid>
      </Form>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  flexTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default compose(
  withFormik({
    mapPropsToValues: ({ initial, reportConfiguration }) => {
      return (
        initial || {
          dateStart: moment(reportConfiguration.date_start),
          dateEnd: moment(reportConfiguration.date_end),
          dateType: reportConfiguration.date_type,
        }
      );
    },
    validationSchema: ReportGenerationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ReportGenerationForm);
