import React from "react";

import { Button, Popover, Tooltip } from "@bsport/kaizen-primitive-core";

import LanguageSelector, {
  type LanguageSelectorProps,
} from "./LanguageSelector";
import Logout from "./Logout";
import ThemeSelector from "./ThemeSelector";

export type DevToolsProps = LanguageSelectorProps;

const DevTools: React.FC<DevToolsProps> = ({ i18nInstance }) => {
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
              <Logout />
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default DevTools;
