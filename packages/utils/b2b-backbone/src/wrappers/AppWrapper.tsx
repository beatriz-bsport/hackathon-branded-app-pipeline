import React from "react";
import { ThemeProvider } from "@bsport/kaizen-primitive-core";
import DevTools, { type DevToolsProps } from "#src/dev-utils/DevTools";

type AppWrapperProps = {
  children: React.ReactNode;
} & DevToolsProps;

/**
 * A Wrapper to provide the features required for local development.
 * This should not be federated as it will be define in the Host Page.
 */
const AppWrapper: React.FC<AppWrapperProps> = ({ children, i18nInstance }) => {
  return (
    <ThemeProvider>
      <div className="bg-surface-page min-h-screen">
        <DevTools i18nInstance={i18nInstance} />
        {children}
      </div>
    </ThemeProvider>
  );
};

export default AppWrapper;
