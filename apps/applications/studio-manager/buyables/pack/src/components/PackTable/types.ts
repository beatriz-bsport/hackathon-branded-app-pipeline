export type TableRowData = {
  id: number;
  name: string;
  hiddenForStaff: boolean;
  hiddenForUsers: boolean;
  limitedTime: boolean;
  numberOfProducts: number;
  price: number;
  link: string | undefined;
  onRowClick: (() => void | Promise<void>) | undefined;
};
