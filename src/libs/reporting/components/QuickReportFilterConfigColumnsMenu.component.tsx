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
import { ReportFilterConfig } from '../types';
import {
  DataSourceFieldMetadata,
  DataSourceMedadataDataType,
} from '#libs/datatype-filtering/types';
import { getFilterableColumns } from '../utils';

type QuickFilterConfigSearchColumnOptions = {
  label: string;
  value: string;
  datatype: DataSourceMedadataDataType;
  identifier: string;
};

type Props = {
  isQuickFilterConfigColumnModalOpen: boolean;
  isQuickFilterModalOpen: boolean;
  handleQuickFilterModalClose: () => void;
  handleOpenModal: () => void;
  anchorEl: (EventTarget & HTMLButtonElement) | HTMLDivElement;
  columns: DataSourceFieldMetadata[];
  isFranchisor: boolean;
};

const QuickReportFilterConfigColumnsMenu: React.FC<Props> = ({
  isQuickFilterModalOpen,
  handleQuickFilterModalClose,
  handleOpenModal,
  anchorEl,
  columns,
  isFranchisor,
  isQuickFilterConfigColumnModalOpen,
}) => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<
    QuickFilterConfigSearchColumnOptions[]
  >([]);
  const { t } = useTranslation('reporting');
  const { values } = useFormikContext<ReportFilterConfig>();

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

  const handleQuickFilterConfigColumnModalClose = useCallback(() => {
    handleQuickFilterModalClose();
  }, [handleQuickFilterModalClose]);

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
              <MenuItem key={column.value}>
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
    </div>
  );
};

const useStyles = makeStyles(() => ({
  row: { display: 'flex', flexDirection: 'row' },
}));

export default memo(QuickReportFilterConfigColumnsMenu);
