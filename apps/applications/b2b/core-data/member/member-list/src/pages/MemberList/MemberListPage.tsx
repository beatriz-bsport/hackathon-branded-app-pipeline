import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { MemberListContent } from "./MemberListContent";
import { useMemberFilters } from "#src/hooks/useMemberFilters";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { filterConfig, handleClearFilters, activeFilters } =
    useMemberFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.memberList")}
        filterConfig={filterConfig}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("actions.addMember")}
            onClick={() => console.log("Navigate to create member page")}
          />
        }
        endGroupActions={[
          <Tooltip
            key="bt-navigate-to-archive-page"
            label={t("pages.archivedMemberList")}
            placement="bottom-left"
          >
            <Button
              iconLeft="box"
              intent="default"
              color="main"
              size="md"
              onClick={() => window.location.assign("/archived")}
            />
          </Tooltip>,
        ]}
      />
      <ListLayout.Content className="hide-scrollbar h-full">
        <MemberListContent
          onClearFiltersClick={handleClearFilters}
          activeFilters={activeFilters}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
