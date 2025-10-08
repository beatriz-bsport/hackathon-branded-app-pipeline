import { clsx } from "clsx";
import React from "react";

import { Collapse, Icon, Title } from "@bsport/kaizen-primitive-core";

import { useFetchTags } from "#src/hooks/useFetchTags";
import { useTranslation } from "#src/utils/i18n";

import { PackFormTags } from "./PackFormTags";

type PackFormAdvancedProps = {
  fieldIdPrefix: string;
};

export const PackFormAdvanced: React.FC<PackFormAdvancedProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  useFetchTags();

  const keyBase = `${fieldIdPrefix}-advanced`;

  return (
    <section id={`${keyBase}-section`}>
      <Collapse>
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);

            return (
              <button
                type="button"
                className={clsx(
                  "w-full items-center flex flex-row gap-md justify-start mb-sm",
                  "transition-mb duration-long ease-in-out",
                )}
                onClick={toggleOpen}
                {...collapseProps}
              >
                <Title htmlVariant="h4" weight="strong">
                  {t("formFields.advancedSection.title")}
                </Title>
                <Icon
                  icon="chevron-up"
                  size="sm"
                  className={clsx(
                    "w-fit transform",
                    "transition-transform duration-long ease-in-out",
                    {
                      "rotate-0": isCollapseOpen,
                      "rotate-180": !isCollapseOpen,
                    },
                  )}
                />
              </button>
            );
          }}
        </Collapse.Controller>

        <Collapse.Content>
          <PackFormTags fieldIdPrefix={keyBase} />
        </Collapse.Content>
      </Collapse>
    </section>
  );
};
