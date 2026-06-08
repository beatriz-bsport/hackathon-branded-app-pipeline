import type { FC } from "react";

import {
  Body,
  Button,
  Checkbox,
  Collapse,
  cx,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  type PermissionValue,
  getCheckboxValue,
  isPermissionTree,
  setBooleanLeaves,
} from "../permission-tree-utils";

const DEFAULT_DEPTH = 0;

const getInputId = (path: string) =>
  `role-permission-${path.replaceAll(".", "-")}`;

export type PermissionTreeSectionProps = {
  path: string;
  value: PermissionValue;
  onChange: (path: string, value: unknown) => void;
  getLabel: (path: string) => string;
  disabled?: boolean;
  level?: number;
  hiddenKeys?: Set<string>;
};

export const PermissionTreeSection: FC<PermissionTreeSectionProps> = ({
  path,
  value,
  onChange,
  getLabel,
  disabled = false,
  level = DEFAULT_DEPTH,
  hiddenKeys,
}) => {
  const { t } = useTranslation("role-form");

  if (hiddenKeys?.has(path) || value === undefined) {
    return null;
  }

  const checkboxValue = getCheckboxValue(value);
  const isTree = isPermissionTree(value);
  const label = getLabel(path);

  const toggleValue = () => {
    onChange(path, setBooleanLeaves(value, checkboxValue !== "checked"));
  };

  if (!isTree) {
    return (
      <div className={cx(level === DEFAULT_DEPTH ? "p-md" : "py-xs pl-lg")}>
        <Checkbox
          id={getInputId(path)}
          label={label}
          value={checkboxValue}
          disabled={disabled}
          onChange={toggleValue}
        />
      </div>
    );
  }

  return (
    <Collapse
      id={getInputId(path)}
      initiallyOpen={false}
      className={cx({
        "p-md": level === DEFAULT_DEPTH,
        "pl-lg pr-md border-l-stroke-thin border-l-stroke-main":
          level > DEFAULT_DEPTH,
      })}
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
                weight={level === DEFAULT_DEPTH ? "strong" : "weak"}
              >
                {label}
              </Body>
            </button>
            <div className="flex items-center gap-xs">
              {level === DEFAULT_DEPTH && (
                <Checkbox
                  id={`${getInputId(path)}-select-all`}
                  label={t("formFields.navigationMenu.selectAll.label")}
                  value={checkboxValue}
                  disabled={disabled}
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
            <PermissionTreeSection
              key={`${path}.${key}`}
              path={`${path}.${key}`}
              value={childValue as PermissionValue}
              onChange={onChange}
              getLabel={getLabel}
              disabled={disabled}
              level={level + 1}
              hiddenKeys={hiddenKeys}
            />
          ))}
        </div>
      </Collapse.Content>
    </Collapse>
  );
};
