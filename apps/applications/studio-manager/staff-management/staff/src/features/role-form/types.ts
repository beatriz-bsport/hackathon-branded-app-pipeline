import type { z } from "zod";

import type { CompanyRolePermissions } from "@bsport/api-staff-management";

export type RoleFormData = {
  name: string;
  description: string;
  starterRoleId: string;
  permissions: CompanyRolePermissions;
};

export type RoleFormSchema = z.ZodType<RoleFormData>;
