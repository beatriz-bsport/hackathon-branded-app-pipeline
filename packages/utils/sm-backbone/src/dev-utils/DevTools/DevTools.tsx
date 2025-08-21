import React, { useState } from "react";

import { getEnv } from "@bsport/envs";
import { Button, Popover, Tooltip } from "@bsport/kaizen-primitive-core";

import { AnalyticsDebugToggle } from "./AnalyticsDebugToggle";
import LanguageSelector, {
  type LanguageSelectorProps,
} from "./LanguageSelector";
import Logout, { type LogoutProps } from "./Logout";
import ThemeSelector from "./ThemeSelector";

export type DevToolsProps = LanguageSelectorProps & LogoutProps;

const DevTools: React.FC<DevToolsProps> = ({
  i18nInstance,
  onLogoutCallback,
}) => {
  const [counter, setCounter] = useState(0);
  const [analyticsDebug, setAnalyticsDebug] = useState(false);
  const env = getEnv();

  if (env === "production" || env === "staging") return null;

  if (env === "dev" && counter < 5) {
    // Return an invisible button that increases the counter
    return (
      <div
        onClick={() => setCounter((state) => state + 1)}
        className="fixed left-0 top-0 h-xs w-xs cursor-pointer"
        aria-hidden
        style={{ zIndex: 1200 }}
      />
    );
  }

  return (
    <div
      className="fixed left-0 top-0 m-xs flex flex-col gap-xs"
      style={{ zIndex: 1200 }}
    >
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Tooltip label="Dev tools box" placement="right">
              <Button
                iconLeft="loading"
                color="critical"
                intent="call-to-action"
                size="md"
                onClick={() => setIsPopoverOpened((prev) => !prev)}
                className="w-fit"
              />
            </Tooltip>
          )}
        </Popover.Anchor>
        <Popover.Content>
          {() => (
            <div className="gap-xs flex flex-col">
              <ThemeSelector />
              <LanguageSelector i18nInstance={i18nInstance} />
              <AnalyticsDebugToggle
                debugMode={analyticsDebug}
                setDebugMode={setAnalyticsDebug}
              />
              <Logout onLogoutCallback={onLogoutCallback} />
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default DevTools;
