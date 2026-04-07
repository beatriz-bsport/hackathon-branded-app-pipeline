import { Body, Button, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const PayoutInformation = () => {
  const { t } = useTranslation("payout");

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            intent="default"
            color="main"
            size="md"
            kind="icon-button"
            icon="alert-circle"
            label={t("payoutInformation.label")}
            onMouseOver={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {() => (
          <div className="max-w-[340px] p-md">
            <Body htmlVariant="p" color="default" weight="weak">
              {t("payoutInformation.description")}
            </Body>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
