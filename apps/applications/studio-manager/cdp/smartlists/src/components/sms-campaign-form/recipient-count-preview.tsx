import React from "react";

import { Body, Loader, Title } from "@bsport/kaizen-primitive-core";

import { CommunicationChannel } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreviewCount } from "#src/api/use-fetch-communication-recipients-preview-count";
import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";

type SmsRecipientCountPreviewProps = {
  smartlistId: number;
};

const RECIPIENT_COUNT_POPOVER_CONTENT_LIST_KEYS: Array<
  "noValidPhone" | "optedOut" | "invalidPhone" | "smartlistChanges"
> = ["noValidPhone", "optedOut", "invalidPhone", "smartlistChanges"];

export const SmsRecipientCountPreview: React.FC<
  SmsRecipientCountPreviewProps
> = ({ smartlistId }: SmsRecipientCountPreviewProps) => {
  const { t } = useTranslation("campaign");

  return (
    <div className="flex flex-col gap-xs">
      <Body htmlVariant="p" size="md" weight="weak" color="weak">
        {t("sms.creation.expectedRecipients.label")}
      </Body>
      <div className="flex flex-row items-center gap-xs">
        <QueryBoundary loadingFallback={<Loader size="sm" />}>
          <SmsRecipientCount smartlistId={smartlistId} />
        </QueryBoundary>
        <TimedInfoPopover
          label={t("sms.creation.expectedRecipients.infoLabel")}
          buttonColor="main"
        >
          <section
            className="flex flex-col max-w-sm p-md gap-md"
            aria-labelledby="sms-recipient-count-popover-title"
          >
            <div className="flex flex-col gap-xs">
              <Title
                id="sms-recipient-count-popover-title"
                htmlVariant="h4"
                weight="strong"
              >
                {t("sms.creation.expectedRecipients.popover.title")}
              </Title>
              <Body htmlVariant="p" size="md" weight="weak" color="weak">
                {t("sms.creation.expectedRecipients.popover.intro")}
              </Body>
            </div>
            <div className="flex flex-col gap-xs">
              <Body
                id="sms-recipient-count-popover-list-intro"
                htmlVariant="p"
                size="md"
                weight="weak"
                color="weak"
              >
                {t("sms.creation.expectedRecipients.popover.listIntro")}
              </Body>
              <ul
                className="list-disc pl-lg flex flex-col gap-xs"
                aria-labelledby="sms-recipient-count-popover-list-intro"
              >
                {RECIPIENT_COUNT_POPOVER_CONTENT_LIST_KEYS.map((key) => (
                  <li key={key}>
                    <Body htmlVariant="span" size="md" weight="weak">
                      {t(
                        `sms.creation.expectedRecipients.popover.exclusions.${key}.description`,
                      )}
                      <br></br>
                      <Body
                        htmlVariant="span"
                        size="md"
                        weight="weak"
                        color="weak"
                      >
                        {t(
                          `sms.creation.expectedRecipients.popover.exclusions.${key}.example`,
                        )}
                      </Body>
                    </Body>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </TimedInfoPopover>
      </div>
    </div>
  );
};

const SmsRecipientCount = ({ smartlistId }: SmsRecipientCountPreviewProps) => {
  const { data: recipientsCount } = useFetchCommunicationRecipientsPreviewCount(
    {
      channel: CommunicationChannel.SMS,
      is_marketing: true,
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
