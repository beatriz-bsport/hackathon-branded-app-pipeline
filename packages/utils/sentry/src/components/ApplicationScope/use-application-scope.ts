import { useContext } from "react";

import { ApplicationScopeContext } from "./context";

export const useApplicationScope = () => {
  const context = useContext(ApplicationScopeContext);

  if (context === undefined) {
    throw new Error(
      "useApplicationScope must be used within <ApplicationScopeProvider>",
    );
  }

  return context;
};
