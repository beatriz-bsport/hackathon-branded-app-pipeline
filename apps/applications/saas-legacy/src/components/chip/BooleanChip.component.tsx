import React from 'react';
import { useTheme } from '@material-ui/core';
import CustomChip from './CustomChip.component';

type Props = {
  value: boolean;
  translation: string;
  colorBlacklist: string;
  colorsInverted?: boolean;
  chipClass?: string;
};

const ReportBooleanChip: React.FC<Props> = ({
  value,
  translation,
  colorBlacklist,
  colorsInverted,
  chipClass,
}) => {
  const theme = useTheme();
  const green = theme.palette.success;
  const red = theme.palette.error;
  let color = null;
  switch (colorBlacklist) {
    case 'grey':
      if (!colorsInverted) {
        color = value ? green.dark : red.dark;
      } else {
        color = value ? red.dark : green.dark;
      }
      break;
    case 'green':
      if (!colorsInverted) {
        color = value ? null : red.dark;
      } else {
        color = value ? red.dark : null;
      }
      break;
    case 'red':
      if (!colorsInverted) {
        color = value ? green.dark : null;
      } else {
        color = value ? null : green.dark;
      }
      break;
    default:
      color = value ? green.dark : red.dark;
      break;
  }
  return (
    <CustomChip
      chipClass={chipClass}
      displayedValue={translation}
      mainColor={color}
    />
  );
};

export default React.memo(ReportBooleanChip);
