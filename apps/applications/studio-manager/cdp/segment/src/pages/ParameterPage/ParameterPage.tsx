import { useOutletContext } from "react-router";

import { SmartlistFiltersManager } from "#src/components/filters/smartlist-filters-manager";

type ParameterPageOutletContext = {
  smartlistId: string;
};
export const ParameterPage = () => {
  const { smartlistId } = useOutletContext<ParameterPageOutletContext>();

  return <SmartlistFiltersManager smartlistId={smartlistId} />;
};
