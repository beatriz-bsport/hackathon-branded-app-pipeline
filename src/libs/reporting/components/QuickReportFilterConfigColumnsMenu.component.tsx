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
// @ts-expect-error
import FuzeSearch from '../../../components/FuzeSearch.component';
import { ReportFilterConfig, ReportMetadataColumn } from '../types';
import {
  DataSourceFieldMetadata,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
  DynamicFilterDataType,
} from '#libs/datatype-filtering/types';
import {
  generateNewFilterItem,
  generateNewGroup,
} from '#libs/datatype-filtering/utils';
import QuickReportFilterConfigFilter from './QuickReportFilterConfigFilter.component';
import { getFilterableColumns } from '../utils';

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
  handleOpenModal: () => void;
  anchorEl: (EventTarget & HTMLButtonElement) | HTMLDivElement;
  columns: DataSourceFieldMetadata[];
  isFranchisor: boolean;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
  // TYPING A FINIR SUR LA PARTIE 2 LIEES AUX CHIPS
  columnsDataSelectedQuickFilter: any;
  selectedColumn: DatatypeFilterConfigItem;
  setSelectedColumn: React.Dispatch<
    React.SetStateAction<DatatypeFilterConfigItem>
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
}) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<
    QuickFilterConfigSearchColumnOptions[]
  >([]);
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

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
    () => getFilterableColumns(values.config.groups, columns, isFranchisor),
    [columns, values.config.groups, isFranchisor],
  );

  const columnsOptions: QuickFilterConfigSearchColumnOptions[] = useMemo(
    () =>
      uniqBy(
        [
          ...(filterableColumns || []).map((c) => ({
            label: t(
              `columns.${c.datatype !== 'user' ? c.identifier : 'member'}`,
            ),
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
    },
    [
      setIsQuickFilterConfigColumnModalOpen,
      setFieldValue,
      values.config.groups,
      setSelectedColumn,
      setIsQuickFilterConfigRowModalOpen,
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
    <div className={classes.row}>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
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

        <MenuItem>
          <ListItem disableGutters onClick={handleOpenModal}>
            <FilterIcon />
            <ListItemText primary={t('filter.createFilter')} />
          </ListItem>
        </MenuItem>
      </Popover>

      {selectedColumn && (
        <QuickReportFilterConfigFilter
          anchorEl={anchorEl}
          columnsDataSelectedQuickFilter={columnsDataSelectedQuickFilter}
          getDataByType={getDataByType}
          isQuickFilterConfigRowModalOpen={isQuickFilterConfigRowModalOpen}
          isQuickFilterModalOpen={isQuickFilterModalOpen}
          onClose={handleQuickFilterConfigRowClose}
          selectedColumn={selectedColumn}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  row: { display: 'flex', flexDirection: 'row' },
}));

export default memo(QuickReportFilterConfigColumnsMenu);
