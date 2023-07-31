import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import { InfoOutlined } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import chroma from 'chroma-js';

export type OwnProps = {
  content: string;
  className?: string;
  variant?: 'contained' | 'outlined';
};
type Props = OwnProps;
export const InfoBox: React.FC<Props> = ({ content, variant, className }) => {
  const classes = useStyles({ variant });
  return (
    <div className={classNames(classes.blueBox, { [className]: !!className })}>
      <InfoOutlined
        className={classNames(classes.iconLeft, classes.blueIcon)}
      />
      <Typography className={classes.info} variant="body2">
        {content}
      </Typography>
    </div>
  );
};
const useStyles = makeStyles<Theme, Pick<OwnProps, 'variant'>>((theme) => ({
  blueBox: ({ variant }) => {
    return variant === 'contained'
      ? {
          borderRadius: '4px',
          display: 'flex',
          backgroundColor: '#EAF4FC',
          padding: theme.spacing(2),
          alignItems: 'center',
        }
      : {
          borderRadius: '4px',
          display: 'flex',
          border: '1px solid',
          borderColor: 'rgba(33, 150, 243, 1)',
          padding: theme.spacing(2),
          alignItems: 'center',
        };
  },
  info: { color: chroma(theme.palette.info.dark).darken(1.5).hex() },
  blueIcon: {
    color: 'rgba(33, 150, 243, 1)',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));
InfoBox.defaultProps = {
  variant: 'contained',
};
export default InfoBox;
