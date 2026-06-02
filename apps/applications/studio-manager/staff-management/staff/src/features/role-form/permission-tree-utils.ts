import type { CompanyRolePermissions } from "@bsport/api-staff-management";

export interface PermissionTree {
  [key: string]: PermissionValue;
}
export type PermissionValue = boolean | PermissionTree | undefined;

export type CheckboxValue = "checked" | "unchecked" | "indeterminate";

export const isPermissionTree = (
  value: PermissionValue,
): value is PermissionTree => typeof value === "object" && value !== null;

export const getBooleanLeaves = (value: PermissionValue): boolean[] => {
  if (typeof value === "boolean") {
    return [value];
  }

  if (!isPermissionTree(value)) {
    return [];
  }

  return Object.values(value).flatMap((childValue) =>
    getBooleanLeaves(childValue),
  );
};

export const getCheckboxValue = (value: PermissionValue): CheckboxValue => {
  const leaves = getBooleanLeaves(value);

  if (leaves.length === 0 || leaves.every((leaf) => !leaf)) {
    return "unchecked";
  }

  if (leaves.every(Boolean)) {
    return "checked";
  }

  return "indeterminate";
};

export const setBooleanLeaves = (
  value: PermissionValue,
  checked: boolean,
): PermissionValue => {
  if (typeof value === "boolean") {
    return checked;
  }

  if (!isPermissionTree(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, childValue]) => [
      key,
      setBooleanLeaves(childValue, checked),
    ]),
  );
};

export const getValueByPath = (
  obj: PermissionTree,
  path: string,
): PermissionValue =>
  path
    .split(".")
    .reduce<PermissionValue>(
      (current, key) => (isPermissionTree(current) ? current[key] : undefined),
      obj,
    );

export const setValueByPath = (
  obj: PermissionTree,
  path: string,
  value: PermissionValue,
): PermissionTree => {
  const [head, ...rest] = path.split(".");
  return {
    ...obj,
    [head]:
      rest.length === 0
        ? value
        : setValueByPath(obj[head] as PermissionTree, rest.join("."), value),
  };
};

export const hasSelectedPermission = (
  permissions: CompanyRolePermissions,
): boolean =>
  [
    ...getBooleanLeaves(
      permissions.navigationMenu as unknown as PermissionValue,
    ),
    ...getBooleanLeaves(
      permissions.appbarButtons as unknown as PermissionValue,
    ),
  ].some(Boolean);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const mergeWithDefaults = (
  defaults: unknown,
  overrides: unknown,
): unknown => {
  if (!isRecord(defaults) || !isRecord(overrides)) {
    return overrides ?? defaults;
  }

  return Object.fromEntries(
    [...new Set([...Object.keys(defaults), ...Object.keys(overrides)])].map(
      (key) => [key, mergeWithDefaults(defaults[key], overrides[key])],
    ),
  );
};
