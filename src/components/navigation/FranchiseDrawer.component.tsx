import React, { useEffect, useState } from 'react';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withTranslation, WithTranslation } from 'react-i18next';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Location } from 'history';
import { compose } from 'recompose';
import classNames from 'classnames';
import { push as pushRouter } from 'connected-react-router';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import {
  WithStyles,
  createStyles,
  withStyles,
  AppBar,
  Button,
  Collapse,
  Divider,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Store,
  Group,
  HighlightOff,
  Menu as MenuIcon,
  Help,
  ExpandLess,
  ExpandMore,
  MoreVert,
  VpnKey,
  PowerSettingsNew,
  Widgets,
  Work,
  Redeem,
  Label,
  ChevronLeft,
} from '@material-ui/icons';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ScheduleIcon from '@material-ui/icons/Schedule';
import StyleIcon from '@material-ui/icons/Style';
import StarIcon from '@material-ui/icons/Star';
import Email from '@material-ui/icons/Email';
import Settings from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import Send from '@material-ui/icons/Send';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { colors } from '@bsport/common/lib/colors';
import { checkRequiredPermissions } from '#src/libs/role/utils';
import { FranchiseRolePermission } from '#src/libs/role/types';
import FranchiseUserSearchBarComponent from '#src/libs/franchise/components/FranchiseUserSearchBar.component';
import Payment from '@material-ui/icons/Payment';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

import { DrawerContext, DrawerContextValue } from '#src/context';
import { openIntercomHelp } from '#src/intercom';
// @ts-expect-error
import TempPasswordDialog from '#src/libs/login/components/TempPasswordDialog.component';
// @ts-expect-error
import LanguageButton from '#src/components/button/LanguageButton.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import { windowTitleToProps } from '#src/hocs/with-title.hoc';
import type { TempPasswordState } from '#src/libs/login/types';
import { BannerContext, BannerContextValue } from '#src/hocs/banner.hoc';
import VersionVisualizer from '#src/components/VersionVisualizer.component';
import { DISPLAY_UNIVERSAL_SHARED_PASS_PAGES } from '#src/config';

// import SearchBar from '../SearchBar.component';

export const drawerWidth = 260;
const MOBILE_SCREEN_SIZE = 960;

type NavigationItem =
  | 'divider'
  | {
      to?: string;
      text: string;
      subtext?: string;
      type?: string;
      className?: string;
      nestedItems?: NavigationItem[];
      icon?: any;
      dense?: boolean;
      action?: () => void;
    };

type OwnProps = {
  children: React.ReactNode;
  cover?: string;
  location: Location;
  tempPasswordState: TempPasswordState;
  disconnect: () => void;
  generateTempPassword: () => void;
  fetchTempPassword: () => void;
  franchisePermissions: FranchiseRolePermission;
  syncMembersAcrossCompanies: boolean;
  displayNewWebshopForFranchisees: boolean;
};

type Props = OwnProps &
  WithStyles<typeof styles> &
  WithTranslation &
  ConnectedProps<typeof connector>;

export const FranchiseDrawer = (props: Props) => {
  const {
    children,
    cover,
    classes,
    t,
    location,
    tempPasswordState,
    disconnect,
    fetchTempPassword,
    generateTempPassword,
    franchisePermissions,
    syncMembersAcrossCompanies,
    displayNewWebshopForFranchisees,
  } = props;

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tempPasswordDialogOpen, setTempPasswordDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const [isMobileDevice, setIsMobileDevice] = useState(
    window.innerWidth < MOBILE_SCREEN_SIZE,
  );

  useEffect(() => {
    const setDimension = () => {
      setIsMobileDevice(window.innerWidth < MOBILE_SCREEN_SIZE);
    };

    window.addEventListener('resize', setDimension);

    return () => {
      window.removeEventListener('resize', setDimension);
    };
  }, []);

  const handleDrawerToggle = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggleButton = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClick = (item: Object, i: number) => {
    setOpen((prevState) => ({
      ...prevState,
      [i]: !prevState[i],
    }));
  };

  const renderMenuItem = (
    item: NavigationItem,
    i: number,
    isNested: boolean,
  ) => {
    if (item === 'divider') {
      return <Divider key={i} />;
    }
    if (
      item?.text &&
      !checkRequiredPermissions(item?.text, franchisePermissions)
    ) {
      return <></>;
    }
    const isActive = location?.pathname?.startsWith(item?.to);
    if (item?.type === 'nested') {
      return (
        <React.Fragment key={String(i)}>
          <ListItem
            key={String(i)}
            button
            id="button_menu_item"
            onClick={() => {
              handleClick(item, i);
            }}
            selected={isActive}
          >
            {item.icon && (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={t(`${item.text}.label`)}
              secondary={t(item.subtext)}
              secondaryTypographyProps={{
                style: { color: colors.primaryDark },
              }}
            />
            {open[i] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            key={`${i}-collapse`}
            unmountOnExit
            in={open[i]}
            timeout="auto"
          >
            <List disablePadding className={classes.nestedList}>
              {item.nestedItems.map((subitem, subi) =>
                renderMenuItem(subitem, subi, true),
              )}
            </List>
          </Collapse>
          {open[i] && <Divider key={`${i}-second-nestedDivider`} />}
        </React.Fragment>
      );
    }
    if (item.type === 'divider') {
      return <Divider key={i} className={item.className} />;
    }

    return (
      <Link
        key={i}
        className={item.className || ''}
        style={{ textDecoration: 'none' }}
        to={item.to}
      >
        <ListItem
          button
          className={isNested ? classes.nestedItem : null}
          dense={item.dense || isNested}
          onClick={() => {
            handleDrawerToggle();
            if (item.action) {
              item.action();
            }
          }}
          selected={isActive}
        >
          {item.icon && (
            <ListItemIcon className={isNested ? classes.nestedIcon : null}>
              <item.icon />
            </ListItemIcon>
          )}

          <ListItemText
            primary={t(item.text)}
            primaryTypographyProps={{
              style: { color: 'initial' },
            }}
            secondary={t(item.subtext)}
            secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
          />
        </ListItem>
      </Link>
    );
  };

  const renderAdditionalButtons = () => {
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <Grid item>
        <Button onClick={handleButtonClick}>
          <MoreVert />
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          open={!!anchorEl}
        >
          <MenuItem>
            <LanguageButton
              closeMenu={() => {
                setAnchorEl(null);
              }}
            />
          </MenuItem>
          <MenuItem onClick={openTempPasswordDialog}>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText
              primary={props.t('backofficeMenu.requestTempPassword')}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              disconnect();
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary={t('backofficeMenu.logoff')} />
          </MenuItem>
        </Menu>
      </Grid>
    );
  };

  const openTempPasswordDialog = () => {
    fetchTempPassword();
    setTempPasswordDialogOpen(true);
  };

  const closeTempPasswordDialog = () => {
    setTempPasswordDialogOpen(false);
  };

  const renderAppBar = (displayLeftMenu: boolean) => {
    return (
      <AppBar
        className={
          isMobileDevice || !displayLeftMenu
            ? classes.appBarFullWidth
            : classes.appBar
        }
        color="inherit"
      >
        <Toolbar>
          <Grid
            container
            alignItems="center"
            direction="row"
            justify="space-between"
            style={{ width: '100%' }}
            wrap="nowrap"
          >
            <Grid item zeroMinWidth>
              <Grid
                container
                alignItems="center"
                direction="row"
                justify="flex-start"
                wrap="nowrap"
              >
                {(isMobileDevice || !displayLeftMenu) && (
                  <Grid item zeroMinWidth>
                    <IconButton
                      aria-label="open drawer"
                      color="inherit"
                      onClick={handleDrawerToggleButton}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Grid>
                )}
                <Grid item zeroMinWidth>
                  <Typography
                    noWrap
                    className={
                      !displayLeftMenu && !isMobileDevice
                        ? classes.titleAlternative
                        : classes.title
                    }
                    color="inherit"
                    id="app-title"
                    variant="h6"
                  >
                    {document?.title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" direction="row" wrap="nowrap">
                <>
                  <Grid item>
                    {/* @ts-expect-error */}
                    <IconButton onClick={openIntercomHelp}>
                      <Help />
                    </IconButton>
                  </Grid>
                  <Grid item className={classes.searchBar}>
                    {/* @ts-expect-error */}
                    <FranchiseUserSearchBarComponent changeLocation />
                  </Grid>

                  {renderAdditionalButtons()}
                </>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  const items = getNavigationItems({
    classes,
    disconnect,
    syncMembersAcrossCompanies,
    displayNewWebshopForFranchisees,
  }).map((item, i) => renderMenuItem(item, i, false));

  const drawer = (
    <div className={classes.scrollable}>
      <div>
        <div className={classes.toolbar}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ paddingTop: 10 }}
          >
            <Hidden smDown>
              <img alt="bsport logo" height={40} src={cover ?? LOGO_ASSET} />
            </Hidden>
          </Grid>
        </div>
        <List>
          {items}
          <ListItem />
          <ListItem />
          <ListItem />
        </List>
      </div>
      <VersionVisualizer />
    </div>
  );

  return (
    <DrawerContext.Consumer>
      {({ displayLeftMenu }: DrawerContextValue) => (
        <BannerContext.Consumer>
          {({ banner }: BannerContextValue) => (
            <div
              className={classNames(classes.root, {
                [classes.rootFullWidth]: isMobileDevice || !displayLeftMenu,
              })}
            >
              {renderAppBar(displayLeftMenu)}
              {displayLeftMenu ? (
                <div>
                  <Hidden mdUp>
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
                      {drawer}
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
                      {drawer}
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
                  {drawer}
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
              <main
                className={classNames({
                  [classes.content]: !(
                    location.pathname.includes('/shop') ||
                    /^\/f\/reporting\/[^/]+\/[^/]+$/.test(location.pathname)
                  ),
                  [classes.contentWithoutPadding]:
                    (displayNewWebshopForFranchisees &&
                      location.pathname.includes('/shop')) ||
                    /^\/f\/reporting\/[^/]+\/[^/]+$/.test(location.pathname),
                })}
              >
                {(location?.pathname ?? '').includes('/shop/') &&
                  displayNewWebshopForFranchisees && (
                    <div className={classes.backToWebshop}>
                      <Button
                        classes={{ label: classes.webshopBannerButtonLabel }}
                        onClick={props.handleGoToWebshop}
                        size="small"
                        startIcon={<ChevronLeft />}
                      >
                        {t('backofficeMenu.backToWebshop')}
                      </Button>
                    </div>
                  )}
                {banner}
                {children}
              </main>
            </div>
          )}
        </BannerContext.Consumer>
      )}
    </DrawerContext.Consumer>
  );
};

const getNavigationItems = (props: {
  classes: Record<string, string>;
  disconnect: () => void;
  syncMembersAcrossCompanies: boolean;
  displayNewWebshopForFranchisees: boolean;
}): NavigationItem[] => {
  const {
    disconnect,
    syncMembersAcrossCompanies,
    displayNewWebshopForFranchisees,
  } = props;
  return [
    {
      to: '/f/franchises',
      text: 'franchiseMenu.franchises',
      icon: Store,
    },

    {
      to: '/f/members',
      text: 'franchiseMenu.members',
      icon: Group,
    },
    {
      icon: BusinessCenterIcon,
      text: 'franchiseMenu.products',
      type: 'nested',
      // @ts-expect-error
      nestedItems: syncMembersAcrossCompanies
        ? [
            'divider',
            {
              to: '/f/payment-pack-template',
              text: 'franchiseMenu.products.paymentPackTemplates',
              icon: VpnKey,
            },
            {
              to: '/f/private-pass-template',
              text: 'franchiseMenu.products.privatePassTemplates',
              icon: ScheduleIcon,
            },
            ...(DISPLAY_UNIVERSAL_SHARED_PASS_PAGES
              ? [
                  {
                    to: '/f/universal-pass-template',
                    text: 'franchiseMenu.products.universalPassTemplates',
                    icon: StyleIcon,
                  },
                ]
              : []),
            displayNewWebshopForFranchisees && {
              to: '/f/shop',
              text: 'franchiseMenu.products.shopTemplates',
              icon: ShoppingCartIcon,
            },
            {
              to: '/f/giftcard-template',
              text: 'franchiseMenu.products.giftcardTemplates',
              icon: Redeem,
            },
            {
              to: '/f/coupon-template',
              text: 'franchiseMenu.products.couponTemplates',
              icon:
                getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
            },
            {
              to: '/f/subscription/contract-template',
              text: 'franchiseMenu.products.contractTemplates',
              icon: Payment,
            },
          ].filter((item) => !!item)
        : [
            'divider',
            {
              to: '/f/payment-pack-template',
              text: 'franchiseMenu.products.paymentPackTemplates',
              icon: VpnKey,
            },
            {
              to: '/f/private-pass-template',
              text: 'franchiseMenu.products.privatePassTemplates',
              icon: ScheduleIcon,
            },
            ...(DISPLAY_UNIVERSAL_SHARED_PASS_PAGES
              ? [
                  {
                    to: '/f/universal-pass-template',
                    text: 'franchiseMenu.products.universalPassTemplates',
                    icon: StyleIcon,
                  },
                ]
              : []),
            displayNewWebshopForFranchisees && {
              to: '/f/shop',
              text: 'franchiseMenu.products.shopTemplates',
              icon: ShoppingCartIcon,
            },
            {
              to: '/f/coupon-template',
              text: 'franchiseMenu.products.couponTemplates',
              icon:
                getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
            },

            {
              to: '/f/subscription/contract-template',
              text: 'franchiseMenu.products.contractTemplates',
              icon: Payment,
            },
          ].filter((item) => !!item),
    },
    {
      icon: Email,
      text: 'franchiseMenu.marketing',
      type: 'nested',
      nestedItems: [
        'divider',
        {
          icon: Email,
          to: '/f/email-template',
          text: 'franchiseMenu.marketing.emailTemplates',
        },
        {
          icon: Label,
          to: '/f/marketing/tags',
          text: 'franchiseMenu.marketing.tags',
        },
        {
          icon: Send,
          to: '/f/marketing/campaign',
          text: 'franchiseMenu.marketing.campaigns',
        },
      ],
    },
    {
      to: '/f/settings/notification-rule',
      text: 'franchiseMenu.notificationRules',
      icon: StarIcon,
    },
    {
      to: '/f/reporting',
      text: 'franchiseMenu.reporting',
      icon: DescriptionIcon,
    },
    {
      to: '/f/settings/widget',
      text: 'franchiseMenu.widgets',
      icon: Widgets,
    },
    {
      to: '/f/staffrole/staff',
      text: 'franchiseMenu.staff',
      icon: Work,
    },
    'divider',
    {
      icon: Settings,
      text: 'franchiseMenu.settings',
      to: '/f/settings/theme',
    },
    {
      action: disconnect,
      to: '#',
      icon: HighlightOff,
      text: 'backofficeMenu.logoff',
    },
  ];
};

const styles = (theme: Theme) =>
  createStyles({
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
    root: {
      flexGrow: 1,
      zIndex: 1,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      width: '100vw',
      flexDirection: 'column',
      height: '100vh',
      [theme.breakpoints.up('md')]: {
        paddingLeft: drawerWidth,
      },
    },
    rootFullWidth: {
      flexGrow: 1,
      zIndex: 1,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      width: '100vw',
      height: '100vh',
      [theme.breakpoints.up('md')]: {
        paddingLeft: 0,
      },
    },
    grow: {
      flex: 1,
    },
    menuMobile: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    menuNonMobile: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    appBarFullWidth: {
      flex: '0 1 64px',
      width: '100%',
      position: 'relative',
    },
    appBar: {
      flex: '0 1 64px',
      width: '100%',
      position: 'relative',
    },
    menuIcon: {
      height: 32,
    },
    toolbar: theme.mixins.toolbar,
    scrollable: {
      overflow: 'auto',
      paddingRight: 50,
      marginRight: -50,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'space-between',
    },
    drawerPaper: {
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      display: 'inherit',
      width: drawerWidth,
      [theme.breakpoints.up('md')]: {
        position: 'fixed',
      },
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
    contentWithoutPadding: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      overflow: 'auto',
    },
    logo: {
      alignItems: 'center',
      justify: 'center',
    },
    searchBar: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      width: 200,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    nestedList: {
      backgroundColor: '#F8F8F8',
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
    nestedItem: {
      width: '100%',
    },
    nestedIcon: {
      marginLeft: theme.spacing(2),
    },
    title: {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(4),
      },
    },
    titleAlternative: {
      paddingLeft: theme.spacing(4),
    },
    paymentMissingContainer: {
      left: 0,
      right: 0,
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
      paddingBottom: theme.spacing(2),
      zIndex: 999,
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
  });

const connector = connect(() => ({}), {
  handleGoToWebshop: () => pushRouter('/f/shop'),
});

export default compose<any, OwnProps>(
  connector,
  withTranslation(['navigation']),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
  // @ts-expect-error
)(withRouter(FranchiseDrawer));
