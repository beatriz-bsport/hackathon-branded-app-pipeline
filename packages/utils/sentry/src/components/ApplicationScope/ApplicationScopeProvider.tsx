import * as Sentry from "@sentry/react";
import { type PropsWithChildren, useEffect } from "react";

import { ApplicationScopeContext } from "./context";

type ApplicationScopeProviderProps = PropsWithChildren<{
  appName: string;
}>;

export const ApplicationScopeProvider = ({
  children,
  appName,
}: ApplicationScopeProviderProps) => {
  useEffect(() => {
    Sentry.setTag("application", appName);
    Sentry.setContext("application", { name: appName });
  }, [appName]);

  return (
    <ApplicationScopeContext.Provider value={appName}>
      {children}
    </ApplicationScopeContext.Provider>
  );
};
