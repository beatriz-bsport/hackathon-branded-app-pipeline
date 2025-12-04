export type TableRowData = {
  id: string;
  issueDate: string;
  issueDateShort: string;
  price: string;
  member: {
    id: number;
    avatar?: string;
    initials: string;
    name: string;
  };
  passIds: number[];
  appointmentPassIds: number[];
  webshopItemIds: number[];
};
