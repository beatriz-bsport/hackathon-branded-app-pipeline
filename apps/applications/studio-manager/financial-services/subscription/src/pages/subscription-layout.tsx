import type { FC } from "react";
import { NavLink, Outlet } from "react-router";

import {
  ListLayout,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const SubscriptionLayout: FC = () => {
  const { t } = useTranslation("subscription");

  const tabsConfig: TabsProps = {
    TabsItems: [
      <NavLink to="plan" end key="plan">
        {({ isActive }) => (
          <Tabs.Item label={t("tabs.plan")} isActive={isActive} id="plan" />
        )}
      </NavLink>,
      <NavLink to="addons" end key="addons">
        {({ isActive }) => (
          <Tabs.Item label={t("tabs.addons")} isActive={isActive} id="addons" />
        )}
      </NavLink>,
      <NavLink to="billing" end key="billing">
        {({ isActive }) => (
          <Tabs.Item
            label={t("tabs.billing")}
            isActive={isActive}
            id="billing"
          />
        )}
      </NavLink>,
    ],
    orientation: "horizontal",
  };

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("title")} pageTabs={tabsConfig} />
      <ListLayout.Content>
        <Outlet />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default SubscriptionLayout;
