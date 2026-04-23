import { type FC } from "react";

import { Alert, Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type UnavailableResource = {
  name: string;
  type: string;
};

type UnavailableResourcesAlertProps = {
  resources: UnavailableResource[];
  confirmationMessage: string;
};

export const UnavailableResourcesAlert: FC<UnavailableResourcesAlertProps> = ({
  resources,
  confirmationMessage,
}) => {
  const { t } = useTranslation("sessionList");

  return (
    <Alert status="critical">
      <div className="flex flex-col gap-xs">
        <Body htmlVariant="p" size="md" weight="weak" color="critical">
          {t("resourceAllocation.unavailableMessage")}
        </Body>
        <ul className="list-disc pl-lg">
          {resources.map((resource) => (
            <li key={resource.name}>
              <Body
                htmlVariant="span"
                size="md"
                weight="strong"
                color="critical"
              >
                {resource.name}
              </Body>{" "}
              <Body htmlVariant="span" size="md" weight="weak" color="critical">
                ({resource.type})
              </Body>
            </li>
          ))}
        </ul>
        <Body htmlVariant="p" size="md" weight="weak" color="critical">
          {confirmationMessage}
        </Body>
      </div>
    </Alert>
  );
};
