import type { ReactNode } from "react";

import { Alert, Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type FilterManagerProps = {
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  addFilterLabel?: string;
  onAddFilter?: () => void;
  children: ReactNode;
};

/**
 * Generic smartlist filter manager wrapper.
 * Handles loading/error states and an optional "add filter" action.
 */
export const FilterManager = ({
  isLoading = false,
  isError = false,
  loadingMessage,
  errorMessage,
  addFilterLabel,
  onAddFilter,
  children,
}: FilterManagerProps) => {
  const { t } = useTranslation("filters");
  const resolvedLoadingMessage = loadingMessage ?? t("filterManager.loading");
  const resolvedErrorMessage = errorMessage ?? t("filterManager.loadError");

  if (isLoading) {
    return <Alert status="default">{resolvedLoadingMessage}</Alert>;
  }

  if (isError) {
    return (
      <Alert status="critical" type="weak">
        {resolvedErrorMessage}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {children}
      {addFilterLabel && onAddFilter ? (
        <Button
          label={addFilterLabel}
          iconLeft="plus"
          intent="flat"
          color="main"
          size="sm"
          onClick={onAddFilter}
        />
      ) : null}
    </div>
  );
};
