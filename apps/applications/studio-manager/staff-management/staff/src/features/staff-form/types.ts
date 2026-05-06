import type { z } from "zod";

export type StaffFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  commissionPercentage: number;
  role: string;
};

export type StaffFormSchema = z.ZodType<StaffFormData>;
