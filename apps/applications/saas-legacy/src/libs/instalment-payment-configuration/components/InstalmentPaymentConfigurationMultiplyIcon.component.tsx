import React from 'react';
import chroma from 'chroma-js';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { getTextColorFromRGB } from '../../../utils/color';

type Props = { multiplyFactor: number; unselectable?: boolean };

export const InstalmentPaymentMultiplyIcon: React.FC<Props> = ({
  multiplyFactor,
  unselectable,
}) => {
  const classes = useStyles({ unselectable });

  return (
    <div className={classes.container}>
      <Typography className={classes.typo} variant="subtitle1">
        {`${multiplyFactor}x`}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles<Theme, { unselectable?: boolean }>((theme) => ({
  typo: {
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },

  container: ({ unselectable }) => ({
    backgroundColor: unselectable
      ? chroma(theme.palette.primary.main).alpha(0.1).hex()
      : theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px 12px',
    borderRadius: '4px',
  }),
}));

export default React.memo(InstalmentPaymentMultiplyIcon);
