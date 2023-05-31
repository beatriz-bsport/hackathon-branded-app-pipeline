import React from 'react';
import { useTheme } from '@material-ui/core';
import { ReportChipDisplay } from '#libs/reporting/components/ReportChips/ReportChipDisplay.component';

// typing to confirm
type Props = {
  datatype: string;
  value: number;
  translation: string;
  extra_data: { [key: string]: number };
};

const ReportComparisonChip: React.FC<Props> = ({
  datatype,
  value,
  translation,
  extra_data,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const orange = { main: '#FF5C00', dark: '#C94800' };
  const red = theme.palette.error;

  let icon: string;
  let textColor: string;
  let iconColor: string;

  const valueToCompare =
    datatype === 'available_credits'
      ? extra_data.total_credits
      : extra_data.price;

  switch (value) {
    case 0:
      textColor = green.dark;
      icon = 'CheckCircle';
      iconColor = green.main;
      break;
    case valueToCompare:
      textColor = red.dark;
      icon = 'Cancel';
      iconColor = red.main;
      break;
    default:
      textColor = orange.dark;
      icon = 'Error';
      iconColor = orange.main;
      break;
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

export default React.memo(ReportComparisonChip);
