import React from 'react';
import type { CallHistoryMethodAction } from 'connected-react-router';

import ReportDetailHeader from '#src/libs/reporting/v2/components/ReportDetailHeader.component';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import type {
  ReportFilterConfig,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';

type Props = {
  categoryName: ReportCategoryEnum;
  pushRouter: (path: string) => CallHistoryMethodAction<[string, unknown?]>;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportFilterConfigs: ReportFilterConfig[];
  reportId: number;
};

const ReportDetailPage: React.FC<Props> = ({
  categoryName,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigs,
  reportId,
}) => {
  // Will be used in next commit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleEditDrawerState = React.useCallback(
    (bool: boolean) => () => {
      setIsEditDrawerOpen(bool);
    },
    [setIsEditDrawerOpen],
  );

  const handleAddModalState = React.useCallback(
    (bool: boolean) => () => {
      setIsAddModalOpen(bool);
    },
    [setIsAddModalOpen],
  );

  const advancedReportFilterConfig = React.useMemo(
    () =>
      reportFilterConfigs.find(
        (reportFilterConfig) => !reportFilterConfig.is_quick_report_filter,
      ) || null,
    [reportFilterConfigs],
  );

  return (
    <ReportDetailHeader
      advancedReportFilterConfig={advancedReportFilterConfig}
      categoryName={categoryName}
      handleAddModalOpening={handleAddModalState(true)}
      handleEditDrawerOpening={handleEditDrawerState(true)}
      pushRouter={pushRouter}
      reportId={reportId}
      upsertActionsDisabled={reportCategoriesMetadata.loading}
    />
  );
};

export default React.memo(ReportDetailPage);
