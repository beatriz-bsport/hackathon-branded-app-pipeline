import React, { useState } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
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

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TutorialIconWithAlertings from '#libs/platform-tutorial/components/TutorialIconWithAlertings.component';
import Config from '../../../config';

import { getCurrencyDisplay } from '../../../libs/theme/selectors';

import LOGO_ASSET from '../../../public/images/banner_lowres.png';
import { checkRequiredPermissions } from '#libs/role/utils';
import VersionVisualizer from '../../VersionVisualizer.component';

import {
  UPSELL_PERFORMANCE_TRACKING_IDENTIFIER,
  UPSELL_IDENTIFIER_CLOCK_IN,
  UPSELL_IDENTIFIER_CUSTOM_APP,
  UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
  UPSELL_IDENTIFIER_QUICKSALE,
  UPSELL_IDENTIFIER_CADENCE,
} from '#libs/platform-billing/upsell-identifiers';

import { platformTutorialActivated } from '#libs/platform-tutorial/utils';
import { ObjectLevelPermissions, RolePermission } from '#libs/role/types';
import ToolTip from '#components/Tooltip.component';
import ResponsiveDrawerItem from './ResponsiveDrawerItem.component';

import { hasObjectLevelPermission } from '#libs/role/permission-utils/utils';
import { SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS } from '#libs/sequential_marketingDEPRECATED/constants';

// Temporary condition to hide the referral page while the feature is not finished
// Condition will be removed once the feature is finished
const shouldHideReferral =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production';

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
  featureList: {
    upsell_identifier: number;
    readable_identifier: string;
  }[];
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
};

export type DrawerItem =
  | {
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
    }
  | {
      type: 'divider';
      className?: string;
      actionOnMenuToggle?: undefined;
      shrinkMenuOnIconOnly?: boolean;
    }
  | {
      icon: React.ElementType;
      text: string;
      type: 'nested';
      subtext?: string | null;
      className?: string;
      defaultTo?: string;
      nestedItems: DrawerItem[];
      actionOnMenuToggle?: () => void;
      shrinkMenuOnIconOnly?: boolean;
    };

const ResponsiveDrawer: React.FC<Props> = ({
  logo,
  location,
  featureList,
  companyId,
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
}) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles({ iconsOnly });

  const [toggledMenu, setToggledMenu] = useState<Record<number, boolean>>({});

  const handleToggle = React.useCallback(
    (i: number, item: DrawerItem) => () => {
      const newToggledMenu = {
        [i]: !toggledMenu?.[i] ?? false,
      };

      setToggledMenu(newToggledMenu);
      item && item.actionOnMenuToggle && item.actionOnMenuToggle();
    },
    [toggledMenu],
  );
  const handleToggleDrawer = () => {
    handleUserSetDrawerIconsOnly && handleUserSetDrawerIconsOnly(!iconsOnly);
  };
  const prevIconOnly = usePrevious(iconsOnly);
  const hasUpsellIdentifier = React.useCallback(
    (identifier: number, forceOnAllEnvs: boolean = false) => {
      if (forceOnAllEnvs)
        return featureList
          .map((ups) => ups.upsell_identifier)
          .includes(identifier);
      return (
        Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
        featureList.map((ups) => ups.upsell_identifier).includes(identifier)
      );
    },
    [featureList],
  );

  const items: DrawerItem[] = React.useMemo(() => {
    return [
      {
        to: '/search/results',
        text: t('backofficeMenu.search'),
        icon: Search,
        className: classes.menuMobile,
      },
      { type: 'divider', className: classes.menuMobile },
      {
        to: '/dashboard',
        text: t('backofficeMenu.dashboard'),
        icon: TrendingUp,
      },
      { type: 'divider' },
      {
        to: '/calendar',
        icon: DateRangeIcon,
        text: t('backofficeMenu.calendar'),
      },
      {
        to: '/schedule',
        icon: ScheduleIcon,
        text: t('backofficeMenu.schedule'),
      },
      {
        icon: BusinessCenterIcon,
        text: t('backofficeMenu.myClub'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' },
          {
            to: '/activity',
            icon: Star,
            text: t('backofficeMenu.activity'),
          },
          {
            to: '/workshop-activity/tabs/list',
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
          ...(![634, 631, 632, 633, 630].includes(companyId) &&
          !hasUpsellIdentifier(UPSELL_PERFORMANCE_TRACKING_IDENTIFIER)
            ? []
            : [
                {
                  to: '/performance-tracking',
                  icon: OfflineBoltIcon,
                  text: t('backofficeMenu.programs'),
                },
              ]),
          ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_SUBTEACHER_TOOL, true) &&
          hasObjectLevelPermission(
            objectLevelPermissions,
            'management.coach.allowed_actions.substitution',
          )
            ? [
                {
                  to: '/replacement/management',
                  icon: Cached,
                  text: t('backofficeMenu.replacement'),
                },
              ]
            : []),
        ],
      },
      {
        icon: ShoppingCartIcon,
        text: t('backofficeMenu.product'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' },
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
            icon:
              getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
            text: t('backofficeMenu.coupon'),
          },
          { type: 'divider' },
          {
            to: '/subscription/contract',
            icon: Payment,
            text: t('backofficeMenu.contract'),
          },
        ],
      },
      {
        icon: getCurrencyDisplay() === '€' ? EuroSymbolIcon : AttachMoneyIcon,
        text: t('backofficeMenu.payment'),
        type: 'nested',
        defaultTo: '/invoice',
        nestedItems: [
          { type: 'divider' },
          ...(hasObjectLevelPermission(
            objectLevelPermissions,
            'billing.allowed_actions.readInvoices',
          )
            ? [
                {
                  to: '/invoice',
                  icon: ReceiptIcon,
                  text: t('backofficeMenu.invoice'),
                },
              ]
            : []),
          {
            to: '/subscription',
            icon: Payment,
            text: t('backofficeMenu.subscription'),
          },
          ...(hasObjectLevelPermission(
            objectLevelPermissions,
            'management.coach.allowed_actions.readPayroll',
          )
            ? [
                {
                  to: '/coach/performance',
                  icon: PersonIcon,
                  text: t('backofficeMenu.coachPerformance'),
                },
              ]
            : []),
          {
            to: '/order/',
            icon: ShoppingCartIcon,
            text: t('backofficeMenu.order'),
          },
          {
            to: '/expense/',
            icon: DescriptionIcon,
            text: t('backofficeMenu.expenses'),
          },
          {
            to: '/instalment-payment/',
            icon: DoubleArrow,
            text: t('backofficeMenu.instalmentPayment'),
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
        nestedItems: [
          { type: 'divider' },
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
          ...(SEQUENTIAL_MARKETING_AUTHORIZED_COMPANY_IDS.includes(companyId) ||
          hasUpsellIdentifier(UPSELL_IDENTIFIER_CADENCE)
            ? [
                {
                  to: '/cadence',
                  icon: AccountTreeIcon,
                  text: t('backofficeMenu.cadences'),
                },
              ]
            : []),
        ],
      },
      {
        icon: LaptopIcon,
        text: t('backofficeMenu.digital'),
        type: 'nested',
        nestedItems: [
          { type: 'divider' },
          {
            icon: VideoLibraryIcon,
            text: t('backofficeMenu.video'),
            disabled: true,
            to: '/vod/video',
          },
          {
            icon: PlaylistPlayIcon,
            text: t('backofficeMenu.playlist'),
            disabled: true,
            to: '/vod/playlist',
          },
        ],
      },
      {
        to: '/inbox/thread',
        icon: ChatIcon,
        text: 'Inbox',
      },
      {
        to: '/member',
        icon: People,
        text: t('backofficeMenu.member'),
      },
      {
        to: '/reporting',
        icon: DescriptionIcon,
        text: t('backofficeMenu.reporting'),
      },
      { type: 'divider' },
      {
        icon: SettingsIcon,
        text: t('backofficeMenu.settings.settings'),
        type: 'nested',
        shrinkMenuOnIconOnly: true,
        actionOnMenuToggle: () => {
          iconsOnly && setDrawerIconsOnly && setDrawerIconsOnly(false);
        },
        nestedItems: [
          { type: 'divider' },
          {
            to: '/settings/general',
            dense: true,
            text: t('backofficeMenu.settings.general'),
          },
          {
            to: '/settings/marketplace-settings',
            dense: true,
            text: t('backofficeMenu.settings.marketplaceSettings'),
          },
          {
            to: '/settings/widget/create',
            dense: true,
            text: t('backofficeMenu.settings.widget'),
          },
          {
            to: '/settings/role',
            dense: true,
            text: t('backofficeMenu.settings.role'),
          },
          {
            to: '/settings/personalization',
            dense: true,
            text: t('backofficeMenu.settings.personalization'),
          },
          ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_CUSTOM_APP)
            ? [
                {
                  to: '/settings/mobile-personalisation/links',
                  dense: true,
                  text: t('backofficeMenu.settings.mobilePersonalization'),
                },
              ]
            : []),
          {
            to: '/settings/coach-userspace',
            dense: true,
            text: t('backofficeMenu.settings.coachUserspace'),
          },
          {
            to: '/settings/forms',
            dense: true,
            text: t('backofficeMenu.settings.forms'),
          },
          {
            to: '/settings/broadcast',
            dense: true,
            text: t('backofficeMenu.settings.broadcast'),
          },
          {
            to: '/settings/notification-rule',
            dense: true,
            text: t('backofficeMenu.settings.notificationRule'),
          },
          {
            to: '/settings/payment-rules',
            dense: true,
            text: t('backofficeMenu.settings.paymentRules'),
          },
          {
            to: '/settings/payment-methods',
            dense: true,
            text: t('backofficeMenu.settings.paymentMethod'),
          },
          {
            to: '/settings/company',
            dense: true,
            text: t('backofficeMenu.settings.company'),
          },
          {
            to: '/settings/invoice',
            dense: true,
            text: t('backofficeMenu.settings.invoice'),
          },
          {
            to: '/settings/waiting-list',
            dense: true,
            text: t('backofficeMenu.settings.waitingList'),
          },
          {
            to: '/settings/shop',
            dense: true,
            text: t('backofficeMenu.settings.shop'),
          },
          {
            to: '/settings/webhook',
            dense: true,
            text: t('backofficeMenu.settings.webhook'),
          },
          {
            to: '/settings/partnership',
            dense: true,
            text: t('backofficeMenu.settings.partnership'),
          },
          {
            to: '/settings/quickbooks',
            dense: true,
            text: t('backofficeMenu.settings.quickbooks'),
          },
          {
            to: '/settings/active-campaign',
            dense: true,
            text: t('backofficeMenu.settings.active_campaign'),
          },
          // Temporary condition to hide the referral page while the feature is not finished
          // Condition will be removed once the feature is finished
          ...(shouldHideReferral
            ? []
            : [
                {
                  to: '/settings/referral',
                  dense: true,
                  text: t('backofficeMenu.settings.referral'),
                },
              ]),
          {
            to: '/settings/platform-billing',
            dense: true,
            text: t('backofficeMenu.settings.platform_billing'),
          },
          ...(hasUpsellIdentifier(UPSELL_IDENTIFIER_QUICKSALE)
            ? [
                {
                  to: '/settings/quicksale',
                  dense: true,
                  text: t('backofficeMenu.settings.quicksale'),
                },
              ]
            : []),
        ],
      },
      ...(checkRequiredPermissions('navigationMenu.tutorial', permissions) &&
      platformTutorialActivated()
        ? [
            {
              to: '/tutorial',
              icon: TutorialIconWithAlertings,
              text: t('backofficeMenu.tutorial'),
            },
          ]
        : []),
      {
        action: disconnect,
        to: null,
        icon: HighlightOff,
        text: t('backofficeMenu.logoff'),
      },
    ];
  }, [
    classes,
    companyId,
    disconnect,
    hasUpsellIdentifier,
    iconsOnly,
    permissions,
    setDrawerIconsOnly,
    objectLevelPermissions,
    t,
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
              <img alt="bsport logo" height={40} src={logo || LOGO_ASSET} />
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
                    className={classNames(classes.easeRotation, {
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
      <VersionVisualizer />
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
}));

export default ResponsiveDrawer;
