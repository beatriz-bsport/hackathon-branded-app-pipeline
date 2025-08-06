import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  titleContainer: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  sectionItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  card: {
    display: 'flex',
  },
  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
}));

const InsightsIndex: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation(['insights']);
  const history = useHistory();

  const handleGoToReport = (path: string) => () => {
    history.push(path);
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.titleContainer}>
        <Typography component="h2" variant="h5">
          {t('sections.memberInsights')}
        </Typography>
        <Divider className={classes.divider} />
        <div className={classes.sectionItemContainer}>
          <Card className={classes.card} variant="outlined">
            <CardActionArea
              className={classes.cardActionArea}
              onClick={handleGoToReport('/insights/trial_analysis')}
            >
              <Typography color="textPrimary" variant="body1">
                {t('trackTrialOffer.title')}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {t('trackTrialOffer.description')}
              </Typography>
            </CardActionArea>
          </Card>
        </div>
      </div>

      <div className={classes.titleContainer}>
        <Typography component="h2" variant="h5">
          {t('sections.financialHealth')}
        </Typography>
        <Divider className={classes.divider} />
        <div className={classes.sectionItemContainer}>
          <Card className={classes.card} variant="outlined">
            <CardActionArea
              className={classes.cardActionArea}
              onClick={handleGoToReport('/insights/recurring_revenue')}
            >
              <Typography color="textPrimary" variant="body1">
                {t('monitorRevenue.title')}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {t('monitorRevenue.description')}
              </Typography>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsightsIndex;
