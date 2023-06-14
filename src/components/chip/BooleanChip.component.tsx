import React from 'react';
import { useTheme } from '@material-ui/core';
import { CustomChip } from './CustomChip.component';

type Props = {
  value: boolean;
  translation: string;
  colorBlacklist: string;
  colorsInverted: boolean;
};

const ReportBooleanChip: React.FC<Props> = ({
  value,
  translation,
  colorBlacklist,
  colorsInverted,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const red = theme.palette.error;
  let color = null;
  switch (colorBlacklist) {
    case 'grey':
      if (!colorsInverted) {
        color = value ? green.main : red.main;
      } else {
        color = value ? red.main : green.main;
      }
      break;
    case 'green':
      if (!colorsInverted) {
        color = value ? null : red.main;
      } else {
        color = value ? red.main : null;
      }
      break;
    case 'red':
      if (!colorsInverted) {
        color = value ? green.main : null;
      } else {
        color = value ? null : green.main;
      }
      break;
    default:
      color = value ? green.main : red.main;
      break;
  }
  return <CustomChip mainColor={color} displayedValue={translation} />;
};

export default React.memo(ReportBooleanChip);
