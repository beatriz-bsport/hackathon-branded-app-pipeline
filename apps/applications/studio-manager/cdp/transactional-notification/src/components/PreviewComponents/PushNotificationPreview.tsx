import { Body, Card } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type PushNotificationPreviewProps = {
  sender: string;
  title: string;
  content: string;
  noContentMessage?: string;
  // Todo : We might want to enforce usage of the date time management package when this will become a business component.
  dateTime?: string;
};

export const PushNotificationPreview: React.FC<
  PushNotificationPreviewProps
> = ({
  title,
  content,
  sender,
  noContentMessage,
  dateTime,
}: PushNotificationPreviewProps) => {
  const { t } = useTranslation("transactionalNotification");
  return (
    <Card className="flex flex-col min-h-[180px] bg-surface-default-weaker border-none justify-center">
      {title || content ? (
        <Card className="w-[60%] self-center">
          <div className="flex flex-col gap-xs">
            <div className="flex flex-row justify-between">
              <Body
                className="max-w-[75%]"
                htmlVariant="p"
                weight="weak"
                color="weaker"
                size="md"
              >
                {sender}
              </Body>
              <Body htmlVariant="p" weight="weak" color="weaker" size="md">
                {dateTime}
              </Body>
            </div>
            <div className="flex flex-col gap-sm">
              <Body htmlVariant="p" weight="stronger" color="weak" size="md">
                {title}
              </Body>
              <Body htmlVariant="p" color="weak" size="md">
                {content}
              </Body>
            </div>
          </div>
        </Card>
      ) : (
        <Body
          className="my-auto text-center"
          htmlVariant="p"
          weight="weak"
          color="weak"
          size="md"
        >
          {noContentMessage ||
            t(
              "notificationRuleEventDetails.details.pushNotification.preview.noPreview",
            )}
        </Body>
      )}
    </Card>
  );
};
