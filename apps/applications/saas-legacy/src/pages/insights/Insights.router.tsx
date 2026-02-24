import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import InsightsIndex from '#src/pages/insights/InsightsIndex.page';
import TrialAnalysis from '#src/pages/trial-analysis/TrialAnalysis.page';
import SubscriptionEvents from '#src/pages/subscription-events/SubscriptionEvents.page';
import BookingsInsight from '#src/pages/bookings-insight/BookingsInsight.page';
import ScheduleAnalysis from '#src/pages/schedule-analysis/ScheduleAnalysis.page';
import CommunityHealth from '#src/pages/community-health/CommunityHealth.page';
import { INSIGHTS_ROUTES, INSIGHTS_TRANSLATION_NAMESPACES } from './constants';

type Props = {};

// Wrap each component with its specific title
const InsightsIndexWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.insights.title')),
)(InsightsIndex);

const TrialAnalysisWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.trialAnalysis.title')),
)(TrialAnalysis);

const SubscriptionEventsWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.recurringRevenue.title')),
)(SubscriptionEvents);

const BookingsInsightWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.bookingInsight.title')),
)(BookingsInsight);

const ScheduleAnalysisWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.scheduleAnalysis.title')),
)(ScheduleAnalysis);

const CommunityHealthWithTitle = compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('b2b_insights:pages.communityHealth.title')),
)(CommunityHealth);

const InsightsRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        component={InsightsIndexWithTitle}
        path={INSIGHTS_ROUTES.INDEX}
      />
      <Route
        exact
        component={TrialAnalysisWithTitle}
        path={INSIGHTS_ROUTES.TRIAL_ANALYSIS}
      />
      <Route
        exact
        component={SubscriptionEventsWithTitle}
        path={INSIGHTS_ROUTES.RECURRING_REVENUE}
      />
      <Route
        exact
        component={BookingsInsightWithTitle}
        path={INSIGHTS_ROUTES.BOOKING_INSIGHT}
      />
      <Route
        exact
        component={ScheduleAnalysisWithTitle}
        path={INSIGHTS_ROUTES.SCHEDULE_ANALYSIS}
      />
      <Route
        exact
        component={CommunityHealthWithTitle}
        path={INSIGHTS_ROUTES.COMMUNITY_HEALTH}
      />
      <Redirect to={INSIGHTS_ROUTES.INDEX} />
    </Switch>
  );
};

export default InsightsRouter;
