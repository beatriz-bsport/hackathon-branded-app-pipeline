import { useEffect, useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  fetchSportCategoriesAction,
  selectSportCategories,
  useSportCategoryStore,
} from "@bsport/store-core-data-masterdata";

import { fetch } from "#src/utils/fetch";

/**
 * Returns a stable Map<sctId, sctName> backed by the shared Zustand
 * sportCategoryStore — consistent with how group-activity uses it.
 */
const useSCT = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const categories = useSportCategoryStore(selectSportCategories);

  useEffect(() => {
    if (companyId) fetchSportCategoriesAction(fetch, { company_id: companyId });
  }, [companyId]);

  const sctMap = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat.name])),
    [categories],
  );

  return { sctMap };
};

export default useSCT;
