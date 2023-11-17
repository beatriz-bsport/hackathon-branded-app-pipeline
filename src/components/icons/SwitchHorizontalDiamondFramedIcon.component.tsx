import React from 'react';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import type { SvgIconProps } from '@material-ui/core/SvgIcon';
import chroma from 'chroma-js';
import SwitchHorizontalIcon from './SwitchHorizontalIcon.component';

type Props = {
  displayBackgroundColor?: boolean;
} & SvgIconProps;

const SwitchHorizontalDiamondFramedIcon: React.FC<Props> = ({
  displayBackgroundColor,
  ...iconProps
}) => {
  const classes = useStyles({ displayBackgroundColor });

  return (
    <div className={classes.outline}>
      <div className={classes.content}>
        <SwitchHorizontalIcon
          {...iconProps}
          className={classes.icon}
          fill="#209D82"
        />
      </div>
    </div>
  );
};

SwitchHorizontalDiamondFramedIcon.defaultProps = {
  displayBackgroundColor: false,
};

const useStyles = makeStyles<Theme, { displayBackgroundColor?: boolean }>(
  () => ({
    outline: ({ displayBackgroundColor }) => ({
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '0.2px solid #209D82',
      borderRadius: '2px',
      boxShadow: '1px 2px 0px #209D82',
      transform: 'rotate(-45deg)',
      ...(displayBackgroundColor && {
        backgroundColor: chroma('#209D82').alpha(0.1).hex(),
      }),
    }),

    content: {
      transform: 'rotate(+45deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      height: '11.2px',
    },
  }),
);

export default React.memo(SwitchHorizontalDiamondFramedIcon);
