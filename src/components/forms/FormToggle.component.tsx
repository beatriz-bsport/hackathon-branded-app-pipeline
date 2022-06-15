import React from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

type Props = {
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  title?: string;
};

export default function FormToggle(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.item}>
        <Switch
          color="primary"
          checked={props.value}
          onChange={(event) => {
            props.onChange(!event.target.checked);
          }}
          disabled={props.disabled}
        />
      </div>
      <div className={classes.item}>
        <Typography>{props.title}</Typography>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(-1),
  },
  item: {
    padding: theme.spacing(1),
  },
}));
