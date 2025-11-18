import type { MemberPermissions } from "#src/hooks/useMemberPermissions";

export type TableRequiredPermissions = Omit<
  MemberPermissions,
  "importLeads" | "search"
>;

/**
 * Shared transformed member data used by both Table and List views.
 * Computed once in the parent MemberTable component to avoid duplication.
 */
export type MemberViewData = {
  id: number;
  name: string;
  email: string;
  photo?: string;
  initials: string;
  balance: number;
  joinDate: string;
  link?: string;
};

export type TableRowData = MemberViewData;

export type MemberHandler = ({
  memberId,
  memberName,
}: {
  memberId: number;
  memberName: string;
}) => void;

export type TableColumnsParams = {
  handleArchive?: MemberHandler;
  handleRestore?: MemberHandler;
  mode?: "archived" | "active";
  permissions: TableRequiredPermissions;
};
