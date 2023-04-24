// @ts-nocheck
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

type Props = {
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  title?: string;
};

export default function FormToggle(props: Props) {
  return (
    <Grid container direction="row" spacing={2} alignItems="center">
      <Grid item>
        <Switch
          color="primary"
          checked={props.value}
          onChange={(event) => {
            props.onChange(!event.target.checked);
          }}
          disabled={props.disabled}
        />
      </Grid>
      <Grid item>
        <Typography>{props.title}</Typography>
      </Grid>
    </Grid>
  );
}
