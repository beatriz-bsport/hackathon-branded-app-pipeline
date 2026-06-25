import { type FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";

import { useLoadingState } from "@bsport/kaizen-primitive-core";

import { SeriesCancelModal } from "#src/components/series-cancel/series-cancel-modal";
import {
  SeriesDetailsRoute,
  type SeriesDetailsRouteData,
} from "#src/components/series-details/series-details-route";
import { SeriesDuplicateModal } from "#src/components/series-duplicate/series-duplicate-modal";
import { SeriesEditorForm } from "#src/components/series-editor/series-editor-form";
import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useModal } from "#src/hooks/use-modal";
import { useSeriesDetailsHeaderConfig } from "#src/hooks/use-series-details-header-config";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const SeriesEditorView: FC<SeriesDetailsRouteData> = ({ classes, series }) => {
  const { t } = useTranslation("series");
  const navigate = useNavigate();

  const {
    close: closeDuplicateModal,
    isOpen: isDuplicateModalOpen,
    open: openDuplicateModal,
  } = useModal();

  const {
    close: closeCancelModal,
    isOpen: isCancelModalOpen,
    open: openCancelModal,
  } = useModal();

  const handleCancelSuccess = useCallback(() => {
    closeCancelModal();
    navigate(ABSOLUTE_ROUTES.SERIES_LIST);
  }, [closeCancelModal, navigate]);

  const activityIds = useMemo(
    () => [series.meta_activity],
    [series.meta_activity],
  );

  const activityQuery = useFetchActivitiesByIds(activityIds);

  const headerConfig = useSeriesDetailsHeaderConfig({
    classes,
    series,
    onCancel: openCancelModal,
    onDuplicate: openDuplicateModal,
  });

  const { LoadingState, shouldRenderLoadingState } = useLoadingState({
    isLoading: activityQuery.isLoading,
    message: t("loading"),
  });

  if (shouldRenderLoadingState) {
    return <LoadingState />;
  }

  if (activityQuery.error) {
    throw activityQuery.error;
  }

  return (
    <>
      <SeriesEditorForm
        activity={activityQuery.data?.[series.meta_activity]}
        classes={classes}
        headerConfig={headerConfig}
        series={series}
      />
      {isDuplicateModalOpen ? (
        <SeriesDuplicateModal
          key={series.id}
          seriesId={series.id}
          onClose={closeDuplicateModal}
        />
      ) : null}
      {isCancelModalOpen ? (
        <SeriesCancelModal
          key={series.id}
          seriesId={series.id}
          onClose={closeCancelModal}
          onSuccess={handleCancelSuccess}
        />
      ) : null}
    </>
  );
};

export const SeriesEditorPage: FC = () => {
  return (
    <SeriesDetailsRoute>
      {(seriesDetails) => <SeriesEditorView {...seriesDetails} />}
    </SeriesDetailsRoute>
  );
};

export default SeriesEditorPage;
