import { type FC, useCallback } from "react";
import { useSearchParams } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  DetailsLayout,
  Tabs,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

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
  metaActivity: _metaActivity,
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

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Content>
        <Tabs
          orientation="horizontal"
          value={activeTab}
          onValueChange={handleTabChange}
          tabs={[
            { id: "editor", label: t("classDetail.tabs.editor") },
            {
              id: "compatiblePasses",
              label: t("classDetail.tabs.compatiblePasses"),
            },
          ]}
        />
        {activeTab === "editor" && <EditorTabPlaceholder />}
        {activeTab === "compatiblePasses" && <CompatiblePassesPlaceholder />}
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

const EditorTabPlaceholder: FC = () => null;
const CompatiblePassesPlaceholder: FC = () => null;
