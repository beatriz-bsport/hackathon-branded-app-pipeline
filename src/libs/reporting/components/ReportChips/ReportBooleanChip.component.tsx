import React from 'react';
import { useTheme } from '@material-ui/core';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

type Props = {
  datatype: string;
  value: boolean;
  translation: string;
};

const GREY_NO = ['new_member_only', 'plan_auto_renewal', 'is_recurring'];
const GREEN_NO = [
  'is_no_show',
  'is_unpaid',
  'disabled',
  'roll_call_needs_validation',
];
const RED_NO = [
  'attendance',
  'accept_email',
  'accept_sms',
  'marketplace_enabled',
  'is_rent',
];

const ReportBooleanChip: React.FC<Props> = ({
  datatype,
  value,
  translation,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const red = theme.palette.error;
  let color = null;
  if (GREY_NO.includes(datatype)) {
    value && (color = green.dark);
  } else if (GREEN_NO.includes(datatype)) {
    value ? (color = red.dark) : (color = green.dark);
  } else if (RED_NO.includes(datatype)) {
    value ? (color = green.dark) : (color = red.dark);
  }
  return <ReportChipDisplay mainColor={color} displayedValue={translation} />;
};

export default React.memo(ReportBooleanChip);
