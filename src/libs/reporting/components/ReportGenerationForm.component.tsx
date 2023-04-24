// @ts-nocheck
// @flow
import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment-timezone';

import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Submit, Actions, defaultHandleSubmit } from '#components/forms';
import DateRangeSelector from '#components/date/DateRangeSelector.component';
import DatePickerSelector from '#components/date/DatePickerSelector.component';
import ReportFilterConfigSelector from './ReportFilterConfigSelector.component';

import {
  ReportConfiguration as ReportConfigurationType,
  ReportFilterConfigParams,
  ReportMetadataValue,
  ReportFilterConfig,
} from '../types';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import { OptionCallback } from '../../../state/types';

type Props = {
  isSubmitting_: boolean;
  reportConfiguration: ReportConfigurationType;
  showDialog: boolean;
  disableContinue: boolean;
  columnsMetadata: ReportMetadataValue[];
  values: any;
  handleExcelExportation: () => void;
  setShowDialog: (boolean: boolean) => void;
  setDisableContinue: (boolean: boolean) => void;
  handleGetDynamicDataForReport: (type: DynamicFilterDataType) => any[];
  reportFilterConfigs: ReportFilterConfig[];
  createReportFilterConfig: (
    reportId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  deleteReportFilterConfig: (reporFilterConfigId: number) => void;

  fetchReportFilterConfigList: (params: ReportFilterConfigParams) => void;
  isFranchisor: boolean;
};

type DownloadButtonProps = {
  handleExcelExportation: (data: any) => void;
  isSubmitting_: boolean;
  values: any;
};

const CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES = ['billing_plan'];

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
  time_period: Yup.string().oneOf([
    'week',
    'month',
    'trimester',
    'year',
    'custom',
    'today',
  ]),
  reportFilterConfigId: Yup.number().nullable(),
});

const DownloadButton: React.FC<DownloadButtonProps> = ({
  handleExcelExportation,
  isSubmitting_,
  values,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let timeoutId: null | number = null;
    if (isExporting) {
      timeoutId = window.setTimeout(() => setIsExporting(false), 5000);
    }
    return () => window.clearTimeout(timeoutId);
  }, [isExporting]);

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => {
        handleExcelExportation({
          dateStart: moment(values.dateStart).unix(),
          dateEnd: moment(values.dateEnd).unix(),
          reportFilterConfigId: values.reportFilterConfigId,
        });
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 5000);
      }}
      disabled={isSubmitting_ || isExporting}
    >
      {t('common.export')}
      {isExporting ? (
        <CircularProgress size={30} className={classes.rightIcon} />
      ) : (
        <CloudDownloadIcon className={classes.rightIcon} />
      )}
    </Button>
  );
};

const ReportGenerationForm: React.FC<Props> = ({
  isSubmitting_,
  reportConfiguration,
  values,
  disableContinue,
  showDialog,
  columnsMetadata,
  setFieldValue,
  setShowDialog,
  handleExcelExportation,
  setDisableContinue,
  handleGetDynamicDataForReport,
  reportFilterConfigs,
  createReportFilterConfig,
  editReportFilterConfig,
  fetchReportFilterConfigList,
  deleteReportFilterConfig,
  isFranchisor,
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

  const handleCreateFilter = useCallback(
    (
      newFilter: Omit<ReportFilterConfig, 'id'>,
      options: OptionCallback<ReportFilterConfig>,
    ) => {
      createReportFilterConfig(reportConfiguration.id, newFilter, options);
    },
    [createReportFilterConfig, reportConfiguration.id],
  );

  const handleFetchReportFilterConfigList = useCallback(() => {
    fetchReportFilterConfigList({
      report_id_in: [reportConfiguration.id],
      page_size: null,
    });
  }, [fetchReportFilterConfigList, reportConfiguration.id]);

  const handleSelectFilter = useCallback(
    (id: number) => {
      setFieldValue('reportFilterConfigId', id > 0 ? id : null);
    },
    [setFieldValue],
  );

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
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            {reportConfiguration.date_type === 'range' && (
              <DateRangeSelector
                date_start={moment(values.dateStart).unix()}
                date_end={moment(values.dateEnd).unix()}
                timePeriod={values.time_period}
                onSubmit={(_values) => {
                  setFieldValue(
                    'dateStart',
                    _values.dateStart.format('YYYY-MM-DD'),
                  );
                  setFieldValue(
                    'dateEnd',
                    _values.dateEnd.format('YYYY-MM-DD'),
                  );
                  setFieldValue('timePeriod', _values.timePeriod);
                }}
              />
            )}
            {reportConfiguration.date_type === 'single' && (
              <DatePickerSelector
                date={moment(values.dateStart).unix()}
                timePeriod={values.time_period}
                onSubmit={(_values) => {
                  setFieldValue('dateStart', _values.date.format('YYYY-MM-DD'));
                  setFieldValue('timePeriod', _values.timePeriod);
                }}
              />
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
        {CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES.includes(
          reportConfiguration?.category,
        ) && (
          <Alert
            severity="info"
            classes={{ root: classes.alertIcon }}
            className={classes.alert}
          >
            {t(`reporting:helperText.${reportConfiguration.category}`)}
          </Alert>
        )}
        <div className={classes.reportFilterConfig}>
          <ReportFilterConfigSelector
            reportFilterConfigs={reportFilterConfigs}
            selectedFilter={values.reportFilterConfigId}
            error={null}
            columnsMetadata={columnsMetadata}
            fetchReportFilterConfigsList={handleFetchReportFilterConfigList}
            editReportFilterConfig={editReportFilterConfig}
            onCreateReportFilterConfigs={handleCreateFilter}
            onDeleteReportFilterConfigs={deleteReportFilterConfig}
            onSelect={handleSelectFilter}
            handleGetDynamicDataForReport={handleGetDynamicDataForReport}
            isFranchisor={isFranchisor}
          />
        </div>
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
  alertIcon: {
    alignItems: 'center',
  },
  alert: {
    marginBottom: theme.spacing(2),
    width: '30%',
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
          time_period: 'custom',
          reportFilterConfigId:
            reportConfiguration.reportFilterConfigId || null,
        }
      );
    },
    validationSchema: ReportGenerationSchema,
    handleSubmit: defaultHandleSubmit,
  }),
)(ReportGenerationForm);
