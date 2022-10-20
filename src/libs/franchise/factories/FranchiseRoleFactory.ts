import faker from 'faker';

faker.locale = 'fr';

type FranchiseRole = {
  id: number;
  name: string;
  editable: boolean;
  identifier: number | null;
};
type Franchisee = { id: number; name: string };

const FRANCHISE_ADMIN_ROLE = 4;

export function FranchiseRoleFactory(id: number): FranchiseRole {
  return {
    id,
    name: id === FRANCHISE_ADMIN_ROLE ? 'ADMIN' : `Custom Role ${id}`,
    editable: id !== FRANCHISE_ADMIN_ROLE,
    identifier: id === FRANCHISE_ADMIN_ROLE ? FRANCHISE_ADMIN_ROLE : null,
  };
}

export function FranchiseRolesFactory(length: number): Array<FranchiseRole> {
  const res = new Array(length).fill(0);
  return res.map((value, index) => FranchiseRoleFactory(index + 1));
}

export function FranchiseeFactory(id: number): Franchisee {
  return {
    id,
    name: `Company ${id}`,
  };
}

export function FranchiseesFactory(length: number): Array<Franchisee> {
  const res = new Array(length).fill(0);
  return res.map((value, index) => FranchiseeFactory(index));
}
