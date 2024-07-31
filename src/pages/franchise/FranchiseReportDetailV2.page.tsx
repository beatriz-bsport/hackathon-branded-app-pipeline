import React from 'react';
import type { match } from 'react-router-dom';

import ReportDetail from '#src/pages/reporting/ReportDetail.page';

type Props = match<{ categoryName: string; reportId: string }>;

const FranchiseReportDetail: React.FC<Props> = (props) => {
  return <ReportDetail isFranchisor {...props} />;
};

export default FranchiseReportDetail;
