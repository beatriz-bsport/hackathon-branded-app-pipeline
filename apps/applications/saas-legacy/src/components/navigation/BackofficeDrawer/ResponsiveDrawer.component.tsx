import React, { useState } from 'react';
import clsx from 'clsx';
import omit from 'lodash/omit';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Button from '@material-ui/core/Button';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import Cached from '@material-ui/icons/Cached';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DescriptionIcon from '@material-ui/icons/Description';
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import Email from '@material-ui/icons/Email';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import FitnessCenter from '@material-ui/icons/FitnessCenter';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import HighlightOff from '@material-ui/icons/HighlightOff';
import LabelIcon from '@material-ui/icons/Label';
import ChatIcon from '@material-ui/icons/Chat';
import LaptopIcon from '@material-ui/icons/Laptop';
import LocationOn from '@material-ui/icons/LocationOn';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import Payment from '@material-ui/icons/Payment';
import People from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RedeemIcon from '@material-ui/icons/Redeem';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Search from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Star from '@material-ui/icons/Star';
import TimerIcon from '@material-ui/icons/Timer';
import TodayIcon from '@material-ui/icons/Today';
import TrendingUp from '@material-ui/icons/TrendingUp';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import VpnKey from '@material-ui/icons/VpnKey';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SvgIcon from '@material-ui/core/SvgIcon';
import { MessageHeartSquare } from '#src/components/untitledui';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Immutable from 'seamless-immutable';

import { useSafeFlag, FeatureFlags } from '#src/utils/feature-flag';

import SwitchHorizontalIcon from '#src/components/icons/SwitchHorizontalIcon.component';
import TutorialIconWithAlertings from '#src/libs/platform-tutorial/components/TutorialIconWithAlertings.component';
import { hasAnyUpsell } from '#src/libs/platform-billing/utils';
import {
  checkRequiredPermissions,
  hasUpsellIdentifier,
} from '#src/libs/role/utils';

import {
  UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_CUSTOM_APP,
  UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
  UPSELL_IDENTIFIER_QUICKSALE,
  UPSELL_IDENTIFIER_QUICKBOOKS,
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';

import Config from '#src/config';
import { platformTutorialActivated } from '#src/libs/platform-tutorial/utils';
import { ObjectLevelPermissions, RolePermission } from '#src/libs/role/types';
import ToolTip from '#src/components/Tooltip.component';
import { hasObjectLevelPermission } from '#src/libs/role/permission-utils/utils';
import ResponsiveDrawerItem from './ResponsiveDrawerItem.component';

import { STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN } from '#src/actions/constants';
import { getItemInStorage } from '#src/utils/storage';
import VersionVisualizer from '../../VersionVisualizer.component';
import LOGO_ASSET from '../../../public/images/banner_lowres.png';
import { getCurrencyDisplay } from '../../../libs/theme/selectors';
import { CompanyTheme } from '#src/libs/theme/types';
import { INSIGHTS_ROUTES } from '#src/pages/insights/constants';
import type { UpsellSumup } from '#src/libs/company/types';

export const drawerWidth = 260;
const usePrevious = (value: boolean) => {
  const previousIconOnlyState = React.useRef<boolean>();

  React.useEffect(() => {
    previousIconOnlyState.current = value;
  });

  return previousIconOnlyState.current;
};
type Props = {
  logo?: string;
  location: Location;
  companyId: number;
  companyTheme: CompanyTheme;
  featureList: UpsellSumup[];
  permissions: RolePermission;
  objectLevelPermissions: ObjectLevelPermissions;
  disconnect: () => void;
  onMenuItemClick: () => void;
  nbTutorialAlerting: number;

  userAcknowlegdePlatformTutorial?: boolean;
  tutorialDialogOpen?: boolean;
  updateUserAcknowlegdeTutorial?: () => void;
  iconsOnly?: boolean;
  setDrawerIconsOnly?: (isIconOnly: boolean) => void;
  handleUserSetDrawerIconsOnly?: (isIconOnly: boolean) => void;
  enableRevampedBackoffice: () => void;
};

export type DrawerItemDefault = {
  icon?: React.ElementType;
  action?: () => void;
  text: string;
  subtext?: string | null;
  className?: string;
  to: string | null;
  disabled?: boolean;
  dense?: boolean;
  id?: string;
  actionOnMenuToggle?: undefined;
  shrinkMenuOnIconOnly?: boolean;
  hasInnerTabs?: boolean;
  excludeUrlPatterns?: string[];
  openInNewTab?: boolean;
  badge?: string | number | null;
};

export type DrawerItemDivider = {
  type: 'divider';
  className?: string;
  actionOnMenuToggle?: undefined;
  shrinkMenuOnIconOnly?: boolean;
};

export type DrawerItemNested = {
  icon: React.ElementType;
  text: string;
  type: 'nested';
  subtext?: string | null;
  className?: string;
  defaultTo?: string;
  nestedItems: DrawerItemDefault[];
  actionOnMenuToggle?: () => void;
  shrinkMenuOnIconOnly?: boolean;
};

export type DrawerItem =
  | DrawerItemDefault
  | DrawerItemDivider
  | DrawerItemNested;

const ResponsiveDrawer: React.FC<Props> = ({
  logo,
  location,
  featureList,
  companyId,
  companyTheme,
  permissions,
  objectLevelPermissions,
  disconnect,
  onMenuItemClick,
  nbTutorialAlerting,
  userAcknowlegdePlatformTutorial,
  tutorialDialogOpen,
  updateUserAcknowlegdeTutorial,
  iconsOnly,
  setDrawerIconsOnly,
  handleUserSetDrawerIconsOnly,
  enableRevampedBackoffice,
}) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles({ iconsOnly: !!iconsOnly });

  const [toggledMenu, setToggledMenu] = useState<Record<number, boolean>>({});

  const handleToggle = React.useCallback(
    (i: number, item: DrawerItem) => () => {
      const newToggledMenu = {
        [i]: !toggledMenu?.[i] || false,
      };

      setToggledMenu(newToggledMenu);
      item && item.actionOnMenuToggle && item.actionOnMenuToggle();
    },
    [toggledMenu],
  );
  const handleToggleDrawer = () => {
    handleUserSetDrawerIconsOnly && handleUserSetDrawerIconsOnly(!iconsOnly);
  };
  const closeTab = () => {
    window.close();
  };
  const prevIconOnly = usePrevious(!!iconsOnly);

  const accessMonitoringItem = React.useMemo(() => {
    if (
      !hasAnyUpsell({ upsell: featureList }, [
        UPSELL_IDENTIFIER_ACCESS_MONITORING,
        UPSELL_IDENTIFIER_KISI_INTEGRATION,
      ])
    ) {
      return [];
    }
    let to_path;
    let openInNewTab = false;
    if (permissions?.navigationMenu?.accessMonitoring?.perform) {
      to_path = '/access-monitoring/perform';
      openInNewTab = true;
    } else if (permissions?.navigationMenu?.accessMonitoring?.monitor) {
      to_path = '/access-monitoring/monitor';
    } else if (permissions?.navigationMenu?.accessMonitoring?.settings) {
      to_path = '/access-monitoring/settings';
    } else {
      return Immutable([]);
    }
    return Immutable([
      {
        to: to_path,
        icon: MeetingRoomIcon,
        text: t('backofficeMenu.accessMonitoring'),
        hasInnerTabs: true,
        openInNewTab,
      } as DrawerItemDefault,
    ]);
  }, [t, permissions, featureList]);

  const isTabImpersonated: boolean = React.useMemo(() => {
    return (
      getItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN) !==
      null
    );
  }, []);

  const oldWebshopItem = Immutable([
    {
      to: '/shop',
      icon: ShoppingCartIcon,
      text: t('backofficeMenu.myShop'),
    } as DrawerItemDefault,
  ]);

  const newWebshopItem = React.useMemo(() => {
    let drawerRoute = '';
    // Permissions are checked here and not in the drawer item because the new webshop is
    // composed of two routes that need to be checked for permissions
    if (permissions.navigationMenu?.products?.shopReworked?.products) {
      drawerRoute = '/shop/products';
    } else if (permissions.navigationMenu?.products?.shopReworked?.settings) {
      drawerRoute = '/shop/settings';
    } else {
      return Immutable([]);
    }

    return Immutable([
      {
        to: drawerRoute,
        icon: ShoppingCartIcon,
        text: t('backofficeMenu.myShop'),
      } as DrawerItemDefault,
    ]);
  }, [
    permissions.navigationMenu?.products?.shopReworked?.products,
    permissions.navigationMenu?.products?.shopReworked?.settings,
    t,
  ]);

  const revampedBOEnabledForCompany = companyTheme.revamped_backoffice_enabled;

  const showInsightsPage = useSafeFlag(FeatureFlags.INSIGHTS_PAGE);

  const items: DrawerItem[] = React.useMemo(() => {
    return [
      {
        to: '/search/results',
        text: t('backofficeMenu.search'),
        icon: Search,
        className: classes.menuMobile,
      } as DrawerItemDefault,
      { type: 'divider', className: classes.menuMobile } as DrawerItemDivider,
      {
        to: '/dashboard',
        text: t('backofficeMenu.dashboard'),
        icon: TrendingUp,
      } as DrawerItemDefault,
      { type: 'divider' } as DrawerItemDivider,
      {
        to: '/calendar',
        icon: DateRangeIcon,
        text: t('backofficeMenu.calendar'),
      } as DrawerItemDefault,
      {
        to: '/schedule',
        icon: ScheduleIcon,
        text: t('backofficeMenu.schedule'),
      } as DrawerItemDefault,
      ...accessMonitoringItem,
      {
        icon: BusinessCenterIcon,
        text: t('backofficeMenu.myClub'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          {
            to: '/activity',
            icon: Star,
            text: t('backofficeMenu.activity'),
          } as DrawerItemDefault,
          {
            to: '/workshop-activity/tabs/list',
            icon: TodayIcon,
            text: t('backofficeMenu.workshopActivities'),
          } as DrawerItemDefault,
          {
            to: '/private-service/service/',
            icon: ScheduleIcon,
            text: t('backofficeMenu.privateService.services'),
          } as DrawerItemDefault,
          {
            to: '/coach',
            id: 'button_menu_teachers',
            icon: FitnessCenter,
            text: t('backofficeMenu.coaches'),
          } as DrawerItemDefault,
          {
            to: '/establishment/room',
            icon: LocationOn,
            text: t('backofficeMenu.establishment'),
          } as DrawerItemDefault,
          ...(![634, 631, 632, 633, 630].includes(companyId) &&
          !hasUpsellIdentifier(
            UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
            featureList,
          )
            ? []
            : [
                {
                  to: '/performance-tracking',
                  icon: OfflineBoltIcon,
                  text: t('backofficeMenu.programs'),
                } as DrawerItemDefault,
              ]),
          ...(hasUpsellIdentifier(
            UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
            featureList,
            true,
          ) &&
          hasObjectLevelPermission(
            objectLevelPermissions,
            'management.coach.allowed_actions.substitution',
          )
            ? [
                {
                  to: '/replacement/management',
                  icon: Cached,
                  text: t('backofficeMenu.replacement'),
                } as DrawerItemDefault,
              ]
            : []),
        ],
      } as DrawerItemNested,
      {
        icon: ShoppingCartIcon,
        text: t('backofficeMenu.product'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          {
            to: '/payment-pack',
            icon: VpnKey,
            text: t('backofficeMenu.pass'),
          } as DrawerItemDefault,
          {
            to: '/private-service/pass/',
            icon: ScheduleIcon,
            text: t('backofficeMenu.privateService.pass'),
          } as DrawerItemDefault,
          ...(companyTheme?.display_new_webshop
            ? newWebshopItem
            : oldWebshopItem),
          {
            to: '/combo',
            icon: GroupWorkIcon,
            text: t('backofficeMenu.combo'),
          } as DrawerItemDefault,
          {
            to: '/giftcard/',
            icon: RedeemIcon,
            text: t('backofficeMenu.giftcard'),
          } as DrawerItemDefault,
          {
            to: '/coupon/',
            icon:
              getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
            text: t('backofficeMenu.coupon'),
          } as DrawerItemDefault,
          {
            to: '/subscription/contract',
            icon: Payment,
            text: t('backofficeMenu.contract'),
          } as DrawerItemDefault,
        ],
      } as DrawerItemNested,
      {
        icon: getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
        text: t('backofficeMenu.payment'),
        type: 'nested',
        defaultTo: '/invoice',
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          ...(hasObjectLevelPermission(
            objectLevelPermissions,
            'billing.allowed_actions.readInvoices',
          )
            ? [
                {
                  to: '/invoice',
                  icon: ReceiptIcon,
                  text: t('backofficeMenu.invoice'),
                } as DrawerItemDefault,
              ]
            : []),
          {
            to: '/subscription',
            excludeUrlPatterns: ['/subscription/contract'],
            icon: Payment,
            text: t('backofficeMenu.subscription'),
          } as DrawerItemDefault,
          ...(hasObjectLevelPermission(
            objectLevelPermissions,
            'management.coach.allowed_actions.readPayroll',
          )
            ? [
                {
                  to: '/coach/performance',
                  icon: PersonIcon,
                  text: t('backofficeMenu.coachPerformance'),
                } as DrawerItemDefault,
              ]
            : []),
          {
            to: '/order/',
            icon: ShoppingCartIcon,
            text: t('backofficeMenu.order'),
          } as DrawerItemDefault,
          {
            to: '/expense/',
            icon: DescriptionIcon,
            text: t('backofficeMenu.expenses'),
          } as DrawerItemDefault,
          {
            to: '/instalment-payment/',
            icon: DoubleArrow,
            text: t('backofficeMenu.instalmentPayment'),
          } as DrawerItemDefault,
          ...(!hasUpsellIdentifier(UPSELL_IDENTIFIER_CLOCK_IN, featureList) ||
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
                  icon: TimerIcon,
                  text: t('backofficeMenu.clockIn'),
                } as DrawerItemDefault,
              ]),
        ],
      } as DrawerItemNested,
      {
        icon: Email,
        text: t('backofficeMenu.message'),
        type: 'nested',
        defaultTo: '/smart-list',
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          {
            to: '/email-template',
            icon: Email,
            text: t('backofficeMenu.email_template'),
          } as DrawerItemDefault,
          {
            to: '/custom-form',
            icon: AssignmentIcon,
            text: t('backofficeMenu.custom_form'),
          } as DrawerItemDefault,
          {
            to: '/smart-list',
            icon: People,
            text: t('backofficeMenu.smart_list'),
          } as DrawerItemDefault,
          {
            to: '/marketing/notifications',
            icon: NotificationsActiveIcon,
            text: t('backofficeMenu.marketingNotification'),
          } as DrawerItemDefault,
          {
            to: '/marketing/tags',
            icon: LabelIcon,
            text: t('backofficeMenu.tags'),
          } as DrawerItemDefault,
          {
            to: '/audience',
            icon: SwitchHorizontalIcon,
            text: t('backofficeMenu.audience'),
          } as DrawerItemDefault,
        ],
      } as DrawerItemNested,
      {
        icon: LaptopIcon,
        text: t('backofficeMenu.digital'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          {
            icon: VideoLibraryIcon,
            text: t('backofficeMenu.video'),
            disabled: true,
            to: '/vod/video',
          } as DrawerItemDefault,
          {
            icon: PlaylistPlayIcon,
            text: t('backofficeMenu.playlist'),
            disabled: true,
            to: '/vod/playlist',
          } as DrawerItemDefault,
        ],
      } as DrawerItemNested,
      {
        to: '/inbox/thread',
        icon: ChatIcon,
        text: 'Inbox',
      } as DrawerItemDefault,
      {
        to: '/member',
        icon: People,
        text: t('backofficeMenu.member'),
      } as DrawerItemDefault,
      {
        to: '/reporting/categories',
        icon: DescriptionIcon,
        text: t('backofficeMenu.reporting'),
      } as DrawerItemDefault,
      ...(showInsightsPage
        ? [
            {
              to: INSIGHTS_ROUTES.INDEX,
              icon: TrendingUp,
              text: t('backofficeMenu.insights.insights'),
              badge: 'New',
            } as DrawerItemDefault,
          ]
        : []),
      { type: 'divider' } as DrawerItemDivider,
      {
        icon: SettingsIcon,
        text: t('backofficeMenu.settings.settings'),
        type: 'nested',
        shrinkMenuOnIconOnly: true,
        actionOnMenuToggle: () => {
          iconsOnly && setDrawerIconsOnly && setDrawerIconsOnly(false);
        },
        nestedItems: [
          { type: 'divider' } as DrawerItemDivider,
          {
            to: '/settings/general',
            dense: true,
            text: t('backofficeMenu.settings.general'),
          } as DrawerItemDefault,
          {
            to: '/settings/marketplace-settings',
            dense: true,
            text: t('backofficeMenu.settings.marketplaceSettings'),
          } as DrawerItemDefault,
          {
            to: '/settings/widget/create',
            dense: true,
            text: t('backofficeMenu.settings.widget'),
            hasInnerTabs: true,
          } as DrawerItemDefault,
          {
            to: '/settings/role',
            dense: true,
            text: t('backofficeMenu.settings.role'),
          } as DrawerItemDefault,
          {
            to: '/settings/personalization',
            dense: true,
            text: t('backofficeMenu.settings.personalization'),
          } as DrawerItemDefault,
          ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_CUSTOM_APP, featureList)
            ? [
                {
                  to: '/settings/mobile-personalisation/links',
                  dense: true,
                  text: t('backofficeMenu.settings.mobilePersonalization'),
                  hasInnerTabs: true,
                } as DrawerItemDefault,
              ]
            : []),
          {
            to: '/settings/coach-userspace',
            dense: true,
            text: t('backofficeMenu.settings.coachUserspace'),
          } as DrawerItemDefault,
          {
            to: '/settings/forms',
            dense: true,
            text: t('backofficeMenu.settings.forms'),
          } as DrawerItemDefault,
          {
            to: '/settings/broadcast',
            dense: true,
            text: t('backofficeMenu.settings.broadcast'),
          } as DrawerItemDefault,
          {
            to: '/settings/notification-rule',
            dense: true,
            text: t('backofficeMenu.settings.notificationRule'),
          } as DrawerItemDefault,
          {
            to: '/settings/payment-rules',
            dense: true,
            text: t('backofficeMenu.settings.paymentRules'),
          } as DrawerItemDefault,
          {
            to: '/settings/payment-methods',
            dense: true,
            text: t('backofficeMenu.settings.paymentMethod'),
          } as DrawerItemDefault,
          {
            to: '/settings/company',
            dense: true,
            text: t('backofficeMenu.settings.company'),
          } as DrawerItemDefault,
          {
            to: '/settings/invoice',
            dense: true,
            text: t('backofficeMenu.settings.invoice'),
          } as DrawerItemDefault,
          {
            to: '/settings/waiting-list',
            dense: true,
            text: t('backofficeMenu.settings.waitingList'),
          } as DrawerItemDefault,
          ...(companyTheme?.display_new_webshop
            ? []
            : [
                {
                  to: '/settings/shop',
                  dense: true,
                  text: t('backofficeMenu.settings.shop'),
                } as DrawerItemDefault,
              ]),
          {
            to: '/settings/webhook',
            dense: true,
            text: t('backofficeMenu.settings.webhook'),
          } as DrawerItemDefault,
          {
            to: '/settings/partnership',
            dense: true,
            text: t('backofficeMenu.settings.partnership'),
          } as DrawerItemDefault,
          ...(hasUpsellIdentifier(
            UPSELL_IDENTIFIER_QUICKBOOKS,
            featureList,
            true,
          )
            ? [
                {
                  to: '/settings/quickbooks',
                  dense: true,
                  text: t('backofficeMenu.settings.quickbooks'),
                } as DrawerItemDefault,
              ]
            : []),
          {
            to: '/settings/active-campaign',
            dense: true,
            text: t('backofficeMenu.settings.active_campaign'),
          } as DrawerItemDefault,
          {
            to: '/settings/referral',
            dense: true,
            text: t('backofficeMenu.settings.referral'),
          } as DrawerItemDefault,
          {
            to: '/settings/platform-billing',
            dense: true,
            text: t('backofficeMenu.settings.platform_billing'),
          } as DrawerItemDefault,
          ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_QUICKSALE, featureList)
            ? [
                {
                  to: '/settings/quicksale',
                  dense: true,
                  text: t('backofficeMenu.settings.quicksale'),
                } as DrawerItemDefault,
              ]
            : []),
        ],
      } as DrawerItemNested,
      ...(checkRequiredPermissions('navigationMenu.tutorial', permissions) &&
      platformTutorialActivated()
        ? [
            {
              to: '/tutorial',
              icon: TutorialIconWithAlertings,
              text: t('backofficeMenu.tutorial'),
            } as DrawerItemDefault,
          ]
        : []),
      ...(Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
        ? [
            {
              to: '/feature-base',
              icon: () => <MessageHeartSquare stroke="currentColor" />,
              text: t('backofficeMenu.feedbackBoard'),
            } as DrawerItemDefault,
          ]
        : []),
      isTabImpersonated
        ? ({
            action: closeTab,
            to: null,
            icon: HighlightOff,
            text: t('backofficeMenu.closeTab'),
          } as DrawerItemDefault)
        : ({
            action: disconnect,
            to: null,
            icon: PowerSettingsNewIcon,
            text: t('backofficeMenu.logoff'),
          } as DrawerItemDefault),
    ];
  }, [
    t,
    classes.menuMobile,
    accessMonitoringItem,
    companyId,
    featureList,
    objectLevelPermissions,
    companyTheme?.display_new_webshop,
    newWebshopItem,
    oldWebshopItem,
    permissions,
    isTabImpersonated,
    disconnect,
    iconsOnly,
    setDrawerIconsOnly,
    showInsightsPage,
  ]);

  React.useEffect(() => {
    if (prevIconOnly !== iconsOnly && iconsOnly) {
      const newToggledMenu = items
        .map((item, i) => [item, i])
        .reduce((acc: Record<number, boolean>, info: [DrawerItem, number]) => {
          if (info[0].shrinkMenuOnIconOnly) {
            return { ...omit(acc, info[1]) };
          }
          return acc;
        }, toggledMenu);
      setToggledMenu(newToggledMenu);
    }
  }, [prevIconOnly, iconsOnly, toggledMenu, items]);

  const newUIIcon = React.useMemo(
    () => (
      <SvgIcon style={{ marginRight: iconsOnly ? 0 : 8 }}>
        <svg
          fill="none"
          height="100%"
          viewBox="0 0 24 24"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5 8V3M5.5 21V16M16 5.5H21M3 18.5H8M6.5 2L5.71554 3.56892C5.45005 4.09989 5.31731 4.36538 5.13997 4.59545C4.98261 4.79959 4.79959 4.98261 4.59545 5.13997C4.36538 5.31731 4.0999 5.45005 3.56892 5.71554L2 6.5L3.56892 7.28446C4.0999 7.54995 4.36538 7.68269 4.59545 7.86003C4.79959 8.01739 4.98261 8.20041 5.13997 8.40455C5.31731 8.63462 5.45005 8.9001 5.71554 9.43108L6.5 11L7.28446 9.43108C7.54995 8.9001 7.68269 8.63462 7.86003 8.40455C8.01739 8.20041 8.20041 8.01739 8.40455 7.86003C8.63462 7.68269 8.9001 7.54995 9.43108 7.28446L11 6.5L9.43108 5.71554C8.9001 5.45005 8.63462 5.31731 8.40455 5.13997C8.20041 4.98261 8.01739 4.79959 7.86003 4.59545C7.68269 4.36538 7.54995 4.0999 7.28446 3.56892L6.5 2ZM17 12L16.0489 13.9022C15.7834 14.4332 15.6506 14.6987 15.4733 14.9288C15.3159 15.1329 15.1329 15.3159 14.9288 15.4733C14.6987 15.6506 14.4332 15.7834 13.9023 16.0489L12 17L13.9023 17.9511C14.4332 18.2166 14.6987 18.3494 14.9288 18.5267C15.1329 18.6841 15.3159 18.8671 15.4733 19.0712C15.6506 19.3013 15.7834 19.5668 16.0489 20.0977L17 22L17.9511 20.0978C18.2166 19.5668 18.3494 19.3013 18.5267 19.0712C18.6841 18.8671 18.8671 18.6841 19.0712 18.5267C19.3013 18.3494 19.5668 18.2166 20.0977 17.9511L22 17L20.0977 16.0489C19.5668 15.7834 19.3013 15.6506 19.0712 15.4733C18.8671 15.3159 18.6841 15.1329 18.5267 14.9288C18.3494 14.6987 18.2166 14.4332 17.9511 13.9023L17 12Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </SvgIcon>
    ),
    [iconsOnly],
  );

  return (
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
              <img
                alt="bsport logo"
                className="company-logo-drawer"
                height={40}
                src={logo || LOGO_ASSET}
              />
            </Hidden>
          </Grid>
        </div>
        {handleUserSetDrawerIconsOnly && handleToggle ? (
          <>
            <div className={classes.selfCentered}>
              <IconButton
                disableRipple
                className={classes.iconButton}
                onClick={handleToggleDrawer}
              >
                <ToolTip
                  placement="right-start"
                  title={
                    iconsOnly
                      ? t('backofficeMenu.toggle.expand')
                      : t('backofficeMenu.toggle.shrink')
                  }
                >
                  <DoubleArrow
                    className={clsx(classes.easeRotation, {
                      [classes.rotate]: !iconsOnly,
                    })}
                  />
                </ToolTip>
              </IconButton>
            </div>
            <Divider />
          </>
        ) : null}
        <List className={classes.mainList}>
          {items.map((item, i) => (
            <ResponsiveDrawerItem
              key={`responsive_drawer_item${i}`}
              handleToggle={handleToggle}
              i={i}
              iconsOnly={iconsOnly}
              item={item}
              location={location}
              nbTutorialAlerting={nbTutorialAlerting}
              onMenuItemClick={onMenuItemClick}
              permissions={permissions}
              toggledMenu={toggledMenu}
              tutorialDialogOpen={tutorialDialogOpen}
              updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
              userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
            />
          ))}
          <ListItem />
          <ListItem />
          <ListItem />
        </List>
      </div>
      <div className={classes.bottomContainer}>
        {revampedBOEnabledForCompany && (
          <Button
            className={classes.newUiButton}
            color="primary"
            onClick={enableRevampedBackoffice}
            size={iconsOnly ? 'small' : 'medium'}
            variant="contained"
          >
            {newUIIcon}
            {!iconsOnly && t('backofficeMenu.enableRevampedBackoffice')}
          </Button>
        )}
        <VersionVisualizer />
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme, { iconsOnly: boolean }>((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  scrollable: {
    overflow: 'auto',
    paddingRight: 50,
    marginRight: -50,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    justifyContent: 'space-between',
    maxHeight: '100vh',
    // Safari, Chrom, Opera : hide scrollbar
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    // Ie and Edge : hide scrollbar
    '-ms-overflow-style': 'none',
    // Firefox : hide scrollbar
    scrollbarWidth: 'none',
  },
  logo: {
    alignItems: 'center',
    justify: 'center',
    alignSelf: 'center',
  },
  menuMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  newUiButton: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  selfCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  easeRotation: {
    transition: 'transform .2s ease-in-out',
  },
  rotate: {
    transform: 'rotate(-180deg)',
  },
  mainList: {
    paddingTop: 0,
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  },
}));

export default ResponsiveDrawer;
