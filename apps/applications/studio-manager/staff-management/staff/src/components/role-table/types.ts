export type RoleRowData = {
  id: number;
  name: string;
  editable: boolean;
  isDefault: boolean;
  permissions: RolePermissionSummary[];
  staffAssignedCount: number;
};

export type RolePermissionSummary = {
  key: RolePermissionGroupKey;
  count: number;
};

export type RolePermissionGroupKey =
  | "navigationMenu"
  | "accessMonitoring"
  | "appBarButtons"
  | "generalAccess"
  | "billing"
  | "export"
  | "management"
  | "memberManagement"
  | "planning"
  | "productManagement"
  | "reports"
  | "reservationManagement"
  | "sessionManagement";
