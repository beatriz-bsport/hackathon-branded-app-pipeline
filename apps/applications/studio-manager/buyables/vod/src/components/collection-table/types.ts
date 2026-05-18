export type CollectionRowData = {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  videosCount: number;
  onRowClick: (() => void) | undefined;
  onEdit: (() => void) | undefined;
  onDelete: (() => void) | undefined;
};
