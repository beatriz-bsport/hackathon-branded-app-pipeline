// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';

import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

// TODO: COMPLETLY REDO THIS COMPONENT. NEED PRODUCT.
export const CadenceHowTo: React.FC = () => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h6" className={classes.paddingBottom3}>
        {t('cadence.howTo.title')}
      </Typography>
      <div className={classes.explain}>
        <div className={classes.alertContainer}>
          <Alert severity="info" className={classes.alert}>
            {t('cadence.howTo.explain')}
          </Alert>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  subSection: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontWeight: 500,
  },
  paddingTop2: {
    paddingTop: theme.spacing(2),
  },
  paddingBottom2: {
    paddingBottom: theme.spacing(2),
  },
  paddingBottom3: {
    paddingBottom: theme.spacing(3),
  },
  alertContainer: {
    paddingBottom: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
  explain: {
    height: '800px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
}));

export default CadenceHowTo;
