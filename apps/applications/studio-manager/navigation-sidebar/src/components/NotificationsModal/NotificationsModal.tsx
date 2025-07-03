import React, { useState } from "react";

import { Modal, Tabs } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { BillingTab } from "./BillingTab";
import { CompanyOnboardingTab } from "./CompanyOnboardingTab";
import { OrdersTab } from "./OrdersTab";
import { TasksTab } from "./TasksTab";
import { TutorialsTab } from "./TutorialsTab";
import UnpaidAppointmentsTab from "./UnpaidAppointmentsTab";
import type { NotificationTab, NotificationsModalProps } from "./types";

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("default");
  const [activeTab, setActiveTab] = useState<NotificationTab>("billing");

  const tabs = [
    { id: "billing", label: t("notifications.tabs.billing") },
    { id: "orders", label: t("notifications.tabs.orders") },
    { id: "tasks", label: t("notifications.tabs.tasks") },
    {
      id: "company-onboarding",
      label: t("notifications.tabs.companyOnboarding"),
    },
    {
      id: "unpaid-appointments",
      label: t("notifications.tabs.unpaidAppointments"),
    },
    { id: "tutorials", label: t("notifications.tabs.tutorials") },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "billing":
        return <BillingTab />;
      case "orders":
        return <OrdersTab />;
      case "tasks":
        return <TasksTab />;
      case "company-onboarding":
        return <CompanyOnboardingTab />;
      case "unpaid-appointments":
        return <UnpaidAppointmentsTab />;
      case "tutorials":
        return <TutorialsTab />;
      default:
        return null;
    }
  };

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
      <div className="mt-4 min-h-[480px]">{renderTabContent()}</div>
    </Modal>
  );
};
