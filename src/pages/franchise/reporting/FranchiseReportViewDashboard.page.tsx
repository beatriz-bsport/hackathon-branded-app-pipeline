import React, { useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';

import { getCompanyUpsellData } from '#src/libs/company/selectors';
import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import {
  fetchReports as fetchReportsAction,
  deleteReport as deleteReportAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '#src/libs/reporting/v1/actions';

import {
  fetchReportsV2 as fetchReportsV2Action,
  fetchReportMetadata as fetchReportMetadataAction,
} from '#src/libs/reporting/v2/actions';

import {
  getIsReportV2Displayed,
  getIsReportAlertDisplayedInV2,
  getLastVisitedReportV2,
} from '#src/libs/user-preference/selectors';
import {
  setIsReportAlertDisplayedInV2 as setIsReportAlertDisplayedAction,
  setIsReportV2Displayed as setIsReportV2DisplayedAction,
} from '#src/libs/user-preference/actions';
import type { RootState } from '#src/reducers';
import {
  getCustomViewsReports,
  getReports,
} from '#src/libs/reporting/v1/selectors';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import {
  getReportsV2,
  getReportV2Loading,
  getReportCategoriesMetadata,
} from '#src/libs/reporting/v2/selectors';
import { getObjectPermissions } from '#src/libs/role/selectors';
import ReportViewDashboard from '#src/libs/reporting/v2/components/ReportViewDashboard.component';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportViewDashboard: React.FC<Props> = ({
  fetchReportMetadata,
  fetchReports,
  fetchReportsV2,
  pushRouter,
  isV2Displayed,
  lastVisitedReportV2,
  metadata,
  reports,
  customReports,
  reportsV2,
  reportsV2Loading,
}) => {
  useEffect(() => {
    fetchReports();
    fetchReportMetadata();
    fetchReportsV2();
  }, [fetchReports, fetchReportMetadata, fetchReportsV2]);

  const classes = useStyles();

  const filteredReportViews = (reportsV2 || [])
    .concat(customReports || [])
    .filter((reportView) => !reportView.is_category_default);

  const handleGoToReportV2 = React.useCallback(
    (categoryName: ReportCategoryEnum) => () => {
      const reportId =
        lastVisitedReportV2?.[categoryName] ||
        filteredReportViews?.find((result) => result.category === categoryName)
          ?.id;

      reportId
        ? pushRouter(`/f/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/f/reporting/views');
    },
    [pushRouter, filteredReportViews, lastVisitedReportV2],
  );

  if (
    metadata.loading ||
    !metadata.results ||
    (!isV2Displayed && reports.loading) ||
    (isV2Displayed && reportsV2Loading)
  ) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.pageContainer}>
      <ReportViewDashboard
        handleGoToReportV2={handleGoToReportV2}
        reportViews={filteredReportViews}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportCategoriesMetadata(state),
    objectLevelPermissions: getObjectPermissions(state),
    reports: getReports(state),
    reportsV2: getReportsV2(state),
    customReports: getCustomViewsReports(state),
    reportsV2Loading: getReportV2Loading(state),
    subscribedUpsells: getCompanyUpsellData(state),
    isV2Displayed: getIsReportV2Displayed(state),
    isReportAlertDisplayedInV2: getIsReportAlertDisplayedInV2(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    updateReport: updateReportAction,
    createReport: createReportAction,
    deleteReport: deleteReportAction,
    pushRouter: push,
    setIsReportAlertDisplayedInV2: setIsReportAlertDisplayedAction,
    setIsReportV2Displayed: setIsReportV2DisplayedAction,
    fetchReportsV2: fetchReportsV2Action,
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
  withTitle(({ t }: { t: TFunction }) =>
    t('dashboard.reportingDashboard'),
  ),
)(React.memo(FranchiseReportViewDashboard));
