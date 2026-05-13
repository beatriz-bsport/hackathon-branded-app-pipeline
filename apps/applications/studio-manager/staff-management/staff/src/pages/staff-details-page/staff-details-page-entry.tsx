import { useSuspenseQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { Navigate, useParams } from "react-router";

import { flatUserRolesQueryOptions } from "@bsport/api-staff-management/role";

import { QueryBoundary } from "#src/components/query-boundary";
import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";

import StaffDetailsPage from "./staff-details-page";

type StaffDetailsPageEntryInnerProps = {
  staffId: number;
};

const StaffDetailsPageEntryInner: FC<StaffDetailsPageEntryInnerProps> = ({
  staffId,
}) => {
  // TODO: replace with fetchUserRoleQueryOptions once GET /role/user/:id/ is available.
  // Currently returns 405. The backend only exposes the list endpoint.
  const { data } = useSuspenseQuery(flatUserRolesQueryOptions(fetch));
  const staff = data.find((s) => s.id === staffId);

  if (!staff) {
    return <Navigate to={URLS.INDEX} />;
  }

  return <StaffDetailsPage staff={staff} />;
};

export const StaffDetailsPageEntry: FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const parsedId = staffId ? Number(staffId) : NaN;

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to={URLS.INDEX} />;
  }

  return (
    <QueryBoundary>
      <StaffDetailsPageEntryInner staffId={parsedId} />
    </QueryBoundary>
  );
};

export default StaffDetailsPageEntry;
