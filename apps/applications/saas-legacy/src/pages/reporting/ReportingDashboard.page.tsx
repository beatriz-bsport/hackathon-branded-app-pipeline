import React, { useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';

import { filter_reports_by_upsells } from '#src/libs/reporting/common/permissions';
import { getCompanyUpsellData } from '#src/libs/company/selectors';
import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportCategoryDashboard from '#src/libs/reporting/v2/components/ReportCategoryDashboard.component';
import {
  fetchDefaultReports as fetchDefaultReportsAction,
  fetchReportMetadata as fetchReportMetadataAction,
} from '#src/libs/reporting/v2/actions';

import { getLastVisitedReportV2 } from '#src/libs/user-preference/selectors';
import type { RootState } from '#src/reducers';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';

import { ReportCategoryEnum } from '@bsport/common/master-data/report-categories.js';
import {
  getDefaultReportsV2,
  getReportCategoriesMetadata,
  getReportV2Loading,
} from '#src/libs/reporting/v2/selectors';
import { getObjectPermissions } from '#src/libs/role/selectors';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const ReportingDashboard: React.FC<Props> = ({
  fetchReportMetadata,
  fetchDefaultReports,
  pushRouter,
  lastVisitedReportV2,
  metadata,
  objectLevelPermissions,
  defaultReportsV2,
  reportsV2Loading,
  subscribedUpsells,
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
        ? pushRouter(`/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/reporting/categories');
    },
    [pushRouter, defaultReportsV2, lastVisitedReportV2],
  );

  if (metadata.loading || !metadata.results || reportsV2Loading) {
    return <LinearProgress />;
  }

  const filteredMetadata = (metadata?.results ?? []).filter((reportMetadata) =>
    filter_reports_by_upsells(reportMetadata.category, subscribedUpsells),
  );

  return (
    <div className={classes.pageContainer}>
      <ReportCategoryDashboard
        handleGoToReport={handleGoToReport}
        metadata={filteredMetadata}
        objectLevelPermissions={objectLevelPermissions}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportCategoriesMetadata(state),
    objectLevelPermissions: getObjectPermissions(state),
    defaultReportsV2: getDefaultReportsV2(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
    reportsV2Loading: getReportV2Loading(state),
    subscribedUpsells: getCompanyUpsellData(state),
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
)(React.memo(ReportingDashboard));
