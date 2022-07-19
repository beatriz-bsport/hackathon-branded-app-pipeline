import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography, Theme } from '@material-ui/core';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

type Props = {
  maxoutInfo: {
    period: 'day' | 'week' | 'month';
    nb: number;
  };
  openModale: (msg: string) => void;
};

const MaxoutInfoMessage = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const maxoutMessage = t(`maxoutInfo.${props.maxoutInfo.period}`, {
    count: props.maxoutInfo.nb,
  });

  return (
    <div className={classes.maxOutExplainContainer}>
      <Hidden xsDown>
        <InfoOutlineIcon className={classes.iconLeft} />
        <Typography variant="body2" className={classes.darkBlue}>
          {maxoutMessage}
        </Typography>
      </Hidden>

      <Hidden smUp>
        <IconButton onClick={() => props.openModale(maxoutMessage)}>
          <InfoOutlineIcon className={classes.iconLeft} />
        </IconButton>
      </Hidden>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  maxOutExplainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.info.main,
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
  },
  darkBlue: {
    color: '#0B79D0',
  },
}));

export default MaxoutInfoMessage;
