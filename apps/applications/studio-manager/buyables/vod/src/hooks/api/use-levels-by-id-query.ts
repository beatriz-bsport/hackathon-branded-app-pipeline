import { useQuery } from "@tanstack/react-query";

import { fetchLevelsAPI } from "@bsport/api-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const LEVELS_STALE_TIME = 2 * 60 * 1000;

export const useLevelsByIdQuery = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { t } = useTranslation("collection-details");

  const defaultLevelNames = new Map<number, string>([
    [1, t("videoList.levels.1")],
    [2, t("videoList.levels.2")],
    [3, t("videoList.levels.3")],
    [4, t("videoList.levels.4")],
    [5, t("videoList.levels.5")],
  ]);

  return useQuery({
    queryKey: ["vod", "levels", companyId],
    queryFn: () =>
      fetchLevelsAPI(fetch, { is_active: true, company: companyId }),
    enabled: Boolean(companyId),
    staleTime: LEVELS_STALE_TIME,
    select: (levels): Map<number, string> =>
      new Map(
        levels.map((level) => [
          level.id,
          defaultLevelNames.get(level.id) ?? level.name,
        ]),
      ),
  });
};
