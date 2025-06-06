import { createBridgeComponent } from "@module-federation/bridge-react/v19";

import NavigationSidebar from "./NavigationSidebar";

const BridgedSidebar = createBridgeComponent({
  rootComponent: NavigationSidebar,
});

export default BridgedSidebar;
