// @ts-nocheck
import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CheckCircleOutline } from '@material-ui/icons';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import chroma from 'chroma-js';

type OwnProps = { content: string };
type Props = OwnProps;
export const SuccessBox: React.FC<Props> = ({ content }) => {
  const classes = useStyles();
  return (
    <div className={classes.primaryBox}>
      <CheckCircleOutline
        className={classNames(classes.iconLeft, classes.succesIcon)}
      />
      <Typography className={classes.succesText} variant="body2">
        {content}
      </Typography>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  primaryBox: {
    borderRadius: '4px',
    display: 'flex',
    backgroundColor: chroma(theme.palette.success.main).alpha(0.1).hex(),
    padding: theme.spacing(2),
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  succesText: { color: theme.palette.primary.dark },
  succesIcon: { color: theme.palette.success.main },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));
export default SuccessBox;
