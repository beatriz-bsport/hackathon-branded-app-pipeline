import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import chroma from 'chroma-js';
import MuiIcon from '../../../../components/MuiIcon.component';

type Props = {
  icon: string;
  color: string;
};

type StyleProps = {
  color: string;
};

export const TagCircle = (props: Props) => {
  const { icon, color } = props;

  const styleProps = {
    color: chroma(color).luminance() > 0.5 ? '#000000' : '#ffffff',
  };

  const classes = useStyles(styleProps);

  return (
    <>
      <MuiIcon icon={icon} className={classes.icon} />
    </>
  );
};
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  icon: (props) => ({
    width: theme.spacing(1.4),
    height: theme.spacing(1.4),
    color: props.color,
  }),
}));
export default TagCircle;
