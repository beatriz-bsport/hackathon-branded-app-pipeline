import React from 'react';
import { useTheme } from '@material-ui/core';
import { CustomChip } from './CustomChip.component';

type Props = {
  datatype: string;
  value: boolean;
  translation: string;
  grey_no: string[];
  red_no: string[];
  green_no: string[];
};

const ReportBooleanChip: React.FC<Props> = ({
  datatype,
  value,
  translation,
  grey_no,
  green_no,
  red_no,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const red = theme.palette.error;
  let color = null;
  if (grey_no.includes(datatype)) {
    value && (color = green.dark);
  } else if (green_no.includes(datatype)) {
    value ? (color = red.dark) : (color = green.dark);
  } else if (red_no.includes(datatype)) {
    value ? (color = green.dark) : (color = red.dark);
  }
  return <CustomChip mainColor={color} displayedValue={translation} />;
};

export default React.memo(ReportBooleanChip);
