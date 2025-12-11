import React from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/styles/makeStyles';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import { CADENCE_CHIP_MAX_SIZE } from '#src/libs/sequential_marketing/constants/steps';

type CadenceChipProps = {
  name: string;
  icon: string;
  color: string;
  isClickable?: boolean;
  toolTip?: boolean;
  toolTipValue?: string;
  withBackgroundOnHover?: boolean;
  disabled?: boolean;
  autoOverflow?: boolean;
};

export const CadenceChip: React.FC<CadenceChipProps> = ({
  name,
  icon,
  color,
  isClickable,
  toolTip,
  toolTipValue,
  withBackgroundOnHover,
  disabled,
  autoOverflow,
}) => {
  const classes = useStyles();

  return (
    <CustomChip
      blackText
      autoOverflow={autoOverflow}
      chipClass={clsx(classes.customChip, {
        [classes.clickableChip]: isClickable,
      })}
      disabled={disabled}
      displayedValue={name}
      icon={icon}
      iconColor={color}
      mainColor={color}
      maxWidth={CADENCE_CHIP_MAX_SIZE}
      toolTip={toolTip}
      toolTipValue={toolTipValue}
      withBackgroundOnHover={withBackgroundOnHover}
    />
  );
};

const useStyles = makeStyles(() => ({
  customChip: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: 'fit-content',
    overflow: 'auto',
  },
  clickableChip: {
    cursor: 'pointer',
  },
}));

export default React.memo(CadenceChip);
