import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import red from '@material-ui/core/colors/red';
import StopIcon from '@material-ui/icons/Stop';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import { ELEMENT_WIDTH } from '#libs/sequential_marketing/constants';

export const ExitStepNodeElement: React.FC = () => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <div className={classes.flexIconAndText}>
          <div className={classes.losange}>
            <StopIcon
              className={classNames(classes.redIcon, classes.centerAbsolute)}
            />
          </div>
          <div>
            <Typography variant="subtitle2">
              {t('cadence.triggers.exit')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExitStepNodeElement);

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: 'relative',
    width: `${ELEMENT_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: '0px 4px 8px 0px #00000014',
    '&:hover': {
      overflow: 'visible',
      boxShadow: '4px 16px 32px 4px #00000014',
    },
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  redIcon: {
    color: red[500],
  },
  losange: {
    backgroundColor: '#FFF0EF',
    transform: 'rotate(45deg)',
    height: '40px',
    width: '40px',
    position: 'relative',
    borderRadius: theme.spacing(0.5),
  },
  flexIconAndText: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%) rotate(-45deg)',
  },
}));
