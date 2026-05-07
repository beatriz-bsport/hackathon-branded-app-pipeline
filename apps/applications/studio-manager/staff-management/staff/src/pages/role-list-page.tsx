import type { FC } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  ListLayout,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const RoleListPageContent: FC = () => {
  const { t } = useTranslation("role-list");
  const { EmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: {
      title: t("emptyState.title"),
      subtitle: t("emptyState.subtitle"),
      ctaButtonConfig: {
        label: t("emptyState.cta"),
        iconLeft: "plus",
        disabled: true,
        onClick: () => undefined,
      },
    },
  });

  return (
    <div className="flex h-full min-h-96 items-center justify-center p-md">
      <EmptyState />
    </div>
  );
};

const RoleListPage: FC = () => {
  const { t } = useTranslation("role-list");
  const navigate = useNavigate();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        endGroupActions={[
          <Button
            key="to-staff"
            intent="default"
            color="main"
            kind="default"
            size="md"
            label={t("page.toStaff")}
            onClick={() => navigate(URLS.INDEX)}
          />,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <RoleListPageContent />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default RoleListPage;
