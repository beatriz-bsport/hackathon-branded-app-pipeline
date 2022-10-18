import React, { useCallback } from 'react';
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

import { DataSourceMedadataDataType } from '#libs/datatype-filtering/types';

type ReportFilterChipProps = {
  datatype: DataSourceMedadataDataType;
  onClick: () => void;
};
const ReportFilterChip: React.FC<ReportFilterChipProps> = ({
  datatype,
  onClick,
}) => {
  const { t } = useTranslation('reporting');

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

  return (
    <Chip
      icon={getIcon()}
      onClick={onClick}
      label={t(`datatype.${datatype}`)}
    />
  );
};

export default ReportFilterChip;
