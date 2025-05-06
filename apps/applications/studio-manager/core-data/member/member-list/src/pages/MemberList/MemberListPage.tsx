import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";

import { useMemberFilters } from "#src/hooks/useMemberFilters";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MemberListContent } from "./MemberListContent";

export const MemberListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const { filterConfig, handleClearFilters, activeFilters } =
    useMemberFilters();

  const navigate = useNavigate();

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
              onClick={() => navigate(ROUTES.ARCHIVED)}
            />
          </Tooltip>,
        ]}
      />
      <ListLayout.Content>
        <MemberListContent
          onClearFiltersClick={handleClearFilters}
          activeFilters={activeFilters}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
