import {
  Body,
  Icon,
  Loader,
  Popover,
  Title,
} from "@bsport/kaizen-primitive-core";

import { CommunicationChannel } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreviewCount } from "#src/api/use-fetch-communication-recipients-preview-count";
import { useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";

type RecipientCountPreviewProps = {
  smartlistId: number;
  isMarketing: boolean;
};

const RECIPIENT_COUNT_POPOVER_CONTENT_LIST_KEYS: Array<
  | "noValidContact"
  | "optedOut"
  | "invalidEmail"
  | "systemEmails"
  | "smartlistChanges"
> = [
  "noValidContact",
  "optedOut",
  "invalidEmail",
  "systemEmails",
  "smartlistChanges",
];

export const RecipientCountPreview: React.FC<RecipientCountPreviewProps> = ({
  smartlistId,
  isMarketing,
}: RecipientCountPreviewProps) => {
  const { t } = useTranslation("campaign");

  return (
    <div className="flex flex-col gap-xs">
      <Body htmlVariant="p" size="md" weight="weak" color="weak">
        {t("email.creation.expectedRecipients.label")}
      </Body>
      <div className="flex flex-row items-center gap-xs">
        <QueryBoundary loadingFallback={<Loader size="sm" />}>
          <RecipientCount smartlistId={smartlistId} isMarketing={isMarketing} />
        </QueryBoundary>
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Icon
                icon="info-circle"
                size="sm"
                aria-label={t("email.creation.expectedRecipients.infoLabel")}
                onMouseEnter={() => setIsPopoverOpened(true)}
                onMouseLeave={() => setIsPopoverOpened(false)}
                className="cursor-pointer"
              />
            )}
          </Popover.Anchor>
          <Popover.Content>
            {() => (
              <div
                className="flex flex-col max-w-sm p-md gap-md"
                role="region"
                aria-labelledby="recipient-count-popover-title"
              >
                <div className="flex flex-col gap-xs">
                  <Title
                    id="recipient-count-popover-title"
                    htmlVariant="h4"
                    weight="strong"
                  >
                    {t("email.creation.expectedRecipients.popover.title")}
                  </Title>
                  <Body htmlVariant="p" size="md" weight="weak" color="weak">
                    {t("email.creation.expectedRecipients.popover.intro")}
                  </Body>
                </div>
                <div className="flex flex-col gap-xs">
                  <Body
                    id="recipient-count-popover-list-intro"
                    htmlVariant="p"
                    size="md"
                    weight="weak"
                    color="weak"
                  >
                    {t("email.creation.expectedRecipients.popover.listIntro")}
                  </Body>
                  <ul
                    className="list-disc pl-lg flex flex-col gap-xs"
                    aria-labelledby="recipient-count-popover-list-intro"
                  >
                    {RECIPIENT_COUNT_POPOVER_CONTENT_LIST_KEYS.map((key) => (
                      <li key={key}>
                        <Body htmlVariant="span" size="md" weight="weak">
                          {t(
                            `email.creation.expectedRecipients.popover.exclusions.${key}.description`,
                          )}
                          <br></br>
                          <Body
                            htmlVariant="span"
                            size="md"
                            weight="weak"
                            color="weak"
                          >
                            {t(
                              `email.creation.expectedRecipients.popover.exclusions.${key}.example`,
                            )}
                          </Body>
                        </Body>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
};

const RecipientCount = ({
  smartlistId,
  isMarketing,
}: RecipientCountPreviewProps) => {
  const { data: recipientsCount } = useFetchCommunicationRecipientsPreviewCount(
    {
      channel: CommunicationChannel.EMAIL,
      is_marketing: isMarketing,
      target: {
        type: "smartlist",
        smartlist_id: smartlistId,
      },
    },
  );

  return (
    <Body htmlVariant="p" size="lg" weight="strong">
      {recipientsCount?.count ?? 0}
    </Body>
  );
};
