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
import { Warning } from '@material-ui/icons';
import chroma from 'chroma-js';
import { useFormikContext } from 'formik';
import type {
  AllComparator,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
  DynamicFilterDataType,
} from '#src/libs/datatype-filtering/types';
import { ReportFilterableDataType } from '#src/libs/datatype-filtering/constants';
import type { ReportFilterConfig } from '#src/libs/reporting/common/types';
import {
  getComparatorLabel,
  getMultipleValuesLabel,
  getSingleValueLabel,
} from '#src/libs/reporting/common/utils';
import { handleGetDynamicDataForFiltersReturn } from '#src/libs/datatype-filtering/dynamic-data-hoc';

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
  value?: boolean | number[] | number;
  getDataByTypeAndId?: (
    datatype: DynamicFilterDataType,
    valueId: number[],
    columnName: string,
  ) => handleGetDynamicDataForFiltersReturn;
  columnIdentifiers?: string[];
  ref?: React.Ref<HTMLDivElement | null>;
  subDataType?: 0 | 1 | null;
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
    },
    ref,
  ) => {
    const { t } = useTranslation('reporting');
    const classes = useStyles();

    const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

    const isColumnRemoved = useMemo(() => {
      return !columnIdentifiers?.includes(label);
    }, [columnIdentifiers, label]);

    const valueLabel = () => {
      if (Array.isArray(value)) {
        if (value?.length > 1) {
          return getMultipleValuesLabel(datatype, subDataType, value);
        }
        if (value.length === 1) {
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
    };

    const getIcon = useCallback(() => {
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
    }, [datatype]);
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

    const displayedChips = (
      <Chip
        key={label}
        className={classNames({
          [classes.columnRemoved]: isColumnRemoved && !onlyDisplay,
          [classes.filterWithoutValues]:
            !onlyDisplay && !isColumnRemoved && valueLabel() === '',
        })}
        icon={
          isColumnRemoved && !onlyDisplay ? (
            <Warning className={classes.columnRemoved} />
          ) : (
            getIcon()
          )
        }
        label={`${t(`columns.${label}`)} ${!onlyDisplay ? valueLabel() : ''}`}
        onClick={
          !onlyDisplay && !isColumnRemoved && handleQuickFilterEditFilter
        }
        onDelete={!onlyDisplay && handleQuickFilterDeleteFilter}
      />
    );

    if (
      !onlyDisplay &&
      getSingleValueLabel(
        datatype,
        value,
        subDataType,
        getDataByTypeAndId,
        t,
      ) === ''
    ) {
      return (
        <div ref={ref}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div ref={ref} className={classes.column}>
        {isColumnRemoved && !onlyDisplay ? (
          <Tooltip title={t('filter.form.shortColumnError')}>
            {displayedChips}
          </Tooltip>
        ) : (
          displayedChips
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
