import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';
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
import { useFormikContext } from 'formik';

import cloneDeep from 'lodash/cloneDeep';
import type {
  DataSourceMedadataDataType,
  DatatypeFilterConfigItem,
} from '#libs/datatype-filtering/types';
import { ReportFilterConfig } from '#libs/reporting/types';

type ReportFilterChipProps = {
  datatype: DataSourceMedadataDataType;
  label?: string;
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
};

const ReportFilterChip: React.FC<ReportFilterChipProps> = ({
  datatype,
  label,
  onlyDisplay,
  reportQuickFilter,
  setIsQuickFilterModalOpen,
  setIsQuickFilterConfigRowModalOpen,
  setAnchorEl,
  setSelectedColumn,
  editReportFilterConfig,
}) => {
  const { t } = useTranslation('reporting');
  const { values, setFieldValue } = useFormikContext<ReportFilterConfig>();

  const getIcon = useCallback(() => {
    switch (datatype) {
      case 'price':
      case 'cts':
      case 'payment_method':
      case 'coupon':
      case 'contract':
      case 'payout_status':
      case 'payout':
        return <MonetizationOnIcon />;
      case 'date':
      case 'time':
      case 'dow':
      case 'datetime':
        return <CalendarTodayIcon />;
      case 'establishment':
        return <LocationOn />;
      case 'coach':
        return <FitnessCenter />;
      case 'giftcard':
        return <RedeemIcon />;
      case 'video':
        return <VideoLibraryIcon />;
      case 'payment_pack':
        return <VpnKey />;
      case 'int':
      case 'number':
      case 'percent':
        return <ExposurePlus1Icon />;
      case 'email':
      case 'user':
      case 'staff':
        return <PeopleIcon />;
      case 'boolean':
        return <CheckBoxIcon />;
      case 'private_service':
      case 'private_pass':
      case 'private_slot':
        return <ScheduleIcon />;
      case 'subshop':
        return <ShoppingCartIcon />;
      case 'billing_establishment':
      case 'billing_group':
        return <ReceiptIcon />;
      case 'activity':
        return <Star />;
      case 'booking_status_code':
        return <AccountBalanceWalletIcon />;
      case 'company':
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

  return (
    <Chip
      key={label}
      icon={getIcon()}
      label={`${t(`columns.${label}`)}`}
      onClick={!onlyDisplay && handleQuickFilterEditFilter}
      onDelete={!onlyDisplay && handleQuickFilterDeleteFilter}
    />
  );
};

export default memo(ReportFilterChip);
