import React from 'react';
import { useTheme } from '@material-ui/core';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

type Props = {
  datatype: string;
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

const ReportNumberChip: React.FC<Props> = ({
  datatype,
  value,
  translation,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const yellow = { main: '#FF9800', dark: '#C77700' };
  const orange = { main: '#FF5C00', dark: '#C94800' };
  const red = theme.palette.error;
  let icon: string;
  let textColor: string;
  let iconColor: string;
  if (ATTENDANCE_RATE.includes(datatype)) {
    if (value === 0) {
      textColor = red.dark;
      icon = 'Cancel';
      iconColor = red.main;
    } else if (value > 0 && value <= 50) {
      textColor = orange.dark;
      icon = 'Error';
      iconColor = orange.main;
    } else if (value > 50 && value <= 90) {
      textColor = yellow.dark;
      icon = 'RemoveCircle';
      iconColor = yellow.main;
    } else {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    }
  }
  if (CREDITS.includes(datatype)) {
    if (value >= 0) {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    } else {
      textColor = yellow.dark;
      icon = 'Warning';
      iconColor = yellow.main;
    }
  }
  if (CARDS_NOT_ACTIVATED.includes(datatype)) {
    if (value > 0) {
      textColor = red.dark;
      icon = 'Error';
      iconColor = red.main;
    } else {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    }
  }
  if (UNPAID_AMOUNT.includes(datatype)) {
    value > 0 ? (textColor = red.dark) : (textColor = green.dark);
  }
  if (ABSENCE_RATE.includes(datatype)) {
    if (value === 0) {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    } else if (value > 0 && value <= 10) {
      textColor = yellow.dark;
      icon = 'RemoveCircle';
      iconColor = yellow.main;
    } else if (value > 10 && value <= 90) {
      textColor = orange.dark;
      icon = 'Error';
      iconColor = orange.main;
    } else {
      textColor = red.dark;
      icon = 'Cancel';
      iconColor = red.main;
    }
  }
  if (MARGINAL_VALUE.includes(datatype)) {
    if (value > 0) {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    } else {
      textColor = red.dark;
      icon = 'Cancel';
      iconColor = red.main;
    }
  }
  if (STOCK.includes(datatype)) {
    if (value < 0) {
      textColor = red.dark;
      icon = 'Error';
      iconColor = red.main;
    } else if (value === 0) {
      textColor = orange.dark;
      icon = 'RemoveCircle';
      iconColor = orange.main;
    } else {
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
    }
  }
  return (
    <ReportChipDisplay
      mainColor={textColor}
      icon={icon}
      iconColor={iconColor}
      displayedValue={translation}
    />
  );
};

export default React.memo(ReportNumberChip);
