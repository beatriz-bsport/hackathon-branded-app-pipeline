import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type FilterCardSaveButtonProps = {
  isSavedFilter: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onSave: () => void;
};

/**
 * Saved filters with no pending changes are in the applied state.
 */
export const isFilterApplied = (
  isSavedFilter: boolean,
  isDirty: boolean,
): boolean => isSavedFilter && !isDirty;

/**
 * Save stays disabled until the form has changes worth persisting.
 */
export const isFilterSaveDisabled = (isDirty: boolean): boolean => !isDirty;

/**
 * Save / apply action for filter cards. Always visible: "Applied" when saved
 * and up to date, "Apply" when drafting or after edits.
 */
export const FilterCardSaveButton = ({
  isSavedFilter,
  isDirty,
  isSaving,
  isDeleting,
  onSave,
}: FilterCardSaveButtonProps) => {
  const { t } = useTranslation("filters");
  const applied = isFilterApplied(isSavedFilter, isDirty);

  return (
    <div className="flex justify-end">
      <Button
        label={
          applied ? t("shared.actions.applied") : t("shared.actions.apply")
        }
        size="sm"
        color="main"
        intent="default"
        iconLeft="check"
        loading={isSaving}
        disabled={isFilterSaveDisabled(isDirty) || isSaving || isDeleting}
        onClick={() => void onSave()}
      />
    </div>
  );
};
