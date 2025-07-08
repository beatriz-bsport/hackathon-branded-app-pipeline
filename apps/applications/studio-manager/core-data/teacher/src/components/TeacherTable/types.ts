export type TableRequiredPermissions = {
  create: boolean;
  edit: boolean;
  delete: boolean;
};

export type TableRowData = {
  email: string;
  id: number;
  iconSrc?: string;
  initials: string;
  name: string;
  phone: string;
};

export type TeacherHandler = ({
  teacherId,
  teacherName,
}: {
  teacherId: number;
  teacherName: string;
}) => void;

export type TableColumnsParams = {
  handleArchive?: TeacherHandler;
  handleRestore?: TeacherHandler;
  mode: "archived" | "active";
  permissions: TableRequiredPermissions;
};
