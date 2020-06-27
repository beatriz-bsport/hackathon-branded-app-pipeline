// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
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
import Star from '@material-ui/icons/Star';
import Payment from '@material-ui/icons/Payment';
import HighlightOff from '@material-ui/icons/HighlightOff';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import VpnKey from '@material-ui/icons/VpnKey';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Badge from '@material-ui/core/Badge';
import type { TFunction } from 'react-i18next';

import { colors } from '@bsport/common/lib/colors';
import { LanguageButton } from '../button/LanguageButton.component';
import LOGO_ASSET from '../../public/images/banner_lowres.png';
import { windowTitleToProps } from '../../hocs/with-title.hoc';

import type { Membership } from '../../libs/membership/types';
import { urlToMarketplace } from '../../libs/marketplace/utils';

export const drawerWidth = 260;

type Props = {
  children: Object,
  theme: Object,
  classes: Object,
  disconnect: () => void,
  logo: ?string,
  hidden: boolean,
  hasMultipleMembership: boolean,
  t: TFunction,
  location: Object,
  title: string,
  buildUrl: (path: string) => string,
  membership: ?Membership,
};

type State = {
  mobileOpen: boolean,
  open: {},
  anchorEl: ?HTMLElement,
};

class ResponsiveDrawer extends React.Component<Props, State> {
  state = {
    mobileOpen: false,
    open: {},
    anchorEl: null,
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
              primary={item.text}
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
            primary={item.text}
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
      </AppBar>
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
    const { classes, theme, t, hidden, membership } = this.props;
    if (hidden) {
      return (
        <div style={{ width: '100%' }}>
          {this.renderAppBar(true, hidden)}
          <div className={classes.content}>{this.props.children}</div>;
        </div>
      );
    }

    const ReceiptIconWithDebt = (props) => {
      if (membership && membership.credit_account_balance < 0) {
        return (
          <Badge
            color="error"
            badgeContent={`${parseInt(membership.credit_account_balance, 10)}€`}
          >
            <ReceiptIcon {...props} />
          </Badge>
        );
      }
      return <ReceiptIcon />;
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
        text: t('navigation.calendar'),
      },
      {
        to: '/pack/',
        icon: VpnKey,
        text: t('navigation.pack'),
      },
      {
        to: '/subscription/',
        icon: Payment,
        text: t('navigation.subscription'),
      },
      'divider',
      {
        to: '/invoice/',
        icon: ReceiptIconWithDebt,
        text: t('navigation.invoice'),
      },
      {
        to: '/profile/',
        icon: PersonIcon,
        text: t('navigation.profile'),
      },

      this.props.hasMultipleMembership
        ? {
            to: '/c/membership-selector/',
            icon: SettingsIcon,
            text: t('navigation.changeMembership'),
          }
        : null,
      'divider',
      this.props.membership
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
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(10),
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
