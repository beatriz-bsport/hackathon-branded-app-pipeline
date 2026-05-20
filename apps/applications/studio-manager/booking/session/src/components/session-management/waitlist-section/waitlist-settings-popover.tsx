import { FC } from "react";

import { AutoCancellationType, WaitingListDynamic } from "@bsport/api-book";
import {
  Body,
  Button,
  Divider,
  Icon,
  IconName,
  Loader,
  Popover,
  Title,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useFetchWaitingListConfiguration } from "#src/hooks/waitlist/use-fetch-waitlist-configuration";
import { useTranslation } from "#src/utils/i18n";

const MAX_WIDTH_PX = 500;

const Setting: FC<{
  title: string;
  description: string;
  icon: IconName;
}> = ({ title, description, icon }) => {
  return (
    <div className="flex gap-xs">
      <Icon icon={icon} size="sm" className="shrink-0 mt-2xs" />
      <div className="flex flex-col gap-2xs">
        <Body>{title}</Body>
        <Body color="weaker">{description}</Body>
      </div>
    </div>
  );
};

const WaitlistSettings: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const { data: waitlistConfig } = useFetchWaitingListConfiguration();

  const displayGeneralSettings =
    waitlistConfig?.is_option_blocking || waitlistConfig?.check_credit;

  const isOneByOne = waitlistConfig?.dynamic === WaitingListDynamic.ONE_BY_ONE;

  const isFirstComeFirstServed =
    waitlistConfig?.dynamic === WaitingListDynamic.FIRST_COME_FIRST_SERVED;

  return (
    <div className="flex flex-col justify-start gap-md p-xs">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("waitlistSettings.title")}
        </Title>
        <Divider weight="thin" />
      </div>
      <div className="flex flex-col gap-md">
        {displayGeneralSettings && (
          <>
            <Title htmlVariant="h5" weight="strong">
              {t("waitlistSettings.general")}
            </Title>
            {waitlistConfig.is_option_blocking && (
              <Setting
                description={t("waitlistSettings.isOptionBlocking.description")}
                icon="lock-01"
                title={t("waitlistSettings.isOptionBlocking.title")}
              />
            )}
            {waitlistConfig.check_credit && (
              <Setting
                description={t("waitlistSettings.checkCredit.description")}
                icon="ticket-01"
                title={t("waitlistSettings.checkCredit.title")}
              />
            )}
            <Divider weight="thin" />
          </>
        )}
        <Title htmlVariant="h5" weight="strong">
          {t("waitlistSettings.priorityManagement")}
        </Title>
        {isFirstComeFirstServed && (
          <Setting
            description={t("waitlistSettings.firstComeFirstServed.description")}
            icon="zap-fast"
            title={t("waitlistSettings.firstComeFirstServed.title")}
          />
        )}
        {isOneByOne && (
          <>
            <Setting
              description={t("waitlistSettings.oneByOne.description")}
              icon="one-by-one"
              title={t("waitlistSettings.oneByOne.title")}
            />
            {waitlistConfig.auto_cancellation_type !==
              AutoCancellationType.NONE && (
              <Setting
                description={
                  waitlistConfig.auto_cancellation_type ===
                  AutoCancellationType.DUMB
                    ? t("waitlistSettings.autokickDelay.description.simple", {
                        autokick_delay: waitlistConfig.autokick_delay,
                        dumb_delay_minutes: waitlistConfig.dumb_delay_minutes,
                      })
                    : t("waitlistSettings.autokickDelay.description.smart", {
                        autokick_delay: waitlistConfig.autokick_delay,
                        smart_delay_percentage:
                          waitlistConfig.smart_delay_percentage,
                      })
                }
                icon="bell-03"
                title={t("waitlistSettings.autokickDelay.title", {
                  autokick_delay: waitlistConfig.autokick_delay,
                })}
              />
            )}
            {waitlistConfig.auto_consume_pack && (
              <Setting
                description={t("waitlistSettings.autoConsumePack.description", {
                  last_delay_before_auto_consume:
                    waitlistConfig.last_delay_before_auto_consume,
                  count: waitlistConfig.last_delay_before_auto_consume,
                })}
                icon="check-circle"
                title={t("waitlistSettings.autoConsumePack.title")}
              />
            )}
            {waitlistConfig.kick_if_no_pack_when_auto_consume && (
              <Setting
                description={t("waitlistSettings.kickIfNoPack.description")}
                icon="x-circle"
                title={t("waitlistSettings.kickIfNoPack.title")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const WaitlistSettingsPopover: FC = () => {
  const { t } = useTranslation("sessionManagement");
  return (
    <QueryBoundary loadingFallback={<Loader size="md" />}>
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              kind="icon-button"
              icon="info-circle"
              onClick={(event) => {
                event.stopPropagation();
                setIsPopoverOpened(true);
              }}
              size="sm"
              intent="flat"
              color="default"
              label={t("waitlistSettings.title")}
            />
          )}
        </Popover.Anchor>
        <Popover.Content placement="bottom-left" maxWidthPx={MAX_WIDTH_PX}>
          {() => <WaitlistSettings />}
        </Popover.Content>
      </Popover>
    </QueryBoundary>
  );
};
