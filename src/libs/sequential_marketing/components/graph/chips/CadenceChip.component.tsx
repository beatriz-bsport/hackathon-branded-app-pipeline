import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { CustomChip } from '#components/chip/CustomChip.component';
import { CADENCE_CHIP_MAX_SIZE } from '#libs/sequential_marketing/constants/steps';

export type CadenceChipProps = {
  name: string;
  icon: string;
  color: string;
  toolTipValue?: string;
  withBackgroundOnHover?: boolean;
};

export const CadenceChip: React.FC<CadenceChipProps> = ({
  name,
  icon,
  color,
  toolTipValue,
  withBackgroundOnHover,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.customChip}>
      <CustomChip
        displayedValue={name}
        mainColor={color}
        icon={icon}
        iconColor={color}
        maxWidth={CADENCE_CHIP_MAX_SIZE}
        toolTipValue={toolTipValue}
        withBackgroundOnHover={withBackgroundOnHover}
        blackText
        toolTip
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
