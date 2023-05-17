// @ts-nocheck
import React from 'react';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChipDisplay.component';

// TODO PROPER TYPING
type Props = {
  datatype: any;
  value: number;
  translation: string;
};

const ATTENDANCE_RATE = ['rate_attendance'];
const CREDITS = ['credits'];
const CARDS_NOT_ACTIVATED = ['nb_non_activated'];
const UNPAID_AMOUNT = ['unpaid_amount'];
const ABSENCE_RATE = ['rate_non_attendance', 'cancel_rate'];
const MARGINAL_VALUE = ['sum_margin_value'];
const STOCK = ['stock'];

// WIP still have to code the icon depending on the percentage

export const ReportNumberChip = (props: Props) => {
  const { datatype, value, translation } = props;
  let icon = null;
  let color = 'grey';
  if (ATTENDANCE_RATE.includes(datatype)) {
    if (value === 0) {
      color = 'red';
      icon = 'cross';
    } else if (value > 0 && value <= 50) {
      color = 'orange';
      icon = 'exclamation';
    } else if (value > 50 && value <= 90) {
      color = 'yellow';
      icon = 'forbidden';
    } else {
      color = 'green';
      icon = 'check';
    }
  }
  if (CREDITS.includes(datatype)) {
    if (value >= 0) {
      color = 'green';
      icon = 'check';
    } else {
      color = 'yellow';
      icon = 'warning';
    }
  }
  if (CARDS_NOT_ACTIVATED.includes(datatype)) {
    if (value > 0) {
      color = 'red';
      icon = 'exclamation';
    } else {
      color = 'green';
      icon = 'check';
    }
  }
  if (UNPAID_AMOUNT.includes(datatype)) {
    value > 0 ? (color = 'red') : (color = 'green');
  }
  if (ABSENCE_RATE.includes(datatype)) {
    if (value === 0) {
      color = 'green';
      icon = 'check';
    } else if (value > 0 && value <= 10) {
      color = 'yellow';
      icon = 'forbidden';
    } else if (value > 10 && value <= 90) {
      color = 'orange';
      icon = 'exclamation';
    } else {
      color = 'red';
      icon = 'cross';
    }
  }
  if (MARGINAL_VALUE.includes(datatype)) {
    if (value > 0) {
      color = 'green';
      icon = 'check';
    } else {
      color = 'red';
      icon = 'cross';
    }
  }
  if (STOCK.includes(datatype)) {
    if (value < 0) {
      color = 'red';
      icon = 'exclamation';
    } else if (value === 0) {
      color = 'orange';
      icon = 'forbidden';
    } else {
      color = 'green';
      icon = 'check';
    }
  }
  return <ReportChipDisplay color={color} icon={icon} value={translation} />;
};

export default ReportNumberChip;
