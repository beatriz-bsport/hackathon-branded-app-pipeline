import React from 'react';
import clsx from 'clsx';

import { useShowRevampedSidebar } from './useShowRevampedSidebar';
import { Navigation } from './Navigation';
import type { BackofficeDrawerContentProps } from '#src/components/navigation/BackofficeDrawer/BackofficeDrawerContent';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

/**
 * This z-index guarantees that the overlay components from
 * the navigation sidebar are displayed on top of the drawer.
 */
const COMPATIBILITY_Z_INDEX = 990;

/**
 * HOC that switches between the new NavigationSidebar layout and the legacy BackofficeDrawer
 * depending on the value of useShowRevampedSidebar().
 * IMPORTANT: This HOC should be used only for the BackofficeDrawer component.
 *
 * Usage:
 *   export default withSidebarSwitcher(Component)
 */
export function withNavigationSwitcher(
  WrappedComponent: React.ComponentType<BackofficeDrawerContentProps>,
) {
  const SidebarSwitcher: React.FC<BackofficeDrawerContentProps> = (props) => {
    const showRevamped = useShowRevampedSidebar();

    if (showRevamped) {
      // Render new sidebar layout
      return (
        <>
          <Hidden smDown>
            <Navigation
              className={clsx(
                props.classes.drawerPaper,
                props.classes.toTheLeft,
              )}
            />
          </Hidden>
          <Hidden mdUp>
            <Drawer
              anchor="left"
              ModalProps={{
                style: {
                  zIndex: COMPATIBILITY_Z_INDEX,
                },
              }}
              onClose={props.handleDrawerToggle}
              open={props.mobileOpen}
            >
              <Navigation />
            </Drawer>
          </Hidden>
        </>
      );
    }

    // Render legacy drawer layout
    return <WrappedComponent {...props} />;
  };

  return SidebarSwitcher;
}
