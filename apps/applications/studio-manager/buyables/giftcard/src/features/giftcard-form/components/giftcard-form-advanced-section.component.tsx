import type { FC, ReactNode } from "react";

import { Collapse, Icon, Title, cx } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type GiftcardFormAdvancedSectionProps = {
  formId: string;
  children: ReactNode;
};

export const GiftcardFormAdvancedSection: FC<
  GiftcardFormAdvancedSectionProps
> = ({ formId, children }) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <section id={`${formId}-advanced-section`}>
      <Collapse>
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);

            return (
              <button
                type="button"
                className={cx(
                  "w-full items-center flex flex-row gap-md justify-start mb-sm",
                  "transition-mb duration-long ease-in-out",
                )}
                onClick={toggleOpen}
                {...collapseProps}
              >
                <Title htmlVariant="h4" weight="strong">
                  {t("sections.advanced")}
                </Title>

                <Icon
                  icon="chevron-up"
                  size="sm"
                  className={cx(
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

        <Collapse.Content>{children}</Collapse.Content>
      </Collapse>
    </section>
  );
};
