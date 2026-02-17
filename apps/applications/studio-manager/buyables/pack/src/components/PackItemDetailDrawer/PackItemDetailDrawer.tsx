import type { FC } from "react";

import {
  Body,
  Button,
  DetailDrawer,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import { ITEM_VARIANTS } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type { FormattedData } from "#src/utils/stores-interface";

type PackItemDetailDrawerProps = {
  categoryName: string;
  isOpen: boolean;
  item: FormattedData | null;
  onClose: () => void;
  onSelectNextItem: () => void;
  onSelectPreviousItem: () => void;
};

export const PackItemDetailDrawer: FC<PackItemDetailDrawerProps> = ({
  categoryName,
  isOpen,
  item,
  onClose,
  onSelectNextItem,
  onSelectPreviousItem,
}) => {
  const { t } = useTranslation("details");

  return (
    <DetailDrawer
      id="packs-items-detail-drawer"
      isOpen={isOpen}
      onClose={onClose}
      actionsConfig={[
        {
          id: "select-previous-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-up",
          kind: "icon-button",
          label: t("itemDetailDrawer.selectPreviousItem"),
          onClick: onSelectPreviousItem,
        },
        {
          id: "select-next-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-down",
          kind: "icon-button",
          label: t("itemDetailDrawer.selectNextItem"),
          onClick: onSelectNextItem,
        },
      ]}
    >
      {item ? (
        <>
          <Title htmlVariant="h2" weight="strong">
            {item.name}
          </Title>
          <Title htmlVariant="h5" weight="weak" color="weak">
            {categoryName}
          </Title>

          <div className="flex flex-col gap-md">
            <Divider orientation="horizontal" weight="thin" />

            {item.price && (
              <div>
                <Body size="sm" weight="weak" color="weak">
                  {t("itemDetailDrawer.pricing")}
                </Body>
                <Body size="lg" weight="strong" color="default">
                  {item.price}
                </Body>
              </div>
            )}

            {item.credits !== null ? (
              <div>
                <Body size="sm" weight="weak" color="weak">
                  {t("itemDetailDrawer.credits")}
                </Body>
                <Body size="lg" weight="strong" color="default">
                  {item.credits}
                </Body>
              </div>
            ) : null}

            <Button
              kind="default"
              label={t("itemDetailDrawer.seeDetails")}
              intent="default"
              color="main"
              iconRight="link-external-02"
              size="md"
              className="w-fit"
              onClick={() => {
                let nextLocation: string = "/";
                if (item.variant === ITEM_VARIANTS.webshopItem) {
                  nextLocation = `/shop/${item.id}`;
                }
                if (item.variant === ITEM_VARIANTS.appointmentPass) {
                  nextLocation = `/private-service/pass/${item.id}`;
                }
                if (item.variant === ITEM_VARIANTS.pass) {
                  nextLocation = `/payment-pack/${item.id}`;
                }
                window.location.assign(nextLocation);
              }}
            />
          </div>
        </>
      ) : null}
    </DetailDrawer>
  );
};
