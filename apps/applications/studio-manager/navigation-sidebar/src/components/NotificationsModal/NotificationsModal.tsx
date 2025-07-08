import React, { useState } from "react";

import {
  Body,
  Illustration,
  Modal,
  Tabs,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { GenericNotificationTab } from "./GenericNotificationTab";
import type {
  NotificationTab,
  NotificationsModalProps,
  TabConfiguration,
} from "./types";
import { useNotificationTabs } from "./use-notification-tabs";

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("default");
  const { availableTabs: tabs, tabConfigurations } = useNotificationTabs();

  const defaultTab =
    tabs.length > 0 ? (tabs[0].id as NotificationTab) : "billing";
  const [activeTab, setActiveTab] = useState<NotificationTab>(defaultTab);

  const onModalClose = () => {
    onClose();
    setActiveTab(defaultTab);
  };

  const activeConfig = tabConfigurations[
    activeTab
  ] as unknown as TabConfiguration;

  return (
    <Modal
      title={t("notifications.title")}
      open={isOpen}
      onClose={onModalClose}
      size="lg"
    >
      {tabs.length > 0 ? (
        <>
          <Tabs
            orientation="horizontal"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as NotificationTab)}
            tabs={tabs}
          />
          <div className="mt-4 min-h-[480px]">
            <GenericNotificationTab config={activeConfig} />
          </div>
        </>
      ) : (
        <div className="mt-4 min-h-[480px] flex flex-col gap-4 items-center justify-center text-center p-8">
          <Illustration name="empty" size="xl" />
          <Title htmlVariant="h3" weight="stronger" color="weak">
            {t("notifications.empty.title")}
          </Title>
          <Body variant="body-medium" color="weak" className=" max-w-sm">
            {t("notifications.empty.description")}
          </Body>
        </div>
      )}
    </Modal>
  );
};
