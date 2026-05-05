import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

const useSCT = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: categories = [] } = useQuery(
    fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
  );

  const sctMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat.name])),
    [categories],
  );

  return { sctMap, categories };
};

export default useSCT;
