import React from 'react';

import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

type Props = {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

const useStyles = makeStyles((theme) => ({
  chipEnabled: {
    borderColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
  },
  enabledIcon: {
    color: theme.palette.primary.dark,
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
}) => {
  const classes = useStyles();

  return (
    <Chip
      clickable
      className={enabled ? classes.chipEnabled : classes.chipDisabled}
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
  );
};

export default React.memo(PartnershipOfferChip);
