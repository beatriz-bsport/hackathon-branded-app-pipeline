import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { getTextColorFromRGB } from '../../../utils/color';

import '#src/components/css-only/Login/styles.css';

type Props = {
  disconnect: () => void;
  goToConsumerSpace: () => void;
  goToCoachSpace: () => void;
};
export const ConsumerCoachSpaceSelector: React.FC<Props> = ({
  disconnect,
  goToConsumerSpace,
  goToCoachSpace,
}) => {
  const { t } = useTranslation('coach');
  const classes = useStyles();

  const handleGoToConsumerSpace = React.useCallback(
    () => goToConsumerSpace(),
    [goToConsumerSpace],
  );

  const handleGoToCoachSpace = React.useCallback(
    () => goToCoachSpace(),
    [goToCoachSpace],
  );

  const handleDisconnect = React.useCallback(() => disconnect(), [disconnect]);

  return (
    <div className={classes.container}>
      <div className={classes.column}>
        <Typography className={classes.connection} variant="h4">
          {t('coachAccess.access')}
        </Typography>
        <div className={clsx(classes.rectangle, 'reactangle-animated')} />
      </div>
      <div className={classes.infoContainer}>
        <Typography className={classes.info} variant="body1">
          {t('coachAccess.info')}
        </Typography>
      </div>
      <Button
        className={classes.studentButton}
        onClick={handleGoToConsumerSpace}
      >
        {t('coachAccess.student')}
      </Button>
      <Button
        className={classes.coachButton}
        color="primary"
        onClick={handleGoToCoachSpace}
        variant="outlined"
      >
        {t('coachAccess.teacher')}
      </Button>
      <div className={classes.divider} />
      <div className={classes.columnInfo}>
        <Typography>{t('common:disconnectInfo')}</Typography>
        <Button className={classes.disconnectButton} onClick={handleDisconnect}>
          {t('common:disconnect')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  rectangle: {
    height: 5,
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.1)} 88.6%)`,
    width: 146,
  },
  disconnectButton: {
    border: '1px solid #4D4D4D',
    borderRadius: '42px',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  connection: {
    fontWeight: 700,
  },
  studentButton: {
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.1)} 88.6%)`,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    borderRadius: '8px',
    maxWidth: '408px',
    width: '100%',
    height: theme.spacing(6),
  },
  coachButton: {
    borderRadius: '8px',
    maxWidth: '408px',
    width: '100%',
    height: theme.spacing(6),
  },
  infoContainer: {
    maxWidth: '408px',
    width: '100%',
    display: 'flex',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  info: {
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  divider: {
    width: '146px',
    borderTop: '1px solid rgba(0, 0, 0, 0.13)',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    width: '100%',
    padding: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default React.memo(ConsumerCoachSpaceSelector);
