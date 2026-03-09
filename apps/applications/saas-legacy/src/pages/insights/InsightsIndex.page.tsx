import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { HasSubscriptionsProvider } from '#src/hooks/useHasSubscriptions';
import {
  hasInsightsForEssentialAccess,
  hasPremiumInsightsAccess,
} from '#src/pages/insights/utils/premium-insights';
import type { RootState } from '#src/reducers';
import { INSIGHTS_ROUTES } from './constants';
import InsightCard from './components/InsightCard';

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
}));

const InsightsIndex: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation(['b2b_insights']);
  const history = useHistory();
  const featureList = useSelector(
    (state: RootState) => state.company.feature.data,
  );
  const hasPremiumInsights = hasPremiumInsightsAccess(featureList);
  const hasInsightsForEssential = hasInsightsForEssentialAccess(featureList);
  const isTrialAnalysisEnabled = useSafeFlag(FeatureFlags.TRIAL_ANALYSIS);
  const isScheduleAnalysisInsightEnabled = useSafeFlag(
    FeatureFlags.SCHEDULE_ANALYSIS,
  );
  const isBookingInsightEnabled = useSafeFlag(FeatureFlags.BOOKING);
  const isCommunityHealthEnabled = useSafeFlag(FeatureFlags.COMMUNITY_HEALTH);

  const handleGoToReport = (path: string) => () => {
    history.push(path);
  };

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'report.Payments.invoices.allowed_actions.read',
        'report.Club.subscription.allowed_actions.read',
        'report.Club.members_purchase.allowed_actions.read',
        'report.Bookings.bookings.allowed_actions.read',
      ]}
    >
      {([
        hasInvoicesReportPermission,
        hasSubscriptionReportPermission,
        hasMembersPurchaseReportPermission,
        hasBookingsReportPermission,
      ]: boolean[]) => {
        // Hide entire Insights page if user has neither permission
        const hasTrialAnalysisAccess =
          isTrialAnalysisEnabled && hasInvoicesReportPermission;
        const hasCommunityHealthAccess =
          isCommunityHealthEnabled &&
          hasPremiumInsights &&
          hasMembersPurchaseReportPermission;
        const hasScheduleAnalysisAccess =
          isScheduleAnalysisInsightEnabled &&
          hasBookingsReportPermission &&
          hasInsightsForEssential;
        const hasBookingInsightAccess =
          isBookingInsightEnabled && hasBookingsReportPermission;
        if (
          !hasInvoicesReportPermission &&
          !hasSubscriptionReportPermission &&
          !hasTrialAnalysisAccess &&
          !hasCommunityHealthAccess &&
          !hasScheduleAnalysisAccess &&
          !hasBookingInsightAccess
        ) {
          return <div className={classes.pageContainer}></div>;
        }

        return (
          <HasSubscriptionsProvider enabled={hasSubscriptionReportPermission}>
            {({ hasSubscriptions }) => (
              <div className={classes.pageContainer}>
                {hasTrialAnalysisAccess || hasCommunityHealthAccess ? (
                  <div className={classes.titleContainer}>
                    <Typography component="h2" variant="h5">
                      {t('sections.memberInsights')}
                    </Typography>
                    <Divider className={classes.divider} />
                    <div className={classes.sectionItemContainer}>
                      {hasTrialAnalysisAccess ? (
                        <InsightCard
                          description={t('trackTrialOffer.description')}
                          onClick={handleGoToReport(
                            INSIGHTS_ROUTES.TRIAL_ANALYSIS,
                          )}
                          title={t('trackTrialOffer.title')}
                        />
                      ) : null}

                      {hasCommunityHealthAccess ? (
                        <InsightCard
                          description={t('monitorCommunityHealth.description')}
                          onClick={handleGoToReport(
                            INSIGHTS_ROUTES.COMMUNITY_HEALTH,
                          )}
                          title={t('monitorCommunityHealth.title')}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {hasSubscriptionReportPermission && hasSubscriptions && (
                  <div className={classes.titleContainer}>
                    <Typography component="h2" variant="h5">
                      {t('sections.financialHealth')}
                    </Typography>
                    <Divider className={classes.divider} />
                    <div className={classes.sectionItemContainer}>
                      <InsightCard
                        description={t('monitorRevenue.description')}
                        onClick={handleGoToReport(
                          INSIGHTS_ROUTES.RECURRING_REVENUE,
                        )}
                        title={t('monitorRevenue.title')}
                      />
                    </div>
                  </div>
                )}

                {(hasBookingInsightAccess || hasScheduleAnalysisAccess) && (
                  <div className={classes.titleContainer}>
                    <Typography component="h2" variant="h5">
                      {t('sections.bookings')}
                    </Typography>
                    <Divider className={classes.divider} />
                    <div className={classes.sectionItemContainer}>
                      {hasBookingInsightAccess ? (
                        <InsightCard
                          description={t('monitorBookings.description')}
                          onClick={handleGoToReport(
                            INSIGHTS_ROUTES.BOOKING_INSIGHT,
                          )}
                          title={t('monitorBookings.title')}
                        />
                      ) : null}
                      {hasScheduleAnalysisAccess ? (
                        <InsightCard
                          description={t('monitorSchedule.description')}
                          onClick={handleGoToReport(
                            INSIGHTS_ROUTES.SCHEDULE_ANALYSIS,
                          )}
                          title={t('monitorSchedule.title')}
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}
          </HasSubscriptionsProvider>
        );
      }}
    </ObjectLevelPermissionProvider>
  );
};

export default InsightsIndex;
