import type { z } from "zod";

export type RoleFormData = {
  name: string;
  description: string;
  starterRoleId: string;
};

export type RoleFormSchema = z.ZodType<RoleFormData>;
