import React from 'react';

import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import Tooltip from '#src/components/Tooltip.component';

type Props = {
  disabled?: boolean;
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  tooltipTitle?: React.ReactNode;
};

const useStyles = makeStyles((theme) => ({
  chipEnabled: {
    borderColor: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
  },
  enabledIcon: {
    color: theme.palette.secondary.dark,
  },
  chipDisabled: {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.text.secondary,
    '& .MuiChip-icon': {
      color: theme.palette.action.disabled,
    },
  },
}));

const PartnershipOfferChip: React.FC<Props> = ({
  label,
  enabled,
  onChange,
  disabled = false,
  tooltipTitle,
}) => {
  const classes = useStyles();

  const chip = (
    <span style={{ display: 'inline-block' }}>
      <Chip
        clickable
        className={enabled ? classes.chipEnabled : classes.chipDisabled}
        disabled={disabled}
        icon={
          enabled ? (
            <CheckCircleIcon className={classes.enabledIcon} />
          ) : (
            <RadioButtonUncheckedIcon />
          )
        }
        label={label}
        onClick={() => onChange(!enabled)}
        variant="outlined"
      />
    </span>
  );

  if (tooltipTitle) {
    return <Tooltip title={tooltipTitle}>{chip}</Tooltip>;
  }

  return chip;
};

export default React.memo(PartnershipOfferChip);
