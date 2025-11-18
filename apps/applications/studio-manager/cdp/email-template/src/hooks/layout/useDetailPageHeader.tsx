import { Link } from "react-router";

import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  DropdownMenu,
  type DropdownMenuItems,
  IconName,
  Tooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type UseDetailPageHeaderProps = {
  onDeleteTemplate?: () => void;
  onDuplicateTemplate?: () => void;
  onExportTemplate: () => void;
};

type ActionConfig =
  | {
      id: string;
      label: string;
      iconLeft: IconName;
    }
  | undefined;

export const useDetailPageHeader = ({
  onExportTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
}: UseDetailPageHeaderProps) => {
  const { t } = useTranslation(["list", "detail"]);
  const isMobile = !useMatchMedia("sm");

  const getDuplicateTemplateActionConfig = (): ActionConfig => {
    return onDuplicateTemplate
      ? {
          id: "duplicate-template",
          label: t("activeList.actions.duplicate", { ns: "list" }),
          iconLeft: "edit-02",
        }
      : undefined;
  };

  const getDeleteTemplateActionConfig = (): ActionConfig => {
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
    ].filter((action) => action !== undefined);
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
          items={getDropdownMenuAction() as DropdownMenuItems}
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
              kind="icon-button"
              icon="dots-vertical"
              label={t("details.hover.moreActions", { ns: "detail" })}
              color="main"
              intent="default"
              size="md"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
        />
      </Tooltip>
    ) : undefined;

  const desktopActions = [
    <Tooltip
      key="export-html-button"
      placement="bottom-right"
      label={t("details.hover.exportHtml", { ns: "detail" })}
    >
      <Button
        kind="icon-button"
        icon="download-01"
        label={t("details.hover.exportHtml", { ns: "detail" })}
        color="main"
        intent="default"
        size="md"
        onClick={onExportTemplate}
      />
    </Tooltip>,
    dropdownMenuConfig,
  ];

  const mobileActions = [
    <Button
      key="export-html-button"
      iconLeft="download-01"
      label={t("details.actions.exportHtml", { ns: "detail" })}
      color="main"
      intent="default"
      size="md"
      onClick={onExportTemplate}
    />,
    ...getDropdownMenuAction().map(({ id, label, iconLeft }) => {
      return (
        <Button
          key={id}
          label={label}
          iconLeft={iconLeft}
          color="main"
          intent="default"
          size="md"
          onClick={() => {
            if (id === "duplicate-template") {
              onDuplicateTemplate?.();
            } else if (id === "delete-template") {
              onDeleteTemplate?.();
            }
          }}
        />
      );
    }),
  ];
  const { endGroupActions } = DetailsLayout.useAdaptiveActions({
    endGroupActions: mobileActions,
  });

  return {
    BreadcrumbsItems,
    endGroupActions: isMobile ? endGroupActions : desktopActions,
  };
};
