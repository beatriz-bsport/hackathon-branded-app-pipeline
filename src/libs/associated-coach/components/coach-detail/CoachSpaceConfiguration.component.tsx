import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper, Switch, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';

type Props = {
  editAccessToCoachSpace: (hasAccessToCoachSpace: boolean) => void;
  hasAccessToCoachSpace: boolean;
};
export const CoachSpaceConfiguration: React.FC<Props> = (props) => {
  const { t } = useTranslation('coach');
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.line}>
        <Typography variant="h6" className={classes.title}>
          {t('detail.coachSpace')}
        </Typography>
        <div className={classes.row}>
          <Switch
            onChange={(ev) => props.editAccessToCoachSpace(ev.target.checked)}
            checked={props.hasAccessToCoachSpace}
          />
          <Typography variant="body1">{t('common:activate')}</Typography>
        </div>
      </div>
      <div className={classes.row}>
        <Info />
        <Typography className={classes.info}>
          {t('detail.coachSpaceInfo')}
        </Typography>
      </div>
    </Paper>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  info: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    borderRadius: '3px',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    height: '100%',
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  title: {
    flex: '1 1 auto',
  },
}));
export default CoachSpaceConfiguration;
