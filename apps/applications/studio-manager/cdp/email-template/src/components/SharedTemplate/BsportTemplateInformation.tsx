import { Avatar, Body, Button, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const BsportTemplateInformation = () => {
  const { t } = useTranslation("list");
  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            intent="default"
            color="main"
            size="md"
            iconLeft="alert-circle"
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
                {t("activeList.bsportTemplateInfo.title")}
              </Body>
            </div>
            <Body htmlVariant="p" color="default" weight="weak">
              {t("activeList.bsportTemplateInfo.description.firstStep")}
            </Body>
            <Body htmlVariant="p" color="default" weight="weak">
              {t("activeList.bsportTemplateInfo.description.secondStep")}
            </Body>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
