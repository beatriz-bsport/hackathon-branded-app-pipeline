import { checkRequiredPermissions } from '../utils';
import { Permission } from '../types';

const permissionA: Permission = {
  navigation: false,
  checkin: false,
  offer: {
    create: false,
    delete: false,
    edit: false,
  },
  member: {
    retrieve: true,
    search: true,
    create: false,
  },
  restrictedPaths: [],
  navigationMenu: {
    dashboard: true,
    calendar: true,
    schedule: true,
    myClub: {
      activities: true,
      workshops: true,
      appointments: true,
      teachers: true,
      establishments: true,
      programs: true,
    },
    products: {
      paymentPack: true,
      privatePass: true,
      shop: true,
      packs: true,
      giftcards: true,
      promotions: true,
      contracts: true,
    },
    payments: {
      billings: true,
      directDebits: true,
      teachers: true,
      orders: true,
      expenses: true,
      installments: true,
      clockIn: {
        selfClockIn: true,
        clockInForOther: false,
        canAccessHistory: false,
      },
    },
    marketing: {
      templates: true,
      customForms: false,
      smartlists: false,
      notifications: false,
      tags: false,
      strategies: false,
    },
    digitalOffer: {
      videos: false,
      playlists: false,
    },
    member: true,
    reporting: true,
    settings: {
      generals: true,
      marketplace: true,
      widgets: true,
      staffs: true,
      personalization: true,
      memberForms: true,
      liveStreaming: true,
      transactionnalEmail: true,
      teacherPayrollRules: true,
      paymentMethods: true,
      company: true,
      billing: true,
      waitingList: true,
      webShop: true,
      webHook: true,
      partnership: true,
      quickBooks: true,
      activeCampaign: true,
      subscription: true,
    },
  },
};

describe('TEST OFFER UTILS', () => {
  it('Check requiredPermissions', () => {
    expect(
      checkRequiredPermissions('navigationMenu.calendar', permissionA),
    ).toBe(true);
    expect(checkRequiredPermissions('offer.create', permissionA)).toBe(false);
    expect(
      checkRequiredPermissions('offer.create,offer.delete', permissionA),
    ).toBe(false);
    expect(checkRequiredPermissions('member.retrieve', permissionA)).toBe(true);
    expect(
      checkRequiredPermissions('member.retrieve,member.search', permissionA),
    ).toBe(true);
    expect(
      checkRequiredPermissions('navigationMenu.digitalOffer', permissionA),
    ).toBe(false);
    expect(
      checkRequiredPermissions(
        'navigationMenu.digitalOffer.videos',
        permissionA,
      ),
    ).toBe(false);
    expect(
      checkRequiredPermissions(
        'navigationMenu.marketing.templates',
        permissionA,
      ),
    ).toBe(true);
    expect(
      checkRequiredPermissions('navigationMenu.marketing', permissionA),
    ).toBe(true);
    expect(
      checkRequiredPermissions(
        'member.retrieve,member.search,offer.edit',
        permissionA,
      ),
    ).toBe(false);
  });
});
