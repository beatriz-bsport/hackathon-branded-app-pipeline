import React from 'react';
import { compose } from 'recompose';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import ReportingGeneration from '../reporting/ReportingGeneration.page';

const FranchiseReportDetail: React.FC<{ id: number }> = ({ id }) => {
  return <ReportingGeneration isFranchisor id={id} />;
};

export default compose<any, {}>(routerParamsToProps({ reportId: 'id:number' }))(
  FranchiseReportDetail,
);
