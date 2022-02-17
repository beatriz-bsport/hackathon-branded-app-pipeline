import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import '../../login/components/Login.css';
import { Button, Typography } from '@material-ui/core';
import classNames from 'classnames';
import chroma from 'chroma-js';
import { getTextColorFromRGB } from '../../../utils/color';

type Props = {
  disconnect: () => void;
  goToConsumerSpace: () => void;
  goToCoachSpace: () => void;
};
export const ConsumerCoachSpaceSelector: React.FC<Props> = (props) => {
  const { t } = useTranslation('coach');
  const classes = useStyles();
  const { disconnect, goToConsumerSpace, goToCoachSpace } = props;
  return (
    <div className={classes.container}>
      <div className={classes.column}>
        <Typography variant="h4" className={classes.connection}>
          {t('coachAccess.access')}
        </Typography>
        <div className={classNames(classes.rectangle, 'reactangle-animated')} />
      </div>
      <Typography className={classes.info} variant="body1">
        {t('coachAccess.info')}
      </Typography>
      <Button
        className={classes.studentButton}
        onClick={() => goToConsumerSpace()}
      >
        {t('coachAccess.student')}
      </Button>
      <Button
        variant="outlined"
        className={classes.coachButton}
        color="primary"
        onClick={() => goToCoachSpace()}
      >
        {t('coachAccess.teacher')}
      </Button>
      <div className={classes.divider} />
      <div className={classes.columnInfo}>
        <Typography>{t('common:disconnectInfo')}</Typography>
        <Button
          onClick={() => disconnect()}
          className={classes.disconnectButton}
        >
          {t('common:disconnect')}
        </Button>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
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
  connection: { fontWeight: 700 },
  studentButton: {
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.1)} 88.6%)`,
    color: getTextColorFromRGB(theme.palette.primary.main),
    borderRadius: '8px',
    width: theme.spacing(51),
    height: theme.spacing(6),
  },
  coachButton: {
    borderRadius: '8px',
    width: theme.spacing(51),
    height: theme.spacing(6),
  },
  info: {
    color: 'rgba(0, 0, 0, 0.7)',
    width: theme.spacing(51),
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  divider: {
    width: theme.spacing(34),
    borderTop: '1px solid rgba(0, 0, 0, 0.13)',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
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
export default ConsumerCoachSpaceSelector;
