import { Button, Divider, Indicator, NavigationMenu } from '@bsport/kaizen-primitive-core';
import { Fragment } from 'react/jsx-runtime';

function NavigationSidebar() {
  const categories: Parameters<typeof NavigationMenu>['0']['items'][] = [
    [
      {
        icon: 'message-square-02',
        id: 'inbox',
        label: 'Inbox',
        rightSlot: <Indicator
          color="default"
          position="top"
          size="lg"
          value={1}
        />,
      },
      {
        icon: 'bell-03',
        id: 'notifications',
        label: 'Notifications',
        rightSlot: <Indicator
          color="default"
          position="top"
          size="lg"
          value={2}
        />,
      },
    ],
    [
      {
        icon: 'calendar',
        id: 'calendar',
        label: 'Calendar',
      },
      {
        icon: 'clock',
        id: 'schedule',
        label: 'Schedule',
      },
      {
        icon: 'log-in-03',
        id: 'access-control',
        label: 'Access Control',
      },
    ],
    [
      {
        icon: 'award-03',
        id: 'classes',
        label: 'Classes',
        subItems: [
          { id: 'activities', label: 'Activities' },
          { id: 'workshops', label: 'Workshops' },
          { id: 'appointments', label: 'Appointments' },
        ]
      },
    ],
    [
      {
        icon: 'ticket-01',
        id: 'memberships',
        label: 'Memberships',
        subItems: [
          { id: 'passes', label: 'Passes' },
          { id: 'subscriptions', label: 'Subscriptions' },
        ]
      },
      {
        icon: 'shopping-cart-03',
        id: 'products',
        label: 'Products',
        subItems: [
          { id: 'webshop', label: 'Webshop' },
          { id: 'packs', label: 'Packs' },
          { id: 'gift-cards', label: 'Gift cards' },
          { id: 'videos', label: 'Videos & ebooks' },
          { id: 'orders', label: 'Orders' },
        ]
      },
    ],
    [
      {
        icon: 'announcement-01',
        id: 'marketing',
        label: 'Marketing',
        subItems: [
          { id: 'member-notifications', label: 'Member notifications' },
          { id: 'templates', label: 'Email templates' },
          { id: 'smartlists', label: 'Smartlists' },
          { id: 'audience', label: 'Audience' },
          { id: 'promotions', label: 'Promotions' },
        ]
      },
    ],
    [
      {
        icon: 'bar-line-chart',
        id: 'dashboard',
        label: 'Dashboard / Overview',
      },
      {
        icon: 'bar-chart-10',
        id: 'reporting',
        label: 'Reporting',
      },
    ],
    [
      {
        icon: 'bank-note-03',
        id: 'finance',
        label: 'Finance',
        subItems: [
          { id: 'invoices', label: 'Invoices' },
          { id: 'payouts', label: 'Payouts' },
          { id: 'direct-debits', label: 'Direct debits' },
          { id: 'expenses', label: 'Expenses' },
          { id: 'payroll', label: 'Payroll' },
        ]
      },
    ],
    [
      {
        icon: 'user-01',
        id: 'members-hub',
        label: 'Members hub',
        subItems: [
          { id: 'members', label: 'Members' },
          { id: 'forms', label: 'Forms' },
          { id: 'tags', label: 'Tags' },
        ]
      },
      {
        icon: 'building-02',
        id: 'my-studio',
        label: 'My studio',
        subItems: [
          { id: 'teachers', label: 'Teachers' },
          { id: 'establishments', label: 'Establishments' },
        ]
      },
    ]
  ];

  return (
    <div className="min-h-screen w-[240px] bg-surface-page-navigation pt-md pb-md shrink-0 flex flex-col justify-between">
      <div>
        {/* TODO: Add separators to NavigationMenu */}
        {/* TODO: Add hrefs */}
        {/* TODO: i18n */}
        {categories.map((items, index) => (
          <Fragment key={`category-${index}`}>
            <NavigationMenu
              className="p-xs"
              items={items}
            />
            {index < categories.length - 1 ? <Divider className="border-stroke-thin" /> : null}
          </Fragment>
        ))}
      </div>
      {/* TODO: Replace with Card when styles are fixed */}
      <div className="p-xs mt-md mx-xs flex flex-col gap-2xs bg-surface-default-elevated border-stroke-thin border-stroke-default rounded-md">
        <Button className="justify-between" label="Beta feedback" intent="flat" size="md" color="main" iconRight="link-external-02" fullWidth />
        <Button className="justify-between" label="Go back to old UI" intent="flat" size="md" color="default" iconRight="arrow-right" fullWidth />
      </div>
    </div>
  );
}

export default NavigationSidebar;
