import React, { useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FormHelperText, Popover, Theme, makeStyles } from '@material-ui/core';

import { useFormikContext } from 'formik';
import type {
  AllComparator,
  BillingPlanDynamicForeignKeyType,
  DatatypeFilterConfigItem,
  DatatypeFilterConfigItemTypeById,
  DatatypeFilterConfigItemTypeDate,
  DatatypeFilterConfigItemTypeFloat,
  DatatypeFilterConfigItemValueProducts,
} from '#src/libs/datatype-filtering/types';
import {
  DATE_SUBDATA_TYPE,
  HOUR_SUBDATA_TYPE,
} from '#src/libs/datatype-filtering/constants';
import {
  getComparatorCategoryByDataType,
  getComparatorsByDataType,
  getDefaultValueForTimePeriod,
  getDefaultValueForComparator,
} from '#src/libs/datatype-filtering/utils';
import { MaterialUiSingleSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';
import DatatypeFilterConfigValueManager from '#src/libs/datatype-filtering/components/DatatypeFilterConfigValueManager.component';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import ReportFilterChip from '#src/libs/reporting/common/components/ReportFilterChip.component';
import type { ReportFilterConfig } from '#src/libs/reporting/common/types';
import {
  CREDIT_COLUMNS,
  FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS,
} from '#src/libs/reporting/common/constants';
import { getCreditFactor } from '#src/libs/theme/selectors';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import type { BuyableItemOptions } from '#src/libs/checkout/types';
import { retrieveFilterableProductOptions } from '#src/libs/reporting/common/utils';
import get from 'lodash/get';

export type QuickFiltersColumnsData = {
  identifier: string;
  value: number | boolean | number[] | DatatypeFilterConfigItemValueProducts;
  comparator: 0 | 1 | 2 | 3 | 4 | 5;
  datatype:
    | 'boolean'
    | 'products'
    | DatatypeFilterConfigItemTypeById
    | DatatypeFilterConfigItemTypeFloat
    | DatatypeFilterConfigItemTypeDate
    | 'datetime';
}[];

type QuickReportFilterConfigFilterProps = {
  displayStopSubscriptionFromMemberSide?: boolean;
  isQuickFilterConfigRowModalOpen: boolean;
  selectedColumn: DatatypeFilterConfigItem;
  getDataByType: handleGetDynamicDataForFiltersType;
  anchorEl: (EventTarget & HTMLButtonElement) | HTMLDivElement | null;
  columnsDataSelectedQuickFilter: QuickFiltersColumnsData;
  isQuickFilterModalOpen: boolean;
  onClose: () => void;
  reportCategory: ReportCategoryEnum;
};

const QuickReportFilterConfigFilter: React.FC<
  QuickReportFilterConfigFilterProps
> = ({
  displayStopSubscriptionFromMemberSide,
  selectedColumn,
  getDataByType,
  anchorEl,
  isQuickFilterConfigRowModalOpen,
  isQuickFilterModalOpen,
  onClose,
  columnsDataSelectedQuickFilter,
  reportCategory,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();
  const memberElementRef = React.useRef<HTMLDivElement>();
  const [shouldForceUpdate, setShouldForceUpdate] = React.useState(true);

  React.useEffect(() => {
    if (shouldForceUpdate) {
      // setTimeout here is necessary because when re-mounting the component,
      // React takes some time to reassign the element to the ref
      setTimeout(() => setShouldForceUpdate(false));
    }
  }, [shouldForceUpdate]);

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

  const showDecimalCreditHelperText: boolean = useMemo(
    () =>
      getCreditFactor() !== 1 &&
      ['int', 'number'].includes(selectedColumn.datatype) &&
      CREDIT_COLUMNS.includes(selectedColumn.identifier),
    [selectedColumn.datatype, selectedColumn.identifier],
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
          currentValue: [
            'products',
            'product_category',
            'billing_plan_product',
          ].includes(selectedColumn.datatype)
            ? get(values, `config.groups[0].filters_data.${index}.value`)
            : selectedColumn.value,
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
    [selectedColumn, index, setFieldValue, values],
  );

  const productTypeOption = useMemo(
    () =>
      retrieveFilterableProductOptions(
        reportCategory,
        selectedColumn.datatype,
      ).map((option) => ({
        value: option.value,
        label: t(`${option.translationKey}`),
      })),
    [t, reportCategory, selectedColumn.datatype],
  );

  const billingPlanProductTypeOption = useMemo(
    () =>
      FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`${option.translationKey}`),
      })),
    [t],
  );

  const handleProductChange = React.useCallback(
    (option: { label: string; value: BuyableItemOptions }) => {
      setFieldValue(
        `config.groups[0].filters_data.${index}.value`,
        { buyable_item_identifier: option.value, object_ids: [] },
        false,
      );
    },
    [setFieldValue, index],
  );

  const handleBillingPlanProductChange = React.useCallback(
    (option: { label: string; value: BillingPlanDynamicForeignKeyType }) => {
      setFieldValue(
        `config.groups[0].filters_data.${index}.value`,
        { dynamic_foreign_key: option.value, object_ids: [] },
        false,
      );
    },
    [setFieldValue, index],
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
          {showDecimalCreditHelperText && (
            <FormHelperText>
              {t('filter.form.decimalCredit.helperText', {
                creditFactor: String(getCreditFactor()),
              })}
            </FormHelperText>
          )}
          <div className={classes.quickReportFilterSelectorRows}>
            {selectedColumn.datatype === 'datetime' && (
              <div className={classes.subDataTypeSelector}>
                <MaterialUiSingleSelectorField
                  name={`config.groups[0].filters_data.${index}.sub_datatype`}
                  options={subDataTypeOption}
                />
              </div>
            )}
            {['products', 'product_category'].includes(
              selectedColumn.datatype,
            ) && (
              <div className={classes.comparatorSelector}>
                <MaterialUiSingleSelectorField
                  name={`config.groups[0].filters_data.${index}.value.buyable_item_identifier`}
                  onChange={handleProductChange}
                  options={productTypeOption}
                />
              </div>
            )}
            {selectedColumn.datatype === 'billing_plan_product' && (
              <div className={classes.comparatorSelector}>
                <MaterialUiSingleSelectorField
                  name={`config.groups[0].filters_data.${index}.value.dynamic_foreign_key`}
                  onChange={handleBillingPlanProductChange}
                  options={billingPlanProductTypeOption}
                />
              </div>
            )}
            <div className={classes.comparatorSelector}>
              <MaterialUiSingleSelectorField
                name={`config.groups[0].filters_data.${index}.comparator`}
                onChange={handleComparatorChange}
                options={filterComparatorOptions}
              />
            </div>
            <div>
              {!!values.config?.groups.length && (
                <DatatypeFilterConfigValueManager
                  openMenuOnClear
                  openMenuOnFocus
                  withoutConfirmButton
                  closeMenuOnSelect={false}
                  comparator={
                    values.config.groups[0].filters_data[index]?.comparator
                  }
                  displayStopSubscriptionFromMemberSide={
                    displayStopSubscriptionFromMemberSide
                  }
                  filterItem={values.config.groups[0].filters_data[index]}
                  getDataByType={getDataByType}
                  memberDomElement={memberElementRef?.current}
                  prefix={`config.groups[0].filters_data.${index}`}
                  reportCategory={reportCategory}
                />
              )}
            </div>
          </div>
          <div ref={memberElementRef} className={classes.memberDiv} />
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
  },
  quickReportFilterSelectorRows: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
  },
  subDataTypeSelector: { minWidth: '100px' },
  comparatorSelector: { minWidth: '200px' },
  memberDiv: { width: '100%' },
}));
export default memo(QuickReportFilterConfigFilter);
