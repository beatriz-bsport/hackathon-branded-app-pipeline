import type { FC } from "react";

import { Loader } from "@bsport/kaizen-primitive-core";

export const LoadingPage: FC = () => {
  return (
    <div className="flex flex-col justify-center h-screen items-center flex-1">
      <Loader size="xl" />
    </div>
  );
};
