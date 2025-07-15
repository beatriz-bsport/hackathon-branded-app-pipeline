import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation, Trans } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { Button, MuiThemeProvider } from '@material-ui/core';
import { cardHeaderStatsTheme } from '#src/libs/reporting/v2/mui-theme-providers';

import ReportDetailContentHeader from './ReportDetailContentHeader.component';
import ReportTableHeaders from '#src/libs/reporting/common/components/ReportTableHeaders.component';
import ReportTable from '#src/libs/reporting/common/components/ReportTable.component';
import { useCursorPagination } from '#src/libs/reporting/common/hooks/useCursorPagination';

import { getReportObjectPermissionsBasedOnCategory } from '#src/libs/reporting/common/utils';

import type {
  ReportHeader,
  ReportConfiguration,
  SerializedReport,
  ReportMetadataValue,
  ReportGenerationParams,
  ReportFilterConfig,
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type { CallHistoryMethodAction } from 'connected-react-router';
import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';
import type { OptionCallback } from '#src/state/types';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import { CREDIT_COLUMNS } from '#src/libs/reporting/common/constants';
import { getCreditFactor } from '#src/libs/theme/selectors';
import type { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';

type Props = {
  categoryName: ReportCategoryEnum;
  displayStopSubscriptionFromMemberSide?: boolean;
  dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  excelExportLoading: boolean;
  handleExport: (values: ReportGenerationParams) => () => void;
  handleGeneration: (
    values: ReportGenerationParams,
    withReportHeadersFetch?: boolean,
  ) => void;
  hydratedLoading: boolean;
  invalidQuickFilterItemsUUID: string[];
  isFranchisor?: boolean;
  loading: boolean;
  objectLevelPermissions: ObjectLevelPermissions;
  pushRouter: (path: string) => CallHistoryMethodAction<[string, unknown?]>;
  quickReportFilterConfig: ReportFilterConfig;
  report: ReportConfiguration;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportCategoryMetadata: ReportMetadataValue;
  reportGeneratedRows: SerializedReport & ErrorAndLoading;
  reportHeaders: { results: ReportHeader } & ErrorAndLoading;
  userPermissions: RolePermission;
  displayNewWebshop?: boolean;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

const ReportDetailContent: React.FC<Props> = ({
  categoryName,
  displayStopSubscriptionFromMemberSide,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  excelExportLoading,
  handleExport,
  handleGeneration,
  handleGetDynamicDataForFilters,
  hydratedLoading,
  invalidQuickFilterItemsUUID,
  isFranchisor,
  loading,
  objectLevelPermissions,
  pushRouter,
  quickReportFilterConfig,
  report,
  reportCategoriesMetadata,
  reportCategoryMetadata,
  reportGeneratedRows,
  reportHeaders,
  userPermissions,
  displayNewWebshop,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');

  // Use the optimized cursor pagination hook instead of custom handlers
  const {
    handleNext: handleGenerateNextPage,
    handlePrevious: handleGeneratePreviousPage,
  } = useCursorPagination({
    data: {
      next_cursor: reportGeneratedRows?.next_cursor,
      previous_cursor: reportGeneratedRows?.previous_cursor,
    },
    onNavigate: ({ cursor }) => {
      if (!report) return;
      handleGeneration({ cursor }, false);
    },
  });

  const hasReportBeenGenerated = React.useMemo(
    () =>
      !!reportHeaders.results &&
      (!!reportHeaders.results.averageable ||
        !!reportHeaders.results.summable || // Backend always adds total_rows to summable
        reportGeneratedRows.result?.length > 0), // Fallback for edge cases
    [reportHeaders, reportGeneratedRows.result],
  );

  const reportWithoutResults = React.useMemo(
    () => !reportGeneratedRows?.result?.length,
    [reportGeneratedRows],
  );

  const showCreditFactorWarning = React.useMemo(
    () =>
      getCreditFactor() !== 1 &&
      report?.columns.some((columnIdentifier) =>
        CREDIT_COLUMNS.includes(columnIdentifier),
      ),
    [report?.columns],
  );

  const handleRoutingToWelcomePage = React.useCallback(() => {
    isFranchisor ? pushRouter('/f/reporting') : pushRouter('/reporting');
  }, [pushRouter, isFranchisor]);

  if ((loading && !report) || hydratedLoading) {
    return <LinearProgress />;
  }

  // It means that the report has not been found (either old version, or report
  // does not exist in database)
  if (!hydratedLoading && !report) {
    return (
      <div className={classes.reportNotFound}>
        <Typography align="center" color="textSecondary">
          {t('reportDetailContent.notFound')}
        </Typography>
        <div>
          <Button onClick={handleRoutingToWelcomePage}>
            {t('reportDetailContent.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  const { read: hasReadPermission } = getReportObjectPermissionsBasedOnCategory(
    objectLevelPermissions,
    categoryName,
  );

  return (
    <Paper className={classes.contentPaper} variant="outlined">
      <ReportDetailContentHeader
        categoryName={categoryName}
        displayStopSubscriptionFromMemberSide={
          displayStopSubscriptionFromMemberSide
        }
        dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
        editReportFilterConfig={editReportFilterConfig}
        excelExportDisabled={excelExportLoading || reportGeneratedRows.loading}
        excelExportLoading={excelExportLoading}
        generationDisabled={reportGeneratedRows.loading}
        handleExport={handleExport}
        handleGeneration={handleGeneration}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        invalidQuickFilterItemsUUID={invalidQuickFilterItemsUUID}
        isFranchisor={isFranchisor}
        quickReportFilterConfig={quickReportFilterConfig}
        report={report}
        reportCategoryMetadata={reportCategoryMetadata}
      />
      <Divider />
      {hasReadPermission && !!report ? (
        <>
          <MuiThemeProvider theme={cardHeaderStatsTheme}>
            <ReportTableHeaders
              v2
              hasReportBeenGenerated={hasReportBeenGenerated}
              isLoading={reportHeaders.loading}
              reportHeaders={reportHeaders.results}
              reportWithoutResults={reportWithoutResults}
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
          {categoryName === ReportCategoryEnum.INVOICES && (
            <Alert severity="info">
              <Trans
                components={[
                  <a
                    key="invoices-report-warning"
                    className={classes.infoLink}
                    href={t('reporting:helperText.invoicesAccrualMethodLink')}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    .
                  </a>,
                ]}
                i18nKey="reporting:helperText.invoicesAccrualMethod"
                t={t}
                values={{
                  purchasedGiftcardReport: t(
                    'reporting:categories.consumer_giftcard',
                  ),
                }}
              />
            </Alert>
          )}
          <ReportTable
            v2
            displayNewWebshop={displayNewWebshop}
            handleGenerateNextPage={handleGenerateNextPage}
            handleGeneratePreviousPage={handleGeneratePreviousPage}
            hasReportBeenGenerated={hasReportBeenGenerated}
            metadata={reportCategoriesMetadata}
            nextCursor={reportGeneratedRows.next_cursor || ''}
            objectLevelPermissions={objectLevelPermissions}
            previousCursor={reportGeneratedRows.previous_cursor || ''}
            report={report}
            reportStoreRowsLoading={reportGeneratedRows.loading}
            result={reportGeneratedRows.result}
            userPermissions={userPermissions}
          />
        </>
      ) : (
        <Typography align="center" variant="h5">
          {t('readPermissionDenied')}
        </Typography>
      )}
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
  reportNotFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoLink: {
    color: 'inherit',
    textDecorationLine: 'underline',
    '&:link, &:visited, &:hover, &:active, &:focus': {
      color: 'inherit',
      textDecorationLine: 'underline',
    },
  },
}));

export default React.memo(ReportDetailContent);
