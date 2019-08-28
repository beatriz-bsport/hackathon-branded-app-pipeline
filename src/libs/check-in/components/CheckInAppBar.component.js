// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AppBarMUI from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import type { Theme } from '../../theme/types';

type Props = {
  theme: Theme,
  onSignout: () => void,
  classes: Object,
};

export const CheckInAppBar = (props: Props) => {
  return (
    <AppBarMUI color="default">
      <Toolbar className={props.classes.toolbar}>
        <Avatar src={props.theme.cover} />
        <Typography variant="h5" component="h1">
          {props.theme.company_name}
        </Typography>
        <IconButton onClick={props.onSignout}>
          <PowerSettingsNewIcon />
        </IconButton>
      </Toolbar>
    </AppBarMUI>
  );
};

const styles = () => ({
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default withStyles(styles)(CheckInAppBar);
