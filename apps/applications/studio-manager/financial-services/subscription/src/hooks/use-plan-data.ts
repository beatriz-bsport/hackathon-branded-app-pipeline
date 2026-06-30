import { useMemo } from "react";

import { RAW_FEATURES, RAW_PLANS } from "#src/constants";
import type { Feature, Plan, PlanPageData } from "#src/types/plan";
import { useTranslation } from "#src/utils/i18n";

type UsePlanDataResult = {
  data: PlanPageData | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export const usePlanData = (): UsePlanDataResult => {
  const { t } = useTranslation("subscription");

  const plans = useMemo<Plan[]>(
    () =>
      RAW_PLANS.map(({ nameKey, taglineKey, highlightKeys, ...rest }) => ({
        ...rest,
        name: t(nameKey),
        tagline: t(taglineKey),
        highlights: highlightKeys.map((key) => t(key)),
      })),
    [t],
  );

  const features = useMemo<Feature[]>(
    () =>
      RAW_FEATURES.map(({ labelKey, ...rest }) => ({
        ...rest,
        label: t(labelKey),
      })),
    [t],
  );

  return useMemo(
    () => ({
      data: {
        plans,
        features,
        marketId: "DE",
      },
      isLoading: false,
      isError: false,
      refetch: () => {},
    }),
    [features, plans],
  );
};
