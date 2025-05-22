export type Smartlist = {
  id: number;
  company: number;
  description: string;
  has_active_communication_group_configs: boolean;
  member_base: number;
  name: string;
};

export type SmartlistSearchResult = {
  results: Smartlist[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type CreateSmartlistParams = {
  name: string;
  description: string;
  company: number;
};

export type GeneralSmartlistParams = {
  id: number;
};

export type EditSmartlistParams = GeneralSmartlistParams & {
  name?: string;
  description?: string;
};
