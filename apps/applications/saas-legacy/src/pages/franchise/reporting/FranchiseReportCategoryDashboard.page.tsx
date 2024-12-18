import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import makeStyles from '@material-ui/core/styles/makeStyles';

import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import {
  fetchReportMetadata as fetchReportMetadataAction,
  fetchDefaultReports as fetchDefaultReportsAction,
} from '#src/libs/reporting/v2/actions';

import {
  getDefaultReportsV2,
  getReportCategoriesMetadata,
  getReportV2Loading,
} from '#src/libs/reporting/v2/selectors';

import { getLastVisitedReportV2 } from '#src/libs/user-preference/selectors';
import { RootState } from '#src/reducers';
import { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';
import ReportCategoryDashboard from '#src/libs/reporting/v2/components/ReportCategoryDashboard.component';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportList: React.FC<Props> = ({
  fetchDefaultReports,
  fetchReportMetadata,
  lastVisitedReportV2,
  metadata,
  pushRouter,
  defaultReportsV2,
  reportsV2Loading,
}) => {
  useEffect(() => {
    fetchReportMetadata();
    fetchDefaultReports();
  }, [fetchReportMetadata, fetchDefaultReports]);
  const classes = useStyles();

  const handleGoToReport = React.useCallback(
    (categoryName: ReportCategoryEnum) => () => {
      const reportId =
        lastVisitedReportV2?.[categoryName] ||
        defaultReportsV2?.find((result) => result.category === categoryName)
          ?.id;

      reportId
        ? pushRouter(`/f/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/f/reporting/categories/');
    },
    [pushRouter, defaultReportsV2, lastVisitedReportV2],
  );

  if (metadata.loading || !metadata.results || reportsV2Loading) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.pageContainer}>
      <ReportCategoryDashboard
        handleGoToReport={handleGoToReport}
        metadata={metadata.results}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportCategoriesMetadata(state),
    defaultReportsV2: getDefaultReportsV2(state),
    reportsV2Loading: getReportV2Loading(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    pushRouter: push,
    fetchDefaultReports: fetchDefaultReportsAction,
  },
);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default compose<any, OwnProps>(
  connector,
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:dashboard.reportingDashboard'),
  ),
)(React.memo(FranchiseReportList));
