import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import {
  getReportCategoriesMetadata,
  getReportFilterConfigs,
  getReportFilterConfigLoading,
} from '#src/libs/reporting/v2/selectors';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

import {
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReportFilterConfigList as fetchReportFilterConfigListAction,
} from '#src/libs/reporting/v2/actions';

import ReportDetailPage from '#src/libs/reporting/v2/components/ReportDetailPage.component';

import type { RootState } from '#src/reducers';

type RouterProps = { categoryName: ReportCategoryEnum; reportId: number };

type Props = RouterProps & ConnectedProps<typeof connector>;

const ReportingDetail: React.FC<Props> = ({
  categoryName,
  fetchReportMetadata,
  fetchReportFilterConfigList,
  pushRouter,
  reportId,
  reportFilterConfigs,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
}) => {
  React.useEffect(() => {
    fetchReportMetadata();
  }, [fetchReportMetadata]);

  React.useEffect(() => {
    fetchReportFilterConfigList({ report_id_in: [reportId] });
  }, [fetchReportFilterConfigList, reportId]);

  if (reportFilterConfigLoading) {
    return <LinearProgress />;
  }

  return (
    <ReportDetailPage
      categoryName={categoryName}
      pushRouter={pushRouter}
      reportCategoriesMetadata={reportCategoriesMetadata}
      reportFilterConfigs={reportFilterConfigs}
      reportId={reportId}
    />
  );
};

const connector = connect(
  (state: RootState, { reportId }: { reportId: number }) => ({
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    pushRouter: push,
  },
);

export default compose<Props, {}>(
  routerParamsToProps({
    categoryName: 'categoryName:string',
    reportId: 'reportId:number',
  }),
  connector,
)(React.memo(ReportingDetail));
