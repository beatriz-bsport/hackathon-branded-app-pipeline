import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography, Theme } from '@material-ui/core';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Hidden from '@material-ui/core/Hidden';
import ToolTip from '#components/Tooltip.component';

type Props = {
  maxoutInfo: {
    period: 'day' | 'week' | 'month';
    nb: number;
  };
};

const MaxoutInfoMessage = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  return (
    <div className={classes.maxOutExplainContainer}>
      <Hidden xsDown>
        <InfoOutlineIcon className={classes.iconLeft} />
        <Typography variant="body2" className={classes.darkBlue}>
          {t(`maxoutInfo.${props.maxoutInfo.period}`, {
            count: props.maxoutInfo.nb,
          })}
        </Typography>
      </Hidden>

      <Hidden smUp>
        <ToolTip
          title={t(`maxoutInfo.${props.maxoutInfo.period}`, {
            count: props.maxoutInfo.nb,
          })}
          placement="left"
        >
          <span>
            <InfoOutlineIcon className={classes.iconLeft} />
          </span>
        </ToolTip>
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
  },
  darkBlue: {
    color: '#0B79D0',
  },
}));

export default MaxoutInfoMessage;
