import { checkRequiredPermissions } from '../utils';
import { Permission } from '../types';

const permissionA: Permission = {
  appbarActions: false,
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
};

describe('TEST OFFER UTILS', () => {
  it('Check requiredPermissions', () => {
    expect(checkRequiredPermissions('appbarActions', permissionA)).toBe(false);
    expect(checkRequiredPermissions('calendar', permissionA)).toBe(true);
    expect(
      checkRequiredPermissions('appbarActions,calendar', permissionA),
    ).toBe(false);
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
