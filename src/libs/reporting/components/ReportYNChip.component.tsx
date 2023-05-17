// @ts-nocheck
import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChipDisplay.component';

// TODO PROPER TYPING
type Props = {
  datatype: any;
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
  'acccept_sms',
  'marketplace_enabled',
  'is_rent',
];

export const ReportYNChip = (props: Props) => {
  const { datatype, value, translation } = props;
  const icon = null;
  let color = 'grey';
  if (GREY_NO.includes(datatype)) {
    value ? (color = 'green') : (color = 'grey');
  }
  if (GREEN_NO.includes(datatype)) {
    value ? (color = 'red') : (color = 'green');
  }
  if (RED_NO.includes(datatype)) {
    value ? (color = 'green') : (color = 'red');
  }
  return <ReportChipDisplay color={color} icon={icon} value={translation} />;
};

export default ReportYNChip;
