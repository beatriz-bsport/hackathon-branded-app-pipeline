export type StaffRowData = {
  id: number;
  name: string;
  email: string;
  roleName: string | null;
  roleIsDefault: boolean;
  isOwner: boolean;
  billingGroupName: string | null;
  assignedTeachers: string[];
  commission: string;
  onDelete?: () => void;
};
