import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Info } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';

type OwnProps = {
  content: string;
  variant?: Variant;
};
type Props = OwnProps;
export const InfoTypography: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.infoRow}>
      <Info />
      <Typography
        className={classes.grey}
        variant={props.variant ? props.variant : 'body2'}
      >
        {props.content}
      </Typography>
    </div>
  );
};
InfoTypography.defaultProps = {
  content: '',
};
const useStyles = makeStyles<Theme>((theme) => ({
  grey: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  infoRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}));
export default InfoTypography;
