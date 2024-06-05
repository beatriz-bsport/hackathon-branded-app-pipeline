import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';

import { makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { ReportMetadataColumn } from '#src/libs/reporting/types';
import {
  AllComparator,
  DynamicFilterDataType,
  DatatypeFilterConfigGroupOperand,
  DatatypeFilterConfigItem,
} from '#src/libs/datatype-filtering/types';

import {
  DATE_SUBDATA_TYPE,
  HOUR_SUBDATA_TYPE,
} from '#src/libs/datatype-filtering/constants';
import {
  getComparatorsByDataType,
  getComparatorCategoryByDataType,
  getDefaultValueForComparator,
  getDefaultValueForTimePeriod,
} from '#src/libs/datatype-filtering/utils';

import { MaterialUiSingleSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';
import HoverableWarning from '#src/components/HoverableWarning.component';
import { authorIdentifiers } from '#src/libs/reporting/constants';
import DatatypeFilterConfigValueManager from './DatatypeFilterConfigValueManager.component';
import { handleGetDynamicDataForFiltersReturn } from '../dynamic-data-hoc';

type Props = {
  filterItem: DatatypeFilterConfigItem;
  consumableColumns: ReportMetadataColumn[];
  reportColumns: string[];
  groupOperand: DatatypeFilterConfigGroupOperand;
  prefix: string;
  displayAsFirstOrderRow?: boolean;
  hidePrefix?: boolean;
  hideDelete?: boolean;
  isPreview?: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  onDelete?: () => void;
  getDataByType: (
    datatype: DynamicFilterDataType,
  ) => handleGetDynamicDataForFiltersReturn;
  dashboardTranslationNamespace?: boolean;
};

const DatatypeFilterConfigRow: React.FC<Props> = ({
  hideDelete,
  hidePrefix,
  consumableColumns,
  reportColumns,
  filterItem,
  groupOperand,
  prefix,
  displayAsFirstOrderRow,
  isPreview,
  setFieldValue,
  onDelete,
  getDataByType,
  dashboardTranslationNamespace,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();
  const rowRef = useRef(null);

  const translationPrefix = dashboardTranslationNamespace
    ? 'dashboard:dataSourceIdentifiers'
    : 'columns';

  //
  // Options
  //
  const columsOptions = useMemo(
    () =>
      uniqBy(
        [
          {
            label: t(
              `${translationPrefix}.${
                filterItem.datatype === 'user' &&
                !authorIdentifiers.includes(filterItem.identifier)
                  ? 'member'
                  : filterItem.identifier
              }`,
            ),
            value: filterItem.identifier,
            datatype: filterItem.datatype,
          },
          ...consumableColumns.map((c) => ({
            label: t(
              `${translationPrefix}.${
                c.datatype === 'user' &&
                !authorIdentifiers.includes(filterItem.identifier)
                  ? 'member'
                  : c.identifier
              }`,
            ),
            value: c.identifier,
            datatype: c.datatype,
          })),
        ],
        'value',
      ),
    [
      consumableColumns,
      t,
      filterItem.identifier,
      filterItem.datatype,
      translationPrefix,
    ],
  );

  const filterComparators: AllComparator[] = useMemo(
    () => getComparatorsByDataType(filterItem.datatype),
    [filterItem.datatype],
  );

  const filterComparatorOptions = useMemo(
    () =>
      filterComparators.map((filterComparator) => ({
        label: t(
          `filter.form.filterComparator.${getComparatorCategoryByDataType(
            filterItem.datatype,
          )}.${filterComparator}`,
        ),
        value: filterComparator,
        showWarning: true,
      })),
    [filterComparators, filterItem.datatype, t],
  );

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

  //
  // Handlers
  //

  const handleColumnChange = (option: {
    label?: string;
    value: AllComparator;
  }) => {
    // @ts-expect-error
    const newColumn = columsOptions.find((c) => c.value === option.value);
    const newAvailableComparator = getComparatorsByDataType(newColumn.datatype);
    const newComparator = !newAvailableComparator.includes(
      filterItem.comparator,
    )
      ? newAvailableComparator[0]
      : filterItem.comparator;

    const sub_datatype = () => {
      if (newColumn.datatype === 'date') {
        return DATE_SUBDATA_TYPE;
      }
      return newColumn.datatype === 'datetime' ? DATE_SUBDATA_TYPE : null;
    };

    setFieldValue(`${prefix}.comparator`, newComparator, false);
    setFieldValue(
      `${prefix}.value`,
      getDefaultValueForComparator({
        comparator: newComparator,
        // @ts-expect-error
        datatype: newColumn.datatype,
        currentValue: filterItem.value,
      }),
      false,
    );

    setFieldValue(
      `${prefix}.time_period`,
      getDefaultValueForTimePeriod({
        comparator: newComparator,
        // @ts-expect-error
        sub_datatype: sub_datatype(),
        // @ts-expect-error
        datatype: newColumn.datatype,
        currentTimePeriod: filterItem.time_period,
      }),
      false,
    );

    setFieldValue(`${prefix}.datatype`, newColumn.datatype, false);
    setFieldValue(`${prefix}.sub_datatype`, sub_datatype(), false);
    // Timeout to execute after the js loop and check the data at this time as setFieldValue is not synchronous
    setTimeout(() => {
      setFieldValue(`${prefix}.identifier`, newColumn.value, true);
    }, 0);
  };

  const handleComparatorChange = (option: {
    label?: string;
    value: AllComparator;
  }) => {
    const comparator = option.value;

    setFieldValue(
      `${prefix}.value`,
      getDefaultValueForComparator({
        comparator,
        datatype: filterItem.datatype,
        currentValue: filterItem.value,
        isChangingComparator: true,
      }),
      false,
    );
    setFieldValue(
      `${prefix}.time_period`,
      getDefaultValueForTimePeriod({
        comparator,
        sub_datatype: filterItem.sub_datatype,
        datatype: filterItem.datatype,
        currentTimePeriod: filterItem.time_period,
      }),
      false,
    );
    // Timeout to execute after the js loop and check the data at this time as setFieldValue is not synchronous
    setTimeout(() => {
      setFieldValue(`${prefix}.comparator`, comparator, true);
    }, 0);
  };

  return (
    <div ref={rowRef} className={classes.filterRow}>
      {!displayAsFirstOrderRow && (
        <div className={classNames(classes.groupRule, classes.center)}>
          {!hidePrefix && (
            <Typography color="textSecondary">
              {t(`filter.form.groupOperand.${groupOperand}`)}
            </Typography>
          )}
        </div>
      )}
      <div className={classNames(classes.flexOne, classes.relative)}>
        <MaterialUiSingleSelectorField
          inScrollBar
          // @ts-expect-error
          chipsRenderer={({ data }) => (
            <div className={classes.warningSelect}>
              <div>{data.label}</div>
              {!reportColumns.includes(filterItem.identifier) && (
                <HoverableWarning
                  containerPortal={rowRef?.current}
                  id={`${prefix}.identifier`}
                  text={t('filter.form.columnError')}
                />
              )}
            </div>
          )}
          classes={{ root: classes.select }}
          isDisabled={isPreview}
          name={`${prefix}.identifier`}
          onChange={handleColumnChange}
          // @ts-expect-error
          options={columsOptions}
        />
      </div>
      {filterItem.datatype === 'datetime' && (
        <div className={classes.flexOne}>
          <MaterialUiSingleSelectorField
            inScrollBar
            // @ts-expect-error
            classes={{ root: classes.select }}
            isDisabled={isPreview}
            name={`${prefix}.sub_datatype`}
            options={subDataTypeOption}
          />
        </div>
      )}
      <div className={classes.flexOne}>
        <MaterialUiSingleSelectorField
          inScrollBar
          // @ts-expect-error
          classes={{ root: classes.select }}
          isDisabled={isPreview}
          name={`${prefix}.comparator`}
          onChange={handleComparatorChange}
          options={filterComparatorOptions}
        />
      </div>
      <div
        className={classNames(classes.row, classes.flexTwo, {
          [classes.center]:
            filterItem.datatype === 'date' ||
            filterItem.sub_datatype === DATE_SUBDATA_TYPE,
        })}
      >
        <DatatypeFilterConfigValueManager
          inScrollBar
          comparator={filterItem.comparator}
          filterItem={filterItem}
          getDataByType={getDataByType}
          isPreview={isPreview}
          prefix={prefix}
        />
      </div>
      <div className={classes.deleteIcon}>
        {!hideDelete && !isPreview && (
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    gap: theme.spacing(1),
  },
  groupRule: {
    width: 20,
  },
  center: {
    alignSelf: 'center',
  },
  flexOne: {
    flex: '1 1 120px',
  },
  flexTwo: {
    flex: 2,
  },
  select: {
    minWidth: 160,
  },
  relative: {
    flex: '1 1 120px',
    position: 'relative',
  },
  deleteIcon: {
    width: 48,
    alignSelf: 'flex-end',
  },
  warningSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
}));

export default DatatypeFilterConfigRow;
