// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { compose } from 'recompose';
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

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Star from '@material-ui/icons/Star';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import Payment from '@material-ui/icons/Payment';
import HighlightOff from '@material-ui/icons/HighlightOff';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import VpnKey from '@material-ui/icons/VpnKey';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RedeemIcon from '@material-ui/icons/Redeem';
import Badge from '@material-ui/core/Badge';
import OfflineBolt from '@material-ui/icons/OfflineBolt';
import { colors } from '@bsport/common/lib/colors';
import { People } from '@material-ui/icons';
import { ButtonBase, Dialog } from '@material-ui/core';
import { getTextColorFromRGB } from '../../utils/color';
import LanguageButton from '../button/LanguageButton.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import { windowTitleToProps } from '../../hocs/with-title.hoc';

import type { Membership } from '../../libs/membership/types';
import { WidgetUtils } from '../../libs/widget/WidgetUtils';
import { getCurrencyDisplayWithPrice } from '../../libs/theme/selectors';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import ConnectedAsDialog from '../../libs/relationship/components/ConnectedAs.dialog';

export const drawerWidth = 260;

type Props = {
  children: Object,
  theme: Object,
  classes: Object,
  disconnect: () => void,
  logo: ?string,
  showCredit?: boolean,
  hidden: boolean,
  hasMultipleMembership: boolean,
  t: TFunction,
  location: Object,
  title: string,
  buildUrl: (path: string) => string,
  membership: ?Membership,
  subscriptionPendingActionCount: number,
  infosOfMember: dict,
  programList: Array<PerformanceTrackingProgram>,
  controlableMemberList: Array<Member>,
  navigateToRelationAccount: (memberId: number) => void,
  isRelationNavigation: boolean,
  navigateBackToMasterRelation: () => void,
  hasFranchise: number | null,
  name: string,
};

type State = {
  mobileOpen: boolean,
  open: {},
  anchorEl: ?HTMLElement,
  isConnectedAsDialogOpen: boolean,
};

class ResponsiveDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
    open: {},
    anchorEl: null,
    isConnectedAsDialogOpen: false,
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
    if (!item) return null;
    const { classes, location } = this.props;
    const isActive = location.pathname.includes(item.to);
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
              primary={`${item.text} ${item.count || ''}`}
              primaryTypographyProps={{ color: 'initial' }}
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
        to={this.props.buildUrl(item.to)}
        style={{ textDecoration: 'none' }}
        className={item.className || ''}
      >
        <ListItem
          button
          onClick={() => this.handleDrawerToggle()}
          selected={isActive || item.selected}
          className={isNested ? classes.nestedItem : null}
        >
          <ListItemIcon className={isNested ? classes.nestedIcon : null}>
            <item.icon />
          </ListItemIcon>
          <ListItemText
            primary={`${item.text} ${item.count || ''}`}
            secondary={item.subtext}
            primaryTypographyProps={{
              style: { color: 'initial' },
            }}
            secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
          />
        </ListItem>
      </Link>
    );
  };

  renderAppBar = (fullWidth) => {
    const { classes } = this.props;

    return (
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
                {this.renderAdditionalButtons()}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
        {this.props.isRelationNavigation && (
          <div className={classes.relationBanner}>
            <Typography>
              {this.props.t('navigation.relationConnectedAs', {
                name: this.props.name,
              })}
            </Typography>
            <ButtonBase
              className={classes.buttonRelation}
              onClick={this.props.navigateBackToMasterRelation}
            >
              {this.props
                .t('navigation.backToRelationMasterSpace')
                ?.toUpperCase()}
            </ButtonBase>
          </div>
        )}
      </AppBar>
    );
  };

  renderAdditionalButtons = () => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    return (
      <Grid item>
        {!!this.props.controlableMemberList?.length &&
          !this.props.isRelationNavigation && (
            <Button
              className={this.props.classes.connectedAsButton}
              variant="outlined"
              color="primary"
              onClick={() => this.setState({ isConnectedAsDialogOpen: true })}
            >
              <People className={this.props.classes.icon} />
              <Typography>{this.props.t('navigation.connectedAs')}</Typography>
            </Button>
          )}
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
    const {
      classes,
      theme,
      t,
      hidden,
      membership,
      infosOfMember,
      isRelationNavigation,
    } = this.props;

    if (hidden) {
      return (
        <div style={{ width: '100%' }}>
          {this.renderAppBar(true, hidden)}
          <div className={classes.content}>{this.props.children}</div>;
        </div>
      );
    }

    const ReceiptIconWithDebt = (props) => {
      if (
        membership &&
        membership.credit_account_balance < 0 &&
        this.props.showCredit
      ) {
        return (
          <Badge
            color="error"
            badgeContent={`${getCurrencyDisplayWithPrice(
              parseInt(membership.credit_account_balance, 10),
            )}`}
          >
            <ReceiptIcon {...props} />
          </Badge>
        );
      }
      return <ReceiptIcon />;
    };

    const SubscriptionIconWithPendingAction = (props) => {
      if (this.props.subscriptionPendingActionCount) {
        return (
          <Badge
            color="error"
            badgeContent={this.props.subscriptionPendingActionCount}
          >
            <Payment {...props} />
          </Badge>
        );
      }
      return <Payment />;
    };
    const MENU = [
      { type: 'divider', className: classes.menuMobile },
      {
        to: '/home/',
        icon: Star,
        text: t('navigation.dashboard'),
      },
      'divider',
      {
        to: '/booking/',
        icon: DateRangeIcon,
        count: `${
          infosOfMember &&
          infosOfMember.nb_reservations + infosOfMember.nb_private_bookings !==
            0
            ? `(${
                infosOfMember.nb_reservations +
                infosOfMember.nb_private_bookings
              })`
            : ''
        } `,
        text: t('navigation.calendar'),
      },
      !WidgetUtils.isWidget()
        ? {
            to: '/vod/',
            icon: VideoLibrary,
            text: t('navigation.myVideos'),
          }
        : null,
      {
        to: '/pack/',
        icon: VpnKey,
        count: `${
          infosOfMember &&
          infosOfMember.nb_consumer_payment_pack +
            infosOfMember.nb_private_consumer_pass !==
            0
            ? `(${
                infosOfMember.nb_consumer_payment_pack +
                infosOfMember.nb_private_consumer_pass
              })`
            : ''
        }`,
        text: t('navigation.pack'),
      },
      {
        to: '/subscription/',
        icon: SubscriptionIconWithPendingAction,
        count: `${
          infosOfMember && infosOfMember.nb_subscriptions !== 0
            ? `(${infosOfMember.nb_subscriptions})`
            : ''
        }`,
        text: t('navigation.subscription'),
      },
      'divider',
      {
        to: '/invoice/',
        icon: ReceiptIconWithDebt,
        count: `${
          infosOfMember && infosOfMember.nb_invoices !== 0
            ? `(${infosOfMember.nb_invoices})`
            : ''
        }`,
        text: t('navigation.invoice'),
      },
      {
        to: '/giftcard/',
        icon: RedeemIcon,
        text: t('navigation.giftcard'),
      },
      this.props.programList.length !== 0 && {
        to: '/program/',
        icon: OfflineBolt,
        text: t('navigation.statistic'),
      },
      {
        to: '/profile/',
        icon: PersonIcon,
        text: t('navigation.profile'),
      },
      {
        to: `/checkout/${this.props.membership.company}/`,
        icon: ShoppingCartIcon,
        text: t('Basket'),
      },

      this.props.hasMultipleMembership &&
      !this.props.hasFranchise &&
      !WidgetUtils.isWidget() &&
      !isRelationNavigation
        ? {
            to: '/c/membership-selector/',
            icon: SettingsIcon,
            text: t('navigation.changeMembership'),
          }
        : null,
      this.props.hasFranchise && !isRelationNavigation
        ? {
            to: `/c/franchisee-selector/${this.props.hasFranchise}`,
            icon: SettingsIcon,
            text: t('navigation.changeMembership'),
          }
        : null,
      'divider',
      this.props.membership && !WidgetUtils.isWidget()
        ? {
            to: `${urlToMarketplace(
              this.props.membership.company_name,
              this.props.membership.company,
            )}/`,
            icon: ExitToAppIcon,
            text: this.props.membership.company_name,
          }
        : null,
      'divider',
      {
        to: `/login/signout?membership=${this.props.membership.company}`,
        icon: HighlightOff,
        text: t('navigation.logoff'),
      },
    ];
    const items = MENU.map((item, i) => this.renderMenuItem(item, i));

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
          {!!this.props.controlableMemberList?.length &&
            !this.props.isRelationNavigation && (
              <ListItem
                className={this.props.classes.connectedAsListItem}
                button
                onClick={() => this.setState({ isConnectedAsDialogOpen: true })}
                key={MENU.length}
              >
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText
                  primary={this.props.t('navigation.connectedAs')}
                  primaryTypographyProps={{ color: 'initial' }}
                />
              </ListItem>
            )}
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
        <main className={classes.content}>
          {/* THIS BANNER HERE IS JUST A TRICK FOR RESPONSIVITY REASON */}
          {this.props.isRelationNavigation && (
            <div className={classes.relationBannerHidden}>
              <Typography className={classes.bannerTypoHidden}>
                {this.props.t('navigation.relationConnectedAs', {
                  name: this.props.name,
                })}
              </Typography>
              <div className={classes.bannerButtonHidden}>
                {this.props
                  .t('navigation.backToRelationMasterSpace')
                  ?.toUpperCase()}
              </div>
            </div>
          )}
          {/* THIS BANNER HERE IS JUST A TRICK FOR RESPONSIVITY REASON */}
          {this.props.children}
        </main>
        <Dialog
          open={this.state.isConnectedAsDialogOpen}
          onClose={() => this.setState({ isConnectedAsDialogOpen: false })}
        >
          <ConnectedAsDialog
            memberList={this.props.controlableMemberList}
            onSelectMember={() => {}}
            closeDialog={() =>
              this.setState({ isConnectedAsDialogOpen: false })
            }
            onConfirm={this.props.navigateToRelationAccount}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonRelation: {
    textDecoration: 'underline',
    marginLeft: theme.spacing(2),
    marginBottom: '2px',
  },
  relationBannerHidden: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  bannerTypoHidden: {
    userSelect: 'none',
  },
  bannerButtonHidden: {
    userSelect: 'none',
    marginLeft: theme.spacing(2),
    marginBottom: '2px',
  },
  relationBanner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,

    color: getTextColorFromRGB(theme.palette.primary.main),
  },
  connectedAsButton: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  connectedAsListItem: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  icon: {
    marginRight: theme.spacing(2),
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
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles, { withTheme: true }),
  windowTitleToProps,
)(withRouter(ResponsiveDrawer));
