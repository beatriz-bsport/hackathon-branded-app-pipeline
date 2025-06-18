import { Button, DropdownMenu, Tooltip } from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type UseDetailPageHeaderProps = {
  onDeleteTemplate: () => void;
  onDuplicateTemplate: () => void;
  onExportTemplate: () => void;
};

export const useDetailPageHeader = ({
  onExportTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
}: UseDetailPageHeaderProps) => {
  const { t } = useTranslation(["list", "detail"]);

  const breadcrumbsItems = [
    {
      id: "breadcrumb-root-item",
      text: t("breadcrumbs.rootPage"),
      href: `../${ROUTES.CUSTOM_TEMPLATES}`,
    },
    {
      id: "breadcrumb-first-child",
      text: t("breadcrumbs.customPage"),
      href: `../${ROUTES.CUSTOM_TEMPLATES}`,
    },
  ];

  const endGroupActions = [
    <Tooltip
      key="export-html-button"
      placement="bottom-right"
      label={t("details.hover.exportHtml")}
    >
      <Button
        iconLeft="download-01"
        color="main"
        intent="default"
        size="md"
        onClick={onExportTemplate}
      />
    </Tooltip>,
    <Tooltip
      key="more-actions-button"
      placement="bottom-right"
      label={t("details.hover.moreActions")}
    >
      <DropdownMenu
        placement="bottom-right"
        items={[
          {
            id: "duplicate-template",
            label: t("activeList.actions.duplicate"),
            iconLeft: "edit-02",
          },
          {
            id: "delete-template",
            label: t("activeList.actions.delete"),
            iconLeft: "trash-01",
          },
        ]}
        onSelectOption={({ id }) => {
          if (id === "duplicate-template") {
            onDuplicateTemplate();
          } else if (id === "delete-template") {
            onDeleteTemplate();
          }
        }}
        target={({ setIsPopoverOpened }) => (
          <Button
            key="chevron-right-button"
            iconLeft="dots-vertical"
            color="main"
            intent="default"
            size="md"
            onClick={() => setIsPopoverOpened(true)}
          />
        )}
      />
    </Tooltip>,
  ];

  return {
    breadcrumbsItems,
    endGroupActions,
  };
};
