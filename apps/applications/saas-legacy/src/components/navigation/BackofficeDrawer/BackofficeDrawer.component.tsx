import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import clsx from 'clsx';

import { compose } from 'recompose';

import { push as pushRouter } from 'connected-react-router';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import ListItemText from '@material-ui/core/ListItemText';
import Grow from '@material-ui/core/Grow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimerIcon from '@material-ui/icons/Timer';
import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ButtonBase from '@material-ui/core/ButtonBase';
import Badge from '@material-ui/core/Badge';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Dialog } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import HighlightOff from '@material-ui/icons/HighlightOff';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import VpnKey from '@material-ui/icons/VpnKey';
import Search from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import HelpIcon from '@material-ui/icons/Help';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InboxIcon from '@material-ui/icons/Inbox';

import Tooltip from '@material-ui/core/Tooltip';
import { getAllUnreadAnswersCount } from '#src/libs/communication-v2/selectors';
import FeatureBaseBoardButton from '#src/components/feature-base/FeatureBase.component';
import CashBookForm from '#src/libs/cashbook/components/CashBookForm.component';
import AlertButtonMenu from '#src/libs/alerting/components/AlertButtonMenu.component';
import { DeleteAlert } from '#src/libs/alerting/types';
import { TempPasswordState } from '#src/libs/login/types';
import type {
  RolePermission,
  Role,
  ObjectLevelPermissions,
} from '#src/libs/role/types';
import type {
  LastClockIn,
  UserWithRealTimeAttendance,
  ClockInQueryParams,
} from '#src/libs/clock-in/types';
import {
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_INBOX,
} from '#src/libs/platform-billing/upsell-identifiers';
import { TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS } from '#src/libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#src/libs/platform-tutorial/utils';
import ProtectedRoutes from '#src/components/navigation/ProtectedRoutes.component';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import { setShrinkResponsiveDrawer as setShrinkResponsiveDrawerAction } from '#src/libs/user-preference/actions';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { BannerContext, BannerContextValue } from '#src/hocs/banner.hoc';
import { useFullScreenWithIconDrawer } from '#src/hooks/useFullScreenWithIconDrawer';
import { getTextColorFromRGB } from '#src/utils/color';
import Config from '#src/config';
// @ts-expect-error
import LanguageButton from '#src/components/button/LanguageButton.component';
import { windowTitleToProps } from '#src/hocs/with-title.hoc';
import { openIntercomHelp } from '#src/intercom';
import SearchBar from '#src/components/SearchBar.component';
import StripeOnboardingBanner from '#src/components/navigation/StripeOnboardingBanner.component';
import { RootState } from '#src/reducers';
import type { OptionCallback, OptionPaginatedCallback } from '#src/state/types';
import BillingBanner from '#src/components/navigation/BillingBanner.component';
import BackofficeDrawerContent from './BackofficeDrawerContent';
import { DEFAULT_ZINDEX, NAVIGATION_ZINDEX, BANNER_ZINDEX } from './const';
import { setAuthToken } from '#src/http';
import { STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN } from '#src/actions/constants';
import { clearStorage, getItemInStorage } from '#src/utils/storage';
import {
  updateRevampedBackofficeEnabled as updateRevampedBackofficeEnabledAction,
  enableRevampedBackoffice as enableRevampedBackofficeAction,
  // @ts-expect-error Can not find js file
} from '#src/actions/auth.actions';
import { useShowRevampedSidebar, NAVIGATION_SIDEBAR_WIDTH } from '#src/revamp';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

export const drawerWidth = 260;
export const drawerIconsOnlyWith = 60;
const usePrevious = (value: Location) => {
  const previousIconOnlyState = React.useRef<Location>();

  React.useEffect(() => {
    previousIconOnlyState.current = value;
  });

  return previousIconOnlyState.current;
};

export type Props = {
  autoFocusMemberSearchBar?: boolean;
  theme: CompanyTheme;
  nbAlerting: number;
  nbTutorialAlerting: number;
  countAlertingCommunication: number;
  userAcknowlegdePlatformTutorial: boolean;
  updateUserAcknowlegdeTutorial: () => void;
  disconnect: () => void;
  logo?: string;
  hidden: boolean;
  deleteAlert: DeleteAlert;
  fetchMoreAlertingKind: (alert_kind: number) => void;
  title: string;
  tempPasswordState: TempPasswordState;
  fetchTempPassword: () => void;
  generateTempPassword: () => void;
  displayLeftMenu: boolean;
  openCreateMember: () => void;
  name: string;
  openCalendar: () => void;
  cashBook: any;
  fetchCashBook: (id: number) => void;
  loading: boolean;
  onSubmit: () => void;
  onSpotPaymentReportId: number;
  fetchOnSpotPaymentReport: () => void;
  permissions?: RolePermission;
  paymentMethodMissing: boolean;
  isFranchisorNavigation: boolean;
  navigateBackToFranchisor: () => void;
  companyId: number;
  companyName: string;
  stripeOnboardingPending?: boolean;
  featureList: Array<{
    upsell_identifier: number;
    readable_identifier: string;
  }>;
  objectLevelPermissions: ObjectLevelPermissions;
  email: string;
  lastClockIn: LastClockIn;
  usersPaginatedWithRoles: {
    loading: boolean;
    count: number;
    results: UserWithRealTimeAttendance[];
  };
  inboxUnreadAnswersCount: number;
  getStaffsAttendanceRealTime: (
    params: ClockInQueryParams,
    options?: OptionCallback,
  ) => Promise<void>;
  clockIn: (
    params: { userId?: number },
    options?: OptionCallback,
  ) => Promise<void>;
  fetchCompanyUserRolesPaginated: (
    params: {
      page: number;
      page_size: number;
    },
    options?: OptionPaginatedCallback<Role>,
  ) => Promise<void>;
  clockOut: (
    params: {
      clockInId: number;
    },
    options?: OptionCallback<void>,
  ) => Promise<void>;
  fetchMyLastClockin: () => Promise<void>;
  revampedBackofficeEnabled: boolean;
} & ConnectedProps<typeof connector>;

export const BackOfficeDrawer: React.FC<Props> = ({
  autoFocusMemberSearchBar,
  children,
  theme,
  nbAlerting,
  countAlertingCommunication,
  disconnect,
  logo,
  hidden,
  deleteAlert,
  fetchMoreAlertingKind,
  title,
  tempPasswordState,
  fetchTempPassword,
  generateTempPassword,
  displayLeftMenu,
  openCreateMember,
  name,
  openCalendar,
  cashBook,
  fetchCashBook,
  loading,
  onSubmit,
  onSpotPaymentReportId,
  handleOpenOnSpotPaymentReport,
  fetchOnSpotPaymentReport,
  permissions,
  paymentMethodMissing,
  isFranchisorNavigation,
  navigateBackToFranchisor,
  companyId,
  companyName,
  stripeOnboardingPending,
  featureList,
  objectLevelPermissions,
  email,
  lastClockIn,
  usersPaginatedWithRoles,
  getStaffsAttendanceRealTime,
  clockIn,
  fetchCompanyUserRolesPaginated,
  clockOut,
  fetchMyLastClockin,
  handleGoToTutorial,
  handleGoToInbox,
  userAcknowlegdePlatformTutorial,
  nbTutorialAlerting,
  updateUserAcknowlegdeTutorial,
  shrinkResponsiveDrawer,
  setShrinkResponsiveDrawer,
  inboxUnreadAnswersCount,
  revampedBackofficeEnabled,
  updateRevampedBackofficeEnabled,
  enableRevampedBackoffice,
}) => {
  const { t } = useTranslation('navigation');

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElMini, setAnchorElMini] = React.useState(null);

  const [openCash, setOpenCash] = React.useState(false);
  const [tempPasswordDialogOpen, setTempPasswordDialogOpen] =
    React.useState(false);
  const [clockInDialogOpen, setClockInDialogOpen] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = React.useState(false);

  const [openWelcometutorialDialog, setOpenWelcometutorialDialog] =
    React.useState(false);

  const { drawerIconsOnly, hideAppBar, setDrawerIconsOnly } =
    useFullScreenWithIconDrawer({
      fullPagePathRegExp: '^/audience.*',
      ignoredPathsForAppbar: ['/audience'],
      forceFullDrawer: !displayLeftMenu || mobileOpen,
      initialDrawerIconsOnly: displayLeftMenu && shrinkResponsiveDrawer,
    });

  const handleUserSetDrawerIconsOnly = React.useCallback(
    (shrink: boolean) => {
      setDrawerIconsOnly(shrink);
      setShrinkResponsiveDrawer(shrink);
    },
    [setDrawerIconsOnly, setShrinkResponsiveDrawer],
  );

  const showRevampedSidebar = useShowRevampedSidebar({
    enabledForUser: revampedBackofficeEnabled,
    enabledInTheme: theme.revamped_backoffice_enabled,
  });

  const classes = useStyles({ drawerIconsOnly, showRevampedSidebar });
  const location = useLocation();
  // @ts-expect-error
  const previousLocation = usePrevious(location);

  React.useEffect(() => {
    const handleLogoffOnOtherTab = (event: StorageEvent) => {
      if (event?.key === 'bsport:http:token' && event?.newValue === 'null') {
        setAuthToken('null');
        clearStorage('session');
        disconnect();
      }
    };

    window?.addEventListener('storage', handleLogoffOnOtherTab);
    if (
      location.search.includes(`?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`)
    ) {
      if (!platformTutorialActivated()) {
        return setOpenWelcometutorialDialog(false);
      }
      return setOpenWelcometutorialDialog(true);
    }
    return () => {
      document.removeEventListener('storage', handleLogoffOnOtherTab);
      setOpenWelcometutorialDialog(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (
      previousLocation &&
      previousLocation.search !== location.search &&
      !openWelcometutorialDialog &&
      platformTutorialActivated()
    ) {
      setOpenWelcometutorialDialog(
        location.search.includes(
          `?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`,
        ),
      );
    }
  }, [
    previousLocation,
    location,
    setOpenWelcometutorialDialog,
    openWelcometutorialDialog,
  ]);

  const isTabImpersonated: boolean = React.useMemo(() => {
    return (
      getItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN) !==
      null
    );
  }, []);

  const handleDrawerToggle = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };
  const handleDrawerToggleButton = () => setMobileOpen(!mobileOpen);
  const handleNotificationButton = (value: boolean) => setDialogOpen(value);
  const handleMessageNotificationButton = (value: boolean) =>
    setMessageDialogOpen(value);

  const openTempPasswordDialog = () => {
    fetchTempPassword();
    setTempPasswordDialogOpen(true);
  };
  const hideMobileDrawer = () => setMobileOpen(false);

  const closeTempPasswordDialog = () => setTempPasswordDialogOpen(false);
  const openClockInDialog = () => setClockInDialogOpen(true);
  const closeClockInDialog = () => setClockInDialogOpen(false);
  const hasUpsellIdentifier = (identifier: number) =>
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    featureList.map((ups) => ups.upsell_identifier).includes(identifier);

  const openCashDialog = () => {
    return (
      <Dialog open={openCash}>
        <DialogTitle>
          <Typography variant="h4">
            {t('backofficeMenu.cashBook.cashDialogTitle')}
          </Typography>
          <Typography variant="h6">
            {`${t('backofficeMenu.cashBook.of')} : ${cashBook.date}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CashBookForm
            handleOpenOnSpotPaymentReport={
              onSpotPaymentReportId &&
              (() => handleOpenOnSpotPaymentReport(onSpotPaymentReportId))
            }
            initial={cashBook}
            onSubmit={onSubmit}
            permissions={permissions}
            setOpenCash={setOpenCash}
          />
        </DialogContent>
      </Dialog>
    );
  };
  const renderAdditionalButtons = () => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(event.currentTarget);

    return (
      <Grid item>
        <Button onClick={handleClick}>
          <MoreVertIcon />
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          <MenuItem>
            <LanguageButton closeMenu={() => setAnchorEl(null)} />
          </MenuItem>
          <MenuItem onClick={openTempPasswordDialog}>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.requestTempPassword')} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              disconnect();
            }}
          >
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.logoff')} />
          </MenuItem>
          {isTabImpersonated ? (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                window.close();
              }}
            >
              <ListItemIcon>
                <HighlightOff />
              </ListItemIcon>
              <ListItemText primary={t('backofficeMenu.closeTab')} />
            </MenuItem>
          ) : null}
        </Menu>
      </Grid>
    );
  };
  const renderContractedMenu = (forced_hide: boolean) => {
    const isClockIn = lastClockIn?.onGoing;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
      setAnchorElMini(event.currentTarget);

    return (
      <Grid item>
        <Button onClick={handleClick}>
          <MoreVertIcon />
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorElMini}
          onClose={() => setAnchorElMini(null)}
          open={Boolean(anchorElMini)}
        >
          <MenuItem>
            <LanguageButton closeMenu={() => setAnchorElMini(null)} />
          </MenuItem>
          {hasUpsellIdentifier(UPSELL_IDENTIFIER_CLOCK_IN) &&
            (permissions?.navigationMenu?.payments?.clockIn?.selfClockIn ||
              permissions?.navigationMenu?.payments?.clockIn
                ?.clockInForOther) && (
              <MenuItem onClick={openClockInDialog}>
                <ListItemIcon>
                  <Grid item>
                    <Tooltip title={t('navigation:backofficeMenu.clockIn')}>
                      <Badge
                        badgeContent={
                          isClockIn ? (
                            <HourglassEmptyIcon
                              className={classes.badgesIcon}
                            />
                          ) : (
                            <PowerSettingsNewIcon
                              className={classes.badgesIcon}
                            />
                          )
                        }
                        classes={{
                          badge: isClockIn ? classes.badgesGreen : '',
                        }}
                        color={isClockIn ? 'primary' : 'error'}
                      >
                        <TimerIcon />
                      </Badge>
                    </Tooltip>
                  </Grid>
                </ListItemIcon>
                <ListItemText
                  primary={t('navigation:backofficeMenu.clockIn')}
                />
              </MenuItem>
            )}
          {forced_hide && (
            <MenuItem>
              <ListItemIcon>
                <Grid item>
                  <React.Fragment>
                    <Hidden mdUp>
                      <Grid item>
                        <ObjectLevelPermissionWrapper
                          forcedBehavior="hidden"
                          requiredPermission="member.allowed_actions.search"
                        >
                          <Link to="/search/results">
                            <IconButton>
                              <Search />
                            </IconButton>
                          </Link>
                        </ObjectLevelPermissionWrapper>
                      </Grid>
                    </Hidden>
                    <Grid item>
                      <IconButton onClick={openCalendar}>
                        <TodayIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                </Grid>
              </ListItemIcon>
            </MenuItem>
          )}
          {permissions?.appbarButtons?.ledger && (
            <MenuItem
              onClick={() => {
                // @ts-expect-error
                fetchOnSpotPaymentReport({
                  name: t('reporting:categories.on_spot_payments'),
                });
                setOpenCash(true);
                fetchCashBook(theme.company);
              }}
            >
              <ListItemIcon>
                <Grid item>
                  <Tooltip
                    title={t('navigation:backofficeMenu.cashBookTooltip')}
                  >
                    <BusinessCenterIcon />
                  </Tooltip>
                </Grid>
              </ListItemIcon>
              <ListItemText
                primary={t('navigation:backofficeMenu.cashBookTooltip')}
              />
            </MenuItem>
          )}
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.create"
          >
            <MenuItem onClick={openCreateMember}>
              <ListItemIcon>
                <Grid item>
                  <Tooltip
                    title={t('navigation:backofficeMenu.addMemberTooltip')}
                  >
                    <PersonAddIcon />
                  </Tooltip>
                </Grid>
              </ListItemIcon>
              <ListItemText
                primary={t('navigation:backofficeMenu.addMemberTooltip')}
              />
            </MenuItem>
          </ObjectLevelPermissionWrapper>
          {/* @ts-expect-error */}
          <MenuItem onClick={openIntercomHelp}>
            <ListItemIcon>
              <Grid item>
                <HelpIcon />
              </Grid>
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.help')} />
          </MenuItem>
          <MenuItem onClick={openTempPasswordDialog}>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.requestTempPassword')} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorElMini(null);
              disconnect();
            }}
          >
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.logoff')} />
          </MenuItem>
        </Menu>
      </Grid>
    );
  };
  const renderAppBar = (forced_hide: boolean, displayMenuIcon: boolean) => {
    const isClockIn = lastClockIn?.onGoing;

    if (hideAppBar) {
      return null;
    }
    return (
      <BannerContext.Consumer>
        {({ banner }: BannerContextValue) => (
          <AppBar className={classes.appBar} color="inherit">
            <Toolbar>
              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                style={{ width: '100%' }}
                wrap="nowrap"
              >
                <Grid item zeroMinWidth>
                  <Grid
                    container
                    alignItems="center"
                    direction="row"
                    justifyContent="flex-start"
                    wrap="nowrap"
                  >
                    <Grid item zeroMinWidth>
                      {displayMenuIcon && !forced_hide ? (
                        <Hidden smDown>
                          <IconButton
                            aria-label="open drawer"
                            color="inherit"
                            onClick={handleDrawerToggleButton}
                          >
                            <MenuIcon />
                          </IconButton>
                        </Hidden>
                      ) : null}
                      {!forced_hide ? (
                        <Hidden mdUp>
                          <IconButton
                            aria-label="open drawer"
                            color="inherit"
                            onClick={handleDrawerToggleButton}
                          >
                            <MenuIcon />
                          </IconButton>
                        </Hidden>
                      ) : null}
                    </Grid>
                    <Grid item zeroMinWidth>
                      <Typography
                        noWrap
                        className={classes.title}
                        color="inherit"
                        id="app-title"
                        variant="h6"
                      >
                        {title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  {!showRevampedSidebar && (
                    <Grid
                      container
                      alignItems="center"
                      direction="row"
                      wrap="nowrap"
                    >
                      {permissions?.appbarButtons?.communicationAlerts &&
                        !!countAlertingCommunication && (
                          <Grow in>
                            <Grid item>
                              <AlertButtonMenu
                                withCommunicationAlerts
                                deleteAlert={deleteAlert}
                                // @ts-expect-error
                                dialogOpen={messageDialogOpen}
                                nbAlerting={countAlertingCommunication}
                                overrideIcon={MessageIcon}
                                // @ts-expect-error
                                setDialogOpen={handleMessageNotificationButton}
                                showMore={fetchMoreAlertingKind}
                              />
                            </Grid>
                          </Grow>
                        )}
                      <Hidden xsDown>
                        <Grid item>
                          <IconButton onClick={handleGoToInbox}>
                            <Tooltip
                              title={t('navigation:backofficeMenu.inbox')}
                            >
                              <Badge
                                badgeContent={
                                  hasUpsellIdentifier(UPSELL_IDENTIFIER_INBOX)
                                    ? inboxUnreadAnswersCount
                                    : 0
                                }
                                color="error"
                                max={99}
                              >
                                <InboxIcon />
                              </Badge>
                            </Tooltip>
                          </IconButton>
                        </Grid>
                        {hasUpsellIdentifier(UPSELL_IDENTIFIER_CLOCK_IN) &&
                          (permissions?.navigationMenu?.payments?.clockIn
                            ?.selfClockIn ||
                            permissions?.navigationMenu?.payments?.clockIn
                              ?.clockInForOther) && (
                            <Grid item>
                              <IconButton onClick={openClockInDialog}>
                                <Tooltip
                                  title={t('navigation:backofficeMenu.clockIn')}
                                >
                                  <Badge
                                    badgeContent={
                                      isClockIn ? (
                                        <HourglassEmptyIcon
                                          className={classes.badgesIcon}
                                        />
                                      ) : (
                                        <PowerSettingsNewIcon
                                          className={classes.badgesIcon}
                                        />
                                      )
                                    }
                                    classes={{
                                      badge: isClockIn
                                        ? classes.badgesGreen
                                        : '',
                                    }}
                                    color={isClockIn ? 'primary' : 'error'}
                                  >
                                    <TimerIcon />
                                  </Badge>
                                </Tooltip>
                              </IconButton>
                            </Grid>
                          )}
                        {forced_hide && (
                          <React.Fragment>
                            <Hidden mdUp>
                              <Grid item>
                                <ObjectLevelPermissionWrapper
                                  forcedBehavior="hidden"
                                  requiredPermission="member.allowed_actions.search"
                                >
                                  <Link to="/search/results">
                                    <IconButton>
                                      <Search />
                                    </IconButton>
                                  </Link>
                                </ObjectLevelPermissionWrapper>
                              </Grid>
                            </Hidden>
                            <Grid item>
                              <IconButton onClick={openCalendar}>
                                <TodayIcon />
                              </IconButton>
                            </Grid>
                          </React.Fragment>
                        )}
                        {permissions?.appbarButtons?.ledger && (
                          <Grid item>
                            <IconButton
                              onClick={() => {
                                // @ts-expect-error
                                fetchOnSpotPaymentReport({
                                  name: t(
                                    'reporting:categories.on_spot_payments',
                                  ),
                                });
                                setOpenCash(true);
                                fetchCashBook(theme.company);
                              }}
                            >
                              <Tooltip
                                title={t(
                                  'navigation:backofficeMenu.cashBookTooltip',
                                )}
                              >
                                <BusinessCenterIcon />
                              </Tooltip>
                            </IconButton>
                          </Grid>
                        )}
                        <ObjectLevelPermissionWrapper
                          forcedBehavior="hidden"
                          requiredPermission="member.allowed_actions.create"
                        >
                          <Grid item>
                            <IconButton onClick={openCreateMember}>
                              <Tooltip
                                title={t(
                                  'navigation:backofficeMenu.addMemberTooltip',
                                )}
                              >
                                <PersonAddIcon />
                              </Tooltip>
                            </IconButton>
                          </Grid>
                        </ObjectLevelPermissionWrapper>
                      </Hidden>
                      {permissions?.appbarButtons?.notificationCenter && (
                        <Grid item>
                          <AlertButtonMenu
                            deleteAlert={deleteAlert}
                            // @ts-expect-error
                            dialogOpen={dialogOpen}
                            nbAlerting={nbAlerting}
                            // @ts-expect-error
                            setDialogOpen={handleNotificationButton}
                            showMore={fetchMoreAlertingKind}
                          />
                        </Grid>
                      )}
                      <Hidden xsDown>
                        <Grid item>
                          {/* @ts-expect-error */}
                          <IconButton onClick={openIntercomHelp}>
                            <HelpIcon />
                          </IconButton>
                        </Grid>
                        <ObjectLevelPermissionWrapper
                          forcedBehavior="hidden"
                          requiredPermission="member.allowed_actions.search"
                        >
                          <Grid item className={classes.searchBar}>
                            <SearchBar
                              // @ts-expect-error
                              changeLocation
                              autoFocus={autoFocusMemberSearchBar}
                            />
                          </Grid>
                        </ObjectLevelPermissionWrapper>

                        {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                          !WidgetUtils.isWidget() && (
                            <Grid item>
                              <FeatureBaseBoardButton />
                            </Grid>
                          )}

                        {renderAdditionalButtons()}
                      </Hidden>

                      <Hidden smUp>
                        <Grid item>{renderContractedMenu(forced_hide)}</Grid>
                      </Hidden>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Toolbar>
            {banner}
            {isFranchisorNavigation && (
              <div className={classes.franchisorBanner}>
                <div className={classes.text}>
                  {t('backofficeMenu.franchiseConnectedAs', {
                    name: companyName,
                  })}
                  <ButtonBase
                    className={classes.buttonFranchise}
                    onClick={navigateBackToFranchisor}
                  >
                    {t(
                      'backofficeMenu.backToFranchiseWorskpace',
                    )?.toUpperCase()}
                  </ButtonBase>
                </div>
              </div>
            )}
            {loading ? null : openCashDialog()}
          </AppBar>
        )}
      </BannerContext.Consumer>
    );
  };
  if (hidden) {
    return (
      <div style={{ width: '100%' }}>
        {renderAppBar(true, true)}
        <div className={classes.content}>
          <BillingBanner paymentMethodMissing={paymentMethodMissing} />
          <StripeOnboardingBanner
            stripeOnboardingPending={stripeOnboardingPending}
          />
          <ProtectedRoutes>{children}</ProtectedRoutes>
        </div>
      </div>
    );
  }

  return (
    <BannerContext.Consumer>
      {({ displayBanner }: BannerContextValue) => (
        <div className={displayLeftMenu ? classes.root : classes.rootFullWidth}>
          {displayLeftMenu
            ? renderAppBar(false, false)
            : renderAppBar(false, true)}
          <BackofficeDrawerContent
            classes={classes}
            clockIn={clockIn}
            clockInDialogOpen={clockInDialogOpen}
            clockOut={clockOut}
            closeClockInDialog={closeClockInDialog}
            closeTempPasswordDialog={closeTempPasswordDialog}
            companyId={companyId}
            disconnect={disconnect}
            displayLeftMenu={displayLeftMenu}
            drawerIconsOnly={drawerIconsOnly}
            email={email}
            enableRevampedBackoffice={enableRevampedBackoffice}
            featureList={featureList}
            fetchCompanyUserRolesPaginated={fetchCompanyUserRolesPaginated}
            fetchMyLastClockin={fetchMyLastClockin}
            generateTempPassword={generateTempPassword}
            getStaffsAttendanceRealTime={getStaffsAttendanceRealTime}
            handleDrawerToggle={handleDrawerToggle}
            handleGoToTutorial={handleGoToTutorial}
            handleUserSetDrawerIconsOnly={handleUserSetDrawerIconsOnly}
            hideMobileDrawer={hideMobileDrawer}
            lastClockIn={lastClockIn}
            location={location}
            logo={logo}
            mobileOpen={mobileOpen}
            name={name}
            nbTutorialAlerting={nbTutorialAlerting}
            objectLevelPermissions={objectLevelPermissions}
            openWelcometutorialDialog={openWelcometutorialDialog}
            permissions={permissions}
            setDrawerIconsOnly={setDrawerIconsOnly}
            setOpenWelcometutorialDialog={setOpenWelcometutorialDialog}
            showRevampedSidebar={showRevampedSidebar}
            tempPasswordDialogOpen={tempPasswordDialogOpen}
            tempPasswordState={tempPasswordState}
            theme={theme}
            updateRevampedBackofficeEnabled={updateRevampedBackofficeEnabled}
            updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
            userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
            usersPaginatedWithRoles={usersPaginatedWithRoles}
          />
          <main
            className={clsx({
              [classes.fullContent]:
                location.pathname.includes('/spot-scheduling') ||
                location.pathname.includes('/audience/'),
              [classes.content]: !(
                location.pathname.includes('/spot-scheduling') ||
                location.pathname.includes('/audience') ||
                location.pathname.includes('/inbox/') ||
                location.pathname.includes('/feature-base') ||
                /^\/reporting\/detail\/[^/]+\/[^/]+$/.test(location.pathname)
              ),
              [classes.unscrollableContent]:
                (location.pathname.includes('/audience') &&
                  !location.pathname.includes('/audience/')) ||
                location.pathname.includes('/feature-base'),
              [classes.contentWithoutPadding]:
                location.pathname.includes('/inbox/') ||
                location.pathname.includes('/feature-base') ||
                /^\/reporting\/detail\/[^/]+\/[^/]+$/.test(location.pathname),
            })}
          >
            {displayBanner && <div className={classes.bannerContextspacing} />}
            <BillingBanner paymentMethodMissing={paymentMethodMissing} />
            <StripeOnboardingBanner
              stripeOnboardingPending={stripeOnboardingPending}
            />
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </main>
        </div>
      )}
    </BannerContext.Consumer>
  );
};

const getNavigationWidth = ({
  drawerIconsOnly,
  showRevampedSidebar,
}: {
  drawerIconsOnly: boolean;
  showRevampedSidebar: boolean;
}) => {
  if (showRevampedSidebar) return NAVIGATION_SIDEBAR_WIDTH;
  return drawerIconsOnly ? drawerIconsOnlyWith : drawerWidth;
};

const useStyles = makeStyles<
  Theme,
  { drawerIconsOnly: boolean; showRevampedSidebar: boolean }
>((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: DEFAULT_ZINDEX,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      paddingLeft: getNavigationWidth,
    },
  },
  rootFullWidth: {
    flexGrow: 1,
    zIndex: DEFAULT_ZINDEX,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
  },
  grow: {
    flex: 1,
  },
  appBar: {
    flex: '0 1 64px',
    width: '100%',
    position: 'relative',
    zIndex: NAVIGATION_ZINDEX,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    display: 'inherit',
    zIndex: NAVIGATION_ZINDEX,
    width: getNavigationWidth,
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  unscrollableContent: {
    flex: '1 1 auto',
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
    overflow: 'auto',
  },
  fullContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
    paddingTop: theme.spacing(2),
  },
  contentWithoutPadding: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    width: '100%',
  },
  searchBar: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: 200,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(4),
    },
  },
  paymentMissingContainer: {
    left: 0,
    right: 0,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    zIndex: BANNER_ZINDEX,
  },
  errorBanner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.error.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  fillerFranchisor: {
    height: theme.spacing(3),
  },
  franchisorBanner: {
    height: theme.spacing(3),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    // @ts-expect-error
    color: getTextColorFromRGB(theme.palette.primary.main),
  },
  buttonFranchise: {
    textDecoration: 'underline',
    marginLeft: theme.spacing(2),
  },
  bannerContextspacing: {
    height: theme.spacing(3),
  },
  badgesGreen: {
    backgroundColor: theme.palette.success.main,
  },
  badgesIcon: {
    fill: 'white',
    height: 10,
    width: 10,
  },
  webshopBannerButtonLabel: {
    textTransform: 'initial',
  },
}));

const connector = connect(
  (state: RootState) => ({
    loading: state.cashbook.loading,
    cashBook: state.cashbook.infos,
    shrinkResponsiveDrawer: state.userPreference.shrinkResponsiveDrawer,
    inboxUnreadAnswersCount: getAllUnreadAnswersCount(state),
  }),
  {
    handleOpenOnSpotPaymentReport: (id: number) =>
      pushRouter(`/reporting/${id}`),
    handleGoToTutorial: () => pushRouter('/tutorial'),
    handleGoToInbox: () => pushRouter('/inbox/thread'),
    setShrinkResponsiveDrawer: setShrinkResponsiveDrawerAction,
    updateRevampedBackofficeEnabled: updateRevampedBackofficeEnabledAction,
    enableRevampedBackoffice: enableRevampedBackofficeAction,
  },
);

export default compose(
  React.memo,
  connector,
  windowTitleToProps,
)(BackOfficeDrawer);
