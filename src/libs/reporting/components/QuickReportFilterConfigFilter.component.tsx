import React, { useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Popover, Theme, makeStyles } from '@material-ui/core';

import { useFormikContext } from 'formik';
import { ReportFilterConfig } from '../types';
import ReportFilterChip from './ReportFilterConfigDrawer/ReportFilterChip.component';
import {
  AllComparator,
  DatatypeFilterConfigItem,
  DynamicFilterDataType,
} from '#libs/datatype-filtering/types';
import {
  DATE_SUBDATA_TYPE,
  HOUR_SUBDATA_TYPE,
} from '#libs/datatype-filtering/constants';
import {
  getComparatorCategoryByDataType,
  getComparatorsByDataType,
  getDefaultValueForTimePeriod,
  getDefaultValueForComparator,
} from '#libs/datatype-filtering/utils';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import DatatypeFilterConfigValueManager from '#libs/datatype-filtering/components/DatatypeFilterConfigValueManager.component';

type QuickReportFilterConfigFilterProps = {
  isQuickFilterConfigRowModalOpen: boolean;
  selectedColumn: DatatypeFilterConfigItem;
  getDataByType: (datatype: DynamicFilterDataType) => any[];
  anchorEl: (EventTarget & HTMLButtonElement) | HTMLDivElement;
  // TYPING A FINIR SUR LA PARTIE 2 LIEES AUX CHIPS
  columnsDataSelectedQuickFilter: any;
  isQuickFilterModalOpen: boolean;
  onClose: () => void;
};

const QuickReportFilterConfigFilter: React.FC<
  QuickReportFilterConfigFilterProps
> = ({
  selectedColumn,
  getDataByType,
  anchorEl,
  isQuickFilterConfigRowModalOpen,
  isQuickFilterModalOpen,
  onClose,
  columnsDataSelectedQuickFilter,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

  const index: number = useMemo(() => {
    return columnsDataSelectedQuickFilter.findIndex(
      (element) => element.identifier === selectedColumn.identifier,
    );
  }, [selectedColumn, columnsDataSelectedQuickFilter]);

  const subDataTypeOption = useMemo(
    () => [
      {
        label: t('filter.form.subDataType.day'),
        value: DATE_SUBDATA_TYPE,
      },
      {
        label: t('filter.form.subDataType.hour'),
        value: HOUR_SUBDATA_TYPE,
      },
    ],
    [t],
  );

  const filterComparators: AllComparator[] = useMemo(
    () => getComparatorsByDataType(selectedColumn.datatype),
    [selectedColumn.datatype],
  );

  const filterComparatorOptions = useMemo(
    () =>
      filterComparators.map((filterComparator) => ({
        label: t(
          `filter.form.filterComparator.${getComparatorCategoryByDataType(
            selectedColumn.datatype,
          )}.${filterComparator}`,
        ),
        value: filterComparator,
      })),
    [filterComparators, selectedColumn.datatype, t],
  );

  const handleComparatorChange = useCallback(
    (option: { label?: string; value: AllComparator }) => {
      const comparatorValue = option.value;

      setFieldValue(
        `config.groups[0].filters_data.${index}.value`,
        getDefaultValueForComparator({
          comparator: comparatorValue,
          datatype: selectedColumn.datatype,
          currentValue: selectedColumn.value,
          isChangingComparator: true,
        }),
        false,
      );
      setFieldValue(
        `config.groups[0].filters_data.${index}.time_period`,
        getDefaultValueForTimePeriod({
          comparator: comparatorValue,
          sub_datatype: selectedColumn.sub_datatype,
          datatype: selectedColumn.datatype,
          currentTimePeriod: selectedColumn.time_period,
        }),
        false,
      );

      // Timeout to execute after the js loop and check the data at this time as setFieldValue is not synchronous
      setTimeout(() => {
        setFieldValue(
          `config.groups[0].filters_data.${index}.comparator`,
          comparatorValue,
          true,
        );
      }, 0);
    },
    [selectedColumn, index, setFieldValue],
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id="row-selector-popover"
      onClose={onClose}
      open={isQuickFilterModalOpen && isQuickFilterConfigRowModalOpen}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {isQuickFilterConfigRowModalOpen && (
        <div className={classes.quickReportFilterRows}>
          <ReportFilterChip
            key={selectedColumn.datatype}
            onlyDisplay
            datatype={selectedColumn.datatype}
            label={selectedColumn.identifier}
          />
          <div className={classes.quickReportFilterSelectorRows}>
            {selectedColumn.datatype === 'datetime' && (
              <div className={classes.flexOne}>
                <MaterialUiSingleSelectorField
                  name={`config.groups[0].filters_data.${index}.sub_datatype`}
                  options={subDataTypeOption}
                />
              </div>
            )}
            <div className={classes.flexOne}>
              <MaterialUiSingleSelectorField
                name={`config.groups[0].filters_data.${index}.comparator`}
                onChange={handleComparatorChange}
                options={filterComparatorOptions}
              />
            </div>
            <div className={classes.flexOne}>
              <DatatypeFilterConfigValueManager
                comparator={
                  values.config.groups[0].filters_data[index].comparator
                }
                filterItem={selectedColumn}
                getDataByType={getDataByType}
                prefix={`config.groups[0].filters_data.${index}`}
              />
            </div>
          </div>
        </div>
      )}
    </Popover>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  quickReportFilterRows: {
    display: 'flex',
    padding: '8px 16px',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    width: '500px',
  },
  quickReportFilterSelectorRows: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
  },
  flexOne: {
    flex: '0.5 1 120px',
    position: 'relative',
  },
  select: {
    minWidth: 160,
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    borderRadius: 16,
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#efefef',
    },
  },
}));
export default memo(QuickReportFilterConfigFilter);
