import { useCallback } from "react";

import type { MetaActivity } from "@bsport/api-book";

import { ServiceSelectionStep } from "#src/components/service-selection/service-selection-step";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const PAGINATION_NAMESPACE = "series_add_services";

type ChooseServiceStepProps = {
  selectedService: MetaActivity | null;
  onSelectService: (service: MetaActivity) => void;
};

export const ChooseServiceStep = ({
  selectedService,
  onSelectService,
}: ChooseServiceStepProps) => {
  const { t } = useTranslation("series");
  const { resolveServicesPath } = useUrls();

  const handleAddServiceClick = useCallback(() => {
    window.open(resolveServicesPath(), "_blank", "noopener,noreferrer");
  }, [resolveServicesPath]);

  return (
    <ServiceSelectionStep
      selectedServiceId={selectedService?.id}
      onSelectService={onSelectService}
      isWorkshop
      paginationNamespace={PAGINATION_NAMESPACE}
      addServiceButton={{
        label: t("seriesAddModal.steps.chooseService.addServiceButton"),
        onClick: handleAddServiceClick,
      }}
      labels={{
        description: t("seriesAddModal.steps.chooseService.description"),
        searchPlaceholder: t(
          "seriesAddModal.steps.chooseService.search.placeholder",
        ),
        loading: t("seriesAddModal.steps.chooseService.loadingServices"),
        emptyTitle: t("seriesAddModal.steps.chooseService.emptyState.title"),
        emptySearchTitle: t(
          "seriesAddModal.steps.chooseService.emptySearchState.title",
        ),
        serviceColumn: t(
          "seriesAddModal.steps.chooseService.table.columns.service",
        ),
        livestreamTooltip: t(
          "seriesAddModal.steps.chooseService.table.features.livestream.popoverLabel",
        ),
      }}
    />
  );
};
