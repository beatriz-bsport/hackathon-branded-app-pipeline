import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/PersonAddDisabled';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { AdditionalGuest } from '../types';

type Props = {
  guestList: Array<AdditionalGuest>;
  onRemoveGuest: (idx: number) => void;
};

const AdditionalGuestList = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {(props.guestList ?? []).map((guest: AdditionalGuest, idx: number) => (
        <div className={classes.row}>
          <IconButton color="primary" onClick={() => props.onRemoveGuest(idx)}>
            <DeleteIcon />
          </IconButton>
          <Typography>{guest.first_name}</Typography>
          <Typography>{guest.last_name}</Typography>
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default AdditionalGuestList;
