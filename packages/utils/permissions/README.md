# Permissions

This package provides utilities to check permissions and access based on injected data.

## Installation

Add the package as a dependency in your `package.json` file:

```jsonc
{
  "dependencies": {
    "@bsport/permissions": "workspace:*",
    // other dependencies...
  },
}
```

## How to use

### `checkHasPermission`

This util allows to check whether a Role has the permission or the object level permission to perform an action, that is represented by a path. You can create two hooks to inject by default the data retrieved from the store.

```tsx
// #src/utils/role-permissions.ts
import {
  type DeepKeys,
  type WithSignature,
  checkHasPermission,
} from "@bsport/permissions";
import {
  type CompanyRolePermissions,
  type ObjectLevelPermissions,
  dataAccessLayer,
} from "@bsport/sm-backbone";

type Permissions = Omit<CompanyRolePermissions, "restrictedPaths">;

export const useRolePermission = (path: DeepKeys<Permissions>) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<Permissions>>(
    userRole.permissions,
    path,
  );
};

export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<ObjectLevelPermissions>>(
    userRole.object_level_permissions,
    path,
  );
};
```

### `checkFeaturePermission`

This util allows to check whether a Feature identifier is in a list of allowed features.
You can create a hook to inject by default the data retrieved from the store.

```tsx
//#src/utils/feature-permissions.ts
import { type Environment, checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

export const useFeaturePermission = (
  identifier: number,
  enableInEnvMode?: Array<Environment>,
) => {
  const features = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission(features, identifier, enableInEnvMode);
};
```
