import React from 'react';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import cloneDeep from 'lodash/cloneDeep';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InformationIcon from '#src/components/InformationIcon';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES,
  ReportDateType,
  authorIdentifiers,
} from '#src/libs/reporting/common/constants';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { mapTimePeriodToDateValues } from '#src/components/date/utils';

import type {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigConfig,
  ReportGenerationParams,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import type {
  DatatypeFilterConfigGroup,
  DatatypeFilterConfigItem,
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';
import type { OptionCallback } from '#src/state/types';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';

import { getReportGlobalCategoryFromCategory } from '#src/libs/reporting/common/utils';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ReportFilterChip from '#src/libs/reporting/common/components/ReportFilterChip.component';
import ReportDetailDateSelectors from '#src/libs/reporting/v2/components/ReportDetailContent/ReportDetailDateSelectors.component';
import QuickReportFilterConfigColumnsMenu from '#src/libs/reporting/common/components/QuickReportFilterConfigColumnsMenu.component';

type Props = {
  categoryName: ReportCategoryEnum;
  generationDisabled: boolean;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  excelExportDisabled: boolean;
  excelExportLoading: boolean;
  handleExport: (values: ReportGenerationParams) => () => void;
  isFranchisor?: boolean;
  quickReportFilterConfig: ReportFilterConfig;
  reportCategoryMetadata: ReportMetadataValue;
  report: ReportConfiguration;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

export type FormikValues = {
  config: ReportFilterConfigConfig;
  dateEnd: string;
  dateStart: string;
  dateType: ReportDateType;
  timeEnd: string;
  timePeriod: DateFilterEnum | DateFilterRangeEnum;
  timeStart: string;
  timeWindowPeriod: string;
};

type FormikHOCProps = {
  handleGeneration: (values: ReportGenerationParams) => void;
};

const ReportDetailContentHeader: React.FC<
  Props & FormikProps<FormikValues>
> = ({
  categoryName,
  editReportFilterConfig,
  excelExportDisabled,
  excelExportLoading,
  generationDisabled,
  handleExport,
  isFranchisor,
  handleGetDynamicDataForFilters,
  handleSubmit,
  quickReportFilterConfig,
  report,
  reportCategoryMetadata,
  values,
}) => {
  const { t } = useTranslation(['reporting', 'smartList']);
  const classes = useStyles();
  const [isQuickFilterModalOpen, setIsQuickFilterModalOpen] =
    React.useState(false);
  const [
    isQuickFilterConfigColumnModalOpen,
    setIsQuickFilterConfigColumnModalOpen,
  ] = React.useState(false);
  const [isQuickFilterConfigRowModalOpen, setIsQuickFilterConfigRowModalOpen] =
    React.useState(false);
  const [selectedColumn, setSelectedColumn] =
    React.useState<DatatypeFilterConfigItem>();

  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | HTMLDivElement | null
  >(null);
  const chipRef = React.useRef<HTMLDivElement | null>(null);

  const handleQuickFilterModalOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsQuickFilterModalOpen(true);
      setIsQuickFilterConfigColumnModalOpen(true);
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleQuickFilterModalClose = React.useCallback(() => {
    setIsQuickFilterModalOpen(false);
    setIsQuickFilterConfigColumnModalOpen(false);
    setAnchorEl(null);

    const newFiltersData = values.config?.groups?.length
      ? values.config.groups?.[0]?.filters_data
      : [];

    // values from formik ar immutable so I have to create a deep copy hence deepCopyQuickReportFilter
    const deepCopyQuickReportFilterConfig = cloneDeep(values.config);
    if (deepCopyQuickReportFilterConfig.groups) {
      deepCopyQuickReportFilterConfig.groups[0].filters_data = newFiltersData;
    }

    // If there is no filters data in the quickfilters, return empty config
    editReportFilterConfig(
      quickReportFilterConfig?.id,
      newFiltersData.length > 0
        ? { config: deepCopyQuickReportFilterConfig }
        : { config: {} },
    );
  }, [editReportFilterConfig, quickReportFilterConfig, values]);

  const columnsDataSelectedQuickFilter = React.useMemo(() => {
    return values.config?.groups?.length
      ? values.config.groups.flatMap((group: DatatypeFilterConfigGroup) =>
          group.filters_data?.map((row: DatatypeFilterConfigItem) => ({
            identifier:
              row.datatype === 'user' &&
              !authorIdentifiers.includes(row.identifier)
                ? 'member'
                : row.identifier,
            value: row.value,
            comparator: row.comparator,
            datatype: row.datatype,
            sub_datatype: row.sub_datatype,
          })),
        )
      : [];
  }, [values.config?.groups]);

  const reportColumnsMetadata = React.useMemo(
    () =>
      reportCategoryMetadata.columns.filter((column) =>
        report.columns.includes(column.identifier),
      ),
    [reportCategoryMetadata, report],
  );

  const reportObjectPermissions: string[] = React.useMemo(() => {
    const reportObjectPermissionPrefix = `report.${getReportGlobalCategoryFromCategory(
      categoryName as ReportCategoryEnum,
    )}.${categoryName}.allowed_actions`;

    return [
      `${reportObjectPermissionPrefix}.read`,
      `${reportObjectPermissionPrefix}.edit`,
      'export.allowed_actions.report',
    ];
  }, [categoryName]);

  const CATEGORY_NEEDS_DATE_HELPER_TEXT = React.useMemo(
    () => CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES.includes(categoryName),
    [categoryName],
  );

  return (
    <ObjectLevelPermissionProvider requiredPermission={reportObjectPermissions}>
      {([
        hasReadPermission,
        hasEditPermission,
        hasExportPermission,
      ]: boolean[]) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div className={classes.root}>
              <div className={classes.titleWrapper}>
                <Typography variant="h6">
                  {t('reporting:reportDetailContent.title')}
                </Typography>
              </div>
              {(reportCategoryMetadata.date_type !== 'none' ||
                CATEGORY_NEEDS_DATE_HELPER_TEXT) && (
                <div className={classes.datesSelectorRow}>
                  {hasEditPermission && (
                    <ReportDetailDateSelectors
                      dateInputDisabled={generationDisabled}
                      dateType={reportCategoryMetadata.date_type}
                      timeWindowFilteringEnabled={
                        reportCategoryMetadata.time_window_filtering_enabled
                      }
                    />
                  )}
                  {CATEGORY_NEEDS_DATE_HELPER_TEXT && (
                    <InformationIcon text={t(`helperText.${categoryName}`)} />
                  )}
                </div>
              )}
              <div className={classes.chipList}>
                {columnsDataSelectedQuickFilter.map((filterItem) => (
                  <ReportFilterChip
                    key={filterItem.identifier}
                    ref={chipRef}
                    columnIdentifiers={report.columns}
                    comparator={filterItem.comparator}
                    datatype={filterItem.datatype}
                    editReportFilterConfig={editReportFilterConfig}
                    getDataByTypeAndId={handleGetDynamicDataForFilters}
                    label={filterItem.identifier}
                    reportQuickFilter={quickReportFilterConfig}
                    setAnchorEl={setAnchorEl}
                    setIsQuickFilterConfigRowModalOpen={
                      setIsQuickFilterConfigRowModalOpen
                    }
                    setIsQuickFilterModalOpen={setIsQuickFilterModalOpen}
                    setSelectedColumn={setSelectedColumn}
                    subDataType={filterItem.sub_datatype}
                    value={filterItem.value}
                  />
                ))}
                <Button
                  color="primary"
                  onClick={handleQuickFilterModalOpen}
                  startIcon={<AddIcon />}
                >
                  {t('reportDetailContent.addQuickFilter').toUpperCase()}
                </Button>
              </div>
              {isQuickFilterModalOpen && (
                <QuickReportFilterConfigColumnsMenu
                  anchorEl={anchorEl}
                  chipRef={chipRef}
                  // @ts-expect-error TODO: harmonize DataSourceFieldMetadata and  ReportMetadataColumn
                  columns={reportColumnsMetadata}
                  columnsDataSelectedQuickFilter={
                    columnsDataSelectedQuickFilter
                  }
                  getDataByType={handleGetDynamicDataForFilters}
                  handleQuickFilterModalClose={handleQuickFilterModalClose}
                  isFranchisor={isFranchisor}
                  isQuickFilterConfigColumnModalOpen={
                    isQuickFilterConfigColumnModalOpen
                  }
                  isQuickFilterConfigRowModalOpen={
                    isQuickFilterConfigRowModalOpen
                  }
                  isQuickFilterModalOpen={isQuickFilterModalOpen}
                  reportCategory={categoryName}
                  selectedColumn={selectedColumn}
                  setAnchorEl={setAnchorEl}
                  setIsQuickFilterConfigColumnModalOpen={
                    setIsQuickFilterConfigColumnModalOpen
                  }
                  setIsQuickFilterConfigRowModalOpen={
                    setIsQuickFilterConfigRowModalOpen
                  }
                  setIsQuickFilterModalOpen={setIsQuickFilterModalOpen}
                  setSelectedColumn={setSelectedColumn}
                />
              )}

              {(hasReadPermission || hasExportPermission) && (
                <div className={classes.actionButtonsWrapper}>
                  {hasReadPermission && (
                    <Button
                      color="primary"
                      disabled={generationDisabled}
                      type="submit"
                      variant="contained"
                    >
                      {t('smartList:generateReport')}
                    </Button>
                  )}
                  {hasExportPermission && (
                    <Button
                      color="primary"
                      disabled={excelExportDisabled}
                      onClick={handleExport(values)}
                      variant="outlined"
                    >
                      {t('smartList:downloadReport')}
                      {excelExportLoading ? (
                        <CircularProgress
                          className={classes.rightIcon}
                          size={24}
                        />
                      ) : (
                        <CloudDownloadIcon className={classes.rightIcon} />
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
  },
  titleWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  actionButtonsWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#efefef',
    },
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  datesSelectorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const FormikHOC = withFormik<Props & FormikHOCProps, FormikValues>({
  mapPropsToValues: ({ report, quickReportFilterConfig }) => {
    if (report) {
      return {
        dateEnd: report.date_end,
        dateStart: report.date_start,
        dateType: report.date_type,
        timeEnd: report.time_window_end,
        timePeriod: mapTimePeriodToDateValues(
          report.date_start,
          report.date_end,
          report.date_type,
        ),
        timeStart: report.time_window_start,
        timeWindowPeriod: 'custom',
        ...(quickReportFilterConfig
          ? { config: quickReportFilterConfig.config }
          : { config: {} }),
      };
    }
  },
  handleSubmit: (values, { props: { handleGeneration } }) => {
    const { dateEnd, dateStart, timeEnd, timeStart } = values;

    handleGeneration({
      dateEnd,
      dateStart,
      timeEnd,
      timeStart,
    });
  },
});

export default FormikHOC(React.memo(ReportDetailContentHeader));
