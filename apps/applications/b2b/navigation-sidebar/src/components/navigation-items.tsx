import {
  Indicator,
  type NavigationMenuItem,
} from "@bsport/kaizen-primitive-core";
import { TFunction } from "#src/utils/i18n";

export const getNavigationItems = ({
  t,
}: {
  t: TFunction;
}): NavigationMenuItem[][] => {
  return [
    [
      {
        icon: "message-square-02",
        id: "inbox",
        label: t("menus.inbox"),
        rightSlot: (
          <Indicator color="default" position="top" size="lg" value={1} />
        ),
      },
      {
        icon: "bell-03",
        id: "notifications",
        label: t("menus.notifications"),
        rightSlot: (
          <Indicator color="default" position="top" size="lg" value={2} />
        ),
      },
    ],
    [
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
    ],
    [
      {
        icon: "award-03",
        id: "classes",
        label: t("menus.classes.title"),
        subItems: [
          { id: "activities", label: t("menus.classes.activities") },
          { id: "workshops", label: t("menus.classes.workshops") },
          { id: "appointments", label: t("menus.classes.appointments") },
        ],
      },
    ],
    [
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
          { id: "packs", label: t("menus.products.packs") },
          { id: "gift-cards", label: t("menus.products.giftcards") },
          { id: "videos", label: t("menus.products.videos") },
          { id: "orders", label: t("menus.products.orders") },
        ],
      },
    ],
    [
      {
        icon: "announcement-01",
        id: "marketing",
        label: t("menus.marketing.title"),
        subItems: [
          {
            id: "member-notifications",
            label: t("menus.marketing.memberNotifications"),
          },
          { id: "email-templates", label: t("menus.marketing.emailTemplates") },
          { id: "smartlists", label: t("menus.marketing.smartlists") },
          { id: "audience", label: t("menus.marketing.audience") },
          { id: "promotions", label: t("menus.marketing.promotions") },
        ],
      },
    ],
    [
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
    ],
    [
      {
        icon: "bank-note-03",
        id: "finance",
        label: t("menus.finance.title"),
        subItems: [
          { id: "invoices", label: t("menus.finance.invoices") },
          { id: "payouts", label: t("menus.finance.payouts") },
          { id: "direct-debits", label: t("menus.finance.directDebits") },
          { id: "expenses", label: t("menus.finance.expenses") },
          { id: "payroll", label: t("menus.finance.payroll") },
        ],
      },
    ],
    [
      {
        icon: "user-01",
        id: "members-hub",
        label: t("menus.membersHub.title"),
        subItems: [
          { id: "members", label: t("menus.membersHub.members") },
          { id: "forms", label: t("menus.membersHub.forms") },
          { id: "tags", label: t("menus.membersHub.tags") },
        ],
      },
      {
        icon: "building-02",
        id: "my-studio",
        label: t("menus.myStudio.title"),
        subItems: [
          { id: "teachers", label: t("menus.myStudio.teachers") },
          { id: "establishments", label: t("menus.myStudio.establishments") },
        ],
      },
    ],
  ];
};
