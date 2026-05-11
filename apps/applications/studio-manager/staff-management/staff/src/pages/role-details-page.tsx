import { useSuspenseQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { Link, Navigate, useParams } from "react-router";

import { fetchRoleDefinitionQueryOptions } from "@bsport/api-staff-management/role";
import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type RoleDetailsPageContentProps = {
  roleId: number;
};

const RoleDetailsPageContent: FC<RoleDetailsPageContentProps> = ({
  roleId,
}) => {
  const { t } = useTranslation("role-details");
  const { data: role } = useSuspenseQuery(
    fetchRoleDefinitionQueryOptions(fetch, { id: roleId }),
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={role.name}
        BreadcrumbsItems={[
          <Link key="to-roles" to={`../${URLS.ROLE}`}>
            <Breadcrumbs.Item text={t("breadcrumbs.roles")} />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <div />
      </ListLayout.Content>
    </ListLayout>
  );
};

const RoleDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const parsedId = Number(id);

  if (!id || !Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to={`../${URLS.ROLE}`} replace />;
  }

  return (
    <QueryBoundary>
      <RoleDetailsPageContent roleId={parsedId} />
    </QueryBoundary>
  );
};

export default RoleDetailsPage;
