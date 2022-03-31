// @flow
import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
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
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimerIcon from '@material-ui/icons/Timer';
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

import Tooltip from '@material-ui/core/Tooltip';
import Config from '../../../config';
import { getTextColorFromRGB } from '../../../utils/color';

import BillingBanner from '../BillingBanner.component';
import StripeOnboardingBanner from '../StripeOnboardingBanner.component';
import LanguageButton from '../../button/LanguageButton.component';
import TempPasswordDialog from '../../../libs/login/components/TempPasswordDialog.component';
import CashBookForm from '../../../libs/cashbook/components/CashBookForm.component';
import SearchBar from '../../SearchBar.component';
import AlertButtonMenu from '../../../libs/alerting/components/AlertButtonMenu.component';
import { windowTitleToProps } from '../../../hocs/with-title.hoc';
import { openIntercomHelp } from '../../../intercom';
import { Alerting } from '../../../libs/alerting/types';
import { TempPasswordState } from '../../../libs/login/types';
import { Permission } from '../../../libs/role/types';
import { BannerContext, BannerContextValue } from '../../../hocs/banner.hoc';
import ClockInDialog from '#libs/clock-in/components/ClockInDialog.component';
import ResponsiveDrawer from './ResponsiveDrawer.component';
import { LastClockIn } from '#libs/clock-in/types';
import { UPSELL_IDENTIFIER_CLOCK_IN } from '#libs/platform-billing/upsell-identifiers';

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
  name: string,
  openCalendar: () => void,
  openCash: boolean,
  setOpenCash: () => void,
  cashBook: any,
  fetchCashBook: (id: number) => void,
  loading: boolean,
  onSubmit: () => void,
  onSpotPaymentReportId: number,
  handleOpenOnSpotPaymentReport: () => void,
  fetchOnSpotPaymentReport: () => void,
  permissions?: Permission,
  paymentMethodMissing: boolean,
  isFranchisorNavigation: boolean,
  navigateBackToFranchisor: () => void,
  companyId: number,
  companyName: string,
  stripeOnboardingPending: ?boolean,
  featureList: Array<{
    upsell_identifier: number,
    readable_identifier: string,
  }>,
  email: string,
  roles: Role[],
  lastClockIn: LastClockIn,
  usersPaginatedWithRoles: {
    loading: boolean,
    count: number,
    results: UserCurrentAttendance[],
  },
  getStaffsAttendanceRealTime: (params: {
    page: number,
    page_size: number,
  }) => Promise<void>,
  clockIn: (
    params: { userId?: number },
    options?: OptionCallback,
  ) => Promise<void>,
  fetchCompanyUserRolesPaginated: (
    params: {
      page: number,
      page_size: number,
    },
    options?: OptionPaginatedCallback<Role>,
  ) => Promise<void>,
  clockOut: (
    params: {
      clockInId: number,
    },
    options?: OptionCallback<void>,
  ) => Promise<void>,
  getLastClockin: ({}) => Promise<void>,
};

type State = {
  mobileOpen: boolean,
  openParameters: boolean,
  tempPasswordDialogOpen: boolean,
  clockInDialogOpen: Boolean,
};

class BackofficeDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
    anchorEl: null,
    tempPasswordDialogOpen: false,
    clockInDialogOpen: false,
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

  openTempPasswordDialog = () => {
    this.props.fetchTempPassword();
    this.setState({ tempPasswordDialogOpen: true });
  };

  closeTempPasswordDialog = () => {
    this.setState({ tempPasswordDialogOpen: false });
  };

  openClockInDialog = () => {
    this.setState({ clockInDialogOpen: true });
  };

  closeClockInDialog = () => {
    this.setState({ clockInDialogOpen: false });
  };

  hasUpsellIdentifier = (identifier: string) =>
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    this.props.featureList
      .map((ups) => ups.upsell_identifier)
      .includes(identifier);

  renderAppBar = (fullWidth, forced_hide, displayMenuIcon) => {
    const {
      classes,
      nbAlerting,
      alertings,
      permissions,
      deleteAlert,
      fetchMoreAlertingKind,
    } = this.props;

    const isClockIn = this.props.lastClockIn?.onGoing;

    return (
      <BannerContext.Consumer>
        {({ banner }: BannerContextValue) => (
          <AppBar className={classes.appBar} color="inherit">
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
                    {this.hasUpsellIdentifier(UPSELL_IDENTIFIER_CLOCK_IN) &&
                      (permissions?.navigationMenu?.payments?.clockIn
                        ?.selfClockIn ||
                        permissions?.navigationMenu?.payments?.clockIn
                          ?.clockInForOther) && (
                        <Grid item>
                          <IconButton onClick={this.openClockInDialog}>
                            <Tooltip
                              title={this.props.t(
                                'navigation:backofficeMenu.clockIn',
                              )}
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
                                color={isClockIn ? 'primary' : 'error'}
                                classes={{
                                  badge: isClockIn ? classes.badgesGreen : '',
                                }}
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
                          <IconButton onClick={this.props.openCalendar}>
                            <TodayIcon />
                          </IconButton>
                        </Grid>
                      </React.Fragment>
                    )}
                    {permissions?.appbarButtons?.ledger && (
                      <Grid item>
                        <IconButton
                          onClick={() => {
                            this.props.fetchOnSpotPaymentReport({
                              name: this.props.t(
                                'reporting:categories.on_spot_payments',
                              ),
                            });
                            this.props.setOpenCash(true);
                            this.props.fetchCashBook(this.props.theme.company);
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
                    {permissions?.member?.create && (
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
                    )}
                    {permissions?.appbarButtons?.notificationCenter && (
                      <Grid item>
                        <AlertButtonMenu
                          alertings={alertings}
                          nbAlerting={nbAlerting}
                          deleteAlert={deleteAlert}
                          showMore={fetchMoreAlertingKind}
                        />
                      </Grid>
                    )}
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
            permissions={this.props.permissions}
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
    const { classes, theme, hidden } = this.props;
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
                    <ResponsiveDrawer
                      logo={this.props.logo}
                      location={this.props.location}
                      companyId={this.props.companyId}
                      featureList={this.props.featureList}
                      permissions={this.props.permissions}
                      disconnect={this.props.disconnect}
                    />
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
                    <ResponsiveDrawer
                      logo={this.props.logo}
                      location={this.props.location}
                      companyId={this.props.companyId}
                      featureList={this.props.featureList}
                      permissions={this.props.permissions}
                      disconnect={this.props.disconnect}
                    />
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
                <ResponsiveDrawer
                  logo={this.props.logo}
                  location={this.props.location}
                  companyId={this.props.companyId}
                  featureList={this.props.featureList}
                  permissions={this.props.permissions}
                  disconnect={this.props.disconnect}
                />
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
            {this.state.clockInDialogOpen && (
              <ClockInDialog
                open={this.state.clockInDialogOpen}
                name={this.props.name}
                email={this.props.email}
                permissions={this.props.permissions}
                lastClockIn={this.props.lastClockIn}
                onClose={this.closeClockInDialog}
                registerSelfClockin={this.props.clockIn}
                roles={this.props.roles}
                value={this.props.usersPaginatedWithRoles}
                fetchAttendance={this.props.getStaffsAttendanceRealTime}
                clockIn={this.props.clockIn}
                fetchCompanyUserRolesPaginated={
                  this.props.fetchCompanyUserRolesPaginated
                }
                clockOut={this.props.clockOut}
                getLastClockin={this.props.getLastClockin}
              />
            )}
            <main
              className={classnames({
                [classes.fullContent]:
                  this.props.location.pathname.includes('/spot-scheduling'),
                [classes.content]:
                  !this.props.location.pathname.includes('/spot-scheduling'),
              })}
            >
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
    flexDirection: 'column',
    width: '100vw',
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
  },
  toolbar: theme.mixins.toolbar,
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
  fullContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
    paddingTop: theme.spacing(2),
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
  badgesGreen: {
    backgroundColor: theme.palette.success.main,
  },
  badgesIcon: {
    fill: 'white',
    height: 10,
    width: 10,
  },
});

export default compose(
  connect(
    (state) => ({
      loading: state.cashbook.loading,
      cashBook: state.cashbook.infos,
    }),
    {
      handleOpenOnSpotPaymentReport: (id) => pushRouter(`/reporting/${id}`),
    },
  ),
  withState('openCash', 'setOpenCash', false),
  withTranslation(['navigation']),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
)(withRouter(BackofficeDrawer));
