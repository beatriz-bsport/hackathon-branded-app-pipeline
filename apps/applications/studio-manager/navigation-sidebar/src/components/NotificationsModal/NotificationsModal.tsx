import React, { useState } from "react";

import { Modal, Tabs } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { GenericNotificationTab } from "./GenericNotificationTab";
import { tabConfigurations } from "./tabConfigurations";
import type {
  NotificationTab,
  NotificationsModalProps,
  TabConfiguration,
} from "./types";

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("default");
  const [activeTab, setActiveTab] = useState<NotificationTab>("billing");

  const tabs = Object.values(tabConfigurations).map((config) => ({
    id: config.id,
    label: config.label,
  }));

  const activeConfig = tabConfigurations[
    activeTab
  ] as unknown as TabConfiguration;

  return (
    <Modal
      title={t("notifications.title")}
      open={isOpen}
      onClose={onClose}
      size="lg"
    >
      <Tabs
        orientation="horizontal"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as NotificationTab)}
        tabs={tabs}
      />
      <div className="mt-4 min-h-[480px]">
        {activeConfig && <GenericNotificationTab config={activeConfig} />}
      </div>
    </Modal>
  );
};
