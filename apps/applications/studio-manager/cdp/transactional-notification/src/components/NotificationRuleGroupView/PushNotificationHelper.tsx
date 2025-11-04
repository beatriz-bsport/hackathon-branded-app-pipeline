import { Avatar, Body, Button, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const PushNotificationHelper = ({ id }: { id: string }) => {
  const { t } = useTranslation("transactionalNotification");
  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            id={id}
            intent="default"
            color="main"
            size="md"
            kind="icon-button"
            icon="alert-circle"
            label={t(
              "notificationRuleEventDetails.table.tooltip.pushNotificationHelper.label",
            )}
            onMouseOver={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {() => (
          <div
            id={`${id}-content`}
            className="flex flex-col gap-y-sm max-w-[340px] p-md"
          >
            <div className="flex flex-row items-center gap-x-xs">
              <Avatar
                className="text-onsurface-main-weak bg-surface-main-weak"
                shape="squared"
                size="md"
                iconName="alert-circle"
              />
              <Body className="text-2xl" htmlVariant="p" weight="stronger">
                {t(
                  "notificationRuleEventDetails.table.tooltip.pushNotificationHelper.title",
                )}
              </Body>
            </div>
            <Body htmlVariant="p" color="default" weight="weak">
              {t(
                "notificationRuleEventDetails.table.tooltip.pushNotificationHelper.message",
              )}
            </Body>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
