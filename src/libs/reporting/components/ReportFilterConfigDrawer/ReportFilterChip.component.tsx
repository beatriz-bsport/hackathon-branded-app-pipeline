import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, CircularProgress } from '@material-ui/core';
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
import { useFormikContext } from 'formik';
import type {
  AllComparator,
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
  DynamicFilterDataType,
} from '#libs/datatype-filtering/types';
import { ReportFilterableDataType } from '#libs/datatype-filtering/constants';
import { ReportFilterConfig } from '#libs/reporting/types';
import {
  getComparatorLabel,
  getMultipleValuesLabel,
  getSingleValueLabel,
} from '#libs/reporting/utils';
import { handleGetDynamicDataForFiltersReturn } from '#libs/datatype-filtering/dynamic-data-hoc';

type ReportFilterChipProps = {
  datatype: DataSourceMedadataDataType;
  label?: string;
  comparator?: AllComparator;
  setIsQuickFilterModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQuickFilterConfigRowModalOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setAnchorEl?: React.Dispatch<
    (EventTarget & HTMLButtonElement) | HTMLDivElement
  >;
  setSelectedColumn?: React.Dispatch<
    React.SetStateAction<DatatypeFilterConfigItem>
  >;
  editReportFilterConfig?: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'> | ReportFilterConfig,
  ) => void;
  reportQuickFilter?: ReportFilterConfig;
  onlyDisplay?: boolean;
  value?: boolean | number[] | number;
  getDataByTypeAndId?: (
    type: DynamicFilterDataType,
    valueId?: number[],
  ) => handleGetDynamicDataForFiltersReturn;
};

const ReportFilterChip: React.FC<ReportFilterChipProps> = ({
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
}) => {
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

  const valueLabel = () => {
    if (Array.isArray(value)) {
      if (value?.length > 1) {
        return getMultipleValuesLabel(datatype, value);
      }
      if (value.length === 1) {
        return `${getComparatorLabel(comparator) ?? ''} ${getSingleValueLabel(
          datatype,
          value,
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
      (filterItem: DatatypeFilterConfigItem) => filterItem.identifier !== label,
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
        ? deepCopyQuickReportFilter
        : { ...reportQuickFilter, config: {} },
    );
  }, [
    setFieldValue,
    allFilters,
    label,
    values,
    reportQuickFilter,
    editReportFilterConfig,
  ]);

  if (
    !onlyDisplay &&
    getSingleValueLabel(datatype, value, getDataByTypeAndId, t) === ''
  ) {
    return <CircularProgress />;
  }

  return (
    <Chip
      key={label}
      icon={getIcon()}
      label={`${t(`columns.${label}`)} ${!onlyDisplay ? valueLabel() : ''}`}
      onClick={!onlyDisplay && handleQuickFilterEditFilter}
      onDelete={!onlyDisplay && handleQuickFilterDeleteFilter}
    />
  );
};

export default memo(ReportFilterChip);
