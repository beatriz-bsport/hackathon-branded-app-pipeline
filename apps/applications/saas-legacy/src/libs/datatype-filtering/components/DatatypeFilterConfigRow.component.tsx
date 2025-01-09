import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';

import { makeStyles, Theme, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import type { BuyableItemOptions } from '#src/libs/checkout/types';

import type { ReportMetadataColumn } from '#src/libs/reporting/common/types';

import {
  AllComparator,
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
import DatatypeFilterConfigValueManager from './DatatypeFilterConfigValueManager.component';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import {
  getColumnLabelTranslation,
  isReportColumnRemoved,
  retrieveFilterableProductOptions,
} from '#src/libs/reporting/common/utils';
import { FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS } from '#src/libs/reporting/common/constants';

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
  getDataByType: handleGetDynamicDataForFiltersType;
  dashboardTranslationNamespace?: boolean;
  displayPopperWarning?: boolean;
  invalidAdvancedFilterItemsUUID?: string[];
  reportCategory?: ReportCategoryEnum;
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
  displayPopperWarning = true,
  invalidAdvancedFilterItemsUUID,
  reportCategory,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles({ displayAsFirstOrderRow });
  const rowRef = useRef(null);
  const memberElementRef = React.useRef<HTMLDivElement>();
  const [shouldForceUpdate, setShouldForceUpdate] = React.useState(true);
  const isColumnRemoved = useMemo(
    () =>
      isReportColumnRemoved(
        filterItem.datatype,
        reportColumns,
        filterItem.identifier,
      ),
    [filterItem, reportColumns],
  );
  React.useEffect(() => {
    if (shouldForceUpdate) {
      // setTimeout here is necessary because when re-mounting the component,
      // React takes some time to reassign the element to the ref
      setTimeout(() => setShouldForceUpdate(false));
    }
  }, [shouldForceUpdate]);

  const getColumnLabelNamespace = React.useCallback(
    (datatype, identifier) => {
      if (dashboardTranslationNamespace) {
        return `dashboard:dataSourceIdentifiers.${identifier}`;
      }
      return getColumnLabelTranslation(datatype, identifier);
    },
    [dashboardTranslationNamespace],
  );

  //
  // Options
  //
  const columsOptions = useMemo(
    () =>
      uniqBy(
        [
          {
            label: t(
              `${getColumnLabelNamespace(
                filterItem.datatype,
                filterItem.identifier,
              )}`,
            ),
            value: filterItem.identifier,
            datatype: filterItem.datatype,
          },
          ...consumableColumns.map((c) => ({
            label: t(`${getColumnLabelNamespace(c.datatype, c.identifier)}`),
            value: c.identifier,
            datatype: c.datatype,
          })),
        ],
        'label',
      ),
    [
      consumableColumns,
      t,
      filterItem.identifier,
      filterItem.datatype,
      getColumnLabelNamespace,
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

  const productTypeOption = useMemo(
    () =>
      retrieveFilterableProductOptions(reportCategory, filterItem.datatype).map(
        (option) => ({
          value: option.value,
          label: t(`${option.translationKey}`),
        }),
      ),
    [t, reportCategory, filterItem.datatype],
  );
  //
  // Handlers
  //

  const handleProductChange = React.useCallback(
    (option: { label: string; value: BuyableItemOptions }) => {
      setFieldValue(
        `${prefix}.value`,
        { buyable_item_identifier: option.value, object_ids: [] },
        false,
      );
    },
    [setFieldValue, prefix],
  );

  const handleBillingPlanProductChange = React.useCallback(
    (option: { label: string; value: BuyableItemOptions }) => {
      setFieldValue(
        `${prefix}.value`,
        { dynamic_foreign_key: option.value, object_ids: [] },
        false,
      );
    },
    [setFieldValue, prefix],
  );

  const billingPlanProductTypeOption = useMemo(
    () =>
      FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`${option.translationKey}`),
      })),
    [t],
  );

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
    <div className={classes.maxWidth}>
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
                {isColumnRemoved && (
                  <HoverableWarning
                    containerPortal={rowRef?.current}
                    displayPopperWarning={displayPopperWarning}
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
        {['products', 'product_category'].includes(filterItem.datatype) && (
          <div className={classes.flexOne}>
            <MaterialUiSingleSelectorField
              inScrollBar
              // @ts-expect-error
              classes={{ root: classes.select }}
              isDisabled={isPreview}
              name={`${prefix}.value.buyable_item_identifier`}
              onChange={handleProductChange}
              options={productTypeOption}
            />
          </div>
        )}
        {filterItem.datatype === 'billing_plan_product' && (
          <div className={classes.flexOne}>
            <MaterialUiSingleSelectorField
              inScrollBar
              // @ts-expect-error
              classes={{ root: classes.select }}
              isDisabled={isPreview}
              name={`${prefix}.value.dynamic_foreign_key`}
              onChange={handleBillingPlanProductChange}
              options={billingPlanProductTypeOption}
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
            invalidAdvancedFilterItemsUUID={invalidAdvancedFilterItemsUUID}
            isPreview={isPreview}
            memberDomElement={memberElementRef?.current}
            prefix={prefix}
            reportCategory={reportCategory}
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
      <div ref={memberElementRef} className={classes.memberDiv} />
    </div>
  );
};

const useStyles = makeStyles<Theme, { displayAsFirstOrderRow: boolean }>(
  (theme) => ({
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
    maxWidth: { width: '100%' },
    memberDiv: ({ displayAsFirstOrderRow }) => ({
      width: '100%',
      paddingLeft: !displayAsFirstOrderRow ? '20px' : 0,
    }),
  }),
);

export default DatatypeFilterConfigRow;
