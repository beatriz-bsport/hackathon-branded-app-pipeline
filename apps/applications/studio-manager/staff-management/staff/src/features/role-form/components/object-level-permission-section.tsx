import type { FC } from "react";

import {
  Body,
  Button,
  Checkbox,
  Collapse,
  cx,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP } from "../constants";
import {
  type PermissionTree,
  type PermissionValue,
  getCheckboxValue,
  getValueByPath,
  isPermissionTree,
  setBooleanLeaves,
} from "../permission-tree-utils";
import type { RoleFormData } from "../types";

export type ObjectLevelPermissionSectionProps = {
  path: string;
  value: PermissionValue;
  rootValue: RoleFormData["objectLevelPermissions"];
  onChange: (path: string, value: PermissionValue) => void;
  disabled?: boolean;
  level?: number;
};

const ROOT_LEVEL = 0;

const HIDDEN_OBJECT_LEVEL_PERMISSION_KEYS = new Set(["allowed_actions"]);

const getInputId = (path: string) =>
  `role-object-level-permission-${path.replaceAll(".", "-")}`;

/**
 * Derives a human-readable label from a dot-separated permission path when no
 * translation key is available.
 *
 * @param path - Dot-separated permission path (e.g. `"booking.max_participants"`)
 * @returns Capitalised, space-separated label built from the leaf key
 *   (e.g. `"Max participants"`)
 */
const formatLabelFallback = (path: string) => {
  const leafKey = path.split(".").at(-1) ?? path;

  return leafKey
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
};

export const ObjectLevelPermissionSection: FC<
  ObjectLevelPermissionSectionProps
> = ({
  path,
  value,
  rootValue,
  onChange,
  disabled = false,
  level = ROOT_LEVEL,
}) => {
  const { t } = useTranslation("role-form");
  const leafKey = path.split(".").at(-1);

  if (
    value === undefined ||
    (leafKey && HIDDEN_OBJECT_LEVEL_PERMISSION_KEYS.has(leafKey))
  ) {
    if (!isPermissionTree(value)) {
      return null;
    }

    return (
      <>
        {Object.entries(value).map(([key, childValue]) => (
          <ObjectLevelPermissionSection
            key={`${path}.${key}`}
            path={`${path}.${key}`}
            value={childValue as PermissionValue}
            rootValue={rootValue}
            onChange={onChange}
            disabled={disabled}
            level={level}
          />
        ))}
      </>
    );
  }

  const isTree = isPermissionTree(value);
  const checkboxValue = getCheckboxValue(value);
  const labelKey = `objectLevelPermissions.${path}._label`;
  const translatedLabel = t(labelKey as never) as string;
  const label =
    translatedLabel !== labelKey ? translatedLabel : formatLabelFallback(path);
  const dependencyPath =
    OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP.reciproque[path];
  const dependencyValue = dependencyPath
    ? getValueByPath(rootValue as unknown as PermissionTree, dependencyPath)
    : undefined;
  const disabledByDependency =
    dependencyPath !== undefined &&
    getCheckboxValue(dependencyValue) !== "checked";

  const toggleValue = () => {
    onChange(path, setBooleanLeaves(value, checkboxValue !== "checked"));
  };

  if (!isTree) {
    return (
      <div className={cx(level === ROOT_LEVEL ? "p-md" : "py-xs")}>
        <Checkbox
          id={getInputId(path)}
          label={label}
          value={checkboxValue}
          disabled={disabled || disabledByDependency}
          onChange={toggleValue}
        />
      </div>
    );
  }

  return (
    <Collapse
      id={getInputId(path)}
      initiallyOpen={false}
      className={cx(
        level === ROOT_LEVEL && "p-md",
        level > ROOT_LEVEL &&
          "pl-lg pr-md border-l-stroke-thin border-l-stroke-main",
      )}
    >
      <Collapse.Controller>
        {({ isCollapseOpen, setIsCollapseOpen, collapseProps }) => (
          <div className="flex items-center justify-between gap-sm py-xs">
            <button
              type="button"
              {...collapseProps}
              className="flex-1 text-left"
              onClick={() => setIsCollapseOpen((isOpen) => !isOpen)}
            >
              <Body
                htmlVariant="span"
                weight={level === ROOT_LEVEL ? "strong" : "weak"}
              >
                {label}
              </Body>
            </button>
            <div className="flex items-center gap-xs">
              {level === ROOT_LEVEL && (
                <Checkbox
                  id={`${getInputId(path)}-select-all`}
                  label={t("formFields.navigationMenu.selectAll.label")}
                  value={checkboxValue}
                  disabled={disabled || disabledByDependency}
                  onChange={() => {
                    toggleValue();
                    setIsCollapseOpen(true);
                  }}
                />
              )}
              <Button
                kind="icon-button"
                intent="flat"
                color="default"
                size="md"
                label={
                  isCollapseOpen ? t("buttons.collapse") : t("buttons.expand")
                }
                icon={isCollapseOpen ? "chevron-down" : "chevron-right"}
                onClick={() => setIsCollapseOpen((isOpen) => !isOpen)}
              />
            </div>
          </div>
        )}
      </Collapse.Controller>
      <Collapse.Content>
        <div className="flex flex-col gap-xs">
          {Object.entries(value).map(([key, childValue]) => (
            <ObjectLevelPermissionSection
              key={`${path}.${key}`}
              path={`${path}.${key}`}
              value={childValue as PermissionValue}
              rootValue={rootValue}
              onChange={onChange}
              disabled={disabled}
              level={level + 1}
            />
          ))}
        </div>
      </Collapse.Content>
    </Collapse>
  );
};
