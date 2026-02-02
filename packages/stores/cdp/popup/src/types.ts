export type Popup = {
  custom_popup_id: number;
  date_created: string; // ISO datetime
  link: string;
  name: string;
  smartlist_id?: number;
  smartlist_name?: string;
  smartlist_popup_id?: number;
};

export type CreateSmartlistPopupParams = {
  image: File;
  name: string;
  link: string;
  smartlist_id: number;
};
