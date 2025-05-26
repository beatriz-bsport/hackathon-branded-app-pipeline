export type TableRowData = {
  id: number;
  name: string;
  hiddenForStaff: boolean;
  hiddenForUsers: boolean;
  limitedTime: boolean;
  numberOfProducts: number;
  price: string;
  /** @todo Unlock when link clashes with actions is fixed */
  // link: string;
};
