import { type FC } from "react";
import { useNavigate } from "react-router";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { List, useEmptyState } from "@bsport/kaizen-primitive-core";

import { PassFlagChips } from "#src/components/class-detail/pass-flag-chips";
import { useCompatiblePasses } from "#src/hooks/use-compatible-passes";
import { PASSES_URL } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type CompatiblePassesTabProps = {
  metaActivityId: number;
};

export const CompatiblePassesTab: FC<CompatiblePassesTabProps> = ({
  metaActivityId,
}) => {
  const { t } = useTranslation("class-detail");
  const navigate = useNavigate();
  const { groups, count, archivedPasses, archivedCount } =
    useCompatiblePasses(metaActivityId);

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: count === 0,
    emptyConfig: {
      title: t("classDetail.compatiblePasses.empty.title"),
      subtitle: t("classDetail.compatiblePasses.empty.description"),
      ctaButtonConfig: {
        label: t("classDetail.compatiblePasses.empty.cta"),
        iconRight: "link-external-02",
        onClick: () => navigate(PASSES_URL),
      },
    },
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <div className="flex flex-col gap-lg">
      {groups.map(({ category, passes }) => {
        const label =
          category?.name ?? t("classDetail.compatiblePasses.uncategorized");
        const groupId = `compatible-passes-${category?.id ?? "uncategorized"}`;
        return (
          <List
            key={groupId}
            id={groupId}
            header={{
              id: `${groupId}-header`,
              title: `${label} (${passes.length})`,
            }}
            collapsibleProps={{ initiallyOpen: true }}
            items={passes.map((pass) => ({
              id: String(pass.id),
              title: pass.name,
              description: getCurrencyDisplayWithPrice(
                typeof pass.price === "number"
                  ? pass.price
                  : pass.price.parsedValue,
              ),
              customNode: <PassFlagChips pass={pass} />,
            }))}
          />
        );
      })}
      {archivedCount > 0 && (
        <List
          id="compatible-passes-archived"
          header={{
            id: "compatible-passes-archived-header",
            title: `${t("classDetail.compatiblePasses.archived.title")} (${archivedCount})`,
            description: t("classDetail.compatiblePasses.archived.description"),
          }}
          collapsibleProps={{ initiallyOpen: false }}
          items={archivedPasses.map((pass) => ({
            id: String(pass.id),
            title: pass.name,
            description: getCurrencyDisplayWithPrice(
              typeof pass.price === "number"
                ? pass.price
                : pass.price.parsedValue,
            ),
            customNode: <PassFlagChips pass={pass} />,
          }))}
        />
      )}
    </div>
  );
};
