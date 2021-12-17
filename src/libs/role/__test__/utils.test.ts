import { checkRequiredPermissions } from '../utils';
import { Permission } from '../types';

const permissionA: Permission = {
  calendar: true,
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
  },
  restrictedPaths: [],
  navigationMenu: {
    search: true,
    dashboard: true,
    calendar: true,
    schedule: true,
    myClub: true,
    products: true,
    payments: true,
    marketing: true,
    digitalOffer: true,
    member: true,
    reporting: true,
    settings: true,
  },
};

describe('TEST OFFER UTILS', () => {
  it('Check requiredPermissions', () => {
    expect(checkRequiredPermissions('calendar', permissionA)).toBe(true);
    expect(checkRequiredPermissions('offer.create', permissionA)).toBe(false);
    expect(
      checkRequiredPermissions('offer.create,offer.delete', permissionA),
    ).toBe(false);
    expect(checkRequiredPermissions('member.retrieve', permissionA)).toBe(true);
    expect(
      checkRequiredPermissions('member.retrieve,member.search', permissionA),
    ).toBe(true);
    expect(
      checkRequiredPermissions(
        'member.retrieve,member.search,offer.edit',
        permissionA,
      ),
    ).toBe(false);
  });
});
