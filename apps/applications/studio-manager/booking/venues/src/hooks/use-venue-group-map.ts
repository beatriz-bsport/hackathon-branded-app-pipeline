import { useMemo } from "react";

import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { buildVenueGroupMap } from "#src/utils/group-venues";

export const useVenueGroupMap = () => {
  const { data: groupsData } = useEstablishmentGroupsQuery();
  const groups = groupsData.results;
  const groupMap = useMemo(() => buildVenueGroupMap(groups), [groups]);
  return { groups, groupMap };
};
