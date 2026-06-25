import type { MetaActivity } from "@bsport/api-book";

export type ServiceSelectionRow = MetaActivity & {
  serviceName: string;
  serviceType?: string;
  isActive?: boolean;
  onRowClick?: () => void;
};

export type ServiceSelectionLabels = {
  description: string;
  searchPlaceholder: string;
  loading: string;
  emptyTitle: string;
  emptySearchTitle?: string;
  serviceColumn: string;
  serviceTypeColumn?: string;
  livestreamTooltip: string;
};

export type AddServiceButtonConfig = {
  label: string;
  onClick: () => void;
};

export type ServiceSelectionContext = {
  searchQuery: string;
};
