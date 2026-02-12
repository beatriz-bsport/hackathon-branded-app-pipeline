import { FC } from "react";
import { NavLink } from "react-router";

import type { SessionWithActivity } from "@bsport/api-book";
import { DetailsLayout, Tabs, TabsProps } from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const Header: FC<{ session: SessionWithActivity }> = ({ session }) => {
  const { t } = useTranslation("sessionDetails");
  const { getEditUrl } = useUrls();

  const TABS_CONFIG = [
    {
      id: "session-details-editor-view-tab",
      to: getEditUrl(session.id),
      label: t("tabs.editor"),
    },
  ];

  const tabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map(({ id, to, label }) => (
      <NavLink to={to} id={id} key={id} end={true}>
        {({ isActive }) => (
          <Tabs.Item id={id} label={label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  return (
    <DetailsLayout.Header
      // TODO: replace with watch(<session name field>) when the form is implemented
      pageTitle={session.name_override || session.name}
      pageTabs={tabsConfig}
    />
  );
};
