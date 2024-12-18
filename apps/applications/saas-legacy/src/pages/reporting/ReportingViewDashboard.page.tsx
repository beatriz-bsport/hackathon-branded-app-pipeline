import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type {
  ReportConfiguration,
  ReportV2QueryParams,
} from '#src/libs/reporting/common/types';
import {
  fetchDefaultReports as fetchDefaultReportsAction,
  fetchReportsV2Paginated as fetchReportsV2PaginatedAction,
} from '#src/libs/reporting/v2/actions';

import type { RootState } from '#src/reducers';

import {
  getReportsV2,
  getReportV2Loading,
  getReportsViewsPaginated,
} from '#src/libs/reporting/v2/selectors';

import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportViewDashboard from '#src/libs/reporting/v2/components/ReportViewDashboard.component';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';

import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const ReportingViewDashboard: React.FC<Props> = ({
  fetchDefaultReports,
  fetchReportsV2Paginated,
  pushRouter,
  reportsV2,
  reportsV2Loading,
  reportViewsPaginated,
}) => {
  useEffect(() => {
    fetchDefaultReports();
    fetchReportsV2Paginated({
      page_size: REPORT_VIEWS_FETCHING_PAGINATION_SIZE,
      ordering: '-updated_at',
    });
  }, [fetchDefaultReports, fetchReportsV2Paginated]);

  const classes = useStyles();

  const handleGoToReport = React.useCallback(
    (reportView: ReportConfiguration) => () => {
      const reportId = reportView.id;
      const categoryName = reportView.category;

      reportId && categoryName
        ? pushRouter(`/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/reporting/views');
    },
    [pushRouter],
  );

  const fetchNextReportViews = React.useCallback(
    (params: ReportV2QueryParams) => {
      fetchReportsV2Paginated(params);
    },
    [fetchReportsV2Paginated],
  );

  if (reportsV2Loading) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.pageContainer}>
      {reportViewsPaginated && (
        <ReportViewDashboard
          handleGoToReport={handleGoToReport}
          onPageRequested={fetchNextReportViews}
          reportViews={reportsV2}
          reportViewsPaginated={reportViewsPaginated}
        />
      )}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    reportsV2: getReportsV2(state),
    reportsV2Loading: getReportV2Loading(state),
    reportViewsPaginated: getReportsViewsPaginated(state),
  }),
  {
    pushRouter: push,
    fetchReportsV2Paginated: fetchReportsV2PaginatedAction,
    fetchDefaultReports: fetchDefaultReportsAction,
  },
);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: `0px ${theme.spacing(2)}px`,
  },
}));

export default compose<any, OwnProps>(
  connector,
  withTranslation('titles'),
  withTitle(({ t }: { t: TFunction }) => t('dashboard.reportingDashboard')),
)(React.memo(ReportingViewDashboard));
