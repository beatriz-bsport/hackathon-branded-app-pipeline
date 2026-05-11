import { type FC, useCallback } from "react";
import { useSearchParams } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { ClassDetailHeader } from "#src/components/class-detail/class-detail-header";
import { useTranslation } from "#src/utils/i18n";

const VALID_TABS = ["editor", "compatiblePasses"] as const;
type ClassDetailTab = (typeof VALID_TABS)[number];

const getActiveTab = (raw: string | null): ClassDetailTab =>
  (VALID_TABS as readonly string[]).includes(raw ?? "")
    ? (raw as ClassDetailTab)
    : "editor";

type ClassDetailShellProps = {
  metaActivity: MetaActivity;
};

export const ClassDetailShell: FC<ClassDetailShellProps> = ({
  metaActivity,
}) => {
  const { t } = useTranslation("class-detail");
  const { detailsLayoutProps } = useDetailsLayout();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const pageTabs = {
    value: activeTab,
    onValueChange: handleTabChange,
    orientation: "horizontal" as const,
    tabs: [
      { id: "editor", label: t("classDetail.tabs.editor") },
      { id: "compatiblePasses", label: t("classDetail.tabs.compatiblePasses") },
    ],
  };

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <ClassDetailHeader metaActivity={metaActivity} pageTabs={pageTabs} />
      <DetailsLayout.Content>
        {activeTab === "editor" && <EditorTabPlaceholder />}
        {activeTab === "compatiblePasses" && <CompatiblePassesPlaceholder />}
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

const EditorTabPlaceholder: FC = () => null;
const CompatiblePassesPlaceholder: FC = () => null;
