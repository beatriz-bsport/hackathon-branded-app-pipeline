import { createBridgeComponent } from "@module-federation/bridge-react/v19";

import { NavigationSidebarWithData } from "./NavigationSidebarWithData";

const BridgedSidebar = createBridgeComponent({
  rootComponent: NavigationSidebarWithData,
});

export default BridgedSidebar;
