import React, { useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';
import {
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
import { getObjectPermissions } from '#src/libs/role/selectors';

import withTitle from '#src/hocs/with-title.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportViewDashboard from '#src/libs/reporting/v2/components/ReportViewDashboard.component';

import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportViewDashboard: React.FC<Props> = ({
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
        ? pushRouter(`/f/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/f/reporting/views');
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
      <ReportViewDashboard
        handleGoToReport={handleGoToReport}
        onPageRequested={fetchNextReportViews}
        reportViews={reportsV2}
        reportViewsPaginated={reportViewsPaginated}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    objectLevelPermissions: getObjectPermissions(state),
    reportsV2: getReportsV2(state),
    reportsV2Loading: getReportV2Loading(state),
    reportViewsPaginated: getReportsViewsPaginated(state),
  }),
  {
    pushRouter: push,
    fetchDefaultReports: fetchDefaultReportsAction,
    fetchReportsV2Paginated: fetchReportsV2PaginatedAction,
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
)(React.memo(FranchiseReportViewDashboard));
