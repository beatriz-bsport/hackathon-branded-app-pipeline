import React from 'react';
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
 * depending on the value of props.showRevampedSidebar.
 * IMPORTANT: This HOC should be used only for the BackofficeDrawer component.
 *
 * Usage:
 *   export default withSidebarSwitcher(Component)
 */
export function withNavigationSwitcher(
  WrappedComponent: React.ComponentType<BackofficeDrawerContentProps>,
) {
  const SidebarSwitcher: React.FC<BackofficeDrawerContentProps> = (props) => {
    if (props.showRevampedSidebar) {
      // Render new sidebar layout
      return (
        <>
          <Hidden smDown>
            <Navigation
              updateRevampedBackofficeEnabled={
                props.updateRevampedBackofficeEnabled
              }
            />
          </Hidden>
          <Hidden mdUp>
            <Drawer
              anchor="left"
              ModalProps={{
                keepMounted: true,
                style: {
                  zIndex: COMPATIBILITY_Z_INDEX,
                },
                disableEnforceFocus: true,
                disableAutoFocus: true,
              }}
              onClose={props.handleDrawerToggle}
              open={props.mobileOpen}
            >
              <Navigation
                onDrawerClose={props.handleDrawerToggle}
                updateRevampedBackofficeEnabled={
                  props.updateRevampedBackofficeEnabled
                }
              />
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
