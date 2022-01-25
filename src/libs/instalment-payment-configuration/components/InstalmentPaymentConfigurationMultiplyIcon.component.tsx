import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { getTextColorFromRGB } from '../../../utils/color';

type OwnProps = { multiplyFactor: number };

type Props = OwnProps;

export const InstalmentPaymentMultiplyIcon: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.typo}>
        {`${props.multiplyFactor}x`}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  typo: {
    color: getTextColorFromRGB(theme.palette.primary.main),
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },

  container: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px 12px',
    borderRadius: '4px',
  },
}));
export default InstalmentPaymentMultiplyIcon;
