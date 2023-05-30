import React from 'react';
import { useTheme } from '@material-ui/core';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

// typing to confirm
type Props = {
  datatype: string;
  value: number;
  translation: string;
  extra_data: any;
};

export const ReportComparisonChip = (props: Props) => {
  const { datatype, value, translation, extra_data } = props;

  const theme = useTheme();
  const green = theme.palette.success;
  const orange = { main: '#FF5C00', dark: '#C94800' };
  const red = theme.palette.error;

  let icon = null;
  let textColor = null;
  let iconColor = null;
  let valueToCompare;

  if (datatype === 'available_credits') {
    valueToCompare = extra_data.total_credits;
  } else {
    valueToCompare = extra_data.price;
  }

  if (value === 0) {
    textColor = green.dark;
    icon = 'CheckCircle';
    iconColor = green.main;
  } else if (value === valueToCompare) {
    textColor = red.dark;
    icon = 'Cancel';
    iconColor = red.main;
  } else {
    textColor = orange.dark;
    icon = 'Error';
    iconColor = orange.main;
  }

  return (
    <ReportChipDisplay
      mainColor={textColor}
      icon={icon}
      iconColor={iconColor}
      value={translation}
    />
  );
};

export default React.memo(ReportComparisonChip);
