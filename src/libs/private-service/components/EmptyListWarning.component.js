// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

type Props = {
  classes: Object,
  text: string,
};

const EmptyListWarning = (props: Props) => (
  <div className={props.classes.warningEmptyList}>
    <WarningIcon color="error" className={props.classes.leftIcon} />
    <Typography>{props.text}</Typography>
  </div>
);
const styles = (theme) => ({
  warningEmptyList: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
});

export default withStyles(styles)(EmptyListWarning);
