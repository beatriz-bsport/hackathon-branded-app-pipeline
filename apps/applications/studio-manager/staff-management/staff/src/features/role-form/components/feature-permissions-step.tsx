import { type FC, Fragment } from "react";

import { type UseFormControllerOutput, useWatch } from "@bsport/form";
import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP,
  SET_NESTED_FORM_VALUE_OPTIONS,
} from "../constants";
import {
  type PermissionTree,
  type PermissionValue,
  getCheckboxValue,
  setValueByPath,
} from "../permission-tree-utils";
import type { RoleFormSchema } from "../types";
import { ObjectLevelPermissionSection } from "./object-level-permission-section";

type FeaturePermissionsStepProps = {
  methods: UseFormControllerOutput<RoleFormSchema>;
  disabled?: boolean;
};

export const FeaturePermissionsStep: FC<FeaturePermissionsStepProps> = ({
  methods,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");
  const objectLevelPermissions = useWatch({
    control: methods.control,
    name: "objectLevelPermissions",
  });

  const setObjectLevelPermissionValue = (
    path: string,
    value: PermissionValue,
  ) => {
    let next = setValueByPath(
      methods.getValues("objectLevelPermissions") as unknown as PermissionTree,
      path,
      value,
    );

    const influencedPath =
      OBJECT_LEVEL_PERMISSIONS_DEPENDENCIES_MAP.direct[path];
    if (influencedPath && getCheckboxValue(value) === "unchecked") {
      next = setValueByPath(next, influencedPath, false);
    }

    methods.setValue(
      "objectLevelPermissions",
      next as never,
      SET_NESTED_FORM_VALUE_OPTIONS,
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-md">
      <Body htmlVariant="p" color="default">
        {t("steps.featurePermissions.helperText")}
      </Body>

      <div className="flex flex-col border border-stroke-thin border-stroke-weak rounded-md overflow-clip">
        {Object.entries(objectLevelPermissions).map(([key, value], index) => (
          <Fragment key={key}>
            {index > 0 && <Divider />}
            <ObjectLevelPermissionSection
              path={key}
              value={value as PermissionValue}
              rootValue={objectLevelPermissions}
              onChange={setObjectLevelPermissionValue}
              disabled={disabled}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
