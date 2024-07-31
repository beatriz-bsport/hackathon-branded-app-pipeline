import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';

import { MuiThemeProvider } from '@material-ui/core';
import { cardHeaderStatsTheme } from '#src/libs/reporting/v2/mui-theme-providers';

import ReportDetailContentHeader from './ReportDetailContentHeader.component';
import ReportTableHeaders from '#src/libs/reporting/common/components/ReportTableHeaders.component';
import ReportTable from '#src/libs/reporting/common/components/ReportTable.component';

import type {
  ReportHeader,
  ReportConfiguration,
  SerializedReport,
  ReportMetadataValue,
  ReportGenerationParams,
  ReportFilterConfig,
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';
import type { OptionCallback } from '#src/state/types';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { CREDIT_COLUMNS } from '#src/libs/reporting/common/constants';
import { getCreditFactor } from '#src/libs/theme/selectors';

type Props = {
  categoryName: ReportCategoryEnum;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  excelExportLoading: boolean;
  handleExport: (values: ReportGenerationParams) => () => void;
  handleGeneration: (values: ReportGenerationParams) => void;
  objectLevelPermissions: ObjectLevelPermissions;
  quickReportFilterConfig: ReportFilterConfig;
  loading: boolean;
  report: ReportConfiguration;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportCategoryMetadata: ReportMetadataValue;
  reportGeneratedRows: SerializedReport & ErrorAndLoading;
  reportHeaders: ReportHeader;
  userPermissions: RolePermission;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

const ReportDetailContent: React.FC<Props> = ({
  categoryName,
  editReportFilterConfig,
  excelExportLoading,
  handleExport,
  handleGeneration,
  handleGetDynamicDataForFilters,
  loading,
  objectLevelPermissions,
  quickReportFilterConfig,
  report,
  reportCategoriesMetadata,
  reportCategoryMetadata,
  reportGeneratedRows,
  reportHeaders,
  userPermissions,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const handleGenerateNextPage = React.useCallback(() => {
    handleGeneration({
      page: reportGeneratedRows.next_page,
    });
  }, [reportGeneratedRows.next_page, handleGeneration]);

  const handleGeneratePreviousPage = React.useCallback(() => {
    handleGeneration({
      page: reportGeneratedRows.previous_page,
    });
  }, [reportGeneratedRows.previous_page, handleGeneration]);

  const hasReportBeenGenerated = React.useMemo(
    () => !!reportHeaders?.averageable,
    [reportHeaders],
  );

  const showCreditFactorWarning = React.useMemo(
    () =>
      getCreditFactor() !== 1 &&
      report?.columns.some((columnIdentifier) =>
        CREDIT_COLUMNS.includes(columnIdentifier),
      ),
    [report?.columns],
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Paper className={classes.contentPaper}>
      <ReportDetailContentHeader
        categoryName={categoryName}
        editReportFilterConfig={editReportFilterConfig}
        excelExportLoading={excelExportLoading}
        generationLoading={reportGeneratedRows.loading}
        handleExport={handleExport}
        handleGeneration={handleGeneration}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        quickReportFilterConfig={quickReportFilterConfig}
        report={report}
        reportCategoryMetadata={reportCategoryMetadata}
      />
      <Divider />
      <MuiThemeProvider theme={cardHeaderStatsTheme}>
        <ReportTableHeaders
          v2
          hasReportBeenGenerated={hasReportBeenGenerated}
          reportHeaders={reportHeaders}
        />
      </MuiThemeProvider>
      <Divider />
      {showCreditFactorWarning && (
        <Alert severity="warning">
          {t('helperText.decimalCredit', {
            creditFactor: getCreditFactor(),
          })}
        </Alert>
      )}
      <ReportTable
        v2
        className={classes.reportTable}
        handleGenerateNextPage={handleGenerateNextPage}
        handleGeneratePreviousPage={handleGeneratePreviousPage}
        hasReportBeenGenerated={hasReportBeenGenerated}
        metadata={reportCategoriesMetadata}
        nextPage={reportGeneratedRows.next_page}
        objectLevelPermissions={objectLevelPermissions}
        otherPages={reportGeneratedRows.other_pages}
        previousPage={reportGeneratedRows.previous_page}
        report={report}
        reportStoreRowsLoading={reportGeneratedRows.loading}
        result={reportGeneratedRows.result}
        userPermissions={userPermissions}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  contentPaper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
  },
  reportTable: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export default React.memo(ReportDetailContent);
