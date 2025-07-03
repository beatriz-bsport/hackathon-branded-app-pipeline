import { Link } from "react-router";

import {
  Breadcrumbs,
  Button,
  DropdownMenu,
  type DropdownMenuItems,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type UseDetailPageHeaderProps = {
  onDeleteTemplate?: () => void;
  onDuplicateTemplate?: () => void;
  onExportTemplate: () => void;
};

export const useDetailPageHeader = ({
  onExportTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
}: UseDetailPageHeaderProps) => {
  const { t } = useTranslation(["list", "detail"]);

  const getDuplicateTemplateActionConfig = () => {
    return onDuplicateTemplate
      ? {
          id: "duplicate-template",
          label: t("activeList.actions.duplicate", { ns: "list" }),
          iconLeft: "edit-02",
        }
      : undefined;
  };

  const getDeleteTemplateActionConfig = () => {
    return onDeleteTemplate
      ? {
          id: "delete-template",
          label: t("activeList.actions.delete", { ns: "list" }),
          iconLeft: "trash-01",
        }
      : undefined;
  };

  const getDropdownMenuAction = () => {
    return [
      getDuplicateTemplateActionConfig(),
      getDeleteTemplateActionConfig(),
    ].filter(Boolean) as DropdownMenuItems;
  };

  const BreadcrumbsItems = [
    <Link key="to-base-email-template" to={`../${ROUTES.CUSTOM_TEMPLATES}`}>
      <Breadcrumbs.Item
        id="breadcrumb-active-email-template-list"
        text={t("breadcrumbs.rootPage", { ns: "detail" })}
      />
    </Link>,
    <Link key="to-custom-template" to={`../${ROUTES.CUSTOM_TEMPLATES}`}>
      <Breadcrumbs.Item
        id="breadcrumb-active-custom-template-list"
        text={t("breadcrumbs.customPage", { ns: "detail" })}
      />
    </Link>,
  ];

  const dropdownMenuConfig =
    onDeleteTemplate || onDuplicateTemplate ? (
      <Tooltip
        key="more-actions-button"
        placement="bottom-right"
        label={t("details.hover.moreActions", { ns: "detail" })}
      >
        <DropdownMenu
          placement="bottom-right"
          items={getDropdownMenuAction()}
          onSelectOption={({ id }) => {
            if (id === "duplicate-template") {
              onDuplicateTemplate?.();
            } else if (id === "delete-template") {
              onDeleteTemplate?.();
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
      </Tooltip>
    ) : undefined;

  const endGroupActions = [
    <Tooltip
      key="export-html-button"
      placement="bottom-right"
      label={t("details.hover.exportHtml", { ns: "detail" })}
    >
      <Button
        iconLeft="download-01"
        color="main"
        intent="default"
        size="md"
        onClick={onExportTemplate}
      />
    </Tooltip>,
    dropdownMenuConfig,
  ];

  return {
    BreadcrumbsItems,
    endGroupActions,
  };
};
