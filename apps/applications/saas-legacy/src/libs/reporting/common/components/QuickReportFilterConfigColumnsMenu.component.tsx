import React, { useCallback, useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Popover,
  Divider,
  makeStyles,
  ListItem,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';
import Fuse, { FuseOptions } from 'fuse.js';
import { useFormikContext } from 'formik';
import uniqBy from 'lodash/uniqBy';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import FuzeSearch from '#src/components/FuzeSearch.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import type {
  DataSourceFieldMetadata,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
} from '#src/libs/datatype-filtering/types';
import {
  generateNewFilterItem,
  generateNewGroup,
} from '#src/libs/datatype-filtering/utils';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import QuickReportFilterConfigFilter, {
  QuickFiltersColumnsData,
} from './QuickReportFilterConfigFilter.component';
import {
  getColumnLabelTranslation,
  getFilterableColumns,
  getReportGlobalCategoryFromCategory,
} from '#src/libs/reporting/common/utils';
import type {
  ReportFilterConfig,
  ReportMetadataColumn,
} from '#src/libs/reporting/common/types';

type QuickFilterConfigSearchColumnOptions = {
  label: string;
  value: string;
  datatype: DataSourceMedadataDataType;
  identifier: string;
};

type Props = {
  isQuickFilterConfigColumnModalOpen: boolean;
  setIsQuickFilterConfigColumnModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  isQuickFilterModalOpen: boolean;
  setIsQuickFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuickFilterConfigRowModalOpen: boolean;
  setIsQuickFilterConfigRowModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  handleQuickFilterModalClose: () => void;
  handleOpenModal?: () => void;
  anchorEl: (EventTarget & HTMLButtonElement) | HTMLDivElement | null;
  columns: DataSourceFieldMetadata[];
  isFranchisor: boolean;
  getDataByType: handleGetDynamicDataForFiltersType;
  columnsDataSelectedQuickFilter: QuickFiltersColumnsData;
  selectedColumn: DatatypeFilterConfigItem;
  setSelectedColumn: React.Dispatch<
    React.SetStateAction<DatatypeFilterConfigItem>
  >;
  reportCategory: ReportCategoryEnum;
  chipRef: React.MutableRefObject<HTMLDivElement | null>;
  setAnchorEl: React.Dispatch<
    (EventTarget & HTMLButtonElement) | HTMLDivElement | null
  >;
};

const QuickReportFilterConfigColumnsMenu: React.FC<Props> = ({
  isQuickFilterModalOpen,
  handleQuickFilterModalClose,
  handleOpenModal,
  anchorEl,
  columns,
  isFranchisor,
  isQuickFilterConfigColumnModalOpen,
  setIsQuickFilterConfigColumnModalOpen,
  setIsQuickFilterModalOpen,
  getDataByType,
  columnsDataSelectedQuickFilter,
  selectedColumn,
  setSelectedColumn,
  isQuickFilterConfigRowModalOpen,
  setIsQuickFilterConfigRowModalOpen,
  reportCategory,
  chipRef,
  setAnchorEl,
}) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<
    QuickFilterConfigSearchColumnOptions[]
  >([]);
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

  const globalCategory = getReportGlobalCategoryFromCategory(
    reportCategory as ReportCategoryEnum,
  );
  const reportObjectPermissionPrefix = `report.${globalCategory}.${reportCategory}.allowed_actions`;

  const changeSearch =
    (fuse: Fuse<ReportFilterConfig, FuseOptions<ReportFilterConfig>>) =>
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setSearch(event.target.value);
      const result = fuse.search(
        event.target.value,
      ) as QuickFilterConfigSearchColumnOptions[];
      setSearchResult(result);
    };

  const clearSearch = () => {
    setSearch('');
    setSearchResult([]);
  };

  const filterableColumns = useMemo(
    () => getFilterableColumns(values.config.groups, columns, isFranchisor, t),
    [columns, values.config.groups, isFranchisor, t],
  );

  const columnsOptions: QuickFilterConfigSearchColumnOptions[] = useMemo(
    () =>
      uniqBy(
        [
          ...(filterableColumns || []).map((c) => ({
            label: t(`${getColumnLabelTranslation(c.datatype, c.identifier)}`),
            value: c.identifier,
            datatype: c.datatype,
            identifier: c.identifier,
          })),
        ],
        'value',
      ),
    [filterableColumns, t],
  );

  const quickFilterConfigListSearchFiltered = useMemo(() => {
    if (!search && columnsOptions) {
      return columnsOptions;
    }
    return searchResult;
  }, [columnsOptions, searchResult, search]);

  const handleQuickFilterConfigRowOpen = useCallback(
    (column: ReportMetadataColumn) => {
      values.config.groups?.length
        ? setFieldValue('config.groups[0].filters_data', [
            ...values.config.groups[0].filters_data,
            generateNewFilterItem(column),
          ])
        : setFieldValue('config.groups', [generateNewGroup(column, true)]);
      setIsQuickFilterConfigColumnModalOpen(false);
      setSelectedColumn(generateNewFilterItem(column));
      setIsQuickFilterConfigRowModalOpen(true);
      // I don't need to make a list of chipRef because all I need is to retrieve the last one created
      // setTimeout is to let time for the last chip to be rendered to anchor the element to the last chip
      setTimeout(() => !!chipRef?.current && setAnchorEl(chipRef.current));
    },
    [
      setIsQuickFilterConfigColumnModalOpen,
      setFieldValue,
      values.config.groups,
      setSelectedColumn,
      setIsQuickFilterConfigRowModalOpen,
      setAnchorEl,
      chipRef,
    ],
  );

  const handleQuickFilterConfigRowClose = useCallback(() => {
    handleQuickFilterModalClose();
    setIsQuickFilterModalOpen(false);
    setIsQuickFilterConfigRowModalOpen(false);
  }, [
    handleQuickFilterModalClose,
    setIsQuickFilterModalOpen,
    setIsQuickFilterConfigRowModalOpen,
  ]);

  const handleQuickFilterConfigColumnModalClose = useCallback(() => {
    if (!isQuickFilterConfigRowModalOpen) {
      handleQuickFilterModalClose();
    } else {
      setIsQuickFilterConfigColumnModalOpen(false);
    }
  }, [
    setIsQuickFilterConfigColumnModalOpen,
    handleQuickFilterModalClose,
    isQuickFilterConfigRowModalOpen,
  ]);

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        classes={{ paper: classes.columnMenu }}
        id="column-selector-popover"
        onClose={handleQuickFilterConfigColumnModalClose}
        open={isQuickFilterModalOpen && isQuickFilterConfigColumnModalOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <FuzeSearch
          changeSearch={changeSearch}
          clearSearch={clearSearch}
          items={quickFilterConfigListSearchFiltered}
          searchFields={['label']}
          searchText={search}
        />
        {quickFilterConfigListSearchFiltered.map(
          (column: QuickFilterConfigSearchColumnOptions) => {
            return (
              <MenuItem
                key={column.value}
                onClick={() => handleQuickFilterConfigRowOpen(column)}
              >
                <ListItemText primary={column.label} />
              </MenuItem>
            );
          },
        )}
        <Divider />

        {handleOpenModal && (
          <ObjectLevelPermissionWrapper
            requiredPermission={[
              `${reportObjectPermissionPrefix}.read`,
              `${reportObjectPermissionPrefix}.create`,
            ]}
          >
            <MenuItem>
              <ListItem disableGutters onClick={handleOpenModal}>
                <FilterIcon />
                <ListItemText primary={t('filter.createFilter')} />
              </ListItem>
            </MenuItem>
          </ObjectLevelPermissionWrapper>
        )}
      </Popover>

      {selectedColumn && (
        <QuickReportFilterConfigFilter
          anchorEl={anchorEl}
          columnsDataSelectedQuickFilter={columnsDataSelectedQuickFilter}
          getDataByType={getDataByType}
          isQuickFilterConfigRowModalOpen={isQuickFilterConfigRowModalOpen}
          isQuickFilterModalOpen={isQuickFilterModalOpen}
          onClose={handleQuickFilterConfigRowClose}
          reportCategory={reportCategory}
          selectedColumn={selectedColumn}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  row: { display: 'flex', flexDirection: 'row' },
  columnMenu: { padding: theme.spacing(1) },
}));

export default memo(QuickReportFilterConfigColumnsMenu);
