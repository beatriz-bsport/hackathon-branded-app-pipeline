// @ts-nocheck
import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import classnames from 'classnames';

import { compose } from 'recompose';

import { push as pushRouter } from 'connected-react-router';

import Drawer from '@material-ui/core/Drawer';
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
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import VpnKey from '@material-ui/icons/VpnKey';
import Search from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import HelpIcon from '@material-ui/icons/Help';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InboxIcon from '@material-ui/icons/Inbox';

import Tooltip from '@material-ui/core/Tooltip';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useFullScreenWithIconDrawer } from '../../../hooks/useFullScreenWithIconDrawer';
import Config from '../../../config';
import { getTextColorFromRGB } from '../../../utils/color';
import { getAllUnreadAnswersCount } from '#libs/communication-v2/selectors';

import BillingBanner from '../BillingBanner.component';
import StripeOnboardingBanner from '../StripeOnboardingBanner.component';
import LanguageButton from '../../button/LanguageButton.component';
import TempPasswordDialog from '#libs/login/components/TempPasswordDialog.component';
import CashBookForm from '#libs/cashbook/components/CashBookForm.component';
import SearchBar from '../../SearchBar.component';
import AlertButtonMenu from '#libs/alerting/components/AlertButtonMenu.component';
import { windowTitleToProps } from '../../../hocs/with-title.hoc';
import { openIntercomHelp } from '../../../intercom';
import { DeleteAlert } from '#libs/alerting/types';
import { TempPasswordState } from '#libs/login/types';
import type {
  RolePermission,
  Role,
  ObjectLevelPermissions,
} from '#libs/role/types';
import { BannerContext, BannerContextValue } from '../../../hocs/banner.hoc';
import ClockInDialog from '#libs/clock-in/components/ClockInDialog.component';
import ResponsiveDrawer from './ResponsiveDrawer.component';
import type {
  LastClockIn,
  UserWithRealTimeAttendance,
  ClockInQueryParams,
} from '#libs/clock-in/types';
import {
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_INBOX,
} from '#libs/platform-billing/upsell-identifiers';
import { DEFAULT_ZINDEX, NAVIGATION_ZINDEX, BANNER_ZINDEX } from './const';
import TutorialGenericDialog from '#libs/platform-tutorial/components/TutorialGenericDialog.component';
import {
  TUTORIAL_GENERIC_DIALOG_WELCOME,
  TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS,
} from '#libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';
import ProtectedRoutes from '#components/navigation/ProtectedRoutes.component';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import { RootState } from '../../../reducers';
import type {
  OptionCallback,
  OptionPaginatedCallback,
} from '../../../state/types';

import { setShrinkResponsiveDrawer as setShrinkResponsiveDrawerAction } from '#libs/user-preference/actions';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

export const drawerWidth = 260;
export const drawerIconsOnlyWith = 60;
const usePrevious = (value: Location) => {
  const previousIconOnlyState = React.useRef<Location>();

  React.useEffect(() => {
    previousIconOnlyState.current = value;
  });

  return previousIconOnlyState.current;
};

type Props = {
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
  getLastClockin: () => Promise<void>;
} & ConnectedProps<typeof connector>;

export const BackOfficeDrawer: React.FC<Props> = ({
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
  getLastClockin,
  handleGoToTutorial,
  handleGoToInbox,
  userAcknowlegdePlatformTutorial,
  nbTutorialAlerting,
  updateUserAcknowlegdeTutorial,
  shrinkResponsiveDrawer,
  setShrinkResponsiveDrawer,
  inboxUnreadAnswersCount,
  handleGoToWebshop,
}) => {
  const { t } = useTranslation('navigation');

  const isLocalOrDev = !['production', 'staging'].includes(
    Config.REACT_APP_SENTRY_ENVIRONMENT,
  );

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

  const handleUserSetDrawerIconsOnly = (shrink: boolean) => {
    setDrawerIconsOnly(shrink);
    setShrinkResponsiveDrawer(shrink);
  };

  const { drawerIconsOnly, hideAppBar, setDrawerIconsOnly } =
    useFullScreenWithIconDrawer({
      fullPagePathRegExp: '^/audience.*',
      ignoredPathsForAppbar: ['/audience'],
      forceFullDrawer: !displayLeftMenu || mobileOpen,
      initialDrawerIconsOnly: displayLeftMenu && shrinkResponsiveDrawer,
    });

  const classes = useStyles({ drawerIconsOnly });
  const location = useLocation();
  const previousLocation = usePrevious(location);

  React.useEffect(() => {
    if (
      location.search.includes(`?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`)
    ) {
      if (!platformTutorialActivated()) {
        return setOpenWelcometutorialDialog(false);
      }
      return setOpenWelcometutorialDialog(true);
    }
    return setOpenWelcometutorialDialog(false);
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
                        {!!permissions?.member?.search && (
                          <Link to="/search/results">
                            <IconButton>
                              <Search />
                            </IconButton>
                          </Link>
                        )}
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
                              dialogOpen={messageDialogOpen}
                              nbAlerting={countAlertingCommunication}
                              overrideIcon={MessageIcon}
                              setDialogOpen={handleMessageNotificationButton}
                              showMore={fetchMoreAlertingKind}
                            />
                          </Grid>
                        </Grow>
                      )}
                    <Hidden xsDown>
                      <Grid item>
                        <IconButton onClick={handleGoToInbox}>
                          <Tooltip title={t('navigation:backofficeMenu.inbox')}>
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
                                    badge: isClockIn ? classes.badgesGreen : '',
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
                              {!!permissions?.member?.search && (
                                <Link to="/search/results">
                                  <IconButton>
                                    <Search />
                                  </IconButton>
                                </Link>
                              )}
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
                          dialogOpen={dialogOpen}
                          nbAlerting={nbAlerting}
                          setDialogOpen={handleNotificationButton}
                          showMore={fetchMoreAlertingKind}
                        />
                      </Grid>
                    )}
                    <Hidden xsDown>
                      <Grid item>
                        <IconButton onClick={openIntercomHelp}>
                          <HelpIcon />
                        </IconButton>
                      </Grid>
                      {permissions?.member?.search && (
                        <Grid item className={classes.searchBar}>
                          <SearchBar changeLocation />
                        </Grid>
                      )}
                      {renderAdditionalButtons()}
                    </Hidden>
                    <Hidden smUp>
                      <Grid item>{renderContractedMenu(forced_hide)}</Grid>
                    </Hidden>
                  </Grid>
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
          {displayLeftMenu ? (
            <div>
              <Hidden mdUp>
                <Drawer
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  elevation={drawerIconsOnly ? 20 : null}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  onClose={handleDrawerToggle}
                  open={mobileOpen}
                  variant="temporary"
                >
                  <ResponsiveDrawer
                    userAcknowlegdePlatformTutorial
                    companyId={companyId}
                    disconnect={disconnect}
                    featureList={featureList}
                    hasLimitedAccesToAudience={
                      theme?.has_limited_access_to_sequential_marketing
                    }
                    iconsOnly={drawerIconsOnly}
                    location={location}
                    logo={logo}
                    objectLevelPermissions={objectLevelPermissions}
                    onMenuItemClick={hideMobileDrawer}
                    permissions={permissions}
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
                    disconnect={disconnect}
                    featureList={featureList}
                    handleUserSetDrawerIconsOnly={handleUserSetDrawerIconsOnly}
                    hasLimitedAccesToAudience={
                      theme?.has_limited_access_to_sequential_marketing
                    }
                    iconsOnly={drawerIconsOnly}
                    location={location}
                    logo={logo}
                    nbTutorialAlerting={nbTutorialAlerting}
                    objectLevelPermissions={objectLevelPermissions}
                    onMenuItemClick={() => {}}
                    permissions={permissions}
                    setDrawerIconsOnly={setDrawerIconsOnly}
                    tutorialDialogOpen={openWelcometutorialDialog}
                    updateUserAcknowlegdeTutorial={
                      updateUserAcknowlegdeTutorial
                    }
                    userAcknowlegdePlatformTutorial={
                      userAcknowlegdePlatformTutorial
                    }
                  />
                </Drawer>
              </Hidden>
            </div>
          ) : (
            <Drawer
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
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
                disconnect={disconnect}
                featureList={featureList}
                hasLimitedAccesToAudience={
                  theme?.has_limited_access_to_sequential_marketing
                }
                iconsOnly={drawerIconsOnly}
                location={location}
                logo={logo}
                nbTutorialAlerting={nbTutorialAlerting}
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
              getLastClockin={getLastClockin}
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
              open={openWelcometutorialDialog}
            />
          )}
          <main
            className={classnames({
              [classes.fullContent]:
                location.pathname.includes('/spot-scheduling') ||
                location.pathname.includes('/audience/'),
              [classes.content]: !(
                location.pathname.includes('/spot-scheduling') ||
                location.pathname.includes('/audience') ||
                location.pathname.includes('/inbox/') ||
                (isLocalOrDev && location.pathname.includes('/shop'))
              ),
              [classes.unscrollableContent]:
                location.pathname.includes('/audience') &&
                !location.pathname.includes('/audience/'),
              [classes.contentWithoutPadding]:
                location.pathname.includes('/inbox/') ||
                (isLocalOrDev && location.pathname.includes('/shop')),
            })}
          >
            {displayBanner && <div className={classes.bannerContextspacing} />}
            <BillingBanner paymentMethodMissing={paymentMethodMissing} />
            <StripeOnboardingBanner
              stripeOnboardingPending={stripeOnboardingPending}
            />
            {(location?.pathname ?? '').includes('/shop/') && (
              <div className={classes.backToWebshop}>
                <Button
                  classes={{ label: classes.webshopBannerButtonLabel }}
                  onClick={handleGoToWebshop}
                  size="small"
                  startIcon={<ChevronLeft />}
                >
                  {t('backofficeMenu.backToWebshop')}
                </Button>
              </div>
            )}
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </main>
        </div>
      )}
    </BannerContext.Consumer>
  );
};

const useStyles = makeStyles<Theme, { drawerIconsOnly: boolean }>((theme) => ({
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
      paddingLeft: ({ drawerIconsOnly }) =>
        drawerIconsOnly ? drawerIconsOnlyWith : drawerWidth,
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
    width: ({ drawerIconsOnly }) =>
      drawerIconsOnly ? drawerIconsOnlyWith : drawerWidth,
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
  backToWebshop: {
    display: 'flex',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.background.paper,
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
    handleGoToWebshop: () => pushRouter('/shop'),
    setShrinkResponsiveDrawer: setShrinkResponsiveDrawerAction,
  },
);
export default compose(
  React.memo,
  connector,
  windowTitleToProps,
)(BackOfficeDrawer);
