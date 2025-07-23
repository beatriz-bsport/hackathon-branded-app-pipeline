import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type UsePageLayoutProps = {
  onCtaButtonClick: () => void;
  onSecondaryButtonClick: () => void;
};

export const usePageLayout = ({
  onCtaButtonClick,
  onSecondaryButtonClick,
}: UsePageLayoutProps) => {
  const { t } = useTranslation("tags");

  const emptyPageState = {
    className: "h-full",
    title: t("page.emptyPageState.title"),
    subtitle: t("page.emptyPageState.description"),
    ctaButtonConfig: {
      id: "create-tag-group-empty-button",
      label: t("page.actions.createTagGroup.label"),
      iconLeft: "plus",
    },
    secondaryButtonConfig: {
      id: "create-tag-empty-button",
      label: t("page.actions.createTag.label"),
      iconLeft: "plus",
    },
  };

  const emptyListState = {
    className: "h-full",
    subtitle: t("page.emptyMainTagState.description"),
    secondaryButtonConfig: {
      id: "create-tag-empty-button",
      label: t("page.actions.createTag.label"),
      iconLeft: "plus",
    },
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
      onClick={onSecondaryButtonClick}
    />,
    <Button
      key="create-tag-group-header-button"
      id="create-tag-group-header-button"
      intent="call-to-action"
      label={t("page.actions.createTagGroup.label")}
      color="main"
      size="md"
      iconLeft="plus"
      onClick={onCtaButtonClick}
    />,
  ];

  return {
    emptyPageState,
    emptyListState,
    pageActions,
  };
};
