import { type FC, useCallback } from "react";
import { useNavigate } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { SeriesCancelModal } from "#src/components/series-cancel/series-cancel-modal";
import { SeriesClassesTable } from "#src/components/series-classes/series-classes-table";
import {
  SeriesDetailsRoute,
  type SeriesDetailsRouteData,
} from "#src/components/series-details/series-details-route";
import { SeriesDuplicateModal } from "#src/components/series-duplicate/series-duplicate-modal";
import { useOccurrenceStatusFilter } from "#src/components/session-occurrence-table/use-occurrence-status-filter";
import { sessionsInGroupQueryOptions } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useModal } from "#src/hooks/use-modal";
import { useSeriesDetailsHeaderConfig } from "#src/hooks/use-series-details-header-config";
import { ABSOLUTE_ROUTES } from "#src/urls";

const SeriesClassesView: FC<SeriesDetailsRouteData> = ({ classes, series }) => {
  const navigate = useNavigate();
  const paginationNamespace = `series-classes-${series.id}`;

  const { status, filterConfig } =
    useOccurrenceStatusFilter(paginationNamespace);

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

  const headerConfig = useSeriesDetailsHeaderConfig({
    classes,
    series,
    onCancel: openCancelModal,
    onDuplicate: openDuplicateModal,
  });

  return (
    <>
      <ListLayout>
        <ListLayout.Header {...headerConfig} filterConfig={filterConfig} />
        <ListLayout.Content>
          <SeriesClassesTable
            companyId={series.company}
            status={status}
            paginationNamespace={paginationNamespace}
            getQueryOptions={(params) =>
              sessionsInGroupQueryOptions(
                series.id,
                { ordering: "date_start", ...params },
                true,
              )
            }
          />
        </ListLayout.Content>
      </ListLayout>
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

export const SeriesClassesPage: FC = () => {
  return (
    <SeriesDetailsRoute>
      {(seriesDetails) => <SeriesClassesView {...seriesDetails} />}
    </SeriesDetailsRoute>
  );
};

export default SeriesClassesPage;
