import React, { useCallback, useEffect, useRef } from "react";

import {
  Body,
  Button,
  Loader,
  Popover,
  Title,
} from "@bsport/kaizen-primitive-core";

import { CommunicationChannel } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreviewCount } from "#src/api/use-fetch-communication-recipients-preview-count";
import { useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";

type SmsRecipientCountPreviewProps = {
  smartlistId: number;
};

const RECIPIENT_COUNT_POPOVER_CONTENT_LIST_KEYS: Array<
  "noValidPhone" | "optedOut" | "invalidPhone" | "smartlistChanges"
> = ["noValidPhone", "optedOut", "invalidPhone", "smartlistChanges"];

const RECIPIENT_COUNT_POPOVER_CLOSE_DELAY_MS = 150;

export const SmsRecipientCountPreview: React.FC<
  SmsRecipientCountPreviewProps
> = ({ smartlistId }: SmsRecipientCountPreviewProps) => {
  const { t } = useTranslation("campaign");
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null) {
      return;
    }

    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const handlePopoverOpen = useCallback(() => {
    clearCloseTimeout();
  }, [clearCloseTimeout]);

  const handlePopoverClose = useCallback(
    (setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>) => {
      clearCloseTimeout();
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpened(false);
        closeTimeoutRef.current = null;
      }, RECIPIENT_COUNT_POPOVER_CLOSE_DELAY_MS);
    },
    [clearCloseTimeout],
  );

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  return (
    <div className="flex flex-col gap-xs">
      <Body htmlVariant="p" size="md" weight="weak" color="weak">
        {t("sms.creation.expectedRecipients.label")}
      </Body>
      <div className="flex flex-row items-center gap-xs">
        <QueryBoundary loadingFallback={<Loader size="sm" />}>
          <SmsRecipientCount smartlistId={smartlistId} />
        </QueryBoundary>
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                kind="icon-button"
                intent="flat"
                color="main"
                size="md"
                icon="info-circle"
                label={t("sms.creation.expectedRecipients.infoLabel")}
                onMouseEnter={() => {
                  handlePopoverOpen();
                  setIsPopoverOpened(true);
                }}
                onMouseLeave={() => handlePopoverClose(setIsPopoverOpened)}
                onFocus={() => {
                  handlePopoverOpen();
                  setIsPopoverOpened(true);
                }}
                onBlur={() => handlePopoverClose(setIsPopoverOpened)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content>
            {({ setIsPopoverOpened }) => (
              <section
                className="flex flex-col max-w-sm p-md gap-md"
                aria-labelledby="sms-recipient-count-popover-title"
                onMouseEnter={() => {
                  handlePopoverOpen();
                  setIsPopoverOpened(true);
                }}
                onMouseLeave={() => handlePopoverClose(setIsPopoverOpened)}
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
            )}
          </Popover.Content>
        </Popover>
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
