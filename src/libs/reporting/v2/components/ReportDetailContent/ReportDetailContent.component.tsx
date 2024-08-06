import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

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
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = {
  categoryName: ReportCategoryEnum;
  handleExport: () => void;
  handleGeneration: (values: ReportGenerationParams) => void;
  objectLevelPermissions: ObjectLevelPermissions;
  loading: boolean;
  report: ReportConfiguration;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportCategoryMetadata: ReportMetadataValue;
  reportGeneratedRows: SerializedReport & ErrorAndLoading;
  reportHeaders: ReportHeader;
  userPermissions: RolePermission;
};

const ReportDetailContent: React.FC<Props> = ({
  categoryName,
  handleExport,
  handleGeneration,
  loading,
  objectLevelPermissions,
  report,
  reportCategoriesMetadata,
  reportCategoryMetadata,
  reportGeneratedRows,
  reportHeaders,
  userPermissions,
}) => {
  const classes = useStyles();

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

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Paper className={classes.contentPaper}>
      <ReportDetailContentHeader
        categoryName={categoryName}
        generationLoading={reportGeneratedRows.loading}
        handleExport={handleExport}
        handleGeneration={handleGeneration}
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
