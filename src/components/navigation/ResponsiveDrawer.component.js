// @flow
import React from 'react';

import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import classnames from 'classnames';

import { compose, withState } from 'recompose';

import { push as pushRouter } from 'connected-react-router';

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
import AssignmentIcon from '@material-ui/icons/Assignment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ButtonBase from '@material-ui/core/ButtonBase';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Dialog } from '@material-ui/core';
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
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import LaptopIcon from '@material-ui/icons/Laptop';
import StorageIcon from '@material-ui/icons/Storage';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import LabelIcon from '@material-ui/icons/Label';

import { colors } from '@bsport/common/lib/colors';
import Tooltip from '@material-ui/core/Tooltip';
import { getTextColorFromRGB } from '../../utils/color';

import BillingBanner from './BillingBanner.component';
import StripeOnboardingBanner from './StripeOnboardingBanner.component';
import LanguageButton from '../button/LanguageButton.component';
import TempPasswordDialog from '../../libs/login/components/TempPasswordDialog.component';
import CashBookForm from '../../libs/cashbook/components/CashBookForm.component';
import SearchBar from '../SearchBar.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import AlertButtonMenu from '../../libs/alerting/components/AlertButtonMenu.component';
import { windowTitleToProps } from '../../hocs/with-title.hoc';
import { openIntercomHelp } from '../../intercom';
import { Alerting } from '../../libs/alerting/types';
import { TempPasswordState } from '../../libs/login/types';
import Config from '../../config';
import { Permission } from '../../libs/role/types';
import { checkRequiredPermissions } from '../../libs/role/utils';
import { BannerContext, BannerContextValue } from '../../hocs/banner.hoc';

export const drawerWidth = 260;

type Props = {
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
  displayLeftMenu: boolean,
  openCreateMember: () => void,
  openCalendar: () => void,
  openCash: boolean,
  setOpenCash: () => void,
  cashBook: any,
  fetchCashBook: (id: number) => void,
  loading: boolean,
  onSubmit: () => void,
  onSpotPaymentReportId: number,
  showActions: boolean,
  handleOpenOnSpotPaymentReport: () => void,
  fetchOnSpotPaymentReport: () => void,
  showCashBook: boolean,
  permissions: Permission,
  paymentMethodMissing: boolean,
  isFranchisorNavigation: boolean,
  navigateBackToFranchisor: () => void,
  companyName: string,
  stripeOnboardingPending: ?boolean,
};

type State = {
  mobileOpen: boolean,
  open: {},
  openParameters: boolean,
  tempPasswordDialogOpen: boolean,
};

class ResponsiveDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
    open: {},
    anchorEl: null,
    tempPasswordDialogOpen: false,
  };

  handleDrawerToggle = () => {
    if (this.state.mobileOpen) {
      this.setState({
        mobileOpen: false,
      });
    }
  };

  handleDrawerToggleButton = () => {
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
    if (item.permission) {
      if (!checkRequiredPermissions(item.permission, this.props.permissions)) {
        return null;
      }
    }

    if (item === 'divider') {
      return <Divider key={i} />;
    }
    if (item.type === 'nested') {
      return (
        <React.Fragment key={String(i)}>
          <ListItem
            id="button_menu_item"
            button
            onClick={() => {
              this.handleClick(item, i);
            }}
            selected={isActive}
            key={String(i)}
          >
            {item.icon ? (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            ) : null}
            <ListItemText
              id={item.id}
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

    let Wrapper = (p) => <React.Fragment>{p.children}</React.Fragment>;
    if (item.to) {
      Wrapper = (p) => (
        <Link
          key={i}
          to={item.to}
          style={{ textDecoration: 'none' }}
          className={item.className || ''}
        >
          {p.children}
        </Link>
      );
    }

    return (
      <Wrapper>
        <ListItem
          button
          onClick={() => {
            this.handleDrawerToggle();
            if (item.action) {
              item.action();
            }
          }}
          dense={item.dense || isNested}
          selected={isActive}
          className={isNested ? classes.nestedItem : null}
        >
          {item.icon ? (
            <ListItemIcon className={isNested ? classes.nestedIcon : null}>
              <item.icon />
            </ListItemIcon>
          ) : null}

          <ListItemText
            id={item.id}
            primary={item.text}
            primaryTypographyProps={{
              style: { color: 'initial' },
            }}
            secondary={item.subtext}
            secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
          />
        </ListItem>
      </Wrapper>
    );
  };

  openTempPasswordDialog = () => {
    this.props.fetchTempPassword();
    this.setState({ tempPasswordDialogOpen: true });
  };

  closeTempPasswordDialog = () => {
    this.setState({ tempPasswordDialogOpen: false });
  };

  renderAppBar = (fullWidth, forced_hide, displayMenuIcon) => {
    const {
      classes,
      nbAlerting,
      alertings,
      deleteAlert,
      fetchMoreAlertingKind,
    } = this.props;

    return (
      <BannerContext.Consumer>
        {({ banner }: BannerContextValue) => (
          <AppBar
            className={fullWidth ? classes.appBarFullWidth : classes.appBar}
            color="inherit"
          >
            <Toolbar>
              <Grid
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
                      {displayMenuIcon && !forced_hide ? (
                        <Hidden smDown>
                          <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggleButton}
                          >
                            <MenuIcon />
                          </IconButton>
                        </Hidden>
                      ) : null}
                      {!forced_hide ? (
                        <Hidden mdUp>
                          <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggleButton}
                          >
                            <MenuIcon />
                          </IconButton>
                        </Hidden>
                      ) : null}
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
                    {forced_hide && !!this.props.showActions ? (
                      <React.Fragment>
                        <Hidden mdUp>
                          <Grid item>
                            {!!this.props.showSearch && (
                              <Link to="/search/results">
                                <IconButton>
                                  <Search />
                                </IconButton>
                              </Link>
                            )}
                          </Grid>
                        </Hidden>
                        <Grid item>
                          <IconButton onClick={this.props.openCalendar}>
                            <TodayIcon />
                          </IconButton>
                        </Grid>
                      </React.Fragment>
                    ) : null}
                    {this.props.showActions && (
                      <React.Fragment>
                        {this.props.showCashBook && (
                          <Grid item>
                            <IconButton
                              onClick={() => {
                                this.props.fetchOnSpotPaymentReport({
                                  name: this.props.t(
                                    'reporting:categories.on_spot_payments',
                                  ),
                                });
                                this.props.setOpenCash(true);
                                this.props.fetchCashBook(
                                  this.props.theme.company,
                                );
                              }}
                            >
                              <Tooltip
                                title={this.props.t(
                                  'navigation:backofficeMenu.cashBookTooltip',
                                )}
                              >
                                <BusinessCenterIcon />
                              </Tooltip>
                            </IconButton>
                          </Grid>
                        )}
                        <Grid item>
                          <IconButton onClick={this.props.openCreateMember}>
                            <Tooltip
                              title={this.props.t(
                                'navigation:backofficeMenu.addMemberTooltip',
                              )}
                            >
                              <PersonAddIcon />
                            </Tooltip>
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
                      </React.Fragment>
                    )}
                    <Grid item>
                      <IconButton onClick={openIntercomHelp}>
                        <HelpIcon />
                      </IconButton>
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
            {banner}
            {this.props.isFranchisorNavigation && (
              <div className={classes.franchisorBanner}>
                <div className={classes.text}>
                  {this.props.t('backofficeMenu.franchiseConnectedAs', {
                    name: this.props.companyName,
                  })}
                  <ButtonBase
                    className={classes.buttonFranchise}
                    onClick={this.props.navigateBackToFranchisor}
                  >
                    {this.props
                      .t('backofficeMenu.backToFranchiseWorskpace')
                      ?.toUpperCase()}
                  </ButtonBase>
                </div>
              </div>
            )}
            {this.props.loading ? null : this.openCashDialog()}
          </AppBar>
        )}
      </BannerContext.Consumer>
    );
  };

  openCashDialog = () => {
    return (
      <Dialog open={this.props.openCash}>
        <DialogTitle>
          <Typography variant="h4">
            {this.props.t('backofficeMenu.cashBook.cashDialogTitle')}
          </Typography>
          <Typography variant="h6">
            {`${this.props.t('backofficeMenu.cashBook.of')} : ${
              this.props.cashBook.date
            }`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CashBookForm
            initial={this.props.cashBook}
            onSubmit={this.props.onSubmit}
            setOpenCash={this.props.setOpenCash}
            handleOpenOnSpotPaymentReport={
              this.props.onSpotPaymentReportId &&
              (() =>
                this.props.handleOpenOnSpotPaymentReport(
                  this.props.onSpotPaymentReportId,
                ))
            }
          />
        </DialogContent>
      </Dialog>
    );
  };

  renderAdditionalButtons = () => {
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
              primary={this.props.t('backofficeMenu.requestTempPassword')}
            />
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
            <ListItemText primary={this.props.t('backofficeMenu.logoff')} />
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
          {this.renderAppBar(true, hidden)}
          <div className={classes.content}>
            <BillingBanner
              paymentMethodMissing={this.props.paymentMethodMissing}
            />
            <StripeOnboardingBanner
              stripeOnboardingPending={this.props.stripeOnboardingPending}
            />
            {this.props.children}
          </div>
        </div>
      );
    }
    const items = [
      {
        to: '/search/results',
        text: t('backofficeMenu.search'),
        icon: Search,
        className: classes.menuMobile,
        permission: 'navigationMenu.search',
      },
      { type: 'divider', className: classes.menuMobile },
      {
        to: '/dashboard',
        text: t('backofficeMenu.dashboard'),
        icon: TrendingUp,
        permission: 'navigationMenu.dashboard',
      },
      'divider',
      {
        to: '/calendar',
        icon: DateRangeIcon,
        text: t('backofficeMenu.calendar'),
        permission: 'navigationMenu.calendar',
      },
      {
        to: '/private-service/calendar/',
        icon: ScheduleIcon,
        text: t('backofficeMenu.schedule'),
        permission: 'navigationMenu.schedule',
      },
      {
        icon: BusinessCenterIcon,
        text: t('backofficeMenu.myClub'),
        type: 'nested',
        permission: 'navigationMenu.myClub',
        nestedItems: [
          'divider',
          {
            to: '/activity',
            icon: Star,
            text: t('backofficeMenu.activity'),
          },
          {
            to: '/workshop-activity',
            icon: TodayIcon,
            text: t('backofficeMenu.workshopActivities'),
          },
          {
            to: '/private-service/service/',
            icon: ScheduleIcon,
            text: t('backofficeMenu.privateService.services'),
          },
          {
            to: '/coach',
            id: 'button_menu_teachers',
            icon: FitnessCenter,
            text: t('backofficeMenu.coaches'),
          },
          {
            to: '/establishment/room',
            icon: LocationOn,
            text: t('backofficeMenu.establishment'),
          },
        ],
      },
      {
        icon: ShoppingCartIcon,
        text: t('backofficeMenu.product'),
        type: 'nested',
        permission: 'navigationMenu.products',
        nestedItems: [
          'divider',
          {
            to: '/payment-pack',
            icon: VpnKey,
            text: t('backofficeMenu.pass'),
          },
          {
            to: '/private-service/pass/',
            icon: ScheduleIcon,
            text: t('backofficeMenu.privateService.pass'),
          },
          {
            to: '/shop',
            icon: ShoppingCartIcon,
            text: t('backofficeMenu.myShop'),
          },
          {
            to: '/combo',
            icon: GroupWorkIcon,
            text: t('backofficeMenu.combo'),
          },
          {
            to: '/giftcard/',
            icon: RedeemIcon,
            text: t('backofficeMenu.giftcard'),
          },
          {
            to: '/coupon/',
            icon: EuroSymbolIcon,
            text: t('backofficeMenu.coupon'),
          },
          'divider',
          {
            to: '/subscription/contract',
            icon: Payment,
            text: t('backofficeMenu.contract'),
          },
        ],
      },
      {
        icon: EuroSymbolIcon,
        text: t('backofficeMenu.payment'),
        type: 'nested',
        defaultTo: '/invoice',
        permission: 'navigationMenu.payments',
        nestedItems: [
          'divider',
          {
            to: '/invoice',
            icon: ReceiptIcon,
            text: t('backofficeMenu.invoice'),
          },
          {
            to: '/subscription',
            icon: Payment,
            text: t('backofficeMenu.subscription'),
          },
          {
            to: '/coach/performance',
            icon: PersonIcon,
            text: t('backofficeMenu.coachPerformance'),
          },
          {
            to: '/order/',
            icon: ShoppingCartIcon,
            text: t('backofficeMenu.order'),
          },
        ],
      },
      {
        icon: Email,
        text: t('backofficeMenu.message'),
        subtext:
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
            ? t('backofficeMenu.beta')
            : null,
        type: 'nested',
        defaultTo: '/smart-list',
        permission: 'navigationMenu.marketing',
        nestedItems: [
          'divider',
          {
            to: '/email-template',
            icon: Email,
            text: t('backofficeMenu.email_template'),
          },
          {
            to: '/custom-form',
            icon: AssignmentIcon,
            text: t('backofficeMenu.custom_form'),
          },
          {
            to: '/smart-list',
            icon: People,
            text: t('backofficeMenu.smart_list'),
          },
          {
            to: '/marketing/notifications',
            icon: NotificationsActiveIcon,
            text: t('backofficeMenu.marketingNotification'),
          },
          {
            to: '/marketing/tags',
            icon: LabelIcon,
            text: t('backofficeMenu.tags'),
          },
          {
            to: '/marketing/strategies',
            icon: StorageIcon,
            subtext:
              Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
                ? t('backofficeMenu.alpha')
                : null,
            text: t('backofficeMenu.sequence'),
          },
        ],
      },
      {
        icon: LaptopIcon,
        text: t('backofficeMenu.digital'),
        type: 'nested',
        permission: 'navigationMenu.digitalOffer',
        nestedItems: [
          'divider',
          {
            icon: VideoLibraryIcon,
            text: t('backofficeMenu.video'),
            disabled: true,
            to: '/vod/video',
            subtext: t('backofficeMenu.alpha'),
          },
          {
            icon: PlaylistPlayIcon,
            text: t('backofficeMenu.playlist'),
            disabled: true,
            to: '/vod/playlist',
            subtext: t('backofficeMenu.alpha'),
          },
        ],
      },
      {
        to: '/member',
        icon: People,
        text: t('backofficeMenu.member'),
        permission: 'navigationMenu.member',
      },
      {
        to: '/reporting',
        icon: DescriptionIcon,
        text: t('backofficeMenu.reporting'),
        permission: 'navigationMenu.reporting',
      },
      'divider',
      {
        icon: SettingsIcon,
        text: t('backofficeMenu.settings.settings'),
        type: 'nested',
        defaultTo: '/settings/general',
        permission: 'navigationMenu.settings',
        nestedItems: [
          'divider',
          {
            to: '/settings/general',
            dense: 'true',
            text: t('backofficeMenu.settings.general'),
          },
          {
            to: '/settings/marketplace-settings',
            dense: 'true',
            text: t('backofficeMenu.settings.marketplaceSettings'),
          },
          {
            to: '/settings/widget',
            dense: 'true',
            text: t('backofficeMenu.settings.widget'),
          },
          {
            to: '/settings/role',
            dense: 'true',
            text: t('backofficeMenu.settings.role'),
          },
          {
            to: '/settings/personalization',
            dense: 'true',
            text: t('backofficeMenu.settings.personalization'),
          },
          {
            to: '/settings/forms',
            dense: 'true',
            text: t('backofficeMenu.settings.forms'),
          },
          {
            to: '/settings/broadcast',
            dense: 'true',
            text: t('backofficeMenu.settings.broadcast'),
          },
          {
            to: '/settings/notification-rule',
            dense: 'true',
            text: t('backofficeMenu.settings.notificationRule'),
          },
          {
            to: '/settings/payment-rules',
            dense: 'true',
            text: t('backofficeMenu.settings.paymentRules'),
          },
          {
            to: '/settings/payment-methods',
            dense: 'true',
            text: t('backofficeMenu.settings.paymentMethod'),
          },
          {
            to: '/settings/company',
            dense: 'true',
            text: t('backofficeMenu.settings.company'),
          },
          {
            to: '/settings/invoice',
            dense: 'true',
            text: t('backofficeMenu.settings.invoice'),
          },
          {
            to: '/settings/waiting-list',
            dense: 'true',
            text: t('backofficeMenu.settings.waitingList'),
          },
          {
            to: '/settings/shop',
            dense: 'true',
            text: t('backofficeMenu.settings.shop'),
          },
          {
            to: '/settings/webhook',
            dense: 'true',
            text: t('backofficeMenu.settings.webhook'),
          },
          {
            to: '/settings/partnership',
            dense: 'true',
            text: t('backofficeMenu.settings.partnership'),
          },
          {
            to: '/settings/quickbooks',
            dense: 'true',
            text: t('backofficeMenu.settings.quickbooks'),
          },
          {
            to: '/settings/active-campaign',
            dense: 'true',
            text: t('backofficeMenu.settings.active_campaign'),
          },
          {
            to: '/settings/platform-billing',
            dense: 'true',
            text: t('backofficeMenu.settings.platform_billing'),
          },
        ],
      },
      {
        action: this.props.disconnect,
        to: null,
        icon: HighlightOff,
        text: t('backofficeMenu.logoff'),
      },
    ].map((item, i) => {
      return this.renderMenuItem(item, i, false);
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
      <BannerContext.Consumer>
        {({ displayBanner }: BannerContextValue) => (
          <div
            className={
              this.props.displayLeftMenu ? classes.root : classes.rootFullWidth
            }
          >
            {this.props.displayLeftMenu
              ? this.renderAppBar()
              : this.renderAppBar(true, false, true)}
            {this.props.displayLeftMenu ? (
              <div>
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
              </div>
            ) : (
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
            )}
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
            <main
              className={classnames({
                [classes.fullContent]:
                  this.props.location.pathname.includes('/spot-scheduling'),
                [classes.content]:
                  !this.props.location.pathname.includes('/spot-scheduling'),
              })}
            >
              {this.props.isFranchisorNavigation && (
                <div className={classes.fillerFranchisor} />
              )}
              {displayBanner && (
                <div className={classes.bannerContextspacing} />
              )}

              <BillingBanner
                paymentMethodMissing={this.props.paymentMethodMissing}
              />
              <StripeOnboardingBanner
                stripeOnboardingPending={this.props.stripeOnboardingPending}
              />
              {this.props.children}
            </main>
          </div>
        )}
      </BannerContext.Consumer>
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
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  fullContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: '56px', // toolbar height
    [theme.breakpoints.up('sm')]: {
      marginTop: '64px', // toolbar height
    },
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
});

export default compose(
  connect(
    (state) => ({
      loading: state.cashbook.loading,
      cashBook: state.cashbook.infos,
    }),
    { handleOpenOnSpotPaymentReport: (id) => pushRouter(`/reporting/${id}`) },
  ),
  withState('openCash', 'setOpenCash', false),
  withTranslation(['navigation']),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
)(withRouter(ResponsiveDrawer));
