import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import type { SvgIconProps } from '@material-ui/core/SvgIcon';
import SwitchHorizontalIcon from './SwitchHorizontalIcon.component';

const SwitchHorizontalSquareFramedIcon: React.FC<SvgIconProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.outline}>
      <SwitchHorizontalIcon
        {...props}
        className={classes.icon}
        fill="#209D82"
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  outline: {
    width: '24px',
    height: '24px',
    border: '0.2px solid #209D82',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0.5px 0.5px 0px #209D82',
  },
  icon: {
    height: '16px',
  },
}));

export default React.memo(SwitchHorizontalSquareFramedIcon);
