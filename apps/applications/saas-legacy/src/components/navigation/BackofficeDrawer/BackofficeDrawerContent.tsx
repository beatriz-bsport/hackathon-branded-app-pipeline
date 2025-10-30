import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
// @ts-expect-error
import TempPasswordDialog from '#src/libs/login/components/TempPasswordDialog.component';
import ClockInDialog from '#src/libs/clock-in/components/ClockInDialog.component';
import TutorialGenericDialog from '#src/libs/platform-tutorial/components/TutorialGenericDialog.component';
import ResponsiveDrawer from './ResponsiveDrawer.component';
import { withNavigationSwitcher } from '#src/revamp';
import type { OptionCallback, OptionPaginatedCallback } from '#src/state/types';
import { TUTORIAL_GENERIC_DIALOG_WELCOME } from '#src/libs/platform-tutorial/constant';
import type { Role } from '#src/libs/role/types';
import type { ClockInQueryParams } from '#src/libs/clock-in/types';
import type { TempPasswordState } from '#src/libs/login/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { UpsellSumup } from '#src/libs/company/types';

export interface BackofficeDrawerContentProps {
  displayLeftMenu: boolean;
  theme: CompanyTheme;
  classes: any;
  drawerIconsOnly: boolean;
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
  companyId: number;
  disconnect: () => void;
  featureList: UpsellSumup[];
  location: any;
  logo?: string;
  objectLevelPermissions: any;
  permissions: any;
  hideMobileDrawer: () => void;
  handleUserSetDrawerIconsOnly?: (iconsOnly: boolean) => void;
  nbTutorialAlerting?: number;
  setDrawerIconsOnly?: (iconsOnly: boolean) => void;
  openWelcometutorialDialog?: boolean;
  updateUserAcknowlegdeTutorial?: () => void;
  userAcknowlegdePlatformTutorial: boolean;
  generateTempPassword: () => void;
  tempPasswordState: TempPasswordState;
  closeTempPasswordDialog: () => void;
  tempPasswordDialogOpen: boolean;
  clockInDialogOpen: boolean;
  clockIn: (
    params: { userId?: number },
    options?: OptionCallback,
  ) => Promise<void>;
  clockOut: (
    params: {
      clockInId: number;
    },
    options?: OptionCallback<void>,
  ) => Promise<void>;
  email: string;
  getStaffsAttendanceRealTime: (
    params: ClockInQueryParams,
    options?: OptionCallback,
  ) => Promise<void>;
  fetchCompanyUserRolesPaginated: (
    params: {
      page: number;
      page_size: number;
    },
    options?: OptionPaginatedCallback<Role>,
  ) => Promise<void>;
  fetchMyLastClockin: () => void;
  lastClockIn: any;
  name: string;
  closeClockInDialog: () => void;
  usersPaginatedWithRoles: any;
  setOpenWelcometutorialDialog: (open: boolean) => void;
  handleGoToTutorial: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  showRevampedSidebar: boolean; // Used in withNavigationSwitcher
  // eslint-disable-next-line react/no-unused-prop-types
  updateRevampedBackofficeEnabled: (nextValue: boolean) => void; // Used in withNavigationSwitcher
  enableRevampedBackoffice: () => void;
}

const BackofficeDrawerContent: React.FC<BackofficeDrawerContentProps> = ({
  displayLeftMenu,
  theme,
  classes,
  drawerIconsOnly,
  handleDrawerToggle,
  mobileOpen,
  companyId,
  disconnect,
  featureList,
  location,
  logo,
  objectLevelPermissions,
  permissions,
  hideMobileDrawer,
  handleUserSetDrawerIconsOnly,
  nbTutorialAlerting,
  setDrawerIconsOnly,
  openWelcometutorialDialog,
  updateUserAcknowlegdeTutorial,
  userAcknowlegdePlatformTutorial,
  generateTempPassword,
  tempPasswordState,
  closeTempPasswordDialog,
  tempPasswordDialogOpen,
  clockInDialogOpen,
  clockIn,
  clockOut,
  email,
  getStaffsAttendanceRealTime,
  fetchCompanyUserRolesPaginated,
  fetchMyLastClockin,
  lastClockIn,
  name,
  closeClockInDialog,
  usersPaginatedWithRoles,
  setOpenWelcometutorialDialog,
  handleGoToTutorial,
  enableRevampedBackoffice,
}) => (
  <>
    {displayLeftMenu ? (
      <div>
        <Hidden mdUp>
          <Drawer
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
            elevation={drawerIconsOnly ? 20 : undefined}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            onClose={handleDrawerToggle}
            open={mobileOpen}
            variant="temporary"
          >
            <ResponsiveDrawer
              companyId={companyId}
              companyTheme={theme}
              disconnect={disconnect}
              enableRevampedBackoffice={enableRevampedBackoffice}
              featureList={featureList}
              iconsOnly={drawerIconsOnly}
              location={location}
              logo={logo}
              nbTutorialAlerting={nbTutorialAlerting!}
              objectLevelPermissions={objectLevelPermissions}
              onMenuItemClick={hideMobileDrawer}
              permissions={permissions}
              userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
            />
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            open
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
            elevation={20}
            variant="permanent"
          >
            <ResponsiveDrawer
              companyId={companyId}
              companyTheme={theme}
              disconnect={disconnect}
              enableRevampedBackoffice={enableRevampedBackoffice}
              featureList={featureList}
              handleUserSetDrawerIconsOnly={handleUserSetDrawerIconsOnly}
              iconsOnly={drawerIconsOnly}
              location={location}
              logo={logo}
              nbTutorialAlerting={nbTutorialAlerting!}
              objectLevelPermissions={objectLevelPermissions}
              onMenuItemClick={() => {}}
              permissions={permissions}
              setDrawerIconsOnly={setDrawerIconsOnly}
              tutorialDialogOpen={openWelcometutorialDialog}
              updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
              userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
            />
          </Drawer>
        </Hidden>
      </div>
    ) : (
      <Drawer
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        onClose={handleDrawerToggle}
        open={mobileOpen}
        variant="temporary"
      >
        <ResponsiveDrawer
          companyId={companyId}
          companyTheme={theme}
          disconnect={disconnect}
          enableRevampedBackoffice={enableRevampedBackoffice}
          featureList={featureList}
          iconsOnly={drawerIconsOnly}
          location={location}
          logo={logo}
          nbTutorialAlerting={nbTutorialAlerting!}
          objectLevelPermissions={objectLevelPermissions}
          onMenuItemClick={hideMobileDrawer}
          permissions={permissions}
        />
      </Drawer>
    )}
    <TempPasswordDialog
      generateTempPassword={generateTempPassword}
      loading={tempPasswordState.loading}
      onClose={closeTempPasswordDialog}
      open={tempPasswordDialogOpen}
      tempPassword={tempPasswordState.password}
      tempPasswordExpirationDate={tempPasswordState.expiration_date}
    />
    {clockInDialogOpen && (
      <ClockInDialog
        clockIn={clockIn}
        clockOut={clockOut}
        email={email}
        fetchAttendance={getStaffsAttendanceRealTime}
        fetchCompanyUserRolesPaginated={fetchCompanyUserRolesPaginated}
        fetchMyLastClockin={async () => {
          fetchMyLastClockin();
        }}
        lastClockIn={lastClockIn}
        name={name}
        onClose={closeClockInDialog}
        open={clockInDialogOpen}
        permissions={permissions}
        value={usersPaginatedWithRoles}
      />
    )}
    {!userAcknowlegdePlatformTutorial && (
      <TutorialGenericDialog
        identifier={TUTORIAL_GENERIC_DIALOG_WELCOME}
        onCancel={() => setOpenWelcometutorialDialog(false)}
        onClose={handleGoToTutorial}
        open={openWelcometutorialDialog!}
      />
    )}
  </>
);

export default withNavigationSwitcher(BackofficeDrawerContent);
