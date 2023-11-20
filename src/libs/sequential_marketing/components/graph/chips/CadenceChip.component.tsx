import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { CustomChip } from '#components/chip/CustomChip.component';
import { CADENCE_CHIP_MAX_SIZE } from '#libs/sequential_marketing/constants/steps';

type CadenceChipProps = {
  name: string;
  icon: string;
  color: string;
  toolTip?: boolean;
  toolTipValue?: string;
  withBackgroundOnHover?: boolean;
  disabled?: boolean;
};

export const CadenceChip: React.FC<CadenceChipProps> = ({
  name,
  icon,
  color,
  toolTip,
  toolTipValue,
  withBackgroundOnHover,
  disabled,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.customChip}>
      <CustomChip
        blackText
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
    </div>
  );
};

const useStyles = makeStyles(() => ({
  customChip: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
}));

export default React.memo(CadenceChip);
