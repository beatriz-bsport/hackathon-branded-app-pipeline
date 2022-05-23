import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AssignmentIcon from '@material-ui/icons/Assignment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Collapse from '@material-ui/core/Collapse';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DescriptionIcon from '@material-ui/icons/Description';
import Divider from '@material-ui/core/Divider';
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import Email from '@material-ui/icons/Email';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import Grid from '@material-ui/core/Grid';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Hidden from '@material-ui/core/Hidden';
import HighlightOff from '@material-ui/icons/HighlightOff';
import LabelIcon from '@material-ui/icons/Label';
import LaptopIcon from '@material-ui/icons/Laptop';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOn from '@material-ui/icons/LocationOn';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import Payment from '@material-ui/icons/Payment';
import People from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RedeemIcon from '@material-ui/icons/Redeem';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Search from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Star from '@material-ui/icons/Star';
import StorageIcon from '@material-ui/icons/Storage';
import TimerIcon from '@material-ui/icons/Timer';
import TodayIcon from '@material-ui/icons/Today';
import TrendingUp from '@material-ui/icons/TrendingUp';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import VpnKey from '@material-ui/icons/VpnKey';
import { colors } from '@bsport/common/lib/colors';
import Config from '../../../config';

import { getCurrencyDisplay } from '../../../libs/theme/selectors';

import LOGO_ASSET from '../../../public/images/banner_lowres.png';
import { checkRequiredPermissions } from '../../../libs/role/utils';
import VersionVisualizer from '../../VersionVisualizer.component';

import {
  UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_CUSTOM_APP,
} from '#libs/platform-billing/upsell-identifiers';
import { Permission } from '#libs/role/types';

export const drawerWidth = 260;

type Props = {
  logo?: string;
  location: Object;
  companyId: number;
  featureList: {
    upsell_identifier: number;
    readable_identifier: string;
  }[];
  permissions: Permission;
  disconnect: () => void;
  onMenuItemClick: () => void;
};

type DrawerItem =
  | {
      icon?: React.ElementType;
      action?: () => void;
      text: string;
      subtext?: string | null;
      className?: string;
      to: string | null;
      permission?: string;
      disabled?: boolean;
      dense?: boolean;
      id?: string;
    }
  | {
      type: 'divider';
      className?: string;
    }
  | {
      icon: React.ElementType;
      text: string;
      type: 'nested';
      subtext?: string | null;
      className?: string;
      defaultTo?: string;
      permission?: string;
      nestedItems: DrawerItem[];
    };

const ResponsiveDrawer: React.FC<Props> = ({
  logo,
  location,
  featureList,
  companyId,
  permissions,
  disconnect,
  onMenuItemClick,
}) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles();

  const [toggledMenu, setToggledMenu] = useState<Record<number, boolean>>({});

  const handleToggle = (i: number) => () => {
    const newToggledMenu = {
      [i]: !toggledMenu?.[i] ?? false,
    };

    setToggledMenu(newToggledMenu);
  };

  const hasUpsellIdentifier = (identifier: number) =>
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    featureList.map((ups) => ups.upsell_identifier).includes(identifier);

  const items: DrawerItem[] = [
    {
      to: '/search/results',
      text: t('backofficeMenu.search'),
      icon: Search,
      className: classes.menuMobile,
      permission: 'member.search',
    },
    { type: 'divider', className: classes.menuMobile },
    {
      to: '/dashboard',
      text: t('backofficeMenu.dashboard'),
      icon: TrendingUp,
      permission: 'navigationMenu.dashboard',
    },
    { type: 'divider' },
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
        { type: 'divider' },
        {
          to: '/activity',
          icon: Star,
          text: t('backofficeMenu.activity'),
          permission: 'navigationMenu.myClub.activities',
        },
        {
          to: '/workshop-activity/tabs/list',
          icon: TodayIcon,
          text: t('backofficeMenu.workshopActivities'),
          permission: 'navigationMenu.myClub.workshops',
        },
        {
          to: '/private-service/service/',
          icon: ScheduleIcon,
          text: t('backofficeMenu.privateService.services'),
          permission: 'navigationMenu.myClub.appointments',
        },
        {
          to: '/coach',
          id: 'button_menu_teachers',
          icon: FitnessCenter,
          text: t('backofficeMenu.coaches'),
          permission: 'navigationMenu.myClub.teachers',
        },
        {
          to: '/establishment/room',
          icon: LocationOn,
          text: t('backofficeMenu.establishment'),
          permission: 'navigationMenu.myClub.establishments',
        },
        ...(![634, 631, 632, 633, 630].includes(companyId) &&
        !hasUpsellIdentifier(UPSELL_PERFORMANCE_TRACKING_IDENTIFIER)
          ? []
          : [
              {
                to: '/performance-tracking',
                icon: OfflineBoltIcon,
                text: t('backofficeMenu.programs'),
                permission: 'navigationMenu.myClub.programs',
              },
            ]),
      ],
    },
    {
      icon: ShoppingCartIcon,
      text: t('backofficeMenu.product'),
      type: 'nested',
      permission: 'navigationMenu.products',
      nestedItems: [
        { type: 'divider' },
        {
          to: '/payment-pack',
          icon: VpnKey,
          text: t('backofficeMenu.pass'),
          permission: 'navigationMenu.products.paymentPack',
        },
        {
          to: '/private-service/pass/',
          icon: ScheduleIcon,
          text: t('backofficeMenu.privateService.pass'),
          permission: 'navigationMenu.products.privatePass',
        },
        {
          to: '/shop',
          icon: ShoppingCartIcon,
          text: t('backofficeMenu.myShop'),
          permission: 'navigationMenu.products.shop',
        },
        {
          to: '/combo',
          icon: GroupWorkIcon,
          text: t('backofficeMenu.combo'),
          permission: 'navigationMenu.products.packs',
        },
        {
          to: '/giftcard/',
          icon: RedeemIcon,
          text: t('backofficeMenu.giftcard'),
          permission: 'navigationMenu.products.giftcards',
        },
        {
          to: '/coupon/',
          icon: getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
          text: t('backofficeMenu.coupon'),
          permission: 'navigationMenu.products.promotions',
        },
        { type: 'divider' },
        {
          to: '/subscription/contract',
          icon: Payment,
          text: t('backofficeMenu.contract'),
          permission: 'navigationMenu.products.contracts',
        },
      ],
    },
    {
      icon: getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
      text: t('backofficeMenu.payment'),
      type: 'nested',
      defaultTo: '/invoice',
      permission: 'navigationMenu.payments',
      nestedItems: [
        { type: 'divider' },
        {
          to: '/invoice',
          icon: ReceiptIcon,
          text: t('backofficeMenu.invoice'),
          permission: 'navigationMenu.payments.billings',
        },
        {
          to: '/subscription',
          icon: Payment,
          text: t('backofficeMenu.subscription'),
          permission: 'navigationMenu.payments.directDebits',
        },
        {
          to: '/coach/performance',
          icon: PersonIcon,
          text: t('backofficeMenu.coachPerformance'),
          permission: 'navigationMenu.payments.teachers',
        },
        {
          to: '/order/',
          icon: ShoppingCartIcon,
          text: t('backofficeMenu.order'),
          permission: 'navigationMenu.payments.orders',
        },
        {
          to: '/expense/',
          icon: DescriptionIcon,
          text: t('backofficeMenu.expenses'),
          permission: 'navigationMenu.payments.expenses',
        },
        {
          to: '/instalment-payment/',
          icon: DoubleArrow,
          text: t('backofficeMenu.instalmentPayment'),
          permission: 'navigationMenu.payments.installments',
        },
        ...(!hasUpsellIdentifier(UPSELL_IDENTIFIER_CLOCK_IN) ||
        !(
          checkRequiredPermissions(
            'navigationMenu.payments.clockIn.clockInForOther',
            permissions,
          ) ||
          checkRequiredPermissions(
            'navigationMenu.payments.clockIn.canAccessHistory',
            permissions,
          )
        )
          ? []
          : [
              {
                to: '/clock-in/',
                permission: 'navigationMenu.payments.clockIn',
                icon: TimerIcon,
                text: t('backofficeMenu.clockIn'),
              },
            ]),
      ],
    },
    {
      icon: Email,
      text: t('backofficeMenu.message'),
      type: 'nested',
      defaultTo: '/smart-list',
      permission: 'navigationMenu.marketing',
      nestedItems: [
        { type: 'divider' },
        {
          to: '/email-template',
          icon: Email,
          text: t('backofficeMenu.email_template'),
          permission: 'navigationMenu.marketing.templates',
        },
        {
          to: '/custom-form',
          icon: AssignmentIcon,
          text: t('backofficeMenu.custom_form'),
          permission: 'navigationMenu.marketing.customForms',
        },
        {
          to: '/smart-list',
          icon: People,
          text: t('backofficeMenu.smart_list'),
          permission: 'navigationMenu.marketing.smartlists',
        },
        {
          to: '/marketing/notifications',
          icon: NotificationsActiveIcon,
          text: t('backofficeMenu.marketingNotification'),
          permission: 'navigationMenu.marketing.notifications',
        },
        {
          to: '/marketing/tags',
          icon: LabelIcon,
          text: t('backofficeMenu.tags'),
          permission: 'navigationMenu.marketing.tags',
        },
        ...(Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
          ? []
          : [
              {
                to: '/marketing/strategies',
                icon: StorageIcon,
                subtext: t('backofficeMenu.alpha'),
                text: t('backofficeMenu.sequence'),
                permission: 'navigationMenu.marketing.strategies',
              },
            ]),
      ],
    },
    {
      icon: LaptopIcon,
      text: t('backofficeMenu.digital'),
      type: 'nested',
      permission: 'navigationMenu.digitalOffer',
      nestedItems: [
        { type: 'divider' },
        {
          icon: VideoLibraryIcon,
          text: t('backofficeMenu.video'),
          disabled: true,
          to: '/vod/video',
          subtext: t('backofficeMenu.alpha'),
          permission: 'navigationMenu.digitalOffer.videos',
        },
        {
          icon: PlaylistPlayIcon,
          text: t('backofficeMenu.playlist'),
          disabled: true,
          to: '/vod/playlist',
          subtext: t('backofficeMenu.alpha'),
          permission: 'navigationMenu.digitalOffer.playlists',
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
    { type: 'divider' },
    {
      icon: SettingsIcon,
      text: t('backofficeMenu.settings.settings'),
      type: 'nested',
      permission: 'navigationMenu.settings',
      nestedItems: [
        { type: 'divider' },
        {
          to: '/settings/general',
          dense: true,
          text: t('backofficeMenu.settings.general'),
          permission: 'navigationMenu.settings.generals',
        },
        {
          to: '/settings/marketplace-settings',
          dense: true,
          text: t('backofficeMenu.settings.marketplaceSettings'),
          permission: 'navigationMenu.settings.marketplace',
        },
        {
          to: '/settings/widget',
          dense: true,
          text: t('backofficeMenu.settings.widget'),
          permission: 'navigationMenu.settings.widgets',
        },
        {
          to: '/settings/role',
          dense: true,
          text: t('backofficeMenu.settings.role'),
          permission: 'navigationMenu.settings.staffs',
        },
        {
          to: '/settings/personalization',
          dense: true,
          text: t('backofficeMenu.settings.personalization'),
          permission: 'navigationMenu.settings.personalization',
        },
        ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_CUSTOM_APP) &&
        Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production'
          ? [
              {
                to: '/settings/mobile-personalization',
                dense: true,
                text: t('backofficeMenu.settings.mobilePersonalization'),
                permission: 'navigationMenu.settings.mobilePersonalization',
              },
            ]
          : []),
        {
          to: '/settings/forms',
          dense: true,
          text: t('backofficeMenu.settings.forms'),
          permission: 'navigationMenu.settings.memberForms',
        },
        {
          to: '/settings/broadcast',
          dense: true,
          text: t('backofficeMenu.settings.broadcast'),
          permission: 'navigationMenu.settings.liveStreaming',
        },
        {
          to: '/settings/notification-rule',
          dense: true,
          text: t('backofficeMenu.settings.notificationRule'),
          permission: 'navigationMenu.settings.transactionnalEmail',
        },
        {
          to: '/settings/payment-rules',
          dense: true,
          text: t('backofficeMenu.settings.paymentRules'),
          permission: 'navigationMenu.settings.teacherPayrollRules',
        },
        {
          to: '/settings/payment-methods',
          dense: true,
          text: t('backofficeMenu.settings.paymentMethod'),
          permission: 'navigationMenu.settings.paymentMethods',
        },
        {
          to: '/settings/company',
          dense: true,
          text: t('backofficeMenu.settings.company'),
          permission: 'navigationMenu.settings.company',
        },
        {
          to: '/settings/invoice',
          dense: true,
          text: t('backofficeMenu.settings.invoice'),
          permission: 'navigationMenu.settings.billing',
        },
        {
          to: '/settings/waiting-list',
          dense: true,
          text: t('backofficeMenu.settings.waitingList'),
          permission: 'navigationMenu.settings.waitingList',
        },
        {
          to: '/settings/shop',
          dense: true,
          text: t('backofficeMenu.settings.shop'),
          permission: 'navigationMenu.settings.webShop',
        },
        {
          to: '/settings/webhook',
          dense: true,
          text: t('backofficeMenu.settings.webhook'),
          permission: 'navigationMenu.settings.webHook',
        },
        {
          to: '/settings/partnership',
          dense: true,
          text: t('backofficeMenu.settings.partnership'),
          permission: 'navigationMenu.settings.partnership',
        },
        {
          to: '/settings/quickbooks',
          dense: true,
          text: t('backofficeMenu.settings.quickbooks'),
          permission: 'navigationMenu.settings.quickBooks',
        },
        {
          to: '/settings/active-campaign',
          dense: true,
          text: t('backofficeMenu.settings.active_campaign'),
          permission: 'navigationMenu.settings.activeCampaign',
        },
        {
          to: '/settings/platform-billing',
          dense: true,
          text: t('backofficeMenu.settings.platform_billing'),
          permission: 'navigationMenu.settings.subscription',
        },
      ],
    },
    {
      action: disconnect,
      to: null,
      icon: HighlightOff,
      text: t('backofficeMenu.logoff'),
    },
  ];

  const renderDrawerItem = (
    item: DrawerItem,
    i: number,
    isNested?: boolean,
  ) => {
    const isActive = location.pathname.startsWith(item.to);
    if (item?.permission) {
      if (!checkRequiredPermissions(item?.permission, permissions)) {
        return null;
      }
    }

    if (item?.nestedItems) {
      if (
        !item?.nestedItems.some(
          (_item) =>
            _item?.permission &&
            checkRequiredPermissions(_item?.permission, permissions),
        )
      ) {
        return null;
      }
    }

    if (item.type === 'nested') {
      return (
        <React.Fragment key={item.text}>
          <ListItem
            id="button_menu_item"
            button
            onClick={handleToggle(i)}
            selected={isActive}
          >
            {item?.icon && (
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
            )}
            <ListItemText
              id={item?.id}
              primary={item?.text}
              secondary={item?.subtext}
              secondaryTypographyProps={{
                style: { color: colors.primaryDark },
              }}
            />
            {toggledMenu[i] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse
            in={toggledMenu[i]}
            key={`${i}-collapse`}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding className={classes.nestedList}>
              {item?.nestedItems.map((subitem, subi) =>
                renderDrawerItem(subitem, subi, true),
              )}
            </List>
          </Collapse>
          {toggledMenu[i] ? (
            <Divider key={`${i}-second-nestedDivider`} />
          ) : null}
        </React.Fragment>
      );
    }
    if (item?.type === 'divider') {
      return <Divider key={i} className={item?.className} />;
    }

    let Wrapper = (p) => <React.Fragment>{p.children}</React.Fragment>;
    if (item?.to) {
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
      <Wrapper key={item.text}>
        <ListItem
          button
          onClick={() => {
            item.action && item.action();
            onMenuItemClick();
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

  return (
    <div className={classes.scrollable}>
      <div>
        <div className={classes.toolbar}>
          <Grid
            container
            style={{ paddingTop: 10 }}
            justify="center"
            alignItems="center"
          >
            <Hidden smDown>
              <img height={40} src={logo || LOGO_ASSET} alt="bsport logo" />
            </Hidden>
          </Grid>
        </div>
        <List>
          {items.map((item, i) => renderDrawerItem(item, i))}
          <ListItem />
          <ListItem />
          <ListItem />
        </List>
      </div>
      <VersionVisualizer />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
  logo: {
    alignItems: 'center',
    justify: 'center',
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
  menuMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default ResponsiveDrawer;
