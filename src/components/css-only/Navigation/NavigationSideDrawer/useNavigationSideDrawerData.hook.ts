import { useCallback, useState } from 'react';

import type { SubmenuItem } from '#Fabrique/Submenu/types';
import type { StackNavigationState } from '#src/components/css-only/Navigation/NavigationSideDrawer/types';

/**
 * A reusable hook to import handlers and
 * manage stack navigation within side drawers
 */
export default function useNavigationSideDrawerData() {
  /**
   * Like a browsing history, we push the new data and always take
   * the last one for our data display. The state must be reset on close.
   * If stack is empty then side drawer will take props as initial state
   */
  const [stackNavigationState, setStackNavigationState] =
    useState<StackNavigationState>([]);

  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const handleToggleSideDrawer = useCallback(
    () => setIsSideDrawerOpen((prevState) => !prevState),
    [],
  );

  const closeSideDrawer = useCallback(() => {
    setIsSideDrawerOpen(false);
  }, []);

  /** Reset the navigation state after closing the drawer */
  const handleCloseSideDrawer = useCallback(() => {
    closeSideDrawer();
    setStackNavigationState([]);
  }, [closeSideDrawer]);

  /** Pushes a new set of submenu items into the navigation state */
  const handleSetStackNavigationState = useCallback((items: SubmenuItem[]) => {
    setStackNavigationState((prevState) => [...prevState, items]);
  }, []);

  /** When hitting the back button, remove the last pushed set from the navigation state */
  const handleGoBack = useCallback(() => {
    const updatedStackNavigationState = stackNavigationState.slice(0, -1);
    setStackNavigationState(updatedStackNavigationState);
  }, [stackNavigationState]);

  /** Close the drawer if we're already in initial state, otherwise remove last set of items in stack navigation */
  const handleBackArrowClick = useCallback(() => {
    if (stackNavigationState.length > 0) {
      return handleGoBack();
    }
    handleCloseSideDrawer();
  }, [handleCloseSideDrawer, handleGoBack, stackNavigationState.length]);

  return {
    isSideDrawerOpen,
    stackNavigationState,
    handleCloseSideDrawer,
    handleBackArrowClick,
    handleSetStackNavigationState,
    handleToggleSideDrawer,
  };
}
