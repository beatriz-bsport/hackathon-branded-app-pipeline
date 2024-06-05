import React from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';

import ButtonBase from '@material-ui/core/ButtonBase';
import Chip from '@material-ui/core/Chip';
import MuiIcon from '#src/components/MuiIcon.component';
import { SequentialMarketingColors } from '#src/libs/sequential_marketing/constants';

type Props = {
  isVisible?: boolean;
  isHighlighted?: boolean;
  count?: number;
  onClick?: () => void;
};

export const StepMemberCountChip: React.FC<Props> = ({
  isVisible,
  isHighlighted,
  count,
  onClick,
}) => {
  const classes = useStyles({ isHighlighted });

  const handleClick = React.useCallback(() => {
    onClick();
  }, [onClick]);

  if (!isVisible) {
    return null;
  }

  return (
    <ButtonBase className={classes.button} onClick={handleClick}>
      <Chip
        className={classes.chip}
        icon={<MuiIcon className={classes.icon} icon="People" />}
        label={count?.toString()}
        size="small"
        variant="default"
      />
    </ButtonBase>
  );
};

type StylesProps = {
  isHighlighted?: boolean;
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  button: {
    border: '2px solid',
    borderColor: SequentialMarketingColors.INNER_STEP_BORDER_COLOR,
    borderRadius: theme.spacing(2),
    color: ({ isHighlighted }) =>
      isHighlighted
        ? theme.palette.common.white
        : SequentialMarketingColors.INNER_STEP_COLOR,
    backgroundColor: ({ isHighlighted }) =>
      isHighlighted
        ? SequentialMarketingColors.INNER_STEP_COLOR
        : theme.palette.common.white,
  },
  chip: {
    color: ({ isHighlighted }) =>
      isHighlighted
        ? theme.palette.common.white
        : SequentialMarketingColors.INNER_STEP_COLOR,
    backgroundColor: ({ isHighlighted }) =>
      isHighlighted
        ? SequentialMarketingColors.INNER_STEP_COLOR
        : theme.palette.common.white,
  },
  icon: {
    width: '16px',
    height: '16px',
    color: ({ isHighlighted }) =>
      isHighlighted
        ? theme.palette.common.white
        : SequentialMarketingColors.INNER_STEP_COLOR,
  },
}));

export default React.memo(StepMemberCountChip);
