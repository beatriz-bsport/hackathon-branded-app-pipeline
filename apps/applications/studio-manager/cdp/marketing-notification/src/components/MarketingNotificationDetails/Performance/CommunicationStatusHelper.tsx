import {
  Avatar,
  Body,
  Button,
  Chip,
  ChipProps,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type StatusChip = {
  title: string;
  description: string;
  color: ChipProps["color"];
};

export const CommunicationStatusHelper = () => {
  const { t } = useTranslation("marketingNotificationDetails");
  const statusMap: StatusChip[] = [
    {
      title: t("drawer.performance.allNotifications.helper.status.sent.label"),
      description: t(
        "drawer.performance.allNotifications.helper.status.sent.description",
      ),
      color: "positive",
    },
    {
      title: t(
        "drawer.performance.allNotifications.helper.status.opened.label",
      ),
      description: t(
        "drawer.performance.allNotifications.helper.status.opened.description",
      ),
      color: "main",
    },
    {
      title: t(
        "drawer.performance.allNotifications.helper.status.failed.label",
      ),
      description: t(
        "drawer.performance.allNotifications.helper.status.failed.description",
      ),
      color: "critical",
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("drawer.performance.allNotifications.helper.title")}
            icon="alert-circle"
            intent="default"
            color="main"
            size="md"
            onMouseOver={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {() => (
          <div className="flex flex-col gap-y-sm max-w-[340px] p-md">
            <div className="flex flex-row items-center gap-x-xs">
              <Avatar
                className="text-onsurface-main-weak bg-surface-main-weak"
                shape="squared"
                size="md"
                iconName="alert-circle"
              />
              <Body className="text-2xl" htmlVariant="p" weight="stronger">
                {t("drawer.performance.allNotifications.helper.title")}
              </Body>
            </div>
            <Body htmlVariant="p" color="default" weight="weak" size="sm">
              {t("drawer.performance.allNotifications.helper.content")}
            </Body>
            <div className="flex flex-col gap-xs m-2xs">
              {statusMap.map((status) => (
                <div
                  key={status.title}
                  className="flex flex-row gap-xs items-center"
                >
                  <Chip
                    className="w-[70px]"
                    color={status.color}
                    size="lg"
                    type="weak"
                    label={status.title}
                  />
                  <Body htmlVariant="p" color="default" weight="weak" size="sm">
                    {status.description}
                  </Body>
                </div>
              ))}
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
