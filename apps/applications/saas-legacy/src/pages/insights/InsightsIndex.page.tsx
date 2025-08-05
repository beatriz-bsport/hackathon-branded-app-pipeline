import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import CardSectionItem from '#src/components/CardSectionItem.component';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
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
}));

const InsightsIndex: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('insights');
  const history = useHistory();

  const handleGoToReport = (path: string) => () => {
    history.push(path);
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.root}>
        <Typography variant="h6">{t('sections.memberInsights')}</Typography>
        <div className={classes.sectionItemContainer}>
          <CardSectionItem
            title={t('memberInsights.trialAnalysisFranchise.title')}
            description={t('memberInsights.trialAnalysisFranchise.description')}
            onCardClick={handleGoToReport('/trial-analysis/franchise/sigma')}
          />
          <CardSectionItem
            title={t('memberInsights.trialAnalysisCompany.title')}
            description={t('memberInsights.trialAnalysisCompany.description')}
            onCardClick={handleGoToReport('/trial-analysis/company/sigma')}
          />
          <CardSectionItem
            title={t('memberInsights.subscriptionEvents.title')}
            description={t('memberInsights.subscriptionEvents.description')}
            onCardClick={handleGoToReport('/subscription-events/sigma')}
          />
        </div>
      </div>

      <div className={classes.root}>
        <Typography variant="h6">{t('sections.performance')}</Typography>
        <div className={classes.sectionItemContainer}>
          <CardSectionItem
            title={t('performance.booking.title')}
            description={t('performance.booking.description')}
            onCardClick={handleGoToReport('/analytics')}
          />
          <CardSectionItem
            title={t('performance.teacher.title')}
            description={t('performance.teacher.description')}
            onCardClick={handleGoToReport('/analytics')}
          />
          <CardSectionItem
            title={t('performance.financial.title')}
            description={t('performance.financial.description')}
            onCardClick={handleGoToReport('/analytics')}
          />
          <CardSectionItem
            title={t('performance.marketing.title')}
            description={t('performance.marketing.description')}
            onCardClick={handleGoToReport('/analytics')}
          />
        </div>
      </div>
    </div>
  );
};

export default InsightsIndex;
