export type TableRowData = {
  id: number;
  name: string;
  hiddenToStaff: boolean;
  unlisted: boolean;
  limitedTime: boolean;
  numberOfProducts: number;
  price: number;
  link: string | undefined;
  onRowClick: (() => void | Promise<void>) | undefined;
};
