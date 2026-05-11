import { useOutletContext } from "react-router";

import { PassesFilterList } from "#src/components/filters/passes-filter/components/passes-filter-list";

type ParameterPageOutletContext = {
  smartlistId: string;
};
export const ParameterPage = () => {
  const { smartlistId } = useOutletContext<ParameterPageOutletContext>();

  return (
    <div className="flex flex-col gap-sm w-[500px]">
      <PassesFilterList smartlistId={smartlistId} />
    </div>
  );
};
