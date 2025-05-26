import {
  Indicator,
  type NavigationMenuElement,
} from "@bsport/kaizen-primitive-core";

import urls from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type MenuSet = "default" | "settings";

export const useNavigationElements = ({
  menuSet = "default",
}: {
  menuSet?: MenuSet;
}): NavigationMenuElement[] => {
  const { t } = useTranslation("default");

  if (menuSet === "settings") {
    return [
      {
        type: "group",
        label: t("menus.settings.title"),
      },
      {
        id: "general",
        label: t("menus.settings.general"),
      },
      {
        id: "marketplace",
        label: t("menus.settings.marketplace"),
      },
      {
        id: "widgets",
        label: t("menus.settings.widgets"),
      },
      {
        id: "permissions",
        label: t("menus.settings.permissions"),
      },
      {
        id: "personalization",
        label: t("menus.settings.personalization"),
      },
      {
        id: "teacherView",
        label: t("menus.settings.teacherView"),
      },
      {
        id: "memberForms",
        label: t("menus.settings.memberForms"),
      },
      {
        id: "livestreaming",
        label: t("menus.settings.livestreaming"),
      },
      {
        id: "transactionalNotifications",
        label: t("menus.settings.transactionalNotifications"),
      },
      {
        id: "payroll",
        label: t("menus.settings.payroll"),
      },
      {
        id: "paymentMethods",
        label: t("menus.settings.paymentMethods"),
      },
      {
        id: "paymentFacilities",
        label: t("menus.settings.paymentFacilities"),
      },
      {
        id: "billing",
        label: t("menus.settings.billing"),
      },
      {
        id: "company",
        label: t("menus.settings.company"),
      },
      {
        id: "waitlist",
        label: t("menus.settings.waitlist"),
      },
      {
        id: "webhook",
        label: t("menus.settings.webhook"),
      },
      {
        id: "partnership",
        label: t("menus.settings.partnership"),
      },
      {
        id: "activeCampaign",
        label: t("menus.settings.activeCampaign"),
      },
      {
        id: "referral",
        label: t("menus.settings.referral"),
      },
      {
        id: "bsportSubscription",
        label: t("menus.settings.bsportSubscription"),
      },
      {
        id: "temporaryPass",
        label: t("menus.settings.temporaryPass"),
      },
    ] as const;
  }

  /** @todo Add hrefs */
  return [
    {
      icon: "message-square-02",
      id: "inbox",
      label: t("menus.inbox"),
      endSlot: <Indicator color="default" position="top" size="sm" value={1} />,
      href: "/",
    },
    {
      icon: "bell-03",
      id: "notifications",
      label: t("menus.notifications"),
      endSlot: <Indicator color="default" position="top" size="sm" value={2} />,
    },
    {
      type: "divider",
    },
    {
      icon: "calendar",
      id: "calendar",
      label: t("menus.calendar"),
    },
    {
      icon: "clock",
      id: "schedule",
      label: t("menus.schedule"),
    },
    {
      icon: "log-in-03",
      id: "access-control",
      label: t("menus.accessControl"),
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
          href: urls.activity,
        },
        { id: "workshops", label: t("menus.classes.workshops") },
        { id: "appointments", label: t("menus.classes.appointments") },
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
        { id: "passes", label: t("menus.memberships.passes") },
        { id: "subscriptions", label: t("menus.memberships.subscriptions") },
      ],
    },
    {
      icon: "shopping-cart-03",
      id: "products",
      label: t("menus.products.title"),
      subItems: [
        { id: "webshop", label: t("menus.products.webshop") },
        { id: "packs", label: t("menus.products.packs"), href: urls.pack },
        {
          id: "gift-cards",
          label: t("menus.products.giftcards"),
          href: urls.giftcard,
        },
        { id: "videos", label: t("menus.products.videosAndEbooks") },
        { id: "orders", label: t("menus.products.orders"), href: urls.order },
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
        },
        {
          id: "email-template",
          label: t("menus.marketing.emailTemplates"),
          href: urls.emailTemplate,
        },
        {
          id: "custom-forms",
          label: t("menus.marketing.customForms"),
          href: urls.customForm,
        },
        {
          id: "smartlists",
          label: t("menus.marketing.smartlists"),
          href: urls.smartlist,
        },
        { id: "audience", label: t("menus.marketing.audience") },
        { id: "promotions", label: t("menus.marketing.promotions") },
      ],
    },
    {
      type: "divider",
    },
    {
      icon: "bar-line-chart",
      id: "dashboard",
      label: t("menus.dashboard"),
    },
    {
      icon: "bar-chart-10",
      id: "reporting",
      label: t("menus.reporting"),
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
          href: urls.invoice,
        },
        { id: "payouts", label: t("menus.finance.payouts") },
        { id: "direct-debits", label: t("menus.finance.directDebits") },
        { id: "expenses", label: t("menus.finance.expenses") },
        { id: "payroll", label: t("menus.finance.payroll") },
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
          href: urls.member,
        },
        { id: "forms", label: t("menus.membersHub.forms") },
        { id: "tags", label: t("menus.membersHub.tags") },
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
          href: urls.teacher,
        },
        { id: "establishments", label: t("menus.myStudio.establishments") },
      ],
    },
  ] as const;
};
