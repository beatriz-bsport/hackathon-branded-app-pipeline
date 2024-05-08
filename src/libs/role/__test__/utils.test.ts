// @ts-nocheck
import {
  checkRequiredPermissions,
  checkRequiredPermissionsForPath,
  deepMerge,
  setAllValuesInObject,
} from '../utils';
import { RolePermission } from '../types';

const permissionA: RolePermission = {
  appbarButtons: {
    ledger: true,
    notificationCenter: true,
    communicationAlerts: true,
  },
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
      coachUserspace: true,
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
      mobilePersonalization: true,
    },
  },
};

describe('TEST check on permissions', () => {
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

describe('TEST check on path', () => {
  it('Check requiredPath', () => {
    expect(checkRequiredPermissionsForPath('/calendar', permissionA)).toBe(
      true,
    );
    expect(checkRequiredPermissionsForPath('/search', permissionA)).toBe(true);
    expect(checkRequiredPermissionsForPath('/vod/video', permissionA)).toBe(
      false,
    );
    expect(
      checkRequiredPermissionsForPath('/email-template', permissionA),
    ).toBe(true);

    expect(checkRequiredPermissionsForPath('/search', permissionA)).toBe(true);
    // Should send true if the url is not known
    expect(checkRequiredPermissionsForPath('/toto', permissionA)).toBe(true);
    // Should send true if the permission array is empty
    expect(checkRequiredPermissionsForPath('/empty', permissionA)).toBe(true);
  });
});

describe('TEST setAllValuesInObject', () => {
  it('Should set all value in the deeply nested object doesnt touch array', () => {
    expect(
      setAllValuesInObject({ value: true, order: false, name: '' }, false),
    ).toStrictEqual({
      value: false,
      order: false,
      name: false,
    });
  });

  const values = setAllValuesInObject(permissionA, false);

  it('Should set all value in the deeply nested object doesnt touch array', () => {
    expect(values.restrictedPaths).toStrictEqual([]);
  });

  it('Should set all value in the objec', () => {
    expect(values).toStrictEqual({
      appbarButtons: {
        ledger: false,
        notificationCenter: false,
        communicationAlerts: false,
      },
      navigation: false,
      checkin: false,
      offer: {
        create: false,
        delete: false,
        edit: false,
      },
      member: {
        retrieve: false,
        search: false,
        create: false,
      },
      restrictedPaths: [],
      navigationMenu: {
        dashboard: false,
        calendar: false,
        schedule: false,
        myClub: {
          activities: false,
          workshops: false,
          appointments: false,
          teachers: false,
          establishments: false,
          programs: false,
        },
        products: {
          paymentPack: false,
          privatePass: false,
          shop: false,
          packs: false,
          giftcards: false,
          promotions: false,
          contracts: false,
        },
        payments: {
          billings: false,
          directDebits: false,
          teachers: false,
          orders: false,
          expenses: false,
          installments: false,
          clockIn: {
            selfClockIn: false,
            clockInForOther: false,
            canAccessHistory: false,
          },
        },
        marketing: {
          templates: false,
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
        member: false,
        reporting: false,
        settings: {
          generals: false,
          marketplace: false,
          widgets: false,
          staffs: false,
          personalization: false,
          memberForms: false,
          liveStreaming: false,
          coachUserspace: false,
          transactionnalEmail: false,
          teacherPayrollRules: false,
          paymentMethods: false,
          company: false,
          billing: false,
          waitingList: false,
          webShop: false,
          webHook: false,
          partnership: false,
          quickBooks: false,
          activeCampaign: false,
          subscription: false,
          mobilePersonalization: false,
        },
      },
    });
  });
});

describe('TEST deepMerge', () => {
  it('Should merge on the simpliest case', () => {
    expect(deepMerge({}, permissionA)).toStrictEqual(permissionA);
  });

  it('Should merge on the simple object', () => {
    expect(
      deepMerge(
        {
          member: {
            retrieve: true,
            search: true,
            create: true,
          },
        },
        permissionA,
      ),
    ).toStrictEqual({
      ...permissionA,
      ...{
        member: {
          retrieve: true,
          search: true,
          create: true,
        },
      },
    });
  });

  it('Should merge on the nested object', () => {
    expect(
      deepMerge(
        {
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
          },
        },
        permissionA,
      ),
    ).toStrictEqual(permissionA);
  });

  it('Should merge base on the value of the boolean case true', () => {
    expect(
      deepMerge(
        {
          navigationMenu: {
            dashboard: true,
            calendar: true,
            schedule: true,
            myClub: true,
          },
        },
        permissionA,
      ),
    ).toStrictEqual(permissionA);
  });
  it('Should merge base on the value of the boolean case false', () => {
    expect(
      deepMerge(
        {
          navigationMenu: {
            dashboard: true,
            calendar: true,
            schedule: true,
            myClub: false,
          },
        },
        permissionA,
      ),
    ).toStrictEqual({
      appbarButtons: {
        ledger: true,
        notificationCenter: true,
        communicationAlerts: true,
      },
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
          activities: false,
          workshops: false,
          appointments: false,
          teachers: false,
          establishments: false,
          programs: false,
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
          coachUserspace: true,
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
          mobilePersonalization: true,
        },
      },
    });
  });
});
