import { useOutletContext } from "react-router";

import { SegmentFiltersManager } from "#src/components/filters/segment-filters-manager";

type ParameterPageOutletContext = {
  smartlistId: string;
};
export const ParameterPage = () => {
  const { smartlistId } = useOutletContext<ParameterPageOutletContext>();

  return <SegmentFiltersManager smartlistId={smartlistId} />;
};
