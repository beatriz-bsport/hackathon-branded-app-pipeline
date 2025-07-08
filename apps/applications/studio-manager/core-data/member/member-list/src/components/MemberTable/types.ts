import type { MemberPermissions } from "#src/hooks/useMemberPermissions";

export type TableRequiredPermissions = Omit<
  MemberPermissions,
  "importLeads" | "search"
>;

export type TableRowData = {
  balance: number;
  email: string;
  id: number;
  initials: string;
  joinDate: string;
  name: string;
  photo?: string;
};

type MemberHandler = ({
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
