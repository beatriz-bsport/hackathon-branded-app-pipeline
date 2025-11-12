import type { FC } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import type {
  ActionButton,
  IconName,
  ListProps,
} from "@bsport/kaizen-primitive-core";
import type { CustomForm } from "@bsport/store-cdp-custom-form";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type EmptyConfig = {
  title: string;
  subtitle?: string;
  ctaButtonConfig?: {
    label: string;
    iconLeft: IconName;
    onClick?: () => void;
  };
};

type CustomFormHandler = ({
  formId,
  formName,
}: {
  formId: number;
  formName: string;
}) => void;

export type CustomFormMobileListProps = {
  mode: "archived" | "active";
  customForms: CustomForm[];
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  handleArchive?: CustomFormHandler;
  handleDuplicate?: CustomFormHandler;
  handleRestore?: CustomFormHandler;
  emptyConfig: EmptyConfig;
  loadingMessage?: string;
};

export const CustomFormList: FC<CustomFormMobileListProps> = ({
  handleArchive,
  handleDuplicate,
  handleRestore,
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  customForms,
  emptyConfig,
  loadingMessage,
}) => {
  const { t } = useTranslation("common");

  const listItems: ListProps["items"] = customForms.map((form) => {
    const questionsCount = form?.custom_form_field?.length ?? 0;
    const questionsText = t("list.questions", { count: questionsCount });

    // Determine actions based on mode
    const buttons: ActionButton[] = [];

    if (mode === "archived" && handleRestore) {
      buttons.push({
        id: `form-restore-${form.id}`,
        iconLeft: "unarchive" as IconName,
        label: t("table.tooltips.restore"),
        size: "md",
        intent: "flat",
        color: "default",
        onClick: () =>
          handleRestore?.({
            formId: form.id,
            formName: form.name,
          }),
      });
    }

    if (mode === "active") {
      if (handleDuplicate) {
        buttons.push({
          id: `form-duplicate-${form.id}`,
          iconLeft: "copy-03",
          label: t("table.tooltips.duplicate"),
          size: "md",
          intent: "flat",
          color: "default",
          onClick: () =>
            handleDuplicate?.({
              formId: form.id,
              formName: form.name,
            }),
        });
      }

      if (handleArchive) {
        buttons.push({
          id: `form-archive-${form.id}`,
          iconLeft: "archive",
          label: t("table.tooltips.archive"),
          size: "md",
          intent: "flat",
          color: "default",
          onClick: () =>
            handleArchive?.({
              formId: form.id,
              formName: form.name,
            }),
        });
      }
    }

    return {
      id: `form-${form.id}`,
      title: form.name,
      description: questionsText,
      link: LEGACY_URLS.FORM_DETAILS(form.id),
      buttons,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
    };
  });

  return (
    <List
      id="custom-form-mobile-list"
      items={listItems}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig,
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading: isLoading,
        message: loadingMessage,
      }}
      isCompact={false}
    />
  );
};
