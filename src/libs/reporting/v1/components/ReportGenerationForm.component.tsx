import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';

import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
// @ts-expect-error
import { Submit, defaultHandleSubmit } from '#src/components/forms';
import DateRangeSelector from '#src/components/date/DateRangeSelector.component';
import TimeRangeSelector from '#src/components/time/TimeRangeSelector.component';
import DatePickerSelector from '#src/components/date/DatePickerSelector.component';
import { getReportGlobalCategoryFromCategory } from '#src/libs/reporting/common/utils';

import { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { handleGetDynamicDataForFiltersReturn } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import type { OptionCallback } from '#src/state/types';
import type {
  ReportConfiguration as ReportConfigurationType,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import ReportFilterConfigSelector from './ReportFilterConfigSelector.component';

type Props = {
  columnsMetadata: ReportMetadataValue[];
  createReportFilterConfig: (
    reportId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  deleteReportFilterConfig: (reporFilterConfigId: number) => void;
  disableContinue: boolean;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  fetchReportFilterConfigList: (params: ReportFilterConfigParams) => void;
  handleExcelExportation: () => void;
  handleGetDynamicDataForReport: (
    type: DynamicFilterDataType,
    valueId?: number,
  ) => handleGetDynamicDataForFiltersReturn;
  isDisabled?: boolean;
  isFranchisor: boolean;
  isSubmitting_: boolean;
  reportConfiguration: ReportConfigurationType;
  reportFilterConfigs: ReportFilterConfig[];
  setDisableContinue: (boolean: boolean) => void;
  setShowDialog: (boolean: boolean) => void;
  showDialog: boolean;
  timeWindowFilteringEnabled: boolean;
  values: any;
};

type DownloadButtonProps = {
  handleExcelExportation: (data: any) => void;
  isSubmitting_: boolean;
  timeWindowFilteringEnabled: boolean;
  values: any;
};

const CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES = [
  ReportCategoryEnum.ACTIVITIES,
  ReportCategoryEnum.ACTIVITY_BY_COACH,
  ReportCategoryEnum.ACTIVITY_BY_ESTABLISHMENT,
  ReportCategoryEnum.BILLING_PLAN,
  ReportCategoryEnum.BOOKINGS,
  ReportCategoryEnum.CASHBOOK,
  ReportCategoryEnum.CONSUMER_GIFTCARD,
  ReportCategoryEnum.DAY_BOOKINGS,
  ReportCategoryEnum.DISCOUNT,
  ReportCategoryEnum.DISPUTE,
  ReportCategoryEnum.EXPENSE,
  ReportCategoryEnum.EXPIRED_PASS,
  ReportCategoryEnum.FIRST_ATTENDANCE,
  ReportCategoryEnum.FIRST_BOOKING,
  ReportCategoryEnum.FIRST_PRIVATE_BOOKING,
  ReportCategoryEnum.INVOICES,
  ReportCategoryEnum.MEMBERS,
  ReportCategoryEnum.MEMBERSHIPS,
  ReportCategoryEnum.OFFERS,
  ReportCategoryEnum.ON_SPOT_PAYMENTS,
  ReportCategoryEnum.PAYMENT_INSTALMENTS,
  ReportCategoryEnum.PAYMENT_SUMUP,
  ReportCategoryEnum.PAYMENTS,
  ReportCategoryEnum.PRIVATE_BOOKINGS,
  ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED,
  ReportCategoryEnum.PRIVATE_CONSUMER_PASS,
  ReportCategoryEnum.PRIVATE_SERVICE,
  ReportCategoryEnum.REFERRAL_GRANT,
  ReportCategoryEnum.SHOP,
  ReportCategoryEnum.SUBSCRIPTION,
  ReportCategoryEnum.UNIVERSAL_PASSES,
  ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS,
  ReportCategoryEnum.VIDEO_PURCHASE,
  ReportCategoryEnum.WORKSHOP,
  ReportCategoryEnum.ACCESS_MONITORING,
];

const ReportGenerationSchema = Yup.object().shape({
  dateStart: Yup.string().required('required'),
  dateEnd: Yup.string()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;
        const { dateType } = this.parent;

        const startDateTime = DateTime.fromISO(dateStart);
        const endDateTime = DateTime.fromISO(dateEnd);

        return (
          (dateType === 'range' && startDateTime <= endDateTime) ||
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
  timeWindowFilteringEnabled,
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
      color="secondary"
      disabled={isSubmitting_ || isExporting}
      onClick={() => {
        handleExcelExportation({
          dateStart: values.dateStart,
          dateEnd: values.dateEnd,
          ...(timeWindowFilteringEnabled
            ? {
                timeStart: values?.timeStart,
                timeEnd: values?.timeEnd,
              }
            : {}),
          reportFilterConfigId: values.reportFilterConfigId,
        });
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 5000);
      }}
      variant="contained"
    >
      {t('common.export')}
      {isExporting ? (
        <CircularProgress className={classes.rightIcon} size={30} />
      ) : (
        <CloudDownloadIcon className={classes.rightIcon} />
      )}
    </Button>
  );
};

const ReportGenerationForm: React.FC<Props> = ({
  columnsMetadata,
  createReportFilterConfig,
  deleteReportFilterConfig,
  disableContinue,
  editReportFilterConfig,
  fetchReportFilterConfigList,
  handleExcelExportation,
  handleGetDynamicDataForReport,
  isDisabled,
  isFranchisor,
  isSubmitting_,
  reportConfiguration,
  reportFilterConfigs,
  setDisableContinue,
  // @ts-expect-error
  setFieldValue,
  setShowDialog,
  showDialog,
  timeWindowFilteringEnabled,
  values,
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

  const quickFilter = useMemo(
    () =>
      reportFilterConfigs.find(
        (reportFilter) => reportFilter.is_quick_report_filter === true,
      ),
    [reportFilterConfigs],
  );

  const handleTimeSelectorSubmit = useCallback(
    (_values) => {
      setFieldValue('timeStart', _values.timeStart);
      setFieldValue('timeEnd', _values.timeEnd);
      setFieldValue('timeWindowPeriod', _values.timeWindowPeriod);
    },
    [setFieldValue],
  );

  const globalCategory = getReportGlobalCategoryFromCategory(
    reportConfiguration.category,
  );

  return (
    <React.Fragment>
      <Dialog
        aria-describedby="popup-excel-report"
        aria-labelledby="popup-excel-report"
        onClose={handleCloseDialog}
        open={showDialog}
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
            autoFocus
            color="primary"
            disabled={disableContinue}
            onClick={handleOpenDialog}
          >
            {t('reporting:export.continue')}
          </Button>
        </DialogActions>
      </Dialog>
      <Form>
        <div className={classes.flexRow}>
          <div className={classes.datePickerContainer}>
            {reportConfiguration.date_type === 'range' && (
              <DateRangeSelector
                date_end={DateTime.fromISO(values.dateEnd).toUnixInteger()}
                date_start={DateTime.fromISO(values.dateStart).toUnixInteger()}
                isDisabled={!!isDisabled}
                onSubmit={(_values) => {
                  setFieldValue('dateStart', _values.dateStart.toISODate());
                  setFieldValue('dateEnd', _values.dateEnd.toISODate());
                  setFieldValue('timePeriod', _values.timePeriod);
                }}
                timePeriod={values.time_period}
              />
            )}
            {reportConfiguration.date_type === 'single' && (
              <DatePickerSelector
                date={DateTime.fromISO(values.dateStart).toUnixInteger()}
                isDisabled={!!isDisabled}
                // @ts-expect-error
                onSubmit={(_values) => {
                  setFieldValue(
                    'dateStart',
                    (typeof _values.date === 'number'
                      ? DateTime.fromSeconds(_values.date)
                      : _values.date
                    ).toISODate(),
                  );
                  setFieldValue('timePeriod', _values.timePeriod);
                }}
                timePeriod={values.time_period}
              />
            )}
            {timeWindowFilteringEnabled && (
              <TimeRangeSelector
                isDisabled={!!isDisabled}
                onSubmit={handleTimeSelectorSubmit}
                originalTimeEnd={values.timeEnd}
                originalTimeStart={values.timeStart}
                originalTimeWindowPeriod={values.timeWindowPeriod}
              />
            )}
            {CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES.includes(
              reportConfiguration?.category,
            ) && (
              <Alert
                classes={{ root: classes.alertIcon }}
                className={classes.alert}
                severity="info"
              >
                {t(`reporting:helperText.${reportConfiguration.category}`)}
              </Alert>
            )}
          </div>
          <div className={classes.buttonsContainer}>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission={[
                'export.allowed_actions.report',
                `report.${globalCategory}.${reportConfiguration.category}.allowed_actions.read`,
              ]}
            >
              <DownloadButton
                handleExcelExportation={handleExcelExportation}
                isSubmitting_={isSubmitting_}
                timeWindowFilteringEnabled={timeWindowFilteringEnabled}
                values={values}
              />
            </ObjectLevelPermissionWrapper>
            <Submit disabled={isSubmitting_}>{t('common.generate')}</Submit>
          </div>
        </div>
        {/* @ts-expect-error */}
        <div className={classes.reportFilterConfig}>
          <ReportFilterConfigSelector
            // @ts-expect-error
            columnsMetadata={columnsMetadata}
            editReportFilterConfig={editReportFilterConfig}
            error={null}
            fetchReportFilterConfigsList={handleFetchReportFilterConfigList}
            // @ts-expect-error
            handleGetDynamicDataForReport={handleGetDynamicDataForReport}
            isFranchisor={isFranchisor}
            onCreateReportFilterConfigs={handleCreateFilter}
            onDeleteReportFilterConfigs={deleteReportFilterConfig}
            onSelect={handleSelectFilter}
            reportCategory={reportConfiguration.category}
            reportFilterConfigs={reportFilterConfigs}
            reportQuickFilter={quickFilter}
            selectedFilter={values.reportFilterConfigId}
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
    maxWidth: '550px',
  },
  datePickerContainer: {
    display: 'flex',
    flex: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  buttonsContainer: {
    justifyContent: 'flex-end',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
    },
    marginBottom: theme.spacing(1),
  },
}));

export default compose(
  withFormik({
    // @ts-expect-error
    mapPropsToValues: ({ initial, reportConfiguration }) => {
      return (
        initial || {
          timeStart: reportConfiguration.time_window_start || '00:00',
          timeEnd: reportConfiguration.time_window_end || '23:59',
          timeWindowPeriod: 'custom',
          dateStart:
            reportConfiguration.date_start || DateTime.now().toISODate(),
          dateEnd: reportConfiguration.date_end || DateTime.now().toISODate(),
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
