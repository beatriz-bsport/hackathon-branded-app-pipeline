import { useEffect } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import {
  DetailsLayout,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const DetailsPage = () => {
  const { t } = useTranslation("details");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { detailsLayoutProps } = useDetailsLayout();

  const tabsConfig_items = [
    {
      id: "smartlist-parameters-tab",
      path: "parameter",
      label: t("tabs.parameters"),
    },
    {
      id: "smartlist-campaigns-tab",
      path: "campaign",
      label: t("tabs.campaigns"),
    },
    {
      id: "smartlist-automations-tab",
      path: "automation",
      label: t("tabs.automations"),
    },
  ];

  useEffect(() => {
    const isAtBasePath = location.pathname === `/${id}`;

    if (isAtBasePath) {
      navigate("parameter", { replace: true });
    }
  }, [id, location.pathname, navigate]);

  const tabsConfig: TabsProps = {
    TabsItems: tabsConfig_items.map((tab) => (
      <NavLink to={`/${id}/${tab.path}`} id={tab.id} key={tab.id} end>
        {({ isActive }) => (
          <Tabs.Item id={tab.id} label={tab.label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle="Smartlist Details"
        pageTabs={tabsConfig}
      />
      <DetailsLayout.Content>
        <Outlet />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
