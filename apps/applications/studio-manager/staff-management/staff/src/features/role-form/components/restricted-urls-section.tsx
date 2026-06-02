import { type ChangeEvent, type FC, useState } from "react";

import {
  Body,
  Button,
  Collapse,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type RestrictedUrlsSectionProps = {
  restrictedPaths: string[];
  onChange: (paths: string[]) => void;
  disabled?: boolean;
};

export const RestrictedUrlsSection: FC<RestrictedUrlsSectionProps> = ({
  restrictedPaths,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");
  const [newRestrictedPath, setNewRestrictedPath] = useState("");

  const updateRestrictedPath = (index: number, value: string) => {
    const next = [...restrictedPaths];
    next[index] = value;
    onChange(next);
  };

  const addRestrictedPath = () => {
    onChange([...restrictedPaths, newRestrictedPath.trim()]);
    setNewRestrictedPath("");
  };

  const removeRestrictedPath = (index: number) => {
    onChange(restrictedPaths.filter((_, i) => i !== index));
  };

  return (
    <Collapse
      id="role-restricted-paths"
      className="border border-stroke-thin border-stroke-weak rounded-md overflow-clip"
    >
      <Collapse.Controller>
        {({ isCollapseOpen, setIsCollapseOpen, collapseProps }) => (
          <div className="flex flex-col gap-2xs">
            <div className="flex items-center gap-xs">
              <Title htmlVariant="h4" weight="strong">
                {t("formFields.restrictedPaths.title")}
              </Title>
              <Button
                {...collapseProps}
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
            <Body htmlVariant="p" color="weak">
              {t("formFields.restrictedPaths.helperText")}
            </Body>
          </div>
        )}
      </Collapse.Controller>
      <Collapse.Content>
        <div className="flex flex-col gap-sm px-md pb-md">
          {restrictedPaths.map((path, index) => (
            <div key={index} className="flex items-center gap-sm">
              <TextField
                id={`role-restricted-path-${index}`}
                value={path}
                placeholder={t("formFields.restrictedPaths.placeholder")}
                fullWidth
                disabled={disabled}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateRestrictedPath(index, event.target.value)
                }
              />
              <Button
                kind="icon-button"
                intent="flat"
                color="critical"
                size="sm"
                label={t("buttons.remove")}
                icon="trash-01"
                disabled={disabled}
                onClick={() => removeRestrictedPath(index)}
              />
            </div>
          ))}

          <div className="flex items-center gap-sm">
            <TextField
              id="role-restricted-path-new"
              value={newRestrictedPath}
              placeholder={t("formFields.restrictedPaths.placeholder")}
              fullWidth
              disabled={disabled}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewRestrictedPath(event.target.value)
              }
            />
            <Button
              kind="icon-button"
              intent="flat"
              color="default"
              size="sm"
              label={t("buttons.add")}
              icon="plus"
              disabled={disabled || newRestrictedPath.trim() === ""}
              onClick={addRestrictedPath}
            />
          </div>
        </div>
      </Collapse.Content>
    </Collapse>
  );
};
