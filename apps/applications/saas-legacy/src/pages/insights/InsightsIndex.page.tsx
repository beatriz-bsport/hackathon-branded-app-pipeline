import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { useHistory } from 'react-router-dom';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { INSIGHTS_ROUTES } from './constants';

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
  const { t } = useTranslation(['b2b_insights']);
  const history = useHistory();
  const isTrialAnalysisEnabled = useSafeFlag(FeatureFlags.TRIAL_ANALYSIS);

  const handleGoToReport = (path: string) => () => {
    history.push(path);
  };

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'report.Payments.invoices.allowed_actions.read',
        'report.Club.subscription.allowed_actions.read',
      ]}
    >
      {([
        hasInvoicesReportPermission,
        hasSubscriptionReportPermission,
      ]: boolean[]) => {
        // Hide entire Insights page if user has neither permission
        if (!hasInvoicesReportPermission && !hasSubscriptionReportPermission) {
          return <div className={classes.pageContainer}></div>;
        }

        return (
          <div className={classes.pageContainer}>
            {isTrialAnalysisEnabled && hasInvoicesReportPermission && (
              <div className={classes.titleContainer}>
                <Typography component="h2" variant="h5">
                  {t('sections.memberInsights')}
                </Typography>
                <Divider className={classes.divider} />
                <div className={classes.sectionItemContainer}>
                  <Card className={classes.card} variant="outlined">
                    <CardActionArea
                      className={classes.cardActionArea}
                      onClick={handleGoToReport(INSIGHTS_ROUTES.TRIAL_ANALYSIS)}
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
            )}

            {hasSubscriptionReportPermission && (
              <div className={classes.titleContainer}>
                <Typography component="h2" variant="h5">
                  {t('sections.financialHealth')}
                </Typography>
                <Divider className={classes.divider} />
                <div className={classes.sectionItemContainer}>
                  <Card className={classes.card} variant="outlined">
                    <CardActionArea
                      className={classes.cardActionArea}
                      onClick={handleGoToReport(
                        INSIGHTS_ROUTES.RECURRING_REVENUE,
                      )}
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
            )}
          </div>
        );
      }}
    </ObjectLevelPermissionProvider>
  );
};

export default InsightsIndex;
