export type SportParentCategory = {
  id: number;
  name: string;
  slug: string;
};

export type SportCategory = {
  name: string;
  id: number;
  scs: SportParentCategory;
  language: string;
};

export type FetchSportCategoryParams = {
  company_id?: number;
};
