import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type UsePageLayoutProps = {
  isFiltered?: boolean;
  handleCreateTagGroup?: () => void;
  handleCreateTag?: (associatedGroupId?: number) => void;
  handleClearFilters?: () => void;
};

export const usePageLayout = ({
  isFiltered,
  handleCreateTagGroup,
  handleCreateTag,
  handleClearFilters,
}: UsePageLayoutProps) => {
  const { t } = useTranslation("tags");

  const emptyPageState = isFiltered
    ? {
        className: "h-full",
        title: t("page.emptyFilteredPageState.title"),
        subtitle: t("page.emptyFilteredPageState.description"),
        secondaryButtonConfig: {
          id: "clear-tag-group-filters",
          label: t("page.emptyFilteredPageState.secondaryButtonLabel"),
          iconLeft: "x-close",
          onClick: handleClearFilters,
        },
      }
    : {
        className: "h-full",
        title: t("page.emptyPageState.title"),
        subtitle: t("page.emptyPageState.description"),
        ctaButtonConfig: {
          id: "create-tag-group-empty-button",
          label: t("page.actions.createTagGroup.label"),
          iconLeft: "plus",
          onClick: handleCreateTagGroup,
        },
      };

  const getEmptyListState = (emptyListGroupId?: number) => {
    return {
      className: "h-full",
      subtitle: t("page.emptyMainTagState.description"),
      secondaryButtonConfig: {
        id: "create-tag-empty-button",
        label: t("page.actions.createTag.label"),
        iconLeft: "plus",
        onClick: () => handleCreateTag?.(emptyListGroupId),
      },
    };
  };

  const pageActions = [
    <Button
      key="create-tag-header-button"
      id="create-tag-header-button"
      intent="default"
      label={t("page.actions.createTag.label")}
      color="main"
      size="md"
      iconLeft="plus"
      onClick={() => handleCreateTag?.()}
    />,
    <Button
      key="create-tag-group-header-button"
      id="create-tag-group-header-button"
      intent="call-to-action"
      label={t("page.actions.createTagGroup.label")}
      color="main"
      size="md"
      iconLeft="plus"
      onClick={handleCreateTagGroup}
    />,
  ];

  return {
    emptyPageState,
    pageActions,
    getEmptyListState,
  };
};
