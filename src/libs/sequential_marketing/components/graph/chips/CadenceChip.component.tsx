import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { CustomChip } from '#components/chip/CustomChip.component';
import { CADENCE_CHIP_MAX_SIZE } from '#libs/sequential_marketing/constants/steps';

export type CadenceChipProps = {
  name: string;
  icon: string;
  color: string;
  withBackground?: boolean;
  blackText?: boolean;
};

export const CadenceChip: React.FC<CadenceChipProps> = ({
  name,
  icon,
  color,
  withBackground = true,
  blackText,
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
        withBackground={withBackground}
        blackText={blackText}
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
