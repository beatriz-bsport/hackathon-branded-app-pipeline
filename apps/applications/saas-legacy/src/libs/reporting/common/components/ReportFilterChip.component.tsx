import React, { useCallback, memo, useMemo, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chip,
  CircularProgress,
  Theme,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import LocationOn from '@material-ui/icons/LocationOn';
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import RedeemIcon from '@material-ui/icons/Redeem';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import VpnKey from '@material-ui/icons/VpnKey';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import PeopleIcon from '@material-ui/icons/People';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Star from '@material-ui/icons/Star';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';
import { Error, Warning } from '@material-ui/icons';
import chroma from 'chroma-js';
import { useFormikContext } from 'formik';
import type {
  AllComparator,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
  DatatypeFilterConfigItemValueProducts,
  DynamicFilterDataType,
} from '#src/libs/datatype-filtering/types';
import { ReportFilterableDataType } from '#src/libs/datatype-filtering/constants';
import type { ReportFilterConfig } from '#src/libs/reporting/common/types';
import {
  getComparatorLabel,
  getMultipleValuesLabel,
  getSingleValueLabel,
  getColumnLabelTranslation,
  isReportColumnRemoved,
  isDatatypeFilterConfigItemValueProducts,
  isDatatypeFilterConfigItemValueDynamic,
} from '#src/libs/reporting/common/utils';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import {
  FILTERABLE_PRODUCT_TYPE_OPTIONS,
  FILTERABLE_PRODUCT_CATEGORY_OPTIONS,
  FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS,
} from '#src/libs/reporting/common/constants';

type ReportFilterChipProps = {
  datatype: DataSourceMedadataDataType;
  label?: string;
  comparator?: AllComparator;
  setIsQuickFilterModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQuickFilterConfigRowModalOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setAnchorEl?: React.Dispatch<
    (EventTarget & HTMLButtonElement) | HTMLDivElement | null
  >;
  setSelectedColumn?: React.Dispatch<
    React.SetStateAction<DatatypeFilterConfigItem>
  >;
  editReportFilterConfig?: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
  ) => void;
  reportQuickFilter?: ReportFilterConfig;
  onlyDisplay?: boolean;
  value?: boolean | number[] | number | DatatypeFilterConfigItemValueProducts;
  getDataByTypeAndId?: handleGetDynamicDataForFiltersType;
  columnIdentifiers?: string[];
  ref?: React.Ref<HTMLDivElement | null>;
  subDataType?: 0 | 1 | null;
  dynamicDataHasBeenLoaded?: Record<DynamicFilterDataType, boolean>;
  isInvalid?: boolean;
};

const ReportFilterChip: React.FC<ReportFilterChipProps> = forwardRef(
  (
    {
      datatype,
      label,
      onlyDisplay,
      comparator,
      reportQuickFilter,
      setIsQuickFilterModalOpen,
      setIsQuickFilterConfigRowModalOpen,
      setAnchorEl,
      setSelectedColumn,
      editReportFilterConfig,
      value,
      getDataByTypeAndId,
      columnIdentifiers,
      subDataType,
      dynamicDataHasBeenLoaded,
      isInvalid,
    },
    ref,
  ) => {
    const { t } = useTranslation('reporting');
    const classes = useStyles();

    const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

    /**
     * "products" datatype is a dynamic datatype
     */
    const datatypeProductFiltering = React.useMemo(() => {
      if (isDatatypeFilterConfigItemValueProducts(value)) {
        if (datatype === 'products') {
          return (
            FILTERABLE_PRODUCT_TYPE_OPTIONS.find(
              (option) => option.value === value.buyable_item_identifier,
            )?.datatypeFiltering || datatype
          );
        }
        if (datatype === 'product_category') {
          return (
            FILTERABLE_PRODUCT_CATEGORY_OPTIONS.find(
              (option) => option.value === value.buyable_item_identifier,
            )?.datatypeFiltering || datatype
          );
        }
      }
      if (isDatatypeFilterConfigItemValueDynamic(value)) {
        if (datatype === 'billing_plan_product')
          return (
            FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS.find(
              (option) => option.value === value.dynamic_foreign_key,
            )?.datatypeFiltering || datatype
          );
      }
      return datatype;
    }, [value, datatype]);

    const isColumnRemoved = useMemo(
      () => isReportColumnRemoved(datatype, columnIdentifiers, label),
      [columnIdentifiers, label, datatype],
    );

    /**
     * Some filters are dynamic because they filter based on ids, hence the need for
     * additional fetches defined in dynamic-data-hoc file
     *
     * "products" datatype redirect to another datatype to fetch data (see datatypeProductFiltering)
     */
    const hasDynamicDataHasBeenLoaded = React.useMemo(() => {
      if (onlyDisplay) {
        return true;
      }
      if (
        !['products', 'product_category', 'billing_plan_product'].includes(
          datatype,
        ) &&
        datatype in dynamicDataHasBeenLoaded
      )
        return dynamicDataHasBeenLoaded[datatype as DynamicFilterDataType];
      if (
        ['products', 'product_category', 'billing_plan_product'].includes(
          datatype,
        )
      ) {
        return dynamicDataHasBeenLoaded[
          datatypeProductFiltering as DynamicFilterDataType
        ];
      }
      return true;
    }, [
      onlyDisplay,
      datatype,
      dynamicDataHasBeenLoaded,
      datatypeProductFiltering,
    ]);

    /**
     * Dynamic datatype filters get their information from the same source as for filter selectors (dynamic-data-hoc file)
     * We want to fetch the data only if needed : i.e when the filter only has 1 value and if the filter is
     * dynamic and has not yet been fetched
     */
    React.useEffect(() => {
      if (
        !hasDynamicDataHasBeenLoaded &&
        Array.isArray(value) &&
        value?.length === 1
      ) {
        getDataByTypeAndId(datatype as DynamicFilterDataType, value);
      }
      if (
        !hasDynamicDataHasBeenLoaded &&
        (isDatatypeFilterConfigItemValueProducts(value) ||
          isDatatypeFilterConfigItemValueDynamic(value)) &&
        value.object_ids.length === 1
      ) {
        getDataByTypeAndId(
          datatypeProductFiltering as DynamicFilterDataType,
          value.object_ids,
        );
      }
    }, [
      getDataByTypeAndId,
      hasDynamicDataHasBeenLoaded,
      value,
      datatype,
      datatypeProductFiltering,
    ]);

    /**
     * This memoized string has different values depending on several factors:
     * - comparator value
     * - number of values AND datatype:
     *   - if there is more than 1 value: it returns a specific value defined through getMultipleValuesLabel
     *   - if there is 1 value: it returns a specific value defined through getSingleValueLabel
     *   - if there is no value: it returns an empty string
     */
    const valueLabel = React.useMemo(() => {
      if (onlyDisplay) return '';
      if (
        isDatatypeFilterConfigItemValueProducts(value) ||
        isDatatypeFilterConfigItemValueDynamic(value)
      ) {
        if (value.object_ids?.length > 1)
          return getMultipleValuesLabel(
            datatype,
            subDataType,
            value.object_ids,
          );
        if (value.object_ids?.length === 1) {
          if (!hasDynamicDataHasBeenLoaded) return '';
          return `${getComparatorLabel(comparator) ?? ''} ${getSingleValueLabel(
            datatype,
            value,
            subDataType,
            getDataByTypeAndId,
            t,
          )}`;
        }
        return '';
      }
      if (Array.isArray(value)) {
        if (value?.length > 1) {
          return getMultipleValuesLabel(datatype, subDataType, value);
        }
        if (value.length === 1) {
          if (!hasDynamicDataHasBeenLoaded) return '';
          return `${getComparatorLabel(comparator) ?? ''} ${getSingleValueLabel(
            datatype,
            value,
            subDataType,
            getDataByTypeAndId,
            t,
          )}`;
        }
        // case where only the column has been selected without value
        return '';
      }
      return `${getComparatorLabel(comparator) ?? ''} ${getSingleValueLabel(
        datatype,
        value,
        subDataType,
        getDataByTypeAndId,
        t,
      )}`;
    }, [
      datatype,
      subDataType,
      value,
      comparator,
      t,
      getDataByTypeAndId,
      onlyDisplay,
      hasDynamicDataHasBeenLoaded,
    ]);

    const getIcon = useCallback(() => {
      if (!onlyDisplay && isColumnRemoved)
        return <Warning className={classes.columnRemoved} />;

      if (!onlyDisplay && isInvalid) {
        return <Error className={classes.isInvalidIcon} />;
      }
      switch (datatype) {
        case ReportFilterableDataType.PRICE:
        case ReportFilterableDataType.CTS:
        case ReportFilterableDataType.PAYMENT_METHOD:
        case ReportFilterableDataType.COUPON:
        case ReportFilterableDataType.CONTRACT:
        case ReportFilterableDataType.PAYOUT_STATUS:
        case ReportFilterableDataType.PAYOUT:
          return <MonetizationOnIcon />;
        case ReportFilterableDataType.DATE:
        case ReportFilterableDataType.TIME:
        case ReportFilterableDataType.DOW:
        case ReportFilterableDataType.DATETIME:
          return <CalendarTodayIcon />;
        case ReportFilterableDataType.ESTABLISHMENT:
          return <LocationOn />;
        case ReportFilterableDataType.COACH:
          return <FitnessCenter />;
        case ReportFilterableDataType.GIFTCARD:
          return <RedeemIcon />;
        case ReportFilterableDataType.VIDEO:
          return <VideoLibraryIcon />;
        case ReportFilterableDataType.PAYMENT_PACK:
          return <VpnKey />;
        case ReportFilterableDataType.INT:
        case ReportFilterableDataType.NUMBER:
        case ReportFilterableDataType.PERCENT:
          return <ExposurePlus1Icon />;
        case ReportFilterableDataType.EMAIL:
        case ReportFilterableDataType.USER:
        case ReportFilterableDataType.STAFF:
          return <PeopleIcon />;
        case ReportFilterableDataType.BOOLEAN:
          return <CheckBoxIcon />;
        case ReportFilterableDataType.PRIVATE_SERVICE:
        case ReportFilterableDataType.PRIVATE_PASS:
        case ReportFilterableDataType.PRIVATE_SLOT:
          return <ScheduleIcon />;
        case ReportFilterableDataType.SUBSHOP:
          return <ShoppingCartIcon />;
        case ReportFilterableDataType.BILLING_ESTABLISHMENT:
        case ReportFilterableDataType.BILLING_GROUP:
        case ReportFilterableDataType.BILLING_GROUP_ADDRESS:
          return <ReceiptIcon />;
        case ReportFilterableDataType.ACTIVITY:
          return <Star />;
        case ReportFilterableDataType.BOOKING_STATUS_CODE:
          return <AccountBalanceWalletIcon />;
        case ReportFilterableDataType.COMPANY:
          return <HomeIcon />;
        default:
          return null;
      }
    }, [datatype, isInvalid, onlyDisplay, isColumnRemoved, classes]);

    const allFilters = values?.config?.groups[0].filters_data;

    const handleQuickFilterEditFilter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        const selectedFilter: DatatypeFilterConfigItem =
          allFilters &&
          allFilters.filter((group: any) => group.identifier === label)[0];
        setSelectedColumn(selectedFilter);
        setIsQuickFilterModalOpen(true);
        setIsQuickFilterConfigRowModalOpen(true);
        setAnchorEl(event.currentTarget);
      },
      [
        setSelectedColumn,
        setIsQuickFilterModalOpen,
        setIsQuickFilterConfigRowModalOpen,
        setAnchorEl,
        allFilters,
        label,
      ],
    );

    const handleQuickFilterDeleteFilter = useCallback(() => {
      const newFiltersData = allFilters.filter(
        (filterItem: DatatypeFilterConfigItem) =>
          filterItem.identifier !== label,
      );
      // values from formik is immutable so I have to create a deep copy hence deepCopyQuickReportFilter
      const deepCopyQuickReportFilter = cloneDeep(values);
      deepCopyQuickReportFilter.config.groups[0].filters_data = newFiltersData;
      setFieldValue(`config.groups[0].filters_data`, newFiltersData);

      /* setFieldValue is asynchronous : that's why I have to edit with a local const here
    If there is no filters data in the quickfilters, return empty config */
      editReportFilterConfig(
        reportQuickFilter?.id,
        deepCopyQuickReportFilter.config.groups[0].filters_data.length > 0
          ? { config: deepCopyQuickReportFilter.config }
          : { config: {} },
      );
    }, [
      setFieldValue,
      allFilters,
      label,
      values,
      reportQuickFilter,
      editReportFilterConfig,
    ]);

    const isSingleValueLoading =
      !hasDynamicDataHasBeenLoaded &&
      ((Array.isArray(value) && value?.length === 1) ||
        ((isDatatypeFilterConfigItemValueProducts(value) ||
          isDatatypeFilterConfigItemValueDynamic(value)) &&
          value.object_ids.length === 1));

    const tooltipTitle = React.useMemo(() => {
      if (onlyDisplay) {
        return '';
      }
      if (isColumnRemoved) {
        return t('filter.form.shortColumnError');
      }
      if (isInvalid) {
        return t('invalidFilter.user');
      }
      return '';
    }, [onlyDisplay, isColumnRemoved, isInvalid, t]);

    return (
      <div ref={ref} className={classes.column}>
        {isSingleValueLoading ? (
          <CircularProgress />
        ) : (
          <Tooltip title={tooltipTitle}>
            <Chip
              key={label}
              className={classNames({
                [classes.columnRemoved]: isColumnRemoved && !onlyDisplay,
                [classes.isInvalid]:
                  isInvalid && !onlyDisplay && !isColumnRemoved,
                [classes.filterWithoutValues]:
                  !onlyDisplay && !isColumnRemoved && valueLabel === '',
              })}
              icon={getIcon()}
              label={`${t(`${getColumnLabelTranslation(datatype, label)}`)} ${
                onlyDisplay ? '' : valueLabel
              }`}
              onClick={
                onlyDisplay || isColumnRemoved || isInvalid
                  ? null
                  : handleQuickFilterEditFilter
              }
              onDelete={onlyDisplay ? null : handleQuickFilterDeleteFilter}
            />
          </Tooltip>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  columnRemoved: {
    color: theme.palette.warning.dark,
    backgroundColor: '#FFF7EB',
    '&:hover': {
      backgroundColor: '#FFF7EB',
    },
  },
  isInvalidIcon: {
    color: 'inherit',
    backgroundColor: 'inherit',
  },
  isInvalid: {
    // Alert error colors
    color: '#f44336',
    backgroundColor: '#fdecea',
    '&:hover': {
      backgroundColor: '#ffccd5',
    },
  },
  column: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  filterWithoutValues: {
    color: theme.palette.text.disabled,
    backgroundColor: chroma('black').alpha(0.1).hex(),
  },
}));

export default memo(ReportFilterChip);
