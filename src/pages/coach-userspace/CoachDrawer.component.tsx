// @flow
import React, { useEffect, useState } from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
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
  HighlightOff,
  Menu as MenuIcon,
  Help,
  ExpandLess,
  ExpandMore,
  MoreVert,
  PowerSettingsNew,
  AccessTime,
  Payment,
} from '@material-ui/icons';

import { colors } from '@bsport/common/lib/colors';

import { DrawerContext, DrawerContextValue } from '../../context';
import { openIntercomHelp } from '../../intercom';
import LanguageButton from '#components/button/LanguageButton.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import { windowTitleToProps } from '#hocs/with-title.hoc';
import { BannerContext, BannerContextValue } from '#hocs/banner.hoc';
import VersionVisualizer from '#components/VersionVisualizer.component';
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
  disconnect: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: number;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export const CoachDrawer = (props: Props) => {
  const { children, cover, classes, t, disconnect } = props;

  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
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

    // eslint-disable-next-line no-restricted-globals
    const isActive = location?.pathname?.startsWith(item?.to);
    if (item?.type === 'nested') {
      return (
        <React.Fragment key={String(i)}>
          <ListItem
            id="button_menu_item"
            button
            onClick={() => {
              handleClick(item, i);
            }}
            selected={isActive}
            key={String(i)}
          >
            {item.icon && (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={t(item.text)}
              secondary={t(item.subtext)}
              secondaryTypographyProps={{
                style: { color: colors.primaryDark },
              }}
            />
            {open[i] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            in={open[i]}
            key={`${i}-collapse`}
            timeout="auto"
            unmountOnExit
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
        to={item.to}
        style={{ textDecoration: 'none' }}
        className={item.className || ''}
      >
        <ListItem
          button
          onClick={() => {
            handleDrawerToggle();
            if (item.action) {
              item.action();
            }
          }}
          dense={item.dense || isNested}
          selected={isActive}
          className={isNested ? classes.nestedItem : null}
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
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuItem>
            <LanguageButton
              closeMenu={() => {
                setAnchorEl(null);
              }}
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
            direction="row"
            alignItems="center"
            justify="space-between"
            wrap="nowrap"
            className={classes.appBarGrid}
          >
            <Grid item zeroMinWidth>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
                wrap="nowrap"
              >
                {isMobileDevice && (
                  <Grid item zeroMinWidth>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerToggleButton}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Grid>
                )}
                <Grid item zeroMinWidth>
                  <Typography
                    id="app-title"
                    color="inherit"
                    noWrap
                    variant="h6"
                    className={classes.title}
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
                    <IconButton onClick={openIntercomHelp}>
                      <Help />
                    </IconButton>
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

  const items = getNavigationItems(props).map((item, i) =>
    renderMenuItem(item, i, false),
  );

  const drawer = (
    <div className={classes.scrollable}>
      <div>
        <div className={classes.toolbar}>
          <Grid
            container
            className={classes.paddingTop}
            justify="center"
            alignItems="center"
          >
            <Hidden smDown>
              <img height={40} src={cover ?? LOGO_ASSET} alt="bsport logo" />
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
              className={
                isMobileDevice || !displayLeftMenu
                  ? classes.rootFullWidth
                  : classes.root
              }
            >
              {renderAppBar(displayLeftMenu)}
              {displayLeftMenu && (
                <div>
                  <Hidden mdUp>
                    <Drawer
                      variant="temporary"
                      anchor="left"
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      classes={{
                        paper: classes.drawerPaper,
                      }}
                      ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Drawer
                      variant="permanent"
                      open
                      anchor="left"
                      elevation={20}
                      classes={{
                        paper: classes.drawerPaper,
                      }}
                    >
                      {drawer}
                    </Drawer>
                  </Hidden>
                </div>
              )}
              <main className={classes.content}>
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

const getNavigationItems = (props: Props): NavigationItem[] => {
  const { disconnect, companyId } = props;

  return [
    {
      to: `/co/${companyId}/calendar/`,
      text: 'backofficeMenu.schedule',
      icon: AccessTime,
    },
    {
      to: `/co/${companyId}/payroll/`,
      text: 'backofficeMenu.coachPayroll',
      icon: Payment,
    },
    {
      action: disconnect,
      to: null,
      icon: HighlightOff,
      text: 'backofficeMenu.logoff',
    },
  ];
};

const styles = (theme: Theme) =>
  createStyles({
    paddingTop: { paddingTop: 10 },
    appBarGrid: { width: '100%' },
    root: {
      flexGrow: 1,
      zIndex: 1,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      width: '100vw',
      minHeight: '100vh',
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
      minHeight: '100vh',
    },
    grow: {
      flex: 1,
    },
    appBarFullWidth: {
      position: 'fixed',
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
    },
    appBar: {
      position: 'fixed',
      marginLeft: drawerWidth,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
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
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      width: '100%',
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(10),
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
  });

export default compose<any, OwnProps>(
  withTranslation(['navigation']),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
  withRouter,
)(CoachDrawer);
