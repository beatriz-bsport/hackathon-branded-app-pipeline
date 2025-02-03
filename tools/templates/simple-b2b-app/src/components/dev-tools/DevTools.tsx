import { Button, Popover, Tooltip } from "@bsport/kaizen-primitive-core";

import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import Logout from "./Logout";

const DevTools: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 m-xs flex flex-col gap-xs z-50">
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
              <LanguageSelector />
              {/* TODO : Add check to see if authenticated before rendering Logout button */}
              <Logout />
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default DevTools;
