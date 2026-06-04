import React from "react";

import type { CommunicationPreviewRecipientsRequest } from "@bsport/api-cdp/communicate";
import { CommunicationChannel } from "@bsport/api-cdp/smartlist";
import { Body, Loader, Title } from "@bsport/kaizen-primitive-core";

import { useFetchCommunicationRecipientsPreviewCount } from "#src/api/use-fetch-communication-recipients-preview-count";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { useTranslation } from "#src/utils/i18n";

type RecipientTarget = Extract<
  CommunicationPreviewRecipientsRequest["target"],
  { type: "smartlist" | "segment" }
>;

type RecipientCountPreviewTargetProps =
  | {
      smartlistId: number;
      target?: never;
    }
  | {
      smartlistId?: never;
      target: RecipientTarget;
    };

type RecipientCountPreviewProps = {
  isMarketing: boolean;
} & RecipientCountPreviewTargetProps;

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
  target,
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
          {target !== undefined ? (
            <RecipientCount target={target} isMarketing={isMarketing} />
          ) : (
            <RecipientCount
              smartlistId={smartlistId}
              isMarketing={isMarketing}
            />
          )}
        </QueryBoundary>
        <TimedInfoPopover
          label={t("email.creation.expectedRecipients.infoLabel")}
          anchorClassName="flex items-center"
        >
          <section
            className="flex flex-col max-w-sm p-md gap-md"
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
          </section>
        </TimedInfoPopover>
      </div>
    </div>
  );
};

const hasSmartlistId = (smartlistId?: number): smartlistId is number =>
  typeof smartlistId === "number";

const hasRecipientTarget = (
  target?: RecipientTarget,
): target is RecipientTarget => target !== undefined;

const getRecipientTarget = ({
  smartlistId,
  target,
}: RecipientCountPreviewTargetProps): RecipientTarget => {
  if (hasRecipientTarget(target)) {
    return target;
  }

  if (hasSmartlistId(smartlistId)) {
    return { type: "smartlist", smartlist_id: smartlistId };
  }

  throw new Error("Expected recipient target to be defined");
};

const buildRecipientCountRequest = ({
  isMarketing,
  target,
}: {
  isMarketing: boolean;
  target: RecipientTarget;
}): CommunicationPreviewRecipientsRequest => {
  switch (target.type) {
    case "smartlist":
      return {
        channel: CommunicationChannel.EMAIL,
        is_marketing: isMarketing,
        target,
      };
    case "segment":
      return {
        channel: CommunicationChannel.EMAIL,
        is_marketing: isMarketing,
        target,
      };
  }
};

const RecipientCount = (props: RecipientCountPreviewProps) => {
  const recipientTarget = getRecipientTarget(props);
  const request = buildRecipientCountRequest({
    isMarketing: props.isMarketing,
    target: recipientTarget,
  });

  const { data: recipientsCount } =
    useFetchCommunicationRecipientsPreviewCount(request);

  return (
    <Body htmlVariant="p" size="lg" weight="strong">
      {recipientsCount?.count ?? 0}
    </Body>
  );
};
