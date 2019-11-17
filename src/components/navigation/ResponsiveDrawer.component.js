// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { compose } from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

import RedeemIcon from '@material-ui/icons/Redeem';
import TodayIcon from '@material-ui/icons/Today';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Star from '@material-ui/icons/Star';
import People from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import Payment from '@material-ui/icons/Payment';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Email from '@material-ui/icons/Email';
import HighlightOff from '@material-ui/icons/HighlightOff';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import VpnKey from '@material-ui/icons/VpnKey';
import LocationOn from '@material-ui/icons/LocationOn';
import Search from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import HelpIcon from '@material-ui/icons/Help';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import StorageIcon from '@material-ui/icons/Storage';
import type { TFunction } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';
import { LanguageButton } from '../button/LanguageButton.component';
import TempPasswordDialog from '../../libs/login/components/TempPasswordDialog.component';
import SearchBar from '../SearchBar.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import AlertButtonMenu from '../../libs/alerting/components/AlertButtonMenu.component';
import { windowTitleToProps } from '../../hocs/with-title.hoc';
import { openIntercomHelp } from '../../intercom';
import type { Alerting } from '../../libs/alerting/types';
import type { TempPasswordState } from '../../libs/login/types';
import Config from '../../config';

export const drawerWidth = 260;

type Props = {
  isRefreshing: boolean,
  onRefresh: () => void,
  children: Object,
  theme: Object,
  classes: Object,
  nbAlerting: number,
  alertings: Array<Alerting>,
  disconnect: () => void,
  logo: ?string,
  hidden: boolean,
  showSearch: boolean,
  deleteAlert: (id: number) => void,
  fetchMoreAlertingKind: (alert_kind: number) => void,
  t: TFunction,
  location: Object,
  title: string,
  tempPasswordState: TempPasswordState,
  fetchTempPassword: () => void,
  generateTempPassword: () => void,
};

type State = {
  mobileOpen: boolean,
  open: {},
  openParameters: boolean,
};

class ResponsiveDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
    open: {},
    anchorEl: null,
    tempPasswordDialogOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState((prevState) => ({
      mobileOpen: !prevState.mobileOpen,
    }));
  };

  handleClick = (item: Object, i: number) => {
    this.setState((prevState) => ({
      open: {
        [i]: !prevState.open[i],
      },
    }));
  };

  renderMenuItem = (item: Object, i, isNested) => {
    const { classes, location } = this.props;
    const isActive = location.pathname.startsWith(item.to);
    if (item === 'divider') {
      return <Divider key={i} />;
    }
    if (item.type === 'nested') {
      return (
        <React.Fragment key={String(i)}>
          <ListItem
            button
            onClick={() => this.handleClick(item, i)}
            selected={isActive}
            key={String(i)}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText
              inset
              primary={item.text}
              secondary={item.subtext}
              secondaryTypographyProps={{
                style: { color: colors.primaryDark },
              }}
            />
            {this.state.open[i] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse
            in={this.state.open[i]}
            key={`${i}-collapse`}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding className={classes.nestedList}>
              {item.nestedItems.map((subitem, subi) =>
                this.renderMenuItem(subitem, subi, true),
              )}
            </List>
          </Collapse>
          {this.state.open[i] ? (
            <Divider key={`${i}-second-nestedDivider`} />
          ) : null}
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
          onClick={() => this.handleDrawerToggle()}
          selected={isActive}
          className={isNested ? classes.nestedItem : null}
        >
          <ListItemIcon className={isNested ? classes.nestedIcon : null}>
            <item.icon />
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            secondary={item.subtext}
            secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
          />
        </ListItem>
      </Link>
    );
  };

  openTempPasswordDialog = () => {
    this.props.fetchTempPassword();
    this.setState({ tempPasswordDialogOpen: true });
  };

  closeTempPasswordDialog = () => {
    this.setState({ tempPasswordDialogOpen: false });
  };

  renderAppBar = (fullWidth) => {
    const {
      classes,
      nbAlerting,
      alertings,
      deleteAlert,
      fetchMoreAlertingKind,
    } = this.props;

    return (
      <AppBar
        className={fullWidth ? classes.appBarFullWidth : classes.appBar}
        color="inherit"
      >
        <Toolbar>
          <Grid
            zeroMinWidth
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            wrap="nowrap"
            style={{ width: '100%' }}
          >
            <Grid item zeroMinWidth>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
                wrap="nowrap"
              >
                <Grid item zeroMinWidth>
                  <Hidden mdUp>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={this.handleDrawerToggle}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Hidden>
                </Grid>
                <Grid item zeroMinWidth>
                  <Typography
                    id="app-title"
                    color="inherit"
                    noWrap
                    variant="h6"
                    className={classes.title}
                  >
                    {this.props.title}
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
                implementation="css"
              >
                <Grid item>
                  <IconButton onClick={openIntercomHelp}>
                    <HelpIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <AlertButtonMenu
                    alertings={alertings}
                    nbAlerting={nbAlerting}
                    deleteAlert={deleteAlert}
                    showMore={fetchMoreAlertingKind}
                  />
                </Grid>
                {this.props.showSearch ? (
                  <Grid item className={classes.searchBar}>
                    <SearchBar changeLocation />
                  </Grid>
                ) : null}
                {this.renderAdditionalButtons()}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  renderAdditionalButtons = () => {
    const { isRefreshing, onRefresh } = this.props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    return (
      <Grid item>
        <Button onClick={handleClick}>
          <MoreVertIcon />
        </Button>
        <Menu
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={() => {
            this.setState({ anchorEl: null });
          }}
        >
          <MenuItem>
            <LanguageButton
              closeMenu={() => {
                this.setState({ anchorEl: null });
              }}
            />
          </MenuItem>
          <MenuItem onClick={this.openTempPasswordDialog}>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText
              primary={this.props.t('navigation.requestTempPassword')}
            />
          </MenuItem>
          <MenuItem onClick={onRefresh}>
            <ListItemIcon>
              {isRefreshing ? <CircularProgress /> : <RefreshIcon />}
            </ListItemIcon>
            <ListItemText primary={this.props.t('navigation.refresh')} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.setState({ anchorEl: null });
              this.props.disconnect();
            }}
          >
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={this.props.t('navigation.logoff')} />
          </MenuItem>
        </Menu>
      </Grid>
    );
  };

  render() {
    const { classes, theme, t, hidden } = this.props;
    if (hidden) {
      return (
        <div style={{ width: '100%' }}>
          {this.renderAppBar(true, true)}
          <div className={classes.content}>{this.props.children}</div>;
        </div>
      );
    }
    const items = [
      {
        to: '/search/results',
        text: t('navigation.search'),
        icon: Search,
        className: classes.menuMobile,
      },
      { type: 'divider', className: classes.menuMobile },
      {
        to: '/dashboard',
        text: t('navigation.dashboard'),
        icon: TrendingUp,
      },
      'divider',
      {
        to: '/calendar',
        icon: DateRangeIcon,
        text: t('navigation.calendar'),
      },
      {
        icon: ScheduleIcon,
        text: t('navigation.privateService.title'),
        type: 'nested',
        nestedItems: [
          {
            to: '/private-service/calendar/',
            icon: TodayIcon,
            text: t('navigation.privateService.calendar'),
          },
          {
            to: '/private-service/service/',
            icon: Star,
            text: t('navigation.privateService.services'),
          },
          {
            to: '/private-service/pass/',
            icon: VpnKey,
            text: t('navigation.privateService.pass'),
          },
        ],
      },
      {
        icon: BusinessCenterIcon,
        text: t('navigation.myClub'),
        type: 'nested',
        nestedItems: [
          {
            to: '/activity',
            icon: Star,
            text: t('navigation.activity'),
          },
          {
            to: '/workshop-activity',
            icon: TodayIcon,
            text: t('navigation.workshopActivities'),
          },
          {
            to: '/coach',
            icon: FitnessCenter,
            text: t('common.coaches'),
          },
          {
            to: '/establishment',
            icon: LocationOn,
            text: t('navigation.establishment'),
          },
          'divider',
          {
            to: '/payment-pack',
            icon: VpnKey,
            text: t('navigation.pass'),
          },
          {
            to: '/shop',
            icon: ShoppingCartIcon,
            text: t('shop.myShop'),
          },
          {
            to: '/combo',
            icon: GroupWorkIcon,
            text: t('navigation.combo'),
          },
        ],
      },
      {
        icon: EuroSymbolIcon,
        text: t('navigation.payment'),
        type: 'nested',
        nestedItems: [
          {
            to: '/invoice',
            icon: ReceiptIcon,
            text: t('navigation.invoice'),
          },
          {
            to: '/subscription',
            icon: Payment,
            text: t('navigation.subscription'),
          },
          {
            to: '/coach/performance',
            icon: PersonIcon,
            text: t('navigation.coachPerformance'),
          },
          {
            to: '/coupon/',
            icon: RedeemIcon,
            text: t('navigation.coupon'),
          },
          {
            to: '/order/',
            icon: ShoppingCartIcon,
            text: t('navigation.order'),
          },
        ],
      },
      {
        icon: Email,
        text: t('navigation.message'),
        subtext:
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
            ? t('navigation.beta')
            : null,
        type: 'nested',
        nestedItems: [
          {
            to: '/smart-list',
            icon: People,
            text: t('navigation.smart_list'),
          },
          {
            to: '/email-template',
            icon: Email,
            text: t('navigation.email_template'),
          },
          {
            to: '/marketing',
            icon: StorageIcon,
            subtext:
              Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
                ? t('navigation.alpha')
                : null,
            text: t('navigation.sequence'),
          },
        ],
      },
      {
        to: '/member',
        icon: People,
        text: t('navigation.member'),
      },
      {
        to: '/reporting',
        icon: DescriptionIcon,
        text: t('navigation.reporting'),
      },
      'divider',
      {
        to: '/settings/general',
        icon: SettingsIcon,
        text: t('navigation.settings'),
      },
      {
        to: '/login/signout',
        icon: HighlightOff,
        text: t('navigation.logoff'),
      },
    ].map((item, i) => {
      return this.renderMenuItem(item, i);
    });
    const drawer = (
      <div className={classes.scrollable}>
        <div className={classes.toolbar}>
          <Grid
            container
            style={{ paddingTop: 10 }}
            justify="center"
            alignItems="center"
          >
            <Hidden smDown>
              <img
                height={40}
                src={this.props.logo || LOGO_ASSET}
                alt="bsport logo"
              />
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
    );
    return (
      <div className={classes.root}>
        {this.renderAppBar()}
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
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
        <TempPasswordDialog
          generateTempPassword={this.props.generateTempPassword}
          tempPassword={this.props.tempPasswordState.password}
          loading={this.props.tempPasswordState.loading}
          tempPasswordExpirationDate={
            this.props.tempPasswordState.expiration_date
          }
          onClose={this.closeTempPasswordDialog}
          open={this.state.tempPasswordDialogOpen}
        />
        <main className={classes.content}>{this.props.children}</main>
      </div>
    );
  }
}

const styles = (theme) => ({
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
  menuIcon: {
    height: 32,
  },
  toolbar: theme.mixins.toolbar,
  scrollable: {
    overflow: 'auto',
    paddingRight: 50,
    marginRight: -50,
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
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 10,
  },
  logo: {
    alignItems: 'center',
    justify: 'center',
  },
  searchBar: {
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
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
    marginLeft: theme.spacing.unit * 2,
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing.unit * 4,
    },
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
)(withRouter(ResponsiveDrawer));
