import { useMemo } from "react";

import type {
  NavigationMenuDivider,
  NavigationMenuGroup,
  NavigationMenuItem,
} from "@bsport/kaizen-primitive-core";
import { Badge, Indicator } from "@bsport/kaizen-primitive-core";
import {
  selectAllAlertsCount,
  useAlertingStore,
} from "@bsport/store-staff-management-alerting";

import { useTranslation } from "#src/utils/i18n";

import type { NavigationUrlItem, NavigationUrls } from "./navigation-urls";

export type MenuSet = "default" | "settings";

export type NavigationSidebarSubItem = Omit<NavigationMenuItem, "subItems"> &
  NavigationUrlItem & {
    onClick?: () => void;
  };

export type NavigationSidebarItem = NavigationMenuItem &
  Partial<NavigationUrlItem> & {
    subItems?: NavigationSidebarSubItem[];
    onClick?: () => void;
  };

export type NavigationElement =
  | NavigationSidebarItem
  | NavigationMenuGroup
  | NavigationMenuDivider;

export const useNavigationElements = ({
  menuSet = "default",
  navigationUrls,
  handleOpenTemporaryPasswordDialog,
  handleOpenNotificationsModal,
}: {
  menuSet?: MenuSet;
  navigationUrls: NavigationUrls;
  handleOpenTemporaryPasswordDialog: () => void;
  handleOpenNotificationsModal: () => void;
}) => {
  const { t } = useTranslation("default");

  const totalAlertsCount = useAlertingStore(selectAllAlertsCount);

  const navigationItems: Record<MenuSet, NavigationElement[]> = useMemo(() => {
    return {
      default: [
        {
          icon: "message-square-02",
          id: "inbox",
          label: t("menus.inbox"),
          // endSlot: (
          //   <Indicator color="default" position="top" size="sm" value={1} />
          // ),
          ...navigationUrls.inbox,
        },
        {
          icon: "bell-03",
          id: "notifications",
          label: t("menus.notifications"),
          onClick: handleOpenNotificationsModal,
          endSlot:
            totalAlertsCount > 0 ? (
              <Indicator
                color="critical"
                position="top"
                size="sm"
                value={totalAlertsCount}
              />
            ) : undefined,
        },
        {
          type: "divider",
        },
        {
          icon: "bar-line-chart",
          id: "dashboard",
          label: t("menus.dashboard"),
          ...navigationUrls.dashboard,
        },
        {
          icon: "calendar",
          id: "calendar",
          label: t("menus.calendar"),
          ...navigationUrls.calendar,
        },
        {
          icon: "clock",
          id: "schedule",
          label: t("menus.schedule"),
          ...navigationUrls.schedule,
        },
        {
          icon: "log-in-03",
          id: "access-control",
          label: t("menus.accessControl"),
          ...navigationUrls.accessMonitoring_monitor,
        },
        {
          type: "divider",
        },
        {
          icon: "award-03",
          id: "classes",
          label: t("menus.classes.title"),
          subItems: [
            {
              id: "activities",
              label: t("menus.classes.activities"),
              ...navigationUrls.activity,
            },
            {
              id: "workshops",
              label: t("menus.classes.workshops"),
              ...navigationUrls.workshop,
            },
            {
              id: "appointments",
              label: t("menus.classes.appointments"),
              ...navigationUrls.appointment,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          icon: "ticket-01",
          id: "memberships",
          label: t("menus.memberships.title"),
          subItems: [
            {
              id: "passes",
              label: t("menus.memberships.passes"),
              ...navigationUrls.pass,
            },
            {
              id: "appointment-passes",
              label: t("menus.memberships.appointmentPasses"),
              ...navigationUrls.appointmentPass,
            },
            {
              id: "subscriptions",
              label: t("menus.memberships.subscriptions"),
              ...navigationUrls.subscription,
            },
          ],
        },
        {
          icon: "shopping-cart-03",
          id: "products",
          label: t("menus.products.title"),
          subItems: [
            {
              id: "webshop",
              label: t("menus.products.webshop"),
              ...navigationUrls.webshopOld,
            },
            {
              id: "packs",
              label: t("menus.products.packs"),
              ...navigationUrls.pack,
            },
            {
              id: "gift-cards",
              label: t("menus.products.giftcards"),
              ...navigationUrls.giftcard,
            },
            {
              id: "videos",
              label: t("menus.products.videosAndEbooks"),
              ...navigationUrls.video,
            },
            {
              id: "orders",
              label: t("menus.products.orders"),
              ...navigationUrls.order,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          icon: "announcement-01",
          id: "marketing",
          label: t("menus.marketing.title"),
          subItems: [
            {
              id: "member-notifications",
              label: t("menus.marketing.memberNotifications"),
              ...navigationUrls.memberNotification,
            },
            {
              id: "email-template",
              label: t("menus.marketing.emailTemplates"),
              ...navigationUrls.emailTemplate,
            },
            {
              id: "smartlists",
              label: t("menus.marketing.smartlists"),
              ...navigationUrls.smartlist,
            },
            {
              id: "audience",
              label: t("menus.marketing.audience"),
              ...navigationUrls.audience,
            },
            {
              id: "promotions",
              label: t("menus.marketing.promotions"),
              ...navigationUrls.promotion,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          icon: "bar-chart-10",
          id: "analytics",
          label: t("menus.analytics.title"),
          endSlot: <Indicator size="sm" color="main" position="top" />,
          subItems: [
            {
              id: "insights",
              label: t("menus.analytics.insights"),
              ...navigationUrls.insights,
              endSlot: (
                <Badge
                  size="sm"
                  color="main"
                  text={t("common.new", { defaultValue: "New" })}
                />
              ),
            },
            {
              id: "reports",
              label: t("menus.analytics.reports"),
              ...navigationUrls.reporting,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          icon: "bank-note-03",
          id: "finance",
          label: t("menus.finance.title"),
          subItems: [
            {
              id: "invoices",
              label: t("menus.finance.invoices"),
              ...navigationUrls.invoice,
            },
            // { id: "payouts", label: t("menus.finance.payouts"), ...navigationUrls.payout }, // --> Not published
            {
              id: "direct-debits",
              label: t("menus.finance.directDebits"),
              ...navigationUrls.directDebit,
            },
            {
              id: "expenses",
              label: t("menus.finance.expenses"),
              ...navigationUrls.expense,
            },
            {
              id: "payroll",
              label: t("menus.finance.payroll"),
              ...navigationUrls.payroll,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          icon: "user-01",
          id: "members-hub",
          label: t("menus.membersHub.title"),
          subItems: [
            {
              id: "members",
              label: t("menus.membersHub.members"),
              ...navigationUrls.member,
            },
            {
              id: "forms",
              label: t("menus.membersHub.forms"),
              ...navigationUrls.customForm,
            },
            {
              id: "tags",
              label: t("menus.membersHub.tags"),
              ...navigationUrls.tag,
            },
          ],
        },
        {
          icon: "building-02",
          id: "my-studio",
          label: t("menus.myStudio.title"),
          subItems: [
            {
              id: "teachers",
              label: t("menus.myStudio.teachers"),
              ...navigationUrls.teacher,
            },
            {
              id: "establishments",
              label: t("menus.myStudio.establishments"),
              ...navigationUrls.establishment,
            },
          ],
        },
      ],
      settings: [
        {
          type: "group",
          label: t("menus.settings.title"),
        },
        {
          id: "general",
          label: t("menus.settings.general"),
          ...navigationUrls.settings_general,
        },
        {
          id: "marketplace",
          label: t("menus.settings.marketplace"),
          ...navigationUrls.settings_marketplace,
        },
        {
          id: "widgets",
          label: t("menus.settings.widgets"),
          ...navigationUrls.settings_widgets,
        },
        {
          id: "permissions",
          label: t("menus.settings.permissions"),
          ...navigationUrls.settings_permission,
        },
        {
          id: "personalization",
          label: t("menus.settings.personalization"),
          ...navigationUrls.settings_personalization,
        },
        {
          id: "teacherView",
          label: t("menus.settings.teacherView"),
          ...navigationUrls.settings_teacherView,
        },
        {
          id: "memberForms",
          label: t("menus.settings.memberForms"),
          ...navigationUrls.settings_memberForm,
        },
        {
          id: "livestreaming",
          label: t("menus.settings.livestreaming"),
          ...navigationUrls.settings_livestreaming,
        },
        {
          id: "transactionalNotifications",
          label: t("menus.settings.transactionalNotifications"),
          ...navigationUrls.settings_transactionalNotification,
        },
        {
          id: "payroll",
          label: t("menus.settings.payroll"),
          ...navigationUrls.settings_payroll,
        },
        {
          id: "paymentMethods",
          label: t("menus.settings.paymentMethods"),
          ...navigationUrls.settings_paymentMethod,
        },
        {
          id: "paymentFacilities",
          label: t("menus.settings.paymentFacilities"),
          ...navigationUrls.settings_paymentFacility,
        },
        {
          id: "billing",
          label: t("menus.settings.billing"),
          ...navigationUrls.settings_billing,
        },
        {
          id: "company",
          label: t("menus.settings.company"),
          ...navigationUrls.settings_company,
        },
        {
          id: "waitlist",
          label: t("menus.settings.waitlist"),
          ...navigationUrls.settings_waitlist,
        },
        {
          id: "webhook",
          label: t("menus.settings.webhook"),
          ...navigationUrls.settings_webhook,
        },
        {
          id: "partnership",
          label: t("menus.settings.partnership"),
          ...navigationUrls.settings_partnership,
        },
        {
          id: "activeCampaign",
          label: t("menus.settings.activeCampaign"),
          ...navigationUrls.settings_activeCampaign,
        },
        {
          id: "referral",
          label: t("menus.settings.referral"),
          ...navigationUrls.settings_referral,
        },
        {
          id: "bsportSubscription",
          label: t("menus.settings.bsportSubscription"),
          ...navigationUrls.settings_bsportSubscription,
        },
        {
          id: "temporaryPass",
          label: t("menus.settings.temporaryPassword"),
          onClick: handleOpenTemporaryPasswordDialog,
        },
      ],
    };
  }, [
    handleOpenTemporaryPasswordDialog,
    handleOpenNotificationsModal,
    navigationUrls,
    t,
    totalAlertsCount,
  ]);

  return navigationItems[menuSet];
};

export function isGroupElement(
  element: NavigationElement,
): element is NavigationMenuGroup {
  return "type" in element && element.type === "group";
}

export function isDividerElement(
  element: NavigationElement,
): element is NavigationMenuDivider {
  return "type" in element && element.type === "divider";
}

export function isItemElement(
  element: NavigationElement,
): element is NavigationSidebarItem {
  return "id" in element && "label" in element;
}
